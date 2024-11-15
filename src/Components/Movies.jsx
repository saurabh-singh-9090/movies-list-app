import React, { useState, useEffect, useCallback } from 'react';
import './movies.css'; // Ensure CSS is imported
import axios from 'axios';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa'; // Import icons from react-icons
import MovieDetails from './MovieDetails';

const Movies = () => {
  const [movies, setMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedMovie, setExpandedMovie] = useState(null);
  const [hasMore, setHasMore] = useState(true);

  const API_KEY = '85b9d2b600e4cd470c87d6389f2fa8ca';
  const API_URL = `https://api.themoviedb.org/3`;

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const endpoint = searchTerm
        ? `${API_URL}/search/movie`
        : `${API_URL}/discover/movie`;

      const response = await axios.get(endpoint, {
        params: {
          api_key: API_KEY,
          query: searchTerm,
          page: page,
        },
      });

      if (response.data.results && response.data.results.length > 0) {
        setMovies(prevMovies => [...prevMovies, ...response.data.results]);
        setHasMore(response.data.results.length > 0);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again later.');
    } finally {
      setLoading(false);
    }
  }, [page, searchTerm]);

  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  const handleScroll = useCallback(() => {
    if (
      window.innerHeight + document.documentElement.scrollTop + 50 >=
      document.documentElement.scrollHeight &&
      !loading &&
      hasMore
    ) {
      setPage(prevPage => prevPage + 1);
    }
  }, [loading, hasMore]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  const handleSearch = e => {
    setSearchTerm(e.target.value);
    setMovies([]);
    setPage(1);
  };

  const toggleMovieDetails = movieId => {
    setExpandedMovie(expandedMovie === movieId ? null : movieId);
  };

  return (
    <div className="movie-list-container">
      <input
        type="text"
        placeholder="Search movies..."
        value={searchTerm}
        onChange={handleSearch}
        className="search-input"
      />

      {movies.map(movie => (
        <div key={movie.id} className="movie-item">
          <h3 onClick={() => toggleMovieDetails(movie.id)} className="movie-title">
            {movie.title}
            {expandedMovie === movie.id ? (
              <FaChevronUp className="accordion-icon" />
            ) : (
              <FaChevronDown className="accordion-icon" />
            )}
          </h3>
          {expandedMovie === movie.id && <MovieDetails movieId={movie.id} />}
        </div>
      ))}

      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!hasMore && <p>No more results</p>}
    </div>
  );
};

export default Movies;
