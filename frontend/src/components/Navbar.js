import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { unsetCurrentUser } from '../store/userSlice';
import API from '../API';
import { AppBar, Toolbar, Typography, Button, IconButton, Menu, MenuItem, Box } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';

const Navbar = () => {
    const { myUser } = useSelector((state) => state.currentUser);
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [anchorEl, setAnchorEl] = React.useState(null);

    const handleMenuOpen = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = async () => {
        dispatch(unsetCurrentUser());
        try {
            await API.post("/logout");
            toast.info('Logged out successfully');
            navigate('/');
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <AppBar position="static" color="default">
            <Toolbar>
                <Typography variant="h6" sx={{ flexGrow: 1, textDecoration: 'none', color: 'inherit' }}>
                    <img src="/safedocs.webp" alt="" width={40} className='rounded-3' /> SafeDocs
                </Typography>

                <Box sx={{ display: { xs: 'none', md: 'flex' } }}>
                    {!myUser ? (
                        <>
                            <Button component={Link} to="/" color="inherit">Login</Button>
                            <Button component={Link} to="/register" color="inherit">Register</Button>
                        </>
                    ) : (
                        <>
                            <Button component={Link} to="/dashboard" color="inherit">Dashboard</Button>
                            <Button component={Link} to="/upload" color="inherit">Upload</Button>
                            <Button component={Link} to="/files" color="inherit">Files</Button>
                            <Button onClick={handleLogout} color="secondary">Logout</Button>
                        </>
                    )}
                </Box>

                <Box sx={{ display: { xs: 'flex', md: 'none' } }}>
                    <IconButton color="inherit" onClick={handleMenuOpen}>
                        <MenuIcon />
                    </IconButton>
                    <Menu
                        anchorEl={anchorEl}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                    >
                        {!myUser ? (
                            <div>
                                <MenuItem component={Link} to="/" onClick={handleMenuClose}>Login</MenuItem>
                                <MenuItem component={Link} to="/register" onClick={handleMenuClose}>Register</MenuItem>
                            </div>
                        ) : (
                            <div>
                                <MenuItem component={Link} to="/dashboard" onClick={handleMenuClose}>Dashboard</MenuItem>
                                <MenuItem component={Link} to="/upload" onClick={handleMenuClose}>Upload</MenuItem>
                                <MenuItem component={Link} to="/files" onClick={handleMenuClose}>Files</MenuItem>
                                <MenuItem onClick={() => { handleLogout(); handleMenuClose(); }}>Logout</MenuItem>
                            </div>
                        )}
                    </Menu>
                </Box>
            </Toolbar>
        </AppBar>
    );
};

export default Navbar;
