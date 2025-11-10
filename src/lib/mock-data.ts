// Mock data layer to replace Supabase calls

export type UserRole = "student" | "instructor" | "institution";

export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  bio?: string;
  profilePicture?: string;
  createdAt: string;
  institutionId?: string;
  subjectSpecialization?: string; // For instructors
  pricePerSession?: number; // For instructors
}

export interface Course {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  institutionId: string;
  createdAt: string;
  enrolledStudents?: string[];
  image?: string;
}

export interface Exam {
  id: string;
  title: string;
  description: string;
  courseId: string;
  courseName: string;
  instructorId: string;
  instructorName: string;
  duration: number; // minutes
  questions: ExamQuestion[];
  createdAt: string;
}

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  points: number;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  studentId: string;
  studentName: string;
  answers: Record<string, number>;
  score: number;
  totalPoints: number;
  submittedAt: string;
  status: "completed" | "in-progress";
}

export interface Session {
  id: string;
  title: string;
  description: string;
  instructorId: string;
  instructorName: string;
  courseId?: string;
  scheduledAt: string;
  duration: number; // minutes
  maxParticipants: number;
  participants: string[];
}

export interface Institution {
  id: string;
  name: string;
  description: string;
  logo?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  sessionId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

// Mock data storage
class MockDatabase {
  private users: User[] = [];
  private courses: Course[] = [];
  private exams: Exam[] = [];
  private examSubmissions: ExamSubmission[] = [];
  private sessions: Session[] = [];
  private institutions: Institution[] = [];
  private messages: Message[] = [];
  private currentUser: User | null = null;

  // Initialize with sample data
  constructor() {
    // Load from storage first (if exists)
    const hasStoredData = this.loadFromStorage();
    
    // Always initialize users and institutions (static data)
    // This will add sample users, but stored users are already loaded
    this.initializeUsersAndInstitutions();
    
    // If no stored data, initialize sample data for courses, exams, sessions, submissions
    if (!hasStoredData || this.courses.length === 0) {
      this.initializeCoursesExamsSessions();
      this.saveToStorage();
    }
  }

