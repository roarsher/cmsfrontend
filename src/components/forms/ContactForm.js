import React, { useState } from "react";
import { toast } from "react-hot-toast";

const ContactForm = () => {
  const [data, setData] = useState({
    name: "",
    email: "",
    message: "",
  });

  const changeHandler = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const submitHandler = (e) => {
    e.preventDefault();

    if (!data.name || !data.email || !data.message) {
      toast.error("All fields are required");
      return;
    }

    toast.success("Message sent successfully 🚀");
    console.log(data);

    setData({ name: "", email: "", message: "" });
  };

  return (
    <form
      onSubmit={submitHandler}
      className="bg-richblack-900/90 border border-richblack-700 rounded-2xl p-6 space-y-4"
    >
      <h2 className="text-xl font-semibold text-yellow-50 mb-2">
        Send Us a Message
      </h2>

      <input
        type="text"
        name="name"
        placeholder="Your Name"
        value={data.name}
        onChange={changeHandler}
        className="w-full bg-richblack-800 p-3 rounded-lg text-white"
      />

      <input
        type="email"
        name="email"
        placeholder="Your Email"
        value={data.email}
        onChange={changeHandler}
        className="w-full bg-richblack-800 p-3 rounded-lg text-white"
      />

      <textarea
        name="message"
        placeholder="Your Message"
        rows="4"
        value={data.message}
        onChange={changeHandler}
        className="w-full bg-richblack-800 p-3 rounded-lg text-white resize-none"
      />

      <button className="w-full bg-yellow-50 text-richblack-900 py-2 rounded-lg font-semibold">
        Send Message
      </button>
    </form>
  );
};

export default ContactForm;
