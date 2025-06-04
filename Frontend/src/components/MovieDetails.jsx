import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Typography, Box, Button, Grid, Paper, Chip, Rating,
  Container, IconButton, Divider, Card, CardContent,
  List, ListItem, ListItemIcon, ListItemText, alpha
} from '@mui/material';
import { 
  PlayArrow, 
  BookmarkBorder, 
  Share, 
  Schedule, 
  Language as LanguageIcon, 
  Category, 
  Star,
  People,
  ArrowBack,
  AccessTime,
  CalendarToday
} from '@mui/icons-material';
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

  if (loading) return (
    <Box 
      display="flex" 
      justifyContent="center" 
      alignItems="center" 
      minHeight="100vh"
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
        Loading Movie Details...
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
          {error}
        </Typography>
      </Container>
    </Box>
  );

  if (!movie) return (
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
        <Typography variant="h5" align="center" sx={{ color: alpha('#fff', 0.7) }}>
          Movie not found
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
        pt: 2,
        pb: 6
      }}
    >
      <Container maxWidth="xl">
        {/* Back Button */}
        <Box sx={{ mb: 3 }}>
          <Button 
            startIcon={<ArrowBack />}
            onClick={() => navigate(-1)}
            sx={{ 
              color: alpha('#fff', 0.8),
              '&:hover': { 
                color: '#FFD700',
                background: alpha('#FFD700', 0.1)
              }
            }}
          >
            Back to Movies
          </Button>
        </Box>

        {/* Main Content */}
        <Grid container spacing={4}>
          {/* Left Column - Movie Poster */}
          <Grid item xs={12} md={4} lg={3}>
            <Paper
              elevation={12}
              sx={{
                background: `linear-gradient(135deg, 
                  rgba(255, 255, 255, 0.1) 0%, 
                  rgba(255, 255, 255, 0.05) 100%)`,
                backdropFilter: 'blur(10px)',
                border: `1px solid ${alpha('#fff', 0.1)}`,
                borderRadius: 3,
                overflow: 'hidden',
                position: 'sticky',
                top: 20
              }}
            >
              <Box sx={{ position: 'relative' }}>
                <Box
                  component="img"
                  src={movie.images.poster}
                  alt={movie.title}
                  sx={{
                    width: '100%',
                    height: 'auto',
                    maxHeight: 500,
                    objectFit: 'cover',
                    display: 'block'
                  }}
                />
                
                {/* Action Buttons Overlay */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 1
                  }}
                >
                  <IconButton
                    sx={{
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
                    <BookmarkBorder />
                  </IconButton>
                  <IconButton
                    sx={{
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
                    <Share />
                  </IconButton>
                </Box>

                {/* Rating Badge */}
                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 12,
                    left: 12,
                    background: `linear-gradient(135deg, 
                      rgba(0, 0, 0, 0.9) 0%, 
                      rgba(0, 0, 0, 0.7) 100%)`,
                    backdropFilter: 'blur(10px)',
                    borderRadius: 2,
                    px: 2,
                    py: 1,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1
                  }}
                >
                  <Star sx={{ color: '#FFD700', fontSize: '1.2rem' }} />
                  <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                    {movie.rating?.toFixed(1) || '4.5'}
                  </Typography>
                </Box>
              </Box>

              {/* Book Ticket Button */}
              <Box sx={{ p: 3 }}>
                <Button 
                  variant="contained" 
                  fullWidth
                  size="large"
                  startIcon={<PlayArrow />}
                  onClick={() => navigate(`/book/${movie._id}`)}
                  sx={{
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    color: '#000',
                    fontWeight: 700,
                    textTransform: 'uppercase',
                    letterSpacing: '1px',
                    py: 1.5,
                    borderRadius: 2,
                    fontSize: '1rem',
                    boxShadow: `0 6px 20px ${alpha('#FFD700', 0.4)}`,
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      background: 'linear-gradient(135deg, #FFE55C 0%, #FFB347 100%)',
                      transform: 'translateY(-2px)',
                      boxShadow: `0 8px 25px ${alpha('#FFD700', 0.6)}`,
                    }
                  }}
                >
                  Book Premium Seats
                </Button>
              </Box>
            </Paper>
          </Grid>

          {/* Right Column - Movie Information */}
          <Grid item xs={12} md={8} lg={9}>
            <Box sx={{ pr: { md: 2 } }}>
              {/* Title and Tags */}
              <Box sx={{ mb: 4 }}>
                <Typography 
                  variant="h3" 
                  component="h1"
                  gutterBottom
                  sx={{
                    color: 'white',
                    fontWeight: 700,
                    mb: 2,
                    fontFamily: '"Cinzel", "Georgia", serif',
                    lineHeight: 1.2
                  }}
                >
                  {movie.title}
                </Typography>

                <Box sx={{ display: 'flex', gap: 1.5, mb: 3, flexWrap: 'wrap' }}>
                  <Chip 
                    icon={<LanguageIcon />}
                    label={movie.language} 
                    sx={{ 
                      background: alpha('#FFD700', 0.2),
                      color: '#FFD700',
                      border: `1px solid ${alpha('#FFD700', 0.3)}`,
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }} 
                  />
                  <Chip 
                    icon={<Category />}
                    label={movie.category} 
                    sx={{ 
                      background: alpha('#4FC3F7', 0.2),
                      color: '#4FC3F7',
                      border: `1px solid ${alpha('#4FC3F7', 0.3)}`,
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }} 
                  />
                  <Chip 
                    icon={<AccessTime />}
                    label="2h 30min" 
                    sx={{ 
                      background: alpha('#9C27B0', 0.2),
                      color: '#9C27B0',
                      border: `1px solid ${alpha('#9C27B0', 0.3)}`,
                      fontWeight: 600,
                      fontSize: '0.9rem'
                    }} 
                  />
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
                  <Rating 
                    value={movie.rating || 4.5} 
                    precision={0.1} 
                    readOnly 
                    size="large"
                    sx={{
                      '& .MuiRating-iconFilled': {
                        color: '#FFD700',
                      },
                      '& .MuiRating-iconEmpty': {
                        color: alpha('#FFD700', 0.3),
                      }
                    }}
                  />
                  <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 600 }}>
                    {movie.rating?.toFixed(1) || '4.5'}/5
                  </Typography>
                </Box>
              </Box>

              {/* Description */}
              <Card 
                sx={{ 
                  mb: 4,
                  background: `linear-gradient(135deg, 
                    rgba(255, 255, 255, 0.08) 0%, 
                    rgba(255, 255, 255, 0.03) 100%)`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha('#fff', 0.1)}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h5" 
                    gutterBottom 
                    sx={{ 
                      color: '#FFD700',
                      fontWeight: 600,
                      mb: 2
                    }}
                  >
                    Synopsis
                  </Typography>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      color: alpha('#fff', 0.9),
                      lineHeight: 1.8,
                      fontSize: '1.1rem'
                    }}
                  >
                    {movie.description}
                  </Typography>
                </CardContent>
              </Card>

              <Grid container spacing={3}>
                {/* Cast */}
                <Grid item xs={12} lg={6}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      background: `linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.08) 0%, 
                        rgba(255, 255, 255, 0.03) 100%)`,
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha('#fff', 0.1)}`,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography 
                        variant="h6" 
                        gutterBottom 
                        sx={{ 
                          color: '#FFD700',
                          fontWeight: 600,
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <People />
                        Cast
                      </Typography>
                      <List dense>
                        {movie.cast.map((actor, index) => (
                          <ListItem key={index} sx={{ px: 0, py: 0.5 }}>
                            <ListItemIcon sx={{ minWidth: 24 }}>
                              <Box 
                                sx={{ 
                                  width: 6, 
                                  height: 6, 
                                  borderRadius: '50%', 
                                  background: '#FFD700' 
                                }} 
                              />
                            </ListItemIcon>
                            <ListItemText 
                              primary={actor} 
                              sx={{ 
                                '& .MuiListItemText-primary': { 
                                  color: alpha('#fff', 0.9),
                                  fontWeight: 500
                                } 
                              }} 
                            />
                          </ListItem>
                        ))}
                      </List>
                    </CardContent>
                  </Card>
                </Grid>

                {/* Reviews */}
                <Grid item xs={12} lg={6}>
                  <Card 
                    sx={{ 
                      height: '100%',
                      background: `linear-gradient(135deg, 
                        rgba(255, 255, 255, 0.08) 0%, 
                        rgba(255, 255, 255, 0.03) 100%)`,
                      backdropFilter: 'blur(10px)',
                      border: `1px solid ${alpha('#fff', 0.1)}`,
                    }}
                  >
                    <CardContent sx={{ p: 3 }}>
                      <Typography 
                        variant="h6" 
                        gutterBottom 
                        sx={{ 
                          color: '#FFD700',
                          fontWeight: 600,
                          mb: 2,
                          display: 'flex',
                          alignItems: 'center',
                          gap: 1
                        }}
                      >
                        <Star />
                        Reviews
                      </Typography>
                      
                      <Box sx={{ mb: 3 }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ color: alpha('#fff', 0.7), mb: 1 }}
                        >
                          Average Rating
                        </Typography>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <Rating 
                            name="read-only" 
                            value={movie.rating || 4.5} 
                            readOnly 
                            precision={0.1} 
                            sx={{
                              '& .MuiRating-iconFilled': {
                                color: '#FFD700',
                              },
                              '& .MuiRating-iconEmpty': {
                                color: alpha('#FFD700', 0.3),
                              }
                            }}
                          />
                          <Typography 
                            variant="body2" 
                            sx={{ color: '#FFD700', fontWeight: 600 }}
                          >
                            ({(movie.rating || 4.5).toFixed(1)})
                          </Typography>
                        </Box>
                      </Box>

                      <Divider sx={{ my: 2, borderColor: alpha('#fff', 0.1) }} />

                      <Box sx={{ maxHeight: 200, overflowY: 'auto' }}>
                        {movie.reviews && movie.reviews.length > 0 ? (
                          movie.reviews.map((review, index) => (
                            <Box key={index} sx={{ mb: 2 }}>
                              <Box 
                                sx={{ 
                                  background: alpha('#FFD700', 0.05),
                                  borderLeft: `3px solid #FFD700`,
                                  borderRadius: 1,
                                  p: 2,
                                  position: 'relative'
                                }}
                              >
                                <Typography 
                                  variant="body2" 
                                  sx={{ 
                                    color: alpha('#fff', 0.9),
                                    fontStyle: 'italic',
                                    lineHeight: 1.6,
                                  }}
                                >
                                  "{review}"
                                </Typography>
                                <Box
                                  sx={{
                                    position: 'absolute',
                                    top: 8,
                                    right: 8,
                                    color: '#FFD700',
                                    fontSize: '1.5rem',
                                    opacity: 0.3
                                  }}
                                >
                                  "
                                </Box>
                              </Box>
                              {index < movie.reviews.length - 1 && (
                                <Box sx={{ my: 1.5 }} />
                              )}
                            </Box>
                          ))
                        ) : (
                          <Typography 
                            variant="body2" 
                            sx={{ color: alpha('#fff', 0.6), fontStyle: 'italic' }}
                          >
                            No reviews available yet.
                          </Typography>
                        )}
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>

              {/* Showtimes Section */}
              <Card 
                sx={{ 
                  mt: 4,
                  background: `linear-gradient(135deg, 
                    rgba(255, 215, 0, 0.1) 0%, 
                    rgba(255, 165, 0, 0.05) 100%)`,
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${alpha('#FFD700', 0.2)}`,
                }}
              >
                <CardContent sx={{ p: 3 }}>
                  <Typography 
                    variant="h6" 
                    gutterBottom 
                    sx={{ 
                      color: '#FFD700',
                      fontWeight: 600,
                      mb: 3,
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1
                    }}
                  >
                    <Schedule />
                    Showtimes & Booking
                  </Typography>
                  
                  <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ 
                        background: alpha('#FFD700', 0.1),
                        borderRadius: 2,
                        p: 2,
                        border: `1px solid ${alpha('#FFD700', 0.2)}`
                      }}>
                        <Typography variant="subtitle2" sx={{ color: '#FFD700', mb: 1 }}>
                          Available Showtimes
                        </Typography>
                        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                          {['09:00 AM', '12:00 PM', '03:00 PM', '06:00 PM', '09:00 PM'].map((time, index) => (
                            <Chip 
                              key={index}
                              label={time} 
                              size="small"
                              sx={{ 
                                background: alpha('#FFD700', 0.2),
                                color: '#FFD700',
                                fontWeight: 600
                              }} 
                            />
                          ))}
                        </Box>
                      </Box>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <Box sx={{ 
                        background: alpha('#4FC3F7', 0.1),
                        borderRadius: 2,
                        p: 2,
                        border: `1px solid ${alpha('#4FC3F7', 0.2)}`
                      }}>
                        <Typography variant="subtitle2" sx={{ color: '#4FC3F7', mb: 1 }}>
                          Ticket Pricing
                        </Typography>
                        <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                          Premium Seats: ₹100
                        </Typography>
                        <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                          Standard Seats: ₹80
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  <Button 
                    variant="contained" 
                    size="large"
                    fullWidth
                    startIcon={<CalendarToday />}
                    onClick={() => navigate(`/book/${movie._id}`)}
                    sx={{
                      background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                      color: '#000',
                      fontWeight: 700,
                      textTransform: 'uppercase',
                      letterSpacing: '1px',
                      py: 1.5,
                      borderRadius: 2,
                      fontSize: '1.1rem',
                      boxShadow: `0 6px 20px ${alpha('#FFD700', 0.4)}`,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: 'linear-gradient(135deg, #FFE55C 0%, #FFB347 100%)',
                        transform: 'translateY(-2px)',
                        boxShadow: `0 8px 25px ${alpha('#FFD700', 0.6)}`,
                      }
                    }}
                  >
                    Select Seats & Book Now
                  </Button>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MovieDetails;