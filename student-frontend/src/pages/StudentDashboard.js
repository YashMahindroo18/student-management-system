import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";

function StudentDashboard() {
  const [data, setData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    const fetchProfile = async () => {
      try {
        const res = await axios.get(
          "http://127.0.0.1:8000/student/profile",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setData(res.data);
      } catch (err) {
        navigate("/");
      }
    };

    fetchProfile();
  }, [navigate]);

  if (!data) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar role="student" />

      <div className="p-6 flex justify-center">
        <div className="bg-white shadow-lg rounded-xl p-6 w-full max-w-md">
          <h2 className="text-xl font-bold mb-4">My Profile</h2>

          <div className="space-y-2">
            <p><b>Email:</b> {data.email}</p>
            <p><b>Roll Number:</b> {data.roll_number}</p>
            <p><b>Department:</b> {data.department}</p>
            <p><b>Year:</b> {data.year}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudentDashboard;