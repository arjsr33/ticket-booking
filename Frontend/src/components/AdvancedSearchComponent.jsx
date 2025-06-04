import React, { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  IconButton,
  Paper,
  Chip,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Button,
  alpha
} from '@mui/material';
import {
  Search,
  Clear,
  FilterList,
  ExpandMore,
  Star
} from '@mui/icons-material';

const AdvancedSearchComponent = ({ 
  onSearchChange, 
  onFilterChange, 
  movies = [],
  placeholder = "Search movies by title, language, or genre..."
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    language: '',
    category: '',
    rating: [0, 5],
    sortBy: 'title'
  });

  // Extract unique values for filter options
  const languages = [...new Set(movies.map(movie => movie.language))].filter(Boolean);
  const categories = [...new Set(movies.map(movie => movie.category))].filter(Boolean);

  useEffect(() => {
    onSearchChange(searchTerm);
  }, [searchTerm, onSearchChange]);

  useEffect(() => {
    onFilterChange(filters);
  }, [filters, onFilterChange]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  const handleFilterChange = (filterType, value) => {
    setFilters(prev => ({
      ...prev,
      [filterType]: value
    }));
  };

  const clearFilters = () => {
    setFilters({
      language: '',
      category: '',
      rating: [0, 5],
      sortBy: 'title'
    });
  };

  const hasActiveFilters = filters.language || filters.category || 
    filters.rating[0] > 0 || filters.rating[1] < 5 || filters.sortBy !== 'title';

  return (
    <Box sx={{ width: '100%', maxWidth: 800, mx: 'auto' }}>
      {/* Main Search Bar */}
      <Paper
        elevation={8}
        sx={{
          background: `linear-gradient(135deg, 
            rgba(255, 255, 255, 0.1) 0%, 
            rgba(255, 255, 255, 0.05) 100%)`,
          backdropFilter: 'blur(10px)',
          border: `1px solid ${alpha('#fff', 0.2)}`,
          borderRadius: 3,
          overflow: 'hidden',
          mb: 2
        }}
      >
        <TextField
          fullWidth
          variant="outlined"
          placeholder={placeholder}
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search sx={{ color: alpha('#fff', 0.7) }} />
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment position="end">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  {searchTerm && (
                    <IconButton
                      onClick={clearSearch}
                      size="small"
                      sx={{ 
                        color: alpha('#fff', 0.7),
                        '&:hover': { color: '#fff' }
                      }}
                    >
                      <Clear />
                    </IconButton>
                  )}
                  <IconButton
                    onClick={() => setShowFilters(!showFilters)}
                    size="small"
                    sx={{ 
                      color: showFilters ? '#FFD700' : alpha('#fff', 0.7),
                      '&:hover': { color: '#FFD700' }
                    }}
                  >
                    <FilterList />
                  </IconButton>
                </Box>
              </InputAdornment>
            ),
            sx: {
              '& .MuiOutlinedInput-notchedOutline': {
                border: 'none',
              },
              '& input': {
                color: 'white',
                fontSize: '1.1rem',
                py: 2,
              },
              '& input::placeholder': {
                color: alpha('#fff', 0.6),
                opacity: 1,
              },
            }
          }}
        />
      </Paper>

      {/* Advanced Filters */}
      {showFilters && (
        <Paper
          elevation={4}
          sx={{
            background: `linear-gradient(135deg, 
              rgba(255, 255, 255, 0.08) 0%, 
              rgba(255, 255, 255, 0.03) 100%)`,
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha('#fff', 0.1)}`,
            borderRadius: 2,
            p: 3,
            mb: 2
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="h6" sx={{ color: '#FFD700', fontWeight: 600 }}>
              Advanced Filters
            </Typography>
            {hasActiveFilters && (
              <Button
                onClick={clearFilters}
                size="small"
                sx={{ 
                  color: alpha('#fff', 0.7),
                  '&:hover': { color: '#fff' }
                }}
              >
                Clear All
              </Button>
            )}
          </Box>

          <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', md: '1fr 1fr' }, gap: 3 }}>
            {/* Language Filter */}
            <FormControl fullWidth>
              <InputLabel sx={{ color: alpha('#fff', 0.7) }}>Language</InputLabel>
              <Select
                value={filters.language}
                onChange={(e) => handleFilterChange('language', e.target.value)}
                label="Language"
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha('#fff', 0.2),
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha('#FFD700', 0.5),
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FFD700',
                  },
                  '& .MuiSvgIcon-root': {
                    color: alpha('#fff', 0.7),
                  }
                }}
              >
                <MenuItem value="">All Languages</MenuItem>
                {languages.map((language) => (
                  <MenuItem key={language} value={language}>
                    {language}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Category Filter */}
            <FormControl fullWidth>
              <InputLabel sx={{ color: alpha('#fff', 0.7) }}>Genre</InputLabel>
              <Select
                value={filters.category}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                label="Genre"
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha('#fff', 0.2),
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha('#FFD700', 0.5),
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FFD700',
                  },
                  '& .MuiSvgIcon-root': {
                    color: alpha('#fff', 0.7),
                  }
                }}
              >
                <MenuItem value="">All Genres</MenuItem>
                {categories.map((category) => (
                  <MenuItem key={category} value={category}>
                    {category}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Rating Filter */}
            <Box>
              <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), mb: 2 }}>
                Rating Range
              </Typography>
              <Box sx={{ px: 2 }}>
                <Slider
                  value={filters.rating}
                  onChange={(e, newValue) => handleFilterChange('rating', newValue)}
                  valueLabelDisplay="auto"
                  min={0}
                  max={5}
                  step={0.1}
                  marks={[
                    { value: 0, label: '0' },
                    { value: 2.5, label: '2.5' },
                    { value: 5, label: '5' }
                  ]}
                  sx={{
                    color: '#FFD700',
                    '& .MuiSlider-thumb': {
                      backgroundColor: '#FFD700',
                      border: '2px solid #FFD700',
                      '&:hover, &.Mui-focusVisible': {
                        boxShadow: `0px 0px 0px 8px ${alpha('#FFD700', 0.16)}`,
                      },
                    },
                    '& .MuiSlider-track': {
                      backgroundColor: '#FFD700',
                    },
                    '& .MuiSlider-rail': {
                      backgroundColor: alpha('#fff', 0.3),
                    },
                    '& .MuiSlider-mark': {
                      backgroundColor: alpha('#fff', 0.5),
                    },
                    '& .MuiSlider-markLabel': {
                      color: alpha('#fff', 0.7),
                    },
                    '& .MuiSlider-valueLabel': {
                      backgroundColor: alpha('#000', 0.8),
                      color: '#FFD700',
                      '&:before': {
                        borderBottomColor: alpha('#000', 0.8),
                      },
                    },
                  }}
                />
              </Box>
            </Box>

            {/* Sort By */}
            <FormControl fullWidth>
              <InputLabel sx={{ color: alpha('#fff', 0.7) }}>Sort By</InputLabel>
              <Select
                value={filters.sortBy}
                onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                label="Sort By"
                sx={{
                  color: 'white',
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha('#fff', 0.2),
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha('#FFD700', 0.5),
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: '#FFD700',
                  },
                  '& .MuiSvgIcon-root': {
                    color: alpha('#fff', 0.7),
                  }
                }}
              >
                <MenuItem value="title">Title (A-Z)</MenuItem>
                <MenuItem value="rating">Rating (High to Low)</MenuItem>
                <MenuItem value="language">Language</MenuItem>
                <MenuItem value="category">Genre</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Active Filters Display */}
          {hasActiveFilters && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="body2" sx={{ color: alpha('#fff', 0.7), mb: 1 }}>
                Active Filters:
              </Typography>
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                {filters.language && (
                  <Chip
                    label={`Language: ${filters.language}`}
                    onDelete={() => handleFilterChange('language', '')}
                    size="small"
                    sx={{
                      background: alpha('#FFD700', 0.2),
                      color: '#FFD700',
                      border: `1px solid ${alpha('#FFD700', 0.3)}`,
                      '& .MuiChip-deleteIcon': {
                        color: '#FFD700',
                      }
                    }}
                  />
                )}
                {filters.category && (
                  <Chip
                    label={`Genre: ${filters.category}`}
                    onDelete={() => handleFilterChange('category', '')}
                    size="small"
                    sx={{
                      background: alpha('#4FC3F7', 0.2),
                      color: '#4FC3F7',
                      border: `1px solid ${alpha('#4FC3F7', 0.3)}`,
                      '& .MuiChip-deleteIcon': {
                        color: '#4FC3F7',
                      }
                    }}
                  />
                )}
                {(filters.rating[0] > 0 || filters.rating[1] < 5) && (
                  <Chip
                    label={`Rating: ${filters.rating[0].toFixed(1)} - ${filters.rating[1].toFixed(1)}`}
                    onDelete={() => handleFilterChange('rating', [0, 5])}
                    size="small"
                    sx={{
                      background: alpha('#FF9800', 0.2),
                      color: '#FF9800',
                      border: `1px solid ${alpha('#FF9800', 0.3)}`,
                      '& .MuiChip-deleteIcon': {
                        color: '#FF9800',
                      }
                    }}
                  />
                )}
                {filters.sortBy !== 'title' && (
                  <Chip
                    label={`Sort: ${filters.sortBy}`}
                    size="small"
                    sx={{
                      background: alpha('#9C27B0', 0.2),
                      color: '#9C27B0',
                      border: `1px solid ${alpha('#9C27B0', 0.3)}`,
                    }}
                  />
                )}
              </Box>
            </Box>
          )}
        </Paper>
      )}
    </Box>
  );
};

export default AdvancedSearchComponent;