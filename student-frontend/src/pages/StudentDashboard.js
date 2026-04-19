import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

const API = process.env.REACT_APP_API_URL;

function StudentDashboard() {
  const [data, setData] = useState(null);
  const [marks, setMarks] = useState([]);
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
      } catch {}
    };

    fetchProfile();
    fetchMarks();
  }, [navigate]);

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100">
      <Navbar role="student" />

      <div className="p-6 flex flex-col items-center gap-6">

        {/* PROFILE CARD */}
        <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            My Profile
          </h2>

          <div className="space-y-2 text-gray-600">
            <p><b>Email:</b> {data.email}</p>
            <p><b>Roll Number:</b> {data.roll_number}</p>
            <p><b>Department:</b> {data.department}</p>
            <p><b>Year:</b> {data.year}</p>
          </div>
        </div>

        {/* MARKS CARD */}
        <div className="bg-white/70 backdrop-blur-md shadow-xl rounded-2xl p-6 w-full max-w-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">
            My Marks
          </h2>

          {marks.length === 0 ? (
            <p className="text-gray-500">No marks available</p>
          ) : (
            <ul className="space-y-2">
              {marks.map((m, i) => (
                <li
                  key={i}
                  className="flex justify-between bg-white p-2 rounded-lg shadow-sm"
                >
                  <span>{m.subject}</span>
                  <span className="font-semibold text-blue-500">
                    {m.score}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

      </div>
    </div>
  );
}

export default StudentDashboard;