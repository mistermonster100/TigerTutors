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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 🔹 Valid Teacher-Provided Codes for Certification
const VALID_CODES = {
    "M-A1": { subject: "Math", className: "Algebra 1", level: 0 },
    "M-GE": { subject: "Math", className: "Geometry", level: 1 },
    "M-A2": { subject: "Math", className: "Algebra 2", level: 2 },
    "M-PC": { subject: "Math", className: "Precalculus", level: 3 },
    "M-CAB": { subject: "Math", className: "Calculus AB", level: 4 },
    "M-CBC": { subject: "Math", className: "Calculus BC", level: 5 },
    "M-C3": { subject: "Math", className: "Calculus 3", level: 6 },

    "E-9": { subject: "English", className: "English 9", level: 0 },
    "E-10": { subject: "English", className: "English 10", level: 1 },
    "E-11": { subject: "English", className: "English 11", level: 2 },
    "E-12": { subject: "English", className: "English 12", level: 3 },
    "E-SP": { subject: "English", className: "Speech", level: 4 },

    "S-WH": { subject: "Social Studies", className: "World History", level: 0 },
    "S-APH": { subject: "Social Studies", className: "AP World History", level: 1 },
    "S-UH": { subject: "Social Studies", className: "US History", level: 2 },
    "S-APU": { subject: "Social Studies", className: "AP US History", level: 3 },
    "S-EH": { subject: "Social Studies", className: "European History", level: 4 },
    "S-APM": { subject: "Social Studies", className: "AP Microeconomics", level: 5 },
    "S-APMA": { subject: "Social Studies", className: "AP Macroeconomics", level: 6 },
    "S-G": { subject: "Social Studies", className: "Government", level: 7 },
    "S-APG": { subject: "Social Studies", className: "AP/ACP Government", level: 8 },

    "P-1": { subject: "Physics", className: "Physics 1", level: 0 },
    "P-2": { subject: "Physics", className: "Physics 2", level: 1 },
    "P-C": { subject: "Physics", className: "Physics C", level: 2 },

    "C-HC": { subject: "Chemistry", className: "Honors Chemistry", level: 0 },
    "C-AP": { subject: "Chemistry", className: "AP Chemistry", level: 1 },

    "CS-P": { subject: "Computer Science", className: "CS Principles", level: 0 },
    "CS-1": { subject: "Computer Science", className: "CS 1", level: 1 },
    "CS-A": { subject: "Computer Science", className: "CS A", level: 2 },

    "B-H": { subject: "Biology", className: "Honors Biology", level: 0 },
    "B-AP": { subject: "Biology", className: "AP Biology", level: 1 }
};
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 🔹 Teacher List with Verification Codes
const TEACHER_LIST = {
    "Mr. Smith": "smith123",
    "Ms. Johnson": "johnson456",
    "Dr. Adams": "adams789"
};
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 🔹 Default Competency Structure (Populated with `false` initially)
function getDefaultCompetency() {
    return {
        "Math": [],
        "English": [],
        "Social Studies": [],
        "Physics": [],
        "Chemistry": [],
        "Computer Science": [],
        "Biology": []
    };
}
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.getElementById("createAccount").addEventListener("click", async () => {
    event.preventDefault();
    createAccount(document.getElementById("name").value, document.getElementById("email").value, document.getElementById("student-id").value);
});

