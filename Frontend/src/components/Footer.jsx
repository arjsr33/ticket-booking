import React from 'react';
import { Box, Container, Typography, Link } from '@mui/material';
import CopyrightIcon from '@mui/icons-material/Copyright';

const Footer = () => {
  return (
    <Box
      component="footer"
      sx={{
        py: 3,
        px: 2,
        mt: 'auto',
        backgroundColor: (theme) =>
          theme.palette.mode === 'light'
            ? theme.palette.grey[200]
            : theme.palette.grey[800],
      }}
    >
      <Container maxWidth="sm">
        <Typography variant="body1" align="center">
          <CopyrightIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 0.5 }} />
          {new Date().getFullYear()}{' '}
          <Link color="inherit" href="https://chadnibooking.vercel.app/">
            Chandni Movies
          </Link>
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Address: MCC, Kozhikode
        </Typography>
        <Typography variant="body2" color="text.secondary" align="center">
          Contact Us: chandnibookings@gmail.com
        </Typography>
      </Container>
    </Box>
  );
};

export default Footer;