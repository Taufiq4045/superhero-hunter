// favorites.js
import {
  getFavoritesFromLocalStorage,
  redirectToSuperheroDetails,
} from './common.js';

document.addEventListener('DOMContentLoaded', displayFavorites);

function displayFavorites() {
  const favoritesList = document.getElementById('favoritesList');
  const favorites = getFavoritesFromLocalStorage();

  if (favorites && favorites.length > 0) {
    favorites.forEach((heroDetails) => {
      const { id, name, thumbnail } = heroDetails;
      renderFavoriteHero({ id, name, thumbnail }, favoritesList);
    });
  } else {
    favoritesList.innerHTML = `<h2 class="no-favorites-message">No favorite superheroes found. <br /> Please add your favorite heroes to display here.</h2>`;
  }
}

function renderFavoriteHero(hero, favoritesList) {
  const noFavoritesMessage = favoritesList.querySelector(
    '.no-favorites-message'
  );

  if (noFavoritesMessage) {
    favoritesList.removeChild(noFavoritesMessage);
  }

  const heroCard = document.createElement('div');
  heroCard.className = 'col-md-3';

  heroCard.innerHTML = `
      <div class="superhero d-flex flex-column align-items-center">
        <img src="${hero.thumbnail.path}.${hero.thumbnail.extension}" alt="${hero.name}" class="img-fluid">
        <div class="mt-3">
          <h3>${hero.name}</h3>
          <button class="btn btn-danger remove-favorite-btn">Remove from Favorites</button>
        </div>
      </div>
    `;

  heroCard.addEventListener('click', (event) => {
    const target = event.target;

    if (target.classList.contains('remove-favorite-btn')) {
      event.stopPropagation();
      removeFromFavorites(hero.id);
    } else {
      redirectToSuperheroDetails(hero.id);
    }
  });

  favoritesList.appendChild(heroCard);
}

function removeFromFavorites(heroId) {
  const favoriteSuperheroes =
    JSON.parse(localStorage.getItem('favoriteSuperheroes')) || [];

  const updatedFavorites = favoriteSuperheroes.filter(
    (hero) => hero.id !== heroId
  );

  localStorage.setItem('favoriteSuperheroes', JSON.stringify(updatedFavorites));

  const favoritesList = document.getElementById('favoritesList');
  if (updatedFavorites.length > 0) {
    favoritesList.innerHTML = '';
    updatedFavorites.forEach((hero) => renderFavoriteHero(hero, favoritesList));
  } else {
    favoritesList.innerHTML = `<h2 class="no-favorites-message">No favorite superheroes found. <br /> Please add your favorite heroes to display here.</h2>`;
  }
}
