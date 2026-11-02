/**
 * HackPulse — Database Seed Script
 * Seeds: 1 Admin + 3 Organizers + 5 Judges + 10 Participants + 55 Hackathons
 * Run: node seed.js
 */

require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

// ── Models ────────────────────────────────────────────────────────────────────
const User = require('./models/User');
const Hackathon = require('./models/Hackathon');

const MONGO_URI = process.env.MONGO_URI;

// ── Helpers ───────────────────────────────────────────────────────────────────
const daysFromNow = (n) => new Date(Date.now() + n * 24 * 60 * 60 * 1000);
const daysAgo = (n) => new Date(Date.now() - n * 24 * 60 * 60 * 1000);

const banners = [
  'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1518770660439-4636190af475?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1605810230434-7631ac76ec81?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1531297484001-80022131f5a1?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1519389950473-47ba0277781c?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1677442135703-1787eea5ce01?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1550745165-9bc0b252726f?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1614332287897-cdc485fa562d?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1568992687947-868a62a9f521?w=1200&auto=format&fit=crop&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80',
];

const rules = `1. Teams must consist of 2–5 members.
2. All code must be written during the hackathon duration.
3. Use of open-source libraries is permitted; pre-built proprietary solutions are not.
4. Projects must align with the stated hackathon theme.
5. Each team may submit only one project.
6. Plagiarism or copied work will result in immediate disqualification.
7. Participants must be respectful and maintain a professional environment.
8. Final submissions must include a GitHub repository link and a presentation PDF.
9. Teams must present their project to judges during the evaluation round.
10. Organizer decisions on rules interpretation are final.`;

const judgingCriteria = `Projects will be evaluated across the following 7 categories:
• Innovation (10 pts): Originality and uniqueness of the idea.
• Technical Complexity (10 pts): Depth and sophistication of implementation.
• User Interface (10 pts): Usability, design quality, and UX.
• Functionality (10 pts): Working features and completeness of the product.
• Scalability (10 pts): Potential for the solution to grow and scale.
• Documentation (10 pts): Quality of code comments, README, and presentation PDF.
• Presentation (10 pts): Clarity and confidence in pitching the project.
Total: 70 points.`;

// ── Seed Data ─────────────────────────────────────────────────────────────────

const usersData = [
  // Admin
  { name: 'Admin HackPulse', email: 'workwithgolu7@gmail.com', password: 'Admin@123', role: 'admin' },

  // Organizers
  { name: 'Priya Sharma', email: 'priya.organizer@hackpulse.com', password: 'Organizer@1', role: 'organizer' },
  { name: 'Rohan Mehta', email: 'rohan.organizer@hackpulse.com', password: 'Organizer@2', role: 'organizer' },
  { name: 'Ananya Singh', email: 'ananya.organizer@hackpulse.com', password: 'Organizer@3', role: 'organizer' },

  // Judges
  { name: 'Dr. Arjun Patel', email: 'arjun.judge@hackpulse.com', password: 'Judge@1234', role: 'judge' },
  { name: 'Ms. Kavita Reddy', email: 'kavita.judge@hackpulse.com', password: 'Judge@1234', role: 'judge' },
  { name: 'Mr. Vikram Nair', email: 'vikram.judge@hackpulse.com', password: 'Judge@1234', role: 'judge' },
  { name: 'Dr. Neha Gupta', email: 'neha.judge@hackpulse.com', password: 'Judge@1234', role: 'judge' },
  { name: 'Prof. Sanjay Kumar', email: 'sanjay.judge@hackpulse.com', password: 'Judge@1234', role: 'judge' },

  // Participants
  { name: 'Aarav Joshi', email: 'aarav@student.com', password: 'Student@1', role: 'participant' },
  { name: 'Diya Kapoor', email: 'diya@student.com', password: 'Student@1', role: 'participant' },
  { name: 'Ishan Verma', email: 'ishan@student.com', password: 'Student@1', role: 'participant' },
  { name: 'Meera Pillai', email: 'meera@student.com', password: 'Student@1', role: 'participant' },
  { name: 'Rahul Tiwari', email: 'rahul@student.com', password: 'Student@1', role: 'participant' },
  { name: 'Shreya Bose', email: 'shreya@student.com', password: 'Student@1', role: 'participant' },
  { name: 'Karan Malhotra', email: 'karan@student.com', password: 'Student@1', role: 'participant' },
  { name: 'Pooja Nambiar', email: 'pooja@student.com', password: 'Student@1', role: 'participant' },
  { name: 'Yash Agarwal', email: 'yash@student.com', password: 'Student@1', role: 'participant' },
  { name: 'Tanvi Desai', email: 'tanvi@student.com', password: 'Student@1', role: 'participant' },
];

// ── 55 Hackathons ─────────────────────────────────────────────────────────────
// createdBy is set dynamically after organizer users are created

