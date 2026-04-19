import { useEffect, useState, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";

const API = process.env.REACT_APP_API_URL;

// Animation variants for smooth mounting
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

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

  // ✅ TIMETABLE STATES
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];
  const slots = [1, 2, 3, 4, 5, 6, 7];
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

  // 🔍 Filter students
  useEffect(() => {
    if (!search) {
      setFilteredStudents([]);
      return;
    }

    const filtered = students.filter((s) =>
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

      await axios.put(
        `${API}/admin/students/activate/${email}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

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

  // ✅ TIMETABLE FUNCTIONS
  const handleChange = (day, slot, value) => {
    setTimetableData((prev) => ({
      ...prev,
      [`${day}-${slot}`]: value,
    }));
  };

  const handleSaveTimetable = async () => {
    try {
      const token = localStorage.getItem("token");

      for (let day of days) {
        for (let slot of slots) {
          const subject = timetableData[`${day}-${slot}`];
          if (!subject) continue;

          await axios.post(
            `${API}/admin/timetable`,
            {
              year: 2,
              section: "A",
              day,
              slot,
              subject,
            },
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
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
          Authorization: `Bearer ${token}`,
        },
      });

      setTimetableData({});
      alert("Timetable cleared");
    } catch {
      alert("Error clearing timetable");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800 pb-12">
      <Navbar role="admin" />

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="p-6 max-w-7xl mx-auto space-y-8 mt-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* CREATE STUDENT */}
          <motion.div
            variants={itemVariants}
            className="bg-white shadow-sm border border-gray-100 rounded-2xl p-8"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
              <span>👤</span> Register New Student
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase tracking-wider">Email</label>
                <input
                  placeholder="student@iilm.edu"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase tracking-wider">Roll Number</label>
                <input
                  placeholder="e.g. 10234"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  value={form.roll_number}
                  onChange={(e) => setForm({ ...form, roll_number: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase tracking-wider">Department</label>
                <input
                  placeholder="e.g. CSE"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  value={form.department}
                  onChange={(e) => setForm({ ...form, department: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase tracking-wider">Year</label>
                <input
                  placeholder="1, 2, 3..."
                  type="number"
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                  value={form.year}
                  onChange={(e) => setForm({ ...form, year: e.target.value })}
                />
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreate}
              className="mt-6 w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-blue-200 transition-all"
            >
              Create Student Account
            </motion.button>
          </motion.div>

          {/* ADD MARKS */}
          <motion.div
            variants={itemVariants}
            className="bg-white shadow-sm border border-gray-100 rounded-2xl p-8"
          >
            <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
              <span>📊</span> Add Subject Marks
            </h2>

            <div className="space-y-4">
              <div className="relative">
                <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase tracking-wider">Search Student</label>
                <input
                  placeholder="Start typing email..."
                  className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />

                <AnimatePresence>
                  {filteredStudents.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute left-0 right-0 bg-white border border-gray-100 mt-2 max-h-48 overflow-y-auto shadow-xl rounded-xl z-50 overflow-hidden"
                    >
                      {filteredStudents.map((s, i) => (
                        <div
                          key={i}
                          className="px-4 py-3 hover:bg-slate-50 border-b border-gray-50 last:border-0 cursor-pointer text-sm font-medium text-gray-700 transition-colors"
                          onClick={() => {
                            setMarkForm({ ...markForm, student_email: s.email });
                            setSearch(s.email);
                            setFilteredStudents([]);
                          }}
                        >
                          {s.email}
                        </div>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase tracking-wider">Subject Code/Name</label>
                  <input
                    placeholder="e.g. CS101"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
                    value={markForm.subject}
                    onChange={(e) => setMarkForm({ ...markForm, subject: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-500 mb-1 ml-1 uppercase tracking-wider">Marks Scored</label>
                  <input
                    placeholder="Out of 100"
                    type="number"
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 transition-all text-sm"
                    value={markForm.score}
                    onChange={(e) => setMarkForm({ ...markForm, score: e.target.value })}
                  />
                </div>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleAddMarks}
              className="mt-6 w-full bg-green-500 hover:bg-green-600 text-white font-semibold px-4 py-2.5 rounded-xl shadow-md shadow-green-200 transition-all"
            >
              Submit Marks
            </motion.button>
          </motion.div>
        </div>

        {/* ✅ TIMETABLE EDITOR */}
        <motion.div
          variants={itemVariants}
          className="bg-white shadow-sm border border-gray-100 rounded-2xl p-8 overflow-hidden"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 border-b pb-4 gap-4">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <span>📅</span> Master Timetable Editor
            </h2>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleSaveTimetable}
                className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-5 py-2 rounded-lg shadow-sm transition-all text-sm"
              >
                Save Schedule
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleClearTimetable}
                className="bg-red-50 hover:bg-red-100 text-red-600 font-medium px-5 py-2 rounded-lg transition-all text-sm"
              >
                Clear All
              </motion.button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-center bg-white min-w-max">
              <thead className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
                <tr>
                  <th className="p-4 border-b font-bold text-left">Day</th>
                  {slots.map((s) => (
                    <th key={s} className="p-4 border-b font-semibold">Slot {s}</th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {days.map((day) => (
                  <tr key={day} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-bold text-gray-700 text-left bg-slate-50/30 w-32">
                      {day}
                    </td>
                    {slots.map((slot) => (
                      <td key={slot} className="p-2 border-l border-gray-50">
                        <input
                          placeholder="Subject..."
                          className="w-full px-3 py-2 bg-transparent text-center font-medium text-gray-700 focus:bg-white focus:ring-2 focus:ring-indigo-400 rounded-lg outline-none transition-all text-sm placeholder-gray-300"
                          value={timetableData[`${day}-${slot}`] || ""}
                          onChange={(e) => handleChange(day, slot, e.target.value)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>

        {/* STUDENT LIST */}
        <motion.div
          variants={itemVariants}
          className="bg-white shadow-sm border border-gray-100 rounded-2xl p-8"
        >
          <h2 className="text-xl font-bold text-gray-800 mb-6 border-b pb-4 flex items-center gap-2">
            <span>🎓</span> Enrolled Students Directory
          </h2>

          <div className="overflow-x-auto rounded-xl border border-gray-200">
            <table className="w-full text-left bg-white min-w-max">
              <thead className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
                <tr>
                  <th className="p-4 border-b font-semibold">Email Address</th>
                  <th className="p-4 border-b font-semibold">Roll No.</th>
                  <th className="p-4 border-b font-semibold">Department</th>
                  <th className="p-4 border-b font-semibold text-center">Year</th>
                  <th className="p-4 border-b font-semibold text-center">Account Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {students.map((s, i) => (
                  <tr key={i} className="hover:bg-slate-50/80 transition-colors even:bg-slate-50/30">
                    <td className="p-4 font-medium text-gray-800">{s.email}</td>
                    <td className="p-4 text-gray-600">{s.roll_number}</td>
                    <td className="p-4 text-gray-600">{s.department}</td>
                    <td className="p-4 text-center text-gray-600">{s.year}</td>
                    <td className="p-4 text-center">
                      {s.is_active ? (
                        <span className="px-3 py-1.5 rounded-full text-xs font-bold bg-green-100 text-green-700 border border-green-200">
                          Active Account
                        </span>
                      ) : (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleActivateStudent(s.email)}
                          className="bg-blue-100 hover:bg-blue-200 text-blue-700 border border-blue-200 font-semibold px-4 py-1.5 rounded-full text-xs transition-all"
                        >
                          Activate Now
                        </motion.button>
                      )}
                    </td>
                  </tr>
                ))}
                {students.length === 0 && (
                  <tr>
                    <td colSpan="5" className="p-8 text-center text-gray-400">
                      No students found. Create one above.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

export default AdminDashboard;