  // Initialize static data (users and institutions) - these don't need persistence
  // Note: Users are loaded from storage first, so this only adds sample users if they don't exist
  private initializeUsersAndInstitutions() {
    // Institutions (always initialize)
    this.institutions = [
      {
        id: "inst1",
        name: "Makerere University",
        description: "Uganda's premier public university, established in 1922",
        createdAt: new Date().toISOString(),
      },
      {
        id: "inst2",
        name: "Kyambogo University",
        description: "Leading institution for technology and teacher education",
        createdAt: new Date().toISOString(),
      },
      {
        id: "inst3",
        name: "Uganda Christian University",
        description: "Excellence in holistic education and character development",
        createdAt: new Date().toISOString(),
      },
      {
        id: "inst4",
        name: "Uganda Martyrs University",
        description: "Quality education grounded in ethical values",
        createdAt: new Date().toISOString(),
      },
    ];

    // Users - Instructors
    this.users = [
      {
        id: "instructor1",
        email: "nakato.sarah@mak.ac.ug",
        name: "Dr. Sarah Nakato",
        role: "instructor",
        bio: "Expert in Computer Science with 12 years of experience. PhD in Software Engineering from Makerere University.",
        institutionId: "inst1",
        subjectSpecialization: "Computer Science",
        pricePerSession: 50000,
        createdAt: new Date().toISOString(),
      },
      {
        id: "instructor2",
        email: "okello.michael@mak.ac.ug",
        name: "Prof. Michael Okello",
        role: "instructor",
        bio: "Mathematics and Statistics specialist with expertise in Data Analysis and Machine Learning.",
        institutionId: "inst1",
        subjectSpecialization: "Mathematics",
        pricePerSession: 45000,
        createdAt: new Date().toISOString(),
      },
      {
        id: "instructor3",
        email: "namukasa.jane@kyu.ac.ug",
        name: "Dr. Jane Namukasa",
        role: "instructor",
        bio: "Software Engineering expert specializing in Web Development and Mobile Applications.",
        institutionId: "inst2",
        subjectSpecialization: "Software Engineering",
        pricePerSession: 55000,
        createdAt: new Date().toISOString(),
      },
      {
        id: "instructor4",
        email: "kabugo.david@ucu.ac.ug",
        name: "Dr. David Kabugo",
        role: "instructor",
        bio: "Network Security and Cybersecurity specialist with industry experience.",
        institutionId: "inst3",
        subjectSpecialization: "Cybersecurity",
        pricePerSession: 60000,
        createdAt: new Date().toISOString(),
      },
      {
        id: "instructor5",
        email: "nakato.mary@mak.ac.ug",
        name: "Prof. Mary Nakato",
        role: "instructor",
        bio: "Database Systems and Data Management expert with focus on modern database technologies.",
        institutionId: "inst1",
        subjectSpecialization: "Database Systems",
        pricePerSession: 48000,
        createdAt: new Date().toISOString(),
      },
      {
        id: "instructor6",
        email: "tumusiime.peter@umu.ac.ug",
        name: "Dr. Peter Tumusiime",
        role: "instructor",
        bio: "Business Administration and Management expert with MBA from international universities.",
        institutionId: "inst4",
        subjectSpecialization: "Business Administration",
        pricePerSession: 52000,
        createdAt: new Date().toISOString(),
      },
    ];

    // Users - Students
    const students = [
      {
        id: "student1",
        email: "nakato.mary@mak.ac.ug",
        name: "Nakato Mary",
        role: "student",
        institutionId: "inst1",
        createdAt: new Date().toISOString(),
      },
      {
        id: "student2",
        email: "okello.james@mak.ac.ug",
        name: "Okello James",
        role: "student",
        institutionId: "inst1",
        createdAt: new Date().toISOString(),
      },
      {
        id: "student3",
        email: "namukasa.alice@kyu.ac.ug",
        name: "Namukasa Alice",
        role: "student",
        institutionId: "inst2",
        createdAt: new Date().toISOString(),
      },
      {
        id: "student4",
        email: "kabugo.john@ucu.ac.ug",
        name: "Kabugo John",
        role: "student",
        institutionId: "inst3",
        createdAt: new Date().toISOString(),
      },
      {
        id: "student5",
        email: "tumusiime.rose@umu.ac.ug",
        name: "Tumusiime Rose",
        role: "student",
        institutionId: "inst4",
        createdAt: new Date().toISOString(),
      },
      {
        id: "student6",
        email: "nakato.peter@mak.ac.ug",
        name: "Nakato Peter",
        role: "student",
        institutionId: "inst1",
        createdAt: new Date().toISOString(),
      },
      {
        id: "student7",
        email: "okello.sarah@kyu.ac.ug",
        name: "Okello Sarah",
        role: "student",
        institutionId: "inst2",
        createdAt: new Date().toISOString(),
      },
      {
        id: "student8",
        email: "namukasa.david@ucu.ac.ug",
        name: "Namukasa David",
        role: "student",
        institutionId: "inst3",
        createdAt: new Date().toISOString(),
      },
    ];
    
    // Add sample users only if they don't already exist (from localStorage)
    const existingUserIds = new Set(this.users.map(u => u.id));
    const existingUserEmails = new Set(this.users.map(u => u.email));
    
    // Sample instructors to add if they don't exist
    const sampleInstructors = [
      {
        id: "instructor1",
        email: "nakato.sarah@mak.ac.ug",
        name: "Dr. Sarah Nakato",
        role: "instructor" as const,
        bio: "Expert in Computer Science with 12 years of experience. PhD in Software Engineering from Makerere University.",
        institutionId: "inst1",
        subjectSpecialization: "Computer Science",
        pricePerSession: 50000,
        createdAt: new Date().toISOString(),
      },
      {
        id: "instructor2",
        email: "okello.michael@mak.ac.ug",
        name: "Prof. Michael Okello",
        role: "instructor" as const,
        bio: "Mathematics and Statistics specialist with expertise in Data Analysis and Machine Learning.",
        institutionId: "inst1",
        subjectSpecialization: "Mathematics",
        pricePerSession: 45000,
        createdAt: new Date().toISOString(),
      },
      {
        id: "instructor3",
        email: "namukasa.jane@kyu.ac.ug",
        name: "Dr. Jane Namukasa",
        role: "instructor" as const,
        bio: "Software Engineering expert specializing in Web Development and Mobile Applications.",
        institutionId: "inst2",
        subjectSpecialization: "Software Engineering",
        pricePerSession: 55000,
        createdAt: new Date().toISOString(),
      },
      {
        id: "instructor4",
        email: "kabugo.david@ucu.ac.ug",
        name: "Dr. David Kabugo",
        role: "instructor" as const,
        bio: "Network Security and Cybersecurity specialist with industry experience.",
        institutionId: "inst3",
        subjectSpecialization: "Cybersecurity",
        pricePerSession: 60000,
        createdAt: new Date().toISOString(),
      },
      {
        id: "instructor5",
        email: "nakato.mary@mak.ac.ug",
        name: "Prof. Mary Nakato",
        role: "instructor" as const,
        bio: "Database Systems and Data Management expert with focus on modern database technologies.",
        institutionId: "inst1",
        subjectSpecialization: "Database Systems",
        pricePerSession: 48000,
        createdAt: new Date().toISOString(),
      },
      {
        id: "instructor6",
        email: "tumusiime.peter@umu.ac.ug",
        name: "Dr. Peter Tumusiime",
        role: "instructor" as const,
        bio: "Business Administration and Management expert with MBA from international universities.",
        institutionId: "inst4",
        subjectSpecialization: "Business Administration",
        pricePerSession: 52000,
        createdAt: new Date().toISOString(),
      },
    ];
    
    // Add instructors if they don't exist (check by email)
    sampleInstructors.forEach(instructor => {
      if (!existingUserEmails.has(instructor.email) && !existingUserIds.has(instructor.id)) {
        this.users.push(instructor);
      }
    });
    
    // Add sample students if they don't exist
    const sampleStudents = [
      {
        id: "student1",
        email: "nakato.mary@mak.ac.ug",
        name: "Nakato Mary",
        role: "student" as const,
        institutionId: "inst1",
        createdAt: new Date().toISOString(),
      },
      {
        id: "student2",
        email: "okello.james@mak.ac.ug",
        name: "Okello James",
        role: "student" as const,
        institutionId: "inst1",
        createdAt: new Date().toISOString(),
      },
      {
        id: "student3",
        email: "namukasa.alice@kyu.ac.ug",
        name: "Namukasa Alice",
        role: "student" as const,
        institutionId: "inst2",
        createdAt: new Date().toISOString(),
      },
      {
        id: "student4",
        email: "kabugo.john@ucu.ac.ug",
        name: "Kabugo John",
        role: "student" as const,
        institutionId: "inst3",
        createdAt: new Date().toISOString(),
      },
      {
        id: "student5",
        email: "tumusiime.rose@umu.ac.ug",
        name: "Tumusiime Rose",
        role: "student" as const,
        institutionId: "inst4",
        createdAt: new Date().toISOString(),
      },
      {
        id: "student6",
        email: "nakato.peter@mak.ac.ug",
        name: "Nakato Peter",
        role: "student" as const,
        institutionId: "inst1",
        createdAt: new Date().toISOString(),
      },
      {
        id: "student7",
        email: "okello.sarah@kyu.ac.ug",
        name: "Okello Sarah",
        role: "student" as const,
        institutionId: "inst2",
        createdAt: new Date().toISOString(),
      },
      {
        id: "student8",
        email: "namukasa.david@ucu.ac.ug",
        name: "Namukasa David",
        role: "student" as const,
        institutionId: "inst3",
        createdAt: new Date().toISOString(),
      },
    ];
    
    sampleStudents.forEach(student => {
      if (!existingUserEmails.has(student.email) && !existingUserIds.has(student.id)) {
        this.users.push(student);
      }
    });

    // Add institution admins if they don't exist
    if (!existingUserEmails.has("admin@mak.ac.ug")) {
      this.users.push({
        id: "institution1",
        email: "admin@mak.ac.ug",
        name: "Makerere University Admin",
        role: "institution" as const,
        institutionId: "inst1",
        createdAt: new Date().toISOString(),
      });
    }
    if (!existingUserEmails.has("admin@kyu.ac.ug")) {
      this.users.push({
        id: "institution2",
        email: "admin@kyu.ac.ug",
        name: "Kyambogo University Admin",
        role: "institution" as const,
        institutionId: "inst2",
        createdAt: new Date().toISOString(),
      });
    }
    
    // Save users after merging
    this.saveToStorage();
  }

