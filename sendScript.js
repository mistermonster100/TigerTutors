import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
    getFirestore, doc, setDoc, getDoc, updateDoc, arrayUnion 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

// 🔹 Firebase Configuration
const firebaseConfig = {
    apiKey: "AIzaSyDjSRPgwoeNdSnRleq85mS_mqmV9Tdrkzs",
    authDomain: "tiger-tutors.firebaseapp.com",
    projectId: "tiger-tutors",
    storageBucket: "tiger-tutors.firebasestorage.app",
    messagingSenderId: "343214157028",
    appId: "1:343214157028:web:9bf5d0453068e95ddf90f1",
    measurementId: "G-3ZMT5ERRFR"
};

// 🔹 Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// 🔹 Valid Teacher-Provided Codes for Certification
const VALID_CODES = {
    "M-A1": { subject: "Math", className: "Algebra 1" },
    "M-GE": { subject: "Math", className: "Geometry" },
    "M-A2": { subject: "Math", className: "Algebra 2" },
    "M-PC": { subject: "Math", className: "Precalculus" },
    "M-CAB": { subject: "Math", className: "Calculus AB" },
    "M-CBC": { subject: "Math", className: "Calculus BC" },
    "M-C3": { subject: "Math", className: "Calculus 3" },

    "E-9": { subject: "English", className: "English 9" },
    "E-10": { subject: "English", className: "English 10" },
    "E-11": { subject: "English", className: "English 11" },
    "E-12": { subject: "English", className: "English 12" },

    "S-WH": { subject: "Social Studies", className: "World History" },
    "S-APH": { subject: "Social Studies", className: "AP World History" },
    "S-UH": { subject: "Social Studies", className: "US History" },
    "S-APU": { subject: "Social Studies", className: "AP US History" },
    "S-EH": { subject: "Social Studies", className: "European History" },
    "S-APM": { subject: "Social Studies", className: "AP Microeconomics" },
    "S-APMA": { subject: "Social Studies", className: "AP Macroeconomics" },

    "P-1": { subject: "Physics", className: "Physics 1" },
    "P-2": { subject: "Physics", className: "Physics 2" },
    "P-C": { subject: "Physics", className: "Physics C" },

    "C-HC": { subject: "Chemistry", className: "Honors Chemistry" },
    "C-AP": { subject: "Chemistry", className: "AP Chemistry" },

    "CS-P": { subject: "Computer Science", className: "CS Principles" },
    "CS-1": { subject: "Computer Science", className: "CS 1" },
    "CS-A": { subject: "Computer Science", className: "CS A" },

    "B-H": { subject: "Biology", className: "Honors Biology" },
    "B-AP": { subject: "Biology", className: "AP Biology" }
};

// 🔹 Teacher List with Verification Codes
const TEACHER_LIST = {
    "Mr. Smith": "smith123",
    "Ms. Johnson": "johnson456",
    "Dr. Adams": "adams789"
};

// 🔹 Create Tutor Account in Firestore
async function createAccount(name, email, studentID, phone = "N/A") {
    const tutorRef = doc(db, "tutors", email);
    const tutorSnap = await getDoc(tutorRef);

    if (tutorSnap.exists()) {
        throw new Error("Account with this email already exists!");
    }

    // 🔹 Firestore Document Structure
    const tutorData = {
        name,
        email,
        studentID,
        phone,
        competency: {},
        visibility: {},
        hours: []
    };

    await setDoc(tutorRef, tutorData);
}

async function uploadData(docId, name, email, phone, competency) {
      try {
             await setDoc(doc(db, "users", docId), { name, email, phone, competency});
             console.log("Data uploaded to Firestore successfully!");
      } catch (error) {
             console.error("Error uploading document: ", error);
      }
}

// 🔹 Add a Verified Skill Using a Teacher Code
async function addSkill(email, code) {
    if (!VALID_CODES[code]) {
        throw new Error("Invalid teacher code!");
    }

    const tutorRef = doc(db, "tutors", email);
    const tutorSnap = await getDoc(tutorRef);

    if (!tutorSnap.exists()) {
        throw new Error("Tutor account not found!");
    }

    const tutor = tutorSnap.data();
    const { subject, className } = VALID_CODES[code];

    if (!tutor.competency[subject]) tutor.competency[subject] = [];
    if (!tutor.visibility[subject]) tutor.visibility[subject] = [];

    if (!tutor.competency[subject].includes(className)) {
        tutor.competency[subject].push(className);
        tutor.visibility[subject].push(className);
    }

    await updateDoc(tutorRef, { competency: tutor.competency, visibility: tutor.visibility });
}

// 🔹 Function to Track Hours
async function logHours(email, hoursLogged, teacherCode = null) {
    if (isNaN(hoursLogged) || hoursLogged <= 0) {
        throw new Error("Please enter a valid number of hours.");
    }

    const isVerified = TEACHER_LIST.hasOwnProperty(teacherCode);

    const tutorRef = doc(db, "tutors", email);
    await updateDoc(tutorRef, {
        hours: arrayUnion({
            date: new Date().toISOString().split("T")[0],
            hours: hoursLogged,
            teacherCode: isVerified ? teacherCode : null,
            verified: isVerified
        })
    });
}

// 🔹 Export Functions for Other Scripts
export { createAccount, addSkill, logHours };
