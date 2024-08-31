import React from 'react';
import { Grid, Card, CardContent, CardMedia, Typography, Chip } from '@mui/material';
import { Link } from 'react-router-dom';

const MovieList = ({ movies }) => {
  return (
    <Grid container spacing={3}>
      {movies.map((movie) => (
        <Grid item xs={12} sm={6} md={4} key={movie.id}>
          <Card component={Link} to={`/movie/${movie.id}`} sx={{ textDecoration: 'none' }}>
            <CardMedia
              component="img"
              height="300"
              image={movie.image}
              alt={movie.title}
            />
            <CardContent>
              <Typography gutterBottom variant="h6" component="div">
                {movie.title}
              </Typography>
              <Chip label={movie.category} size="small" sx={{ mr: 1 }} />
              <Chip label={movie.language} size="small" />
            </CardContent>
          </Card>
        </Grid>
      ))}
    </Grid>
  );
};

export default MovieList;
