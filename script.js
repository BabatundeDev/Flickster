const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization:
      "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NTk2OGQ4NjcwYTYxMzFkZmQ3ZGI1MjVhZGQzYTBjZCIsIm5iZiI6MTczODMyMzgzMy4xMTM5OTk4LCJzdWIiOiI2NzljYjc3OTM1ZTMxZGNlZTc0ZDI3YWMiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.6YWFiu4FcZVfeyMpd-y7E3A3Z9ls-O2si6ZwDPg7mFE",
  },
};

const container = document.getElementById("movie-container");
const searchInput = document.getElementById("searchInput");
const genreContainer = document.getElementById("genre-container");
const popularSlider = document.getElementById("popular-slider");

// Fetch genres from the TMDB API
fetch("https://api.themoviedb.org/3/genre/movie/list?language=en-US", options)
  .then((res) => res.json())
  .then((res) => {
    const genres = res.genres;
    genres.forEach((genre) => {
      const genreButton = document.createElement("button");
      genreButton.textContent = genre.name;
      genreButton.classList.add("genre-button");
      genreButton.setAttribute("data-genre-id", genre.id);
      genreContainer.appendChild(genreButton);
    });
  })
  .catch((err) => console.log(err));

// Fetch and display movies based on selected genre
genreContainer.addEventListener("click", (e) => {
  if (e.target.classList.contains("genre-button")) {
    const genreId = e.target.getAttribute("data-genre-id");
    const genreName = e.target.textContent;

    // Update heading
    document.getElementById("genreTitle").textContent = `${genreName} Movies`;

    // Hide popular movies section and its heading when genre is clicked
    document.getElementById("popular-slider").classList.add("hide-popular");
    document.querySelector(".section-title").classList.add("hide-popular");

    fetchMoviesByGenre(genreId);
  }
});

// Reset the popular movies section and its heading when no genre is selected
document.addEventListener("DOMContentLoaded", () => {
  fetchPopularMovies();
  // Ensure the popular movies section and heading are visible on load
  document.getElementById("popular-slider").classList.remove("hide-popular");
  document.querySelector(".section-title").classList.remove("hide-popular");
});

// Fetch movies by genre
function fetchMoviesByGenre(genreId) {
  fetch(
    `https://api.themoviedb.org/3/discover/movie?with_genres=${genreId}&language=en-US&page=1`,
    options
  )
    .then((res) => res.json())
    .then((res) => {
      const data = res.results;
      container.innerHTML = "";
      displayMovies(data, container);
    })
    .catch((err) => console.log(err));
}

// Fetch popular movies on load (only when page is loaded or refreshed)
function fetchPopularMovies() {
  fetch("https://api.themoviedb.org/3/movie/popular?language=en-US&page=1", options)
    .then((res) => res.json())
    .then((res) => {
      const data = res.results;
      popularSlider.innerHTML = "";
      displayPopularMovies(data, popularSlider);
    })
    .catch((err) => console.log(err));
}

// Display popular movies in slider (only on initial load)
function displayPopularMovies(data, container) {
  data.forEach((val) => {
    const imgBox = document.createElement("div");
    imgBox.classList.add("movie-card");

    const img = document.createElement("img");
    img.src = `https://image.tmdb.org/t/p/w500/${val.backdrop_path}`;
    img.alt = val.title;

    const title = document.createElement("h3");
    title.textContent = val.title;
    title.style.fontSize = "1rem";
    title.style.marginTop = "10px";

    imgBox.append(img, title);
    container.appendChild(imgBox);
  });

  // Initialize the auto-slide functionality
  autoSlide();
}

// Display other movies (like search or genre)
function displayMovies(data, container) {
  container.innerHTML = "";
  data.forEach((val) => {
    const imgBox = document.createElement("div");
    imgBox.classList.add("movie-card");

    const img = document.createElement("img");
    img.src = `https://image.tmdb.org/t/p/w500/${val.backdrop_path}`;
    img.alt = val.title;

    const title = document.createElement("h2");
    title.textContent = val.title;

    const rating = document.createElement("p");
    rating.textContent = `⭐ ${val.vote_average.toFixed(1)} / 10`;

    const releaseDate = document.createElement("p");
    releaseDate.textContent = `🗓️ ${val.release_date}`;

    const overview = document.createElement("p");
    overview.textContent = val.overview;

    imgBox.append(img, title, rating, releaseDate, overview);
    container.appendChild(imgBox);
  });
}

// Filter search
searchInput.addEventListener("input", () => {
  const searchValue = searchInput.value.toLowerCase();
  const cards = document.querySelectorAll(".movie-card");

  cards.forEach((card) => {
    const title = card.querySelector("h2, h3").textContent.toLowerCase();
    card.style.display = title.includes(searchValue) ? "block" : "none";
  });
});

// Theme toggle
const modeToggle = document.getElementById("modeToggle");
const modeIcon = document.getElementById("modeIcon");

const currentTheme = localStorage.getItem("theme") || "dark";
document.body.setAttribute("data-theme", currentTheme);
if (currentTheme === "light") {
  modeIcon.classList.remove("fa-moon");
  modeIcon.classList.add("fa-sun");
}

modeToggle.addEventListener("click", () => {
  const newTheme = document.body.getAttribute("data-theme") === "dark" ? "light" : "dark";
  document.body.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);

  if (newTheme === "dark") {
    modeIcon.classList.remove("fa-sun");
    modeIcon.classList.add("fa-moon");
  } else {
    modeIcon.classList.remove("fa-moon");
    modeIcon.classList.add("fa-sun");
  }
});

// Auto-slide function for the popular slider
function autoSlide() {
  const slider = document.getElementById("popular-slider");
  const scrollWidth = slider.scrollWidth;
  const clientWidth = slider.clientWidth;

  setInterval(() => {
    slider.scrollLeft += clientWidth;

    // If the slider has reached the end, reset to the start
    if (slider.scrollLeft >= scrollWidth - clientWidth) {
      slider.scrollLeft = 0;
    }
  }, 2000);
}

// Load popular movies only when the page is loaded or refreshed
document.addEventListener("DOMContentLoaded", () => {
  fetchPopularMovies(); // Fetch popular movies only on page load
});
