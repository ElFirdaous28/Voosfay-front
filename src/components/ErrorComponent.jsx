import React from 'react';

export default function ErrorComponent({ errorType }) {

    let message = '';
    let image = '';
    let errorCode = '';

    switch (errorType) {
        case 'notFound':
            message = 'Oops! The page you are looking for does not exist.';
            image = '/images/not-found.png'; // URL path
            errorCode = '404';
            break;
        case 'unauthorized':
            message = 'You are not authorized to access this page.';
            image = '/images/unauthorized.png'; // URL path
            errorCode = '401';
            break;
        case 'serverError':
            message = 'Something went wrong on our side. Please try again later.';
            image = '/images/server-error.png'; // URL path
            errorCode = '500';
            break;
        default:
            message = 'An unknown error occurred.';
            image = '/images/not-found.png'; // fallback
            errorCode = 'Unknown';
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#252E42] text-gray-300">
            <img src={image} className="max-w-1/4" alt="Error" />
            <p className="text-2xl mb-4 font-bold">{errorCode}</p>
            <p className="text-xl font-semibold">{message}</p>
        </div>
    );
}