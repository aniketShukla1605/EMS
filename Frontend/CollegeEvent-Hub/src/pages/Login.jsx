import { Link, useNavigate } from 'react-router-dom';
import { useState } from 'react';
import api from '../api/axiosConfig';

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await api.post('/auth/login', {
        email,
        password,
      });

      const { token, role: userRole } = response.data;

      // store token
      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);

      // redirect based on role
      if (userRole === 'ROLE_ADMIN') {
        navigate('/admin-dashboard');
      } else if (userRole === 'ROLE_ORGANISER') {
        navigate('/organiser-dashboard');
      } else {
        navigate('/student-dashboard');
      }

    } catch (error) {
      const message = error.response?.data?.message || "Something went wrong";
      alert(message);
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="bg-white/10 p-10 rounded-xl w-[90%] max-w-[380px] text-center shadow-[0_2px_12px_rgba(0,0,0,0.3)]">
        <h2 className="text-brand text-2xl mb-5 font-semibold">Login to EventSphere</h2>
        <form onSubmit={handleLogin}>
          <input 
            type="email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)} 
            placeholder="Email" 
            required 
            className="w-full p-4 my-2 border-none rounded-md bg-white/15 text-white outline-none placeholder-[#cfd9e2] text-base"
          />
          <input 
            type="password" 
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            placeholder="Password" 
            required 
            className="w-full p-4 my-2 border-none rounded-md bg-white/15 text-white outline-none placeholder-[#cfd9e2] text-base"
          />
          {/* <select className="w-full p-4 my-2 border-none rounded-md bg-white/15 text-white outline-none text-base [&>option]:bg-[#536769]">
            <option value="user">User</option>
            <option value="organizer">Organizer</option>
            <option value="admin">Admin</option>
          </select> */}
          <p className='mt-4 text-white text-xs'>
            <Link to="/forgot-password" className='text-brand no-underline hover:underline'>Forgot Password</Link>
          </p>
          <button type="submit" className="w-full p-3 mt-3 bg-brand text-darkBg border-none rounded-md font-semibold cursor-pointer hover:bg-brandHover transition">
            Login
          </button>
        </form>
        <p className="mt-4 text-white">
          Don't have an account? <Link to="/register" className="text-brand no-underline hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}