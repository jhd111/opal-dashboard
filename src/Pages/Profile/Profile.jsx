import React, { useState } from 'react';
import { FaEyeSlash, FaRegCalendarAlt, FaPen } from 'react-icons/fa';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

const ProfileUpdate = () => {
  const [profileImage, setProfileImage] = useState('https://randomuser.me/api/portraits/men/1.jpg');
  const [formData, setFormData] = useState({
    firstName: 'Wade',
    lastName: 'Warren',
    password: '***********',
    phoneNumber: '(406) 555-0120',
    email: 'wade.warren@example.com',
    dateOfBirth: new Date('1999-01-12'),
  });
  const [showPassword, setShowPassword] = useState(false);

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

  const handleDateChange = (date) => {
    setFormData((prev) => ({ ...prev, dateOfBirth: date }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSave = async () => {
    const allFieldsFilled = Object.values(formData).every(value => 
      value instanceof Date ? value.toString() !== 'Invalid Date' : value.trim().length > 0
    );
    if (!allFieldsFilled) {
      alert('Please fill all fields before saving.');
      return;
    }

    try {
      const response = await fetch('/api/update-profile', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          dateOfBirth: formData.dateOfBirth.toISOString().split('T')[0],
        }),
      });
      const data = await response.json();
      console.log('Success:', data);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-xl shadow-md">
      <div className="flex justify-between items-start mb-6">
        <div className="flex items-center gap-4">
          <img
            src={profileImage}
            alt="profile"
            className="w-20 h-20 rounded-full object-cover"
          />
          <div className="flex gap-2">
            <button
              className="bg-[#3651BF] text-white font-medium px-4 py-2 rounded-lg"
              onClick={() => document.getElementById('fileImage').click()}
            >
              Upload New
            </button>
            <input
              id="fileImage"
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
        <button
          onClick={handleSave}
          className="border p-2 rounded-md text-gray-500 hover:text-gray-700"
        >
          <FaPen />
        </button>
      </div>

      <form className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-gray-600 mb-1">First Name</label>
          <input
            type="text"
            name="firstName"
            value={formData.firstName}
            onChange={handleChange}
            onClick={(e) => (e.target.readOnly = false)}
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
            onClick={(e) => (e.target.readOnly = false)}
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
              onClick={(e) => (e.target.readOnly = false)}
              className="w-full border border-gray-200 p-3 pr-10 rounded-md bg-gray-100"
            />
            <FaEyeSlash
              className="absolute right-3 top-3.5 text-gray-400 cursor-pointer"
              onClick={togglePasswordVisibility}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Phone Number</label>
          <div className="relative">
            <input
              type="text"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              onClick={(e) => (e.target.readOnly = false)}
              className="w-full border border-gray-200 p-3 rounded-md font-semibold text-gray-700 bg-gray-100 pr-10"
            />
            <img
              src="https://flagcdn.com/pk.svg"
              alt="Pakistan"
              className="absolute right-3 top-3.5 w-5 h-5"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">E-mail</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            onClick={(e) => (e.target.readOnly = false)}
            className="w-full border border-gray-200 p-3 rounded-md font-semibold text-gray-700 bg-gray-100"
          />
        </div>

        <div>
          <label className="block text-sm text-gray-600 mb-1">Date of Birth</label>
          <div className="relative">
            <DatePicker
              selected={formData.dateOfBirth}
              onChange={handleDateChange}
              dateFormat="dd- MMMM- yyyy"
              className="w-full border border-gray-200 p-3 rounded-md font-semibold text-gray-700 bg-gray-100"
              onClick={(e) => (e.target.readOnly = false)}
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileUpdate;