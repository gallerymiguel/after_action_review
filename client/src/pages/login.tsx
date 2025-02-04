import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, TextField, Button, Typography, Paper, Box, Grid } from '@mui/material';

const LoginPage: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        console.log('Login attempt:', { username, password });
    };

    return (
        <Container maxWidth="xs" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <Paper elevation={3} sx={{ padding: 3, width: '100%' }}>
                <Box textAlign="center" mb={3}>
                    <Typography variant="h4">Login</Typography>
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

                        {/* Submit Button */}
                        <Grid item xs={12}>
                            <Button type="submit" fullWidth variant="contained" color="primary">
                                Login
                            </Button>
                        </Grid>
                    </Grid>
                </form>

                {/* Link to Register Page */}
                <Box textAlign="center" mt={2}>
                    <Typography variant="body2">
                        Don't have an account? <Link to="/register">Create Account</Link>
                    </Typography>
                </Box>
            </Paper>
        </Container>
    );
};

export default LoginPage;
