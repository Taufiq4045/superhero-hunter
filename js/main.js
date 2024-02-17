// main.js
import {
  createApiUrl,
  fetchData,
  addToFavorites,
  redirectToSuperheroDetails,
} from './common.js';

document.addEventListener('DOMContentLoaded', () => {
  fetchRandomSuperheroes(40);
});

async function fetchRandomSuperheroes(limit) {
  try {
    const apiUrl = createApiUrl(
      'characters',
      `limit=${limit}&orderBy=modified`
    );
    const data = await fetchData(apiUrl);
    // Check if the response contains results
    if (data.length > 0) {
      renderSuperheroes(data);
    } else {
      console.error('No superheroes found.');
    }
  } catch (error) {
    console.error('Error fetching superheroes:', error);
  }
}

function renderSuperheroes(superheroes) {
  const mainContent = document.getElementById('mainContent');
  mainContent.innerHTML = '';

  superheroes.forEach((hero) => {
    const superheroElement = document.createElement('div');
    superheroElement.className = 'col-md-3';
    superheroElement.innerHTML = `
      <div class="superhero d-flex flex-column align-items-center">
        <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}" class="img-fluid">
        <div class="mt-3">
          <h3>${hero.name}</h3>
          <button class="btn btn-primary favorite-btn">Add to Favorites</button>
          </div>
      </div>
    `;

    superheroElement.addEventListener('click', (event) => {
      const target = event.target;

      if (target.classList.contains('favorite-btn')) {
        event.stopPropagation();
        addToFavorites(
          hero.id,
          hero.name,
          hero.thumbnail.path,
          hero.thumbnail.extension
        );
      } else {
        redirectToSuperheroDetails(hero.id);
      }
    });

    mainContent.appendChild(superheroElement);
  });
}
