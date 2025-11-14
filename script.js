/* -------------------------------------------------------------
   Cellular Network Code Vault — Final script.js
-------------------------------------------------------------- */

const practicals = [
  {
    id: 1,
    name: "Expt No.1 - Hata Model for large city",
    desc: "Hata / Okumura propagation model",
    files: [
      { name: "CN_1_Code.txt", path: "/assets/Expt No.1 - Hata Model for large city/CN_1_Code.txt" }
    ],
    output: "/assets/Expt No.1 - Hata Model for large city/CN_1.docx"
  },

  {
    id: 3,
    name: "Expt No.3 - BER performance over AWGN",
    desc: "BER over a wire-line AWGN channel",
    files: [
      { name: "CN_3_Code.txt", path: "/assets/Expt No.3 - BER performance over a wire line AWGN channel/CN_3_Code.txt" }
    ],
    output: "/assets/Expt No.3 - BER performance over a wire line AWGN channel/CN_3.docx"
  },

  {
    id: 5,
    name: "Expt No.5 - Power vs RMS Delay Spread",
    desc: "Delay spread & power relation",
    files: [
      { name: "CN_5_Code.txt", path: "/assets/Expt No.5 - Power vs RMS Delay spread/CN_5_Code.txt" },
      { name: "CN_5_Script.txt", path: "/assets/Expt No.5 - Power vs RMS Delay spread/CN_5_Script.txt" }
    ],
    output: "/assets/Expt No.5 - Power vs RMS Delay spread/CN_5.docx"
  },

  {
    id: 6,
    name: "Expt No.6 - Link-Budget Analysis",
    desc: "Path loss & margin calculations",
    files: [
      { name: "CN_6_Code.txt", path: "/assets/Expt No.6 - Link-Budget analysis/CN_6_Code.txt" }
    ],
    output: "/assets/Expt No.6 - Link-Budget analysis/CN_6.docx"
  },

  {
    id: 7,
    name: "Expt No.7 - BER MIMO",
    desc: "Bit error rate for MIMO",
    files: [
      { name: "CN_7_Code.txt", path: "/assets/Expt No.7 - BER MIMO/CN_7_Code.txt" }
    ],
    output: "/assets/Expt No.7 - BER MIMO/CN_7.docx"
  },

  {
    id: 9,
    name: "Expt No.9 - MIMO Channel Coefficient",
    desc: "Channel estimation for MIMO",
    files: [
      { name: "CN_9_Code.txt", path: "/assets/Expt No.9 - MIMO Channel Coefficient/CN_9_Code.txt" }
    ],
    output: "/assets/Expt No.9 - MIMO Channel Coefficient/CN_9.docx"
  },

  {
    id: 10,
    name: "Expt No.10 - Doppler Shift",
    desc: "Mobile Doppler shift simulation",
    files: [
      { name: "CN_10_Code.txt", path: "/assets/Expt No.10 - Doppler Shift/CN_10_Code.txt" }
    ],
    output: "/assets/Expt No.10 - Doppler Shift/CN_10.docx"
  },

  {
    id: 13,
    name: "Expt No.13 - OFDM: BER Vs Eb/N0",
    desc: "OFDM BER vs Eb/N0 performance",
    files: [
      { name: "CN_13_Code.txt", path: "/assets/Expt No.13 - OFDM - BER Vs Eb-N0/CN_13_Code.txt" }
    ],
    output: "/assets/Expt No.13 - OFDM - BER Vs Eb-N0/CN_13.docx"
  },

  {
    id: 15,
    name: "Expt No.15 - Cellular System",
    desc: "Cell planning, reuse & capacity",
    files: [
      { name: "CN_15_Code.txt", path: "/assets/Expt No.15 - Cellular System/CN_15_Code.txt" }
    ],
    output: "/assets/Expt No.15 - Cellular System/CN_15.docx"
  }
];


/* -------------------------------------------------------------
   DOM REFERENCES
-------------------------------------------------------------- */
const list = document.getElementById("practicalList");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupCode = document.getElementById("popupCode");
const fileTabs = document.getElementById("fileTabs");
const closeBtn = document.getElementById("closeBtn");

const cacheBar = document.getElementById("cacheBar");
const cacheBarText = document.getElementById("cacheBarText");
const cacheBarContainer = document.getElementById("cacheBarContainer");

let currentCode = "";
let currentFontSize = 0.95;


/* -------------------------------------------------------------
   RENDER PRACTICAL CARDS
-------------------------------------------------------------- */
practicals.forEach((p) => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `<h3>${p.name}</h3><span>${p.desc}</span>`;
  card.onclick = () => openPopup(p);
  list.appendChild(card);
});


