import dotenv from "dotenv";
dotenv.config();

import { GoogleGenAI } from "@google/genai";
import Question from "../models/question-model.js";
import Session from "../models/session-model.js";
import {
  conceptExplainPrompt,
  questionAnswerPrompt,
} from "../utils/prompts-util.js";

// Check if API key is available and valid (not a placeholder)
const apiKey = process.env.GEMINI_API_KEY;
const isValidApiKey = apiKey && 
  !apiKey.includes("your-") && 
  !apiKey.includes("your ") && 
  apiKey.length > 20;
const ai = isValidApiKey ? new GoogleGenAI({ apiKey }) : null;

// Mock questions generator for when API key is not available
const generateMockQuestions = (role, experience, topicsToFocus) => {
  const baseTopic = Array.isArray(topicsToFocus)
    ? topicsToFocus[0] || "general concepts"
    : topicsToFocus || "general concepts";

  const roleLower = role.toLowerCase();

  let mockQuestions = [];

  if (roleLower.includes('frontend') || roleLower.includes('react') || roleLower.includes('angular') || roleLower.includes('vue')) {
    mockQuestions = [
      {
        question: `What is the difference between HTML and CSS?`,
        answer: `**HTML** defines structure, while **CSS** handles presentation.

- HTML creates elements like headings, paragraphs, and forms.
- CSS styles colors, layout, spacing, and fonts.

**Key takeaway:** HTML creates the page content and CSS makes it look good.`,
      },
      {
        question: `How does the browser render a webpage?`,
        answer: `The browser parses HTML into a **DOM tree**, CSS into a **CSSOM tree**, and combines them into a **render tree**.

- Layout and paint are then performed.
- Scripts can modify the DOM and trigger reflow or repaint.

**Key takeaway:** Rendering converts HTML/CSS into pixels on the screen.`,
      },
      {
        question: `Explain the box model in CSS.`,
        answer: `The **box model** includes content, padding, border, and margin.

- Content is the element's actual data.
- Padding adds space inside the border.
- Border surrounds the padding.
- Margin creates space outside the border.

**Key takeaway:** CSS layout is built from nested boxes.`,
      },
      {
        question: `What is a semantic HTML element?`,
        answer: `Semantic elements clearly describe their meaning in code, such as **<header>**, **<article>**, and **<footer>**.

- They improve accessibility.
- They make markup easier to read.

**Key takeaway:** Use semantic HTML for clarity and accessibility.`,
      },
      {
        question: `What are CSS selectors?`,
        answer: `Selectors target HTML elements so CSS rules apply to them.

- Example: .button targets class names.
- Example: #main targets an ID.

**Key takeaway:** Selectors decide which elements get styled.`,
      },
      {
        question: `How does JavaScript interact with HTML?`,
        answer: `JavaScript uses the **DOM API** to read and change HTML elements.

- document.querySelector() finds elements.
- element.textContent updates text.
- Event listeners handle user actions.

**Key takeaway:** JavaScript makes static HTML interactive.`,
      },
      {
        question: `What is a JavaScript event listener?`,
        answer: `An event listener waits for actions like clicks or typing and runs code when they occur.

- Use addEventListener.
- Common events: click, submit, keydown.

**Key takeaway:** Event listeners connect user actions to behavior.`,
      },
      {
        question: `What is the difference between let and const?`,
        answer: `Use **let** for variables that can change and **const** for values that stay constant.

- const prevents reassignment.
- let allows reassignment.

**Key takeaway:** Prefer const unless the value must change.`,
      },
      {
        question: `How do you make a responsive layout?`,
        answer: `Use **flexbox**, **grid**, and media queries.

- display: flex aligns items.
- grid-template-columns creates responsive columns.
- Media queries adapt to screen size.

**Key takeaway:** Responsive design adapts layout to different screens.`,
      },
      {
        question: `What is a web accessibility best practice?`,
        answer: `Use descriptive **alt** text, proper heading structure, and keyboard-friendly controls.

- Labels help screen readers.
- Contrast improves readability.

**Key takeaway:** Accessibility makes websites usable for everyone.`,
      },
      {
        question: `Why is performance important in frontend apps?`,
        answer: `Fast pages keep users engaged and reduce bounce rates.

- Minimize file size.
- Use caching.
- Avoid unnecessary re-renders.

**Key takeaway:** Good performance improves user experience.`,
      },
      {
        question: `What is the role of version control in web development?`,
        answer: `Version control tracks code changes and allows collaboration.

- Git stores history.
- Branches isolate work.
- Commits document progress.

**Key takeaway:** Version control helps teams build software safely.`,
      },
    ];
  } else if (roleLower.includes('backend') || roleLower.includes('node') || roleLower.includes('express') || roleLower.includes('java') || roleLower.includes('python')) {
    mockQuestions = [
      {
        question: `What is REST API?`,
        answer: `**REST** (Representational State Transfer) is an architectural style for designing networked applications.

- Uses HTTP methods: GET, POST, PUT, DELETE.
- Stateless communication.
- Resources identified by URIs.

**Key takeaway:** REST provides a standard way to build web services.`,
      },
      {
        question: `Explain database normalization.`,
        answer: `Normalization organizes data to reduce redundancy and improve integrity.

- First Normal Form (1NF): Eliminate repeating groups.
- Second Normal Form (2NF): Remove partial dependencies.
- Third Normal Form (3NF): Remove transitive dependencies.

**Key takeaway:** Normalization ensures efficient and consistent data storage.`,
      },
      {
        question: `What is middleware in Express.js?`,
        answer: `Middleware functions have access to request and response objects.

- Can execute code, modify request/response.
- Next() passes control to next middleware.
- Used for logging, authentication, parsing.

**Key takeaway:** Middleware extends Express functionality.`,
      },
      {
        question: `How does authentication work in web apps?`,
        answer: `Authentication verifies user identity using credentials.

- Common methods: JWT, sessions, OAuth.
- JWT: Stateless token-based auth.
- Sessions: Server-side storage.

**Key takeaway:** Secure authentication protects user data.`,
      },
      {
        question: `What is SQL injection and how to prevent it?`,
        answer: `SQL injection inserts malicious SQL into queries.

- Prevention: Use parameterized queries.
- Prepared statements.
- Input validation.

**Key takeaway:** Sanitize inputs to prevent database attacks.`,
      },
      {
        question: `Explain asynchronous programming in Node.js.`,
        answer: `Asynchronous code doesn't block execution.

- Callbacks, promises, async/await.
- Event loop handles I/O operations.
- Non-blocking I/O improves performance.

**Key takeaway:** Async programming makes Node.js efficient for I/O.`,
      },
      {
        question: `What is a database index?`,
        answer: `An index speeds up data retrieval operations.

- Like a book index for quick lookup.
- Trade-off: Faster reads, slower writes.
- Types: B-tree, hash, full-text.

**Key takeaway:** Indexes optimize query performance.`,
      },
      {
        question: `How do you handle errors in Express.js?`,
        answer: `Error handling middleware catches and processes errors.

- Define after other middleware.
- Four parameters: err, req, res, next.
- Send appropriate error responses.

**Key takeaway:** Proper error handling improves app reliability.`,
      },
      {
        question: `What is caching and why is it important?`,
        answer: `Caching stores frequently accessed data in memory.

- Reduces database load.
- Improves response times.
- Types: In-memory, Redis, CDN.

**Key takeaway:** Caching enhances application performance.`,
      },
      {
        question: `Explain the MVC pattern.`,
        answer: `MVC separates application into Model, View, Controller.

- Model: Data and business logic.
- View: User interface.
- Controller: Handles user input.

**Key takeaway:** MVC organizes code for maintainability.`,
      },
      {
        question: `What is API rate limiting?`,
        answer: `Rate limiting controls request frequency to an API.

- Prevents abuse and overload.
- Uses algorithms like token bucket.
- Returns 429 status for exceeded limits.

**Key takeaway:** Rate limiting protects server resources.`,
      },
      {
        question: `How do you secure a web application?`,
        answer: `Implement multiple security layers.

- HTTPS for encrypted communication.
- Input validation and sanitization.
- Authentication and authorization.
- Regular security audits.

**Key takeaway:** Security is crucial for protecting user data.`,
      },
    ];
  } else {
    // General questions
    mockQuestions = [
      {
        question: `What is version control?`,
        answer: `Version control tracks changes to code over time.

- Allows collaboration.
- Maintains history of changes.
- Enables rollback to previous versions.

**Key takeaway:** Version control is essential for software development.`,
      },
      {
        question: `Explain the software development lifecycle.`,
        answer: `SDLC includes planning, design, development, testing, deployment.

- Planning: Define requirements.
- Design: Create architecture.
- Development: Write code.
- Testing: Verify functionality.
- Deployment: Release to production.

**Key takeaway:** SDLC ensures systematic software creation.`,
      },
      {
        question: `What is agile methodology?`,
        answer: `Agile is an iterative approach to software development.

- Emphasizes flexibility and collaboration.
- Short development cycles (sprints).
- Continuous feedback and improvement.

**Key takeaway:** Agile adapts to changing requirements.`,
      },
      {
        question: `What is debugging?`,
        answer: `Debugging finds and fixes errors in code.

- Use breakpoints and logging.
- Step through code execution.
- Identify root causes of issues.

**Key takeaway:** Effective debugging resolves problems quickly.`,
      },
      {
        question: `What is code review?`,
        answer: `Code review examines code for quality and errors.

- Improves code quality.
- Shares knowledge among team.
- Catches bugs before deployment.

**Key takeaway:** Code review enhances software reliability.`,
      },
      {
        question: `Explain unit testing.`,
        answer: `Unit testing verifies individual code components.

- Tests functions or methods in isolation.
- Ensures code works as expected.
- Facilitates refactoring.

**Key takeaway:** Unit tests provide confidence in code changes.`,
      },
      {
        question: `What is continuous integration?`,
        answer: `CI automatically builds and tests code changes.

- Detects integration issues early.
- Runs on every commit.
- Includes automated testing.

**Key takeaway:** CI ensures code quality throughout development.`,
      },
      {
        question: `What is scalability in software?`,
        answer: `Scalability handles increased load or data.

- Vertical: Add more power to server.
- Horizontal: Add more servers.
- Design for growth from start.

**Key takeaway:** Scalable systems grow with demand.`,
      },
      {
        question: `Explain the concept of refactoring.`,
        answer: `Refactoring improves code without changing functionality.

- Makes code more readable.
- Reduces complexity.
- Improves maintainability.

**Key takeaway:** Refactoring keeps code clean and efficient.`,
      },
      {
        question: `What is documentation in software development?`,
        answer: `Documentation explains how code works.

- Code comments and README files.
- API documentation.
- User manuals.

**Key takeaway:** Good documentation aids understanding and maintenance.`,
      },
      {
        question: `What is deployment?`,
        answer: `Deployment releases software to production environment.

- Automated deployment pipelines.
- Rollback strategies.
- Monitoring post-deployment.

**Key takeaway:** Smooth deployment ensures user access to new features.`,
      },
      {
        question: `Explain the importance of code comments.`,
        answer: `Comments explain complex logic and intent.

- Help other developers understand code.
- Document assumptions and decisions.
- Improve maintainability.

**Key takeaway:** Clear comments make code more accessible.`,
      },
    ];
  }

  return mockQuestions.slice(0, 12); // Return up to 12 questions
};

