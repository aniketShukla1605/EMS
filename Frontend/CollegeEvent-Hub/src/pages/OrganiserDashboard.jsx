import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import api from '../api/axiosConfig';


export default function OrganiserDashboard() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [totalRegistrations, setTotalRegistrations] = useState(0);
  const [registrations, setRegistrations] = useState([]);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [pendingCount, setPendingCount] = useState(0);
  const [announcementCount, setAnnouncementCount] = useState(0);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [announcements, setAnnouncements] = useState([]);

  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [type, setType] = useState("GLOBAL");
  const [eventId, setEventId] = useState("");

  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [profilePicture, setProfilePicture] = useState(null);


  useEffect(() => {
    fetchMyEvents();
    fetchTotalRegistrations();
    fetchPendingCount();
    fetchAnnouncementCount();
    fetchProfile();
  }, []);
  // useEffect(()=>{
  //   setCounts(getCounts());
  // },[registrations])

  const fetchProfile = async () => {
    try {
      const res = await api.get('/profile');
      setProfilePicture(res.data.profilePicture);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnnouncements = async () => {
    try {
      const res = await api.get("/announcements/user");
      setAnnouncements(res.data);
    } catch (error) {
      console.error(error);
    }
  }

  const fetchAnnouncementCount = async () => {
    try {
      const res = await api.get('/announcements/count');
      setAnnouncementCount(res.data);
    } catch (error) {

    }
  }

  const createAnnouncement = async () => {
    try {
      if (type === "GLOBAL") {
        await api.post("/announcements/global", { title, message });
      } else {
        await api.post(`/announcements/event/${eventId}`, {
          title,
          message,
        });
      }

      alert("Announcement created!");

      setTitle("");
      setMessage("");
      setEventId("");

      fetchAnnouncements();
    } catch (err) {
      console.error(err);
    }
  };

  const viewRegistrations = async (eventId) => {
    try {
      const res = await api.get(`/registrations/event/${eventId}`);
      setRegistrations(res.data);
      setSelectedEventId(eventId);
    } catch (err) {
      console.error(err);
    }
  }

  const fetchPendingCount = async () => {
    try {
      const res = await api.get('/registrations/pending-count');
      setPendingCount(res.data);
      console.log(res.data);
    }
    catch (err) {
      console.error(err);
    }
  }

  const fetchTotalRegistrations = async () => {
    const res = await api.get('/registrations/organiser-registrations');
    setTotalRegistrations(res.data.length);
  };

  const fetchMyEvents = async () => {
    try {
      const res = await api.get('/events/my-events');
      setEvents(res.data);
      console.log(res.data);
    } catch (err) {
      console.error(err);
    }
  }

  // const getCounts = () => {
  //   const map = {};
  //   registrations.forEach((r) => {
  //     if(!r.event) return;
  //     const eventId = r.event.id;
  //     map[eventId] = (map[eventId] || 0)+1;
  //   });
  //   return map;
  // };

  const handleApprove = async (id) => {
    await api.put(`/registrations/approve/${id}`);
    viewRegistrations(selectedEventId);
  }
  const handleReject = async (id) => {
    await api.put(`/registrations/reject/${id}`);
    viewRegistrations(selectedEventId);
  }

  const handleUpdateEvent = async () => {
    try {
      const formData = new formData();

      formData.append("eventName",selectedEvent.eventName);
      formData.append("category",selectedEvent.category);
      formData.append("date",selectedEvent.date);
      formData.append("time",selectedEvent.time);
      formData.append("venue",selectedEvent.venue);
      formData.append("description",selectedEvent.description);

      if(selectedEvent.banner) {
        formData.append("banner", selectedEvent.banner);
      }

      await api.put(`/event/update/${selectedEvent.id}`,formData, {
        headers: {"Content-Type":"multipart/form-data"}
      });
      alert("Event updated!");
      setShowEditModal(false);
      
    } catch (error) {
      console.error(error);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/login');
  };

  console.log(registrations);

  return (
    <div className="min-h-screen pb-10">
      <nav className="bg-white/10 backdrop-blur-md flex justify-between items-center py-4 px-10">
        <h1 className="text-[28px] text-brand font-semibold">EventSphere Organiser</h1>
        <div className="flex gap-4 items-center">
          <button onClick={handleLogout} className="bg-brand text-darkBg px-4 py-2 rounded-md font-semibold hover:bg-brandHover transition">
            Logout
          </button>
          <Link to="/organiser-profile">
            <img
              src={
                profilePicture
                  ? `http://localhost:8080${profilePicture}`
                  : "https://cdn-icons-png.flaticon.com/512/149/149071.png"
              }
              alt="profile"
              className="w-10 h-10 rounded-full object-cover"
            />
          </Link>
        </div>
      </nav>

      <section className="text-center py-10">
        <h2 className="text-3xl text-brand font-semibold mb-2">Welcome, Organiser!</h2>
        <p className="text-[#b3c7d6]">Manage your events, submissions, and track registrations.</p>
      </section>

      <section className="w-[90%] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "Your Events", value: events.length },
          { title: "Pending Approvals", value: pendingCount },
          { title: "Total Registrations", value: totalRegistrations },
          { title: "Announcements", value: announcementCount }
        ].map((stat, idx) => (
          <div key={idx} onClick={() => { if (stat.title === "Announcements") { setShowAnnouncements(true); fetchAnnouncements(); } }} className="bg-white/10 p-6 text-center rounded-xl shadow-[0_4px_16px_rgba(0,0,0,0.25)]">
            <h3 className="text-lg text-white font-medium">{stat.title}</h3>
            <p className="text-[28px] text-brand font-semibold mt-2">{stat.value}</p>
          </div>
        ))}
      </section>

      <section className="bg-white/10 w-[90%] mx-auto mt-10 p-6 rounded-xl shadow-[0_5px_20px_rgba(0,0,0,0.25)]">
        <h2 className="text-[#a9cbee] text-[22px] font-semibold mb-4">Manage Your Events</h2>
        <Link to="/create-event">
          <button className="bg-brand text-darkBg px-4 py-2 rounded-md font-semibold mb-4 hover:bg-brandHover transition">+ Create New Event</button>
        </Link>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse mt-2">
            <thead>
              <tr>
                <th className="text-brand p-3 border-b border-white/10 text-center">Event</th>
                <th className="text-brand p-3 border-b border-white/10 text-center">Date</th>
                {/* <th className="text-brand p-3 border-b border-white/10 text-center">Registrations</th> */}
                <th className="text-brand p-3 border-b border-white/10 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr key={event.id}>
                  <td className="p-3 border-b border-white/10 text-center text-white">{event.eventName}</td>
                  <td className="p-3 border-b border-white/10 text-center text-white">{event.date}</td>
                  {/* <td className="p-3 border-b border-white/10 text-center text-white">{counts[event.id] || 0}</td> */}
                  <td className="p-3 border-b border-white/10 text-center space-x-2">
                    <button onClick={() => {setSelectedEvent(event); setShowEditModal(true);}} className="bg-[#4ea8de] text-[#012a3b] px-3 py-1.5 rounded-md font-semibold hover:opacity-90">Edit</button>
                    <button onClick={() => viewRegistrations(event.id)} className="bg-[#80ffdb] text-[#063a2f] px-3 py-1.5 rounded-md font-semibold hover:opacity-90">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {registrations.length > 0 && (
            <div className='mt-6'>
              <h3 className='text-brand text-xl' >Registrations : {registrations.length}</h3>

              {registrations.map((r) => (
                <div key={r.id} className='flex justify-between bg-white/10 p-3 my-2 rounded'>
                  <span>{r.user.username}</span>
                  <span>{r.status}</span>
                  {r.status === "PENDING" &&
                    (<div>
                      <button onClick={() => handleApprove(r.user.id)} className="bg-[#4ea8de] text-[#012a3b] px-3 py-1.5 my-auto rounded-md font-semibold hover:opacity-90">Approve</button>
                      <button onClick={() => handleReject(r.user.id)} className="bg-[#80ffdb] text-[#063a2f] px-3 py-1.5 my-auto rounded-md font-semibold hover:opacity-90"> Reject</button>
                    </div>)
                  }</div>
              ))}
            </div>
          )}
          {showAnnouncements && (
            <div className="fixed inset-0 bg-black/70 flex justify-center items-center z-50">

              <div className="w-[90%] max-w-2xl max-h-[85vh] overflow-y-auto 
                    bg-slate-800/95 backdrop-blur-md 
                    rounded-2xl p-6 shadow-xl">

                {/* TITLE */}
                <h2 className="text-2xl text-center text-[#4ea8de] font-semibold mb-5">
                  Announcements
                </h2>

                {/* CREATE FORM */}
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

                  {type === "EVENT" && (
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

                {/* ANNOUNCEMENTS LIST */}
                <div className="space-y-3">

                  {announcements.length === 0 && (
                    <p className="text-center text-gray-400">No announcements yet</p>
                  )}

                  {announcements.map((a) => (
                    <div
                      key={a.id}
                      className="bg-white/10 p-4 rounded-lg border-l-4 border-[#4ea8de]"
                    >
                      <h3 className="text-lg font-semibold text-white">
                        {a.title}
                      </h3>

                      <p className="text-gray-300 mt-1">
                        {a.message}
                      </p>

                      <small className="text-gray-400 block mt-2">
                        {a.type}
                        {a.event && ` • ${a.event.eventName}`}
                      </small>
                    </div>
                  ))}
                </div>

                {/* CLOSE BUTTON */}
                <button
                  onClick={() => setShowAnnouncements(false)}
                  className="w-full mt-6 bg-red-500 py-2 rounded-lg text-white font-semibold hover:bg-red-600 transition"
                >
                  Close
                </button>

              </div>
            </div>
          )}
        </div>

        {showEditModal && (
          <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-[#0f172a] p-6 rounded-xl w-[500px]">

              <h2 className="text-xl text-brand mb-4">Edit Event</h2>

              <input
                value={selectedEvent.eventName}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, eventName: e.target.value })
                }
                className="w-full p-2 mb-2 bg-white/10 text-white rounded"
                placeholder="Event Name"
              />

              <input
                value={selectedEvent.category}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, category: e.target.value })
                }
                className="w-full p-2 mb-2 bg-white/10 text-white rounded"
                placeholder="Category"
              />

              <input
                type="date"
                value={selectedEvent.date}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, date: e.target.value })
                }
                className="w-full p-2 mb-2 bg-white/10 text-white rounded"
              />

              <input
                type="time"
                value={selectedEvent.time}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, time: e.target.value })
                }
                className="w-full p-2 mb-2 bg-white/10 text-white rounded"
              />

              <input
                value={selectedEvent.venue}
                onChange={(e) =>
                  setSelectedEvent({ ...selectedEvent, venue: e.target.value })
                }
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
                  setSelectedEvent({
                    ...selectedEvent,
                    bannerFile: e.target.files[0]
                  })
                }
                className="mb-3 text-white"
              />

              <div className="flex justify-end gap-3">
                <button
                  onClick={() => setShowEditModal(false)}
                  className="bg-gray-500 px-4 py-2 rounded"
                >
                  Cancel
                </button>

                <button
                  onClick={handleUpdateEvent}
                  className="bg-brand px-4 py-2 rounded"
                >
                  Save
                </button>
              </div>

            </div>
          </div>
        )}

      </section>

      <footer className="text-center mt-6 p-4 text-[#b7d0e3]">
        <p>© 2025 EventSphere • All Rights Reserved</p>
      </footer>
    </div>
  );
}