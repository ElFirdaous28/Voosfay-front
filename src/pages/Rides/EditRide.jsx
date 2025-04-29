import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../Layout';
import { MapPin, Users, Calendar, Clock, Luggage, Music2, MessageSquare, Utensils, PawPrint, Save, X, AlertCircle, Loader, Edit } from 'lucide-react';
import api from '../../services/api';
import { toast } from 'react-toastify';
import useValidation from '../../hooks/useValidation';


export default function EditRide() {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState('');
    const [formData, setFormData] = useState({
        start_location: '',
        ending_location: '',
        start_date: '',
        start_time: '',
        ending_time: '',
        available_seats: 1,
        price: '',
        luggage_allowed: false,
        pet_allowed: false,
        music_allowed: false,
        conversation_allowed: false,
        food_allowed: false
    });

    useEffect(() => {
        const fetchRide = async () => {
            try {
                const response = await api.get(`/v1/rides/${id}`);
                setFormData(response.data.ride)
            } catch (err) {
                console.error('Error fetching ride details', err);
                setErrors('Failed to load ride details. Please try again.');
            } finally {
                setIsLoading(false);
            }
        };

        fetchRide();
    }, [id]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors('');

        try {
            await api.put(`/v1/rides/${id}`, formData);
            toast.success("Ride successfully updated!");
        } catch (error) {
            // console.error('Error updating ride', error);
            toast.error("Failed to update ride. Please try again.");
            setErrors(error.response?.data?.errors || { general: ["An error occurred."] });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) {
        return (
            <Layout>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-pulse flex flex-col items-center">
                        <div className="w-16 h-16 border-4 border-cyan-600 border-t-transparent rounded-full animate-spin"></div>
                        <p className="mt-4 text-gray-400">Loading ride details...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="max-w-4xl mx-auto p-4">
                <div className="bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl shadow-xl overflow-hidden">
                    {/* Header */}
                    <div className="bg-green-700 p-6">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <Edit size={24} className="mr-2" />
                            Edit Ride
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Route Details</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <div>
                                    <label className="text-gray-300 mb-2 flex items-center">
                                        <MapPin size={16} className="mr-2 text-cyan-400" />
                                        Starting Location
                                    </label>
                                    <input
                                        type="text"
                                        name="start_location"
                                        value={formData.start_location}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-zinc-700 rounded-lg text-white border border-zinc-600 focus:border-cyan-500 focus:outline-none"
                                        placeholder="City, address or landmark"
                                        required />
                                    <div>{useValidation(errors, "start_location")}</div>
                                </div>
                                <div>
                                    <label className="text-gray-300 mb-2 flex items-center">
                                        <MapPin size={16} className="mr-2 text-cyan-400" />
                                        Destination
                                    </label>
                                    <input
                                        type="text"
                                        name="ending_location"
                                        value={formData.ending_location}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-zinc-700 rounded-lg text-white border border-zinc-600 focus:border-cyan-500 focus:outline-none"
                                        placeholder="City, address or landmark"
                                        required />
                                    <div>{useValidation(errors, "ending_location")}</div>
                                </div>
                            </div>
                        </div>
                        {/* date and time */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Schedule</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-4">
                                <div>
                                    <label className="text-gray-300 mb-2 flex items-center">
                                        <Clock size={16} className="mr-2 text-cyan-400" />
                                        Departure Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="start_time"
                                        value={formData.start_time}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-zinc-700 rounded-lg text-white border border-zinc-600 focus:border-cyan-500 focus:outline-none" />
                                    <div>{useValidation(errors, "start_time")}</div>
                                </div>
                                <div>
                                    <label className="text-gray-300 mb-2 flex items-center">
                                        <Clock size={16} className="mr-2 text-cyan-400" />
                                        Arrival Time
                                    </label>
                                    <input
                                        type="datetime-local"
                                        name="ending_time"
                                        value={formData.ending_time}
                                        onChange={handleChange}
                                        className="w-full p-3 bg-zinc-700 rounded-lg text-white border border-zinc-600 focus:border-cyan-500 focus:outline-none"
                                        required />
                                    <div>{useValidation(errors, "ending_time")}</div>
                                </div>
                            </div>
                        </div>

                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Capacity</h3>

                            <div className="mb-4">
                                <label className="text-gray-300 mb-2 flex items-center">
                                    <Users size={16} className="mr-2 text-cyan-400" />
                                    Available Seats
                                </label>
                                <input
                                    type="number"
                                    name="available_seats"
                                    value={formData.available_seats}
                                    onChange={handleChange}
                                    min="1"
                                    max="10"
                                    className="w-full p-3 bg-zinc-700 rounded-lg text-white border border-zinc-600 focus:border-cyan-500 focus:outline-none"
                                    required />
                                <div>{useValidation(errors, "available_seats")}</div>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label className="text-gray-300 mb-2 flex items-center">
                                <span className="mr-2 text-cyan-400">€</span>
                                Price
                            </label>
                            <input
                                type="number"
                                name="price"
                                value={formData.price}
                                onChange={handleChange}
                                min="0"
                                step="0.01"
                                className="w-full p-3 bg-zinc-700 rounded-lg text-white border border-zinc-600 focus:border-cyan-500 focus:outline-none"
                                required />
                            <div>{useValidation(errors, "price")}</div>
                        </div>

                        {/* Preferences */}
                        <div className="mb-8">
                            <h3 className="text-lg font-semibold text-white mb-4 border-b border-gray-700 pb-2">Ride Preferences</h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                <div className="flex items-center p-3 rounded-lg bg-zinc-700/30 hover:bg-zinc-700/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        id="luggage_allowed"
                                        name="luggage_allowed"
                                        checked={formData.luggage_allowed}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-gray-600 text-cyan-600 focus:ring-cyan-500" />
                                    <label htmlFor="luggage_allowed" className="ml-3 flex items-center cursor-pointer">
                                        <Luggage size={18} className="mr-2 text-gray-300" />
                                        <span className="text-gray-200">Luggage allowed</span>
                                    </label>
                                </div>

                                <div className="flex items-center p-3 rounded-lg bg-zinc-700/30 hover:bg-zinc-700/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        id="pet_allowed"
                                        name="pet_allowed"
                                        checked={formData.pet_allowed}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-gray-600 text-cyan-600 focus:ring-cyan-500" />
                                    <label htmlFor="pet_allowed" className="ml-3 flex items-center cursor-pointer">
                                        <PawPrint size={18} className="mr-2 text-gray-300" />
                                        <span className="text-gray-200">Pets allowed</span>
                                    </label>
                                </div>

                                <div className="flex items-center p-3 rounded-lg bg-zinc-700/30 hover:bg-zinc-700/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        id="music_allowed"
                                        name="music_allowed"
                                        checked={formData.music_allowed}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-gray-600 text-cyan-600 focus:ring-cyan-500" />
                                    <label htmlFor="music_allowed" className="ml-3 flex items-center cursor-pointer">
                                        <Music2 size={18} className="mr-2 text-gray-300" />
                                        <span className="text-gray-200">Music allowed</span>
                                    </label>
                                </div>

                                <div className="flex items-center p-3 rounded-lg bg-zinc-700/30 hover:bg-zinc-700/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        id="conversation_allowed"
                                        name="conversation_allowed"
                                        checked={formData.conversation_allowed}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-gray-600 text-cyan-600 focus:ring-cyan-500" />
                                    <label htmlFor="conversation_allowed" className="ml-3 flex items-center cursor-pointer">
                                        <MessageSquare size={18} className="mr-2 text-gray-300" />
                                        <span className="text-gray-200">Conversation allowed</span>
                                    </label>
                                </div>

                                <div className="flex items-center p-3 rounded-lg bg-zinc-700/30 hover:bg-zinc-700/50 transition-colors">
                                    <input
                                        type="checkbox"
                                        id="food_allowed"
                                        name="food_allowed"
                                        checked={formData.food_allowed}
                                        onChange={handleChange}
                                        className="w-5 h-5 rounded border-gray-600 text-cyan-600 focus:ring-cyan-500" />
                                    <label htmlFor="food_allowed" className="ml-3 flex items-center cursor-pointer">
                                        <Utensils size={18} className="mr-2 text-gray-300" />
                                        <span className="text-gray-200">Food allowed</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        {/* Submit */}
                        <div className="flex justify-between">
                            <Link
                                to={`/rides/${id}`}
                                className="px-6 py-3 bg-zinc-700 text-gray-300 rounded-lg hover:bg-zinc-600 hover:text-white transition-colors"
                                disabled={isSubmitting}
                            >
                                Cancel
                            </Link>

                            <div className="flex">
                                <button
                                    type="submit"
                                    className="min-w-36 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white px-3 py-3 rounded-lg hover:from-cyan-500 hover:to-cyan-400 transition-all shadow-lg font-medium flex items-center"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                            Updating...
                                        </>
                                    ) : (
                                        <>
                                            <Save size={18} className="mr-2" />
                                            Save Changes
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}