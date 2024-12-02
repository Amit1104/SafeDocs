import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import API from '../API';
import {
    Box,
    Typography,
    Table,
    TableContainer,
    TableHead,
    TableRow,
    TableCell,
    TableBody,
    Button,
    Paper,
    CircularProgress,
    TextField
} from '@mui/material';

const FileList = () => {
    const [files, setFiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filteredFiles, setFilteredFiles] = useState([]);

    useEffect(() => {
        const fetchFiles = async () => {
            try {
                const response = await API.get('/files'); // Replace with your actual API endpoint
                setFiles(response.data.files);
                setFilteredFiles(response.data.files); // Initialize filtered files
            } catch (error) {
                console.error('Error fetching files:', error);
                toast.error('Failed to load files');
            } finally {
                setLoading(false);
            }
        };

        fetchFiles();
    }, []);

    const handleDownload = async (file_name, file_path) => {
        try {
            const response = await API.get(`/download_file?filename=${file_name}`, {
                responseType: 'blob',
                withCredentials: true
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', file_name);
            document.body.appendChild(link);
            link.click();

            link.remove();
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error('Error downloading file:', error);
        }
    };

    const handleDelete = async (fileName) => {
        try {
            await API.post(`/delete_file`, { filename: fileName });
            const updatedFiles = files.filter((file) => file.file_name !== fileName);
            setFiles(updatedFiles);
            setFilteredFiles(updatedFiles);
            toast.success('File deleted successfully');
        } catch (error) {
            console.error('Delete failed:', error);
            toast.error('Failed to delete file');
        }
    };

    const handleSearch = (event) => {
        const searchValue = event.target.value.toLowerCase();
        setSearchTerm(searchValue);
        setFilteredFiles(
            files.filter((file) =>
                file.file_name.toLowerCase().includes(searchValue)
            )
        );
    };

    const handleCopy = (text) => {
        navigator.clipboard.writeText(text)
            .then(() => toast.success('Link copied to clipboard!'))
            .catch(() => toast.error('Failed to copy link'));
    };


    const handleTempLink = async (file_path) => {
        //generate_link/<document_id>
        try {
            const res = await API.post(`/generate_link`, { file_path });
            handleCopy(res.data.temporary_link)
            // const updatedFiles = files.filter((file) => file.file_name !== file_path);
            // setFiles(updatedFiles);
            // setFilteredFiles(updatedFiles);
            // toast.success('File deleted successfully');
        } catch (error) {
            console.error('Get failed:', error);
            // toast.error('Failed to delete file');
        }
    }

    return (
        <Box mt={5} maxWidth="md" mx="auto">
            <Typography variant="h4" align="center" gutterBottom>
                Files
            </Typography>
            <TextField
                label="Search Files"
                variant="outlined"
                fullWidth
                margin="normal"
                value={searchTerm}
                onChange={handleSearch}
            />
            {loading ? (
                <Box display="flex" justifyContent="center" mt={3}>
                    <CircularProgress />
                </Box>
            ) : filteredFiles.length === 0 ? (
                <Typography variant="body1" align="center" mt={3}>
                    No files available
                </Typography>
            ) : (
                <TableContainer component={Paper}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell>File Name</TableCell>
                                <TableCell>Size (KB)</TableCell>
                                <TableCell>Actions</TableCell>
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {filteredFiles.map((file, i) => (
                                <TableRow key={file.file_name}>
                                    <TableCell>{file.file_name}</TableCell>
                                    <TableCell>{file.file_size_kb.toFixed(2)}</TableCell>
                                    <TableCell>
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            size="small"
                                            onClick={() => handleDownload(file.file_name, file.file_path)}
                                            sx={{ m: 1 }}
                                        >
                                            Download
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="secondary"
                                            size="small"
                                            onClick={() => handleDelete(file.file_name)}
                                            sx={{ m: 1 }}
                                        >
                                            Delete
                                        </Button>
                                        <Button
                                            variant="contained"
                                            color="info"
                                            size="small"
                                            onClick={() => handleTempLink(file.file_path)}
                                            sx={{ m: 1 }}
                                        >
                                            Copy Link (1hr valid)
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </Box>
    );
};

export default FileList;