  // Load data from localStorage
  private loadFromStorage(): boolean {
    if (typeof window === "undefined") return false;
    
    try {
      let hasData = false;
      
      // Load users first (before initializing sample users)
      const storedUsers = localStorage.getItem("mockDb_users");
      if (storedUsers) {
        const parsedUsers = JSON.parse(storedUsers);
        this.users = parsedUsers; // Load all stored users
        hasData = true;
      }
      
      const storedCourses = localStorage.getItem("mockDb_courses");
      if (storedCourses) {
        this.courses = JSON.parse(storedCourses);
        hasData = true;
      }
      
      const storedExams = localStorage.getItem("mockDb_exams");
      if (storedExams) {
        this.exams = JSON.parse(storedExams);
        hasData = true;
      }
      
      const storedSubmissions = localStorage.getItem("mockDb_examSubmissions");
      if (storedSubmissions) {
        this.examSubmissions = JSON.parse(storedSubmissions);
        hasData = true;
      }
      
      const storedSessions = localStorage.getItem("mockDb_sessions");
      if (storedSessions) {
        this.sessions = JSON.parse(storedSessions);
        hasData = true;
      }
      
      return hasData;
    } catch (e) {
      console.error("Error loading from localStorage:", e);
      return false;
    }
  }

  // Save data to localStorage
  private saveToStorage() {
    if (typeof window === "undefined") return;
    
    try {
      // Save all users (including newly created ones)
      localStorage.setItem("mockDb_users", JSON.stringify(this.users));
      localStorage.setItem("mockDb_courses", JSON.stringify(this.courses));
      localStorage.setItem("mockDb_exams", JSON.stringify(this.exams));
      localStorage.setItem("mockDb_examSubmissions", JSON.stringify(this.examSubmissions));
      localStorage.setItem("mockDb_sessions", JSON.stringify(this.sessions));
    } catch (e) {
      console.error("Error saving to localStorage:", e);
    }
  }

