import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';
import api from '../Services/api';

const RatingPopup = ({ show, onClose, ride, reservationId }) => {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    const { user } = useAuth();
    if (!show) return null;

    const handleRatingSubmit = async () => {
        try {
            const response = await api.post('v1/reviews', {
                reservation_id: reservationId,
                reviewed_id: user.id,
                rating: rating,
                comment: comment
            })
            console.log(response.data);
            toast.success('Review submitted successfully');
        } catch (error) {
            console.log('Error while reserving', error.response.data);
            toast.error(error.response.data);
        }
        onClose();
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-zinc-800 rounded-lg shadow-lg w-1/3 p-6">
                <div className="text-lg font-bold mb-4 text-white">Rate Ride</div>
                <p className="text-white text-sm">Rate the ride from {ride.start_location} to {ride.ending_location}</p>
                <div className="flex items-center mt-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <span
                            key={star}
                            onClick={() => setRating(star)}
                            className={`text-xl cursor-pointer ${star <= rating ? 'text-yellow-500' : 'text-gray-300'}`}>
                            ★
                        </span>
                    ))}
                </div>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    placeholder="Leave a comment"
                    className="w-full p-2 mt-2 border border-gray-600 rounded-lg text-white bg-zinc-700"
                    rows="4"
                />
                <div className="flex justify-between mt-4">
                    <button
                        onClick={onClose}
                        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-400">
                        Close
                    </button>
                    <button
                        onClick={handleRatingSubmit}
                        className="bg-yellow-500 text-white py-2 px-4 rounded hover:bg-yellow-400">
                        Submit Rating
                    </button>
                </div>
            </div>
        </div>
    );
};

export default RatingPopup;