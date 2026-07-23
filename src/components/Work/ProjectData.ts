/**
 * SINGLE SOURCE OF TRUTH for the "My Work" section.
 *
 * ===========================================================================
 * THIS IS THE ONLY FILE YOU EVER NEED TO EDIT TO ADD CONTENT.
 * No component, CSS or JSX change is required — the UI reacts automatically.
 * ===========================================================================
 *
 * ADDING A PROJECT
 * ---------------------------------------------------------------------------
 * 1. IMAGE   Drop the file in `public/images/` and set `image: "/images/x.webp"`.
 *            Any aspect ratio works — the card crops to a fixed 16:10 frame,
 *            lazy-loads it and fades it in. Leave "" for a neutral placeholder.
 *
 * 2. TITLE   `title: "My Project"`. Leave "" and the card becomes an empty
 *            reserved slot instead.
 *
 *            `subtitle` is the one short line under the title, e.g.
 *            "AI-Powered Recruitment Platform". Leave "" to omit it — the
 *            card layout stays correct either way.
 *
 * 3. GITHUB  `github: "https://github.com/you/repo"`. The GitHub button is
 *            ALWAYS rendered: empty "" shows a dimmed disabled placeholder,
 *            and the moment you paste a URL it becomes a live link that opens
 *            in a new tab. Nothing else to change.
 *
 * 4. README  Fill any of the `readme` fields. Blank fields are skipped, so you
 *            can add content incrementally and the modal stays tidy.
 *
 *            Text fields (overview / problemStatement / solution /
 *            architecture) accept pasted README prose and support:
 *              • blank line  → new paragraph
 *              • `backticks` → inline code
 *              • ``` fences  → full code block (language hint is stripped)
 *
 *            List fields (features / challenges / futureImprovements) are
 *            arrays of strings, rendered as bullets (inline code supported).
 *
 *            Tag fields (technologies / skillsGained) are arrays of short
 *            strings, rendered as pills.
 *
 * Empty mobile slots are generated automatically up to the category capacity,
 * so as you add real apps the placeholder slots disappear on their own.
 */

export type ProjectCategoryId = "ai-ml" | "mobile";

/** Every field is optional content-wise: blank sections are skipped in the modal. */
export interface ProjectReadme {
  overview: string;
  problemStatement: string;
  solution: string;
  features: string[];
  technologies: string[];
  skillsGained: string[];
  architecture: string;
  challenges: string[];
  futureImprovements: string[];
}

export interface Project {
  /** Stable unique key. Also used as the React key. */
  id: string;
  /** Leave "" to render an empty placeholder slot. */
  title: string;
  /** One short line under the title, e.g. "AI-Powered Recruitment Platform". */
  subtitle: string;
  /** Path under /public, e.g. "/images/hiringbuddy.webp". "" = no image yet. */
  image: string;
  /** Full repo URL. "" hides the GitHub button. */
  github: string;
  category: ProjectCategoryId;
  readme: ProjectReadme;
}

export interface ProjectCategory {
  id: ProjectCategoryId;
  /** Section heading. */
  title: string;
  /** Rendered as the accented second word of the heading. */
  accent: string;
  /** Total number of cards to show, padded with empty slots. */
  capacity: number;
}

/** Blank README scaffold — fill these in per project. */
export const emptyReadme = (): ProjectReadme => ({
  overview: "",
  problemStatement: "",
  solution: "",
  features: [],
  technologies: [],
  skillsGained: [],
  architecture: "",
  challenges: [],
  futureImprovements: [],
});

export const categories: ProjectCategory[] = [
  {
    id: "ai-ml",
    title: "",
    accent: "",
    // Grows automatically with the array; no empty slots reserved.
    capacity: 0,
  },
  {
    id: "mobile",
    title: "Mobile",
    accent: "Applications",
    // Reserves 8 slots total.
    capacity: 8,
  },
];

/**
 * Add real projects here. Titles below were specified; all other content is
 * intentionally blank and waiting to be filled in.
 */
