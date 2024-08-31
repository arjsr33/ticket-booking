import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { 
  AppBar, Toolbar, Typography, Button, Box, 
  FormControl, Select, MenuItem, InputLabel
} from '@mui/material';
import { logout } from '../redux/userSlice';
import { majorIndianCities } from '../services/mockData';

const Navbar = () => {
  const { isAuthenticated, isAdmin } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [selectedCity, setSelectedCity] = useState('');

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleCityChange = (event) => {
    setSelectedCity(event.target.value);
    // Logic for city change
    console.log("Selected city:", event.target.value);
  };

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Chandni Movies
        </Typography>
        <FormControl sx={{ m: 1, minWidth: 120 }}>
          <InputLabel id="city-select-label">City</InputLabel>
          <Select
            labelId="city-select-label"
            id="city-select"
            value={selectedCity}
            label="City"
            onChange={handleCityChange}
            sx={{ color: 'white', '.MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }}
          >
            {majorIndianCities.map((city) => (
              <MenuItem key={city} value={city}>{city}</MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button color="inherit" component={RouterLink} to="/">Home</Button>
        {isAuthenticated ? (
          <>
            <Button color="inherit" component={RouterLink} to="/dashboard">Dashboard</Button>
            <Button color="inherit" component={RouterLink} to="/profile">Profile</Button>
            {isAdmin && (
              <Button color="inherit" component={RouterLink} to="/admin">Admin</Button>
            )}
            <Button color="inherit" onClick={handleLogout}>Logout</Button>
          </>
        ) : (
          <>
            <Button color="inherit" component={RouterLink} to="/login">Login</Button>
            <Button color="inherit" component={RouterLink} to="/signup">Sign Up</Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;