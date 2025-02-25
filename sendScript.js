    import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
    import { getFirestore, collection, getDocs, setDoc, doc, query, where, updateDoc} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

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


//Object.assign(window, {updateSubcategories, findTutors, updateTutor, updateCompetency, getDocIdByEmail});
