import React, { useEffect, useState } from 'react'
import api from '../services/api';

export default function ProfileSection(userId) {
    const [profile, setProfile] = useState(null);

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await api.get(`v1/profile/${userId}`);
                setProfile(response.data.data);
            } catch (error) {
                console.error("Error fetching profile:", error);
            }
        }

        if (userId) {
            fetchProfile();
        }
    }, [userId]);

    return (
        <div className="bg-zinc-800 text-gray-100 p-8 rounded-lg mb-4">
            <div className="flex items-center gap-4">
                <div className="mr-4">
                    <div className="w-16 h-16 bg-gray-300 rounded-full overflow-hidden">
                        <img
                            src={profile?.user.picture ? `http://127.0.0.1:8000/storage/${profile.user.picture}` : "/images/default-avatar.png"}
                            alt="User Avatar"
                            className="w-full h-full object-cover rounded-full" />
                    </div>
                </div>
                <div className="flex flex-col">
                    <div className="flex-1">
                        <h2 className="text-lg font-bold">{profile?.user.name}</h2>
                        <p className="text-sm text-gray-300">{profile?.user.bio}</p>
                    </div>

                    <div className="flex mt-1 text-xs text-gray-500 gap-4">
                        <p>{profile?.user.email}</p>
                        <p>{profile?.user.phone}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <div className="flex flex-col items-center mx-2">
                        <div className="flex items-center justify-center">
                            <span className="font-bold mr-1">{profile?.rating_average}</span>
                            <Star size={14} fill="gold" color="gold" />
                        </div>
                        <span className="text-xs text-gray-300">Average Rating</span>
                    </div>
                    <div className="flex flex-col items-center mx-2">
                        <span className="font-bold">{profile?.offerd_rides_number}</span>
                        <span className="text-xs text-gray-300">Offered</span>
                    </div>
                    <div className="flex flex-col items-center mx-2">
                        <span className="font-bold">{profile?.join_rides_number}</span>
                        <span className="text-xs text-gray-300">Joined</span>
                    </div>
                </div>
            </div>
        </div>
    )
}
