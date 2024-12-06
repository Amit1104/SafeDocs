import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../API';
import { useDispatch } from 'react-redux';
import { setCurrentUser } from '../store/userSlice';
import { checkAuthentication } from '../utils/Helper';
import { TextField, Button, Card, Typography, Box, CircularProgress } from '@mui/material';

const validationSchema = Yup.object({
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

const Login = ({ setIsAuthenticated }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const handleLogin = async (values, { setSubmitting, setFieldError }) => {
        try {
            const res = await API.post('/login', values);
            dispatch(setCurrentUser(res.data.user));
            checkAuthentication(dispatch).then(isAuthenticated => {
                setIsAuthenticated(isAuthenticated);
            });
            toast.success('Login successful!');
            navigate('/dashboard');
        } catch (error) {
            toast.error('Login failed. Please check your credentials.');
            setFieldError('email', 'Invalid email or password');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
            <Card sx={{ p: 4, width: '100%', maxWidth: 400 }}>
                <Typography variant="h5" component="h2" align="center" gutterBottom>
                    Login
                </Typography>
                <Formik
                    initialValues={{ email: 'test@gmail.com', password: '123456' }}
                    validationSchema={validationSchema}
                    onSubmit={handleLogin}
                >
                    {({ isSubmitting }) => (
                        <Form>
                            <Field name="email">
                                {({ field }) => (
                                    <TextField
                                        {...field}
                                        type="email"
                                        label="Email address"
                                        fullWidth
                                        margin="normal"
                                        error={Boolean(field.error)}
                                        helperText={<ErrorMessage name="email" />}
                                    />
                                )}
                            </Field>
                            <Field name="password">
                                {({ field }) => (
                                    <TextField
                                        {...field}
                                        type="password"
                                        label="Password"
                                        fullWidth
                                        margin="normal"
                                        error={Boolean(field.error)}
                                        helperText={<ErrorMessage name="password" />}
                                    />
                                )}
                            </Field>
                            <Box mt={2} mb={2}>
                                <Button
                                    type="submit"
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    disabled={isSubmitting}
                                    startIcon={isSubmitting && <CircularProgress size={20} />}
                                >
                                    {isSubmitting ? 'Logging in...' : 'Login'}
                                </Button>
                            </Box>
                        </Form>
                    )}
                </Formik>
                <Typography variant="body2" align="center">
                    Don't have an account? <Link to="/register">Register here</Link>
                </Typography>
            </Card>
        </Box>
    );
};

export default Login;