/* -------------------------------------------------------------
   POPUP LOGIC
-------------------------------------------------------------- */
function openPopup(p) {
  popup.style.display = "flex";
  popupTitle.textContent = p.name;

  fileTabs.innerHTML = "";
  
  p.files.forEach((file, idx) => {
    const tab = document.createElement("button");
    tab.className = "file-tab";
    tab.textContent = file.name;
    tab.onclick = () => setActiveFile(p, idx);
    fileTabs.appendChild(tab);
  });

  renderControls(p);
  setActiveFile(p, 0);
}

function setActiveFile(practical, index) {
  [...fileTabs.children].forEach((tab, i) =>
    tab.classList.toggle("active", i === index)
  );

  const file = practical.files[index];
  fetch(file.path)
    .then((r) => r.text())
    .then((code) => {
      currentCode = code;
      popupCode.textContent = code;
    });
}

function renderControls(p) {
  const controls = document.querySelector(".popup-controls");
  controls.innerHTML = "";

  const downloadBtn = document.createElement("button");
  downloadBtn.className = "copy-btn";
  downloadBtn.textContent = "⬇️ Download Output (.docx)";
  downloadBtn.onclick = () => downloadDocx(p.output);
  controls.appendChild(downloadBtn);

  const minus = document.createElement("button");
  minus.className = "font-btn";
  minus.textContent = "−";
  minus.onclick = () => {
    currentFontSize -= 0.1;
    popupCode.style.fontSize = currentFontSize + "rem";
  };

  const plus = document.createElement("button");
  plus.className = "font-btn";
  plus.textContent = "+";
  plus.onclick = () => {
    currentFontSize += 0.1;
    popupCode.style.fontSize = currentFontSize + "rem";
  };

  const copyBtn = document.createElement("button");
  copyBtn.className = "copy-btn";
  copyBtn.textContent = "📋 Copy Code";
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(currentCode);
    copyBtn.textContent = "✓ Copied!";
    setTimeout(() => (copyBtn.textContent = "📋 Copy Code"), 1200);
  };

  controls.append(minus, plus, copyBtn);
}

closeBtn.onclick = () => (popup.style.display = "none");


/* -------------------------------------------------------------
   OUTPUT DOCX OFFLINE DOWNLOAD
-------------------------------------------------------------- */
async function downloadDocx(path) {
  try {
    const cache = await caches.open("cn-vault-v5");
    const cached = await cache.match(path);

    let blob;

    if (cached) {
      blob = await cached.blob();
    } else {
      const res = await fetch(path);
      blob = await res.blob();
      cache.put(path, res.clone());
    }

    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = path.split("/").pop();
    link.click();

  } catch (err) {
    showToast("⚠️ File not available offline. Connect once.");
  }
}


/* -------------------------------------------------------------
   CACHING PROGRESS BAR + TOASTS
-------------------------------------------------------------- */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", (event) => {

    // Progress %
    if (event.data.type === "CACHE_PROGRESS") {
      cacheBarContainer.style.display = "block";
      cacheBarText.style.display = "block";

      cacheBar.style.width = event.data.progress + "%";
      cacheBarText.textContent = `Caching files… ${event.data.progress}%`;

      if (event.data.progress >= 100) {
        cacheBarText.textContent = "✔ All files cached!";
        setTimeout(() => (cacheBarContainer.style.display = "none"), 2500);
      }
    }

    // DOCX Cached Toast
    if (event.data.type === "DOCX_CACHED") {
      showToast(`📄 ${event.data.file} cached for offline use`);
    }
  });
}


/* -------------------------------------------------------------
   TOAST NOTIFICATION
-------------------------------------------------------------- */
function showToast(msg) {
  const t = document.createElement("div");
  t.textContent = msg;
  t.style.cssText = `
    position: fixed;
    bottom: 25px;
    left: 50%;
    transform: translateX(-50%);
    background: linear-gradient(135deg,#00ff9d,#0099ff);
    color: white;
    padding: 10px 20px;
    border-radius: 10px;
    z-index: 9999;
    font-weight: 600;
    box-shadow: 0 4px 15px rgba(0,0,0,0.3);
    opacity: 0;
    transition: opacity 0.3s ease;
  `;
  document.body.appendChild(t);

  setTimeout(() => (t.style.opacity = "1"), 50);
  setTimeout(() => (t.style.opacity = "0"), 2500);
  setTimeout(() => t.remove(), 3000);
}


/* -------------------------------------------------------------
   FOOTER VERSION
-------------------------------------------------------------- */
document.getElementById("buildVersion").textContent =
  new Date().toLocaleString("en-IN", { dateStyle: "medium", timeStyle: "short" });

