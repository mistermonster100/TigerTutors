
    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
    import { getFirestore, collection, getDocs, setDoc, doc } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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

    const subcategories = {
                "Math": ["Algebra", "Geometry", "Algebra 2", "Precalculus", "Calculus AB", "Calculus BC", "Calculus 3"],
                "English": ["English 9", "English 10", "English 11", "English 12"],
                "Social Studies": ["World History", "AP World History", "US History", "AP US History", "European History"],
                "Physics": ["Physics 1", "Physics 2", "Physics C"],
                "Chemistry": ["Honors Chemistry", "ACP/AP Chemistry"],
                "Computer Science": ["CS Principles", "CS 1", "CS A", "Software Development"],
                "Biology": ["Honors Biology", "AP Biology"]
    };

    function updateSubcategories() {
                //console.log("updateSubcategories is working");

                const subject = document.getElementById("subject").value;
                const subcategorySelect = document.getElementById("subcategory");
                subcategorySelect.innerHTML = '';

                if (subject && subcategories[subject]) {
                    subcategorySelect.style.display = "block";
                    subcategories[subject].forEach(sub => {
                        let option = document.createElement("option");
                        option.value = sub;
                        option.textContent = sub;
                        subcategorySelect.appendChild(option);
                    });
                } else {
                    subcategorySelect.style.display = "none";
                }
    }

    Object.assign(window, {updateSubcategories});
