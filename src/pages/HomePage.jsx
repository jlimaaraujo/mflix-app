import React, { useEffect, useState } from 'react';
import { getMovies, getMovie, searchMovies } from '../services/api';
import { Box, CircularProgress, Button, Typography } from '@mui/material';
import SearchBar from '../components/SearchBar/SearchBar';
import MovieGrid from '../components/MovieGrid/MovieGrid';
import MovieDetails from '../components/MovieDetails/MovieDetails';
import AddMovieForm from '../components/AddMovieForm/AddMovieForm';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

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

    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const isValidImageUrl = (url) => {
        if (!url) return false;
        return url.trim() !== '';
    };

    const loadMovies = async (page = 1) => {
        setLoading(true);
        try {
            const data = await getMovies(page);
            setMovies(data.movies);
            setTotalPages(data.totalPages);
            setCurrentPage(data.currentPage);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
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
            setTotalPages(1); // Reset pagination for search results
            setCurrentPage(1);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const clearSearch = async () => {
        setSearchQuery('');
        setIsSearchActive(false);
        loadMovies();
    };

    const handleMovieAdded = async () => {
        loadMovies();
    };

    const handlePageChange = (newPage) => {
        loadMovies(newPage);
    };

    if (loading) return (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
            <CircularProgress />
        </Box>
    );

    if (error) return <div>Error: {error}</div>;

    return (
        <div className="HomePage">
            <h1>MongoDB Movies</h1>

            <Box sx={{alignItems: 'center', mb: 2 }}>
                <SearchBar
                    searchQuery={searchQuery}
                    setSearchQuery={setSearchQuery}
                    handleSearch={handleSearch}
                    clearSearch={clearSearch}
                    isSearchActive={isSearchActive}
                />
                <Button
                    sx={{ color: '#fefae0' }}
                    color='#fefae0'
                    variant="outlined"
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

            {/* Pagination Controls */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
                <Button
                    disabled={currentPage === 1}
                    sx={{ color: '#fefae0' }}
                    onClick={() => handlePageChange(currentPage - 1)}
                    variant="outlined"
                    color="#fefae0"
                    size="small"
                    startIcon={<ArrowBackIcon />}

                >
                    <b>Previous</b>
                </Button>
                <Typography variant="body1" sx={{ mx: 2, color: '#fefae0' }}>
                    Page {currentPage} of {totalPages}
                </Typography>
                <Button
                    disabled={currentPage === totalPages}
                    sx={{ color: '#fefae0' }}
                    onClick={() => handlePageChange(currentPage + 1)}
                    variant="outlined"
                    size="small"
                    color="#fefae0"
                    endIcon={<ArrowForwardIcon />}
                >
                    <b>Next</b>
                </Button>
            </Box>

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