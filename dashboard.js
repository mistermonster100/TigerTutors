    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
    import { getFirestore, collection, getDocs, setDoc, doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";
    import { fetchFirestoreData } from "./script.js";  // Replace with correct file
    // 🔹 Replace with your Firebase config
    const firebaseConfig = {
      apiKey: "AIzaSyDjSRPgwoeNdSnRleq85mS_mqmV9Tdrkzs",
      authDomain: "tiger-tutors.firebaseapp.com",
      projectId: "tiger-tutors",
      storageBucket: "tiger-tutors.firebasestorage.app",
      messagingSenderId: "343214157028",
      appId: "1:343214157028:web:9bf5d0453068e95ddf90f1",
      measurementId: "G-3ZMT5ERRFR"
    };

    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);

    let jsonData = await fetchFirestoreData("users");
    let subjectJson = await fetchFirestoreData("subjects");
    console.log(jsonData);
    console.log(subjectJson);
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
const TEACHER_CODES = {
    "smith123": "Mr. Smith",
    "johnson456": "Ms. Johnson",
    "adams789": "Dr. Adams"
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
async function logHours() {
     console.log("🕒 Log Hours button clicked!");

    const hourInput = document.getElementById("hour-input").value.trim();
    const teacherCodeInput = document.getElementById("teacher-code-input").value.trim();
    console.log("Input received:", hourInput, teacherCodeInput);
////////////////////////////////////////////////////////////////////////////
    const email = localStorage.getItem("loggedInTutor");
    if (!email) {
        alert("⚠️ You must be logged in!");
        return;
    }

    if (!/^(\d{1,2}):[0-5]\d$/.test(hourInput)) {
        alert("❌ Invalid time format. Use HH:MM (e.g. 03:30).");
        return;
    }

    const isVerified = TEACHER_CODES.hasOwnProperty(teacherCodeInput);
    const teacherName = isVerified ? TEACHER_CODES[teacherCodeInput] : null;

    const hourString = isVerified 
        ? `${hourInput}true-${teacherName}`
        : `${hourInput}false`;

    const tutorRef = doc(db, "users", email);
    const tutorSnap = await getDoc(tutorRef);
    if (!tutorSnap.exists()) {
        alert("⚠️ Tutor not found!");
        return;
    }

    const currentData = tutorSnap.data();
    const updatedHours = currentData.hours || [];
    updatedHours.push(hourString);

    await updateDoc(tutorRef, { hours: updatedHours });

    alert("✅ Hours logged successfully!");

    // Clear fields
    document.getElementById("hour-input").value = "";
    document.getElementById("teacher-code-input").value = "";
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
window.addEventListener("load", () => {
    const logBtn = document.getElementById("log-hours-button");
    if (logBtn) {
        console.log("✅ Button found, attaching listener.");
        logBtn.addEventListener("change", logHours);
    } else {
        console.error("❌ Log button not found in DOM.");
    }
});
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 🔹 Subject-to-Class Level Map
const CLASS_LEVELS = {
    "Math": ["Algebra 1", "Geometry", "Algebra 2", "Precalculus", "Calculus AB", "Calculus BC", "Calculus 3"],
    "English": ["English 9", "English 10", "English 11", "English 12", "Speech"],
    "Social Studies": ["World History", "AP World History", "US History", "AP US History", "European History", "AP Microeconomics", "AP Macroeconomics", "Gov", "AP/ACP Gov"],
    "Physics": ["Physics 1", "Physics 2", "Physics C"],
    "Chemistry": ["Honors Chemistry", "AP Chemistry"],
    "Computer Science": ["CS Principles", "CS 1", "CS A"],
    "Biology": ["Honors Biology", "AP Biology"]
};
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 🔹 Function: Modify Visibility Based on Subject Selection
async function modifyVisibility() {
    const subject = document.getElementById("subject").value;
    const subcategoryContainer = document.getElementById("subcategory-container");
    const email = localStorage.getItem("loggedInTutor");

    subcategoryContainer.innerHTML = ""; // Clear previous content

    if (!subject || !email) {
        subcategoryContainer.innerHTML = "<p>⚠️ Please select a subject.</p>";
        return;
    }

    try {
        const tutorRef = doc(db, "users", email);
        const tutorSnap = await getDoc(tutorRef);

        if (!tutorSnap.exists()) {
            throw new Error("⚠️ Tutor account not found!");
        }

        const tutor = tutorSnap.data();
        let competency = tutor.competency[subject] || [];

        // Ensure competency array matches class list length
        const classList = CLASS_LEVELS[subject] || [];
        if (classList.length === 0) {
            subcategoryContainer.innerHTML = "<p>⚠️ No subcategories available.</p>";
            return;
        }

        /*while (competency.length < classList.length) {
            competency.push(false); // Ensure all classes have a visibility state
        }*/

        console.log("✅ Competency Data:", competency); // Debugging Log

        // Create checkboxes based on competency array
        competency.forEach((isChecked, index) => {
    const classList = CLASS_LEVELS[subject] || []; // Get subject class names
    const className = classList[index] || `Class ${index + 1}`; // Fallback name if missing

    const div = document.createElement("div");
    div.classList.add("checkbox-container"); // Add CSS class for styling

    const label = document.createElement("label");
    label.htmlFor = `class-${index}`;
    label.textContent = className; // Correctly assigns class name from CLASS_LEVELS

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = `class-${index}`;
    checkbox.checked = isChecked; // Correctly assigns true/false
    checkbox.dataset.index = index;
    checkbox.classList.add("checkbox-input"); // Add CSS class for styling

    div.appendChild(label);  // ✅ Label (Class Name) First
    div.appendChild(checkbox); // ✅ Checkbox Second
    subcategoryContainer.appendChild(div);
});

        // Add Save Changes Button
        const saveButton = document.createElement("button");
        saveButton.textContent = "Save Changes";
        saveButton.onclick = () => saveVisibility(subject);
        subcategoryContainer.appendChild(saveButton);

    } catch (error) {
        console.error("❌ Error in modifyVisibility:", error);
        subcategoryContainer.innerHTML = `<p>❌ Error: ${error.message}</p>`;
    }
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 🔹 Function: Save Updated Visibility
async function saveVisibility(subject) {
    const email = localStorage.getItem("loggedInTutor");
    if (!email) {
        alert("⚠️ You must be logged in!");
        return;
    }

    const tutorRef = doc(db, "users", email);
    const tutorSnap = await getDoc(tutorRef);
    if (!tutorSnap.exists()) {
        alert("⚠️ Tutor account not found!");
        return;
    }

    const newVisibility = [];
    const checkboxes = document.querySelectorAll("#subcategory-container input[type='checkbox']");

    checkboxes.forEach((checkbox) => {
        const index = parseInt(checkbox.dataset.index);
        newVisibility[index] = checkbox.checked;
    });

    try {
        await updateDoc(tutorRef, { [`competency.${subject}`]: newVisibility });
        alert("✅ Visibility updated successfully!");
    } catch (error) {
        alert(`❌ Error updating visibility: ${error.message}`);
    }
}
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 🔹 Attach Event Listener to Subject Dropdown
document.getElementById("subject")?.addEventListener("change", modifyVisibility);

// 🔹 Logout Function (Now works!)
function logout() {
    localStorage.removeItem("loggedInTutor");
    window.location.href = "manage_account.html";
}
window.logout = logout;  // Make it globally available
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
    const subjectDropdown = document.getElementById("subject");
    if (subjectDropdown) {
        subjectDropdown.addEventListener("change", modifyVisibility);
    } else {
        console.error("❌ Subject dropdown not found!");
    }
});
Object.assign(window, {fetchFirestoreData, logout});
