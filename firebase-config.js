import { initializeApp } from "https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js";
import { 
    getFirestore, collection, addDoc, getDocs, deleteDoc, doc,
    serverTimestamp 
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-firestore.js";
import { 
    getStorage, ref, uploadBytes, getDownloadURL 
} from "https://www.gstatic.com/firebasejs/12.5.0/firebase-storage.js";

const firebaseConfig = {
    apiKey: "AIzaSyDJz23MzsuUokr6GMP9gvOgqLUwTTRueBo",
    authDomain: "usus-49fc4.firebaseapp.com",
    projectId: "usus-49fc4",
    storageBucket: "usus-49fc4.firebasestorage.app",
    messagingSenderId: "432992180123",
    appId: "1:432992180123:web:de0c9d9bfe130935ceb33e",
    measurementId: "G-V3KND93DQ0"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

// أكسبورت للاستخدام في الملفات الأخرى
export { 
    db, collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp,
    storage, ref, uploadBytes, getDownloadURL 
};