import React from 'react';
import { Card, CardContent, Typography, CardMedia, Box } from '@mui/material';

const MovieCard = ({ movie, onClick }) => {
    const isValidImageUrl = (url) => {
        if (!url) return false;
        return url.trim() !== '';
    };

    return (
        <Card sx={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            border: '1px solid #e0e0e0',
            backgroundColor: '#edf4ed',
            '&:hover': {
                boxShadow: 3,
                transform: 'translateY(-2px)',
                transition: 'all 0.3s ease'
            }
        }}>
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
                padding: '10px',
                backgroundColor: '#fff'
            }}>
                <CardMedia
                    component="img"
                    sx={{
                        width: 'auto',
                        height: 200,
                        maxWidth: '100%',
                        objectFit: 'contain'
                    }}
                    image={isValidImageUrl(movie.poster) ? movie.poster : `${process.env.PUBLIC_URL}/images/image.png`}
                    alt={`${movie.title} poster`}
                    onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = `${process.env.PUBLIC_URL}/images/image.png`;
                    }}
                />
            </Box>
            <CardContent>
                <Typography variant="h6" component="div" align="center">
                    <strong>{movie.title} ({movie.year})</strong>
                </Typography>
                <Typography variant="body2" color="text.secondary">
                    <strong>Director:</strong> {movie.directors?.join(', ')}
                    <br />
                    <strong>Cast:</strong> {movie.cast?.slice(0, 3).join(', ')}{movie.cast?.length > 3 ? '...' : ''}
                    <br />
                    <strong>Genres:</strong> {movie.genres?.join(', ')}
                    <br />
                    <strong>Plot:</strong> {movie.plot?.substring(0, 100)}{movie.plot?.length > 100 ? '...' : ''}
                    <br />
                    <strong>Rating:</strong> {movie.imdb?.rating}
                    <br />
                    <strong>Runtime:</strong> {movie.runtime} minutes
                </Typography>
            </CardContent>
        </Card>
    );
};

export default MovieCard;