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

  const [search, setSearch] = useState("");
  const [filteredStudents, setFilteredStudents] = useState([]);

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

  // 🔍 Filter students
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

  // 🔹 Activate student
  const handleActivateStudent = async (email) => {
    try {
      const token = localStorage.getItem("token");

      await axios.put(`${API}/admin/students/activate/${email}`, {}, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("Student activated!");
      fetchStudents();
    } catch {
      alert("Error activating student");
    }
  };

  // 🔹 Add marks
  const handleAddMarks = async () => {
    try {
      if (!markForm.student_email) {
        alert("Please select a student");
        return;
      }

      if (!markForm.subject || !markForm.score) {
        alert("Fill all fields");
        return;
      }

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
      console.log(err.response);
      alert(err.response?.data?.detail || "Error adding marks");
    }
  };

  return (
    <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 min-h-screen">
      <Navbar role="admin" />

      <div className="p-6 max-w-5xl mx-auto space-y-6">

        {/* CREATE STUDENT */}
        <div className="bg-white/70 p-4 rounded-xl shadow">
          <h2 className="font-bold mb-3">Create Student</h2>

          <div className="grid grid-cols-2 gap-3">
            <input
              placeholder="Email"
              className="border p-2 rounded"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />

            <input
              placeholder="Roll Number"
              className="border p-2 rounded"
              value={form.roll_number}
              onChange={(e) => setForm({ ...form, roll_number: e.target.value })}
            />

            <input
              placeholder="Department"
              className="border p-2 rounded"
              value={form.department}
              onChange={(e) => setForm({ ...form, department: e.target.value })}
            />

            <input
              placeholder="Year"
              className="border p-2 rounded"
              value={form.year}
              onChange={(e) => setForm({ ...form, year: e.target.value })}
            />
          </div>

          <button
            onClick={handleCreate}
            className="mt-3 bg-blue-500 text-white px-4 py-2 rounded"
          >
            Create Student
          </button>
        </div>

        {/* ADD MARKS */}
        <div className="bg-white/70 p-4 rounded-xl shadow">
          <h2 className="font-bold mb-3">Add Marks</h2>

          <div className="grid grid-cols-3 gap-3">

            {/* SEARCH */}
            <div className="relative">
              <input
                placeholder="Search student email"
                className="border p-2 w-full rounded"
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
              placeholder="Subject"
              className="border p-2 rounded"
              value={markForm.subject}
              onChange={(e) =>
                setMarkForm({ ...markForm, subject: e.target.value })
              }
            />

            <input
              placeholder="Score"
              className="border p-2 rounded"
              value={markForm.score}
              onChange={(e) =>
                setMarkForm({ ...markForm, score: e.target.value })
              }
            />
          </div>

          <p className="text-sm text-gray-600 mt-2">
            Selected: {markForm.student_email || "None"}
          </p>

          <button
            onClick={handleAddMarks}
            className="mt-3 bg-green-500 text-white px-4 py-2 rounded"
          >
            Add Marks
          </button>
        </div>

        {/* STUDENT LIST */}
        <div className="bg-white/70 p-4 rounded-xl shadow">
          <h2 className="font-bold mb-3">Students</h2>

          <table className="w-full border text-center">
            <thead>
              <tr className="bg-gray-200">
                <th>Email</th>
                <th>Roll</th>
                <th>Dept</th>
                <th>Year</th>
                <th>Status</th>
              </tr>
            </thead>

            <tbody>
              {students.map((s, i) => (
                <tr key={i} className="border-t">
                  <td>{s.email}</td>
                  <td>{s.roll_number}</td>
                  <td>{s.department}</td>
                  <td>{s.year}</td>
                  <td>
                    {s.is_active ? (
                      <span className="text-green-600 font-semibold">Active</span>
                    ) : (
                      <button
                        onClick={() => handleActivateStudent(s.email)}
                        className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
                      >
                        Activate
                      </button>
                    )}
                  </td>
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