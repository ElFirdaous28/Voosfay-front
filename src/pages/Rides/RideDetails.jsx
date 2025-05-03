import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import { MapPin, Users, Calendar, Clock, Luggage, Music2, MessageSquare, Utensils, PawPrint, Check, X, ArrowRight, CircleSlash, CalendarCheck, Loader2, BadgeCheck } from 'lucide-react';
import api from '../../Services/api';
import Spinner from '../../components/Spinner';
import { toast } from 'react-toastify';
import { useAuth } from '../../context/AuthContext';
import ReportPopup from '../../components/ReportPopup';
import RatingPopup from '../../components/RatingPopup';

export default function RideDetails() {
    const { user } = useAuth();
    const { id } = useParams();
    const [ride, setRide] = useState(null);
    const [pendingResevations, setPendingResevations] = useState(null);
    const [acceptedResevations, setAcceptedResevations] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    const [showReportPopup, setShowReportPopup] = useState(false);
    const [showRatingPopup, setShowRatingPopup] = useState(false);
    const [selectedRide, setSelectedRide] = useState(null);
    const [selectedReservationId, setSelectedReservationId] = useState(null);

    const handleReportPopup = (ride) => {
        setSelectedRide(ride);
        setShowReportPopup(true);
    };

    const handleRatingPopup = (ride, reservationId) => {
        setSelectedRide(ride);
        setSelectedReservationId(reservationId)
        setShowRatingPopup(true);
    };

    const closePopups = () => {
        setShowReportPopup(false);
        setShowRatingPopup(false);
        setSelectedRide(null);
        setSelectedReservationId(null);
    };

    const fetchRide = async () => {
        try {
            const response = await api.get(`/v1/rides/${id}`);
            setRide(response.data.ride);
        } catch (err) {
            console.error('Error fetching ride details', err);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchRideResevations = async () => {
        try {
            const response = await api.get(`/v1/ride/reservations/${id}`);
            setPendingResevations(response.data.pending);
            setAcceptedResevations(response.data.accepted);
            console.log(response.data);
        } catch (err) {
            console.error('Error fetching ride details', err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchRide();
        fetchRideResevations();
    }, [id]);
    const statusColors = {
        available: 'bg-green-600 text-white',
        full: 'bg-yellow-600 text-white',
        in_progress: 'bg-blue-600 text-white',
        completed: 'bg-gray-500 text-white',
        cancelled: 'bg-red-600 text-white',
    };

    const statusIcons = {
        available: <BadgeCheck size={16} className="mr-2" />,
        full: <Users size={16} className="mr-2" />,
        in_progress: <Loader2 size={16} className="mr-2 animate-spin" />,
        completed: <CalendarCheck size={16} className="mr-2" />,
        cancelled: <CircleSlash size={16} className="mr-2" />,
    };
    const handleReserve = async (rideId) => {
        try {
            const response = await api.post('v1/reservation', { ride_id: rideId })
            console.log(response.data);
            toast.success('Ride deleted successfully');
        } catch (error) {
            console.log('Error while reserving', error.response.data.message);
            toast.error(error.response.data.message);
        }
    }

    const handleReservationAction = async (id, status) => {
        try {
            const response = await api.patch(`v1/reservations/${id}/status`, { status });
            console.log(response.data);
            toast.success(`Reservation ${status} successfully.`);
        } catch (error) {
            console.error('Error while handling reservation:', error);
            toast.error(error?.response?.data?.message || 'Failed to update reservation status');
        }
    }

    if (isLoading) return (<Layout><Spinner /></Layout>);

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
                                className="group flex flex-col items-center transition-all">
                                <img
                                    src={ride.user?.picture ? `http://127.0.0.1:8000/storage/${ride.user.picture}` : '/images/default-avatar.png'}
                                    alt="Driver"
                                    className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400" />

                                <div className="flex flex-col">
                                    <span className="text-white font-semibold">{ride.user?.name}</span>
                                </div>
                            </Link>
                        </div>
                        <div className="mt-4 float-right">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-semibold ${statusColors[ride.status]}`}>
                                {statusIcons[ride.status]} {ride.status.replace('_', ' ')}
                            </span>
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
                                <div className={`flex items-center p-3 rounded-lg ${ride.luggage_allowed ? 'bg-green-900/20' : ''}`}>
                                    {ride.luggage_allowed ?
                                        <Check size={18} className="text-green-400 mr-3" /> :
                                        <X size={18} className="text-red-400 mr-3" />
                                    }
                                    <Luggage size={18} className="mr-2 text-gray-300" />
                                    <span className="text-gray-200">Luggage</span>
                                </div>

                                <div className={`flex items-center p-3 rounded-lg ${ride.pet_allowed ? 'bg-green-900/20' : ''}`}>
                                    {ride.pet_allowed ?
                                        <Check size={18} className="text-green-400 mr-3" /> :
                                        <X size={18} className="text-red-400 mr-3" />
                                    }
                                    <PawPrint size={18} className="mr-2 text-gray-300" />
                                    <span className="text-gray-200">Pets</span>
                                </div>

                                <div className={`flex items-center p-3 rounded-lg ${ride.music_allowed ? 'bg-green-900/20' : ''}`}>
                                    {ride.music_allowed ?
                                        <Check size={18} className="text-green-400 mr-3" /> :
                                        <X size={18} className="text-red-400 mr-3" />
                                    }
                                    <Music2 size={18} className="mr-2 text-gray-300" />
                                    <span className="text-gray-200">Music</span>
                                </div>

                                <div className={`flex items-center p-3 rounded-lg ${ride.conversation_allowed ? 'bg-green-900/20' : ''}`}>
                                    {ride.conversation_allowed ?
                                        <Check size={18} className="text-green-400 mr-3" /> :
                                        <X size={18} className="text-red-400 mr-3" />
                                    }
                                    <MessageSquare size={18} className="mr-2 text-gray-300" />
                                    <span className="text-gray-200">Conversation</span>
                                </div>

                                <div className={`flex items-center p-3 rounded-lg ${ride.food_allowed ? 'bg-green-900/20' : ''}`}>
                                    {ride.food_allowed ?
                                        <Check size={18} className="text-green-400 mr-3" /> :
                                        <X size={18} className="text-red-400 mr-3" />
                                    }
                                    <Utensils size={18} className="mr-2 text-gray-300" />
                                    <span className="text-gray-200">Food</span>
                                </div>
                            </div>
                        </div>

                        {/* pending reservations */}
                        <div className="mb-8 px-6">
                            <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Requests</h3>
                            {pendingResevations && pendingResevations.length > 0 ? (
                                <ul className="space-y-4">
                                    {pendingResevations.map((reservation) => (
                                        <li key={reservation.id} className="bg-slate-700 p-4 rounded-lg">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={reservation.user?.picture ? `http://127.0.0.1:8000/storage/${reservation.user.picture}` : '/images/default-avatar.png'}
                                                        alt={reservation.user?.name}
                                                        className="w-10 h-10 rounded-full object-cover border border-cyan-500" />
                                                    <div>
                                                        <p className="text-white font-semibold">{reservation.user?.name}</p>
                                                        <p className="text-sm text-gray-400">Reserved at {new Date(reservation.created_at).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* actions */}
                                            <div className="flex justify-end gap-3 mt-2">

                                                {ride.status !== 'in_progress' && ride.status !== 'completed' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleReservationAction(reservation.id, 'accepted')}
                                                            className="px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700">
                                                            Accept
                                                        </button>

                                                        <button
                                                            onClick={() => handleReservationAction(reservation.id, 'rejected')}
                                                            className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700">
                                                            Reject
                                                        </button>

                                                        <button
                                                            onClick={() => handleReservationAction(reservation.id, 'cancelled')}
                                                            className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700">
                                                            Cancel
                                                        </button>
                                                    </div>
                                                )}
                                            </div>

                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400">No reservations yet for this ride.</p>
                            )}
                        </div>

                        {/* acpted reservations */}
                        <div className="mb-8 px-6">
                            <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Reservations</h3>
                            {acceptedResevations && acceptedResevations.length > 0 ? (
                                <ul className="space-y-4">
                                    {acceptedResevations.map((reservation) => (
                                        <li key={reservation.id} className="bg-slate-700 p-4 rounded-lg">
                                            <div className="flex items-center justify-between mb-3">
                                                <div className="flex items-center gap-4">
                                                    <img
                                                        src={reservation.user?.picture ? `http://127.0.0.1:8000/storage/${reservation.user.picture}` : '/images/default-avatar.png'}
                                                        alt={reservation.user?.name}
                                                        className="w-10 h-10 rounded-full object-cover border border-cyan-500" />
                                                    <div>
                                                        <p className="text-white font-semibold">{reservation.user?.name}</p>
                                                        <p className="text-sm text-gray-400">Reserved at {new Date(reservation.created_at).toLocaleString()}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            {/* accepted reservations actions */}
                                            <div className="flex justify-end gap-3 mt-2">
                                                {ride.status !== 'in_progress' && ride.status !== 'completed' && (
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleReservationAction(reservation.id, 'accepted')}
                                                            className="px-4 py-2 rounded-lg text-white bg-green-600 hover:bg-green-700">
                                                            Accept
                                                        </button>

                                                        <button
                                                            onClick={() => handleReservationAction(reservation.id, 'rejected')}
                                                            className="px-4 py-2 rounded-lg text-white bg-red-600 hover:bg-red-700">
                                                            Reject
                                                        </button>

                                                        <button
                                                            onClick={() => handleReservationAction(reservation.id, 'completed')}
                                                            className="px-4 py-2 rounded-lg text-white bg-blue-600 hover:bg-blue-700">
                                                            Complete
                                                        </button>
                                                    </div>
                                                )}

                                                {(ride.status === 'completed' && reservation.user.id !== user.id && user?.id === ride?.user_id) && (
                                                    <div className="flex gap-2 mt-2">
                                                        <button
                                                            onClick={() => handleRatingPopup(ride, reservation.id)}
                                                            className="px-4 py-2 rounded-lg text-white bg-yellow-600 hover:bg-yellow-700">
                                                            Rate
                                                        </button>

                                                        <button
                                                            onClick={() => setShowReportPopup(true)}
                                                            className="px-4 py-2 rounded-lg text-white bg-red-700 hover:bg-red-800">
                                                            Report
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p className="text-gray-400">No reservations yet for this ride.</p>
                            )}
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="border-t border-gray-800 p-6 flex justify-between items-center bg-zinc-900">
                        <Link
                            to="/rides"
                            className="text-gray-400 hover:text-white transition-colors">
                            Back to rides
                        </Link>
                        {(user?.id !== ride.user_id && ride.status === 'available') && (
                            <button
                                onClick={() => handleReserve(ride.id)}
                                to={`/reserve/${ride.id}`}
                                className="bg-gradient-to-r from-cyan-600 to-cyan-500 text-white px-6 py-3 rounded-lg hover:from-cyan-500 hover:to-cyan-400 transition-all shadow-lg font-medium">
                                Reserve a seat
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* popups */}
            <ReportPopup show={showReportPopup} onClose={closePopups} ride={selectedRide} />
            <RatingPopup show={showRatingPopup} onClose={closePopups} ride={selectedRide} reservationId={selectedReservationId} />

        </Layout>
    );
}