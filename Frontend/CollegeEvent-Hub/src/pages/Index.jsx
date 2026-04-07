import { Link } from 'react-router-dom';

export default function Index() {
  return (
    <div className="min-h-screen">
      <nav className="bg-white/10 backdrop-blur-md flex justify-between items-center py-4 px-10">
        <h1 className="text-2xl text-brand font-semibold">EventSphere</h1>
        <div>
          <Link to="/login" className="text-darkBg bg-brand px-4 py-2 rounded-md font-semibold hover:bg-brandHover transition">Login</Link>
          <Link to="/register" className="ml-3 text-darkBg bg-brand px-4 py-2 rounded-md font-semibold hover:bg-brandHover transition">Register</Link>
        </div>
      </nav>

      <section className="text-center py-20 px-5">
        <h2 className="text-[38px] text-brand mb-2 font-semibold">Organize & Manage Events Seamlessly</h2>
        <p className="text-[#b3c7d6] mb-6">Join EventSphere today and take your event experience online.</p>
        <Link to="/login" className="text-darkBg bg-brand px-6 py-3 rounded-md font-semibold hover:bg-brandHover transition">Get Started</Link>
      </section>

      <section className="text-center py-16 px-10 md:px-36.75">
        <h2 className="text-2xl text-brand mb-4 font-semibold">About EventSphere</h2>
        <p className="text-[#b3c7d6] mb-4">
          EventSphere is an all-in-one platform designed to make event management simple and efficient.
          Whether you're hosting a college fest, community gathering, EventSphere provides the tools to plan, promote, and
          manage every aspect of your event online.
        </p>
        <p className="text-[#b3c7d6]">
          Our goal is to connect organizers and participants effortlessly while providing a smooth registration
          process and real-time updates for every event.
        </p>
      </section>

      <section className="text-center py-16 px-10">
        <h2 className="text-2xl text-brand mb-10 font-semibold">Previous Events</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 justify-items-center">
          {[
            { img: "https://images.unsplash.com/photo-1556761175-4b46a572b786", title: "TechFusion 2024", college: "MIT College, Pune" },
            { img: "https://images.unsplash.com/photo-1503428593586-e225b39bddfe", title: "Rhythm 2024", college: "DAVV University, Indore" },
            { img: "https://images.unsplash.com/photo-1485217988980-11786ced9454", title: "Sportiva 2025", college: "NIT Bhopal" },
            { img: "https://images.unsplash.com/photo-1504384308090-c894fdcc538d", title: "HackQuest 2025", college: "IIT Delhi" }
          ].map((event, index) => (
            <div key={index} className="bg-white/5 rounded-xl shadow-lg overflow-hidden w-65 hover:-translate-y-1 hover:shadow-xl transition duration-300">
              <img src={event.img} alt={event.title} className="w-full h-45 object-cover" />
              <div className="p-4">
                <h3 className="text-xl text-[#b3c7d6] mb-1 font-semibold">{event.title}</h3>
                <p className="text-[#b3c7d6]"><strong>College:</strong> {event.college}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="text-center mt-12 p-5 text-[#b3c7d6]">
        <div className="space-y-1">
          <p>© 2025 EventSphere. All rights reserved.</p>
          <p>📞 <strong>Contact Us:</strong> +91 98765 43210 | 📧 <strong>Email:</strong> support@eventsphere.com</p>
          <p>📍 Address: 45, Innovation Tower, Indore, Madhya Pradesh, India</p>
        </div>
      </footer>
    </div>
  );
}