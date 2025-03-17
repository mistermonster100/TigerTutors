 import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
    import { getFirestore, collection, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
// 🔹 Subject-to-Class Level Map
const CLASS_LEVELS = {
    "Math": ["Algebra 1", "Geometry", "Algebra 2", "Precalculus", "Calculus AB", "Calculus BC", "Calculus 3"],
    "English": ["English 9", "English 10", "English 11", "English 12", "Speech"],
    "Social Studies": ["World History", "AP World History", "US History", "AP US History", "European History", "AP Microeconomics", "AP Macroeconomics"],
    "Physics": ["Physics 1", "Physics 2", "Physics C"],
    "Chemistry": ["Honors Chemistry", "AP Chemistry"],
    "Computer Science": ["CS Principles", "CS 1", "CS A"],
    "Biology": ["Honors Biology", "AP Biology"]
};

// 🔹 Function: Modify Visibility Based on Subject Selection
async function modifyVisibility() {
    const subject = document.getElementById("subject").value;
    const subcategoryContainer = document.getElementById("subcategory-container");
    const email = localStorage.getItem("loggedInTutor");

    subcategoryContainer.innerHTML = ""; // Clear previous selections

    if (!subject || !email) {
        subcategoryContainer.innerHTML = "<p>⚠️ Please select a subject.</p>";
        return;
    }

    try {
        const tutorRef = doc(db, "tutors", email);
        const tutorSnap = await getDoc(tutorRef);

        if (!tutorSnap.exists()) {
            throw new Error("⚠️ Tutor account not found!");
        }

        const tutor = tutorSnap.data();
        let competency = tutor.competency[subject] || [];

        // Ensure competency array matches class list length
        const classList = CLASS_LEVELS[subject] || [];
        while (competency.length < classList.length) {
            competency.push(false); // Fill with false if missing
        }

        // Create checkboxes based on competency array
        classList.forEach((className, index) => {
            const isChecked = competency[index]; // Will be true/false

            const checkbox = document.createElement("input");
            checkbox.type = "checkbox";
            checkbox.id = `class-${index}`;
            checkbox.checked = isChecked;
            checkbox.dataset.index = index;

            const label = document.createElement("label");
            label.htmlFor = `class-${index}`;
            label.textContent = className;

            const div = document.createElement("div");
            div.appendChild(checkbox);
            div.appendChild(label);
            subcategoryContainer.appendChild(div);
        });

        // Add Save Changes Button
        const saveButton = document.createElement("button");
        saveButton.textContent = "Save Changes";
        saveButton.onclick = () => saveVisibility(subject);
        subcategoryContainer.appendChild(saveButton);

    } catch (error) {
        subcategoryContainer.innerHTML = `<p>❌ Error: ${error.message}</p>`;
    }
}

// 🔹 Function: Save Updated Visibility
async function saveVisibility(subject) {
    const email = localStorage.getItem("loggedInTutor");
    if (!email) {
        alert("⚠️ You must be logged in!");
        return;
    }

    const tutorRef = doc(db, "tutors", email);
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

// 🔹 Attach Event Listener to Subject Dropdown
document.getElementById("subject")?.addEventListener("change", modifyVisibility);

// 🔹 Logout Function (Now works!)
function logout() {
    localStorage.removeItem("loggedInTutor");
    window.location.href = "manage_account.html";
}
window.logout = logout; // Expose logout function globally
