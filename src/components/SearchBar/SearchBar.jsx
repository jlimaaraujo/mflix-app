import React from 'react';
import { TextField, IconButton, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const SearchBar = ({
    searchQuery,
    setSearchQuery,
    handleSearch,
    clearSearch,
    isSearchActive
}) => {
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            handleSearch();
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            justifyContent: 'center',
            mb: 4,
            px: 2
        }}>
            <TextField
                fullWidth
                variant="outlined"
                placeholder="Search movies by title..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={handleKeyPress}
                sx={{
                    maxWidth: 600,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '50px',
                        backgroundColor: 'background.paper'
                    }
                }}
                InputProps={{
                    endAdornment: (
                        <>
                            {isSearchActive && (
                                <IconButton
                                    onClick={clearSearch}
                                    sx={{ color: 'error.main' }}
                                >
                                    <ClearIcon />
                                </IconButton>
                            )}
                            <IconButton
                                onClick={handleSearch}
                                sx={{ color: 'primary.main' }}
                            >
                                <SearchIcon />
                            </IconButton>
                        </>
                    )
                }}
            />
        </Box>
    );
};

export default SearchBar;