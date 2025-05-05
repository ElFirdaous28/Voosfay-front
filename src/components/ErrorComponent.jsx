import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ErrorComponent({ errorType }) {
    const navigate = useNavigate(); 

    let message = '';
    let image = '';
    let errorCode = '';

    switch (errorType) {
        case 'notFound':
            message = 'Oops! The page you are looking for does not exist.';
            image = '/images/not-found.png';
            errorCode = '404';
            break;
        case 'unauthorized':
            message = 'You are not authorized to access this page.';
            image = '/images/unauthorized.png';
            errorCode = '401';
            break;
        case 'serverError':
            message = 'Something went wrong on our side. Please try again later.';
            image = '/images/server-error.png';
            errorCode = '500';
            break;
        default:
            message = 'An unknown error occurred.';
            image = '/images/not-found.png';
            errorCode = 'Unknown';
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#252E42] text-gray-300">
            <img src={image} className="max-w-1/4" alt="Error" />
            <p className="text-2xl mb-4 font-bold">{errorCode}</p>
            <p className="text-xl font-semibold">{message}</p>

            <button
                onClick={() => navigate(-1)}
                className="mt-6 py-2 px-4 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                Go Back
            </button>
        </div>
    );
}