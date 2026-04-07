import { useNavigate } from 'react-router-dom';

export default function EventRegister() {
  const navigate = useNavigate();

  const submitForm = (e) => {
    e.preventDefault();
    alert("Registration Successful!");
    navigate('/student-dashboard');
  };

  return (
    <div className="min-h-screen">
      <nav className="bg-white/10 py-4 px-10 flex justify-between items-center text-brand">
        <h1 className="text-2xl font-semibold">EventSphere</h1>
        <button onClick={() => navigate('/student-dashboard')} className="bg-brand text-darkBg px-4 py-2 rounded-md font-semibold hover:bg-brandHover transition">
          Dashboard
        </button>
      </nav>

      <div className="w-105 mx-auto mt-20 bg-white/10 p-8 rounded-xl shadow-[0_10px_25px_rgba(0,0,0,0.35)]">
        <h2 className="text-center mb-5 text-brand text-2xl font-semibold">Register for Event</h2>

        <form onSubmit={submitForm} className="flex flex-col">
          <label className="text-sm text-[#b3c7d6] mt-3">Student Name</label>
          <input type="text" placeholder="Enter your full name" required className="w-full mt-1.5 p-3 rounded-md bg-white/10 text-white outline-none border-none placeholder-[#ccc]" />

          <label className="text-sm text-[#b3c7d6] mt-3">Student ID</label>
          <input type="text" placeholder="Enter your ID" required className="w-full mt-1.5 p-3 rounded-md bg-white/10 text-white outline-none border-none placeholder-[#ccc]" />

          <label className="text-sm text-[#b3c7d6] mt-3">Branch</label>
          <input type="text" placeholder="Enter your branch" required className="w-full mt-1.5 p-3 rounded-md bg-white/10 text-white outline-none border-none placeholder-[#ccc]" />

          <label className="text-sm text-[#b3c7d6] mt-3">Section</label>
          <input type="text" placeholder="Enter your section" required className="w-full mt-1.5 p-3 rounded-md bg-white/10 text-white outline-none border-none placeholder-[#ccc]" />

          <button type="submit" className="mt-6 w-full p-3 bg-brand text-darkBg rounded-md font-semibold text-base hover:bg-brandHover transition">
            Submit
          </button>
        </form>
      </div>
    </div>
  );
}