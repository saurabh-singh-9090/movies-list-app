import React, { useState, useEffect, useCallback } from 'react';
import './movies.css';
import axios from 'axios';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import MovieDetails from './MovieDetails';
import { debounce } from './utility/debounce';

const Movies = () => {
  // State variables for managing movies, pagination, loading, errors, and search functionality
  const [movies, setMovies] = useState([]); // List of movies
  const [page, setPage] = useState(1); // Current page for API calls (pagination)
  const [loading, setLoading] = useState(false); // Loading state for data fetching
  const [error, setError] = useState(null); // Error state for API call issues
  const [searchTerm, setSearchTerm] = useState(''); // Actual search term used for fetching data
  const [expandedMovie, setExpandedMovie] = useState(null); // Movie ID of the currently expanded movie
  const [hasMore, setHasMore] = useState(true); // Indicates if there are more movies to load
  const [inputValue, setInputValue] = useState(''); // Tracks real-time user input in the search field

  const API_KEY = process.env.REACT_APP_OMDB_API_KEY?.trim(); // API key from environment variables
  const API_URL = `https://api.themoviedb.org/3`; // Base URL for The Movie Database API

  // Function to fetch movies based on the search term and page
  const fetchMovies = useCallback(async () => {
    setLoading(true); // Start loading
    setError(null); // Clear any previous errors

    try {
      // Determine the API endpoint based on whether a search term is present
      const endpoint = searchTerm
        ? `${API_URL}/search/movie?api_key=${API_KEY}&query=${searchTerm}&page=${page}`
        : `${API_URL}/discover/movie?api_key=${API_KEY}&page=${page}`;

      const response = await axios.get(endpoint); // Fetch data from the API

      if (response.data.results && response.data.results.length > 0) {
        // If results are found, append them to the existing movie list
        setMovies(prevMovies => [...prevMovies, ...response.data.results]);
        setHasMore(response.data.results.length > 0); // Check if more results are available
      } else {
        setHasMore(false); // No more results to load
      }
    } catch (err) {
      setError('Failed to fetch data. Please try again later.'); // Set error message on failure
    } finally {
      setLoading(false); // End loading
    }
  }, [page, searchTerm]);

  // Fetch movies whenever the search term or page changes
  useEffect(() => {
    fetchMovies();
  }, [fetchMovies]);

  // Handle infinite scroll functionality
  const handleScroll = useCallback(() => {
    // Check if the user has scrolled close to the bottom of the page
    if (
      window.innerHeight + document.documentElement.scrollTop + 50 >=
        document.documentElement.scrollHeight &&
      !loading &&
      hasMore
    ) {
      setPage(prevPage => prevPage + 1); // Increment page to load more results
    }
  }, [loading, hasMore]);

  // Add event listener for scroll events
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll); // Cleanup on component unmount
  }, [handleScroll]);

  // Debounced function to update the search term
  const debouncedSetSearchTerm = useCallback(
    debounce(value => {
      setSearchTerm(value); // Update the actual search term
      setMovies([]); // Clear previous movie results
      setPage(1); // Reset page to 1
    }, 300), // 300ms debounce delay
    []
  );

  // Handle real-time user input in the search field
  const handleInputChange = e => {
    const value = e.target.value; // Get the input value
    setInputValue(value); // Update input field immediately
    debouncedSetSearchTerm(value); // Update search term with debounce
  };

  // Toggle the expansion of movie details
  const toggleMovieDetails = movieId => {
    // If the movie is already expanded, collapse it; otherwise, expand it
    setExpandedMovie(expandedMovie === movieId ? null : movieId);
  };

  return (
    <div className="movie-list-container">
      {/* Search input field */}
      <input
        type="text"
        placeholder="Search movies..."
        value={inputValue} // Bind inputValue to show real-time updates
        onChange={handleInputChange} // Handle input changes
        className="search-input"
      />

      {/* Render movie list */}
      {movies.map(movie => (
        <div key={movie.id} className="movie-item">
          <h3
            onClick={() => toggleMovieDetails(movie.id)} // Toggle movie details on click
            className="movie-title"
          >
            {movie.title}
            {expandedMovie === movie.id ? (
              <FaChevronUp className="accordion-icon" /> // Up arrow for expanded movie
            ) : (
              <FaChevronDown className="accordion-icon" /> // Down arrow for collapsed movie
            )}
          </h3>
          {expandedMovie === movie.id && <MovieDetails movieId={movie.id} />} {/* Show details if expanded */}
        </div>
      ))}

      {/* Loading, error, and no-more-results messages */}
      {loading && <p>Loading...</p>}
      {error && <p className="error-message">{error}</p>}
      {!hasMore && <p>No more results</p>}
    </div>
  );
};

export default Movies;
