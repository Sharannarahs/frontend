import React, { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import assets from '../assets/assets';
import { AuthContext } from '../../context/AuthContext';

const ProfilePage = () => {
    const { authUser, updateProfile } = useContext(AuthContext);
    console.log(authUser);

    const [selectedImg, setSelectedImg] = useState(null);
    const navigate = useNavigate();
    const [name, setName] = useState(authUser.fullName);
    const [bio, setBio] = useState(authUser.bio);

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Case 1: Only updating name & bio
        if (!selectedImg) {
            try {

                let a=await updateProfile({ fullName: name, bio});
                console.log(name,bio,a);
                navigate('/');
            } catch (err) {
                console.error("Profile update failed:", err);
                alert("Failed to update profile.");
            }
            return;
        }

        const reader = new FileReader();
        reader.readAsDataURL(selectedImg)

        reader.onload = async () => {
            const base64Image = reader.result;

            if (!base64Image.startsWith("data:image/")) {
                alert("Invalid image format. Please upload a valid image.");
                return;
            }

            try {
                await updateProfile({ profilePic: base64Image, fullName: name, bio });
                navigate('/');
            } catch (err) {
                console.error("Profile update failed:", err);
                alert("Something went wrong while updating profile.");
            }
        };

        reader.onerror = (err) => {
            console.error("File reading error:", err);
            alert("Failed to read the image file.");
        };

        reader.readAsDataURL(selectedImg);
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];

        if (!file) return;

        const validTypes = ["image/jpeg", "image/png", "image/jpg"];
        if (!validTypes.includes(file.type)) {
            alert("Unsupported file type. Please upload a .png, .jpg, or .jpeg image.");
            return;
        }

        if (file.size > 4 * 1024 * 1024) {
            alert("Image size should not exceed 4MB.");
            return;
        }

        setSelectedImg(file);
    };

    return (
        <div className='min-h-screen bg-cover bg-no-repeat flex items-center justify-center'>
            <div className='w-5/6 max-w-2xl backdrop-blur-2xl text-gray-300 border-2 border-gray-600 flex items-center justify-between max-sm:flex-col-reverse rounded-lg'>
                <form onSubmit={handleSubmit} className='flex flex-col gap-5 p-10 flex-1'>
                    <h3 className='text-lg'>Profile Details</h3>

                    <label htmlFor='avatar' className='flex items-center gap-3 cursor-pointer'>
                        <input 
                            onChange={handleImageChange}
                            type="file" 
                            id="avatar" 
                            accept='.png, .jpg, .jpeg' 
                            hidden 
                        />
                        <img 
                            src={selectedImg ? URL.createObjectURL(selectedImg) : assets.avatar_icon} 
                            alt="Profile Preview" 
                            className={`w-12 h-12 ${selectedImg && 'rounded-full'}`} 
                        />
                        Upload profile image
                    </label>

                    <input 
                        onChange={(e) => setName(e.target.value)} 
                        value={name}
                        type="text" 
                        required 
                        placeholder='Your Name' 
                        className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' 
                    />


                    <textarea 
                        onChange={(e) => setBio(e.target.value)} 
                        value={bio}
                        placeholder='Write profile bio' 
                        required 
                        className='p-2 border border-gray-500 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-500' 
                        rows={4}
                    ></textarea>

                    <button 
                        type='submit' 
                        className='bg-gradient-to-r from-purple-400 to-violet-600 text-white p-2 rounded-full text-lg cursor-pointer'
                    >
                        Save
                    </button>
                </form>

                <img 
                    className={`max-w-44 aspect-square rounded-full mx-10 max-sm:mt-10 ${selectedImg && 'rounded-full'}`} 
                    src={authUser?.profilePic || assets.logo1} 
                    alt="User Preview" 
                />
            </div>
        </div>
    );
};

export default ProfilePage;
