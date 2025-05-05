import React, { useEffect, useState } from 'react'
import Layout from '../Layout';
import RideList from '../../components/RideList';
import api from '../../Services/api';

export default function JoinedRides() {
    const [rides, setRides] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [offset, setOffset] = useState(0);
    const [hasMoreRides, setHasMoreRides] = useState(true);

    const fetchRides = async () => {
        if (isLoading || !hasMoreRides) return;

        try {
            setIsLoading(true);
            const currentOffset = offset;

            const response = await api.get('v1/user/rides/joined', {
                params: {
                    offset: currentOffset
                }
            });
            console.log(response.data.rides);
            
            const newRides = response.data.rides || [];

            setRides((prev) => {
                const allRides = [...prev, ...newRides];
                return Array.from(new Set(allRides.map((ride) => ride.id)))
                    .map((id) => allRides.find((ride) => ride.id === id));
            });

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

    useEffect(() => {
        fetchRides();
    }, []);

    return (
        <Layout title={"Joined Rides"}>
            {/* ride list */}
            <RideList
                rides={rides}
                fetchRides={fetchRides}
                hasMoreRides={hasMoreRides}
                isLoading={isLoading}
            />
        </Layout>
    );
}
