import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API = process.env.REACT_APP_API_URL;

function AdminDashboard() {
  const [students, setStudents] = useState([]);

  const [form, setForm] = useState({
    email: "",
    roll_number: "",
    department: "",
    year: "",
  });

  // 🟢 NEW MARKS STATE
  const [markForm, setMarkForm] = useState({
    student_email: "",
    subject: "",
    score: "",
  });

  const navigate = useNavigate();

  const fetchStudents = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.get(`${API}/admin/students`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setStudents(res.data);
    } catch {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    fetchStudents();
  }, [fetchStudents, navigate]);

  // 🟢 CREATE STUDENT
  const handleCreate = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API}/admin/students`,
        {
          ...form,
          year: Number(form.year),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setForm({
        email: "",
        roll_number: "",
        department: "",
        year: "",
      });

      fetchStudents();
    } catch (err) {
      alert(err.response?.data?.detail || "Error");
    }
  };

  // 🟢 ADD MARKS FUNCTION
  const handleAddMarks = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.post(
        `${API}/admin/marks`,
        {
          ...markForm,
          score: Number(markForm.score),
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Marks added!");

      setMarkForm({
        student_email: "",
        subject: "",
        score: "",
      });

    } catch (err) {
      alert(err.response?.data?.detail || "Error adding marks");
    }
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar role="admin" />

      <div className="p-6 max-w-4xl mx-auto">

        {/* CREATE STUDENT */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="font-bold mb-3">Create Student</h2>

          <div className="grid grid-cols-2 gap-3">
            <input className="border p-2 rounded" placeholder="Email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />

            <input className="border p-2 rounded" placeholder="Roll Number"
              value={form.roll_number}
              onChange={(e) => setForm({ ...form, roll_number: e.target.value })} />

            <input className="border p-2 rounded" placeholder="Department"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })} />

            <input className="border p-2 rounded" placeholder="Year"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })} />
          </div>

          <button
            onClick={handleCreate}
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Student
          </button>
        </div>

        {/* 🟢 ADD MARKS UI */}
        <div className="bg-white p-4 rounded shadow mb-6">
          <h2 className="font-bold mb-3">Add Marks</h2>

          <div className="grid grid-cols-3 gap-3">

            {/* Student dropdown */}
            <select
              className="border p-2 rounded"
              value={markForm.student_email}
              onChange={(e) =>
                setMarkForm({ ...markForm, student_email: e.target.value })
              }
            >
              <option value="">Select Student</option>
              {students.map((s, i) => (
                <option key={i} value={s.email}>
                  {s.email}
                </option>
              ))}
            </select>

            <input
              className="border p-2 rounded"
              placeholder="Subject"
              value={markForm.subject}
              onChange={(e) =>
                setMarkForm({ ...markForm, subject: e.target.value })
              }
            />

            <input
              className="border p-2 rounded"
              placeholder="Score"
              value={markForm.score}
              onChange={(e) =>
                setMarkForm({ ...markForm, score: e.target.value })
              }
            />
          </div>

          <button
            onClick={handleAddMarks}
            className="mt-3 bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Marks
          </button>
        </div>

        {/* STUDENTS LIST */}
        <div className="bg-white p-4 rounded shadow">
          <h2 className="font-bold mb-3">Students</h2>

          <table className="w-full border">
            <thead>
              <tr className="bg-gray-200">
                <th>Email</th>
                <th>Roll</th>
                <th>Dept</th>
                <th>Year</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s, i) => (
                <tr key={i} className="text-center border-t">
                  <td>{s.email}</td>
                  <td>{s.roll_number}</td>
                  <td>{s.department}</td>
                  <td>{s.year}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;