import { useState, useEffect } from 'react';
import axios from 'axios';

const MovieDetails = ({ movieId }) => {
    // State to store the movie details and loading status
    const [details, setDetails] = useState(null); // Movie details object
    const [loading, setLoading] = useState(true); // Loading state while fetching movie details

    // API key for The Movie Database API from environment variables
    const API_KEY = process.env.REACT_APP_OMDB_API_KEY?.trim();

    // Fetch movie details when the movieId prop changes
    useEffect(() => {
        // Function to fetch movie details from the API
        const fetchMovieDetails = async () => {
            try {
                // API endpoint to fetch movie details by movieId
                const endpoint = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`;
                const response = await axios.get(endpoint); // Fetch the movie data
                setDetails(response.data); // Set the movie details in state
            } catch (error) {
                // Log error in case of failure to fetch movie details
                console.error('Failed to load movie details:', error);
            } finally {
                // Set loading to false once the API request is complete (either success or failure)
                setLoading(false);
            }
        };

        fetchMovieDetails(); // Call the function to fetch movie details
    }, [movieId]); // Dependency array ensures the effect runs when movieId changes

    // If loading, display a loading message
    if (loading) return <p>Loading details...</p>;

    // If movie details are successfully fetched, render them
    return details ? (
        <div className="movie-details">
            {/* Conditionally render the poster image if it exists */}
            {details.poster_path && (
                <img
                    src={`https://image.tmdb.org/t/p/w300${details.poster_path}`}
                    alt={`${details.title} Poster`} // Alt text for the image
                />
            )}
            {/* Display movie title, release date, overview, genres, and rating */}
            <p><strong>Title:</strong> {details.title}</p>
            <p><strong>Release Date:</strong> {details.release_date}</p>
            <p><strong>Overview:</strong> {details.overview}</p>
            <p><strong>Genres:</strong> {details.genres.map(genre => genre.name).join(', ')}</p>
            <p><strong>Rating:</strong> {details.vote_average} / 10</p>
        </div>
    ) : (
        // If no details found, display an unavailable message
        <p>Details unavailable</p>
    );
};

export default MovieDetails;
