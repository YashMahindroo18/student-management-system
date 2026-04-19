import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API = process.env.REACT_APP_API_URL;

function StudentDashboard() {
  const [data, setData] = useState(null);
  const [marks, setMarks] = useState([]);
  const [timetable, setTimetable] = useState([]);
  const [activeTab, setActiveTab] = useState("profile");

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
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setData(res.data);
      } catch {
        navigate("/");
      }
    };

    const fetchMarks = async () => {
      try {
        const res = await axios.get(`${API}/student/marks`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setMarks(res.data);
      } catch (err) {
        console.log("Marks error:", err.response);
      }
    };

    const fetchTimetable = async () => {
      try {
        const res = await axios.get(`${API}/student/timetable`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setTimetable(res.data);
      } catch (err) {
        console.log("Timetable error:", err.response);
      }
    };

    fetchProfile();
    fetchMarks();
    fetchTimetable();
  }, [navigate]);

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Navbar role="student" />

      <div className="p-6 flex flex-col items-center gap-6">

        {/* 🔹 TAB BUTTONS */}
        <div className="flex gap-4">
          <button
            onClick={() => setActiveTab("profile")}
            className={`px-4 py-2 rounded-full ${
              activeTab === "profile"
                ? "bg-blue-400 text-white"
                : "bg-white shadow"
            }`}
          >
            Profile
          </button>

          <button
            onClick={() => setActiveTab("marks")}
            className={`px-4 py-2 rounded-full ${
              activeTab === "marks"
                ? "bg-green-400 text-white"
                : "bg-white shadow"
            }`}
          >
            Marks
          </button>

          <button
            onClick={() => setActiveTab("timetable")}
            className={`px-4 py-2 rounded-full ${
              activeTab === "timetable"
                ? "bg-purple-400 text-white"
                : "bg-white shadow"
            }`}
          >
            Timetable
          </button>
        </div>

        {/* 🔹 CONTENT AREA */}
        <div className="w-full max-w-4xl">

          {/* PROFILE */}
          {activeTab === "profile" && (
            <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                My Profile
              </h2>

              <p><b>Email:</b> {data.email}</p>
              <p><b>Roll Number:</b> {data.roll_number}</p>
              <p><b>Department:</b> {data.department}</p>
              <p><b>Year:</b> {data.year}</p>
            </div>
          )}

          {/* MARKS */}
          {activeTab === "marks" && (
            <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-6">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                My Marks
              </h2>

              {marks.length === 0 ? (
                <p>No marks available</p>
              ) : (
                <ul className="space-y-2">
                  {marks.map((m, i) => (
                    <li
                      key={i}
                      className="flex justify-between bg-white p-2 rounded-lg shadow-sm"
                    >
                      <span>{m.subject || m.course_name}</span>
                      <span className="font-semibold text-green-500">
                        {m.score || m.grade}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {/* TIMETABLE */}
          {activeTab === "timetable" && (
            <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-6 overflow-x-auto">
              <h2 className="text-xl font-semibold mb-4 text-gray-700">
                Weekly Timetable
              </h2>

              <table className="w-full border text-center">
                <thead>
                  <tr className="bg-purple-100">
                    <th className="p-2">Day</th>
                    {[1,2,3,4,5,6,7].map(slot => (
                      <th key={slot} className="p-2">Slot {slot}</th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {["Monday","Tuesday","Wednesday","Thursday","Friday"].map(day => (
                    <tr key={day}>
                      <td className="font-semibold bg-purple-50">{day}</td>

                      {[1,2,3,4,5,6,7].map(slot => {
                        const entry = timetable.find(
                          t => t.day === day && t.slot === slot
                        );

                        return (
                          <td key={slot} className="p-2">
                            <div className="bg-white rounded-lg shadow-sm p-2">
                              {entry ? entry.subject : "-"}
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;