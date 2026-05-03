import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function StudentDashboard() {
  const [activePopup, setActivePopup] = useState(null);
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [notifCount, setNotifCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const [profilePicture, setProfilePicture] = useState(null);

  // Search & filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  useEffect(() => {
    fetchEvents();
    fetchMyEvents();
    fetchNotifCount();
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      setProfilePicture(res.data.profilePicture);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchNotifCount = async () => {
    const res = await api.get('/announcements/count');
    setNotifCount(res.data);
  };

  const fetchNotifications = async () => {
    const res = await api.get('/announcements/user');
    setNotifications(res.data);
  };

  // BUG FIX: Use /events (filtered) endpoint instead of /events/all
  const fetchEvents = async (category = '', search = '') => {
    try {
      const params = {};
      if (category) params.category = category;
      if (search) params.search = search;
      const res = await api.get('/events', { params });
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = () => {
    fetchEvents(selectedCategory, searchQuery);
  };

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    fetchEvents(cat, searchQuery);
  };

  const handleSearchInput = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchKeyDown = (e) => {
    if (e.key === 'Enter') handleSearch();
  };

  const fetchMyEvents = async () => {
    try {
      const res = await api.get('/registrations/my');
      setMyEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const openEventDetails = async (id) => {
    try {
      const res = await api.get(`/events/${id}`);
      setSelectedEvent(res.data);
      setActivePopup('eventDetails');
    } catch (err) {
      console.error(err);
    }
  };

  const handleRegisterEvent = async (eventId) => {
    try {
      await api.post(`/registrations/${eventId}`);
      alert('Registered Successfully!');
      fetchMyEvents();
      setActivePopup(null);
    } catch (err) {
      alert(err.response?.data || 'Registration failed');
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  const categories = ['Technical', 'Cultural', 'Sports', 'Workshop', 'Previous'];

  return (
    <div className="min-h-screen">
      <nav className="bg-white/10 backdrop-blur-md flex justify-between items-center py-4 px-10">
        <h1 className="text-[26px] text-brand font-semibold">EventSphere</h1>
        <div className="flex items-center gap-4">
          <div
            className="relative text-[22px] cursor-pointer hover:opacity-80"
            onClick={() => {
              setActivePopup('notifications');
              fetchNotifications();
            }}
          >
            🔔{' '}
            <span className="absolute -top-1.5 -right-2 bg-red-600 text-white text-[11px] px-1.5 py-0.5 rounded-full font-bold">
              {notifCount}
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="bg-brand text-darkBg px-4 py-2 rounded-md font-semibold hover:bg-brandHover transition"
          >
            Logout
          </button>
          <Link to="/student-profile">
            <img
              src={
                profilePicture
                  ? `http://localhost:8080${profilePicture}`
                  : 'https://cdn-icons-png.flaticon.com/512/149/149071.png'
              }
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          </Link>
        </div>
      </nav>

      <section className="text-center py-12 px-5">
        <h2 className="text-[34px] text-brand font-semibold mb-2">Welcome Student</h2>
        <p className="text-[#b3c7d6]">Here are your latest events and activity overview.</p>
      </section>

      {/* Search & Filter */}
      <section className="px-10 mb-6">
        <div className="flex flex-col md:flex-row gap-3 items-center justify-center">
          <input
            type="text"
            placeholder="Search events..."
            value={searchQuery}
            onChange={handleSearchInput}
            onKeyDown={handleSearchKeyDown}
            className="p-3 rounded-md bg-white/10 text-white placeholder-[#b3c7d6] outline-none w-full md:w-80"
          />
          <button
            onClick={handleSearch}
            className="bg-brand text-darkBg px-5 py-3 rounded-md font-semibold hover:bg-brandHover transition"
          >
            Search
          </button>
        </div>

        {/* Category filter pills */}
        <div className="flex flex-wrap gap-2 justify-center mt-4">
          <button
            onClick={() => handleCategoryChange('')}
            className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
              selectedCategory === ''
                ? 'bg-brand text-darkBg'
                : 'bg-white/10 text-white hover:bg-white/20'
            }`}
          >
            All
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCategoryChange(cat)}
              className={`px-4 py-1.5 rounded-full text-sm font-semibold transition ${
                selectedCategory === cat
                  ? 'bg-brand text-darkBg'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section className="text-center py-6 px-10">
        <h2 className="text-2xl text-brand mb-8 font-semibold">
          {selectedCategory ? `${selectedCategory} Events` : 'Upcoming Events'}
        </h2>
        {events.length === 0 ? (
          <p className="text-[#b3c7d6]">No events found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <div
                key={event.id}
                className="bg-white/10 backdrop-blur-md pb-4 rounded-xl overflow-hidden shadow-lg hover:-translate-y-1 transition duration-300"
              >
                <img
                  src={`http://localhost:8080${event.bannerPath}`}
                  alt={event.title}
                  className="w-full h-42.5 object-cover"
                />
                <h3 className="text-xl text-brand my-3 font-semibold">{event.eventName}</h3>
                <p className="text-[#b3c7d6] text-sm">📅 {event.date}</p>
                <p className="text-[#b3c7d6] text-sm mb-3">📍 {event.venue}</p>
                <button
                  onClick={() => openEventDetails(event.id)}
                  className="bg-brand text-darkBg px-4 py-2 rounded-md font-semibold hover:bg-brandHover transition"
                >
                  View Details
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      <section className="text-center py-10 px-10">
        <h2 className="text-2xl text-brand mb-5 font-semibold">My Events</h2>
        {myEvents.length === 0 ? (
          <p className="text-[#b3c7d6]">You haven't registered for any events yet.</p>
        ) : (
          myEvents.map((event) => (
            <div
              key={event.id}
              className="bg-white/10 backdrop-blur-md w-full md:w-[60%] mx-auto my-3 p-5 rounded-xl shadow-lg flex justify-between items-center"
            >
              <h3 className="text-lg font-semibold text-white">{event.event.eventName}</h3>
              <p className="text-[#b3c7d6]">Status: {event.status}</p>
            </div>
          ))
        )}
      </section>

      {/* Popups */}
      {activePopup && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-darkBg p-8 rounded-xl w-105 shadow-2xl">
            {activePopup === 'notifications' && (
              <>
                <h2 className="text-2xl text-brand mb-4 font-semibold">Notifications</h2>
                {notifications.length === 0 ? (
                  <p className="text-white">No notifications</p>
                ) : (
                  notifications.map((n, i) => (
                    <p key={i} className="text-white mb-2">
                      🔔 {n.message || n.title}
                    </p>
                  ))
                )}
              </>
            )}

            {activePopup === 'eventDetails' && selectedEvent && (
              <>
                <h2 className="text-2xl text-brand mb-4 font-semibold">Event Details</h2>
                <p className="mb-2 text-[#b3c7d6]">
                  <b className="text-white">Event Name:</b> {selectedEvent.eventName}
                </p>
                <p className="mb-2 text-[#b3c7d6]">
                  <b className="text-white">Date:</b> {selectedEvent.date}
                </p>
                <p className="mb-2 text-[#b3c7d6]">
                  <b className="text-white">Venue:</b> {selectedEvent.venue}
                </p>
                <p className="mb-6 text-[#b3c7d6]">
                  <b className="text-white">Description:</b> {selectedEvent.description}
                </p>
                <button
                  onClick={() => handleRegisterEvent(selectedEvent.id)}
                  className="bg-brand text-darkBg px-4 py-2 rounded-md font-semibold hover:bg-brandHover mr-2"
                >
                  Register Now
                </button>
              </>
            )}

            <button
              onClick={() => setActivePopup(null)}
              className="bg-white/20 text-white px-4 py-2 rounded-md font-semibold hover:bg-white/30 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}

      <footer className="text-center p-5 mt-12 text-[#b3c7d6]">
        <p>© 2025 EventSphere • All Rights Reserved</p>
      </footer>
    </div>
  );
}
