import React from 'react';
import { 
  Box, 
  Container, 
  Typography, 
  Link, 
  Grid, 
  IconButton,
  Divider,
  alpha 
} from '@mui/material';
import { 
  Facebook, 
  Twitter, 
  Instagram, 
  YouTube, 
  Email, 
  Phone, 
  LocationOn,
  Copyright,
  MovieFilter
} from '@mui/icons-material';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <Box
      component="footer"
      sx={{
        background: `linear-gradient(135deg, 
          rgba(26, 26, 46, 0.95) 0%, 
          rgba(22, 33, 62, 0.95) 50%, 
          rgba(15, 52, 96, 0.95) 100%)`,
        backdropFilter: 'blur(20px)',
        borderTop: `1px solid ${alpha('#FFD700', 0.2)}`,
        color: 'white',
        pt: 6,
        pb: 3,
        mt: 'auto'
      }}
    >
      <Container maxWidth="lg">
        <Grid container spacing={4}>
          {/* Company Info */}
          <Grid item xs={12} md={4}>
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <MovieFilter 
                  sx={{ 
                    color: '#FFD700', 
                    fontSize: '2rem', 
                    mr: 1 
                  }} 
                />
                <Typography 
                  variant="h5" 
                  sx={{ 
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 100%)',
                    backgroundClip: 'text',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    fontFamily: '"Cinzel", "Georgia", serif',
                  }}
                >
                  Chandni Movies
                </Typography>
              </Box>
              <Typography 
                variant="body2" 
                sx={{ 
                  color: alpha('#fff', 0.8),
                  lineHeight: 1.7,
                  mb: 2
                }}
              >
                Experience the magic of cinema in our premium theaters. 
                We bring you the latest blockbusters and timeless classics 
                in an atmosphere of luxury and comfort.
              </Typography>
              <Box sx={{ display: 'flex', gap: 1 }}>
                {[
                  { icon: Facebook, color: '#1877F2' },
                  { icon: Twitter, color: '#1DA1F2' },
                  { icon: Instagram, color: '#E4405F' },
                  { icon: YouTube, color: '#FF0000' }
                ].map((social, index) => (
                  <IconButton
                    key={index}
                    sx={{
                      background: `linear-gradient(135deg, ${alpha(social.color, 0.1)} 0%, ${alpha(social.color, 0.05)} 100%)`,
                      border: `1px solid ${alpha(social.color, 0.2)}`,
                      color: social.color,
                      transition: 'all 0.3s ease',
                      '&:hover': {
                        background: alpha(social.color, 0.1),
                        transform: 'translateY(-2px)',
                        boxShadow: `0 4px 12px ${alpha(social.color, 0.3)}`,
                      }
                    }}
                  >
                    <social.icon />
                  </IconButton>
                ))}
              </Box>
            </Box>
          </Grid>

          {/* Quick Links */}
          <Grid item xs={12} sm={6} md={2}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#FFD700',
                fontWeight: 600,
                mb: 2,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -4,
                  left: 0,
                  width: 40,
                  height: 2,
                  background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                  borderRadius: 1,
                }
              }}
            >
              Quick Links
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                'Now Showing',
                'Coming Soon',
                'Gift Cards',
                'Loyalty Program',
                'Group Bookings',
                'Corporate Events'
              ].map((link) => (
                <Link
                  key={link}
                  href="#"
                  sx={{
                    color: alpha('#fff', 0.7),
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    '&:hover': {
                      color: '#FFD700',
                      paddingLeft: 1,
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: -8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: '#FFD700',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover::before': {
                      opacity: 1,
                    }
                  }}
                >
                  {link}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Support */}
          <Grid item xs={12} sm={6} md={3}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#FFD700',
                fontWeight: 600,
                mb: 2,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -4,
                  left: 0,
                  width: 40,
                  height: 2,
                  background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                  borderRadius: 1,
                }
              }}
            >
              Support
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
              {[
                'Help Center',
                'Booking Guidelines',
                'Cancellation Policy',
                'Accessibility',
                'Terms of Service',
                'Privacy Policy'
              ].map((link) => (
                <Link
                  key={link}
                  href="#"
                  sx={{
                    color: alpha('#fff', 0.7),
                    textDecoration: 'none',
                    fontSize: '0.9rem',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    '&:hover': {
                      color: '#FFD700',
                      paddingLeft: 1,
                    },
                    '&::before': {
                      content: '""',
                      position: 'absolute',
                      left: -8,
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: 4,
                      height: 4,
                      borderRadius: '50%',
                      background: '#FFD700',
                      opacity: 0,
                      transition: 'opacity 0.3s ease',
                    },
                    '&:hover::before': {
                      opacity: 1,
                    }
                  }}
                >
                  {link}
                </Link>
              ))}
            </Box>
          </Grid>

          {/* Contact Info */}
          <Grid item xs={12} md={3}>
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#FFD700',
                fontWeight: 600,
                mb: 2,
                position: 'relative',
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  bottom: -4,
                  left: 0,
                  width: 40,
                  height: 2,
                  background: 'linear-gradient(90deg, #FFD700, #FFA500)',
                  borderRadius: 1,
                }
              }}
            >
              Contact Us
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <LocationOn sx={{ color: '#FFD700', fontSize: '1.2rem' }} />
                <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                  MCC, Kozhikode, Kerala
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Email sx={{ color: '#FFD700', fontSize: '1.2rem' }} />
                <Link
                  href="mailto:chandnibookings@gmail.com"
                  sx={{
                    color: alpha('#fff', 0.8),
                    textDecoration: 'none',
                    fontSize: '0.875rem',
                    '&:hover': { color: '#FFD700' }
                  }}
                >
                  chandnibookings@gmail.com
                </Link>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Phone sx={{ color: '#FFD700', fontSize: '1.2rem' }} />
                <Typography variant="body2" sx={{ color: alpha('#fff', 0.8) }}>
                  +91 (800) 123-4567
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Divider 
          sx={{ 
            my: 4, 
            borderColor: alpha('#FFD700', 0.2),
            '&::before, &::after': {
              borderColor: alpha('#FFD700', 0.2),
            }
          }} 
        />

        {/* Bottom Section */}
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: { xs: 'column', md: 'row' },
            justifyContent: 'space-between',
            alignItems: 'center',
            gap: 2
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Copyright sx={{ color: alpha('#fff', 0.6), fontSize: '1rem' }} />
            <Typography 
              variant="body2" 
              sx={{ color: alpha('#fff', 0.6) }}
            >
              {currentYear} Chandni Movies. All rights reserved.
            </Typography>
          </Box>
          
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Typography 
              variant="body2" 
              sx={{ 
                color: alpha('#fff', 0.5),
                fontStyle: 'italic'
              }}
            >
              Crafted with ❤️ for cinema lovers
            </Typography>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default Footer;