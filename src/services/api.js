import axios from 'axios';

const API_BASE = process.env.REACT_APP_API_BASE;

const api = axios.create({
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json'
    }
});

export const getMovies = async (page = 1, limit = 10) => {
    try {
        const { data } = await api.get(`${API_BASE}/getMovies`, {
            params: { page, limit }
        });
        return data;
    } catch (error) {
        console.error('API Error:', error.response?.data || error.message);
        throw new Error(error.response?.data?.error || 'Failed to fetch movies');
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

export const addComment = async (movieId, name, email, text) => {
    const response = await fetch('/.netlify/functions/addComment', {
        method: 'POST',
        body: JSON.stringify({ movieId, name, email, text }),
        headers: {
            'Content-Type': 'application/json',
        },
    });
    return await response.json();
};

export const deleteComment = async (commentId) => {
    try {
        await axios.delete(`${API_BASE}/deleteComment`, { data: { commentId } });
    } catch (error) {
        console.error('Error deleting comment:', error);
        throw error;
    }
};

export const updateComment = async (commentId, text) => {
    try {
        await axios.put(`${API_BASE}/updateComment`, { commentId, text });
    } catch (error) {
        console.error('Error updating comment:', error);
        throw error;
    }
};