import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from "recharts";

const API = process.env.REACT_APP_API_URL;

// Animation variants for smooth mounting
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 100 } },
};

const tabVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3 } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
};

// Chart colors
const COLORS = ["#3B82F6", "#8B5CF6", "#EC4899", "#10B981", "#F59E0B", "#EF4444"];

function StudentDashboard() {
  const [data, setData] = useState(null);
  const [marks, setMarks] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");
  const [semester, setSemester] = useState(1);
  const [cgpa, setCgpa] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${API}/student/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch {
        navigate("/");
      }
    };

    const fetchTimetable = async () => {
      try {
        const res = await axios.get(`${API}/student/timetable`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setTimetable(res.data);
      } catch {}
    };

    const fetchCGPA = async () => {
      try {
        const res = await axios.get(`${API}/student/cgpa`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCgpa(res.data.cgpa);
      } catch {}
    };

    fetchProfile();
    fetchTimetable();
    fetchCGPA();
  }, [navigate]);

  useEffect(() => {
    const fetchMarks = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${API}/student/marks/${semester}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setMarks(res.data);
      } catch (err) {
        console.log("Marks error:", err.response);
      }
    };

    fetchMarks();
  }, [semester]);

  if (!data)
    return (
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"
        />
      </div>
    );

  const total = marks.reduce((sum, m) => sum + (m.score || 0), 0);

  const sgpa = marks.length
    ? (
        marks.reduce((sum, m) => sum + (m.gp || 0), 0) /
        marks.length
      ).toFixed(2)
    : 0;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800">
      <Navbar role="student" />

      <div className="flex max-w-7xl mx-auto pt-6 px-4 gap-6">
        {/* SIDEBAR */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="w-64 bg-white shadow-md rounded-2xl p-6 h-fit sticky top-24 border border-gray-100"
        >
          <div className="flex items-center justify-center gap-2 mb-8">
            <span className="text-2xl">🎓</span>
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
              IILM Portal
            </h2>
          </div>

          <div className="flex flex-col gap-2">
            {[
              { id: "profile", label: "My Profile", icon: "👤" },
              { id: "marks", label: "Marksheet", icon: "📊" },
              { id: "timetable", label: "Timetable", icon: "📅" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 font-medium ${
                  activeTab === tab.id
                    ? "bg-blue-50 text-blue-700 shadow-sm border border-blue-100"
                    : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <span>{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>
        </motion.div>

        {/* MAIN CONTENT */}
        <div className="flex-1 pb-10">
          {/* DASHBOARD CARDS */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8"
          >
            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-200 rounded-2xl p-6 flex flex-col justify-between"
            >
              <p className="text-blue-100 font-medium text-sm tracking-wide uppercase">Overall CGPA</p>
              <h2 className="text-4xl font-extrabold mt-2">{cgpa}</h2>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-200 rounded-2xl p-6 flex flex-col justify-between"
            >
              <p className="text-purple-100 font-medium text-sm tracking-wide uppercase">Subjects Enrolled</p>
              <h2 className="text-4xl font-extrabold mt-2">{marks.length}</h2>
            </motion.div>

            <motion.div
              variants={itemVariants}
              whileHover={{ y: -5 }}
              className="bg-gradient-to-br from-pink-500 to-rose-500 text-white shadow-lg shadow-pink-200 rounded-2xl p-6 flex flex-col justify-between"
            >
              <p className="text-pink-100 font-medium text-sm tracking-wide uppercase">Current Semester</p>
              <h2 className="text-4xl font-extrabold mt-2">{semester}</h2>
            </motion.div>
          </motion.div>

          {/* TAB CONTENT WITH ANIMATE PRESENCE */}
          <div className="relative">
            <AnimatePresence mode="wait">
              {/* PROFILE */}
              {activeTab === "profile" && (
                <motion.div
                  key="profile"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white shadow-sm border border-gray-100 rounded-2xl p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Student Profile</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-sm text-gray-500 font-medium mb-1">Email Address</p>
                      <p className="text-lg font-semibold text-gray-900">{data.email}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-sm text-gray-500 font-medium mb-1">Roll Number</p>
                      <p className="text-lg font-semibold text-gray-900">{data.roll_number}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-sm text-gray-500 font-medium mb-1">Department</p>
                      <p className="text-lg font-semibold text-gray-900">{data.department}</p>
                    </div>
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                      <p className="text-sm text-gray-500 font-medium mb-1">Year of Study</p>
                      <p className="text-lg font-semibold text-gray-900">{data.year}</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {/* MARKS */}
              {activeTab === "marks" && (
                <motion.div
                  key="marks"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white shadow-sm border border-gray-100 rounded-2xl p-8"
                >
                  <div className="flex justify-between items-end mb-8 border-b pb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-800">Academic Performance</h2>
                      <p className="text-gray-500 mt-1">View your marks and grades per semester</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <label className="text-sm font-medium text-gray-600">Select Term:</label>
                      <select
                        value={semester}
                        onChange={(e) => setSemester(Number(e.target.value))}
                        className="border border-gray-300 bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                      >
                        <option value={1}>Semester 1</option>
                        <option value={2}>Semester 2</option>
                      </select>
                    </div>
                  </div>

                  <div className="overflow-hidden rounded-xl border border-gray-200 mb-8">
                    <table className="w-full text-left bg-white">
                      <thead className="bg-slate-50 text-slate-600 font-semibold text-sm uppercase tracking-wider">
                        <tr>
                          <th className="p-4 border-b">Subject</th>
                          <th className="p-4 border-b text-center">Marks</th>
                          <th className="p-4 border-b text-center">Grade</th>
                          <th className="p-4 border-b text-center">Grade Point</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {marks.map((m, i) => (
                          <motion.tr
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.05 }}
                            key={i}
                            className="hover:bg-blue-50/50 transition-colors even:bg-slate-50/50"
                          >
                            <td className="p-4 font-medium text-gray-800">{m.subject}</td>
                            <td className="p-4 text-center text-gray-600">{m.score}</td>
                            <td className="p-4 text-center">
                              <span className="px-3 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                                {m.grade}
                              </span>
                            </td>
                            <td className="p-4 text-center font-semibold text-gray-700">{m.gp}</td>
                          </motion.tr>
                        ))}
                        {marks.length === 0 && (
                          <tr>
                            <td colSpan="4" className="p-8 text-center text-gray-400">
                              No marks available for this semester.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end gap-6 p-4 bg-slate-50 rounded-xl border border-slate-100 mb-8">
                    <div className="text-center">
                      <p className="text-sm text-gray-500">Total Marks</p>
                      <p className="text-xl font-bold text-gray-800">{total}</p>
                    </div>
                    <div className="w-px bg-gray-300"></div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">SGPA</p>
                      <p className="text-xl font-bold text-blue-600">{sgpa}</p>
                    </div>
                    <div className="w-px bg-gray-300"></div>
                    <div className="text-center">
                      <p className="text-sm text-gray-500">CGPA</p>
                      <p className="text-xl font-bold text-purple-600">{cgpa}</p>
                    </div>
                  </div>

                  {/* CHART */}
                  {marks.length > 0 && (
                    <div className="pt-4 border-t border-gray-100">
                      <h3 className="text-lg font-semibold text-gray-700 mb-6 text-center">Score Distribution</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={marks} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <XAxis dataKey="subject" tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: '#6B7280', fontSize: 12 }} axisLine={false} tickLine={false} />
                          <Tooltip
                            cursor={{ fill: '#F3F4F6' }}
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                          />
                          <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                            {marks.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Bar>
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  )}
                </motion.div>
              )}

              {/* TIMETABLE */}
              {activeTab === "timetable" && (
                <motion.div
                  key="timetable"
                  variants={tabVariants}
                  initial="hidden"
                  animate="visible"
                  exit="exit"
                  className="bg-white shadow-sm border border-gray-100 rounded-2xl p-8"
                >
                  <h2 className="text-2xl font-bold text-gray-800 mb-6 border-b pb-4">Weekly Timetable</h2>

                  <div className="overflow-x-auto rounded-xl border border-gray-200">
                    <table className="w-full text-center bg-white min-w-max">
                      <thead className="bg-slate-50 text-slate-600 text-sm uppercase tracking-wider">
                        <tr>
                          <th className="p-4 border-b font-bold text-left">Day</th>
                          {[1, 2, 3, 4, 5, 6, 7].map((slot) => (
                            <th key={slot} className="p-4 border-b font-semibold">Slot {slot}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"].map((day, idx) => (
                          <motion.tr
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.05 }}
                            key={day}
                            className="hover:bg-slate-50 transition-colors"
                          >
                            <td className="p-4 font-bold text-gray-700 text-left bg-slate-50/50">{day}</td>
                            {[1, 2, 3, 4, 5, 6, 7].map((slot) => {
                              const entry = timetable.find(
                                (t) => t.day === day && t.slot === slot
                              );
                              return (
                                <td key={slot} className="p-4">
                                  {entry ? (
                                    <span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded-lg text-sm font-medium border border-indigo-100 inline-block w-full">
                                      {entry.subject}
                                    </span>
                                  ) : (
                                    <span className="text-gray-300">-</span>
                                  )}
                                </td>
                              );
                            })}
                          </motion.tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;