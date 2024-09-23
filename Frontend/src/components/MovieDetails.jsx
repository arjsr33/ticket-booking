import React, { useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Typography, Card, CardContent, CardMedia, Chip, Button, Box,
  List, ListItem, ListItemText, Divider, Rating
} from '@mui/material';
import { useSelector, useDispatch } from 'react-redux';
import { fetchMovie, clearCurrentMovie } from '../redux/movieSlice';

const MovieDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Fetch the current movie from the store
  const movie = useSelector((state) => state.movies.currentMovie);
  const loading = useSelector((state) => state.movies.loading);
  const error = useSelector((state) => state.movies.error);
  const isAuthenticated = useSelector((state) => state.user.isAuthenticated);

  // Fetch movie details when the component mounts
  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/movie/${id}` } });
      return;
    }

    dispatch(fetchMovie(id));

    // Clear the current movie when the component unmounts
    return () => {
      dispatch(clearCurrentMovie());
    };
  }, [dispatch, id, isAuthenticated, navigate]);

  if (!isAuthenticated) return null; // Prevent rendering while redirecting
  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!movie) return <Typography>Movie not found</Typography>;

  return (
    <Card>
      <CardMedia
        component="img"
        image={movie.images.cover} 
        alt={movie.title}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent>
        <Typography variant="h4" gutterBottom>{movie.title}</Typography>
        <Box sx={{ mb: 2 }}>
          <Chip label={movie.category} sx={{ mr: 1 }} />
          <Chip label={movie.language} />
        </Box>
        <Typography variant="body1" paragraph>{movie.description}</Typography>
        <Typography variant="h6" gutterBottom>Cast</Typography>
        <List>
          {movie.cast.map((actor, index) => (
            <ListItem key={index}>
              <ListItemText primary={actor} />
            </ListItem>
          ))}
        </List>
        <Divider sx={{ my: 2 }} />
        <Typography variant="h6" gutterBottom>Reviews</Typography>
        <Box sx={{ mb: 2 }}>
          <Typography component="legend">Average Rating</Typography>
          <Rating name="read-only" value={movie.rating} readOnly precision={0.1} />
          <Typography variant="body2">({movie.rating.toFixed(1)})</Typography>
        </Box>
        {movie.reviews.map((review, index) => (
          <Typography key={index} variant="body2" paragraph>"{review}"</Typography>
        ))}
        <Button 
          variant="contained" 
          color="primary" 
          component={Link} 
          to={`/book/${movie._id}`}
          sx={{ mt: 2 }}
        >
          Book Ticket
        </Button>
      </CardContent>
    </Card>
  );
};

export default MovieDetails;