import React from 'react';
import {
    Dialog,
    DialogContent,
    DialogTitle,
    Typography,
    Box,
    CardMedia,
    Divider,
    List,
    ListItem,
    ListItemText,
    CircularProgress
} from '@mui/material';

const MovieDetails = ({
    open,
    onClose,
    movieDetails,
    detailsLoading,
}) => {
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
                                        {movieDetails.comments.map((comment, index) => (
                                            <React.Fragment key={comment._id}>
                                                <ListItem alignItems="flex-start">
                                                    <ListItemText
                                                        primary={comment.text}
                                                        secondary={new Date(comment.date).toLocaleDateString()}
                                                    />
                                                </ListItem>
                                                {index < movieDetails.comments.length - 1 && <Divider />}
                                            </React.Fragment>
                                        ))}
                                    </List>
                                ) : (
                                    <Typography variant="body2" color="text.secondary">
                                        No comments yet
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                    )
                )}
            </DialogContent>
        </Dialog>
    );
};

export default MovieDetails;