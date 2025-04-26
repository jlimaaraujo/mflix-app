import React from 'react';
import { Box, Container, Typography, Button } from '@mui/material';
import MovieCard from '../MovieCard/MovieCard';

const MovieGrid = ({ movies, isSearchActive, searchQuery, clearSearch, onCardClick }) => {
    // Create pairs of movies for two-column layout
    const rows = [];
    for (let i = 0; i < movies.length; i += 2) {
        if (i + 1 < movies.length) {
            rows.push([movies[i], movies[i + 1]]);
        } else {
            rows.push([movies[i]]);
        }
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 2 }}>
            {isSearchActive && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                    <Typography variant="subtitle1">
                        Search results for: "{searchQuery}" ({movies.length} movies found)
                    </Typography>
                </Box>
            )}

            {movies.length === 0 && isSearchActive ? (
                <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary">
                        No movies found matching your search
                    </Typography>
                    <Button
                        onClick={clearSearch}
                        variant="contained"
                        sx={{ mt: 2 }}
                    >
                        Show all movies
                    </Button>
                </Box>
            ) : (
                rows.map((row, rowIndex) => (
                    <Box
                        key={rowIndex}
                        sx={{
                            display: 'flex',
                            flexDirection: 'row',
                            width: '100%',
                            mb: 2
                        }}
                    >
                        {row.map((movie) => (
                            <Box
                                key={movie._id}
                                sx={{
                                    width: '50%',
                                    px: 1,
                                    cursor: 'pointer'
                                }}
                                onClick={() => onCardClick(movie._id)}
                            >
                                <MovieCard movie={movie} />
                            </Box>
                        ))}
                        {row.length === 1 && (
                            <Box sx={{ width: '50%', px: 1 }}></Box>
                        )}
                    </Box>
                ))
            )}
        </Container>
    );
};

export default MovieGrid;