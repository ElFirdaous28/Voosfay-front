import React, { useState } from 'react';
import Layout from '../Layout';
import { MapPin, Users, Calendar, Star, Clock, Luggage, Route } from 'lucide-react';

export default function SearchRides() {

    const [sortBy, setSortBy] = useState('lowest');
    const [filters, setFilters] = useState({
        petFriendly: false,
        luggageSpace: false,
        femaleDriverOnly: false,
        maleDriverOnly: false
    });

    // Sample ride data
    const rides = [
        {
            id: 1,
            date: 'Friday February 28, 2025',
            departureTime: '07:30',
            arrivalTime: '18:40',
            departure: 'San Francisco',
            destination: 'San Francisco',
            availableSeats: 3,
            largeLuggage: true,
            driver: {
                name: 'John Smith',
                rating: 4.4,
                reviews: 124000
            }
        },
        {
            id: 2,
            date: 'Friday February 28, 2025',
            departureTime: '07:30',
            arrivalTime: '18:40',
            departure: 'San Francisco',
            destination: 'San Francisco',
            availableSeats: 3,
            largeLuggage: true,
            driver: {
                name: 'John Smith',
                rating: 4.4,
                reviews: 124000
            }
        },
        {
            id: 3,
            date: 'Friday February 28, 2025',
            departureTime: '07:30',
            arrivalTime: '18:40',
            departure: 'San Francisco',
            destination: 'San Francisco',
            availableSeats: 3,
            largeLuggage: true,
            driver: {
                name: 'John Smith',
                rating: 4.5,
                reviews: 124000
            }
        }
    ];

    // Handler for filter changes
    const handleFilterChange = (filter) => {
        setFilters(prev => ({
            ...prev,
            [filter]: !prev[filter]
        }));
    };

    // Handler for sort changes
    const handleSortChange = (sort) => {
        setSortBy(sort);
    };

    return (
        <Layout>
            <div className="flex flex-col md:flex-row gap-6 p-8">
                {/* search and filters */}
                <div className="w-full md:w-1/5 flex-shrink-0 bg-zinc-800 p-6 rounded-lg">
                    <div className="space-y-4 mb-8">
                        <div className="bg-slate-700 rounded-lg px-4 py-3 flex items-center">
                            <MapPin className="text-gray-400 mr-3" size={20} />
                            <input
                                type="text"
                                placeholder="Departure"
                                className="bg-transparent text-white placeholder-gray-400 w-full outline-none" />
                        </div>

                        <div className="bg-slate-700 rounded-lg px-4 py-3 flex items-center">
                            <Route className="text-gray-400 mr-3" size={20} />
                            <input
                                type="text"
                                placeholder="Destination"
                                className="bg-transparent text-white placeholder-gray-400 w-full outline-none" />
                        </div>

                        <div className="bg-slate-700 rounded-lg px-4 py-3 flex items-center">
                            <Users className="text-gray-400 mr-3" size={20} />
                            <input
                                type="text"
                                placeholder="Passengers"
                                className="bg-transparent text-white placeholder-gray-400 w-full outline-none" />
                        </div>

                        <div className="bg-slate-700 rounded-lg px-4 py-3 flex items-center">
                            <Calendar className="text-gray-400 mr-3" size={20} />
                            <input
                                type="date"
                                placeholder="Today"
                                className="bg-transparent text-white placeholder-gray-400 w-full outline-none" />
                        </div>
                    </div>

                    {/* Sort */}
                    <div className="mb-6">
                        <h3 className="text-green-500 mb-2"> {/* light-green -> green-500 */}
                            Sort By
                        </h3>
                        <div className="space-y-3">
                            {[
                                { label: "Lowest Price First", value: "lowest" },
                                { label: "Highest Price First", value: "highest" },
                                { label: "Earliest Departure", value: "earliest" },
                                { label: "Best Rated", value: "rated" },
                            ].map(option => (
                                <label key={option.value} className="flex items-center cursor-pointer">
                                    <input
                                        type="radio"
                                        name="sort"
                                        value={option.value}
                                        checked={sortBy === option.value}
                                        onChange={() => handleSortChange(option.value)}
                                        className="mr-2 accent-blue-600" />
                                    <span className={sortBy === option.value ? 'text-white' : 'text-gray-400'}>
                                        {option.label}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Requirements */}
                    <div>
                        <h3 className="text-green-500 mb-2"> {/* light-green -> green-500 */}
                            Requirements
                        </h3>
                        <div className="space-y-3">
                            {[
                                { label: "Pet-Friendly", key: "petFriendly" },
                                { label: "Luggage Space", key: "luggageSpace" },
                                { label: "Female Driver Only", key: "femaleDriverOnly" },
                                { label: "Male Driver Only", key: "maleDriverOnly" },
                            ].map(filter => (
                                <label key={filter.key} className="flex items-center cursor-pointer text-white">
                                    <input
                                        type="checkbox"
                                        checked={filters[filter.key]}
                                        onChange={() => handleFilterChange(filter.key)}
                                        className="mr-2 w-4 h-4 accent-blue-600" />
                                    {filter.label}
                                </label>
                            ))}
                        </div>
                    </div>
                </div>


                {/* ride list */}
                <div className="flex-1 space-y-5">
                    {rides.map((ride) => (
                        <div key={ride.id} className="bg-zinc-800 rounded-lg overflow-hidden p-5">
                            <div className='p-2 border-2 border-blue-600 rounded-2xl'>
                                <div className="p-3 border-b border-gray-700 text-white">
                                    {ride.date}
                                </div>
                                <div className="p-4 flex">
                                    <div className="flex-1 flex">
                                        <div className="flex flex-col items-center mr-4">
                                            <div className="text-white">{ride.departureTime}</div>
                                            <div className="bg-gray-600 w-0.5 h-6 my-1"></div>
                                            <div className="text-white">{ride.arrivalTime}</div>
                                        </div>
                                        <div className="flex flex-col justify-between">
                                            <div className="flex items-center">
                                                <MapPin size={16} className="text-gray-400 mr-1" />
                                                <span className="text-white">{ride.departure}</span>
                                            </div>
                                            <div className="flex items-center">
                                                <MapPin size={16} className="text-gray-400 mr-1" />
                                                <span className="text-white">{ride.destination}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Driver Info */}
                                    <div className="flex flex-col items-center justify-center">
                                        <div className="w-12 h-12 bg-gray-500 rounded-full mb-1"></div>
                                        <div className="text-white text-sm">{ride.driver.name}</div>
                                        <div className="flex items-center">
                                            <Star size={12} className="text-yellow-500 mr-1" fill="currentColor" />
                                            <span className="text-yellow-500 text-xs">
                                                {ride.driver.rating} ({(ride.driver.reviews / 1000).toFixed(0)}k)
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* Ride Details Footer */}
                                <div className="border-t border-gray-700 px-4 py-2 flex items-center justify-start gap-6">
                                    <div className="flex items-center text-gray-300">
                                        <Users size={16} className="mr-1" />
                                        <span className="text-xs">{ride.availableSeats} seats available</span>
                                    </div>

                                    {ride.largeLuggage && (
                                        <div className="flex items-center text-gray-300">
                                            <Luggage size={16} className="mr-1" />
                                            <span className="text-xs">Large luggage space</span>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </Layout>
    );
}