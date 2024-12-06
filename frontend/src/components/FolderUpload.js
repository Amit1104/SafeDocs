import React, { useState } from 'react';
import { Formik, Form, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import API from '../API';
import { Box, Button, Typography, LinearProgress, List, ListItem, ListItemText } from '@mui/material';

// Validation schema for bulk file upload
const validationSchema = Yup.object({
    files: Yup.array().min(1, 'At least one file is required').required('Files are required'),
});

const FolderUpload = () => {
    const [uploadProgress, setUploadProgress] = useState({});

    const handleFileUpload = async (values, { setSubmitting, resetForm }) => {
        const files = values.files;

        // Initialize progress state for each file
        setUploadProgress(
            files.reduce((acc, file) => {
                acc[file.name] = 0;
                return acc;
            }, {})
        );

        for (const file of files) {
            const formData = new FormData();
            formData.append('file', file);

            try {
                await API.post('/upload', formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                    onUploadProgress: (progressEvent) => {
                        const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                        setUploadProgress((prevProgress) => ({
                            ...prevProgress,
                            [file.name]: progress,
                        }));
                    },
                });
                toast.success(`${file.name} uploaded successfully!`);
            } catch (error) {
                console.error(`Upload failed for ${file.name}:`, error);
                toast.error(`Failed to upload ${file.name}`);
            }
        }

        setSubmitting(false);
        resetForm();
        setUploadProgress({});
    };

    return (
        <Box mt={5} maxWidth="sm" mx="auto">
            <Typography variant="h4" align="center" gutterBottom>
                Upload Files
            </Typography>
            <Formik
                initialValues={{ files: [] }}
                validationSchema={validationSchema}
                onSubmit={handleFileUpload}
            >
                {({ setFieldValue, isSubmitting }) => (
                    <Form>
                        <Box mb={3}>
                            <Typography variant="body1" gutterBottom>
                                Select Files
                            </Typography>
                            <input
                                type="file"
                                name="files"
                                id="files"
                                className="form-control"
                                multiple
                                onChange={(event) => {
                                    const files = Array.from(event.currentTarget.files);
                                    setFieldValue('files', files);
                                }}
                                style={{ display: 'block', margin: '8px 0' }}
                            />
                            <ErrorMessage name="files" component="div" style={{ color: 'red', fontSize: '0.875rem' }} />
                        </Box>

                        <Button
                            type="submit"
                            variant="contained"
                            color="primary"
                            fullWidth
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Uploading...' : 'Upload'}
                        </Button>

                        {/* Progress indicators for each file */}
                        <List sx={{ mt: 2 }}>
                            {Object.keys(uploadProgress).map((fileName) => (
                                <ListItem key={fileName} sx={{ flexDirection: 'column', alignItems: 'flex-start' }}>
                                    <ListItemText primary={fileName} sx={{ mb: 1 }} />
                                    <Box display="flex" alignItems="center" width="100%">
                                        <LinearProgress
                                            variant="determinate"
                                            value={uploadProgress[fileName]}
                                            sx={{ width: '100%', mr: 1 }}
                                        />
                                        <Typography variant="body2" color="textSecondary">
                                            {uploadProgress[fileName]}%
                                        </Typography>
                                    </Box>
                                </ListItem>
                            ))}
                        </List>
                    </Form>
                )}
            </Formik>
        </Box>
    );
};

export default FolderUpload;