// @desc    Generate + SAVE interview questions for a session
// @route   POST /api/ai/generate-questions
// @access  Private
export const generateInterviewQuestions = async (req, res) => {
  try {
    const { sessionId } = req.body;

    if (!sessionId) {
      return res
        .status(400)
        .json({ success: false, message: "sessionId is required" });
    }

    // Fetch session first
    const session = await Session.findById(sessionId);
    if (!session) {
      return res
        .status(404)
        .json({ success: false, message: "Session not found" });
    }

    if (session.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ success: false, message: "Not authorized" });
    }

    const { role: sessionRole, experience: sessionExp, questionCount, description: topics } = session;
    const questionTotal = questionCount || 12;
    let questions = [];

    if (!isValidApiKey) {
      // Generate mock questions for testing/demo purposes
      console.log("No valid API key found. Generating mock questions for role:", sessionRole);
      questions = generateMockQuestions(sessionRole, sessionExp, topics);
    } else {
      try {
        console.log("Generating questions for session: ", sessionId, "using AI for role:", sessionRole);
        const prompt = questionAnswerPrompt(sessionRole, sessionExp, topics, questionTotal);
        console.log("Using Gemini API for generation");

        const response = await ai.models.generateContent({
          model: "gemini-1.5-flash",
          contents: prompt,
        });

        const parts = response.candidates?.[0]?.content?.parts ?? [];
        const rawText = parts
          .filter((p) => !p.thought)
          .map((p) => p.text ?? "")
          .join("");

        const cleanedText = rawText
          .replace(/^```json\s*/, "")
          .replace(/^```\s*/, "")
          .replace(/```$/, "")
          .replace(/^json\s*/, "")
          .trim();

        try {
          questions = JSON.parse(cleanedText);
        } catch {
          const jsonMatch = cleanedText.match(/\[[\s\S]*\]/);
          if (jsonMatch) {
            questions = JSON.parse(jsonMatch[0]);
          } else {
            throw new Error("Failed to parse AI response as JSON");
          }
        }
      } catch (aiError) {
        console.log("Gemini API error, falling back to mock questions:", aiError.message);
        questions = generateMockQuestions(sessionRole, sessionExp, topics);
      }
    }

    if (!Array.isArray(questions)) {
      throw new Error("Response is not an array");
    }

    // Save questions to database
    const saved = await Question.insertMany(
      questions.map((q) => ({
        session: sessionId,
        question: q.question,
        answer: q.answer || "",
        note: "",
        isPinned: false,
      })),
    );

    // Update session with question IDs
    session.questions = saved.map((q) => q._id);
    await session.save();

    res.status(201).json({ success: true, data: saved });
  } catch (error) {
    console.error("Error generating questions:", error);
    res.status(500).json({
      success: false,
      message: "Failed to generate questions",
      error: error.message,
    });
  }
};

// @desc    Generate explanation for an interview question
// @route   POST /api/ai/generate-explanation
// @access  Private
export const generateConceptExplanation = async (req, res) => {
  try {
    const { question } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        message: "Question is required",
      });
    }

    const prompt = conceptExplainPrompt(question);

    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash-lite",
      contents: prompt,
    });

    let rawText = response.text;

    // Clean it: Remove backticks, json markers, and any extra formatting
    const cleanedText = rawText
      .replace(/^```json\s*/, "")
      .replace(/^```\s*/, "")
      .replace(/```$/, "")
      .replace(/^json\s*/, "")
      .trim();

    // Parse the cleaned JSON
    let explanation;
    try {
      explanation = JSON.parse(cleanedText);
    } catch (parseError) {
      // If parsing fails, try to extract JSON object from text
      const jsonMatch = cleanedText.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        explanation = JSON.parse(jsonMatch[0]);
      } else {
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    // Validate the response structure
    if (!explanation.title || !explanation.explanation) {
      throw new Error(
        "Response missing required fields: title and explanation",
      );
    }

    res.status(200).json({
      success: true,
      data: explanation,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to generate explanation",
      error: error.message,
    });
  }
};
