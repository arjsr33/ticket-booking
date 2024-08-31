// src/components/MovieDetails.jsx
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Typography, Card, CardContent, CardMedia, Chip, Button, Box,
  List, ListItem, ListItemText, Divider, Rating
} from '@mui/material';
import { useSelector } from 'react-redux';

const MovieDetails = () => {
  const { id } = useParams();
  const movie = useSelector((state) => 
    state.movies.list.find(m => m.id === parseInt(id))
  );

  if (!movie) return <Typography>Movie not found</Typography>;

  return (
    <Card>
      <CardMedia
        component="img"
        height="400"
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
          to={`/book/${movie.id}`}
          sx={{ mt: 2 }}
        >
          Book Ticket
        </Button>
      </CardContent>
    </Card>
  );
};

export default MovieDetails;