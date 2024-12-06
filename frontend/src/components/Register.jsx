import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import API from '../API';
import { Box, Button, Card, Typography, TextField } from '@mui/material';

const validationSchema = Yup.object({
    name: Yup.string().required('Name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('password'), null], 'Passwords must match')
        .required('Confirm password is required'),
});

const Register = () => {
    const navigate = useNavigate();

    const handleRegister = async (values, { setSubmitting, setFieldError }) => {
        try {
            await API.post('/register', {
                username: values.name,
                email: values.email,
                password: values.password,
            });
            toast.success('Registration successful! You can now log in.');
            navigate('/');
        } catch (error) {
            toast.error('Registration failed. This email might already be registered.');
            setFieldError('email', 'This email is already registered');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <Box display="flex" alignItems="center" justifyContent="center" minHeight="100vh">
            <Card sx={{ padding: 4, maxWidth: 400, width: '100%' }}>
                <Typography variant="h5" align="center" gutterBottom>
                    Register
                </Typography>
                <Formik
                    initialValues={{ name: '', email: '', password: '', confirmPassword: '' }}
                    validationSchema={validationSchema}
                    onSubmit={handleRegister}
                >
                    {({ isSubmitting, setFieldValue }) => (
                        <Form>
                            <Box mb={3}>
                                <Field name="name">
                                    {({ field }) => (
                                        <TextField
                                            {...field}
                                            label="Name"
                                            fullWidth
                                            margin="normal"
                                            error={Boolean(field.error)}
                                            helperText={<ErrorMessage name="name" />}
                                        />
                                    )}
                                </Field>
                            </Box>
                            <Box mb={3}>
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
                            </Box>
                            <Box mb={3}>
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
                            </Box>
                            <Box mb={3}>
                                <Field name="confirmPassword">
                                    {({ field }) => (
                                        <TextField
                                            {...field}
                                            type="password"
                                            label="Confirm Password"
                                            fullWidth
                                            margin="normal"
                                            error={Boolean(field.error)}
                                            helperText={<ErrorMessage name="confirmPassword" />}
                                        />
                                    )}
                                </Field>
                            </Box>
                            <Button
                                type="submit"
                                variant="contained"
                                color="primary"
                                fullWidth
                                disabled={isSubmitting}
                            >
                                {isSubmitting ? 'Registering...' : 'Register'}
                            </Button>
                        </Form>
                    )}
                </Formik>
                <Typography variant="body2" align="center" mt={2}>
                    Already have an account? <Link to="/">Login here</Link>
                </Typography>
            </Card>
        </Box>
    );
};

export default Register;
