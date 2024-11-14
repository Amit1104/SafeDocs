import React from 'react';
import { Box, Typography, Container } from '@mui/material';

const Dashboard = () => {
    return (
        <Container maxWidth="md">
            <Box textAlign="center" py={5}>
                <Typography variant="h4" component="h1" gutterBottom>
                    Welcome to the Dashboard
                </Typography>
                <Typography variant="body1">
                    This is the dashboard page, accessible after logging in.
                </Typography>
            </Box>
        </Container>
    );
};

export default Dashboard;
