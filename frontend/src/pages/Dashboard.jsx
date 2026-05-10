import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { API_PATHS } from "../utils/apiPaths";
import axios from "../utils/axiosInstance";
import Navbar from "../components/Navbar";

const Dashboard = () => {
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(API_PATHS.SESSION.GET_ALL);
      setSessions(res.data.sessions || []);
    } catch (error) {
      console.error("Error fetching sessions:", error);
      toast.error("Failed to load sessions");
    } finally {
      setLoading(false);
    }
  };

  const createNewSession = () => {
    navigate("/interview-create");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-white to-yellow-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">My Sessions</h1>
          <button
            onClick={createNewSession}
            className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
          >
            + New Session
          </button>
        </div>

        {loading ? (
          <div className="text-center py-8">Loading sessions...</div>
        ) : sessions.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600 mb-4">No sessions yet. Create one to get started!</p>
            <button
              onClick={createNewSession}
              className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700"
            >
              Create Your First Session
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sessions.map((session) => (
              <div
                key={session._id}
                onClick={() => navigate(`/interview/${session._id}`)}
                className="bg-white p-6 rounded-lg shadow hover:shadow-lg cursor-pointer transition"
              >
                <h3 className="font-bold text-lg mb-2">{session.role}</h3>
                <p className="text-sm text-gray-600 mb-4">
                  Experience: {session.experience} years
                </p>
                <p className="text-sm text-gray-600 mb-4">
                  Questions: {session.questions?.length || 0}
                </p>
                <button
                  className="w-full bg-purple-600 text-white py-2 rounded hover:bg-purple-700"
                >
                  View Session
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;