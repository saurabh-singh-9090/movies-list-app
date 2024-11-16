import { useState, useEffect } from 'react';
import axios from 'axios';

const MovieDetails = ({ movieId }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const API_KEY = process.env.REACT_APP_OMDB_API_KEY?.trim();

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const endpoint = `https://api.themoviedb.org/3/movie/${movieId}?api_key=${API_KEY}`;
                const response = await axios.get(endpoint);
                setDetails(response.data);
            } catch (error) {
                console.error('Failed to load movie details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchMovieDetails();
    }, [movieId]);

    if (loading) return <p>Loading details...</p>;

    return details ? (
        <div className="movie-details">
            {details.poster_path && (
                <img
                    src={`https://image.tmdb.org/t/p/w300${details.poster_path}`}
                    alt={`${details.title} Poster`}
                />
            )}
            <p><strong>Title:</strong> {details.title}</p>
            <p><strong>Release Date:</strong> {details.release_date}</p>
            <p><strong>Overview:</strong> {details.overview}</p>
            <p><strong>Genres:</strong> {details.genres.map(genre => genre.name).join(', ')}</p>
            <p><strong>Rating:</strong> {details.vote_average} / 10</p>
        </div>
    ) : (
        <p>Details unavailable</p>
    );
};

export default MovieDetails;