// Firebase SDK imports
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-app.js";
import { getFirestore, collection, getDocs } from "https://www.gstatic.com/firebasejs/10.8.1/firebase-firestore.js";

// Firebase config (your SDK)
const firebaseConfig = {
  apiKey: "AIzaSyChSY98ZLBYuyIKqzXqQxrJsO_X5nQA348",
  authDomain: "goalseer-3b711.firebaseapp.com",
  projectId: "goalseer-3b711",
  storageBucket: "goalseer-3b711.firebasestorage.app",
  messagingSenderId: "738240427316",
  appId: "1:738240427316:web:b67cf3b5248665e2dc2161",
  measurementId: "G-0HKV6Y5QFG"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// DOM elements
const revealBtn = document.getElementById('revealBtn');
const tipsContainer = document.getElementById('tipsContainer');
const tipsLoader = document.getElementById('tipsLoader');
const loadingText = document.getElementById('loadingText');
const vipBtns = document.querySelectorAll('.vip-btn');
const vipModal = document.getElementById('vipModal');
const closeVipModal = document.getElementById('closeVipModal');
const vipModalTitle = document.getElementById('vipModalTitle');
const notification = document.getElementById('notification');
const copyBtns = document.querySelectorAll('.copy-btn');

// Reveal free tips
revealBtn.addEventListener('click', async () => {
  tipsContainer.style.display = 'block';
  tipsLoader.style.display = 'block';
  loadingText.style.display = 'block';
  tipsContainer.innerHTML = "";

  try {
    const querySnapshot = await getDocs(collection(db, "dailyFree"));
    tipsLoader.style.display = 'none';
    loadingText.style.display = 'none';

    if (querySnapshot.empty) {
      tipsContainer.innerHTML = "<p>No tips available today.</p>";
    } else {
      querySnapshot.forEach(doc => {
        const tip = doc.data();
        tipsContainer.innerHTML += `
          <div class="tip-card">
            <div>${tip.match}</div>
            <div>${tip.status || ""}</div>
          </div>
        `;
      });
    }
  } catch (e) {
    console.error("Error fetching tips:", e);
    tipsContainer.innerHTML = "<p>Error loading tips. Try again later.</p>";
  }
});

// VIP modal
vipBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    vipModalTitle.textContent = `VIP Predictions - $${btn.dataset.price}`;
    vipModal.style.display = "block";
  });
});
closeVipModal.addEventListener('click', () => vipModal.style.display = "none");
window.addEventListener('click', e => { if (e.target === vipModal) vipModal.style.display = "none"; });

// Copy address
copyBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    const address = document.getElementById(btn.dataset.address).textContent;
    navigator.clipboard.writeText(address);
    showNotification("Copied: " + address);
  });
});

// Show notification
function showNotification(msg) {
  notification.textContent = msg;
  notification.classList.add("show");
  setTimeout(() => notification.classList.remove("show"), 3000);
}
