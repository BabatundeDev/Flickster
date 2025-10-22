import { useEffect, useState } from "react";
import { getMovies, IMAGE_BASE } from "../api/tmdb";
import "./styles/MovieSlider.css";
export default function MovieSlider({ category, title, movies: externalMovies }) {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    if (externalMovies) {
      setMovies(externalMovies);
      return;
    }
    if (category) {
      getMovies(category)
        .then((data) => setMovies(data.results || []))
        .catch((err) => console.error(err));
    }
  }, [category, externalMovies]);

  return (
    <div className="slider">
      <h2>{title}</h2>
      <div className="movie-container">
        {movies.map((movie) => (
          <div key={movie.id} className="movie-card">
            <img
              src={movie.poster_path ? `${IMAGE_BASE}${movie.poster_path}` : "/placeholder.jpg"}
              alt={movie.title}
            />
            <h3>{movie.title}</h3>
          </div>
        ))}
      </div>
    </div>
  );
}
