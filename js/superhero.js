// hero-details.js
import { createApiUrl, fetchData, createNoDetailsMessage } from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const superheroId = urlParams.get('id');

  fetchSuperheroDetails(superheroId);

  const allTabsHead = document.querySelectorAll(
    '.app-body-tabs-head .tab-head-single'
  );
  const allTabsBody = document.querySelectorAll(
    '.app-body-tabs-body .tab-body-single'
  );
  let activeTab = 1;

  const init = () => {
    showActiveTabBody();
    showActiveTabHead();
  };

  const showActiveTabHead = () => {
    hideAllTabHead();
    allTabsHead[activeTab - 1].classList.add('active-tab');
  };

  const showActiveTabBody = () => {
    hideAllTabBody();
    allTabsBody[activeTab - 1].classList.add('show-tab');
  };

  const hideAllTabHead = () => {
    allTabsHead.forEach((singleTabHead) =>
      singleTabHead.classList.remove('active-tab')
    );
  };

  const hideAllTabBody = () => {
    allTabsBody.forEach((singleTabBody) =>
      singleTabBody.classList.remove('show-tab')
    );
  };

  allTabsHead.forEach((tabHead, index) => {
    tabHead.addEventListener('click', () => {
      activeTab = index + 1;
      showActiveTabHead();
      showActiveTabBody();
    });
  });

  init();

  async function fetchSuperheroDetails(superheroId) {
    try {
      const apiUrl = createApiUrl(`characters/${superheroId}`, '');
      const data = await fetchData(apiUrl);
      // Check if the response contains results
      if (data.length > 0) {
        const superhero = data[0];
        renderSuperheroDetails(superhero);
      } else {
        console.error('No superhero details found.');
      }
    } catch (error) {
      console.error('Error fetching superheroes:', error);
    }
  }
});

function renderSuperheroDetails(superhero) {
  const superheroDetailsContainer = document.getElementById(
    'superheroDetailsContainer'
  );
  const superheroBodyContainer = document.querySelector(
    '.app-body-content-list .name'
  );

  superheroDetailsContainer.innerHTML = '';
  superheroBodyContainer.textContent = '';

  if (
    superhero.thumbnail &&
    superhero.thumbnail.path &&
    superhero.thumbnail.extension
  ) {
    const thumbnailElement = document.createElement('img');
    thumbnailElement.src = `${superhero.thumbnail.path}.${superhero.thumbnail.extension}`;
    thumbnailElement.alt = superhero.name;
    superheroDetailsContainer.appendChild(thumbnailElement);
  } else {
    console.error('Thumbnail information missing or in unexpected format.');
  }

  superheroBodyContainer.textContent = superhero.name;
  renderTabDetails(superhero);
}

function renderTabDetails(superhero) {
  const tabHeads = [
    { id: 1, name: 'Comics', data: superhero.comics },
    { id: 2, name: 'Events', data: superhero.events },
    { id: 3, name: 'Series', data: superhero.series },
    { id: 4, name: 'Stories', data: superhero.stories },
  ];

  tabHeads.forEach((tabHead) => {
    const tabBodyList = document.querySelector(
      `.app-body-tabs-body .tab-body-single.${tabHead.name}`
    );

    if (tabBodyList) {
      if (tabHead.data && tabHead.data.available > 0) {
        tabHead.data.items.forEach((item, index) => {
          const listItem = document.createElement('li');
          const textContentDiv = document.createElement('div');
          textContentDiv.classList.add('custom-list-item');
          const serialNumberSpan = document.createElement('span');
          serialNumberSpan.textContent = index + 1;
          serialNumberSpan.classList.add('serial-number');
          textContentDiv.appendChild(serialNumberSpan);

          const detailsDiv = document.createElement('div');
          const nameSpan = document.createElement('span');
          nameSpan.textContent = item.name;
          detailsDiv.appendChild(nameSpan);

          const resourceUrlSpan = document.createElement('span');
          resourceUrlSpan.textContent = item.resourceURI;
          detailsDiv.appendChild(resourceUrlSpan);

          textContentDiv.appendChild(detailsDiv);
          listItem.appendChild(textContentDiv);
          tabBodyList.appendChild(listItem);
        });
      } else {
        tabBodyList.appendChild(createNoDetailsMessage());
      }
    }
  });
}
