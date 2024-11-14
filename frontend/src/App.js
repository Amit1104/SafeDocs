/* eslint-disable react-hooks/exhaustive-deps */
import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import Register from './components/Register';
import Navbar from './components/Navbar';
import FolderUpload from './components/FolderUpload';
import FileList from './components/FileList';
import NotFound from './components/NotFound';
import { useDispatch } from 'react-redux';
import { checkAuthentication } from './utils/Helper';


function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const dispatch = useDispatch()


    // Usage in a component
    useEffect(() => {
        checkAuthentication(dispatch).then(isAuthenticated => {
            setIsAuthenticated(isAuthenticated);
        });
    }, []);

    return (
        <Router>
            <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
            <Navbar />
            <div className="p-3">
                <Routes>
                    <Route path="/" element={<Login setIsAuthenticated={setIsAuthenticated} />} />
                    <Route path="/register" element={<Register />} />
                    {isAuthenticated && <>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/upload" element={<FolderUpload />} />
                        <Route path="/files" element={<FileList />} />
                    </>}
                    <Route path="*" element={<NotFound />} />

                </Routes>
            </div>
        </Router>
    );
}

export default App;
