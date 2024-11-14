import { toast } from 'react-toastify';
import { setCurrentUser } from '../store/userSlice';
import API from '../API';

export function show({
    message,
    displayClass
}) {
    if (displayClass === "success") {
        toast.success(message)
    }
    else if (displayClass === "warning") {
        toast.warn(message)
    }
    else if (displayClass === "danger" || displayClass === "failure") {
        toast.error(message)
    }
    else {
        toast.info(message)
    }
}


export const checkAuthentication = async (dispatch) => {
    try {
        const response = await API.get('/auth-status');  // Your auth check endpoint
        if (response.data.isAuthenticated) {
            dispatch(setCurrentUser(response.data.user))
        }
        return response.data.isAuthenticated;
    } catch (error) {
        console.error('Authentication check failed:', error);
        return false;
    }
};