import Question from "../models/question-model.js";
import Session from "../models/session-model.js";

// @desc    Create a new session and linked questions
// @route   POST /api/sessions/create
// @access  Private
export const createSession = async (req, res) => {
  try {
    const { role, experience, questionCount, description } = req.body;
    const userId = req.user?._id;

    console.log("Session create request:", {
      role,
      experience,
      userId,
      user: req.user,
    });

    // Validate required fields
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "User not authenticated",
      });
    }

    if (!role || role.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Role is required",
      });
    }

    if (experience === undefined || experience === null || experience === "") {
      return res.status(400).json({
        success: false,
        message: "Experience is required",
      });
    }

    if (
      questionCount !== undefined &&
      questionCount !== null &&
      (Number.isNaN(Number(questionCount)) || Number(questionCount) < 1)
    ) {
      return res.status(400).json({
        success: false,
        message: "Question count must be a positive number",
      });
    }

    // Create the session
    const session = await Session.create({
      user: userId,
      role: role.trim(),
      experience: parseInt(experience),
      questionCount: questionCount ? Number(questionCount) : 12,
      description: description?.trim() || "",
      questions: [],
    });

    console.log("Session created:", session._id);

    res.status(201).json({
      success: true,
      session,
    });
  } catch (error) {
    console.error("Session creation error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create session",
      error: error.message,
    });
  }
};

// @desc    Get all sessions for the logged-in user
// @route   GET /api/sessions/my-sessions
// @access  Private
export const getMySessions = async (req, res) => {
  try {
    const userId = req.user._id;

    const sessions = await Session.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("questions");

    res.status(200).json({
      success: true,
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

// @desc    Get a session by ID with populated questions
// @route   GET /api/sessions/:id
// @access  Private
export const getSessionById = async (req, res) => {
  try {
    const session = await Session.findById(req.params.id)
      .populate("questions")
      .populate("user", "name email");

    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    // Check if the session belongs to the logged-in user
    if (session.user._id.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    res.status(200).json({
      success: true,
      session,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server Error" });
  }
};

