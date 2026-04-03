// src/pages/admin/ManageTeachers.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const ManageTeachers = () => {
  const [teachers, setTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchTeachers = async () => {
    try {
      const res = await API.get("/admin/teachers");
      setTeachers(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  const deleteTeacher = async (id) => {
    try {
      await API.delete(`/admin/teachers/${id}`);
      setTeachers((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Teachers</h1>

      <div className="bg-white rounded-lg shadow p-4">
        {teachers.length === 0 ? (
          <p>No teachers found</p>
        ) : (
          <ul className="space-y-3">
            {teachers.map((t) => (
              <li
                key={t._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>
                  {t.user?.name} ({t.user?.email})
                </span>
                <button
                  onClick={() => deleteTeacher(t._id)}
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

export default ManageTeachers;
