import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Container, Typography, Grid, Card, CardContent, CardMedia, 
  CardActionArea, CircularProgress 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { fetchMovies } from '../redux/movieSlice';
import Footer from './components/Footer';


const CustomerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: movies, loading, error } = useSelector((state) => state.movies);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  if (loading) return <CircularProgress />;
  if (error) return <Typography color="error">{error}</Typography>;

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Select a movie to book your Tickets</Typography>
      <Grid container spacing={4}>
        {movies.map((movie) => (
          <Grid item key={movie._id} xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea onClick={() => navigate(`/movie/${movie._id}`)}>
                <CardMedia
                  component="img"
                  height="300"
                  image={movie.images.poster}
                  alt={movie.title}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {movie.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {movie.language} | {movie.category}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
      <Footer />
    </Container>
  );
};

export default CustomerDashboard;