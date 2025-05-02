import React, { useState, useEffect } from 'react';
import Layout from '../Layout';
import { MapPin, Users, Calendar, Star, Luggage, Route } from 'lucide-react';
import api from '../../Services/api';
import RideList from '../../components/RideList';

export default function SearchRides() {
    const [rides, setRides] = useState([]);
    const [offset, setOffset] = useState(0);
    const [hasMoreRides, setHasMoreRides] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [sortBy, setSortBy] = useState('price_asc');

    const [filters, setFilters] = useState({
        female: false,
        male: false,
        pet_allowed: false,
        luggage_allowed: false,
        conversation_allowed: false,
        music_allowed: false,
        food_allowed: false,
    });

    const [searchData, setSearchData] = useState({
        start_location: '',
        ending_location: '',
        available_seats: '',
        start_time: ''
    });

    const fetchRides = async (reset = false) => {
        if (isLoading) return;

        try {
            setIsLoading(true);
            const currentOffset = reset ? 0 : offset;

            if (reset) {
                setRides([]);
                setOffset(0);
                setHasMoreRides(true);
            }
            const params = {
                ...searchData,
                sort: sortBy,
                ...Object.keys(filters)
                    .filter(key => filters[key])
                    .reduce((acc, key) => ({ ...acc, [key]: 1 }), {}),
                offset: currentOffset
            };

            const response = await api.get('v1/search/rides', { params });
            const newRides = response.data.rides || [];
            console.log( response.data.rides);
            

            setRides(prevRides => reset ? newRides : [...prevRides, ...newRides]);
            setOffset(currentOffset + newRides.length);
            if (newRides.length < 3) {
                setHasMoreRides(false);
            }
        } catch (error) {
            console.error('Error getting rides', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleFilterChange = (filter) => {
        setFilters(prev => ({
            ...prev,
            [filter]: !prev[filter]
        }));
    };

    const handleSortChange = (sort) => {
        setSortBy(sort);
    };

    const handleSearchChange = (e) => {
        const { name, value } = e.target;
        setSearchData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        fetchRides(true);
    };

    return (
        <Layout>
            <div className="flex flex-col lg:flex-row gap-4 md:gap-6 p-4 md:p-8">
                {/* search and filter */}
                <div className="w-full lg:w-1/4 flex-shrink-0">
                    <div className="bg-zinc-800 rounded-lg p-4 md:p-6 sticky top-4">
                        <form onSubmit={handleSubmit} className="space-y-4 mb-6">
                            <div className="bg-slate-700 rounded-lg px-3 py-2 flex items-center">
                                <MapPin className="text-gray-400 mr-2" size={18} />
                                <input
                                    name="start_location"
                                    type="text"
                                    placeholder="Departure"
                                    className="bg-transparent text-white placeholder-gray-400 w-full outline-none text-sm"
                                    value={searchData.start_location}
                                    onChange={handleSearchChange} />
                            </div>

                            <div className="bg-slate-700 rounded-lg px-3 py-2 flex items-center">
                                <Route className="text-gray-400 mr-2" size={18} />
                                <input
                                    name="ending_location"
                                    type="text"
                                    placeholder="Destination"
                                    className="bg-transparent text-white placeholder-gray-400 w-full outline-none text-sm"
                                    value={searchData.ending_location}
                                    onChange={handleSearchChange} />
                            </div>

                            <div className="bg-slate-700 rounded-lg px-3 py-2 flex items-center">
                                <Users className="text-gray-400 mr-2" size={18} />
                                <input
                                    name="available_seats"
                                    type="number"
                                    min="1"
                                    placeholder="Passengers"
                                    className="bg-transparent text-white placeholder-gray-400 w-full outline-none text-sm"
                                    value={searchData.available_seats}
                                    onChange={handleSearchChange} />
                            </div>

                            <div className="bg-slate-700 rounded-lg px-3 py-2 flex items-center">
                                <Calendar className="text-gray-400 mr-2" size={18} />
                                <input
                                    name="start_time"
                                    type="date"
                                    className="bg-transparent text-white placeholder-gray-400 w-full outline-none text-sm"
                                    value={searchData.start_time}
                                    onChange={handleSearchChange} />
                            </div>

                            <button
                                type="submit"
                                className="w-full py-2 px-4 rounded text-white font-medium text-sm bg-blue-600">
                                Search Rides
                            </button>
                        </form>

                        {/* sort */}
                        <div className="mb-6">
                            <h3 className="text-sm font-medium mb-2 text-green-500">Sort By</h3>
                            <div className="space-y-2">
                                {[
                                    { label: "Lowest Price First", value: "price_asc" },
                                    { label: "Highest Price First", value: "price_desc" },
                                    { label: "Earliest Departure", value: "start_time" },
                                    { label: "Best Rated", value: "avg_rating" },
                                ].map(option => (
                                    <label key={option.value} className="flex items-center cursor-pointer">
                                        <input
                                            type="radio"
                                            name="sort"
                                            value={option.value}
                                            checked={sortBy === option.value}
                                            onChange={() => handleSortChange(option.value)}
                                            className="mr-2 accent-cyan-400" />
                                        <span className={sortBy === option.value ? 'text-white' : 'text-gray-400'}>
                                            {option.label}
                                        </span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* filters */}
                        <div>
                            <h3 className="text-sm font-medium mb-2 text-green-500">Requirements</h3>
                            <div className="space-y-2">
                                {[
                                    { label: "Female Driver Only", key: "female" },
                                    { label: "Male Driver Only", key: "male" },
                                    { label: "Pet-Friendly", key: "pet_allowed" },
                                    { label: "Luggage Space", key: "luggage_allowed" },
                                    { label: "Conversation Allowed", key: "conversation_allowed" },
                                    { label: "Music Allowed", key: "music_allowed" },
                                    { label: "Food Allowed", key: "food_allowed" },
                                ].map(filter => (
                                    <label key={filter.key} className="flex items-center cursor-pointer text-white">
                                        <input
                                            type="checkbox"
                                            checked={filters[filter.key]}
                                            onChange={() => handleFilterChange(filter.key)}
                                            className="mr-2 w-4 h-4 accent-cyan-400" />
                                        {filter.label}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* ride list */}
                <RideList
                    rides={rides}
                    fetchRides={fetchRides}
                    hasMoreRides={hasMoreRides}
                    isLoading={isLoading}
                />
            </div>
        </Layout>
    );
}