import React, { useEffect, useState } from 'react'
import Layout from '../Layout'
import { AwardIcon, Star, StarHalf } from 'lucide-react';
import ProfileTabs from '../../components/profileTabs';
import { useParams } from 'react-router-dom';
import api from '../../services/api';
import Spinner from '../../components/Spinner';

export default function ProfileRatings() {
    const { userId } = useParams();
    const [profile, setProfile] = useState(null);
    const [reviews, setReviews] = useState(null);
    const [visibleReviews, setVisibleReviews] = useState(4);
    const [expandedReviews, setExpandedReviews] = useState({});

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

    useEffect(() => {
        async function getReviews() {
            try {
                const response = await api.get(`v1/user/reviews/${userId}`)
                console.log(response.data);
                setReviews(response.data);
                setExpandedReviews({});
            } catch (error) {
                console.log("Error fetching Reviews:", error);
            }
        }
        if (userId) {
            getReviews();
        }
    }, [userId]);

    const toggleReviewExpansion = (reviewId) => {
        setExpandedReviews(prev => ({
            ...prev,
            [reviewId]: !prev[reviewId]
        }));
    };

    const loadMoreReviews = () => {
        setVisibleReviews(prev => prev + 4);
    };

    const truncateText = (text, maxLength = 150) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength).trim();
    };
    
    if (!profile) {
        return <Spinner />
    }
    
    return (
        <Layout>
            <ProfileTabs />
            {/* profile section */}
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

            <div className='bg-zinc-800 text-gray-100 rounded-lg p-8'>
                <div className="flex">
                    <div className="w-2/5 p-4 bg-gray-800 rounded-lg">
                        <div className="mb-6">
                            <div className="text-2xl font-bold text-center">{reviews?.rating_average}</div>
                            <div className="flex justify-center mb-1">
                                {[1, 2, 3, 4].map(i => (
                                    <Star key={i} size={20} fill="gold" color="gold" />
                                ))}
                                <Star size={20} color="gold" />
                            </div>
                            <div className="text-xs text-center text-gray-400">{reviews?.reviews_number} Ratings</div>
                        </div>

                        <div className="mb-6">
                            <div className="text-2xl font-bold text-center">{reviews?.rating_average_last_month}</div>
                            <div className="flex justify-center mb-1">
                                {[1, 2, 3, 4].map(i => (
                                    <Star key={i} size={20} fill="gold" color="gold" />
                                ))}
                                <Star size={20} color="gold" />
                            </div>
                            <div className="text-xs text-center text-gray-400">Last Month</div>
                        </div>

                        {/* rating description */}
                        <div>
                            {[5, 4, 3, 2, 1].map((rating) => (
                                <div key={rating} className="flex items-center mb-2">
                                    <span className="mr-2">{rating}</span>
                                    <Star size={16} fill="gold" color="gold" />
                                    <div className="mx-2 flex-1 bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{
                                                width: `${reviews?.rating_distribution[`${rating}_star`] ?? 0}%`
                                            }}></div>
                                    </div>
                                    <span className="ml-2 text-xs">
                                        {`${reviews?.rating_distribution[`${rating}_star`] ?? 0}%`}
                                    </span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="w-3/5 pl-4">
                        <div className="max-h-96 overflow-y-auto pr-2 scrollbar-hidden">
                            {reviews?.reviews.slice(0, visibleReviews).map((review) => (
                                <div key={review.id} className="bg-gray-800 p-4 rounded-lg mb-4">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center">
                                            <div className="w-8 h-8 bg-gray-300 rounded-full mr-2">
                                                <img
                                                    src={review.reviewer?.picture ? `http://127.0.0.1:8000/storage/${review.reviewer.picture}` : '/images/default-avatar.png'}
                                                    alt="User Avatar"
                                                    className="w-full h-full object-cover rounded-full" />
                                            </div>
                                            <div>
                                                <div className="font-semibold">{review.reviewer?.name || "Anonymous"}</div>
                                                <div className="text-xs text-gray-400">
                                                    {new Date(review.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex">
                                            {Array.from({ length: 5 }).map((_, i) => (
                                                <Star
                                                    key={i}
                                                    size={16}
                                                    fill={i < review.rating ? "gold" : "transparent"}
                                                    color="gold" />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-sm text-gray-300">
                                        {expandedReviews[review.id]
                                            ? review.comment
                                            : truncateText(review.comment)}

                                        {/* Show more/less toggle only if text is long enough */}
                                        {review.comment && review.comment.length > 150 && (
                                            <span
                                                className="text-green-400 ml-1 cursor-pointer"
                                                onClick={() => toggleReviewExpansion(review.id)}
                                            >
                                                {expandedReviews[review.id] ? 'less' : 'more...'}
                                            </span>
                                        )}
                                    </p>
                                </div>
                            ))}
                        </div>

                        {/* Load more button - only show if there are more reviews to load */}
                        {reviews?.reviews && visibleReviews < reviews.reviews.length && (
                            <div className="text-center mt-4">
                                <button
                                    className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg text-sm"
                                    onClick={loadMoreReviews}
                                >
                                    Load More Reviews
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Layout>
    )
}