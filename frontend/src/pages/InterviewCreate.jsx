import { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast, { Toaster } from "react-hot-toast";
import { API_PATHS } from "../utils/apiPaths";
import axios from "../utils/axiosInstance";
import Navbar from "../components/Navbar";

const InterviewCreate = () => {
  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    questionCount: 12,
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.role.trim()) {
      toast.error("Please enter a job role");
      return;
    }
    
    if (!formData.experience || formData.experience === "") {
      toast.error("Please enter years of experience");
      return;
    }

    if (
      !formData.questionCount ||
      Number.isNaN(Number(formData.questionCount)) ||
      Number(formData.questionCount) < 1
    ) {
      toast.error("Please enter a valid number of questions");
      return;
    }

    setLoading(true);
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        toast.error("Session expired. Please login again.");
        navigate("/login");
        return;
      }

      const response = await axios.post(API_PATHS.SESSION.CREATE, {
        role: formData.role.trim(),
        experience: parseInt(formData.experience),
        questionCount: Number(formData.questionCount),
        description: formData.description.trim(),
      });

      const sessionId = response.data.session?._id;
      if (sessionId) {
        toast.success("Session created! Redirecting...");
        setTimeout(() => navigate(`/interview/${sessionId}`), 500);
      } else {
        toast.error("Session created but ID not found");
      }
    } catch (error) {
      const message =
        error.response?.data?.message || error.message || "Failed to create session";
      console.error("Session creation error:", error.response?.data || error);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-100 via-white to-yellow-50">
      <Toaster position="top-right" />
      <Navbar />

      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold mb-2">Create New Interview Session</h1>
          <p className="text-gray-600 mb-6">
            Set up your interview prep session with AI-generated questions.
            The system will prioritize the most common questions asked in the last 2 years for this role.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Role */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Job Role / Position <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                placeholder="e.g., Senior React Developer, Product Manager"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Experience */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Years of Experience <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="experience"
                value={formData.experience}
                onChange={handleChange}
                placeholder="e.g., 5"
                min="0"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Question Count */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Number of Questions <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                name="questionCount"
                value={formData.questionCount}
                onChange={handleChange}
                placeholder="e.g., 12"
                min="1"
                max="50"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                Choose how many questions the AI should generate.
              </p>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-semibold mb-2">
                Additional Details (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Any specific areas or challenges you want to practice..."
                rows="3"
                className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-purple-500"
              />
            </div>

            {/* Submit Button */}
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 px-4 rounded-lg font-semibold text-white transition ${
                  loading
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-purple-600 hover:bg-purple-700"
                }`}
              >
                {loading ? "Creating Session..." : "Create Session"}
              </button>
              <button
                type="button"
                onClick={() => navigate("/dashboard")}
                className="flex-1 py-3 px-4 rounded-lg font-semibold text-gray-700 border-2 border-gray-300 hover:border-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default InterviewCreate;
