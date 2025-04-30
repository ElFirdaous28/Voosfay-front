import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '../Layout';
import { Plus, User, Mail, Lock } from 'lucide-react';
import api from '../../Services/api';
import { toast } from 'react-toastify';
import useValidation from '../../hooks/useValidation';

export default function AddAdmin() {
    const navigate = useNavigate();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [errors, setErrors] = useState({});
    const [formData, setFormData] = useState({
        name: '',
        email: '',
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setErrors({});

        try {
            await api.post('v1/admin/users/add', formData);
            toast.success('Admin successfully added!');
            navigate('/admin/users');
        } catch (error) {
            toast.error('Failed to add admin. Please try again.');
            setErrors(error.response?.data?.errors || { general: ['An error occurred.'] });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Layout>
            <div className="max-w-2xl min-h-[80vh] mx-auto p-4 flex items-center">
                <div className="w-full bg-gradient-to-b from-zinc-800 to-zinc-900 rounded-xl shadow-xl overflow-hidden">
                    <div className="bg-green-700 p-6">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <Plus size={24} className="mr-2" />
                            Add New Admin
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit} className="p-6">
                        <div className="mb-6">
                            <label className="text-gray-300 mb-2 flex items-center">
                                <User size={16} className="mr-2 text-cyan-400" />
                                Name
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                className="w-full p-3 bg-zinc-700 rounded-lg text-white border border-zinc-600 focus:border-cyan-500 focus:outline-none"
                                placeholder="Full name" />
                            <div>{useValidation(errors, 'name')}</div>
                        </div>

                        <div className="mb-6">
                            <label className="text-gray-300 mb-2 flex items-center">
                                <Mail size={16} className="mr-2 text-cyan-400" />
                                Email
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="w-full p-3 bg-zinc-700 rounded-lg text-white border border-zinc-600 focus:border-cyan-500 focus:outline-none"
                                placeholder="admin@example.com" />
                            <div>{useValidation(errors, 'email')}</div>
                        </div>

                        <div className="flex justify-end">
                            <button
                                type="button"
                                onClick={() => navigate(-1)}
                                className="mr-4 px-6 py-3 text-gray-300 hover:text-white transition-colors"
                                disabled={isSubmitting}>
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="min-w-36 bg-gradient-to-r from-cyan-600 to-cyan-500 text-white px-3 py-3 rounded-lg hover:from-cyan-500 hover:to-cyan-400 transition-all shadow-lg font-medium flex items-center"
                                disabled={isSubmitting}>
                                {isSubmitting ? (
                                    <>
                                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                        Saving...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={18} className="mr-2" />
                                        Add Admin
                                    </>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </Layout>
    );
}