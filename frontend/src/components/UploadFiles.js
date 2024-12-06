import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

const UploadFiles = () => {
    const [folderName, setFolderName] = useState('');
    const [selectedFiles, setSelectedFiles] = useState(null);

    const handleFolderNameChange = (e) => {
        setFolderName(e.target.value);
    };

    const handleFileChange = (e) => {
        setSelectedFiles(e.target.files);
    };

    const createFolderAndUploadFiles = async (e) => {
        e.preventDefault();

        if (!folderName) {
            toast.error('Please enter a folder name');
            return;
        }
        if (!selectedFiles) {
            toast.error('Please select files to upload');
            return;
        }

        try {
            // Step 1: Create the folder
            const folderResponse = await axios.post('/api/create-folder', { folderName });
            const folderPath = folderResponse.data.folderPath;

            toast.success('Folder created successfully!');

            // Step 2: Upload files to the created folder
            const formData = new FormData();
            for (let i = 0; i < selectedFiles.length; i++) {
                formData.append('files', selectedFiles[i]);
            }
            formData.append('folderPath', folderPath); // Send the folder path to upload files within that folder

            const uploadResponse = await axios.post('/api/upload-files', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            toast.success('Files uploaded successfully!');
            console.log(uploadResponse.data);
        } catch (error) {
            console.error('Error uploading files:', error);
            toast.error('An error occurred while uploading files.');
        }
    };

    return (
        <div className="container mt-5">
            <h2>Create Folder and Upload Files</h2>
            <form onSubmit={createFolderAndUploadFiles}>
                <div className="mb-3">
                    <label htmlFor="folderName" className="form-label">Folder Name</label>
                    <input
                        type="text"
                        id="folderName"
                        className="form-control"
                        value={folderName}
                        onChange={handleFolderNameChange}
                        required
                    />
                </div>
                <div className="mb-3">
                    <label htmlFor="fileUpload" className="form-label">Select Files</label>
                    <input
                        type="file"
                        id="fileUpload"
                        className="form-control"
                        multiple
                        onChange={handleFileChange}
                        required
                    />
                </div>
                <button type="submit" className="btn btn-primary">Create Folder and Upload Files</button>
            </form>
        </div>
    );
};

export default UploadFiles;
