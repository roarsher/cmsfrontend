// src/pages/admin/Notices.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const Notices = () => {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const fetchNotices = async () => {
    try {
      const res = await API.get("/admin/notices");
      setNotices(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchNotices();
  }, []);

  const createNotice = async (e) => {
    e.preventDefault();
    try {
      const res = await API.post("/admin/notices", { title, message });
      setNotices([res.data, ...notices]);
      setTitle("");
      setMessage("");
    } catch (err) {
      console.error(err);
    }
  };

  const deleteNotice = async (id) => {
    try {
      await API.delete(`/admin/notices/${id}`);
      setNotices((prev) => prev.filter((n) => n._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Notices</h1>

      {/* Create Notice */}
      <form
        onSubmit={createNotice}
        className="bg-white p-4 rounded shadow mb-6 space-y-3"
      >
        <input
          type="text"
          placeholder="Notice Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          placeholder="Notice Message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full border p-2 rounded"
          required
        />
        <button className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Post Notice
        </button>
      </form>

      {/* Notice List */}
      <div className="bg-white rounded-lg shadow p-4">
        {notices.length === 0 ? (
          <p>No notices available</p>
        ) : (
          <ul className="space-y-4">
            {notices.map((n) => (
              <li
                key={n._id}
                className="border-b pb-2 flex justify-between items-start"
              >
                <div>
                  <h3 className="font-semibold">{n.title}</h3>
                  <p className="text-sm text-gray-600">{n.message}</p>
                </div>
                <button
                  onClick={() => deleteNotice(n._id)}
                  className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default Notices;
