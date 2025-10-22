import { useState, useEffect } from "react";
import "./App.css";
import Navbar from "./components/Navbar";
import ThemeToggle from "./components/ThemeToggle";
import MovieSlider from "./components/MovieSlider";
import { getMovies } from "./api/tmdb";

function App() {
  const [theme, setTheme] = useState("dark");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async (query) => {
    if (!query) return setSearchResults([]);
    const res = await fetch(
      `https://api.themoviedb.org/3/search/movie?query=${query}&language=en-US`,
      {
        headers: {
          accept: "application/json",
          Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_TOKEN}`,
        },
      }
    );
    const data = await res.json();
    setSearchResults(data.results || []);
  };

  useEffect(() => {
    document.body.className = theme; // update global theme
  }, [theme]);

  return (
    <div className={`App ${theme}`}>
      <Navbar onSearch={handleSearch} />
      <ThemeToggle theme={theme} setTheme={setTheme} />

      {searchResults.length > 0 ? (
        <MovieSlider movies={searchResults} title="Search Results" />
      ) : (
        <>
          <MovieSlider category="popular" title="Popular" />
          <MovieSlider category="top_rated" title="Top Rated" />
          <MovieSlider category="now_playing" title="Now Playing" />
          <MovieSlider category="upcoming" title="Upcoming" />
        </>
      )}
    </div>
  );
}

export default App;
