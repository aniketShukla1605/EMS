import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function AdminProfile() {

  const [isEditing, setIsEditing] = useState(false);
  const [profile, setProfile] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: ""
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      setProfile(res.data);
      setProfilePicture(res.data.profilePicture);
    } catch (err) {
      console.error(err);
    }
  };

  const handleProfileUpload = async (file) => {
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await api.post('/profile/upload-profile', formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });

      setProfilePicture(res.data);
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

  const handleUpdateProfile = async () => {
    try {
      await api.put('/profile', profile);
      alert("Profile updated!");
      setIsEditing(false);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="min-h-screen pb-10">

      {/* NAVBAR */}
      <nav className="bg-white/10 flex items-center justify-between py-4 px-10">
        <h1 className="text-[28px] font-semibold text-brand">EventSphere Admin</h1>

        <div className="flex items-center gap-4">
          <Link
            to="/admin-dashboard"
            className="bg-brand text-darkBg px-4 py-2 rounded-md font-semibold hover:bg-brandHover transition"
          >
            Dashboard
          </Link>

          <img
            src={
              profilePicture
                ? `http://localhost:8080${profilePicture}`
                : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            }
            className="w-11.25 h-11.25 rounded-full object-cover"
          />
        </div>
      </nav>

      <div className="w-[80%] mx-auto mt-10">

        {/* HEADER */}
        <div className="bg-white/10 p-6 rounded-xl flex items-center gap-6 shadow-[0_4px_14px_rgba(0,0,0,0.2)]">

          <div className="relative">
            <img
              src={
                profilePicture
                  ? `http://localhost:8080${profilePicture}`
                  : "https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
              }
              className="w-30 h-30 rounded-full object-cover"
              alt="Profile"
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
            <h2 className="text-[28px] text-brand font-semibold">
              {profile?.username}
            </h2>
            <p className="text-[#b3c7d6]">Administrator • EventSphere</p>
            <p className="text-[#b3c7d6] text-sm mt-1">
              Email: {profile?.email}
            </p>
          </div>

          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="ml-auto px-5 py-2.5 bg-brand text-darkBg rounded-md font-semibold hover:bg-brandHover transition"
            >
              Edit Profile
            </button>
          ) : (
            <button
              onClick={handleUpdateProfile}
              className="ml-auto px-5 py-2.5 bg-green-400 text-black rounded-md font-semibold hover:bg-green-500 transition"
            >
              Save Changes
            </button>
          )}
        </div>

        {/* DETAILS */}
        <div className="mt-8 bg-white/10 p-8 rounded-xl shadow-[0_4px_14px_rgba(0,0,0,0.15)]">
          <h3 className="text-[#83b1d4] text-[22px] mb-5">Admin Details</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {[
              { label: "Full Name", id: "username" },
              { label: "Email Address", id: "email" },
              { label: "Phone Number", id: "contact" }
            ].map((field, idx) => (
              <div key={idx} className="flex flex-col">
                <label className="font-semibold text-[#b3c7d6]">
                  {field.label}
                </label>

                <input
                  value={profile?.[field.id] || ""}
                  disabled={!isEditing}
                  onChange={(e) =>
                    setProfile({ ...profile, [field.id]: e.target.value })
                  }
                  className="w-full mt-1.5 p-3 rounded-md bg-white/10 text-white outline-none"
                />
              </div>
            ))}

            <div className="flex flex-col">
              <label className="font-semibold text-[#b3c7d6]">Role</label>
              <input
                value="ADMIN"
                disabled
                className="w-full mt-1.5 p-3 rounded-md bg-white/10 text-white opacity-70"
              />
            </div>

            <div className="flex flex-col md:col-span-2">
              <label className="font-semibold text-[#b3c7d6]">About</label>
              <textarea
                defaultValue={"Responsible for managing events, organisers, students and platform security"}
                disabled={!isEditing}
                onChange={(e) =>
                  setProfile({ ...profile, about: e.target.value })
                }
                className="w-full mt-1.5 p-3 rounded-md bg-white/10 text-white h-25 resize-none"
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