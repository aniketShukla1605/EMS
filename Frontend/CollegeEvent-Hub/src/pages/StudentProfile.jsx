import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function StudentProfile() {

  const [isEditing, setIsEditing] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: ""
  });

  const [profile, setProfile] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);

  const [requestSent, setRequestSent] = useState(false);

  useEffect(() => {
    fetchProfile();
  }, []);


  const handleBecomeOrganiser = async () => {
    try {
      const res = await api.post('/organiser-requests/request');
      alert(res.data || "Request sent successfully");
      setRequestSent(true);
    } catch (error) {
      alert(err.response?.data || "Error Sending Request");
    }
  }

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      setProfile(res.data);
      setProfilePicture(res.data.profilePicture); // ✅ IMPORTANT
    } catch (err) {
      console.error(err);
    }
  };

  // ✅ UPLOAD PROFILE IMAGE
  const handleProfileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post('/profile/upload-profile', formData, {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      });

      setProfilePicture(res.data); // should return "/uploads/filename.jpg"
    } catch (err) {
      console.error(err);
    }
  };

  const handleChangePassword = async () => {
    try {
      const res = await api.put('/profile/change-password', passwordData);
      alert(res.data);
    } catch (err) {
      alert(err.response?.data || "Error changing password");
    }
  };

  const handleUpdateprofile = async () => {
    try {
      await api.put('/profile', profile);
      alert("Profile updated successfully");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen pb-10">

      {/* NAVBAR */}
      <nav className="bg-white/10 flex items-center justify-between py-4 px-10 text-brand">
        <h1 className="text-2xl font-semibold">EventSphere</h1>

        <div className="flex items-center gap-4">
          <Link
            to="/student-dashboard"
            className="bg-brand text-darkBg px-4 py-2 rounded-md font-semibold hover:bg-brandHover transition"
          >
            Dashboard
          </Link>

          <div >
            <button onClick={handleBecomeOrganiser} disabled={requestSent} className={`px-5 py-2.5 rounded-md font-semibold transition ${requestSent ? "bg-gray-400 cursor-not-allowed" : "bg-brand text-darkBg px-4 py-2 rounded-md font-semibold hover:bg-brandHover transition"}`}>
              {requestSent ? "Request Sent" : "Become Organiser"}
            </button>
          </div>

          <img
            src={
              profilePicture
                ? `http://localhost:8080${profilePicture}`
                : "https://i.pravatar.cc/50"
            }
            alt="Profile"
            className="w-11.25 h-11.25 rounded-full object-cover"
          />
        </div>
      </nav>

      <div className="w-[80%] mx-auto mt-10">

        {/* PROFILE HEADER */}
        <div className="bg-white/10 p-6 rounded-xl flex items-center gap-6 shadow-[0_4px_14px_rgba(0,0,0,0.1)]">

          <div className="relative">
            <img
              src={
                profilePicture
                  ? `http://localhost:8080${profilePicture}`
                  : "https://i.pravatar.cc/120"
              }
              alt="Profile"
              className="w-30 h-30 rounded-full object-cover"
            />

            {isEditing && (
              <label className="absolute bottom-0 right-0 bg-brand text-black px-2 py-1 text-xs rounded cursor-pointer">
                Upload
                <input
                  type="file"
                  hidden
                  accept="image/*"
                  onChange={(e) => handleProfileUpload(e.target.files[0])}
                />
              </label>
            )}
          </div>

          <div>
            <h2 className="text-[28px] font-semibold text-brand">
              {profile?.username}
            </h2>
            <p className="text-[#b3c7d6]">{profile?.branch}</p>
            <p className="text-[13px] text-[#b3c7d6]">
              ID: {profile?.instituteID}
            </p>
          </div>

          <button
            onClick={isEditing ? handleUpdateprofile : () => setIsEditing(true)}
            className="ml-auto px-5 py-2.5 bg-brand text-darkBg font-semibold text-[15px] rounded-md hover:bg-brandHover transition"
          >
            {isEditing ? "Save Profile" : "Edit Profile"}
          </button>
        </div>

        {/* DETAILS */}
        <div className="mt-8 bg-white/10 p-8 rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.08)]">
          <h3 className="mb-5 text-[22px] text-[#83b1d4]">
            Personal Information
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {[
              { label: "Full Name", type: "text", id: "username" },
              { label: "Email", type: "email", id: "email" },
              { label: "Student ID", type: "text", id: "instituteID" },
              { label: "Branch", type: "text", id: "branch" },
              { label: "Contact Number", type: "tel", id: "contact" }
            ].map((field, idx) => (
              <div key={idx} className="flex flex-col">
                <label className="font-semibold text-[#b3c7d6]">
                  {field.label}
                </label>
                <input
                  type={field.type}
                  value={profile?.[field.id] || ""}
                  disabled={!isEditing}
                  className="w-full mt-1.5 p-3 rounded-md bg-white/10 border-none text-white disabled:opacity-70 outline-none"
                />
              </div>
            ))}

            <div className="flex flex-col">
              <label className="font-semibold text-[#b3c7d6]">Address</label>
              <textarea
                disabled={!isEditing}
                value={profile?.address || ""}
                className="w-full mt-1.5 p-3 rounded-md bg-white/10 border-none text-white disabled:opacity-70 outline-none h-22.5 resize-none"
              />
            </div>

            <div className="flex flex-col">
              <label className="font-semibold text-[#b3c7d6]">Role</label>
              <input
                type="text"
                disabled
                value="Student"
                className="w-full mt-1.5 p-3 rounded-md bg-white/10 border-none text-white opacity-70 outline-none"
              />
            </div>

            {/* PASSWORD */}
            <div className="mt-8 bg-white/10 p-6 rounded-xl col-span-2">
              <h3 className="text-xl text-brand mb-4">
                Change Password
              </h3>

              <input
                type="password"
                placeholder="Current Password"
                value={passwordData.currentPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    currentPassword: e.target.value
                  })
                }
                className="w-full p-3 mb-3 rounded-md bg-white/10 text-white"
              />

              <input
                type="password"
                placeholder="New Password"
                value={passwordData.newPassword}
                onChange={(e) =>
                  setPasswordData({
                    ...passwordData,
                    newPassword: e.target.value
                  })
                }
                className="w-full p-3 mb-3 rounded-md bg-white/10 text-white"
              />
              <p className='mt-4 text-white text-sm'>
                <Link to='/forgot-password' className='text-brand no-underline hover:underline'>Forgot Password</Link>
              </p>
              <button
                onClick={handleChangePassword}
                className="ml-auto px-5 py-2.5 bg-brand text-darkBg font-semibold text-[15px] rounded-md hover:bg-brandHover transition"
              >
                Update Password
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}