const getHackathons = (organizerIds) => {
  const [org1, org2, org3] = organizerIds;

  return [
    // ── UPCOMING (15) ─────────────────────────────────────────
    {
      title: 'AI Frontier Challenge 2025',
      description: 'Build the next generation of AI-powered tools that solve real-world problems. Open to all engineering and computer science students across India. Push the boundaries of what artificial intelligence can do.',
      theme: 'Artificial Intelligence & Machine Learning',
      mode: 'Online', venue: 'Virtual (Discord + Devpost)', bannerImage: banners[0],
      startDate: daysFromNow(30), endDate: daysFromNow(32),
      registrationDeadline: daysFromNow(25), submissionDeadline: daysFromNow(32),
      prizePool: 150000, maxTeamSize: 4, status: 'Upcoming', isPublished: true,
      rules, judgingCriteria, createdBy: org1,
    },
    {
      title: 'GreenTech Hack 2025',
      description: 'Develop innovative technology solutions that address climate change, sustainability, and environmental protection. Build apps, hardware prototypes, or data models that contribute to a greener planet.',
      theme: 'Climate Tech & Sustainability',
      mode: 'Hybrid', venue: 'IIT Delhi + Online', bannerImage: banners[1],
      startDate: daysFromNow(45), endDate: daysFromNow(47),
      registrationDeadline: daysFromNow(38), submissionDeadline: daysFromNow(47),
      prizePool: 200000, maxTeamSize: 5, status: 'Upcoming', isPublished: true,
      rules, judgingCriteria, createdBy: org2,
    },
    {
      title: 'HealthHack India',
      description: 'Reimagine healthcare through technology. Build digital health tools, telemedicine platforms, diagnostic AI, or patient management systems that make quality healthcare accessible to everyone in India.',
      theme: 'Healthcare & MedTech',
      mode: 'Offline', venue: 'AIIMS Innovation Hub, New Delhi', bannerImage: banners[2],
      startDate: daysFromNow(60), endDate: daysFromNow(62),
      registrationDeadline: daysFromNow(50), submissionDeadline: daysFromNow(62),
      prizePool: 100000, maxTeamSize: 4, status: 'Upcoming', isPublished: true,
      rules, judgingCriteria, createdBy: org3,
    },
    {
      title: 'FinTech Disrupt 2025',
      description: 'Revolutionize the financial services industry with cutting-edge technology. Build solutions for payments, lending, investment, insurance, or financial inclusion for India\'s underbanked population.',
      theme: 'Financial Technology',
      mode: 'Online', venue: 'Virtual Platform', bannerImage: banners[3],
      startDate: daysFromNow(20), endDate: daysFromNow(22),
      registrationDeadline: daysFromNow(15), submissionDeadline: daysFromNow(22),
      prizePool: 250000, maxTeamSize: 5, status: 'Upcoming', isPublished: true,
      rules, judgingCriteria, createdBy: org1,
    },
    {
      title: 'Smart City Hackathon',
      description: 'Design and build technology solutions for smarter, more efficient, and more livable cities. Focus areas: traffic management, waste management, public safety, energy efficiency, or citizen services.',
      theme: 'Smart Cities & Urban Tech',
      mode: 'Hybrid', venue: 'NIT Trichy + Zoom', bannerImage: banners[4],
      startDate: daysFromNow(55), endDate: daysFromNow(57),
      registrationDeadline: daysFromNow(48), submissionDeadline: daysFromNow(57),
      prizePool: 120000, maxTeamSize: 4, status: 'Upcoming', isPublished: true,
      rules, judgingCriteria, createdBy: org2,
    },
    {
      title: 'Blockchain Build Sprint',
      description: 'Create decentralized applications, DeFi protocols, NFT platforms, or blockchain-based supply chain solutions. This hackathon welcomes both Web3 natives and developers new to the blockchain ecosystem.',
      theme: 'Blockchain & Web3',
      mode: 'Online', venue: 'Virtual (Notion + GitHub)', bannerImage: banners[5],
      startDate: daysFromNow(40), endDate: daysFromNow(42),
      registrationDeadline: daysFromNow(33), submissionDeadline: daysFromNow(42),
      prizePool: 180000, maxTeamSize: 3, status: 'Upcoming', isPublished: true,
      rules, judgingCriteria, createdBy: org3,
    },
    {
      title: 'EduTech Innovation Cup',
      description: 'Build the future of education with technology. Create learning management systems, AR/VR educational experiences, personalized learning AI, or accessible educational tools for students with disabilities.',
      theme: 'Education Technology',
      mode: 'Offline', venue: 'Tata Institute of Social Sciences, Mumbai', bannerImage: banners[6],
      startDate: daysFromNow(70), endDate: daysFromNow(72),
      registrationDeadline: daysFromNow(62), submissionDeadline: daysFromNow(72),
      prizePool: 80000, maxTeamSize: 5, status: 'Upcoming', isPublished: true,
      rules, judgingCriteria, createdBy: org1,
    },
    {
      title: 'CyberSec CTF & Build',
      description: 'A dual-format event: Capture The Flag challenges followed by a 24-hour build sprint where teams create cybersecurity tools, intrusion detection systems, or privacy-preserving technologies.',
      theme: 'Cybersecurity & Privacy',
      mode: 'Online', venue: 'Virtual CTF Platform', bannerImage: banners[7],
      startDate: daysFromNow(35), endDate: daysFromNow(36),
      registrationDeadline: daysFromNow(28), submissionDeadline: daysFromNow(36),
      prizePool: 90000, maxTeamSize: 4, status: 'Upcoming', isPublished: false,
      rules, judgingCriteria, createdBy: org2,
    },
    {
      title: 'AgriTech Harvest Hack',
      description: 'Transform agriculture with technology. Build precision farming tools, crop disease detection AI, supply chain optimization, farm management apps, or market linkage platforms for Indian farmers.',
      theme: 'Agriculture & Food Tech',
      mode: 'Hybrid', venue: 'IARI Campus, New Delhi + Online', bannerImage: banners[8],
      startDate: daysFromNow(80), endDate: daysFromNow(82),
      registrationDeadline: daysFromNow(72), submissionDeadline: daysFromNow(82),
      prizePool: 75000, maxTeamSize: 5, status: 'Upcoming', isPublished: true,
      rules, judgingCriteria, createdBy: org3,
    },
    {
      title: 'Space Tech Frontier',
      description: 'Collaborate with ISRO scientists and build applications using satellite data, space imagery analysis tools, mission planning software, or technologies that advance space exploration.',
      theme: 'Space Technology & Astronomy',
      mode: 'Offline', venue: 'ISRO Space Applications Centre, Ahmedabad', bannerImage: banners[9],
      startDate: daysFromNow(90), endDate: daysFromNow(93),
      registrationDeadline: daysFromNow(80), submissionDeadline: daysFromNow(93),
      prizePool: 300000, maxTeamSize: 5, status: 'Upcoming', isPublished: true,
      rules, judgingCriteria, createdBy: org1,
    },
    {
      title: 'GenAI Builders Hackathon',
      description: 'Build production-ready applications powered by Large Language Models, image generation, audio synthesis, or multimodal AI. Participants get free API credits for OpenAI, Anthropic, and Google Gemini.',
      theme: 'Generative AI & LLMs',
      mode: 'Online', venue: 'Virtual (Slack + Replit)', bannerImage: banners[0],
      startDate: daysFromNow(15), endDate: daysFromNow(17),
      registrationDeadline: daysFromNow(10), submissionDeadline: daysFromNow(17),
      prizePool: 220000, maxTeamSize: 4, status: 'Upcoming', isPublished: true,
      rules, judgingCriteria, createdBy: org2,
    },
    {
      title: 'Open Source Sprint',
      description: 'A 48-hour hackathon dedicated to contributing to open source projects. Teams pick an existing open source project, make meaningful contributions, and pitch their improvements to a panel of maintainers.',
      theme: 'Open Source & Developer Tools',
      mode: 'Online', venue: 'GitHub + Discord', bannerImage: banners[1],
      startDate: daysFromNow(50), endDate: daysFromNow(52),
      registrationDeadline: daysFromNow(44), submissionDeadline: daysFromNow(52),
      prizePool: 60000, maxTeamSize: 3, status: 'Upcoming', isPublished: true,
      rules, judgingCriteria, createdBy: org3,
    },
    {
      title: 'Women in Tech Hackathon',
      description: 'An inclusive hackathon exclusively for women and non-binary developers. Build any technology product that empowers communities, solves social problems, or demonstrates technical excellence.',
      theme: 'Social Impact & Inclusion',
      mode: 'Hybrid', venue: 'Google India Office, Bengaluru + Online', bannerImage: banners[2],
      startDate: daysFromNow(65), endDate: daysFromNow(67),
      registrationDeadline: daysFromNow(57), submissionDeadline: daysFromNow(67),
      prizePool: 150000, maxTeamSize: 4, status: 'Upcoming', isPublished: true,
      rules, judgingCriteria, createdBy: org1,
    },
    {
      title: 'IoT Connect Challenge',
      description: 'Build connected device solutions using IoT hardware and cloud platforms. Prototype smart home devices, industrial monitoring systems, wearable tech, or connected healthcare monitoring devices.',
      theme: 'Internet of Things & Hardware',
      mode: 'Offline', venue: 'Maker\'s Asylum, Mumbai', bannerImage: banners[3],
      startDate: daysFromNow(100), endDate: daysFromNow(103),
      registrationDeadline: daysFromNow(90), submissionDeadline: daysFromNow(103),
      prizePool: 110000, maxTeamSize: 5, status: 'Upcoming', isPublished: false,
      rules, judgingCriteria, createdBy: org2,
    },
    {
      title: 'DataViz Grand Prix',
      description: 'Transform complex datasets into compelling visual stories. Build interactive dashboards, infographic tools, or data journalism pieces using open government datasets, climate data, or public health data.',
      theme: 'Data Science & Visualization',
      mode: 'Online', venue: 'Virtual (Figma + Observable)', bannerImage: banners[4],
      startDate: daysFromNow(25), endDate: daysFromNow(27),
      registrationDeadline: daysFromNow(18), submissionDeadline: daysFromNow(27),
      prizePool: 70000, maxTeamSize: 3, status: 'Upcoming', isPublished: true,
      rules, judgingCriteria, createdBy: org3,
    },

    // ── REGISTRATION OPEN (12) ──────────────────────────────
    {
      title: 'HackMIT India Chapter',
      description: 'India\'s premier student hackathon modeled after MIT\'s flagship event. Build ambitious projects across any domain — AI, climate, health, education, or social impact. Top projects get mentored by MIT alumni.',
      theme: 'Open Innovation',
      mode: 'Offline', venue: 'IIT Bombay, Powai Campus', bannerImage: banners[5],
      startDate: daysFromNow(14), endDate: daysFromNow(16),
      registrationDeadline: daysFromNow(7), submissionDeadline: daysFromNow(16),
      prizePool: 500000, maxTeamSize: 5, status: 'Registration Open', isPublished: true,
      rules, judgingCriteria, createdBy: org1,
    },
    {
      title: 'Hack for Good 2025',
      description: 'Build technology for social good. Address the UN Sustainable Development Goals through innovative apps, platforms, or hardware. NGO partners will pitch real problems for teams to solve.',
      theme: 'Social Impact & NGO Tech',
      mode: 'Hybrid', venue: 'UN House, New Delhi + Online', bannerImage: banners[6],
      startDate: daysFromNow(10), endDate: daysFromNow(12),
      registrationDeadline: daysFromNow(5), submissionDeadline: daysFromNow(12),
      prizePool: 130000, maxTeamSize: 4, status: 'Registration Open', isPublished: true,
      rules, judgingCriteria, createdBy: org2,
    },
    {
      title: 'MobileFirst Hackathon',
      description: 'Design and build native or cross-platform mobile applications with stunning UX, offline-first capabilities, or breakthrough performance. Focus on solving India\'s mobile-first consumer problems.',
      theme: 'Mobile App Development',
      mode: 'Online', venue: 'Virtual (Figma + Expo)', bannerImage: banners[7],
      startDate: daysFromNow(12), endDate: daysFromNow(14),
      registrationDeadline: daysFromNow(6), submissionDeadline: daysFromNow(14),
      prizePool: 85000, maxTeamSize: 3, status: 'Registration Open', isPublished: true,
      rules, judgingCriteria, createdBy: org3,
    },
    {
      title: 'Cloud Native Build-Off',
      description: 'Architect and deploy cloud-native applications using Kubernetes, serverless functions, microservices, or edge computing. Participants get AWS and GCP credits. Best deployed solution wins.',
      theme: 'Cloud Computing & DevOps',
      mode: 'Online', venue: 'Virtual (AWS + GCP platforms)', bannerImage: banners[8],
      startDate: daysFromNow(8), endDate: daysFromNow(10),
      registrationDeadline: daysFromNow(4), submissionDeadline: daysFromNow(10),
      prizePool: 160000, maxTeamSize: 4, status: 'Registration Open', isPublished: true,
      rules, judgingCriteria, createdBy: org1,
    },
    {
      title: 'GameDev Jam India',
      description: 'Build a fully playable video game in 48 hours. Any engine (Unity, Unreal, Godot, or web-based), any genre. Judged on gameplay, creativity, polish, and technical execution.',
      theme: 'Game Development & Interactive Media',
      mode: 'Online', venue: 'Virtual (itch.io)', bannerImage: banners[9],
      startDate: daysFromNow(9), endDate: daysFromNow(11),
      registrationDeadline: daysFromNow(5), submissionDeadline: daysFromNow(11),
      prizePool: 95000, maxTeamSize: 4, status: 'Registration Open', isPublished: true,
      rules, judgingCriteria, createdBy: org2,
    },
    {
      title: 'AR/VR Immersive Hack',
      description: 'Create immersive augmented or virtual reality experiences for education, therapy, training, or entertainment. Hardware kits (Meta Quest, ARCore devices) available for select on-site teams.',
      theme: 'Augmented & Virtual Reality',
      mode: 'Hybrid', venue: 'Microsoft Reactor, Bengaluru + Online', bannerImage: banners[0],
      startDate: daysFromNow(11), endDate: daysFromNow(13),
      registrationDeadline: daysFromNow(6), submissionDeadline: daysFromNow(13),
      prizePool: 175000, maxTeamSize: 5, status: 'Registration Open', isPublished: true,
      rules, judgingCriteria, createdBy: org3,
    },
    {
      title: 'NLP Language Hack',
      description: 'Build natural language processing tools for Indian languages. Create translators, sentiment analyzers, text summarizers, voice assistants, or accessibility tools for India\'s 22 official languages.',
      theme: 'Natural Language Processing',
      mode: 'Online', venue: 'Virtual (Hugging Face + Spaces)', bannerImage: banners[1],
      startDate: daysFromNow(13), endDate: daysFromNow(15),
      registrationDeadline: daysFromNow(7), submissionDeadline: daysFromNow(15),
      prizePool: 140000, maxTeamSize: 4, status: 'Registration Open', isPublished: true,
      rules, judgingCriteria, createdBy: org1,
    },
    {
      title: 'RetailTech Hackathon',
      description: 'Reinvent the retail experience for India. Build inventory management tools, personalized shopping AI, supply chain optimization, or omnichannel customer experience platforms for India\'s growing retail sector.',
      theme: 'Retail & E-Commerce Technology',
      mode: 'Offline', venue: 'Flipkart HQ, Bengaluru', bannerImage: banners[2],
      startDate: daysFromNow(10), endDate: daysFromNow(12),
      registrationDeadline: daysFromNow(5), submissionDeadline: daysFromNow(12),
      prizePool: 200000, maxTeamSize: 5, status: 'Registration Open', isPublished: true,
      rules, judgingCriteria, createdBy: org2,
    },
    {
      title: 'Robotics & Automation Hack',
      description: 'Program autonomous systems, build robot control interfaces, or develop computer vision solutions for industrial automation. Simulation environments provided for teams without physical hardware.',
      theme: 'Robotics & Automation',
      mode: 'Offline', venue: 'IIT Madras Research Park', bannerImage: banners[3],
      startDate: daysFromNow(7), endDate: daysFromNow(9),
      registrationDeadline: daysFromNow(3), submissionDeadline: daysFromNow(9),
      prizePool: 210000, maxTeamSize: 5, status: 'Registration Open', isPublished: true,
      rules, judgingCriteria, createdBy: org3,
    },
    {
      title: 'LegalTech Access Hackathon',
      description: 'Make legal services accessible through technology. Build contract analysis AI, legal chatbots, case management tools, or platforms that connect underserved communities with pro bono legal aid.',
      theme: 'Legal Technology & Access to Justice',
      mode: 'Online', venue: 'Virtual', bannerImage: banners[4],
      startDate: daysFromNow(6), endDate: daysFromNow(8),
      registrationDeadline: daysFromNow(2), submissionDeadline: daysFromNow(8),
      prizePool: 65000, maxTeamSize: 3, status: 'Registration Open', isPublished: true,
      rules, judgingCriteria, createdBy: org1,
    },
    {
      title: 'Quantum Computing Hackathon',
      description: 'Explore quantum algorithms and build quantum-ready applications. IBM Quantum and Qiskit environments provided. No prior quantum computing experience required — workshops available before the event.',
      theme: 'Quantum Computing',
      mode: 'Online', venue: 'Virtual (IBM Quantum Lab)', bannerImage: banners[5],
      startDate: daysFromNow(16), endDate: daysFromNow(18),
      registrationDeadline: daysFromNow(9), submissionDeadline: daysFromNow(18),
      prizePool: 280000, maxTeamSize: 4, status: 'Registration Open', isPublished: true,
      rules, judgingCriteria, createdBy: org2,
    },
    {
      title: 'Travel & Tourism Tech Hack',
      description: 'Reimagine travel experiences for post-pandemic India. Build smart booking systems, personalized itinerary planners, sustainable travel apps, or solutions for rural and heritage tourism promotion.',
      theme: 'Travel & Hospitality Technology',
      mode: 'Hybrid', venue: 'MakeMyTrip HQ, Gurugram + Online', bannerImage: banners[6],
      startDate: daysFromNow(8), endDate: daysFromNow(10),
      registrationDeadline: daysFromNow(4), submissionDeadline: daysFromNow(10),
      prizePool: 90000, maxTeamSize: 4, status: 'Registration Open', isPublished: true,
      rules, judgingCriteria, createdBy: org3,
    },

    // ── REGISTRATION CLOSED (6) ─────────────────────────────
    {
      title: 'HackElect — Election Tech Challenge',
      description: 'Build transparent, accessible, and secure election technology. Create voter registration tools, election monitoring dashboards, misinformation detection systems, or civic engagement platforms.',
      theme: 'Civic Technology & Democracy',
      mode: 'Online', venue: 'Virtual', bannerImage: banners[7],
      startDate: daysFromNow(3), endDate: daysFromNow(5),
      registrationDeadline: daysAgo(2), submissionDeadline: daysFromNow(5),
      prizePool: 120000, maxTeamSize: 4, status: 'Registration Closed', isPublished: true,
      rules, judgingCriteria, createdBy: org1,
    },
    {
      title: 'AccessTech — Disability Inclusion Hack',
      description: 'Build assistive technologies and inclusive digital experiences for people with visual, auditory, motor, or cognitive disabilities. Consultation sessions with disability advocates available throughout the event.',
      theme: 'Accessibility & Assistive Technology',
      mode: 'Hybrid', venue: 'NIMHANS, Bengaluru + Online', bannerImage: banners[8],
      startDate: daysFromNow(2), endDate: daysFromNow(4),
      registrationDeadline: daysAgo(3), submissionDeadline: daysFromNow(4),
      prizePool: 100000, maxTeamSize: 5, status: 'Registration Closed', isPublished: true,
      rules, judgingCriteria, createdBy: org2,
    },
    {
      title: 'Logistics & Supply Chain Hack',
      description: 'Optimize India\'s complex logistics landscape. Build route optimization engines, last-mile delivery solutions, warehouse automation tools, or cross-border trade facilitation platforms.',
      theme: 'Logistics & Supply Chain',
      mode: 'Online', venue: 'Virtual', bannerImage: banners[9],
      startDate: daysFromNow(4), endDate: daysFromNow(6),
      registrationDeadline: daysAgo(1), submissionDeadline: daysFromNow(6),
      prizePool: 145000, maxTeamSize: 4, status: 'Registration Closed', isPublished: true,
      rules, judgingCriteria, createdBy: org3,
    },
    {
      title: 'Mental Health Tech Sprint',
      description: 'Address India\'s mental health crisis through technology. Build therapy apps, mood tracking tools, peer support platforms, burnout detection systems, or mental wellness resources for college students.',
      theme: 'Mental Health & Wellness Tech',
      mode: 'Online', venue: 'Virtual', bannerImage: banners[0],
      startDate: daysFromNow(5), endDate: daysFromNow(7),
      registrationDeadline: daysAgo(2), submissionDeadline: daysFromNow(7),
      prizePool: 85000, maxTeamSize: 4, status: 'Registration Closed', isPublished: true,
      rules, judgingCriteria, createdBy: org1,
    },
    {
      title: 'PropTech India Hackathon',
      description: 'Disrupt India\'s real estate sector with technology. Build property discovery platforms, virtual property tours, smart home management systems, rental management apps, or affordable housing tech.',
      theme: 'Real Estate & Property Technology',
      mode: 'Hybrid', venue: '99acres HQ, Noida + Online', bannerImage: banners[1],
      startDate: daysFromNow(3), endDate: daysFromNow(5),
      registrationDeadline: daysAgo(4), submissionDeadline: daysFromNow(5),
      prizePool: 170000, maxTeamSize: 5, status: 'Registration Closed', isPublished: true,
      rules, judgingCriteria, createdBy: org2,
    },
    {
      title: 'Energy & CleanTech Hack',
      description: 'Build software and hardware solutions for India\'s clean energy transition. Focus on solar energy management, EV charging networks, energy storage optimization, or smart grid monitoring tools.',
      theme: 'Clean Energy & Sustainability',
      mode: 'Offline', venue: 'TERI Headquarters, New Delhi', bannerImage: banners[2],
      startDate: daysFromNow(4), endDate: daysFromNow(6),
      registrationDeadline: daysAgo(3), submissionDeadline: daysFromNow(6),
      prizePool: 190000, maxTeamSize: 5, status: 'Registration Closed', isPublished: true,
      rules, judgingCriteria, createdBy: org3,
    },

    // ── ONGOING (8) ─────────────────────────────────────────
    {
      title: 'HackIndia National Championship',
      description: 'India\'s largest annual student hackathon with participants from over 500 colleges. Build any product that demonstrates technical excellence, innovation, and real-world applicability. Grand finale with 10 million rupees in prizes.',
      theme: 'Open Innovation — Any Domain',
      mode: 'Hybrid', venue: 'Pragati Maidan, New Delhi + Virtual', bannerImage: banners[3],
      startDate: daysAgo(1), endDate: daysFromNow(1),
      registrationDeadline: daysAgo(10), submissionDeadline: daysFromNow(1),
      prizePool: 1000000, maxTeamSize: 5, status: 'Ongoing', isPublished: true,
      rules, judgingCriteria, createdBy: org1,
    },
    {
      title: 'Computer Vision Hackathon',
      description: 'Build real-world computer vision applications: object detection, facial recognition, medical image analysis, autonomous vehicle systems, or quality control automation for manufacturing.',
      theme: 'Computer Vision & Image Processing',
      mode: 'Online', venue: 'Virtual (Roboflow + Colab)', bannerImage: banners[4],
      startDate: daysAgo(1), endDate: daysFromNow(1),
      registrationDeadline: daysAgo(8), submissionDeadline: daysFromNow(1),
      prizePool: 135000, maxTeamSize: 4, status: 'Ongoing', isPublished: true,
      rules, judgingCriteria, createdBy: org2,
    },
    {
      title: 'Social Media Analytics Hack',
      description: 'Harness social media data to build trend analysis tools, influencer marketing platforms, brand sentiment dashboards, or fake news detection systems using real-time data streams from Twitter and Instagram APIs.',
      theme: 'Social Media & Data Analytics',
      mode: 'Online', venue: 'Virtual', bannerImage: banners[5],
      startDate: daysAgo(1), endDate: daysFromNow(2),
      registrationDeadline: daysAgo(9), submissionDeadline: daysFromNow(2),
      prizePool: 75000, maxTeamSize: 3, status: 'Ongoing', isPublished: true,
      rules, judgingCriteria, createdBy: org3,
    },
    {
      title: 'Smart Agriculture IoT Sprint',
      description: 'Build precision farming solutions using IoT sensors, satellite imagery, and machine learning. Develop soil health monitors, automated irrigation controllers, crop yield predictors, or livestock tracking systems.',
      theme: 'AgriTech & IoT',
      mode: 'Offline', venue: 'Punjab Agricultural University, Ludhiana', bannerImage: banners[6],
      startDate: daysAgo(2), endDate: daysFromNow(1),
      registrationDeadline: daysAgo(14), submissionDeadline: daysFromNow(1),
      prizePool: 95000, maxTeamSize: 5, status: 'Ongoing', isPublished: true,
      rules, judgingCriteria, createdBy: org1,
    },
    {
      title: 'API Economy Hackathon',
      description: 'Build powerful integrations, developer tools, or SaaS products using public APIs. Create API marketplaces, workflow automation tools, or multi-platform integrations that make developers\' lives easier.',
      theme: 'Developer Tools & API Integration',
      mode: 'Online', venue: 'Virtual (RapidAPI platform)', bannerImage: banners[7],
      startDate: daysAgo(1), endDate: daysFromNow(2),
      registrationDeadline: daysAgo(7), submissionDeadline: daysFromNow(2),
      prizePool: 110000, maxTeamSize: 4, status: 'Ongoing', isPublished: true,
      rules, judgingCriteria, createdBy: org2,
    },
    {
      title: 'EdTech for Rural India',
      description: 'Build offline-first educational tools, SMS-based learning platforms, or low-bandwidth applications that bring quality education to rural India where internet connectivity is limited or non-existent.',
      theme: 'Rural Education & Digital Inclusion',
      mode: 'Hybrid', venue: 'IIM Ahmedabad + Online', bannerImage: banners[8],
      startDate: daysAgo(2), endDate: daysFromNow(1),
      registrationDeadline: daysAgo(12), submissionDeadline: daysFromNow(1),
      prizePool: 80000, maxTeamSize: 4, status: 'Ongoing', isPublished: true,
      rules, judgingCriteria, createdBy: org3,
    },
    {
      title: 'HR Tech Innovation Sprint',
      description: 'Transform the human resources function through technology. Build AI-powered resume screening, employee engagement platforms, predictive attrition models, skill assessment tools, or remote work management systems.',
      theme: 'Human Resources Technology',
      mode: 'Online', venue: 'Virtual', bannerImage: banners[9],
      startDate: daysAgo(1), endDate: daysFromNow(1),
      registrationDeadline: daysAgo(6), submissionDeadline: daysFromNow(1),
      prizePool: 70000, maxTeamSize: 3, status: 'Ongoing', isPublished: true,
      rules, judgingCriteria, createdBy: org1,
    },
    {
      title: '5G Applications Challenge',
      description: 'Build applications that leverage 5G ultra-low latency and high bandwidth capabilities. Create remote surgery platforms, autonomous drone control, real-time AR collaboration, or smart factory solutions.',
      theme: '5G & Next-Gen Connectivity',
      mode: 'Offline', venue: 'Reliance Jio HQ, Mumbai', bannerImage: banners[0],
      startDate: daysAgo(1), endDate: daysFromNow(2),
      registrationDeadline: daysAgo(11), submissionDeadline: daysFromNow(2),
      prizePool: 350000, maxTeamSize: 5, status: 'Ongoing', isPublished: true,
      rules, judgingCriteria, createdBy: org2,
    },

    // ── COMPLETED (14) ──────────────────────────────────────
    {
      title: 'HackFest Winter 2024',
      description: 'Build innovative solutions across any technology domain. This flagship winter hackathon attracted over 800 participants from 150+ colleges across India. Projects covered AI, sustainability, health, and smart cities.',
      theme: 'Open Innovation',
      mode: 'Hybrid', venue: 'IIT Delhi + Virtual', bannerImage: banners[1],
      startDate: daysAgo(45), endDate: daysAgo(43),
      registrationDeadline: daysAgo(55), submissionDeadline: daysAgo(43),
      prizePool: 400000, maxTeamSize: 5, status: 'Completed', isPublished: true,
      resultPublished: true,
      winnerAnnouncement: '🏆 Congratulations to Team NeuralNexus (1st), Team GreenByte (2nd), and Team HealthAI (3rd)!',
      rules, judgingCriteria, createdBy: org3,
    },
    {
      title: 'AI for Healthcare Hackathon',
      description: 'Develop AI solutions addressing India\'s healthcare challenges — from rural diagnostics to hospital efficiency. This event partnered with Apollo Hospitals and Practo to provide real patient data (anonymized).',
      theme: 'AI in Healthcare',
      mode: 'Online', venue: 'Virtual', bannerImage: banners[2],
      startDate: daysAgo(60), endDate: daysAgo(58),
      registrationDeadline: daysAgo(70), submissionDeadline: daysAgo(58),
      prizePool: 250000, maxTeamSize: 4, status: 'Completed', isPublished: true,
      resultPublished: true,
      winnerAnnouncement: 'Team DiagnostAI takes home the gold! Runners up: Team PulseCheck and Team MedBot.',
      rules, judgingCriteria, createdBy: org1,
    },
    {
      title: 'FinHack 2024',
      description: 'Financial technology hackathon focused on UPI innovations, BNPL platforms, credit scoring for the unbanked, and open banking API integrations. Sponsored by Razorpay, PhonePe, and NPCI.',
      theme: 'Financial Inclusion & FinTech',
      mode: 'Offline', venue: 'Bombay Stock Exchange, Mumbai', bannerImage: banners[3],
      startDate: daysAgo(80), endDate: daysAgo(78),
      registrationDeadline: daysAgo(90), submissionDeadline: daysAgo(78),
      prizePool: 600000, maxTeamSize: 5, status: 'Completed', isPublished: true,
      resultPublished: true,
      winnerAnnouncement: 'PayEasy AI wins FinHack 2024! Special mention: CreditBridge and UPI Analytics Dashboard teams.',
      rules, judgingCriteria, createdBy: org2,
    },
    {
      title: 'Smart India Hackathon — Regional Qualifier',
      description: 'Regional qualifier for the national Smart India Hackathon. Teams solved problem statements provided by 12 government ministries including Railways, Health, Agriculture, and Education.',
      theme: 'Government & Public Services',
      mode: 'Offline', venue: 'VIT University, Vellore', bannerImage: banners[4],
      startDate: daysAgo(30), endDate: daysAgo(28),
      registrationDeadline: daysAgo(40), submissionDeadline: daysAgo(28),
      prizePool: 180000, maxTeamSize: 6, status: 'Completed', isPublished: true,
      resultPublished: true,
      winnerAnnouncement: '3 teams qualify for the national finals! KrishiScan, RailSafe AI, and EduConnect win regional spots.',
      rules, judgingCriteria, createdBy: org3,
    },
    {
      title: 'CryptoHack 2024',
      description: 'A Web3 and blockchain hackathon with problem statements from leading DeFi protocols. Build decentralized exchanges, NFT marketplaces, DAO governance tools, or cross-chain bridge solutions.',
      theme: 'Web3 & DeFi',
      mode: 'Online', venue: 'Virtual (ETHGlobal platform)', bannerImage: banners[5],
      startDate: daysAgo(50), endDate: daysAgo(48),
      registrationDeadline: daysAgo(60), submissionDeadline: daysAgo(48),
      prizePool: 450000, maxTeamSize: 4, status: 'Completed', isPublished: true,
      resultPublished: false,
      winnerAnnouncement: '',
      rules, judgingCriteria, createdBy: org1,
    },
    {
      title: 'CodeForChange Monsoon 2024',
      description: 'Social impact hackathon held during monsoon season addressing water scarcity, flood management, and water quality monitoring. Teams built IoT water sensors, flood prediction models, and clean water access maps.',
      theme: 'Water & Climate Resilience',
      mode: 'Hybrid', venue: 'TISS Mumbai + Online', bannerImage: banners[6],
      startDate: daysAgo(90), endDate: daysAgo(88),
      registrationDeadline: daysAgo(100), submissionDeadline: daysAgo(88),
      prizePool: 95000, maxTeamSize: 5, status: 'Completed', isPublished: true,
      resultPublished: true,
      winnerAnnouncement: 'FloodGuard AI wins! AquaSense and RainMapper teams receive special recognition awards.',
      rules, judgingCriteria, createdBy: org2,
    },
    {
      title: 'Startup Hack — Build Your MVP',
      description: 'A 36-hour hackathon designed for aspiring entrepreneurs. Build a complete Minimum Viable Product with market research, business model canvas, technical prototype, and investor pitch deck.',
      theme: 'Entrepreneurship & Startup',
      mode: 'Offline', venue: 'T-Hub, Hyderabad', bannerImage: banners[7],
      startDate: daysAgo(35), endDate: daysAgo(33),
      registrationDeadline: daysAgo(45), submissionDeadline: daysAgo(33),
      prizePool: 300000, maxTeamSize: 4, status: 'Completed', isPublished: true,
      resultPublished: true,
      winnerAnnouncement: 'EduLink secures ₹10L seed funding offer! AgroFintech and SafeCity win runner-up prizes.',
      rules, judgingCriteria, createdBy: org3,
    },
    {
      title: 'NLP India Challenge 2024',
      description: 'Natural language processing competition focused on Indian language understanding. Tasks included machine translation between 10 Indian languages, named entity recognition in regional news, and hate speech detection.',
      theme: 'Indian Languages & NLP',
      mode: 'Online', venue: 'Virtual (Kaggle + HuggingFace)', bannerImage: banners[8],
      startDate: daysAgo(70), endDate: daysAgo(68),
      registrationDeadline: daysAgo(80), submissionDeadline: daysAgo(68),
      prizePool: 160000, maxTeamSize: 3, status: 'Completed', isPublished: true,
      resultPublished: true,
      winnerAnnouncement: 'BharatLingo team achieves 94% accuracy on Hindi-Tamil translation! IndieNLP and RegioBot take 2nd and 3rd.',
      rules, judgingCriteria, createdBy: org1,
    },
    {
      title: 'HackAP — Andhra Pradesh State Hackathon',
      description: 'State government-sponsored hackathon addressing AP-specific challenges: fisheries management, tourism promotion, disaster management for cyclone-prone coastal areas, and digital governance for rural districts.',
      theme: 'State Governance & Rural Development',
      mode: 'Offline', venue: 'APCRDA Convention Centre, Amaravati', bannerImage: banners[9],
      startDate: daysAgo(40), endDate: daysAgo(38),
      registrationDeadline: daysAgo(50), submissionDeadline: daysAgo(38),
      prizePool: 500000, maxTeamSize: 6, status: 'Completed', isPublished: true,
      resultPublished: true,
      winnerAnnouncement: 'FishTrack wins the state championship! CycloneGuard and eGovAP secure runner-up positions.',
      rules, judgingCriteria, createdBy: org2,
    },
    {
      title: 'TechForEarth Climate Sprint',
      description: 'Climate action hackathon co-organized with WWF India. Build carbon footprint calculators, reforestation tracking tools, ocean plastic monitoring systems, or citizen science platforms for environmental data collection.',
      theme: 'Environmental Technology',
      mode: 'Online', venue: 'Virtual', bannerImage: banners[0],
      startDate: daysAgo(55), endDate: daysAgo(53),
      registrationDeadline: daysAgo(65), submissionDeadline: daysAgo(53),
      prizePool: 120000, maxTeamSize: 4, status: 'Completed', isPublished: true,
      resultPublished: true,
      winnerAnnouncement: 'GreenTrack Carbon wins unanimously! OceanBot and ReforestAI receive special eco-impact awards.',
      rules, judgingCriteria, createdBy: org3,
    },
    {
      title: 'Supply Chain Transparency Hack',
      description: 'Use blockchain and data technology to bring transparency to supply chains. Track food provenance, pharmaceutical authenticity, textile supply chain ethics, or conflict mineral-free electronics manufacturing.',
      theme: 'Supply Chain & Transparency',
      mode: 'Online', venue: 'Virtual', bannerImage: banners[1],
      startDate: daysAgo(25), endDate: daysAgo(23),
      registrationDeadline: daysAgo(35), submissionDeadline: daysAgo(23),
      prizePool: 140000, maxTeamSize: 4, status: 'Completed', isPublished: true,
      resultPublished: false,
      winnerAnnouncement: '',
      rules, judgingCriteria, createdBy: org1,
    },
    {
      title: 'Women Safety Tech Hackathon',
      description: 'Build technology solutions that enhance safety for women in public spaces, workplaces, and online environments. Create emergency response apps, harassment reporting platforms, safe route planners, or bystander tools.',
      theme: 'Women Safety & Gender Equity Tech',
      mode: 'Hybrid', venue: 'Mahindra University, Hyderabad + Online', bannerImage: banners[2],
      startDate: daysAgo(65), endDate: daysAgo(63),
      registrationDeadline: daysAgo(75), submissionDeadline: daysAgo(63),
      prizePool: 110000, maxTeamSize: 5, status: 'Completed', isPublished: true,
      resultPublished: true,
      winnerAnnouncement: 'SafeStep app wins! The jury awarded special recognitions to HerVoice and GuardianBot projects.',
      rules, judgingCriteria, createdBy: org2,
    },
    {
      title: 'Media & Journalism Hack',
      description: 'Build tools for the future of journalism. Create AI fact-checking systems, investigative data journalism tools, newsroom automation software, hyperlocal news platforms, or media literacy education applications.',
      theme: 'Media, Journalism & Fact-Checking',
      mode: 'Online', venue: 'Virtual', bannerImage: banners[3],
      startDate: daysAgo(20), endDate: daysAgo(18),
      registrationDeadline: daysAgo(30), submissionDeadline: daysAgo(18),
      prizePool: 75000, maxTeamSize: 3, status: 'Completed', isPublished: true,
      resultPublished: true,
      winnerAnnouncement: 'FactCheck AI wins the journalism hack! NewsBot Local and TruthLayer are honourable mentions.',
      rules, judgingCriteria, createdBy: org3,
    },
    {
      title: 'Accessibility Hackathon 2024',
      description: 'Build for the 1 in 7 people worldwide who live with a disability. Create screen reader improvements, sign language recognition tools, cognitive accessibility checkers, or mobility aid companion applications.',
      theme: 'Accessibility & Inclusive Design',
      mode: 'Online', venue: 'Virtual', bannerImage: banners[4],
      startDate: daysAgo(110), endDate: daysAgo(108),
      registrationDeadline: daysAgo(120), submissionDeadline: daysAgo(108),
      prizePool: 85000, maxTeamSize: 4, status: 'Completed', isPublished: true,
      resultPublished: true,
      winnerAnnouncement: 'SignSense wins with 98% sign language recognition! AccessiCheck and VoiceNav take 2nd and 3rd.',
      rules, judgingCriteria, createdBy: org1,
    },
  ];
};

