import type {User} from '../models/User.js';
import type {Report} from '../models/Report.js';

export const getMe= (token: string) => {
    return fetch('/api/users/me', {
        headers: {
            'Content-Type': 'application/json',
            authorization: `Bearer ${token}`,
        },
    });
};

export const createUser= (userData: User) => {
    return fetch('/api/users', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        }, 
        body: JSON.stringify(userData), 
    });
};

export const loginUser= (userData: User) => {
    return fetch('/api/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
    });
};

export const newReport= (reportData: Report)=> {
    return fetch('/api/reports', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
    });
};

export const deleteReport= (reportId: string, token: string) => {
    return fetch(`/api/users/reports/${reportId}`, {
        method: 'DELETE',
        headers: {
            authorization: `Bearer ${token}`,
        },
    });
};