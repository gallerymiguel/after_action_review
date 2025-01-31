import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Paper, Box, Grid } from '@mui/material';

const CreateAccountPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        console.log('Account created:', { username, password });
        // api calls here !!!
    };

    return (
        <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Paper elevation={3} sx={{ padding: 3, width: '100%' }}>
                <Box textAlign="center" mb={3}>
                    <Typography variant="h4">Create Account</Typography>
                </Box>
                <form onSubmit={handleFormSubmit}>
                    <Grid container spacing={2}>

                        {/* Username Field */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Username"
                                variant="outlined"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </Grid>

                        {/* Password Field */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Password"
                                type="password"
                                variant="outlined"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </Grid>

                        {/* Confirm Password Field */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Confirm Password"
                                type="password"
                                variant="outlined"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </Grid>

                        {/* Submit Button */}
                        <Grid item xs={12}>
                            <Button type="submit" fullWidth variant="contained" color="primary">
                                Register
                            </Button>
                        </Grid>
                    </Grid>
                </form>

                {/* Error message */}
                {error && (
                    <Box textAlign="center" mt={2}>
                        <Typography variant="body2" color="error">
                            {error}
                        </Typography>
                    </Box>
                )}

                {/* Link to Login page */}
                <Box textAlign="center" mt={2}>
                    <Typography variant="body2">
                        Already have an account? <Link to="/login">Login</Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default CreateAccountPage;