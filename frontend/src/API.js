import axios from 'axios';

const serverPath = process.env.REACT_APP_SERVER_PROJPATH;

let API = axios.create({
    baseURL: serverPath,
    withCredentials: true,
    headers: {
        'Strict-Transport-Security': 'max-age=31536000; includeSubDomains',
        'Content-Security-Policy': "frame-ancestors 'none';",
        'X-Frame-Options': 'DENY',
        'X-Content-Type-Options': 'nosniff',
        'Server': '',
        //extra options
        'X-XSS-Protection': '1; mode=block',
        'Referrer-Policy': 'no-referrer-when-downgrade',
    }
});

export default API; 
