import { useState, useEffect } from 'react';
import axios from 'axios';

const MovieDetails = ({ movieId }) => {
    const [details, setDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchMovieDetails = async () => {
            try {
                const response = await axios.get(
                    `https://api.themoviedb.org/3/movie/${movieId}`,
                    { params: { api_key: '85b9d2b600e4cd470c87d6389f2fa8ca' } }
                );
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