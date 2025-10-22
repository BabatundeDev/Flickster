export default function Hero({ onSearch }) {
  return (
    <div className="hero-content">
      <h2 className="heading">Explore Unlimited Movies, <br /> TV Shows & More</h2>
      <input
        type="text"
        placeholder="Search for Movies or TV Shows"
        onChange={(e) => onSearch(e.target.value)}
      />
    </div>
  );
}
