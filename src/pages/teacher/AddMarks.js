import React, { useState } from "react";
import API from "../../api/axios";
import { toast } from "react-hot-toast";

const AddMarks = () => {
  const [form, setForm] = useState({ studentId: "", subject: "", obtained: "", total: "" });
  const [loading, setLoading] = useState(false);

  const changeHandler = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await API.post("/marks", form);
      toast.success("Marks added successfully");
      setForm({ studentId: "", subject: "", obtained: "", total: "" });
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to add marks");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="text-black max-w-md">
      <h1 className="text-3xl font-bold mb-4 ">Add Marks</h1>
      <form onSubmit={submitHandler} className="space-y-4">
        <input type="text" name="studentId" value={form.studentId} onChange={changeHandler} placeholder="Student ID" className="w-full p-2 rounded bg-richblack-800" required />
        <input type="text" name="subject" value={form.subject} onChange={changeHandler} placeholder="Subject" className="w-full p-2 rounded bg-richblack-800" required />
        <input type="number" name="obtained" value={form.obtained} onChange={changeHandler} placeholder="Obtained Marks" className="w-full p-2 rounded bg-richblack-800" required />
        <input type="number" name="total" value={form.total} onChange={changeHandler} placeholder="Total Marks" className="w-full p-2 rounded bg-richblack-800" required />
        <button type="submit" disabled={loading} className="bg-yellow-500 px-4 py-2 rounded w-full">{loading ? "Adding..." : "Add Marks"}</button>
      </form>
    </div>
  );
};

export default AddMarks;
