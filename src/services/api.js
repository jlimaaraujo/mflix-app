import axios from 'axios';

const API_BASE = process.env.NODE_ENV === 'development'
    ? 'http://localhost:8888/.netlify/functions'
    : '/.netlify/functions';

export const getMovies = async () => {
    try {
        const response = await axios.get(`${API_BASE}/getMovies`);
        return response.data;
    } catch (error) {
        console.error('Error fetching movies:', error);
        throw error;
    }
};

export const getMovie = async (id) => {
    try {
        const response = await axios.get(`${API_BASE}/getMovie`, {
            params: { id }
        });

        // Transform the response data if needed
        const movieData = response.data;

        // Ensure comments array exists and has consistent structure
        if (!movieData.comments) {
            movieData.comments = [];
        }

        // Format comment dates if they're strings
        movieData.comments = movieData.comments.map(comment => ({
            ...comment,
            date: comment.date ? new Date(comment.date) : new Date()
        }));

        return movieData;
    } catch (error) {
        console.error('Error fetching movie details:', error);
        throw error;
    }
};

export const searchMovies = async (query) => {
    try {
        const response = await axios.get(`${API_BASE}/searchMovies`, {
            params: { query }
        });
        return response.data;
    } catch (error) {
        console.error('Error searching movies:', error);
        throw error;
    }
};

export const addMovie = async (movieData) => {
    try {
        const response = await axios.post(`${API_BASE}/addMovie`, movieData);
        return response.data;
    } catch (error) {
        console.error('Error adding movie:', error);
        throw error;
    }
};