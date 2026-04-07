import { useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axiosConfig"; // your axios config

export default function CreateEvent() {
  const [formData, setFormData] = useState({
    eventName: "",
    venue: "",
    date: "",
    time: "",
    category: "",
    description: "",
  });

  const [banner, setBanner] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [error, setError] = useState("");

  // handle input change
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // handle image
  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) {
      setBanner(null);
      setImagePreview(null);
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file!");
      setBanner(null);
      return;
    }

    setError("");
    setBanner(file);
    setImagePreview(URL.createObjectURL(file));
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = new FormData();

      data.append("eventName", formData.eventName);
      data.append("venue", formData.venue);
      data.append("date", formData.date);
      data.append("time", formData.time);
      data.append("category", formData.category);
      data.append("description", formData.description);
      data.append("banner", banner);

      const res = await api.post("/events", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      alert("Event Created Successfully!");
      console.log(res.data);

    } catch (err) {
      console.error(err);
      alert("Error creating event");
    }
  };

  return (
    <div className="min-h-screen pb-10">

      {/* NAVBAR */}
      <nav className="bg-white/10 flex justify-between items-center py-4 px-10">
        <h1 className="text-[26px] text-brand font-semibold">Create New Event</h1>

        <div className="flex gap-4 items-center">
          <Link
            to="/organiser-dashboard"
            className="bg-brand text-darkBg px-4 py-2 rounded-md font-semibold hover:bg-brandHover transition"
          >
            Back
          </Link>

          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="Profile"
            className="w-11 rounded-full"
          />
        </div>
      </nav>

      {/* FORM */}
      <div className="w-[70%] mx-auto mt-10">
        <form
          onSubmit={handleSubmit}
          className="bg-white/10 p-8 rounded-2xl shadow-[0_5px_20px_rgba(0,0,0,0.3)]"
        >
          <h2 className="text-brand text-2xl mb-2 font-semibold">
            Create Event
          </h2>

          <p className="text-[#bcd4e6] mb-6">
            Fill the details below to publish your event.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* EVENT NAME */}
            <div className="flex flex-col">
              <label className="text-[#b3c7d6] font-semibold">Event Name</label>
              <input
                type="text"
                name="eventName"
                value={formData.eventName}
                onChange={handleChange}
                required
                className="mt-1.5 p-3 rounded-md bg-white/10 text-white"
              />
            </div>

            {/* CATEGORY */}
            <div className="flex flex-col">
              <label className="text-[#b3c7d6] font-semibold">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleChange}
                required
                className="mt-1.5 p-3 rounded-md bg-white/10 text-white"
              >
                <option value="">Select category</option>
                <option>Technical</option>
                <option>Cultural</option>
                <option>Sports</option>
                <option>Workshop</option>
              </select>
            </div>

            {/* DATE */}
            <div className="flex flex-col">
              <label className="text-[#b3c7d6] font-semibold">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-1.5 p-3 rounded-md bg-white/10 text-white"
              />
            </div>

            {/* TIME */}
            <div className="flex flex-col">
              <label className="text-[#b3c7d6] font-semibold">Time</label>
              <input
                type="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="mt-1.5 p-3 rounded-md bg-white/10 text-white"
              />
            </div>

            {/* VENUE */}
            <div className="flex flex-col md:col-span-2">
              <label className="text-[#b3c7d6] font-semibold">Venue</label>
              <input
                type="text"
                name="venue"
                value={formData.venue}
                onChange={handleChange}
                required
                className="mt-1.5 p-3 rounded-md bg-white/10 text-white"
              />
            </div>

            {/* BANNER */}
            <div className="flex flex-col md:col-span-2">
              <label className="text-[#b3c7d6] font-semibold">Event Banner</label>

              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="mt-1.5 p-3 rounded-md bg-white/10 text-white"
              />

              {error && (
                <small className="text-red-400 mt-1">{error}</small>
              )}

              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-3 rounded-md max-h-[250px] object-cover"
                />
              )}
            </div>

            {/* DESCRIPTION */}
            <div className="flex flex-col md:col-span-2">
              <label className="text-[#b3c7d6] font-semibold">Description</label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
                className="mt-1.5 p-3 rounded-md bg-white/10 text-white h-28 resize-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="mt-6 px-6 py-3 bg-brand text-darkBg rounded-md font-semibold hover:bg-brandHover transition"
          >
            Create Event
          </button>

        </form>
      </div>
    </div>
  );
}