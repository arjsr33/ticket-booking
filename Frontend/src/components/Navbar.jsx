import React, { useState } from 'react';
import { 
  AppBar, 
  Toolbar, 
  Typography, 
  Button, 
  Box, 
  IconButton,
  Menu,
  MenuItem,
  Avatar,
  useTheme,
  alpha
} from '@mui/material';
import { 
  Link as RouterLink, 
  useNavigate 
} from 'react-router-dom';
import { 
  useSelector, 
  useDispatch 
} from 'react-redux';
import { 
  AccountCircle, 
  MovieFilter,
  ExitToApp 
} from '@mui/icons-material';
import { logout } from '../redux/userSlice';

const Navbar = () => {
  const { isAuthenticated, currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    handleMenuClose();
  };

  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const metallicButtonStyle = {
    background: `linear-gradient(145deg, 
      ${alpha('#C0C0C0', 0.9)} 0%, 
      ${alpha('#E8E8E8', 0.95)} 25%, 
      ${alpha('#A8A8A8', 0.9)} 50%, 
      ${alpha('#D0D0D0', 0.95)} 75%, 
      ${alpha('#B8B8B8', 0.9)} 100%)`,
    color: '#2C2C2C',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    border: `1px solid ${alpha('#888', 0.3)}`,
    borderRadius: '8px',
    boxShadow: `
      inset 0 1px 0 ${alpha('#FFF', 0.3)},
      inset 0 -1px 0 ${alpha('#000', 0.1)},
      0 2px 4px ${alpha('#000', 0.2)}
    `,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
    '&:hover': {
      background: `linear-gradient(145deg, 
        ${alpha('#D0D0D0', 0.95)} 0%, 
        ${alpha('#F8F8F8', 1)} 25%, 
        ${alpha('#B8B8B8', 0.95)} 50%, 
        ${alpha('#E0E0E0', 1)} 75%, 
        ${alpha('#C8C8C8', 0.95)} 100%)`,
      transform: 'translateY(-1px)',
      boxShadow: `
        inset 0 1px 0 ${alpha('#FFF', 0.4)},
        inset 0 -1px 0 ${alpha('#000', 0.15)},
        0 4px 8px ${alpha('#000', 0.25)}
      `,
    },
    '&:active': {
      transform: 'translateY(0px)',
      boxShadow: `
        inset 0 2px 4px ${alpha('#000', 0.2)},
        0 1px 2px ${alpha('#000', 0.1)}
      `,
    }
  };

  return (
    <AppBar 
      position="static" 
      elevation={8}
      sx={{
        background: `linear-gradient(135deg, 
          #1a1a2e 0%, 
          #16213e 20%, 
          #0f3460 40%, 
          #16213e 60%, 
          #1a1a2e 100%)`,
        backdropFilter: 'blur(10px)',
        borderBottom: `1px solid ${alpha('#fff', 0.1)}`,
        boxShadow: `
          0 8px 32px ${alpha('#000', 0.3)},
          inset 0 1px 0 ${alpha('#fff', 0.1)}
        `,
      }}
    >
      <Toolbar sx={{ minHeight: '72px', px: { xs: 2, sm: 3 } }}>
        {/* Logo Section */}
        <Box 
          component={RouterLink} 
          to="/" 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            textDecoration: 'none',
            mr: 3,
            transition: 'transform 0.3s ease',
            '&:hover': {
              transform: 'scale(1.05)',
            }
          }}
        >
          <Box
            component="img"
            src="/logo.png" // Add your logo to public folder
            alt="Chandni Movies"
            sx={{
              height: 48,
              width: 'auto',
              mr: 2,
              filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))',
              // Fallback if logo doesn't exist
              display: { xs: 'none', sm: 'block' },
            }}
            onError={(e) => {
              // Hide image if logo doesn't exist
              e.target.style.display = 'none';
            }}
          />
          <Typography 
            variant="h5" 
            component="div" 
            sx={{ 
              fontWeight: 700,
              background: 'linear-gradient(135deg, #FFD700 0%, #FFA500 50%, #FFD700 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              textShadow: '0 2px 4px rgba(0,0,0,0.3)',
              letterSpacing: '1px',
              fontFamily: '"Cinzel", "Georgia", serif',
            }}
          >
            Chandni Movies
          </Typography>
        </Box>

        {/* Center flex spacer */}
        <Box sx={{ flexGrow: 1 }} />

        {/* Navigation Buttons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Button 
            color="inherit" 
            component={RouterLink} 
            to="/"
            sx={metallicButtonStyle}
            startIcon={<MovieFilter />}
          >
            Home
          </Button>

          {isAuthenticated ? (
            <>
              <IconButton
                size="large"
                edge="end"
                aria-label="account of current user"
                aria-controls="primary-search-account-menu"
                aria-haspopup="true"
                onClick={handleMenuOpen}
                color="inherit"
                sx={{
                  ...metallicButtonStyle,
                  borderRadius: '50%',
                  width: 48,
                  height: 48,
                  p: 0,
                }}
              >
                <Avatar 
                  sx={{ 
                    width: 36, 
                    height: 36,
                    bgcolor: 'primary.main',
                    fontSize: '1rem',
                    fontWeight: 600,
                  }}
                >
                  {currentUser?.name?.charAt(0)?.toUpperCase() || <AccountCircle />}
                </Avatar>
              </IconButton>
              
              <Menu
                id="primary-search-account-menu"
                anchorEl={anchorEl}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
                PaperProps={{
                  elevation: 8,
                  sx: {
                    mt: 1,
                    background: `linear-gradient(135deg, 
                      rgba(26, 26, 46, 0.95) 0%, 
                      rgba(22, 33, 62, 0.95) 100%)`,
                    backdropFilter: 'blur(10px)',
                    border: `1px solid ${alpha('#fff', 0.1)}`,
                    borderRadius: 2,
                    minWidth: 200,
                  }
                }}
              >
                <MenuItem 
                  onClick={() => { navigate('/profile'); handleMenuClose(); }}
                  sx={{ 
                    color: 'white',
                    '&:hover': { 
                      bgcolor: alpha('#fff', 0.1) 
                    }
                  }}
                >
                  <AccountCircle sx={{ mr: 1 }} />
                  Profile
                </MenuItem>
                <MenuItem 
                  onClick={handleLogout}
                  sx={{ 
                    color: 'white',
                    '&:hover': { 
                      bgcolor: alpha('#ff5252', 0.1) 
                    }
                  }}
                >
                  <ExitToApp sx={{ mr: 1 }} />
                  Logout
                </MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/login"
                sx={metallicButtonStyle}
              >
                Login
              </Button>
              <Button 
                color="inherit" 
                component={RouterLink} 
                to="/signup"
                sx={{
                  ...metallicButtonStyle,
                  background: `linear-gradient(145deg, 
                    ${alpha('#FFD700', 0.9)} 0%, 
                    ${alpha('#FFA500', 0.95)} 50%, 
                    ${alpha('#FFD700', 0.9)} 100%)`,
                  color: '#1a1a2e',
                  '&:hover': {
                    background: `linear-gradient(145deg, 
                      ${alpha('#FFE55C', 0.95)} 0%, 
                      ${alpha('#FFB347', 1)} 50%, 
                      ${alpha('#FFE55C', 0.95)} 100%)`,
                  }
                }}
              >
                Sign Up
              </Button>
            </>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;