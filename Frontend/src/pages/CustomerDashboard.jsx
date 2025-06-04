import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  Container, Typography, Grid, Card, CardContent, CardMedia, 
  CardActionArea, Box, Chip, IconButton, Rating, Fade, alpha,
  Button, CardActions
} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { 
  BookmarkBorder,
  PlayArrow,
  Star,
  AccessTime,
  Language,
  Visibility
} from '@mui/icons-material';
import { fetchMovies } from '../redux/movieSlice';
import AdvancedSearchComponent from '../components/AdvancedSearchComponent';

const CustomerDashboard = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { list: movies, loading, error } = useSelector((state) => state.movies);
  const { currentUser } = useSelector((state) => state.user);
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

  const handleSearchChange = (search) => {
    setSearchTerm(search);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
  };

  if (loading) return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="80vh"
      sx={{
        background: `linear-gradient(135deg, 
          #0a0a0a 0%, 
          #1a1a2e 25%, 
          #16213e 50%, 
          #1a1a2e 75%, 
          #0a0a0a 100%)`
      }}
    >
      <Typography variant="h4" sx={{ 
        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      }}>
        Loading Your Premium Experience...
      </Typography>
    </Box>
  );

  if (error) return (
    <Box 
      sx={{ 
        minHeight: '100vh',
        background: `linear-gradient(135deg, 
          #0a0a0a 0%, 
          #1a1a2e 25%, 
          #16213e 50%, 
          #1a1a2e 75%, 
          #0a0a0a 100%)`,
        pt: 4
      }}
    >
      <Container>
        <Typography color="error" variant="h5" align="center" sx={{ color: '#ff5252' }}>
          Error: {error}
        </Typography>
      </Container>
    </Box>
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
        {/* Welcome Header */}
        <Box sx={{ mb: 6, textAlign: 'center' }}>
          <Typography 
            variant="h3" 
            component="h1" 
            gutterBottom 
            sx={{
              fontWeight: 700,
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 4px 8px rgba(0,0,0,0.3)',
              letterSpacing: '1px',
              fontFamily: '"Cinzel", "Georgia", serif',
              mb: 2
            }}
          >
            Welcome back, {currentUser?.name || 'Valued Guest'}!
          </Typography>
          <Typography 
            variant="h6" 
            align="center" 
            sx={{ 
              color: alpha('#fff', 0.8),
              mb: 4,
              fontWeight: 300,
              letterSpacing: '0.5px'
            }}
          >
            Select your next cinematic adventure
          </Typography>

          {/* Search Component */}
          <AdvancedSearchComponent
            onSearchChange={handleSearchChange}
            onFilterChange={handleFilterChange}
            movies={movies}
            placeholder="Find your perfect movie experience..."
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
              {filteredMovies.length} movie{filteredMovies.length !== 1 ? 's' : ''} available
            </Typography>
          )}
        </Box>

        {/* Movies Grid */}
        <Grid container spacing={3}>
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
                  <CardActionArea onClick={() => navigate(`/movie/${movie._id}`)}>
                    <Box sx={{ position: 'relative', overflow: 'hidden' }}>
                      <CardMedia
                        component="img"
                        sx={{ 
                          height: 350, 
                          objectFit: 'cover',
                          transition: 'transform 0.4s ease',
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
                        onClick={(e) => e.stopPropagation()}
                      >
                        <BookmarkBorder fontSize="small" />
                      </IconButton>
                    </Box>

                    <CardContent sx={{ p: 2.5, pb: 1 }}>
                      <Typography 
                        gutterBottom 
                        variant="h6" 
                        component="h2"
                        sx={{ 
                          color: 'white',
                          fontWeight: 600,
                          mb: 1.5,
                          lineHeight: 1.3,
                          fontSize: '1.1rem'
                        }}
                      >
                        {movie.title}
                      </Typography>

                      <Box sx={{ display: 'flex', gap: 1, mb: 1.5, flexWrap: 'wrap' }}>
                        <Chip 
                          icon={<Language />}
                          label={movie.language} 
                          size="small" 
                          sx={{ 
                            background: alpha('#FFD700', 0.2),
                            color: '#FFD700',
                            border: `1px solid ${alpha('#FFD700', 0.3)}`,
                            fontWeight: 500,
                            fontSize: '0.75rem'
                          }} 
                        />
                        <Chip 
                          label={movie.category} 
                          size="small" 
                          sx={{ 
                            background: alpha('#4FC3F7', 0.2),
                            color: '#4FC3F7',
                            border: `1px solid ${alpha('#4FC3F7', 0.3)}`,
                            fontWeight: 500,
                            fontSize: '0.75rem'
                          }} 
                        />
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1.5 }}>
                        <AccessTime sx={{ color: alpha('#fff', 0.5), mr: 1, fontSize: '0.9rem' }} />
                        <Typography variant="caption" sx={{ color: alpha('#fff', 0.7) }}>
                          2h 30min
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
                  </CardActionArea>

                  <CardActions sx={{ p: 2.5, pt: 0 }}>
                    <Button 
                      size="medium"
                      onClick={() => navigate(`/book/${movie._id}`)}
                      fullWidth
                      startIcon={<PlayArrow />}
                      sx={{
                        background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                        color: '#000',
                        fontWeight: 700,
                        textTransform: 'uppercase',
                        letterSpacing: '0.5px',
                        py: 1,
                        borderRadius: 2,
                        fontSize: '0.85rem',
                        boxShadow: `0 4px 15px ${alpha('#FFD700', 0.4)}`,
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #FFE55C 0%, #FFB347 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: `0 6px 20px ${alpha('#FFD700', 0.6)}`,
                        }
                      }}
                    >
                      Book Now
                    </Button>
                    <Button 
                      size="small" 
                      onClick={() => navigate(`/movie/${movie._id}`)}
                      startIcon={<Visibility />}
                      sx={{ 
                        color: alpha('#fff', 0.8),
                        fontWeight: 500,
                        fontSize: '0.8rem',
                        '&:hover': {
                          color: '#FFD700',
                          background: alpha('#FFD700', 0.1)
                        }
                      }}
                    >
                      Details
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
              No movies match your criteria
            </Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: alpha('#fff', 0.4) 
              }}
            >
              Try adjusting your search or filters to discover more films
            </Typography>
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default CustomerDashboard;