export const projects: Project[] = [
  {
    id: "hiringbuddy",
    title: "HiringBuddy",
    subtitle: "AI-Powered Recruitment Platform",
    image: "/images/hiringbuddy.webp",
    github: "https://github.com/vaibhavdbjsjx/HiringBUddy",
    category: "ai-ml",
    readme: {
      ...emptyReadme(),
      problemStatement:
        "Traditional hiring is slow, manual, and inefficient. Recruiters spend significant time screening resumes, matching candidates to job requirements, scheduling interviews, and communicating with applicants. HiringBuddy streamlines the recruitment process using AI-powered automation and intelligent candidate analysis.",
      features: [
        "AI-powered resume parsing and candidate ranking",
        "Job description creation and management",
        "Intelligent resume-to-job matching with match score",
        "Recruiter and candidate dashboards",
        "Resume upload with skills extraction",
        "Candidate search, filtering, and sorting",
        "Interview scheduling and application tracking",
        "AI-generated candidate insights and skill-gap analysis",
        "Email notification automation",
        "Secure authentication and role-based access",
        "Responsive, modern UI for desktop and mobile",
        "Analytics dashboard for recruitment insights",
      ],
      skillsGained: [
        "Full-Stack Web Development",
        "AI Integration",
        "REST API Development",
        "Authentication & Authorization",
        "Responsive UI/UX Design",
        "Database Management",
        "State Management",
        "File Processing (Resume Parsing)",
        "Dashboard Development",
      ],
      technologies: [
        "React.js",
        "Tailwind CSS",
        "FastAPI",
        "Python",
        "MySQL",
        "OpenAI/Groq API",
        "Git & GitHub",
        "VS Code",
        "Claude Code",
        "Antigravity AI",
      ],
    },
  },
  {
    id: "ml-deepshield",
    title: "ML DeepShield",
    subtitle: "AI Security & Threat Detection",
    image: "/images/deepshield.webp",
    github: "https://github.com/vaibhavdbjsjx/deepshield-ai",
    category: "ai-ml",
    readme: {
      ...emptyReadme(),
      overview:
        "DeepShield – AI Deepfake Detection & Digital Trust Platform\n\nAn AI-powered web application that detects manipulated images, videos, and audio using machine learning and computer vision. It provides explainable AI visualizations, confidence scores, and an interactive dashboard for digital media verification.",
      features: [
        "AI Image Deepfake Detection",
        "Video & Audio Forgery Detection",
        "Live Webcam Detection",
        "AI vs Real Image Classification",
        "Face Detection & Analysis",
        "Explainable AI (Heatmaps & Saliency Maps)",
        "Confidence & Trust Score",
        "Analytics Dashboard",
        "Detection History",
        "Report Generation",
        "Responsive Modern UI",
      ],
      technologies: [
        "React.js",
        "Vite",
        "Tailwind CSS",
        "HTML",
        "CSS",
        "JavaScript",
        "Python",
        "FastAPI",
        "OpenCV",
        "NumPy",
        "Pillow",
        "Deep Learning Models",
        "Git",
        "GitHub",
        "VS Code",
        "Cursor AI",
        "Codex AI",
        "Google AI Studio",
      ],
    },
  },
  {
    id: "ipl-match-prediction",
    title: "IPL Match Prediction",
    subtitle: "Machine Learning Prediction & Analytics",
    image: "/images/ipl_prediction.webp",
    github: "",
    category: "ai-ml",
    readme: emptyReadme(),
  },
  {
    id: "nutrimind",
    title: "NutriMind",
    subtitle: "AI-Powered Smart Nutrition & Health Coach",
    image: "/images/Nutrimind.png",
    github: "https://github.com/vaibhavdbjsjx/Nutrimind",
    category: "mobile",
    readme: {
      ...emptyReadme(),
      problemStatement:
        "Many people struggle to maintain a healthy lifestyle because calorie tracking, meal planning, and nutrition analysis are time-consuming and confusing. Existing fitness apps often require manual food entry, lack personalized guidance, and fail to provide intelligent health recommendations. NutriMind addresses these problems by combining AI-powered food recognition, nutrition tracking, and a personal AI coach into a single user-friendly platform.",
      features: [
        "📸 AI Meal Scanner – Scan food using the camera to automatically detect meals and estimate calories and macronutrients.",
        "🥗 AI Fridge Scanner – Scan refrigerator ingredients and receive healthy meal suggestions.",
        "🤖 AI Nutrition Coach – Chat with an AI assistant for personalized diet advice, nutrition guidance, and fitness recommendations.",
        "🔥 Daily Calorie Tracker – Track remaining calories based on personalized goals.",
        "💪 Macronutrient Tracking – Monitor protein, carbohydrates, and fat intake with visual progress indicators.",
        "📊 Progress Dashboard – View calorie trends, weight progress, achievements, and weekly summaries.",
        "🏆 Challenges & Streaks – Daily challenges, achievement badges, and streak tracking to improve consistency.",
        "🍽️ Personalized Meal Plans (Pro) – AI-generated meal plans based on fitness goals and dietary preferences.",
        "🚶 Activity Logging – Record workouts and estimate calories burned.",
        "👤 Personalized Profile – Calculate daily calorie and macronutrient targets using age, height, weight, activity level, and fitness goal.",
        "🌙 Dark & Light Theme – Responsive UI with theme switching for better accessibility.",
        "📱 Responsive Design – Optimized for mobile phones, tablets, and desktops.",
      ],
      skillsGained: [
        "AI Integration",
        "Prompt Engineering",
        "Full-Stack Web Development",
        "Responsive UI/UX Design",
        "REST API Integration",
        "State Management",
        "Authentication & User Profile Management",
        "Nutrition & Health Data Processing",
        "Component-Based Architecture",
        "Modern Frontend Development",
      ],
      technologies: [
        "React.js",
        "TypeScript",
        "Tailwind CSS",
        "Vite",
        "FastAPI",
        "Python",
        "OpenAI API (AI Coach & Meal Analysis)",
        "Prompt Engineering",
        "Computer Vision APIs (Food Recognition)",
        "Supabase / PostgreSQL",
        "Git & GitHub",
        "VS Code",
      ],
    },
  },
  {
    id: "justice",
    title: "Justice",
    subtitle: "AI Legal Assistant Platform",
    image: "/images/justice.png",
    github: "https://github.com/vaibhavdbjsjx/Justice-",
    category: "mobile",
    readme: {
      ...emptyReadme(),
      problemStatement:
        "Legal services are often complex, time-consuming, and difficult to access. Justice simplifies legal research, document management, and lawyer-client collaboration using AI-powered automation across web, desktop, and mobile.",
      features: [
        "AI legal assistant for legal queries",
        "AI-powered legal document generation",
        "Document upload, analysis, and summarization",
        "Case and matter management",
        "Lawyer & client dashboards",
        "AI client intake and case triage",
        "Legal research assistant",
        "Verified lawyer marketplace",
        "Secure authentication with role-based access",
        "Subscription & payment integration",
        "Cross-platform support (Web, Desktop & Mobile)",
      ],
      skillsGained: [
        "Full-Stack Development",
        "AI Integration",
        "REST API Development",
        "Authentication & Role-Based Access",
        "Database Design",
        "Responsive UI/UX Design",
        "Cross-Platform Development",
        "Secure Data Management",
      ],
      technologies: [
        "React.js",
        "Flutter",
        "Tauri",
        "Supabase",
        "PostgreSQL",
        "OpenAI API",
        "Stripe",
        "Tailwind CSS",
        "Git & GitHub",
        "VS Code",
        "Claude Code",
        "Antigravity AI",
      ],
    },
  },
  {
    id: "coinscan",
    title: "CoinScan",
    subtitle: "AI Cryptocurrency Analytics Platform",
    image: "/images/Coinscan.png",
    github: "https://github.com/vaibhavdbjsjx/CoinScan",
    category: "mobile",
    readme: {
      ...emptyReadme(),
      problemStatement:
        "Crypto investors often struggle to analyze market trends, identify promising assets, and manage portfolios efficiently. CoinScan simplifies cryptocurrency research with AI-powered market insights, real-time analytics, and intelligent portfolio management.",
      features: [
        "Real-time cryptocurrency market tracking",
        "AI-powered coin analysis and predictions",
        "Smart buy/sell insights",
        "Portfolio tracking and performance analytics",
        "Watchlist with price alerts",
        "Interactive price charts and market trends",
        "AI news sentiment analysis",
        "Token comparison and risk analysis",
        "Whale activity and market insights",
        "Secure authentication and cloud sync",
        "Responsive dashboard for Web, Android & iOS",
      ],
      skillsGained: [
        "Full-Stack Development",
        "AI Integration",
        "REST API Development",
        "Data Visualization",
        "Authentication & Authorization",
        "Database Design",
        "Responsive UI/UX Design",
      ],
      technologies: [
        "React.js",
        "FastAPI",
        "Python",
        "PostgreSQL / Supabase",
        "OpenAI API",
        "Crypto Market APIs",
        "Tailwind CSS",
        "Git & GitHub",
        "VS Code",
        "Claude Code",
        "Antigravity AI",
      ],
    },
  },
  {
    id: "solar-monitor",
    title: "Solar Monitor",
    subtitle: "AI Powered Solar Energy Monitor App",
    image: "/images/surya_shakti.webp",
    github: "https://github.com/vaibhavdbjsjx/Surya-Shakti-Solar-Monitor",
    category: "mobile",
    readme: {
      ...emptyReadme(),
      overview:
        "Developed during my internship, Surya-Shakti Solar Monitor is an AI-powered mobile application that helps users monitor solar energy production, track appliance-wise electricity consumption, analyze energy utilization, and receive intelligent recommendations to optimize power usage and improve sustainability.",
      features: [
        "Real-time Solar Energy Monitoring",
        "Appliance-wise Electricity Consumption Tracking",
        "Smart Energy Usage Analytics",
        "AI-based Energy Saving Recommendations",
        "Battery & Grid Status Monitoring",
        "Interactive Dashboard & Charts",
        "Appliance Scheduling Simulation",
        "Sustainability & Energy Efficiency Tracking",
        "Clean, Responsive Material Design UI",
      ],
      technologies: [
        "Flutter",
        "Dart",
        "Hive Database",
        "Provider",
        "FL Chart",
        "Material Design",
        "Android Studio",
        "VS Code",
        "Git & GitHub",
      ],
    },
  },
  {
    id: "autofy",
    title: "Autofy",
    subtitle: "AI-Powered WhatsApp Business Assistant",
    image: "/images/Autofy.png",
    github: "https://github.com/vaibhavdbjsjx/Autofy",
    category: "mobile",
    readme: {
      ...emptyReadme(),
      problemStatement:
        "Small and medium businesses struggle to respond to customer inquiries 24/7, manage appointments, handle leads, and provide instant support. Autofy solves this by automating customer interactions on WhatsApp using AI, reducing manual work and improving customer engagement.",
      features: [
        "AI-powered WhatsApp chatbot with natural conversations",
        "Business knowledge base (FAQs, services, pricing, products)",
        "Appointment booking and lead management",
        "Product & service catalog with images and availability",
        "UPI/QR code payment integration",
        "Customer and payment reports",
        "Admin dashboard for business management",
        "Multi-language support",
        "AI analytics and customer insights",
        "Responsive web application with modern UI/UX",
      ],
      technologies: [
        "React.js",
        "TypeScript",
        "Tailwind CSS",
        "FastAPI",
        "Python",
        "Supabase (PostgreSQL)",
        "Supabase Auth",
        "Google Gemini API",
        "OpenAI API",
        "Razorpay",
        "UPI Integration",
        "Vercel",
      ],
    },
  },
  {
    id: "ai-interview",
    title: "AI Interview",
    subtitle: "Android Mock Interview Application",
    image: "/images/Interview.png",
    github: "https://github.com/vaibhavdbjsjx/AI-Interview",
    category: "mobile",
    readme: {
      ...emptyReadme(),
      overview:
        "An AI-powered Android application that simulates technical and HR interviews, asks interview questions, evaluates user responses, provides feedback, and helps users prepare for real interviews.",
      problemStatement:
        "Job seekers often lack a realistic interview practice platform with instant AI-powered feedback, making it difficult to improve communication and interview performance before real interviews.",
      features: [
        "AI-powered mock interview sessions",
        "Voice and text-based interview support",
        "HR and technical interview question generation",
        "AI evaluation and performance scoring",
        "Personalized improvement suggestions",
        "Interview history and progress tracking",
        "Real-time feedback after every answer",
        "Dark & Light mode support",
        "Modern Material Design UI",
        "Secure user authentication",
        "Cloud data synchronization",
        "Smooth animations and responsive interface",
      ],
      technologies: [
        "Flutter",
        "Dart",
        "Firebase Authentication",
        "Cloud Firestore",
        "Firebase Storage",
        "OpenAI / Generative AI API",
        "REST API",
        "Hive (Local Storage)",
        "Git & GitHub",
        "Android Studio",
        "Material Design 3",
      ],
      skillsGained: [
        "AI Integration",
        "Mobile App Development",
        "API Integration",
        "State Management",
        "Authentication",
        "Local & Cloud Database Management",
        "UI/UX Design",
        "Prompt Engineering",
        "Performance Optimization",
        "Problem Solving",
      ],
    },
  },
  {
    id: "aether",
    title: "Aether",
    subtitle: "AI Personal Productivity Platform",
    image: "/images/Aether.png",
    github: "https://github.com/vaibhavdbjsjx/Aether",
    category: "mobile",
    readme: {
      ...emptyReadme(),
      problemStatement:
        "Managing daily tasks, notes, schedules, finances, and personal goals across multiple apps is inefficient. Aether brings everything into one AI-powered personal productivity platform for smarter organization and automation.",
      features: [
        "AI personal assistant",
        "Task, to-do & project management",
        "Smart notes with AI summaries",
        "Calendar & event scheduling",
        "Expense and budget tracking",
        "Habit & goal tracking",
        "AI-powered reminders and insights",
        "File and document management",
        "Personalized dashboard & analytics",
        "Secure authentication and cloud sync",
        "Cross-platform support (Web, Android & iOS)",
      ],
      technologies: [
        "React.js",
        "Flutter",
        "FastAPI",
        "Python",
        "Supabase / PostgreSQL",
        "OpenAI API",
        "Tailwind CSS",
        "Git & GitHub",
        "VS Code",
        "Claude Code",
        "Antigravity AI",
      ],
      skillsGained: [
        "Full-Stack Development",
        "AI Integration",
        "REST API Development",
        "Authentication & Authorization",
        "Database Design",
        "Responsive UI/UX Design",
        "Cross-Platform Development",
      ],
    },
  },
  {
    id: "greens",
    title: "Greens",
    subtitle: "AI Smart Plant Care Platform",
    image: "/images/Green.png",
    github: "https://github.com/vaibhavdbjsjx/Green",
    category: "mobile",
    readme: {
      ...emptyReadme(),
      problemStatement:
        "Plant owners often struggle with identifying plants, diagnosing diseases, and providing proper care. Greens simplifies plant management using AI-powered identification, health analysis, and personalized care recommendations.",
      features: [
        "AI plant identification using images",
        "Disease and pest detection",
        "Personalized watering and fertilizing schedules",
        "Plant health monitoring and growth tracking",
        "Weather-based care recommendations",
        "Smart reminders and notifications",
        "Digital plant collection (Plant Passport)",
        "Plant care history and analytics",
        "Community & plant marketplace",
        "Cross-platform support (Web, Android & iOS)",
      ],
      technologies: [
        "React.js",
        "Flutter",
        "FastAPI",
        "Python",
        "PostgreSQL / Supabase",
        "OpenAI / Gemini API",
        "Tailwind CSS",
        "Git & GitHub",
        "VS Code",
        "Claude Code",
        "Antigravity AI",
      ],
      skillsGained: [
        "Full-Stack Development",
        "AI & Computer Vision Integration",
        "REST API Development",
        "Database Design",
        "Responsive UI/UX Design",
        "Authentication & Cloud Integration",
      ],
    },
  },
];

/** A card is a placeholder when it has no title yet. */
export const isPlaceholder = (project: Project) => project.title.trim() === "";

/** Creates an empty slot card. */
const createSlot = (category: ProjectCategoryId, index: number): Project => ({
  id: `${category}-slot-${index}`,
  title: "",
  subtitle: "",
  image: "",
  github: "",
  category,
  readme: emptyReadme(),
});

/**
 * Returns the real projects for a category, padded with empty slots up to the
 * category's capacity. Padding shrinks automatically as real projects are added.
 */
export const getProjectsByCategory = (category: ProjectCategory): Project[] => {
  const defined = projects.filter((p) => p.category === category.id);
  const remaining = Math.max(0, category.capacity - defined.length);
  const slots = Array.from({ length: remaining }, (_, i) =>
    createSlot(category.id, i + 1)
  );
  return [...defined, ...slots];
};
