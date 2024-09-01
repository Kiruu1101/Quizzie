import { toast } from 'react-toastify';

export const handleApiRes = (response) => {
    const { status, msg } = response;
    if (status === 'jwtError') {
        throw new Error('JWT Error');
    } else {
        toast.error(msg);
    }
};

export const handleApiErr = (error, navigate) => {
    console.error(error);
    toast.error("Something went wrong. Please re-login.");
    navigate('/login');
};