// 🔹 Function: Create a Tutor Account
async function createAccount(name, email, studentID, phone = "N/A") {
    try {
        const tutorRef = doc(db, "users", email);
        const tutorSnap = await getDoc(tutorRef);

        if (tutorSnap.exists()) {
            throw new Error("⚠️ Account with this email already exists!");
        }

        // Competency Map: Each subject is an array of booleans (all `false` initially)
        const competency = getDefaultCompetency();

        const tutorData = {
            name,
            email,
            studentID,
            phone,
            competency, // New Structure: 2D array map
            hours: []
        };

        await setDoc(tutorRef, tutorData);
        alert("✅ Account created successfully!");
    } catch (error) {
        alert(`❌ Error: ${error.message}`);
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 🔹 Function: Update Competency (Toggle Visibility)
async function toggleCompetency(email, subject, index, isVisible) {
    try {
        const tutorRef = doc(db, "users", email);
        const tutorSnap = await getDoc(tutorRef);

        if (!tutorSnap.exists()) {
            throw new Error("⚠️ Tutor account not found!");
        }

        const tutor = tutorSnap.data();

        if (!tutor.competency[subject]) {
            throw new Error(`⚠️ Subject ${subject} not found in competency.`);
        }

        tutor.competency[subject][index] = isVisible; // Update visibility

        await updateDoc(tutorRef, { competency: tutor.competency });
        alert(`✅ ${subject} class ${index + 1} visibility updated!`);
    } catch (error) {
        alert(`❌ Error: ${error.message}`);
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function uploadData(docId, name, email, phone, competency) {
      try {
             await setDoc(doc(db, "users", docId), { name, email, phone, competency});
             console.log("Data uploaded to Firestore successfully!");
      } catch (error) {
             console.error("Error uploading document: ", error);
      }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 🔹 Function: Update Tutor Data
async function updateTutorData(email, newData) {
    try {
        const tutorRef = doc(db, "users", email);
        await updateDoc(tutorRef, newData);
        alert("✅ Data updated successfully!");
    } catch (error) {
        alert(`❌ Error: ${error.message}`);
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function loginTutor(event) {
    event.preventDefault(); // Prevent form submission refresh

    const email = document.getElementById("login-email").value.trim();
    const studentID = document.getElementById("login-student-id").value.trim();
    const messageBox = document.getElementById("account-message");

    messageBox.innerText = ""; // Clear previous messages

    try {
        const tutorRef = doc(db, "tutors", email);
        const tutorSnap = await getDoc(tutorRef);

        if (!tutorSnap.exists()) {
            throw new Error("⚠️ No account found with this email.");
        }

        const tutor = tutorSnap.data();

        if (tutor.studentID !== studentID) {
            throw new Error("⚠️ Incorrect student ID.");
        }

        // 🔹 Store session in localStorage
        localStorage.setItem("loggedInTutor", email);

        // 🔹 Redirect to Dashboard
        window.location.href = "dashboard.html";
    } catch (error) {
        messageBox.innerText = `❌ ${error.message}`;
        messageBox.style.color = "red";
    }
}

// 🔹 Attach function to login form
document.getElementById("login-form")?.addEventListener("submit", loginTutor);
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 🔹 Function: Add a Verified Skill Using a Teacher Code
async function addSkill(email, code) {
    try {
        const tutorRef = doc(db, "users", email);
        const tutorSnap = await getDoc(tutorRef);

        if (!tutorSnap.exists()) {
            throw new Error("⚠️ Tutor account not found!");
        }

        if (!VALID_CODES[code]) {
            throw new Error("⚠️ Invalid teacher code!");
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
        alert(`✅ Skill added: ${className} in ${subject}!`);
    } catch (error) {
        alert(`❌ Error: ${error.message}`);
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 🔹 Function: Log Hours with Optional Verification
async function logHours(email, hoursLogged, teacherCode = null) {
    try {
        if (isNaN(hoursLogged) || hoursLogged <= 0) {
            throw new Error("⚠️ Please enter a valid number of hours.");
        }

        const isVerified = TEACHER_LIST.hasOwnProperty(teacherCode);
        const tutorRef = doc(db, "users", email);

        await updateDoc(tutorRef, {
            hours: arrayUnion({
                date: new Date().toISOString().split("T")[0],
                hours: hoursLogged,
                teacherCode: isVerified ? teacherCode : null,
                verified: isVerified
            })
        });

        alert(`✅ Hours logged successfully! ${isVerified ? "Verified by teacher." : "Pending verification."}`);
    } catch (error) {
        alert(`❌ Error: ${error.message}`);
    }
}

// 🔹 Export Functions for Other Scripts
export { createAccount, updateTutorData, addSkill, logHours };
