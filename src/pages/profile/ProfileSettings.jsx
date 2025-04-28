import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import Layout from '../Layout';
import { useAuth } from '../../context/AuthContext';
import api from '../../services/api';
import useValidation from '../../hooks/useValidation';

export default function ProfileSettings() {
    const { user } = useAuth();
    const [imagePreview, setImagePreview] = useState(null);
    const [errors, setErrors] = useState({});

    const [personalInfo, setPersonalInfo] = useState({
        name: '',
        email: '',
        phone: '',
        bio: '',
        picture: null,
        gender: ''
    });

    useEffect(() => {
        if (user) {
            setPersonalInfo({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || '',
                bio: user.bio || '',
                picture: null,
                gender: user.gender || ''
            });
            setImagePreview(user.picture ? `http://127.0.0.1:8000/storage/${user.picture}` : null);
        }
        getVehilcle();
    }, [user]);


    const [vehicleInfo, setVehicleInfo] = useState({
        vehicle_info: '',
        vehicle_color: '',
        vehicle_plate: '',
    });
    const getVehilcle = async () => {
        try {
            const response = await api.get('v1/vehicle');
            const vehicle = response.data.vehicle;
            setVehicleInfo({
                vehicle_info: vehicle.vehicle_info || '',
                vehicle_color: vehicle.vehicle_color || '',
                vehicle_plate: vehicle.vehicle_plate || '',
            });

        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            }
            else {
                console.log('Error getting vehicle', error);
            }
        }
    }

    // password
    const [passwordInfo, setPasswordInfo] = useState({
        old_password: '',
        new_password: '',
        new_password_confirmation: ''
    });


    const onDrop = (acceptedFiles) => {
        const file = acceptedFiles[0];
        if (file) {
            setPersonalInfo((prev) => ({ ...prev, picture: file }));
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: {
            'image/*': []
        },
        multiple: false
    });


    const handlePersonalInfoChange = (e) => {
        const { name, value } = e.target;
        setPersonalInfo({ ...personalInfo, [name]: value });
    };

    const handleVehicleInfoChange = (e) => {
        const { name, value } = e.target;
        setVehicleInfo({ ...vehicleInfo, [name]: value });
    };

    const handlePasswordChange = (e) => {
        const { name, value } = e.target;
        setPasswordInfo({ ...passwordInfo, [name]: value });
    };

    // update personale infos
    const handlePersonalInfoSubmit = async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', personalInfo.name);
        formData.append('email', personalInfo.email);
        formData.append('phone', personalInfo.phone);
        formData.append('bio', personalInfo.bio);
        formData.append('gender', personalInfo.gender);

        if (personalInfo.picture instanceof File) {
            formData.append('picture', personalInfo.picture);
        }

        try {
            const response = await api.post('v1/profile', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'X-HTTP-Method-Override': 'PUT'
                },
            });
            console.log('Profile updated:', response.data);
        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            }
            else {
                console.error('Error updating profile:', error);
            }
        }
    };


    const handleVehicleInfoSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('v1/vehicle', vehicleInfo, {
                headers: {
                    'X-HTTP-Method-Override': 'PUT'
                },
            });
            console.log('Vehicle Updated', response.data);

        } catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            }
            else {
                console.log('Error updating vhecle', error);
            }
        }
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await api.post('v1/profile', passwordInfo, {
                headers: {
                    'X-HTTP-Method-Override': 'PATCH'
                },
            })
            console.log(response.data);
        }
        catch (error) {
            if (error.response?.status === 422) {
                setErrors(error.response.data.errors);
            }
            else {
                console.log('Error cahgning password', error);
            }
        }
    };


    return (
        <Layout>
            {/* Personal Information Section */}
            <h2 className="text-sm font-medium text-gray-400 mb-2">Personal information</h2>
            <form onSubmit={handlePersonalInfoSubmit} className="bg-zinc-800 rounded-lg p-6 mb-6">
                <div className="flex flex-wrap">
                    <div className="w-full md:w-1/4 flex flex-col items-center justify-center mb-4 md:mb-0">
                        <div {...getRootProps()} className="w-40 h-40 bg-gray-600 rounded-full overflow-hidden mb-2 flex items-center justify-center cursor-pointer">
                            <input {...getInputProps()} />
                            {imagePreview || personalInfo.picture ? (
                                <img
                                    src={imagePreview || personalInfo.picture}
                                    alt="Profile Preview"
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className="text-gray-400 text-center text-xs px-2">
                                    {isDragActive ? "Drop the image here..." : "Click or drag an image"}
                                </div>
                            )}
                        </div>

                    </div>

                    <div className="w-full md:w-3/4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={personalInfo.name}
                                    onChange={handlePersonalInfoChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white" />
                                <div>{useValidation(errors, "name")}</div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Gender</label>

                                <div className="flex items-center gap-4 text-gray-400">
                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Male"
                                            checked={personalInfo.gender === 'Male'}
                                            onChange={handlePersonalInfoChange}
                                            className="mr-2" />
                                        Male
                                    </label>

                                    <label className="flex items-center">
                                        <input
                                            type="radio"
                                            name="gender"
                                            value="Female"
                                            checked={personalInfo.gender === 'Female'}
                                            onChange={handlePersonalInfoChange}
                                            className="mr-2" />
                                        Female
                                    </label>
                                </div>
                                <div>{useValidation(errors, "gender")}</div>
                            </div>


                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={personalInfo.email}
                                    onChange={handlePersonalInfoChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white" />
                                <div>{useValidation(errors, "email")}</div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Phone</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={personalInfo.phone}
                                    onChange={handlePersonalInfoChange}
                                    className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white" />
                                <div>{useValidation(errors, "phone")}</div>
                            </div>

                            <div className="md:col-span-2">
                                <label className="block text-sm font-medium text-gray-400 mb-1">About me</label>
                                <textarea
                                    name="bio"
                                    value={personalInfo.bio}
                                    onChange={handlePersonalInfoChange}
                                    rows="3"
                                    className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white"></textarea>
                                <div>{useValidation(errors, "bio")}</div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white font-medium py-1 px-4 rounded">
                        Save
                    </button>
                </div>
            </form>

            {/* Vehicle Information Section */}
            <h2 className="text-sm font-medium text-gray-400 mb-2">My vehicle information</h2>
            <form onSubmit={handleVehicleInfoSubmit} className="bg-zinc-800 rounded-lg p-6 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Vehicle Model</label>
                        <input
                            type="text"
                            name="vehicle_info"
                            value={vehicleInfo.vehicle_info}
                            onChange={handleVehicleInfoChange}
                            placeholder="Insight 2.0"
                            className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white" />
                        <div>{useValidation(errors, "vehicle_info")}</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Color</label>
                        <input
                            type="text"
                            name="vehicle_color"
                            value={vehicleInfo.vehicle_color}
                            onChange={handleVehicleInfoChange}
                            placeholder="Space Gray"
                            className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white" />
                        <div>{useValidation(errors, "vehicle_color")}</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">License Plate</label>
                        <input
                            type="text"
                            name="vehicle_plate"
                            value={vehicleInfo.vehicle_plate}
                            onChange={handleVehicleInfoChange}
                            placeholder="AB-123-CD"
                            className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white" />
                        <div>{useValidation(errors, "vehicle_plate")}</div>

                    </div>
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white font-medium py-1 px-4 rounded">
                        Save
                    </button>
                </div>
            </form>

            {/* Change Password Section */}
            <h2 className="text-sm font-medium text-gray-400 mb-2">Change my password</h2>
            <form onSubmit={handlePasswordSubmit} className="bg-zinc-800 rounded-lg p-6">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Current Password</label>
                        <input
                            type="password"
                            name="old_password"
                            value={passwordInfo.old_password}
                            onChange={handlePasswordChange}
                            placeholder="••••••••••"
                            className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white" />
                        <div>{useValidation(errors, "old_password")}</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">New Password</label>
                        <input
                            type="password"
                            name="new_password"
                            value={passwordInfo.new_password}
                            onChange={handlePasswordChange}
                            placeholder="••••••••••"
                            className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white" />
                        <div>{useValidation(errors, "new_password")}</div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1">Confirm new password</label>
                        <input
                            type="password"
                            name="new_password_confirmation"
                            value={passwordInfo.new_password_confirmation}
                            onChange={handlePasswordChange}
                            placeholder="••••••••••"
                            className="w-full bg-gray-700 border border-gray-600 rounded py-2 px-3 text-white" />
                        <div>{useValidation(errors, "new_password_confirmation")}</div>

                    </div>
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        type="submit"
                        className="bg-green-500 hover:bg-green-600 text-white font-medium py-1 px-4 rounded">
                        Save
                    </button>
                </div>
            </form>
        </Layout>
    );
}