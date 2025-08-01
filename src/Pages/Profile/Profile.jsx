
import React, { useState } from 'react';
import { FaEyeSlash, FaEye, FaPen, FaShare, FaCopy } from 'react-icons/fa';
import Base_url from '../../Base_url/Baseurl';
import toast, { Toaster } from "react-hot-toast";
import axios from "axios";

const ProfileUpdate = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showReenterPassword, setShowReenterPassword] = useState(false);
  const [profileImage, setProfileImage] = useState('https://randomuser.me/api/portraits/men/1.jpg');

  const [formData, setFormData] = useState({
    firstName: 'Wade',
    lastName: 'Warren',
    password: '12345678',
    phoneNumber: '3030303030',
    email: 'wade.warren@example.com',
    dateOfBirth: '1999-01-28',
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    reenterPassword: ''
  });

  const handleUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        setProfileImage(event.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = () => {
    setProfileImage('https://randomuser.me/api/portraits/men/1.jpg');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    console.log('Saved data:', formData);
    setIsEditing(false);
  };

  const handlePasswordSave = () => {
    console.log('Password change data:', passwordData);
    setPasswordData({ currentPassword: '', newPassword: '', reenterPassword: '' });
  };

  const copyEmail = () => {
    navigator.clipboard.writeText(formData.email);
  };
const token=localStorage.getItem("token")
  const handleSubmit = async () => {

    try {
      const response = await axios.post(
        `${Base_url}/api/admin/change-password/`,
        
        { 
          current_password:passwordData.currentPassword,
          new_password:passwordData.newPassword,
          reenter_new_password:passwordData.reenterPassword
        },
        {
          headers: {
            Authorization: `Token ${token}`,
          },
        }
      );

      if (response.status === 200) {
        const data = response.data;

        // Save token and remember flag
       

        toast.success("Password Changed successfully");

      
      }
      else{
        toast.error("Password did not Changed");
      }
    } catch (error) {
      toast.error("Please Try Again" );
    } 
  };

  return (
    <div className="max-w-7xl mx-auto p-6 flex gap-6">
      {/* Left Sidebar */}
      <div className="w-96 space-y-6">
        {/* Profile Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-start mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Profile</h2>
            {/* <button className="text-gray-400 hover:text-gray-600">
              <FaShare />
            </button> */}
          </div>
          
          <div className="text-center">
            <img
              src={profileImage}
              alt="profile"
              className="w-20 h-20 rounded-full object-cover mx-auto mb-4"
            />
            <h3 className="text-lg font-semibold text-gray-800 mb-1">
              {formData.firstName} {formData.lastName}
            </h3>
            <div className="flex items-center justify-center gap-2 text-gray-600">
              <span className="text-sm">{formData.email}</span>
              {/* <button onClick={copyEmail} className="text-gray-400 hover:text-gray-600">
                <FaCopy className="w-3 h-3" />
              </button> */}
            </div>
          </div>
        </div>

        {/* Change Password Card */}
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">Change Password</h2>
            {/* <button className="text-blue-600 text-sm hover:underline">
              Need help ?
            </button> */}
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm text-gray-600 mb-1">Current Password</label>
              <div className="relative">
                <input
                  type={showCurrentPassword ? 'text' : 'password'}
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter password"
                  className="w-full border border-gray-200 p-3 pr-10 rounded-md bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                  className="absolute right-3 top-3.5 text-gray-400"
                >
                  {showCurrentPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
              {/* <button className="text-blue-600 text-sm mt-1 hover:underline">
                Forgot Current Password? Click here
              </button> */}
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">New Password</label>
              <div className="relative">
                <input
                  type={showNewPassword ? 'text' : 'password'}
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter password"
                  className="w-full border border-gray-200 p-3 pr-10 rounded-md bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-3 top-3.5 text-gray-400"
                >
                  {showNewPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-600 mb-1">Re-enter Password</label>
              <div className="relative">
                <input
                  type={showReenterPassword ? 'text' : 'password'}
                  name="reenterPassword"
                  value={passwordData.reenterPassword}
                  onChange={handlePasswordChange}
                  placeholder="Enter password"
                  className="w-full border border-gray-200 p-3 pr-10 rounded-md bg-gray-50"
                />
                <button
                  type="button"
                  onClick={() => setShowReenterPassword(!showReenterPassword)}
                  className="absolute right-3 top-3.5 text-gray-400"
                >
                  {showReenterPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>

            <button
              onClick={handleSubmit}
              className="w-full bg-[#3651BF] text-white py-3 rounded-lg font-medium hover:bg-blue-700"
            >
              Save Change
            </button>
          </div>
        </div>
      </div>

      {/* Right Content - Profile Update */}
      <div className="flex-1 bg-white rounded-xl shadow-md p-6">
        <div className="flex justify-between items-start mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Profile Update</h2>
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="border p-2 rounded-md text-gray-500 hover:text-gray-700"
          >
            <FaPen />
          </button>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <img
            src={profileImage}
            alt="profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex gap-2">
            <button
              className="bg-[#3651BF] text-white font-medium px-4 py-2 rounded-lg"
              onClick={() => document.getElementById('fileInput').click()}
            >
              Upload New
            </button>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
            />
            <button
              className="border border-gray-300 px-4 py-2 rounded-lg font-medium"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>

        <form className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm text-gray-600 mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              readOnly={!isEditing}
              className="w-full border border-gray-200 p-3 rounded-md font-semibold text-gray-700 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              readOnly={!isEditing}
              className="w-full border border-gray-200 p-3 rounded-md font-semibold text-gray-700 bg-gray-100"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-1">Password</label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                readOnly={!isEditing}
                className="w-full border border-gray-200 p-3 pr-10 rounded-md bg-gray-100"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3.5 text-gray-400"
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          {/* <div>
            <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
            <div className="relative">
              <input
                type="text"
                name="phoneNumber"
                value={formData.phoneNumber}
                onChange={handleChange}
                readOnly={!isEditing}
                maxLength={11}
                className="w-full border border-gray-200 p-3 rounded-md font-semibold text-gray-700 bg-gray-100"
              />
              <span className="absolute right-3 top-3 flex items-center gap-1">
                <img src="https://flagcdn.com/w40/pk.png" alt="PK" className="w-5 h-4" />
              </span>
            </div>
          </div> */}

          <div>
            <label className="block text-sm text-gray-600 mb-1">E-mail</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              readOnly={!isEditing}
              className="w-full border border-gray-200 p-3 rounded-md font-semibold text-gray-700 bg-gray-100"
            />
          </div>

          {/* <div>
            <label className="block text-sm text-gray-600 mb-1">Date of Birth</label>
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              readOnly={!isEditing}
              className="w-full border border-gray-200 p-3 rounded-md font-semibold text-gray-700 bg-gray-100"
            />
          </div> */}

          {isEditing && (
            <div className="col-span-2 flex justify-end gap-4">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="border border-gray-300 px-4 py-2 rounded-md font-medium"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleSave}
                className="bg-[#3651BF] text-white px-4 py-2 rounded-md font-medium"
              >
                Save
              </button>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default ProfileUpdate;