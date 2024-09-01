import { toast } from 'react-toastify';
import { handleApiRes, handleApiErr } from '../utils/apiUtils';
const baseURL = import.meta.env.VITE_API_BASE_URL;

export const fetchQuizApi = async (token, quizId) => {
    try {
        const response = await fetch(`${baseURL}/quiz`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ quizId })
        });

        const data = await response.json();
        return data.status === 'success' ? data.data : handleApiRes(data);
    } catch (error) {
        handleApiErr(error, navigate);
    }
};

export const createQuizApi = async (quizData, token, navigate) => {
    try {
        const response = await fetch(`${baseURL}/quiz/create`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(quizData)
        });

        const data = await response.json();
        if (data.status === 'success') {
            toast.success(data.msg);
            return data.quizId;
        } else {
            handleApiRes(data);
        }
    } catch (error) {
        handleApiErr(error, navigate);
    }
};

export const fetchQuestionApi = async (quizId, token, qsnId) => {
    try {
        const response = await fetch(`${baseURL}/quiz/question/${quizId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ qsnId })
        });

        const data = await response.json();
        return data.status === 'success' ? data.data : handleApiRes(data);
    } catch (error) {
        handleApiErr(error, navigate);
    }
};

export const addQuestionApi = async (quizId, quizData, token) => {
    try {
        const response = await fetch(`${baseURL}/quiz/question/add/${quizId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(quizData)
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

export const updateQuestionApi = async (type, quizId, qsnId, token, quizData) => {
    try {
        const response = await fetch(`${baseURL}/quiz/question/update/${quizId}/${qsnId}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({ type, quizData })
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

export const deleteQuizApi = async (qid, token) => {
    try {
        const response = await fetch(`${baseURL}/quiz/delete/${qid}`, {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
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

// ****************************************

export const fetchSharableQuizApi = async (quizId) => {
    try {
        const response = await fetch(`${baseURL}/quiz/share`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ quizId })
        });

        const data = await response.json();
        return data.status === 'success' ? data.data : handleApiRes(data);
    } catch (error) {
        handleApiErr(error, navigate);
    }
};

export const updateQuizResponseApi = async (type, quizId, qsnNo, optNo) => {
    try {
        const response = await fetch(`${baseURL}/quiz/share/response/${quizId}/${qsnNo}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ type, optNo }),
        });

        const data = await response.json();
        if (data.status === 'success') {
            return true;
        } else {
            handleApiRes(data);
        }
    } catch (error) {
        handleApiErr(error, navigate);
    }
};

export const countQuizHitsApi = async (quizId) => {
    try {
        await fetch(`${baseURL}/quiz/share/hits/${quizId}`, {
            method: 'GET'
        });
    } catch (error) {
        handleApiErr(error, navigate);
    }
};