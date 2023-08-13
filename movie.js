const API_KEY = '4309e7869e5a6f7164f1fff7195ee87b';
const API_URL = "https://api.themoviedb.org/3/discover/movie?include_adult=false&language=en-US&page=${pageNumber}&sort_by=$";
const POSTER_BASE_URL = 'https://image.tmdb.org/t/p/original/';

const movieList = document.getElementById('movie-list');
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const sortByDateButton = document.getElementById('sortByDate');
const sortByRatingButton = document.getElementById('sortByRating');
const allTab = document.getElementById('allTab');
const favoritesTab = document.getElementById('favoritesTab');
const prevPageButton = document.getElementById('prevPage');
const nextPageButton = document.getElementById('nextPage');
const currentPageSpan = document.getElementById('currentPage');
const favoriteIconClass = 'fas fa-heart';

let currentPage = 1;
let totalPages = 0;
let moviesData = [];
let favorites = [];

// Fetch movies data from API
async function fetchMovies(url) {
    try {
        const response = await fetch(url);
        const data = await response.json();
        totalPages = data.total_pages;
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

    updatePaginationButtons();
}

// Create a movie card element
function createMovieCard(movie) {
    const movieCard = document.createElement('div');
    movieCard.classList.add('movie-card');

    const posterURL = POSTER_BASE_URL + movie.poster_path;

    const content = `
        <img src="${posterURL}" alt="${movie.title}" class="movie-poster">
        <h3 class="movie-title">${movie.title}</h3>
        <p class="vote-count">Vote Count: ${movie.vote_count}</p>
        <p class="vote-average">Vote Average: ${movie.vote_average}</p>
        <i class="${favoriteIconClass} favorite-icon" data-movie-id="${movie.id}"></i>
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

// Sort movies by date or rating
function sortMovies(sortBy) {
    moviesData.sort((a, b) => {
        if (sortBy === 'date') {
            return new Date(a.release_date) - new Date(b.release_date);
        } else if (sortBy === 'rating') {
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
    if (page >= 1 && page <= totalPages) {
        currentPage = page;
        fetchMovies(`${API_URL}&page=${currentPage}`);
    }
}

// Update pagination buttons
function updatePaginationButtons() {
    prevPageButton.disabled = currentPage === 1;
    nextPageButton.disabled = currentPage === totalPages;
    currentPageSpan.textContent = currentPage;
}

// Initialize the app
function init() {
    loadFavoritesFromLocalStorage();
    fetchMovies(API_URL);
}

// Event listeners
searchButton.addEventListener('click', () => {
    const query = searchInput.value.trim();
    if (query !== '') {
        fetchMovies(`https://api.themoviedb.org/3/search/movie?api_key=${API_KEY}&query=${query}`);
    }
});
sortByDateButton.addEventListener('click', () => sortMovies('date'));
sortByRatingButton.addEventListener('click', () => sortMovies('rating'));
allTab.addEventListener('click', () => fetchMovies(API_URL));
favoritesTab.addEventListener('click', renderFavorites);
prevPageButton.addEventListener('click', () => changePage(currentPage - 1));
nextPageButton.addEventListener('click', () => changePage(currentPage + 1));

// Initialize the app
init();
