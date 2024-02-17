// common.js
const publicKey = '0b54059ef6b83acf1d889e385a176291';
const privateKey = 'c05e019c17e8ddf3b8a9bf95d4b02849cd656fc2';

const searchInput = document.querySelector('.form-control');
const searchList = document.getElementById('search-list');
const searchListLimit = 30;

function generateHash(ts) {
  return CryptoJS.MD5(ts + privateKey + publicKey).toString();
}

function createApiUrl(endpoint, params) {
  const ts = new Date().getTime();
  const hash = generateHash(ts);
  return `https://gateway.marvel.com/v1/public/${endpoint}?ts=${ts}&apikey=${publicKey}&hash=${hash}&${params}`;
}

// Add fetchData function for reusability
async function fetchData(apiUrl) {
  const response = await fetch(apiUrl);
  const responseData = await response.json();

  if (!response.ok) {
    console.error(
      'Error fetching superheroes:',
      response.status,
      response.statusText
    );
    // Log the actual response data for further investigation
    const responseData = await response.json();
    console.error('Response data:', responseData);
  } else {
    // return response
    return responseData.data.results;
  }
}

function redirectToSuperheroDetails(superheroId) {
  window.location.href = `superhero.html?id=${superheroId}`;
}

function getFavoritesFromLocalStorage() {
  return JSON.parse(localStorage.getItem('favoriteSuperheroes')) || [];
}

function createNoDetailsMessage() {
  const message = document.createElement('p');
  message.textContent = 'No details available.';
  return message;
}

searchInput.addEventListener('input', () => {
  const query = searchInput.value;
  fetchSuperheroes(query, searchListLimit);
});

async function fetchSuperheroes(query, limit) {
  try {
    const apiUrl = createApiUrl(
      'characters',
      `nameStartsWith=${query}&limit=${limit}`
    );

    const response = await fetch(apiUrl);

    if (response.ok) {
      const data = await response.json();

      if (data.data.results.length > 0) {
        searchList.innerHTML = '';
        searchSuperheroes(data.data.results);
      } else {
        searchList.innerHTML = '';
        const noResultsMessage = document.createElement('div');
        noResultsMessage.textContent = 'No superheroes found.';
        noResultsMessage.classList.add('search-item');
        searchList.appendChild(noResultsMessage);
      }
    } else {
      searchList.innerHTML = '';
    }
  } catch (error) {
    searchList.innerHTML = '';
    console.error('Error fetching superheroes:', error);
  }
}

function searchSuperheroes(superheroes) {
  searchList.innerHTML = '';

  superheroes.forEach((superhero) => {
    const searchItem = document.createElement('div');
    searchItem.classList.add('search-item');

    const thumbnail = document.createElement('img');
    thumbnail.src = `${superhero.thumbnail.path}.${superhero.thumbnail.extension}`;
    thumbnail.alt = superhero.name;
    thumbnail.classList.add('search-item-thumbnail');
    thumbnail.addEventListener('click', (event) => {
      redirectToSuperheroDetails(superhero.id);
      event.stopPropagation();
    });
    searchItem.appendChild(thumbnail);

    const heroName = document.createElement('span');
    heroName.textContent = superhero.name;
    heroName.classList.add('search-item-name');
    heroName.addEventListener('click', (event) => {
      redirectToSuperheroDetails(superhero.id);
      event.stopPropagation();
    });
    searchItem.appendChild(heroName);

    const heartIcon = document.createElement('i');
    heartIcon.classList.add('fas', 'fa-heart', 'search-item-heart');
    heartIcon.addEventListener('click', () =>
      addToFavorites(
        superhero.id,
        superhero.name,
        superhero.thumbnail.path,
        superhero.thumbnail.extension
      )
    );
    searchItem.appendChild(heartIcon);

    searchList.appendChild(searchItem);
  });
}

document.body.addEventListener('click', (event) => {
  const isClickInsideSearchList = searchList.contains(event.target);

  if (!isClickInsideSearchList) {
    searchList.innerHTML = '';
    searchInput.value = '';
  }
});

function addToFavorites(id, name, imagePath, imageExtension) {
  const favoriteSuperheroes =
    JSON.parse(localStorage.getItem('favoriteSuperheroes')) || [];

  if (!favoriteSuperheroes.some((hero) => hero.id === id)) {
    const heroDetails = {
      id: id,
      name: name,
      thumbnail: {
        path: imagePath,
        extension: imageExtension,
      },
    };

    favoriteSuperheroes.push(heroDetails);
    localStorage.setItem(
      'favoriteSuperheroes',
      JSON.stringify(favoriteSuperheroes)
    );

    if (window.location.pathname.includes('favorites.html')) {
      renderFavoriteHero(heroDetails, document.getElementById('favoritesList'));
    }
    // Show success message
    alert(`Hero ${name} added to favorites!`);
  } else {
    // Show failure message - already hero exists
    alert(`Hero ${name} already added to favorites list!`);
  }
}

// Placeholder function to render a favorite superhero card
function renderFavoriteHero(hero, favoritesList) {
  // Remove the message if it exists
  const noFavoritesMessage = favoritesList.querySelector(
    '.no-favorites-message'
  );
  if (noFavoritesMessage) {
    favoritesList.removeChild(noFavoritesMessage);
  }
  // Create a new HTML element for the favorite hero card
  const heroCard = document.createElement('div');
  heroCard.className = 'col-md-3';

  heroCard.innerHTML = `
    <div class="superhero d-flex flex-column align-items-center">
      <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}" class="img-fluid">
      <div class="mt-3">
        <h3>${hero.name}</h3>
        <button class="btn btn-danger remove-favorite-btn" onclick="removeFromFavorites(${hero.id})">Remove from Favorites</button>
      </div>
    </div>
  `;

  // Append the hero card to the favorites list container
  favoritesList.appendChild(heroCard);
}

export {
  publicKey,
  generateHash,
  createApiUrl,
  fetchData,
  addToFavorites,
  redirectToSuperheroDetails,
  getFavoritesFromLocalStorage,
  createNoDetailsMessage,
};
