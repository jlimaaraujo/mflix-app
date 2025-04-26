import React, { useEffect, useState } from 'react';
import { getMovies, getMovie, searchMovies } from '../services/api';
import { Box, CircularProgress } from '@mui/material';
import SearchBar from '../components/SearchBar/SearchBar';
import MovieGrid from '../components/MovieGrid/MovieGrid';
import MovieDetails from '../components/MovieDetails/MovieDetails';
import AddMovieForm from '../components/AddMovieForm/AddMovieForm';
import AddIcon from '@mui/icons-material/Add';
import Button from '@mui/material/Button';

const HomePage = () => {
    const [movies, setMovies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [movieDetails, setMovieDetails] = useState(null);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [isSearchActive, setIsSearchActive] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);

    const isValidImageUrl = (url) => {
        if (!url) return false;
        return url.trim() !== '';
    };

    useEffect(() => {
        const loadMovies = async () => {
            try {
                const data = await getMovies();
                setMovies(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };
        loadMovies();
    }, []);

    const handleCardClick = async (movieId) => {
        setOpen(true);
        setDetailsLoading(true);
        try {
            const data = await getMovie(movieId);
            setMovieDetails(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setDetailsLoading(false);
        }
    };

    const handleClose = () => {
        setOpen(false);
        setMovieDetails(null);
    };

    const handleSearch = async () => {
        if (!searchQuery.trim()) return;

        setLoading(true);
        setIsSearchActive(true);
        try {
            const data = await searchMovies(searchQuery);
            setMovies(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = async () => {
        setSearchQuery('');
        setIsSearchActive(false);
        setLoading(true);
        try {
            const data = await getMovies();
            setMovies(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleMovieAdded = async () => {
        setLoading(true);
        try {
            const data = await getMovies();
            setMovies(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
        </Box>
    );

    if (error) return <div>Error: {error}</div>;

    return (
        <div className="HomePage">
            <h1>MongoDB Movies - sample_mflix</h1>

            <SearchBar
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                handleSearch={handleSearch}
                clearSearch={clearSearch}
                isSearchActive={isSearchActive}
            />

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2, mr:4 }}>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setAddDialogOpen(true)}
                >
                    Add Movie
                </Button>
            </Box>

            <AddMovieForm
                open={addDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                onMovieAdded={handleMovieAdded}
            />

            <MovieGrid
                movies={movies}
                isSearchActive={isSearchActive}
                searchQuery={searchQuery}
                clearSearch={clearSearch}
                onCardClick={handleCardClick}
            />

            <MovieDetails
                open={open}
                onClose={handleClose}
                movieDetails={movieDetails}
                detailsLoading={detailsLoading}
                isValidImageUrl={isValidImageUrl}
            />

        </div>
    );
};

export default HomePage;