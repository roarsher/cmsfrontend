 // src/pages/public/Contact.jsx
import React from "react";
import Bg from "../../components/layout/Bg";
import { FaMapMarkerAlt, FaEnvelope, FaPhoneAlt } from "react-icons/fa";
import DeveloperCard from "../../components/cards/DeveloperCard";
import ContactForm from "../../components/forms/ContactForm";

// Developer Images
import riteshImg from "../../assets/rituatts.jpeg";
import abhishekImg from "../../assets/abhishek.jpeg";
import niranjanImg from "../../assets/niranjan.png";
import pawanImg from "../../assets/pawan.jpeg";

function Contact() {
  return (
    <Bg>
      {/* HEADER */}
      <div className="text-center mt-12 mb-14 px-4">
        <h1 className="text-4xl font-bold text-yellow-50">Contact Us</h1>
        <p className="text-richblack-200 max-w-2xl mx-auto mt-2">
          College & Developer contact information
        </p>
      </div>

      {/* MAIN GRID */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 px-4">
        {/* COLLEGE INFO */}
        <div className="bg-richblack-900/90 border border-richblack-700 rounded-2xl p-6 space-y-4">
          <h2 className="text-2xl font-semibold text-yellow-50">College Contact</h2>

          <p className="flex gap-3 text-richblack-200 text-sm">
            <FaMapMarkerAlt className="text-yellow-50" />
            Bhagalpur College of Engineering, Bhagalpur, Bihar
          </p>

          <p className="flex gap-3 text-richblack-200 text-sm">
            <FaEnvelope className="text-yellow-50" />
            info@bcebhagalpur.ac.in
          </p>

          <p className="flex gap-3 text-richblack-200 text-sm">
            <FaPhoneAlt className="text-yellow-50" />
            +91 00000 00000
          </p>

          {/* GOOGLE MAP */}
          <iframe
            title="BCE Map"
            src="https://www.google.com/maps?q=Bhagalpur%20College%20of%20Engineering&output=embed"
            className="w-full h-52 rounded-xl border border-richblack-700"
            loading="lazy"
          ></iframe>
        </div>

        {/* CONTACT FORM */}
        <ContactForm />
      </div>

      {/* DEVELOPERS */}
      <div className="max-w-6xl mx-auto mt-16 px-4">
        <h2 className="text-3xl font-semibold text-yellow-50 mb-6">
          Project Developers
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <DeveloperCard
            name="Ritesh Kumar"
            role="Frontend Developer"
            image={riteshImg}
            email="ritesh@example.com"
            linkedin="https://linkedin.com"
            twitter="https://twitter.com"
          />
          <DeveloperCard
            name="Abhishek Kumar"
            role="Frontend Developer"
            image={abhishekImg}
            email="abhishek@example.com"
            linkedin="https://linkedin.com"
            twitter="https://twitter.com"
          />
          <DeveloperCard
            name="Pawan Kumar"
            role="Frontend Developer"
            image={pawanImg}
            email="pawan@example.com"
            linkedin="https://linkedin.com"
            twitter="https://twitter.com"
          />
          <DeveloperCard
            name="Niranjan Kumar"
            role="Frontend Developer"
            image={niranjanImg}
            email="niranjan@example.com"
            linkedin="https://linkedin.com"
            twitter="https://twitter.com"
          />
        </div>
      </div>

      <p className="text-center text-richblack-400 text-sm mt-16 mb-6">
        © 2026 College ERP System | Final Year Project
      </p>
    </Bg>
  );
}

export default Contact;