// ── Main Seed Function ────────────────────────────────────────────────────────
async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('\n✅ Connected to MongoDB:', MONGO_URI);

    // Clear existing data
    console.log('\n🗑  Clearing existing hackathons and users...');
    await Hackathon.deleteMany({});
    await User.deleteMany({});
    console.log('   Done.');

    // Create users (password is hashed by the pre-save hook)
    console.log('\n👤 Creating users...');
    const createdUsers = [];
    for (const u of usersData) {
      const user = new User(u);
      await user.save();
      createdUsers.push(user);
      console.log(`   ✓ ${u.role.padEnd(12)} ${u.name} (${u.email})`);
    }

    const organizers = createdUsers.filter(u => u.role === 'organizer');
    const organizerIds = organizers.map(o => o._id);

    // Create hackathons
    console.log('\n🏆 Creating hackathons...');
    const hackathons = getHackathons(organizerIds);
    let count = 0;
    for (const h of hackathons) {
      const hackathon = new Hackathon(h);
      await hackathon.save();
      count++;
      console.log(`   ✓ [${String(count).padStart(2, '0')}] [${h.status.padEnd(20)}] ${h.title}`);
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`✅ SEED COMPLETE`);
    console.log(`${'='.repeat(60)}`);
    console.log(`   👤 Users created       : ${createdUsers.length}`);
    console.log(`   🏆 Hackathons created  : ${count}`);
    console.log(`\n📋 Status Breakdown:`);
    const statuses = ['Upcoming', 'Registration Open', 'Registration Closed', 'Ongoing', 'Completed'];
    for (const s of statuses) {
      const n = hackathons.filter(h => h.status === s).length;
      console.log(`   ${s.padEnd(24)}: ${n}`);
    }
    console.log(`\n🔑 Login Credentials:`);
    console.log(`   Admin       : workwithgolu7@gmail.com  /  Admin@123`);
    console.log(`   Organizer 1 : priya.organizer@hackpulse.com  /  Organizer@1`);
    console.log(`   Organizer 2 : rohan.organizer@hackpulse.com  /  Organizer@2`);
    console.log(`   Judge 1     : arjun.judge@hackpulse.com  /  Judge@1234`);
    console.log(`   Participant : aarav@student.com  /  Student@1`);
    console.log(`${'='.repeat(60)}\n`);

    process.exit(0);
  } catch (err) {
    console.error('\n❌ Seed failed:', err.message);
    process.exit(1);
  }
}

seed();
