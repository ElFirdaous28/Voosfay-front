import React from 'react'
import NotFoundImg from '../../public/images/not-found.png';
import UnauthorizedImg from '../../public/images/unauthorized.png';
import ServerErrorImg from '../../public/images/server-error.png';

export default function ErrorComponent({ errorType }) {

    let message = '';
    let image = null;
    let errorCode = '';

    switch (errorType) {
        case 'notFound':
            message = 'Oops! The page you are looking for does not exist.';
            image = NotFoundImg;
            errorCode = '404';
            break;
        case 'unauthorized':
            message = 'You are not authorized to access this page.';
            image = UnauthorizedImg;
            errorCode = '401';
            break;
        case 'serverError':
            message = 'Something went wrong on our side. Please try again later.';
            image = ServerErrorImg;
            errorCode = '500';
            break;
        default:
            message = 'An unknown error occurred.';
            image = NotFoundImg;
            errorCode = 'Unknown';
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-[#252E42] text-gray-300">
            <img src={image} className='max-w-1/4' alt="Error" />
            <p className="text-2xl mb-4 font-bold">{errorCode}</p>
            <p className="text-xl font-semibold">{message}</p>
        </div>
    )
}
