// src/pages/admin/ManageStudents.jsx
import React, { useEffect, useState } from "react";
import API from "../../api/axios";

const ManageStudents = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchStudents = async () => {
    try {
      const res = await API.get("/admin/students");
      setStudents(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const deleteStudent = async (id) => {
    try {
      await API.delete(`/admin/students/${id}`);
      setStudents((prev) => prev.filter((s) => s._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">Manage Students</h1>

      <div className="bg-white rounded-lg shadow p-4">
        {students.length === 0 ? (
          <p>No students found</p>
        ) : (
          <ul className="space-y-3">
            {students.map((s) => (
              <li
                key={s._id}
                className="flex justify-between items-center border-b pb-2"
              >
                <span>
                  {s.user?.name} ({s.user?.email})
                </span>
                <button
                  onClick={() => deleteStudent(s._id)}
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

export default ManageStudents;
