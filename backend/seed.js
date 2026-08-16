/**
 * Seed Script — run with: npm run seed
 * Creates a demo recruiter + 6 sample jobs so the app shows data immediately.
 * Demo login: recruiter@demo.com / Demo@1234
 */

require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const User = require("./db/User");
const Recruiter = require("./db/Recruiter");
const Job = require("./db/Job");

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/jobPortal";

const jobs = [
  {
    title: "Frontend Developer",
    jobType: "Full Time",
    skillsets: ["React", "JavaScript", "CSS", "HTML"],
    salary: 60000,
    duration: 0,
    maxApplicants: 50,
    maxPositions: 3,
    deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Backend Engineer",
    jobType: "Full Time",
    skillsets: ["Node.js", "Express", "MongoDB", "REST API"],
    salary: 75000,
    duration: 0,
    maxApplicants: 40,
    maxPositions: 2,
    deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
  },
  {
    title: "UI/UX Designer",
    jobType: "Part Time",
    skillsets: ["Figma", "Adobe XD", "Prototyping"],
    salary: 35000,
    duration: 3,
    maxApplicants: 30,
    maxPositions: 2,
    deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
  },
  {
    title: "React Native Developer",
    jobType: "Work From Home",
    skillsets: ["React Native", "JavaScript", "Redux"],
    salary: 55000,
    duration: 6,
    maxApplicants: 25,
    maxPositions: 1,
    deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
  },
  {
    title: "Data Analyst",
    jobType: "Full Time",
    skillsets: ["Python", "SQL", "Tableau", "Excel"],
    salary: 50000,
    duration: 0,
    maxApplicants: 60,
    maxPositions: 4,
    deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
  },
  {
    title: "DevOps Engineer",
    jobType: "Full Time",
    skillsets: ["Docker", "Kubernetes", "AWS", "CI/CD"],
    salary: 90000,
    duration: 0,
    maxApplicants: 20,
    maxPositions: 1,
    deadline: new Date(Date.now() + 22 * 24 * 60 * 60 * 1000),
  },
];

async function seed() {
  await mongoose.connect(MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  console.log("Connected to MongoDB");

  // Check if demo recruiter already exists
  let user = await User.findOne({ email: "recruiter@demo.com" });

  if (!user) {
    const hash = await bcrypt.hash("Demo@1234", 10);
    user = await User.create({
      email: "recruiter@demo.com",
      password: hash,
      type: "recruiter",
    });
    await Recruiter.create({
      userId: user._id,
      name: "Demo Recruiter",
      bio: "We are a leading tech company hiring top talent.",
      contactNumber: "",
    });
    console.log("Created demo recruiter: recruiter@demo.com / Demo@1234");
  } else {
    console.log("Demo recruiter already exists, skipping user creation.");
  }

  // Remove old seed jobs for this recruiter and re-create
  await Job.deleteMany({ userId: user._id });

  const jobDocs = jobs.map((j) => ({ ...j, userId: user._id, rating: -1 }));
  await Job.insertMany(jobDocs);
  console.log(`Inserted ${jobDocs.length} sample jobs.`);

  console.log("\n✅ Seed complete!");
  console.log("   Login as recruiter: recruiter@demo.com / Demo@1234");
  console.log("   Or sign up as a new applicant to browse and apply.\n");

  await mongoose.disconnect();
  process.exit(0);
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
