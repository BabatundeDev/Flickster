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

// Reset the popular movies section and its heading when no genre is selected
document.addEventListener("DOMContentLoaded", () => {
  fetchPopularMovies();
  // Ensure the popular movies section and heading are visible on load
  document.getElementById("popular-slider").classList.remove("hide-popular");
  document.querySelector(".section-title").classList.remove("hide-popular");
});


// Display popular movies in slider (only on initial load)
function displayPopularMovies(movies, container) {
  container.innerHTML = ""; // clear existing cards
  movies.forEach((movie) => {
    const movieCard = document.createElement("div");
    movieCard.classList.add("movie-card");
    movieCard.innerHTML = `
      <img src="https://image.tmdb.org/t/p/w500${movie.poster_path}" alt="${movie.title}" />
      <h2>${movie.title}</h2>
      <p>${movie.overview || "No description available."}</p>
    `;
    container.appendChild(movieCard);
  });
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
function fetchSearchResults(query) {
  fetch(
    `https://api.themoviedb.org/3/search/movie?query=${encodeURIComponent(query)}&include_adult=false&language=en-US&page=1`,
    options
  )
    .then((res) => res.json())
    .then((data) => {
      if (data.results.length > 0) {
        displayMovies(data.results, container);
      } else {
        container.innerHTML = "<p>No results found.</p>";
      }
    })
    .catch((err) => console.error("Search error:", err));
}

let searchTimeout;

searchInput.addEventListener("input", () => {
  const query = searchInput.value.trim();
  clearTimeout(searchTimeout);

  searchTimeout = setTimeout(() => {
    if (query.length > 1) {
      fetchSearchResults(query);
    } else {
      fetchPopularMovies(); // fallback to popular
    }
  }, 500);
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

document.addEventListener("DOMContentLoaded", () => {
  fetchMovies("popular", "popular-slider");
  fetchMovies("top_rated", "top-rated-slider");
  fetchMovies("upcoming", "upcoming-slider");
  fetchMovies("now_playing", "now-playing-slider");
});

function fetchMovies(type, containerId) {
  fetch(`https://api.themoviedb.org/3/movie/${type}?language=en-US&page=1`, options)
    .then((res) => res.json())
    .then((res) => {
      const data = res.results;
      const container = document.getElementById(containerId);
      displayPopularMovies(data, container);
    })
    .catch((err) => console.log(err));
}

