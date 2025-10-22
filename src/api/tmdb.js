const API_BASE = "https://api.themoviedb.org/3";
const IMAGE_BASE = "https://image.tmdb.org/t/p/w500";

const options = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${import.meta.env.VITE_TMDB_API_TOKEN}`,
  },
};

export const getMovies = async (category = "popular", page = 1) => {
  const res = await fetch(`${API_BASE}/movie/${category}?language=en-US&page=${page}`, options);
  if (!res.ok) throw new Error("Failed to fetch movies");
  return res.json();
};

export { IMAGE_BASE };
