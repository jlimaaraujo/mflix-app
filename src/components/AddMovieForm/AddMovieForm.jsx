import React, { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    Grid,
    Typography,
    Box,
    Alert
} from '@mui/material';
import { addMovie } from '../../services/api';

const AddMovieForm = ({ open, onClose, onMovieAdded }) => {
    const [formData, setFormData] = useState({
        title: '',
        plot: '',
        year: '',
        directors: [],
        cast: [],
        genres: [],
        runtime: '',
        poster: '',
        imdb: { rating: '' }
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [validationErrors, setValidationErrors] = useState({});

    const mandatoryFields = [
        'title', 'plot', 'year', 'directors', 'cast', 'genres', 'runtime'
    ];

    const validateForm = () => {
        const errors = {};
        let isValid = true;

        mandatoryFields.forEach(field => {
            if (field.includes('.')) {
                const [parent, child] = field.split('.');
                if (!formData[parent][child]) {
                    errors[field] = 'This field is required';
                    isValid = false;
                }
            } else {
                if (!formData[field] || (Array.isArray(formData[field]) && formData[field].length === 0)) {
                    errors[field] = 'This field is required';
                    isValid = false;
                }
            }
        });

        // Additional validation for year and runtime
        if (formData.year && isNaN(formData.year)) {
            errors.year = 'Please enter a valid year';
            isValid = false;
        }

        if (formData.runtime && isNaN(formData.runtime)) {
            errors.runtime = 'Please enter a valid runtime';
            isValid = false;
        }

        setValidationErrors(errors);
        return isValid;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Clear validation error when user types
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }

        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleArrayChange = (e) => {
        const { name, value } = e.target;
        const arrayValue = value.split(',').map(item => item.trim()).filter(item => item);

        // Clear validation error when user types
        if (validationErrors[name]) {
            setValidationErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }

        setFormData(prev => ({
            ...prev,
            [name]: arrayValue
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const movieToAdd = {
                ...formData,
                year: parseInt(formData.year),
                runtime: parseInt(formData.runtime),
                imdb: {
                    rating: parseFloat(formData.imdb.rating) || 0
                }
            };

            await addMovie(movieToAdd);
            onMovieAdded();
            onClose();
            // Reset form after successful submission
            setFormData({
                title: '',
                plot: '',
                year: '',
                directors: [],
                cast: [],
                genres: [],
                runtime: '',
                poster: '',
                imdb: { rating: '' }
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography variant="h5">Add New Movie</Typography>
            </DialogTitle>
            <DialogContent>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
                    {Object.keys(validationErrors).length > 0 && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            Please fill in all required fields
                        </Alert>
                    )}

                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Title *"
                                name="title"
                                value={formData.title}
                                onChange={handleChange}
                                error={!!validationErrors.title}
                                helperText={validationErrors.title}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Year *"
                                name="year"
                                type="number"
                                value={formData.year}
                                onChange={handleChange}
                                error={!!validationErrors.year}
                                helperText={validationErrors.year}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Runtime (minutes) *"
                                name="runtime"
                                type="number"
                                value={formData.runtime}
                                onChange={handleChange}
                                error={!!validationErrors.runtime}
                                helperText={validationErrors.runtime}
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Plot *"
                                name="plot"
                                value={formData.plot}
                                onChange={handleChange}
                                error={!!validationErrors.plot}
                                helperText={validationErrors.plot}
                                multiline
                                rows={4}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Directors (comma separated) *"
                                name="directors"
                                value={formData.directors.join(', ')}
                                onChange={handleArrayChange}
                                error={!!validationErrors.directors}
                                helperText={validationErrors.directors}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Cast (comma separated) *"
                                name="cast"
                                value={formData.cast.join(', ')}
                                onChange={handleArrayChange}
                                error={!!validationErrors.cast}
                                helperText={validationErrors.cast}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="Genres (comma separated) *"
                                name="genres"
                                value={formData.genres.join(', ')}
                                onChange={handleArrayChange}
                                error={!!validationErrors.genres}
                                helperText={validationErrors.genres}
                                required
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                label="IMDb Rating"
                                name="imdb.rating"
                                type="number"
                                step="0.1"
                                value={formData.imdb.rating}
                                onChange={handleChange}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Poster URL"
                                name="poster"
                                value={formData.poster}
                                onChange={handleChange}
                            />
                        </Grid>
                    </Grid>

                    {error && (
                        <Typography color="error" sx={{ mt: 2 }}>
                            Error: {error}
                        </Typography>
                    )}
                </Box>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Cancel</Button>
                <Button
                    onClick={handleSubmit}
                    variant="contained"
                    disabled={loading}
                >
                    {loading ? 'Adding...' : 'Add Movie'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddMovieForm;