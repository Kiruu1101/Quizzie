import { toast } from 'react-toastify';
import { handleApiRes, handleApiErr } from '../utils/apiUtils';
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const userLoginApi = async (userData) => {
    try {
        const response = await fetch(`${baseURL}/user/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        return data.status === 'success' ? data.token : handleApiRes(data);
    } catch (error) {
        handleApiErr(error, navigate);
    }
};

export const userRegisterApi = async (userData) => {
    try {
        const response = await fetch(`${baseURL}/user/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData),
        });

        const data = await response.json();
        if (data.status === 'success') {
            toast.success(data.msg);
            return true;
        } else {
            handleApiRes(data);
        }
    } catch (error) {
        handleApiErr(error, navigate);
    }
};