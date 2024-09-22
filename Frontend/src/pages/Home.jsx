import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Grid, Card, CardMedia, CardContent, 
  CardActions, Button, Box 
} from '@mui/material';
import { fetchMovies } from '../redux/movieSlice';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: movies, loading, error } = useSelector((state) => state.movies);
  const { isAuthenticated } = useSelector((state) => state.user);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const handleBooking = (movieId) => {
    if (isAuthenticated) {
      navigate(`/book/${movieId}`);
    } else {
      navigate('/login');
    }
  };

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">Error: {error}</Typography>;

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom align="center">
          Welcome to Chandni Movies
        </Typography>
        <Typography variant="h6" align="center" color="text.secondary" paragraph>
          These are the movies currently playing
        </Typography>
      </Box>
      <Grid container spacing={4}>
        {movies.map((movie) => (
          <Grid item key={movie._id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                sx={{ height: 450, objectFit: 'cover' }}
                image={movie.images.poster}
                alt={movie.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {movie.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {movie.language} | {movie.category}
                </Typography>
              </CardContent>
              <CardActions>
                <Button size="small" onClick={() => handleBooking(movie._id)}>
                  Book Now
                </Button>
                <Button size="small" onClick={() => navigate(`/movie/${movie._id}`)}>
                  Learn More
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;