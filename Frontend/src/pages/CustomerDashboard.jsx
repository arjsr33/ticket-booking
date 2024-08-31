import React from 'react';
import { useSelector } from 'react-redux';
import { 
  Container, Typography, Grid, Card, CardContent, CardMedia, 
  CardActionArea 
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CustomerDashboard = () => {
  const movies = useSelector((state) => state.movies.list);
  const navigate = useNavigate();

  return (
    <Container maxWidth="lg">
      <Typography variant="h4" gutterBottom>Your Dashboard</Typography>
      <Grid container spacing={4}>
        {movies.map((movie) => (
          <Grid item key={movie.id} xs={12} sm={6} md={4}>
            <Card>
              <CardActionArea onClick={() => navigate(`/movie/${movie.id}`)}>
                <CardMedia
                  component="img"
                  height="300"
                  image={movie.images.square}
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
    </Container>
  );
};

export default CustomerDashboard;