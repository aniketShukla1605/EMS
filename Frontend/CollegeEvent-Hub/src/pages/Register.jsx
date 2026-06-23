import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api, { apiOrigin } from '../api/axiosConfig';

export default function Register() {
  const navigate = useNavigate();

  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);

  const [formData, setFormData] = useState({
    username: '',
    email: '',
    instituteID: '',
    branch: '',
    contact: '',
    Address: '',
    password: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendOtp = async () => {
    try {
      const response = await fetch(`${apiOrigin}/otp/send`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email })
      });
      const text = await response.text();
      if (response.ok) {
        alert(text);
        setOtpSent(true);
      } else {
        alert("Failed to send OTP");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const verifyOtp = async () => {
    try {
      const response = await fetch(`${apiOrigin}/otp/verify?email=${formData.email}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: otp })
      });
      const text = await response.text();
      if (response.ok) {
        alert(text);
        setEmailVerified(true);
      } else {
        alert(text);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', formData);
      alert("Registration successful! You can now log in.");
      navigate('/login');
    } catch (error) {
      console.error("Registration failed", error);
      alert("Registration failed. This email or ID might already be registered.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen py-10">
      <div className="bg-white/10 p-8 rounded-xl w-[90%] max-w-125 shadow-[0_4px_15px_rgba(0,0,0,0.3)]">
        <h2 className="text-center text-brand text-2xl mb-5 font-semibold">Create Your Account</h2>

        <form onSubmit={handleRegister} className="flex flex-col">

          <label className="mt-2 font-medium text-[#aee6e6]">Full Name</label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
            className="w-full p-3 mt-2 rounded-md bg-white/15 text-white outline-none placeholder-[#cfd9e2]"
          />

          <label className="mt-3 font-medium text-[#aee6e6]">Email</label>
          <div className="flex gap-2 items-center mt-2">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
              className="flex-1 p-3 rounded-md bg-white/15 text-white outline-none placeholder-[#cfd9e2]"
            />
            <button
              type="button"
              onClick={sendOtp}
              disabled={!formData.email}
              className="shrink-0 px-4 py-3 bg-brand text-darkBg rounded-md font-semibold text-sm hover:bg-brandHover transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Send OTP
            </button>
          </div>
          {otpSent && !emailVerified && (
            <div className="flex gap-2 items-center mt-3">
              <input
                type="text"
                placeholder="Enter OTP"
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                className="flex-1 p-3 rounded-md bg-white/15 text-white outline-none placeholder-[#cfd9e2]"
              />
              <button
                type="button"
                onClick={verifyOtp}
                className="shrink-0 px-4 py-3 bg-white/20 text-white rounded-md font-semibold text-sm hover:bg-white/30 transition"
              >
                Verify
              </button>
            </div>
          )}

          {emailVerified && (
            <p className="mt-2 text-sm font-semibold text-green-400">
              ✓ Email Verified
            </p>
          )}

          <label className="mt-3 font-medium text-[#aee6e6]">Institute ID</label>
          <input
            type="text"
            name="instituteID"
            value={formData.instituteID}
            onChange={handleChange}
            placeholder="Enter your ID"
            required
            className="w-full p-3 mt-2 rounded-md bg-white/15 text-white outline-none placeholder-[#cfd9e2]"
          />

          <label className="mt-3 font-medium text-[#aee6e6]">Branch</label>
          <input
            type="text"
            name="branch"
            value={formData.branch}
            onChange={handleChange}
            placeholder="Enter your branch"
            required
            className="w-full p-3 mt-2 rounded-md bg-white/15 text-white outline-none placeholder-[#cfd9e2]"
          />

          <label className="mt-3 font-medium text-[#aee6e6]">Contact Number</label>
          <input
            type="tel"
            name="contact"
            value={formData.contact}
            onChange={handleChange}
            placeholder="Enter contact number"
            required
            className="w-full p-3 mt-2 rounded-md bg-white/15 text-white outline-none placeholder-[#cfd9e2]"
          />

          <label className="mt-3 font-medium text-[#aee6e6]">Address</label>
          <textarea
            name="Address"
            value={formData.Address}
            onChange={handleChange}
            placeholder="Enter your address"
            required
            className="w-full p-3 mt-2 rounded-md bg-white/15 text-white outline-none placeholder-[#cfd9e2] h-[70px] resize-none"
          />

          <label className="mt-3 font-medium text-[#aee6e6]">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Choose a password"
            required
            className="w-full p-3 mt-2 rounded-md bg-white/15 text-white outline-none placeholder-[#cfd9e2]"
          />

          <button
            type="submit"
            className="w-full mt-5 p-3 bg-brand text-darkBg rounded-md font-semibold cursor-pointer hover:bg-brandHover transition"
          >
            Register
          </button>
        </form>

        <p className="text-center mt-4">
          Already have an account?{' '}
          <Link to="/login" className="text-brand no-underline hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
