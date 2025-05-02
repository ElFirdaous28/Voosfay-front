import React from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Users, Star, Luggage } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { toast } from 'react-toastify';

const RideList = ({ rides, fetchRides, hasMoreRides, isLoading }) => {
    const { user } = useAuth();
    const handleDelete = async (id) => {
        try {
            await api.delete(`v1/rides/${id}`);
            fetchRides();
            toast.success('Ride deleted successfully');
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Failed to delete');
        }
    }

    return (
        <div className="flex-1 space-y-4">
            {rides.length > 0 ? (
                <>
                    {rides.map((ride) => (
                        <div key={ride.id} className="relative">
                            {(ride.user.gender === "Female") &&
                                <img src="images/ribbon.png" className='w-10 absolute top-6 right-0 z-10 rotate-[25deg]' alt="ribon icon" />
                            }
                            <div className="bg-zinc-800 rounded-lg overflow-hidden shadow-md">
                                <div className="p-4">
                                    <div className="border-b border-gray-700 text-white text-sm md:text-base">
                                        {new Date(ride.start_time).toLocaleDateString('en-US', {
                                            weekday: 'long',
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </div>
                                    <div className='border-2 rounded-lg border-blue-600'>
                                        <div className="p-3 md:p-4 flex items-center">
                                            <div className="flex-1 flex">
                                                <div className="flex flex-col items-center mr-3 md:mr-4">
                                                    <div className="text-white text-sm md:text-base">
                                                        {new Date(ride.start_time).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                    <div className="bg-gray-600 w-0.5 h-6 my-1"></div>
                                                    <div className="text-white text-sm md:text-base">
                                                        {new Date(ride.ending_time).toLocaleTimeString('en-US', {
                                                            hour: '2-digit',
                                                            minute: '2-digit'
                                                        })}
                                                    </div>
                                                </div>
                                                <div className="flex flex-col justify-between">
                                                    <div className="flex items-center">
                                                        <MapPin size={16} className="text-gray-400 mr-1" />
                                                        <span className="text-white text-sm md:text-base">{ride.start_location}</span>
                                                    </div>
                                                    <div className="flex items-center">
                                                        <MapPin size={16} className="text-gray-400 mr-1" />
                                                        <span className="text-white text-sm md:text-base">{ride.ending_location}</span>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* driver infos */}
                                            <Link to={`/profile/ratings/${ride.user_id}`} className="ml-2 flex flex-col items-center justify-center">
                                                <img
                                                    src={ride.user?.image ? `http://127.0.0.1:8000/storage/${ride.user.image}` : '/images/avatar-default.png'}
                                                    alt="User Avatar"
                                                    className="w-10 h-10 md:w-12 md:h-12 rounded-full object-cover mb-1"
                                                />
                                                <div className="text-white text-xs md:text-sm">{ride.user.name}</div>
                                                <div className="flex items-center">
                                                    <Star size={12} className="text-yellow-500 mr-1" fill="currentColor" />
                                                    <span className="text-yellow-500 text-xs">
                                                        {parseFloat(ride.rating_average).toFixed(1)} ({ride.rating_count || 0} rides)
                                                    </span>
                                                </div>
                                            </Link>
                                        </div>

                                        {/* ride more details */}
                                        <div className="border-t border-gray-700 px-3 md:px-4 py-2 flex flex-wrap items-center gap-3 md:gap-6">
                                            <div className="flex items-center text-gray-300">
                                                <Users size={16} className="mr-1" />
                                                <span className="text-xs">{ride.available_seats} seats available</span>
                                            </div>

                                            {ride.luggage_allowed && (
                                                <div className="flex items-center text-gray-300">
                                                    <Luggage size={16} className="mr-1" />
                                                    <span className="text-xs">Luggage space</span>
                                                </div>
                                            )}
                                            <Link to={`/ride-details/${ride.id}`} className='text-cyan-400 text-sm hover:underline'>See details</Link>

                                            {(ride.user_id === user.id && new Date(ride.ending_time) > new Date()) && (
                                                <div className="flex items-center space-x-4">
                                                    <Link
                                                        to={`/edit-ride/${ride.id}`}
                                                        className="text-yellow-400 text-sm hover:underline"
                                                    >
                                                        Edit
                                                    </Link>
                                                    <button
                                                        onClick={() => handleDelete(ride.id)}
                                                        className="text-red-500 text-sm hover:underline"
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}

                    {hasMoreRides && (
                        <div className="flex justify-center py-4">
                            <button
                                onClick={() => fetchRides()}
                                disabled={isLoading}
                                className={`px-6 py-2 rounded text-white font-medium transition-colors ${isLoading ? 'bg-blue-800 opacity-70' : 'bg-cyan-600 hover:bg-cyan-500'}`}
                            >
                                {isLoading ? 'Loading...' : 'Load More'}
                            </button>
                        </div>
                    )}
                </>
            ) : (
                <div className="bg-zinc-800 rounded-lg p-8 text-center">
                    <p className="text-gray-400">
                        {isLoading ? 'Searching for rides...' : 'No rides found.!'}
                    </p>
                </div>
            )}
        </div>
    );
};

export default RideList;