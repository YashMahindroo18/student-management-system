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

  const [markForm, setMarkForm] = useState({
    student_email: "",
    subject: "",
    score: "",
  });

  // 🔍 SEARCH STATES
  const [search, setSearch] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);

  // 🟣 Timetable
  const days = ["Monday","Tuesday","Wednesday","Thursday","Friday"];
  const slots = [1,2,3,4,5,6,7];
  const [timetableData, setTimetableData] = useState({});

  const navigate = useNavigate();

  // 🔹 Fetch students
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

  // 🔍 FILTER LOGIC
  useEffect(() => {
    if (!search) {
      setFilteredStudents([]);
      return;
    }

    const filtered = students.filter(s =>
      s.email.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredStudents(filtered);
  }, [search, students]);

  // 🔹 Create student
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

  // 🔹 Add marks
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

      setSearch("");

    } catch (err) {
      alert(err.response?.data?.detail || "Error adding marks");
    }
  };

  // 🔹 Timetable handlers
  const handleChange = (day, slot, value) => {
    setTimetableData(prev => ({
      ...prev,
      [`${day}-${slot}`]: value
    }));
  };

  const handleSaveTimetable = async () => {
    try {
      const token = localStorage.getItem("token");

      for (let day of days) {
        for (let slot of slots) {
          const subject = timetableData[`${day}-${slot}`];
          if (!subject) continue;

          await axios.post(`${API}/admin/timetable`, {
            year: 2,
            section: "A",
            day,
            slot,
            subject
          }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
        }
      }

      alert("Timetable saved!");
    } catch {
      alert("Error saving timetable");
    }
  };

  const handleClearTimetable = async () => {
    try {
      const token = localStorage.getItem("token");

      await axios.delete(`${API}/admin/timetable`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      alert("Timetable cleared");
      setTimetableData({});
    } catch {
      alert("Error clearing timetable");
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 min-h-screen">
      <Navbar role="admin" />

      <div className="p-6 max-w-5xl mx-auto space-y-6">

        {/* CREATE STUDENT */}
        <div className="bg-white/70 backdrop-blur-md p-4 rounded-xl shadow">
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

        {/* ADD MARKS (UPDATED 🔥) */}
        <div className="bg-white/70 backdrop-blur-md p-4 rounded-xl shadow">
          <h2 className="font-bold mb-3">Add Marks</h2>

          <div className="grid grid-cols-3 gap-3">

            {/* 🔍 SEARCH INPUT */}
            <div className="relative">
              <input
                className="border p-2 rounded w-full"
                placeholder="Search student email"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />

              {filteredStudents.length > 0 && (
                <div className="absolute bg-white border w-full mt-1 max-h-40 overflow-y-auto shadow rounded z-10">
                  {filteredStudents.map((s, i) => (
                    <div
                      key={i}
                      className="p-2 hover:bg-gray-100 cursor-pointer"
                      onClick={() => {
                        setMarkForm({ ...markForm, student_email: s.email });
                        setSearch(s.email);
                        setFilteredStudents([]);
                      }}
                    >
                      {s.email}
                    </div>
                  ))}
                </div>
              )}
            </div>

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

        {/* TIMETABLE EDITOR */}
        <div className="bg-white/70 backdrop-blur-md p-4 rounded-xl shadow">
          <h2 className="font-bold mb-3">Timetable Editor</h2>

          <table className="w-full border text-center">
            <thead>
              <tr className="bg-purple-100">
                <th>Day</th>
                {slots.map(s => <th key={s}>Slot {s}</th>)}
              </tr>
            </thead>

            <tbody>
              {days.map(day => (
                <tr key={day}>
                  <td className="font-semibold bg-purple-50">{day}</td>

                  {slots.map(slot => (
                    <td key={slot}>
                      <input
                        className="border p-1 w-full rounded"
                        placeholder="Subject"
                        value={timetableData[`${day}-${slot}`] || ""}
                        onChange={(e) =>
                          handleChange(day, slot, e.target.value)
                        }
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex gap-3 mt-4">
            <button
              onClick={handleSaveTimetable}
              className="bg-green-500 text-white px-4 py-2 rounded"
            >
              Save Timetable
            </button>

            <button
              onClick={handleClearTimetable}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Clear
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;