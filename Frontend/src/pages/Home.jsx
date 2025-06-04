import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { 
  Container, Typography, Grid, Card, CardMedia, CardContent, 
  CardActions, Button, Box, Chip,
  IconButton, Fade, Rating, alpha
} from '@mui/material';
import { 
  BookmarkBorder, 
  PlayArrow, 
  Star,
  AccessTime,
  Language
} from '@mui/icons-material';
import { fetchMovies } from '../redux/movieSlice';
import AdvancedSearchComponent from '../components/AdvancedSearchComponent';

const Home = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: movies, loading, error } = useSelector((state) => state.movies);
  const { isAuthenticated } = useSelector((state) => state.user);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    language: '',
    category: '',
    rating: [0, 5],
    sortBy: 'title'
  });
  const [filteredMovies, setFilteredMovies] = useState([]);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  useEffect(() => {
    if (movies.length > 0) {
      let filtered = movies.filter(movie => {
        const matchesSearch = movie.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movie.language.toLowerCase().includes(searchTerm.toLowerCase()) ||
          movie.category.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesLanguage = !filters.language || movie.language === filters.language;
        const matchesCategory = !filters.category || movie.category === filters.category;
        const movieRating = movie.rating || 4.5;
        const matchesRating = movieRating >= filters.rating[0] && movieRating <= filters.rating[1];
        
        return matchesSearch && matchesLanguage && matchesCategory && matchesRating;
      });

      // Apply sorting
      filtered.sort((a, b) => {
        switch (filters.sortBy) {
          case 'rating':
            return (b.rating || 4.5) - (a.rating || 4.5);
          case 'language':
            return a.language.localeCompare(b.language);
          case 'category':
            return a.category.localeCompare(b.category);
          case 'title':
          default:
            return a.title.localeCompare(b.title);
        }
      });

      setFilteredMovies(filtered);
    }
  }, [movies, searchTerm, filters]);

  const handleBooking = (movieId) => {
    if (isAuthenticated) {
      navigate(`/book/${movieId}`);
    } else {
      navigate('/login');
    }
  };

  const handleSearchChange = (search) => {
    setSearchTerm(search);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <Typography variant="h4" sx={{ 
        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        Loading Premium Cinema Experience...
      </Typography>
    </Box>
  );

  if (error) return (
    <Container>
      <Typography color="error" variant="h5" align="center">
        Error: {error}
      </Typography>
    </Container>
  );

  return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(135deg, 
          #0a0a0a 0%, 
          #1a1a2e 25%, 
          #16213e 50%, 
          #1a1a2e 75%, 
          #0a0a0a 100%)`,
        pt: 4,
        pb: 8
      }}
    >
      <Container maxWidth="xl">
        {/* Hero Section */}
        <Box sx={{ my: 6, textAlign: 'center' }}>
          <Typography 
            variant="h2" 
            component="h1" 
            gutterBottom 
            sx={{
              fontWeight: 800,
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              letterSpacing: '2px',
              fontFamily: '"Cinzel", "Georgia", serif',
              mb: 3
            }}
          >
            PREMIUM CINEMA EXPERIENCE
          </Typography>
          <Typography 
            variant="h5" 
            align="center" 
            sx={{ 
              color: alpha('#fff', 0.8),
              mb: 4,
              fontWeight: 300,
              letterSpacing: '1px'
            }}
          >
            Discover extraordinary films in our luxury theaters
          </Typography>

          {/* Search Section */}
          <AdvancedSearchComponent
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            movies={movies}
            placeholder="Search premium movies by title, language, or genre..."
          />

          {/* Results Counter */}
          {(searchTerm || filters.language || filters.category || filters.rating[0] > 0 || filters.rating[1] < 5) && (
            <Typography 
              variant="body1" 
              sx={{ 
                color: alpha('#fff', 0.7),
                mb: 3,
                fontStyle: 'italic',
                textAlign: 'center'
              }}
            >
              Found {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''}
            </Typography>
          )}
        </Box>

        {/* Movies Grid */}
        <Grid container spacing={4}>
          {filteredMovies.map((movie, index) => (
            <Grid item key={movie._id} xs={12} sm={6} md={4} lg={3}>
              <Fade in={true} timeout={300 + index * 100}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    background: `linear-gradient(135deg, 
                      rgba(255, 255, 255, 0.1) 0%, 
                      rgba(255, 255, 255, 0.05) 100%)`,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha('#fff', 0.1)}`,
                    borderRadius: 3,
                    overflow: 'hidden',
                    transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                    cursor: 'pointer',
                    '&:hover': {
                      transform: 'translateY(-8px) scale(1.02)',
                      boxShadow: `
                        0 20px 40px ${alpha('#000', 0.4)},
                        0 0 20px ${alpha('#FFD700', 0.2)}
                      `,
                      border: `1px solid ${alpha('#FFD700', 0.3)}`,
                    }
                  }}
                >
                  <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                    <CardMedia
                      component="img"
                      sx={{ 
                        height: 400, 
                        objectFit: 'cover',
                        transition: 'transform 0.4s ease',
                        '&:hover': {
                          transform: 'scale(1.1)'
                        }
                      }}
                      image={movie.images.poster}
                      alt={movie.title}
                    />
                    {/* Rating Badge */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 12,
                        right: 12,
                        background: `linear-gradient(135deg, 
                          rgba(0, 0, 0, 0.8) 0%, 
                          rgba(0, 0, 0, 0.6) 100%)`,
                        backdropFilter: 'blur(10px)',
                        borderRadius: 2,
                        px: 1,
                        py: 0.5,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5
                      }}
                    >
                      <Star sx={{ color: '#FFD700', fontSize: '1rem' }} />
                      <Typography variant="body2" sx={{ color: 'white', fontWeight: 600 }}>
                        {movie.rating?.toFixed(1) || '4.5'}
                      </Typography>
                    </Box>

                    {/* Bookmark Icon */}
                    <IconButton
                      sx={{
                        position: 'absolute',
                        top: 12,
                        left: 12,
                        background: `linear-gradient(135deg, 
                          rgba(0, 0, 0, 0.8) 0%, 
                          rgba(0, 0, 0, 0.6) 100%)`,
                        backdropFilter: 'blur(10px)',
                        color: 'white',
                        '&:hover': {
                          background: alpha('#FFD700', 0.8),
                          color: '#000',
                        }
                      }}
                      size="small"
                    >
                      <BookmarkBorder fontSize="small" />
                    </IconButton>
                  </Box>

                  <CardContent sx={{ flexGrow: 1, p: 3 }}>
                    <Typography 
                      gutterBottom 
                      variant="h6" 
                      component="h2"
                      sx={{ 
                        color: 'white',
                        fontWeight: 600,
                        mb: 2,
                        lineHeight: 1.3
                      }}
                    >
                      {movie.title}
                    </Typography>

                    <Box sx={{ display: 'flex', gap: 1, mb: 2, flexWrap: 'wrap' }}>
                      <Chip 
                        icon={<Language />}
                        label={movie.language} 
                        size="small" 
                        sx={{ 
                          background: alpha('#FFD700', 0.2),
                          color: '#FFD700',
                          border: `1px solid ${alpha('#FFD700', 0.3)}`,
                          fontWeight: 500
                        }} 
                      />
                      <Chip 
                        label={movie.category} 
                        size="small" 
                        sx={{ 
                          background: alpha('#4FC3F7', 0.2),
                          color: '#4FC3F7',
                          border: `1px solid ${alpha('#4FC3F7', 0.3)}`,
                          fontWeight: 500
                        }} 
                      />
                    </Box>

                    <Typography 
                      variant="body2" 
                      sx={{ 
                        color: alpha('#fff', 0.7),
                        lineHeight: 1.6,
                        mb: 2
                      }}
                    >
                      {movie.description?.substring(0, 120)}...
                    </Typography>

                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <AccessTime sx={{ color: alpha('#fff', 0.5), mr: 1, fontSize: '1rem' }} />
                      <Typography variant="caption" sx={{ color: alpha('#fff', 0.7) }}>
                        Duration: 2h 30min
                      </Typography>
                    </Box>

                    <Rating 
                      value={movie.rating || 4.5} 
                      precision={0.1} 
                      readOnly 
                      size="small"
                      sx={{
                        '& .MuiRating-iconFilled': {
                          color: '#FFD700',
                        },
                        '& .MuiRating-iconEmpty': {
                          color: alpha('#FFD700', 0.3),
                        }
                      }}
                    />
                  </CardContent>

                  <CardActions sx={{ p: 3, pt: 0 }}>
                    <Button 
                      size="large"
                      onClick={() => handleBooking(movie._id)}
                      fullWidth
                      startIcon={<PlayArrow />}
                      sx={{
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                        color: '#000',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        py: 1.5,
                        borderRadius: 2,
                        boxShadow: `0 4px 15px ${alpha('#FFD700', 0.4)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #FFE55C 0%, #FFB347 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: `0 6px 20px ${alpha('#FFD700', 0.6)}`,
                        }
                      }}
                    >
                      Book Premium Seats
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => navigate(`/movie/${movie._id}`)}
                      sx={{ 
                        color: alpha('#fff', 0.8),
                        fontWeight: 500,
                        '&:hover': {
                          color: '#FFD700',
                          background: alpha('#FFD700', 0.1)
                        }
                      }}
                    >
                      View Details
                    </Button>
                  </CardActions>
                </Card>
              </Fade>
            </Grid>
          ))}
        </Grid>

        {/* No Results Message */}
        {(searchTerm || filters.language || filters.category || filters.rating[0] > 0 || filters.rating[1] < 5) && filteredMovies.length === 0 && (
          <Box sx={{ textAlign: 'center', mt: 8 }}>
            <Typography 
              variant="h5" 
              sx={{ 
                color: alpha('#fff', 0.6),
                mb: 2 
              }}
            >
              No movies found matching your criteria
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: alpha('#fff', 0.4) 
              }}
            >
              Try adjusting your search terms or filters to discover more movies
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Home;