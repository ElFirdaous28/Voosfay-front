import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import { MapPin, Users, Calendar, Clock, Luggage, Music2, MessageSquare, Utensils, PawPrint, Check, X, ArrowRight } from 'lucide-react';
import api from '../../Services/api';
import Spinner from '../../components/Spinner';

export default function RideDetails() {
    const { id } = useParams();
    const [ride, setRide] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchRide = async () => {
            try {
                const response = await api.get(`/v1/rides/${id}`);
                setRide(response.data.ride);
                console.log(response.data.ride);
                
            } catch (err) {
                console.error('Error fetching ride details', err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRide();
    }, [id]);

    if (isLoading) {
        return (
            <Layout>
                <Spinner />
            </Layout>
        );
    }

    if (!ride) {
        return (
            <Layout>
                <div className="max-w-4xl mx-auto p-6 text-center">
                    <div className="bg-zinc-800 rounded-lg shadow-lg p-8">
                        <h2 className="text-xl font-semibold text-red-400 mb-2">Ride Not Found</h2>
                        <p className="text-gray-400">The ride you're looking for doesn't exist or has been removed.</p>
                        <Link to="/rides" className="mt-6 inline-block bg-cyan-600 text-white px-5 py-2 rounded-lg hover:bg-cyan-500 transition-colors">
                            Browse Available Rides
                        </Link>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl shadow-xl overflow-hidden">

                    {/* header */}
                    <div className="relative bg-green-700 p-6">
                        <div className="flex justify-between items-center">
                            <h2 className="text-2xl font-bold text-white">Ride Details</h2>
                            <Link
                                to={`/profile/ratings/${ride.user_id}`}
                                className="group flex items-center gap-3 bg-green-900/50 p-2 rounded-lg hover:bg-green-900 transition-all">
                                <img
                                    src={ride.user?.picture ? `http://127.0.0.1:8000/storage/${ride.user.picture}` : '/images/default-avatar.png'}
                                    alt="Driver"
                                    className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400" />

                                <div className="flex flex-col">
                                    <span className="text-white font-medium">{ride.user?.name}</span>
                                    <span className="text-xs text-cyan-200">View Profile</span>
                                </div>
                            </Link>
                        </div>
                    </div>

                    {/* Main content */}
                    <div className="p-6">
                        {/* Journey details */}
                        <div className="space-y-5 mb-8">
                            <div className="flex items-center gap-4 p-4 bg-zinc-700/20 rounded-lg">
                                <Calendar size={24} className="text-cyan-400" />
                                <div>
                                    <h3 className="text-gray-400 text-sm">Date</h3>
                                    <p className="text-white">{new Date(ride.start_time).toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-zinc-700/20 rounded-lg">
                                <Clock size={24} className="text-cyan-400" />
                                <div>
                                    <h3 className="text-gray-400 text-sm">Time</h3>
                                    <p className="text-white flex items-center">
                                        {new Date(ride.start_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                        <ArrowRight size={16} className="mx-2 text-gray-400" />
                                        {new Date(ride.ending_time).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-zinc-700/20 rounded-lg">
                                <MapPin size={24} className="text-cyan-400" />
                                <div>
                                    <h3 className="text-gray-400 text-sm">Route</h3>
                                    <p className="text-white flex items-center">
                                        <span className="truncate">{ride.start_location}</span>
                                        <ArrowRight size={16} className="mx-2 text-gray-400 flex-shrink-0" />
                                        <span className="truncate">{ride.ending_location}</span>
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 p-4 bg-zinc-700/20 rounded-lg">
                                <Users size={24} className="text-cyan-400" />
                                <div>
                                    <h3 className="text-gray-400 text-sm">Availability</h3>
                                    <p className="text-white">
                                        <span className="text-lg font-semibold">{ride.available_seats}</span> seats available
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Ride preferences */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Ride Preferences</h3>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className={`flex items-center p-3 rounded-lg ${ride.luggage_allowed ? 'bg-green-900/20' : 'bg-red-900/10'}`}>
                                    {ride.luggage_allowed ?
                                        <Check size={18} className="text-green-400 mr-3" /> :
                                        <X size={18} className="text-red-400 mr-3" />
                                    }
                                    <Luggage size={18} className="mr-2 text-gray-300" />
                                    <span className="text-gray-200">Luggage</span>
                                </div>

                                <div className={`flex items-center p-3 rounded-lg ${ride.pet_allowed ? 'bg-green-900/20' : 'bg-red-900/10'}`}>
                                    {ride.pet_allowed ?
                                        <Check size={18} className="text-green-400 mr-3" /> :
                                        <X size={18} className="text-red-400 mr-3" />
                                    }
                                    <PawPrint size={18} className="mr-2 text-gray-300" />
                                    <span className="text-gray-200">Pets</span>
                                </div>

                                <div className={`flex items-center p-3 rounded-lg ${ride.music_allowed ? 'bg-green-900/20' : 'bg-red-900/10'}`}>
                                    {ride.music_allowed ?
                                        <Check size={18} className="text-green-400 mr-3" /> :
                                        <X size={18} className="text-red-400 mr-3" />
                                    }
                                    <Music2 size={18} className="mr-2 text-gray-300" />
                                    <span className="text-gray-200">Music</span>
                                </div>

                                <div className={`flex items-center p-3 rounded-lg ${ride.conversation_allowed ? 'bg-green-900/20' : 'bg-red-900/10'}`}>
                                    {ride.conversation_allowed ?
                                        <Check size={18} className="text-green-400 mr-3" /> :
                                        <X size={18} className="text-red-400 mr-3" />
                                    }
                                    <MessageSquare size={18} className="mr-2 text-gray-300" />
                                    <span className="text-gray-200">Conversation</span>
                                </div>

                                <div className={`flex items-center p-3 rounded-lg ${ride.food_allowed ? 'bg-green-900/20' : 'bg-red-900/10'}`}>
                                    {ride.food_allowed ?
                                        <Check size={18} className="text-green-400 mr-3" /> :
                                        <X size={18} className="text-red-400 mr-3" />
                                    }
                                    <Utensils size={18} className="mr-2 text-gray-300" />
                                    <span className="text-gray-200">Food</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-800 p-6 flex justify-between items-center bg-zinc-900">
                        <Link
                            to="/rides"
                            className="text-gray-400 hover:text-white transition-colors">
                            Back to rides
                        </Link>
                        <Link
                            to={`/reserve/${ride.id}`}
                            className="bg-gradient-to-r from-cyan-600 to-cyan-500 text-white px-6 py-3 rounded-lg hover:from-cyan-500 hover:to-cyan-400 transition-all shadow-lg font-medium">
                            Reserve a seat
                        </Link>
                    </div>
                </div>
            </div>
        </Layout>
    );
}