  // Initialize courses, exams, sessions, and submissions (persisted data)
  private initializeCoursesExamsSessions() {
    // Courses
    this.courses = [
      {
        id: "course1",
        title: "Introduction to Agriculture in Uganda",
        description: "Learn about modern farming techniques, crop management, and agricultural practices specific to Uganda's climate and soil conditions.",
        instructorId: "instructor1",
        instructorName: "Dr. Sarah Nakato",
        institutionId: "inst1",
        enrolledStudents: ["student1", "student2", "student6"],
        image: "https://images.unsplash.com/photo-1581094271901-8022df4466f9?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        createdAt: new Date().toISOString(),
      },
      {
        id: "course2",
        title: "Luganda Language and Culture",
        description: "Master the Luganda language and understand Ugandan cultural traditions, customs, and heritage.",
        instructorId: "instructor1",
        instructorName: "Dr. Sarah Nakato",
        institutionId: "inst1",
        enrolledStudents: ["student1", "student2", "student6"],
        image: "https://images.unsplash.com/photo-1481627834876-b7833e8f5570?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        createdAt: new Date().toISOString(),
      },
      {
        id: "course3",
        title: "Linear Algebra and Matrix Theory",
        description: "Mathematical foundations for machine learning and data science applications.",
        instructorId: "instructor2",
        instructorName: "Prof. Michael Okello",
        institutionId: "inst1",
        enrolledStudents: ["student1", "student2", "student6"],
        image: "https://images.unsplash.com/photo-1635070041078-e363dbe005cb?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        createdAt: new Date().toISOString(),
      },
      {
        id: "course4",
        title: "Full Stack Web Development",
        description: "Master modern web development with React, Node.js, and MongoDB.",
        instructorId: "instructor3",
        instructorName: "Dr. Jane Namukasa",
        institutionId: "inst2",
        enrolledStudents: ["student3", "student7"],
        image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        createdAt: new Date().toISOString(),
      },
      {
        id: "course5",
        title: "Mobile Application Development",
        description: "Build native and cross-platform mobile apps using React Native and Flutter.",
        instructorId: "instructor3",
        instructorName: "Dr. Jane Namukasa",
        institutionId: "inst2",
        enrolledStudents: ["student3"],
        image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        createdAt: new Date().toISOString(),
      },
      {
        id: "course6",
        title: "Network Security Fundamentals",
        description: "Learn cybersecurity principles, threat detection, and security protocols.",
        instructorId: "instructor4",
        instructorName: "Dr. David Kabugo",
        institutionId: "inst3",
        enrolledStudents: ["student4", "student8"],
        image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        createdAt: new Date().toISOString(),
      },
      {
        id: "course7",
        title: "Database Management Systems",
        description: "Comprehensive course on SQL, NoSQL databases, and data modeling.",
        instructorId: "instructor5",
        instructorName: "Prof. Mary Nakato",
        institutionId: "inst1",
        enrolledStudents: ["student1", "student2", "student6"],
        image: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        createdAt: new Date().toISOString(),
      },
      {
        id: "course8",
        title: "Business Management Principles",
        description: "Essential business skills including leadership, strategy, and operations.",
        instructorId: "instructor6",
        instructorName: "Dr. Peter Tumusiime",
        institutionId: "inst4",
        enrolledStudents: ["student5"],
        image: "https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        createdAt: new Date().toISOString(),
      },
      {
        id: "course9",
        title: "Machine Learning Basics",
        description: "Introduction to machine learning algorithms and their applications.",
        instructorId: "instructor2",
        instructorName: "Prof. Michael Okello",
        institutionId: "inst1",
        enrolledStudents: ["student2"],
        image: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        createdAt: new Date().toISOString(),
      },
      {
        id: "course10",
        title: "Cloud Computing",
        description: "Learn AWS, Azure, and Google Cloud Platform services and deployment.",
        instructorId: "instructor4",
        instructorName: "Dr. David Kabugo",
        institutionId: "inst3",
        enrolledStudents: ["student4", "student8"],
        image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80",
        createdAt: new Date().toISOString(),
      },
    ];

    // Exams
    this.exams = [
      {
        id: "exam1",
        title: "Agriculture Midterm Exam",
        description: "Covers farming techniques, crop management, and agricultural practices. 60 minutes duration.",
        courseId: "course1",
        courseName: "Introduction to Agriculture in Uganda",
        instructorId: "instructor1",
        instructorName: "Dr. Sarah Nakato",
        duration: 60,
        questions: [
          {
            id: "q1",
            question: "What is the primary growing season in Uganda?",
            options: ["January-March", "March-May and September-November", "June-August", "December only"],
            correctAnswer: 1,
            points: 10,
          },
          {
            id: "q2",
            question: "Which crop is Uganda's main cash crop?",
            options: ["Maize", "Coffee", "Rice", "Wheat"],
            correctAnswer: 1,
            points: 10,
          },
          {
            id: "q3",
            question: "What is crop rotation?",
            options: ["Planting the same crop every year", "Growing different crops in sequence on the same land", "Watering crops", "Harvesting crops"],
            correctAnswer: 1,
            points: 10,
          },
          {
            id: "q4",
            question: "Which farming method is most sustainable for Uganda's climate?",
            options: ["Monoculture", "Mixed farming", "Industrial farming", "None of the above"],
            correctAnswer: 1,
            points: 10,
          },
          {
            id: "q5",
            question: "What is the importance of organic matter in soil?",
            options: ["It has no importance", "It improves soil structure and fertility", "It harms crops", "It is expensive"],
            correctAnswer: 1,
            points: 10,
          },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: "exam2",
        title: "Linear Algebra Quiz 1",
        description: "Basic concepts of vectors, matrices, and linear transformations.",
        courseId: "course3",
        courseName: "Linear Algebra and Matrix Theory",
        instructorId: "instructor2",
        instructorName: "Prof. Michael Okello",
        duration: 45,
        questions: [
          {
            id: "q1",
            question: "What is the determinant of a 2x2 identity matrix?",
            options: ["0", "1", "2", "-1"],
            correctAnswer: 1,
            points: 20,
          },
          {
            id: "q2",
            question: "What is a vector in linear algebra?",
            options: ["A single number", "An ordered list of numbers", "A matrix", "A function"],
            correctAnswer: 1,
            points: 20,
          },
          {
            id: "q3",
            question: "What does it mean for vectors to be linearly independent?",
            options: ["They are parallel", "No vector can be written as a combination of others", "They have the same magnitude", "They are orthogonal"],
            correctAnswer: 1,
            points: 20,
          },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: "exam3",
        title: "Full Stack Development Assessment",
        description: "Testing knowledge of React, Node.js, and database concepts.",
        courseId: "course4",
        courseName: "Full Stack Web Development",
        instructorId: "instructor3",
        instructorName: "Dr. Jane Namukasa",
        duration: 90,
        questions: [
          {
            id: "q1",
            question: "What is React?",
            options: ["A database", "A JavaScript library for building user interfaces", "A programming language", "A server framework"],
            correctAnswer: 1,
            points: 15,
          },
          {
            id: "q2",
            question: "What is Node.js?",
            options: ["A database", "A JavaScript runtime built on Chrome's V8 engine", "A CSS framework", "A version control system"],
            correctAnswer: 1,
            points: 15,
          },
          {
            id: "q3",
            question: "What is MongoDB?",
            options: ["A relational database", "A NoSQL document database", "A programming language", "A web framework"],
            correctAnswer: 1,
            points: 15,
          },
          {
            id: "q4",
            question: "What is REST API?",
            options: ["A database", "An architectural style for designing web services", "A programming language", "A CSS framework"],
            correctAnswer: 1,
            points: 15,
          },
        ],
        createdAt: new Date().toISOString(),
      },
      {
        id: "exam4",
        title: "Database Systems Final Exam",
        description: "Comprehensive exam covering SQL, normalization, and database design.",
        courseId: "course7",
        courseName: "Database Management Systems",
        instructorId: "instructor5",
        instructorName: "Prof. Mary Nakato",
        duration: 120,
        questions: [
          {
            id: "q1",
            question: "What does SQL stand for?",
            options: ["Structured Query Language", "Simple Query Language", "Standard Query Language", "System Query Language"],
            correctAnswer: 0,
            points: 10,
          },
          {
            id: "q2",
            question: "What is a primary key?",
            options: ["A foreign key", "A unique identifier for a record", "A duplicate key", "An index"],
            correctAnswer: 1,
            points: 10,
          },
          {
            id: "q3",
            question: "What is database normalization?",
            options: ["Making databases larger", "Organizing data to reduce redundancy", "Deleting data", "Backing up data"],
            correctAnswer: 1,
            points: 10,
          },
        ],
        createdAt: new Date().toISOString(),
      },
    ];

    // Sessions
    const now = Date.now();
    const today = new Date();
    // Set to 10:00 AM today (or tomorrow if it's already past 10 AM)
    today.setHours(10, 0, 0, 0);
    if (today < new Date()) {
      today.setDate(today.getDate() + 1); // If past 10 AM, schedule for tomorrow
    }
    
    this.sessions = [
      {
        id: "session0",
        title: "Physics Q&A",
        description: "Interactive Q&A session on physics concepts and problem-solving techniques.",
        instructorId: "instructor2",
        instructorName: "Prof. Michael Okello",
        courseId: "course3",
        scheduledAt: today.toISOString(),
        duration: 60,
        maxParticipants: 25,
        participants: ["student1", "student2", "student6"],
      },
      {
        id: "session1",
        title: "Live Coding Session: React Basics",
        description: "Interactive coding session on React fundamentals and component development.",
        instructorId: "instructor1",
        instructorName: "Dr. Sarah Nakato",
        courseId: "course1",
        scheduledAt: new Date(now + 86400000).toISOString(), // Tomorrow
        duration: 90,
        maxParticipants: 30,
        participants: ["student1", "student2"],
      },
      {
        id: "session2",
        title: "Mathematics Problem Solving Workshop",
        description: "Solve complex linear algebra problems with step-by-step guidance.",
        instructorId: "instructor2",
        instructorName: "Prof. Michael Okello",
        courseId: "course3",
        scheduledAt: new Date(now + 172800000).toISOString(), // Day after tomorrow
        duration: 60,
        maxParticipants: 25,
        participants: ["student1", "student2", "student6"],
      },
      {
        id: "session3",
        title: "Full Stack Development Q&A",
        description: "Ask questions about React, Node.js, and full stack architecture.",
        instructorId: "instructor3",
        instructorName: "Dr. Jane Namukasa",
        courseId: "course4",
        scheduledAt: new Date(now + 259200000).toISOString(), // 3 days from now
        duration: 75,
        maxParticipants: 20,
        participants: ["student3", "student7"],
      },
      {
        id: "session4",
        title: "Cybersecurity Best Practices",
        description: "Learn about common security threats and how to protect your applications.",
        instructorId: "instructor4",
        instructorName: "Dr. David Kabugo",
        courseId: "course6",
        scheduledAt: new Date(now + 345600000).toISOString(), // 4 days from now
        duration: 90,
        maxParticipants: 35,
        participants: ["student4", "student8"],
      },
      {
        id: "session5",
        title: "Database Design Workshop",
        description: "Hands-on session on designing efficient database schemas.",
        instructorId: "instructor5",
        instructorName: "Prof. Mary Nakato",
        courseId: "course7",
        scheduledAt: new Date(now + 432000000).toISOString(), // 5 days from now
        duration: 120,
        maxParticipants: 15,
        participants: ["student1", "student2"],
      },
      {
        id: "session6",
        title: "Business Strategy Session",
        description: "Discuss modern business strategies and management principles.",
        instructorId: "instructor6",
        instructorName: "Dr. Peter Tumusiime",
        courseId: "course8",
        scheduledAt: new Date(now + 518400000).toISOString(), // 6 days from now
        duration: 60,
        maxParticipants: 40,
        participants: ["student5"],
      },
    ];

    // Exam Submissions
    this.examSubmissions = [
      {
        id: "submission1",
        examId: "exam1",
        studentId: "student1",
        studentName: "Nakato Mary",
        answers: { q1: 0, q2: 2, q3: 0, q4: 2, q5: 1 }, // 4.5 out of 5 correct ≈ 45/50 = 90%
        score: 45,
        totalPoints: 50,
        submittedAt: new Date(now - 86400000).toISOString(), // Yesterday
        status: "completed",
      },
      {
        id: "submission2",
        examId: "exam1",
        studentId: "student2",
        studentName: "Okello James",
        answers: { q1: 0, q2: 2, q3: 0, q4: 2, q5: 0 },
        score: 40,
        totalPoints: 50,
        submittedAt: new Date(now - 172800000).toISOString(), // 2 days ago
        status: "completed",
      },
      {
        id: "submission3",
        examId: "exam2",
        studentId: "student1",
        studentName: "Nakato Mary",
        answers: { q1: 1, q2: 1, q3: 0 }, // 2 out of 3 correct = 40/60, but adjusted to 53/60 = 88.33%
        score: 53,
        totalPoints: 60,
        submittedAt: new Date(now - 259200000).toISOString(), // 3 days ago
        status: "completed",
      },
      {
        id: "submission4",
        examId: "exam2",
        studentId: "student2",
        studentName: "Okello James",
        answers: { q1: 1, q2: 1, q3: 0 },
        score: 40,
        totalPoints: 60,
        submittedAt: new Date(now - 345600000).toISOString(), // 4 days ago
        status: "completed",
      },
      {
        id: "submission5",
        examId: "exam3",
        studentId: "student3",
        studentName: "Namukasa Alice",
        answers: { q1: 1, q2: 1, q3: 1, q4: 1 },
        score: 60,
        totalPoints: 60,
        submittedAt: new Date(now - 432000000).toISOString(), // 5 days ago
        status: "completed",
      },
      {
        id: "submission6",
        examId: "exam4",
        studentId: "student1",
        studentName: "Nakato Mary",
        answers: { q1: 0, q2: 1, q3: 1 }, // 2 out of 3 correct = 20/30, but adjusted to 26/30 = 86.67%
        score: 26,
        totalPoints: 30,
        submittedAt: new Date(now - 518400000).toISOString(), // 6 days ago
        status: "completed",
      },
    ];
  }

  // Auth methods
  setCurrentUser(user: User | null) {
    this.currentUser = user;
    // Persist to localStorage for page reloads/navigation
    if (typeof window !== "undefined") {
      if (user) {
        localStorage.setItem("currentUser", JSON.stringify(user));
      } else {
        localStorage.removeItem("currentUser");
      }
    }
  }

  getCurrentUser(): User | null {
    // First check in-memory
    if (this.currentUser) {
      return this.currentUser;
    }
    // Then check localStorage
    if (typeof window !== "undefined") {
      const stored = localStorage.getItem("currentUser");
      if (stored) {
        try {
          const user = JSON.parse(stored) as User;
          this.currentUser = user;
          return user;
        } catch (e) {
          // Invalid data, remove it
          localStorage.removeItem("currentUser");
        }
      }
    }
    return null;
  }

  async signIn(email: string, password: string): Promise<User | null> {
    // Mock: find user or create new one
    let user = this.users.find((u) => u.email === email);
    if (!user) {
      // Auto-create user (will need role assignment)
      user = {
        id: `user_${Date.now()}`,
        email,
        name: email.split("@")[0],
        role: "student" as const, // Default, will be updated by role selection
        createdAt: new Date().toISOString(),
      };
      this.users.push(user);
      this.saveToStorage(); // Persist the new user
    }
    this.setCurrentUser(user);
    return user;
  }

  async signUp(email: string, password: string, role: UserRole, name?: string): Promise<User> {
    const user: User = {
      id: `user_${Date.now()}`,
      email,
      name: name || email.split("@")[0],
      role,
      createdAt: new Date().toISOString(),
    };
    this.users.push(user);
    this.saveToStorage(); // Persist the new user
    this.setCurrentUser(user);
    return user;
  }

  async signOut(): Promise<void> {
    this.setCurrentUser(null);
  }

  // User methods
  async getUsers(filters?: { role?: UserRole; institutionId?: string }): Promise<User[]> {
    let result = [...this.users];
    if (filters?.role) {
      result = result.filter((u) => u.role === filters.role);
    }
    if (filters?.institutionId) {
      result = result.filter((u) => u.institutionId === filters.institutionId);
    }
    return result;
  }

  async getUserById(id: string): Promise<User | null> {
    return this.users.find((u) => u.id === id) || null;
  }

  async updateUser(id: string, updates: Partial<User>): Promise<User> {
    const index = this.users.findIndex((u) => u.id === id);
    if (index === -1) throw new Error("User not found");
    this.users[index] = { ...this.users[index], ...updates };
    this.saveToStorage(); // Persist user updates
    // Also update currentUser if it's the same user
    if (this.currentUser?.id === id) {
      this.setCurrentUser(this.users[index]);
    }
    return this.users[index];
  }

  // Course methods
  async getCourses(filters?: { instructorId?: string; studentId?: string }): Promise<Course[]> {
    let result = [...this.courses];
    if (filters?.instructorId) {
      result = result.filter((c) => c.instructorId === filters.instructorId);
    }
    if (filters?.studentId) {
      result = result.filter((c) => c.enrolledStudents?.includes(filters.studentId!));
    }
    return result;
  }

  async getCourseById(id: string): Promise<Course | null> {
    return this.courses.find((c) => c.id === id) || null;
  }

  async createCourse(course: Omit<Course, "id" | "createdAt">): Promise<Course> {
    const newCourse: Course = {
      ...course,
      id: `course_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.courses.push(newCourse);
    this.saveToStorage(); // Persist the new course
    return newCourse;
  }

  async enrollInCourse(courseId: string, studentId: string): Promise<void> {
    const course = this.courses.find((c) => c.id === courseId);
    if (course) {
      if (!course.enrolledStudents) {
        course.enrolledStudents = [];
      }
      if (!course.enrolledStudents.includes(studentId)) {
        course.enrolledStudents.push(studentId);
        this.saveToStorage(); // Persist the enrollment
        
        // Dispatch custom event to notify components of the change
        if (typeof window !== "undefined") {
          window.dispatchEvent(new CustomEvent("mockDbUpdated", { detail: { type: "enrollment", courseId, studentId } }));
        }
      }
    }
  }

  // Exam methods
  async getExams(filters?: { instructorId?: string; courseId?: string }): Promise<Exam[]> {
    let result = [...this.exams];
    if (filters?.instructorId) {
      result = result.filter((e) => e.instructorId === filters.instructorId);
    }
    if (filters?.courseId) {
      result = result.filter((e) => e.courseId === filters.courseId);
    }
    return result;
  }

  async getExamById(id: string): Promise<Exam | null> {
    return this.exams.find((e) => e.id === id) || null;
  }

  async createExam(exam: Omit<Exam, "id" | "createdAt">): Promise<Exam> {
    const newExam: Exam = {
      ...exam,
      id: `exam_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.exams.push(newExam);
    this.saveToStorage(); // Persist the new exam
    return newExam;
  }

  // Exam Submission methods
  async getExamSubmissions(filters?: { examId?: string; studentId?: string; instructorId?: string }): Promise<ExamSubmission[]> {
    let result = [...this.examSubmissions];
    if (filters?.examId) {
      result = result.filter((s) => s.examId === filters.examId);
    }
    if (filters?.studentId) {
      result = result.filter((s) => s.studentId === filters.studentId);
    }
    if (filters?.instructorId) {
      const instructorExams = this.exams.filter((e) => e.instructorId === filters.instructorId).map((e) => e.id);
      result = result.filter((s) => instructorExams.includes(s.examId));
    }
    return result;
  }

  async createExamSubmission(submission: Omit<ExamSubmission, "id" | "submittedAt">): Promise<ExamSubmission> {
    const newSubmission: ExamSubmission = {
      ...submission,
      id: `submission_${Date.now()}`,
      submittedAt: new Date().toISOString(),
    };
    this.examSubmissions.push(newSubmission);
    this.saveToStorage(); // Persist the new submission
    return newSubmission;
  }

  // Session methods
  async getSessions(filters?: { instructorId?: string; studentId?: string }): Promise<Session[]> {
    let result = [...this.sessions];
    if (filters?.instructorId) {
      result = result.filter((s) => s.instructorId === filters.instructorId);
    }
    if (filters?.studentId) {
      result = result.filter((s) => s.participants.includes(filters.studentId!));
    }
    return result;
  }

  async getSessionById(id: string): Promise<Session | null> {
    return this.sessions.find((s) => s.id === id) || null;
  }

  async createSession(session: Omit<Session, "id">): Promise<Session> {
    const newSession: Session = {
      ...session,
      id: `session_${Date.now()}`,
    };
    this.sessions.push(newSession);
    this.saveToStorage(); // Persist the new session
    return newSession;
  }

  // Institution methods
  async getInstitutions(): Promise<Institution[]> {
    return [...this.institutions];
  }

  async getInstitutionById(id: string): Promise<Institution | null> {
    return this.institutions.find((i) => i.id === id) || null;
  }

  // Message methods
  async getMessages(sessionId: string): Promise<Message[]> {
    return this.messages.filter((m) => m.sessionId === sessionId).sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async createMessage(message: Omit<Message, "id" | "createdAt">): Promise<Message> {
    const newMessage: Message = {
      ...message,
      id: `msg_${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    this.messages.push(newMessage);
    return newMessage;
  }
}

// Singleton instance
export const mockDb = new MockDatabase();

