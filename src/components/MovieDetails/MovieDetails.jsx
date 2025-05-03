import React, { useState } from 'react';
import { addComment, deleteComment, updateComment } from '../../services/api';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    Typography,
    Box,
    Divider,
    List,
    ListItem,
    ListItemText,
    TextField,
    Button,
    CircularProgress,
    CardMedia
} from '@mui/material';

const MovieDetails = ({ open, onClose, movieDetails, detailsLoading }) => {
    const [newComment, setNewComment] = useState({ name: '', email: '', text: '' });
    const [editingComment, setEditingComment] = useState(null);
    const [updatedText, setUpdatedText] = useState('');

    const handleAddComment = async () => {
        if (!newComment.name.trim() || !newComment.email.trim() || !newComment.text.trim()) {
            console.error('Invalid input: All fields are required.');
            return;
        }
        try {
            const response = await addComment(movieDetails._id, newComment.name, newComment.email, newComment.text);

            const comment = {
                _id: response.comment._id,
                name: response.comment.name,
                email: response.comment.email,
                text: response.comment.text,
                date: response.comment.date
            };

            movieDetails.comments.push(comment);
            setNewComment({ name: '', email: '', text: '' });
        } catch (error) {
            console.error('Error adding comment:', error);
        }
    };

    const handleDeleteComment = async (commentId) => {
        try {
            await deleteComment(commentId);
            movieDetails.comments = movieDetails.comments.filter(c => c._id !== commentId);
        } catch (error) {
            console.error('Error deleting comment:', error);
        }
    };

    const handleUpdateComment = async (commentId) => {
        if (!updatedText.trim()) return;
        try {
            await updateComment(commentId, updatedText);

            const comment = movieDetails.comments.find(c => c._id === commentId);
            if (comment) {
                comment.text = updatedText;
            }

            setEditingComment(null);
            setUpdatedText('');
        } catch (error) {
            console.error('Error updating comment:', error);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle>
                <Typography variant="h4" component="div" align="center" fontWeight="bold">
                    {movieDetails?.title || 'Movie Details'}
                </Typography>
            </DialogTitle>
            <DialogContent>
                {detailsLoading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    movieDetails && (
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 3 }}>
                            <Box sx={{ flex: 1 }}>
                                <CardMedia
                                    component="img"
                                    sx={{
                                        width: '100%',
                                        height: 'auto',
                                        maxHeight: 400,
                                        objectFit: 'contain',
                                        borderRadius: 1
                                    }}
                                    image={movieDetails.poster || `${process.env.PUBLIC_URL}/images/image.png`}
                                    alt={`${movieDetails.title} poster`}
                                    onError={(e) => {
                                        e.target.onerror = null;
                                        e.target.src = `${process.env.PUBLIC_URL}/images/image.png`;
                                    }}
                                />
                            </Box>
                            <Box sx={{ flex: 2 }}>
                                <Typography variant="h5" gutterBottom>
                                    {movieDetails.title} ({movieDetails.year})
                                </Typography>
                                <Typography variant="subtitle1" gutterBottom>
                                    <strong>Director:</strong> {movieDetails.directors?.join(', ') || 'N/A'}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Full Cast:</strong> {movieDetails.cast?.join(', ') || 'N/A'}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Genres:</strong> {movieDetails.genres?.join(', ') || 'N/A'}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Plot:</strong> {movieDetails.plot || 'No plot available'}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>IMDb Rating:</strong> {movieDetails.imdb?.rating || 'N/A'}
                                    {movieDetails.imdb?.votes && ` (${movieDetails.imdb.votes} votes)`}
                                </Typography>
                                <Typography variant="body1">
                                    <strong>Runtime:</strong> {movieDetails.runtime || 'N/A'} minutes
                                </Typography>

                                <Divider sx={{ my: 3 }} />

                                <Typography variant="h6" gutterBottom>
                                    Comments ({movieDetails.comments?.length || 0})
                                </Typography>
                                {movieDetails.comments?.length > 0 ? (
                                    <List>
                                        {movieDetails.comments.map((comment) => (
                                            <React.Fragment key={comment._id}>
                                                <ListItem alignItems="flex-start">
                                                    {editingComment === comment._id ? (
                                                        <Box>
                                                            <TextField
                                                                value={updatedText}
                                                                onChange={(e) => setUpdatedText(e.target.value)}
                                                                fullWidth
                                                            />
                                                            <Button onClick={() => handleUpdateComment(comment._id)}>
                                                                Save
                                                            </Button>
                                                            <Button onClick={() => setEditingComment(null)}>
                                                                Cancel
                                                            </Button>
                                                        </Box>
                                                    ) : (
                                                        <ListItemText
                                                            primary={`${comment.name || 'Unknown'} (${comment.email || 'No email'})`}
                                                            secondary={
                                                                <>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {typeof comment.text === 'string' ? comment.text : JSON.stringify(comment.text)}
                                                                    </Typography>
                                                                    <Typography variant="caption" color="text.secondary">
                                                                        {new Date(comment.date).toLocaleDateString()}
                                                                    </Typography>
                                                                </>
                                                            }
                                                        />
                                                    )}
                                                    <Button onClick={() => setEditingComment(comment._id)}>Edit</Button>
                                                    <Button onClick={() => handleDeleteComment(comment._id)}>
                                                        Delete
                                                    </Button>
                                                </ListItem>
                                                <Divider />
                                            </React.Fragment>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No comments yet
                                    </Typography>
                                )}
                                <Box sx={{ mt: 2 }}>
                                    <TextField
                                        value={newComment.name}
                                        onChange={(e) => setNewComment({ ...newComment, name: e.target.value })}
                                        label="Name"
                                        fullWidth
                                        sx={{ mb: 1 }}
                                    />
                                    <TextField
                                        value={newComment.email}
                                        onChange={(e) => setNewComment({ ...newComment, email: e.target.value })}
                                        label="Email"
                                        fullWidth
                                        sx={{ mb: 1 }}
                                    />
                                    <TextField
                                        value={newComment.text}
                                        onChange={(e) => setNewComment({ ...newComment, text: e.target.value })}
                                        label="Comment"
                                        fullWidth
                                        multiline
                                        rows={3}
                                    />
                                    <Button onClick={handleAddComment} variant="contained" sx={{ mt: 1 }}>
                                        Add Comment
                                    </Button>
                                </Box>
                            </Box>
                        </Box>
                    )
                )}
            </DialogContent>
        </Dialog>
    );
};

export default MovieDetails;