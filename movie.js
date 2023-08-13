// const movieListSection = document.querySelector("#movie-list");

// async function showMovies(pageNumber = 1) {
//   const response = await fetch(
//     `https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=${pageNumber}`
//   );
//   const json = await response.json();
//   const movieList = json.results;
//   for (let movie of movieList) {
//     // movie section
//     const movieTitle = document.createElement("h2");
//     movieTitle.innerText = movie.title;
//     const rating = document.createElement("p");
//     rating.innerText = movie.vote_average;
//     const movieDetails = document.createElement("section");
//     movieDetails.appendChild(movieTitle);
//     movieDetails.appendChild(rating);
//     movieDetails.classList.add("movie-details");
//     // image/ banner
//     let banner = document.createElement("img");
//     banner.src = `https://image.tmdb.org/t/p/w200/${movie.backdrop_path}`;
//     banner.classList.add("movie-poster");
//     // footer
//     const footer = document.createElement("footer");
//     const date = document.createElement("p");
//     date.innerText = `date ${movie.release_date}`;
//     const heart = document.createElement("i");
//     heart.classList.add("fa-regular", "fa-heart", "like");
//     footer.appendChild(date);
//     footer.appendChild(heart);
//     // parent
//     const movieElement = document.createElement("article");
//     movieElement.classList.add("movie");
//     movieElement.appendChild(banner);
//     movieElement.appendChild(movieTitle);
//     movieElement.appendChild(footer);
//     movieListSection.appendChild(movieElement);
//   }

//   //   movieList
// }

// showMovies();
const API_KEY = '4309e7869e5a6f7164f1fff7195ee87b'; 
const API_URL = `https://api.themoviedb.org/3/movie/top_rated?api_key=f531333d637d0c44abc85b3e74db2186&language=en-US&page=${pageNumber}`;

const movieList = document.getElementById('movieCards');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const sortByDateButton = document.getElementById('sortByDate');
const sortByRatingButton = document.getElementById('sortByRating');
const allTab = document.getElementById('allTab');
const favoritesTab = document.getElementById('favoritesTab');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');
const currentPageSpan = document.getElementById('currentPage');

let currentPage = 1;
let moviesData = [];
let favorites = [];

// Fetch movies data from API
async function fetchMovies() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        moviesData = data.results;
        renderMovies();
    } catch (error) {
        console.error('Error fetching movies:', error);
    }
}

// Render movies in cards
function renderMovies() {
    movieList.innerHTML = '';

    for (let movie of moviesData) {
        const movieCard = createMovieCard(movie);
        movieList.appendChild(movieCard);
    }
}

// Create a movie card element
function createMovieCard(movie) {
    const movieCard = document.createElement('li');
    movieCard.className = 'movie-card';

    const posterURL = `https://image.tmdb.org/t/p/original/${movie.poster_path}`;

    const content = `
        <img src="${posterURL}" alt="${movie.title}">
        <h3>${movie.title}</h3>
        <p>Vote Count: ${movie.vote_count}</p>
        <p>Vote Average: ${movie.vote_average}</p>
        <i class="favorite-icon ${favorites.includes(movie.id) ? 'selected' : ''} fas fa-heart" data-movie-id="${movie.id}"></i>
    `;

    movieCard.innerHTML = content;

    const favoriteIcon = movieCard.querySelector('.favorite-icon');
    favoriteIcon.addEventListener('click', toggleFavorite);

    return movieCard;
}

// Toggle favorite status
function toggleFavorite(event) {
    const movieId = parseInt(event.target.dataset.movieId);
    if (favorites.includes(movieId)) {
        favorites = favorites.filter(id => id !== movieId);
    } else {
        favorites.push(movieId);
    }

    event.target.classList.toggle('selected');
    saveFavoritesToLocalStorage();
}

// Save favorites to local storage
function saveFavoritesToLocalStorage() {
    localStorage.setItem('favorites', JSON.stringify(favorites));
}

// Load favorites from local storage
function loadFavoritesFromLocalStorage() {
    const favoritesData = localStorage.getItem('favorites');
    if (favoritesData) {
        favorites = JSON.parse(favoritesData);
    }
}

// Initialize the app
function init() {
    loadFavoritesFromLocalStorage();
    fetchMovies();
}

// Event listeners
searchButton.addEventListener('click', fetchMovies);
sortByDateButton.addEventListener('click', () => sortMovies('date'));
sortByRatingButton.addEventListener('click', () => sortMovies('rating'));
allTab.addEventListener('click', renderMovies);
favoritesTab.addEventListener('click', renderFavorites);
prevPageButton.addEventListener('click', () => changePage(currentPage - 1));
nextPageButton.addEventListener('click', () => changePage(currentPage + 1));

// Sort movies by date or rating
function sortMovies(type) {
    moviesData.sort((a, b) => {
        if (type === 'date') {
            return new Date(b.release_date) - new Date(a.release_date);
        } else if (type === 'rating') {
            return b.vote_average - a.vote_average;
        }
    });
    renderMovies();
}

// Render favorite movies
function renderFavorites() {
    const favoriteMovies = moviesData.filter(movie => favorites.includes(movie.id));
    movieList.innerHTML = '';
    for (let movie of favoriteMovies) {
        const movieCard = createMovieCard(movie);
        movieList.appendChild(movieCard);
    }
}

// Change current page
function changePage(page) {
    if (page >= 1 && page <= 3) {
        currentPage = page;
        currentPageSpan.textContent = `Current Page: ${currentPage}`;
        fetchMovies();
        updatePaginationButtons();
    }
}

// Update pagination buttons
function updatePaginationButtons() {
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === 3;
}

// Initialize the app
init();

