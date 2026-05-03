import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api/axiosConfig';

export default function AdminDashboard() {
  const navigate = useNavigate();

  const [students, setStudents] = useState([]);
  const [organisers, setOrganisers] = useState([]);
  const [requests, setRequests] = useState([]);
  const [events, setEvents] = useState([]);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [announcementCount, setAnnouncementCount] = useState(0);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [announcements, setAnnouncements] = useState([]);
  const [eventId, setEventId] = useState('');
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('GLOBAL');
  const [profilePicture, setProfilePicture] = useState(null);

  useEffect(() => {
    fetchAll();
    fetchAnnouncementCount();
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

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get('/announcements/user');
      setAnnouncements(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const fetchAnnouncementCount = async () => {
    try {
      const res = await api.get('/announcements/count');
      setAnnouncementCount(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const createAnnouncement = async () => {
    try {
      if (type === 'GLOBAL') {
        await api.post('/announcements/global', { title, message });
      } else {
        await api.post(`/announcements/event/${eventId}`, { title, message });
      }
      alert('Announcement created!');
      setTitle('');
      setMessage('');
      setEventId('');
      fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  // BUG FIX: FormData (uppercase F) instead of formData
  const handleUpdateEvent = async () => {
    try {
      const formData = new FormData();

      formData.append('eventName', selectedEvent.eventName);
      formData.append('category', selectedEvent.category);
      formData.append('date', selectedEvent.date);
      formData.append('time', selectedEvent.time);
      formData.append('venue', selectedEvent.venue);
      formData.append('description', selectedEvent.description);

      if (selectedEvent.bannerFile) {
        formData.append('banner', selectedEvent.bannerFile);
      }

      await api.put(`/events/update/${selectedEvent.id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Event updated!');
      setShowEditModal(false);
      fetchAll();
    } catch (error) {
      console.error(error);
      alert('Error updating event');
    }
  };

  const fetchAll = async () => {
    try {
      const [s, o, r, e] = await Promise.all([
        api.get('/admin/users/USER'),
        api.get('/admin/users/ORGANISER'),
        api.get('/organiser-requests/pending'),
        api.get('/events/all'),
      ]);
      setStudents(s.data);
      setOrganisers(o.data);
      setRequests(r.data);
      setEvents(e.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const approveRequest = async (id) => {
    await api.put(`/organiser-requests/approve/${id}`);
    fetchAll();
  };

  const rejectRequest = async (id) => {
    await api.put(`/organiser-requests/reject/${id}`);
    fetchAll();
  };

  const deleteUser = async (id) => {
    await api.delete(`/admin/users/${id}`);
    fetchAll();
  };

  const demoteUser = async (id) => {
    await api.put(`/admin/users/demote/${id}`);
    fetchAll();
  };

  // BUG FIX: correct delete path — backend is /api/events/admin/events/{id}
  const deleteEvent = async (id) => {
    await api.delete(`/events/admin/events/${id}`);
    fetchAll();
  };

  return (
    <div className="min-h-screen pb-10">
      {/* NAVBAR */}
      <nav className="bg-white/10 flex justify-between items-center py-4 px-10">
        <h1 className="text-[30px] text-brand font-semibold">EventSphere Admin</h1>
        <div className="flex gap-4 items-center">
          <button onClick={handleLogout} className="bg-brand px-4 py-2 rounded-md text-darkBg font-semibold">
            Logout
          </button>
          <Link to="/admin-profile">
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

      {/* STATS */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 w-[90%] mx-auto mt-8">
        {[
          { title: 'Students', value: students.length },
          { title: 'Events', value: events.length },
          { title: 'Requests', value: requests.length },
          { title: 'Organisers', value: organisers.length },
          { title: 'Announcements', value: announcementCount },
        ].map((s, i) => (
          <div
            key={i}
            className="bg-white/10 p-6 text-center rounded-xl cursor-pointer"
            onClick={() => {
              if (s.title === 'Announcements') {
                setShowAnnouncements(true);
                fetchAnnouncements();
              }
            }}
          >
            <h3 className="text-white">{s.title}</h3>
            <p className="text-2xl text-brand">{s.value}</p>
          </div>
        ))}
      </section>

      {/* REQUESTS */}
      <section className="w-[90%] mx-auto mt-10">
        <h2 className="text-xl text-brand mb-4">Organiser Requests</h2>
        {requests.length === 0 && <p className="text-[#b3c7d6]">No pending requests.</p>}
        {requests.map((r) => (
          <div key={r.id} className="flex justify-between bg-white/10 p-3 mb-2 rounded">
            <span className="text-white">{r.user?.username}</span>
            <div className="space-x-2">
              <button
                onClick={() => approveRequest(r.id)}
                className="bg-green-400 px-3 py-1 rounded text-black font-semibold"
              >
                Approve
              </button>
              <button
                onClick={() => rejectRequest(r.id)}
                className="bg-red-400 px-3 py-1 rounded text-white font-semibold"
              >
                Reject
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* USERS */}
      <section className="w-[90%] mx-auto mt-10 grid md:grid-cols-2 gap-6">
        <div>
          <h2 className="text-xl text-brand mb-3">Students</h2>
          {students.map((u) => (
            <div key={u.id} className="flex justify-between bg-white/10 p-3 mb-2 rounded">
              <span className="text-white">{u.username}</span>
              <button
                onClick={() => deleteUser(u.id)}
                className="bg-red-400 px-2 rounded text-white font-semibold"
              >
                Delete
              </button>
            </div>
          ))}
        </div>

        <div>
          <h2 className="text-xl text-brand mb-3">Organisers</h2>
          {organisers.map((u) => (
            <div key={u.id} className="flex justify-between bg-white/10 p-3 mb-2 rounded">
              <span className="text-white">{u.username}</span>
              <div className="space-x-2">
                <button
                  onClick={() => demoteUser(u.id)}
                  className="bg-yellow-400 px-2 rounded text-black font-semibold"
                >
                  Demote
                </button>
                <button
                  onClick={() => deleteUser(u.id)}
                  className="bg-red-400 px-2 rounded text-white font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EVENTS */}
      <section className="w-[90%] mx-auto mt-10">
        <h2 className="text-xl text-brand mb-4">All Events</h2>
        <Link to="/create-event">
          <button className="bg-brand px-4 py-2 mb-4 rounded text-darkBg font-semibold">
            + Create Event
          </button>
        </Link>

        {events.map((e) => (
          <div key={e.id} className="flex justify-between bg-white/10 p-3 mb-2 rounded">
            <span className="text-white">{e.eventName}</span>
            <div className="space-x-2">
              <button
                onClick={() => {
                  setSelectedEvent(e);
                  setShowEditModal(true);
                }}
                className="bg-yellow-400 px-2 rounded text-black font-semibold"
              >
                Edit
              </button>
              <button
                onClick={() => deleteEvent(e.id)}
                className="bg-red-400 px-2 rounded text-white font-semibold"
              >
                Delete
              </button>
            </div>
          </div>
        ))}

        {/* Edit Modal */}
        {showEditModal && selectedEvent && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
            <div className="bg-[#0f172a] p-6 rounded-xl w-[500px]">
              <h2 className="text-xl text-brand mb-4">Edit Event</h2>

              <input
                value={selectedEvent.eventName}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, eventName: e.target.value })}
                className="w-full p-2 mb-2 bg-white/10 text-white rounded"
                placeholder="Event Name"
              />
              <input
                value={selectedEvent.category}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, category: e.target.value })}
                className="w-full p-2 mb-2 bg-white/10 text-white rounded"
                placeholder="Category"
              />
              <input
                type="date"
                value={selectedEvent.date}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, date: e.target.value })}
                className="w-full p-2 mb-2 bg-white/10 text-white rounded"
              />
              <input
                type="time"
                value={selectedEvent.time}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, time: e.target.value })}
                className="w-full p-2 mb-2 bg-white/10 text-white rounded"
              />
              <input
                value={selectedEvent.venue}
                onChange={(e) => setSelectedEvent({ ...selectedEvent, venue: e.target.value })}
                className="w-full p-2 mb-2 bg-white/10 text-white rounded"
                placeholder="Venue"
              />
              <textarea
                value={selectedEvent.description}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, description: e.target.value })
                }
                className="w-full p-2 mb-2 bg-white/10 text-white rounded"
                placeholder="Description"
              />
              <input
                type="file"
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, bannerFile: e.target.files[0] })
                }
                className="mb-3 text-white"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-500 px-4 py-2 rounded text-white"
                >
                  Cancel
                </button>
                <button onClick={handleUpdateEvent} className="bg-brand px-4 py-2 rounded text-darkBg font-semibold">
                  Save
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Announcements Modal */}
        {showAnnouncements && (
          <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">
            <div className="w-[90%] max-w-2xl max-h-[85vh] overflow-y-auto bg-slate-800/95 backdrop-blur-md rounded-2xl p-6 shadow-xl">
              <h2 className="text-2xl text-center text-[#4ea8de] font-semibold mb-5">
                Announcements
              </h2>

              <div className="space-y-3 mb-6">
                <input
                  type="text"
                  placeholder="Title"
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#4ea8de]"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  placeholder="Message"
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/10 focus:outline-none focus:ring-2 focus:ring-[#4ea8de]"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                />
                <select
                  className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/10"
                  value={type}
                  onChange={(e) => setType(e.target.value)}
                >
                  <option value="GLOBAL">Global</option>
                  <option value="EVENT">Event</option>
                </select>

                {type === 'EVENT' && (
                  <select
                    className="w-full p-2 rounded-lg bg-white/10 text-white border border-white/10"
                    value={eventId}
                    onChange={(e) => setEventId(e.target.value)}
                  >
                    <option value="">Select Event</option>
                    {events.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.eventName}
                      </option>
                    ))}
                  </select>
                )}

                <button
                  onClick={createAnnouncement}
                  className="w-full bg-[#4ea8de] text-[#012a3b] py-2 rounded-lg font-semibold hover:opacity-90 transition"
                >
                  Create Announcement
                </button>
              </div>

              <div className="space-y-3">
                {announcements.length === 0 && (
                  <p className="text-center text-gray-400">No announcements yet</p>
                )}
                {announcements.map((a) => (
                  <div key={a.id} className="bg-white/10 p-4 rounded-lg border-l-4 border-[#4ea8de]">
                    <h3 className="text-lg font-semibold text-white">{a.title}</h3>
                    <p className="text-gray-300 mt-1">{a.message}</p>
                    <small className="text-gray-400 block mt-2">
                      {a.type}
                      {a.event && ` • ${a.event.eventName}`}
                    </small>
                  </div>
                ))}
              </div>

              <button
                onClick={() => setShowAnnouncements(false)}
                className="w-full mt-6 bg-red-500 py-2 rounded-lg text-white font-semibold hover:bg-red-600 transition"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
