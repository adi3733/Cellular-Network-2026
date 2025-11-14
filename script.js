/* -------------------------------------------------------------
   Cellular Network Code Vault — FINAL script.js (v10)
   ✔ All practicals fixed
   ✔ All paths URL-encoded
   ✔ Offline Ready + Banner
   ✔ Progress Bar
   ✔ DOCX Offline Download
-------------------------------------------------------------- */

/* script.js */
const CACHE_NAME = "cn-vault-v10";


/* -------------------------------------------------------------
   PRACTICALS (FULL & CORRECTED)
-------------------------------------------------------------- */
const practicals = [

  {
    id: 1,
    name: "Expt No.1 - Hata Model for large city",
    desc: "Hata / Okumura propagation model",
    files: [
      {
        name: "CN_1_Code.txt",
        path: "/assets/Expt%20No.1%20-%20Hata%20Model%20for%20large%20city/CN_1_Code.txt"
      }
    ],
    output: "/assets/Expt%20No.1%20-%20Hata%20Model%20for%20large%20city/CN_1.docx"
  },

  {
    id: 3,
    name: "Expt No.3 - BER performance over AWGN",
    desc: "BER over a wire-line AWGN channel",
    files: [
      {
        name: "CN_3_Code.txt",
        path: "/assets/Expt%20No.3%20-%20BER%20performance%20over%20a%20wire%20line%20AWGN%20channel/CN_3_Code.txt"
      }
    ],
    output: "/assets/Expt%20No.3%20-%20BER%20performance%20over%20a%20wire%20line%20AWGN%20channel/CN_3.docx"
  },

  {
    id: 5,
    name: "Expt No.5 - Power vs RMS Delay Spread",
    desc: "Delay spread & power relation",
    files: [
      {
        name: "CN_5_Code.txt",
        path: "/assets/Expt%20No.5%20-%20Power%20vs%20RMS%20Delay%20spread/CN_5_Code.txt"
      },
      {
        name: "CN_5_Script.txt",
        path: "/assets/Expt%20No.5%20-%20Power%20vs%20RMS%20Delay%20spread/CN_5_Script.txt"
      }
    ],
    output: "/assets/Expt%20No.5%20-%20Power%20vs%20RMS%20Delay%20spread/CN_5.docx"
  },

  {
    id: 6,
    name: "Expt No.6 - Link-Budget analysis",
    desc: "Link budget & path loss calculations",
    files: [
      {
        name: "CN_6_Code.txt",
        path: "/assets/Expt%20No.6%20-%20Link-Budget%20analysis/CN_6_Code.txt"
      }
    ],
    output: "/assets/Expt%20No.6%20-%20Link-Budget%20analysis/CN_6.docx"
  },

  {
    id: 7,
    name: "Expt No.7 - BER MIMO",
    desc: "Bit error rate for MIMO systems",
    files: [
      {
        name: "CN_7_Code.txt",
        path: "/assets/Expt%20No.7%20-%20BER%20MIMO/CN_7_Code.txt"
      }
    ],
    output: "/assets/Expt%20No.7%20-%20BER%20MIMO/CN_7.docx"
  },

  {
    id: 9,
    name: "Expt No.9 - MIMO Channel Coefficient",
    desc: "Channel estimation for MIMO",
    files: [
      {
        name: "CN_9_Code.txt",
        path: "/assets/Expt%20No.9%20-%20MIMO%20Channel%20Coefficient/CN_9_Code.txt"
      }
    ],
    output: "/assets/Expt%20No.9%20-%20MIMO%20Channel%20Coefficient/CN_9.docx"
  },

  {
    id: 10,
    name: "Expt No.10 - Doppler Shift",
    desc: "Mobile Doppler shift simulation",
    files: [
      {
        name: "CN_10_Code.txt",
        path: "/assets/Expt%20No.10%20-%20Doppler%20Shift/CN_10_Code.txt"
      }
    ],
    output: "/assets/Expt%20No.10%20-%20Doppler%20Shift/CN_10.docx"
  },

  {
    id: 13,
    name: "Expt No.13 - OFDM - BER Vs Eb/N0",
    desc: "OFDM BER performance",
    files: [
      {
        name: "CN_13_Code.txt",
        path: "/assets/Expt%20No.13%20-%20OFDM%20-%20BER%20Vs%20Eb-N0/CN_13_Code.txt"
      }
    ],
    output: "/assets/Expt%20No.13%20-%20OFDM%20-%20BER%20Vs%20Eb-N0/CN_13.docx"
  },

  {
    id: 15,
    name: "Expt No.15 - Cellular System",
    desc: "Cell planning & reuse",
    files: [
      {
        name: "CN_15_Code.txt",
        path: "/assets/Expt%20No.15%20-%20Cellular%20System/CN_15_Code.txt"
      }
    ],
    output: "/assets/Expt%20No.15%20-%20Cellular%20System/CN_15.docx"
  }

];


const list = document.getElementById("practicalList");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupCode = document.getElementById("popupCode");
const fileTabs = document.getElementById("fileTabs");
const closeBtn = document.getElementById("closeBtn");

const cacheBar = document.getElementById("cacheBar");
const cacheBarText = document.getElementById("cacheBarText");
const cacheBarContainer = document.getElementById("cacheBarContainer");
const offlineBanner = document.getElementById("offlineBanner");
const offlineReadyBadge = document.getElementById("offlineReadyBadge");

let currentCode = "";
let currentFontSize = 0.95;

/* -------------------------------------------------------------
   Render All Cards
-------------------------------------------------------------- */
practicals.forEach((p) => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `<h3>${p.name}</h3><span>${p.desc}</span>`;
  card.onclick = () => openPopup(p);
  list.appendChild(card);
});

/* -------------------------------------------------------------
   Popup
-------------------------------------------------------------- */
function openPopup(p) {
  popup.style.display = "flex";
  popupTitle.textContent = p.name;
  fileTabs.innerHTML = "";

  p.files.forEach((file, index) => {
    const tab = document.createElement("button");
    tab.className = "file-tab";
    tab.textContent = file.name;
    tab.onclick = () => setActiveFile(p, index);
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
    .then((res) => res.text())
    .then((code) => {
      currentCode = code;
      popupCode.textContent = code;
      popupCode.style.fontSize = currentFontSize + "rem";
    })
    .catch(() => {
      popupCode.textContent = "⚠ Unable to load file";
    });
}

function renderControls(p) {
  const ctrls = document.querySelector(".popup-controls");
  ctrls.innerHTML = "";

  const downloadBtn = document.createElement("button");
  downloadBtn.className = "copy-btn";
  downloadBtn.textContent = "⬇️ Download Output (.docx)";
  downloadBtn.onclick = () => downloadDocx(p.output);
  ctrls.appendChild(downloadBtn);

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
    setTimeout(() => (copyBtn.textContent = "📋 Copy Code"), 1000);
  };

  ctrls.append(minus, plus, copyBtn);
}

closeBtn.onclick = () => (popup.style.display = "none");

/* -------------------------------------------------------------
   Offline DOCX Download
-------------------------------------------------------------- */
async function downloadDocx(path) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const file = await cache.match(path);

    if (!file) {
      showToast("⚠ File not yet cached. Connect once.");
      return;
    }

    const blob = await file.blob();
    const url = URL.createObjectURL(blob);

    const a = document.createElement("a");
    a.href = url;
    a.download = path.split("/").pop();
    a.click();
    URL.revokeObjectURL(url);

  } catch (err) {
    showToast("⚠ Error downloading file.");
  }
}

/* -------------------------------------------------------------
   Progress Bar + Offline Ready Badge
-------------------------------------------------------------- */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (!event.data) return;

    if (event.data.type === "CACHE_PROGRESS") {
      cacheBarContainer.style.display = "block";
      cacheBarText.style.display = "block";

      cacheBar.style.width = event.data.progress + "%";
      cacheBarText.textContent = `Caching files… ${event.data.progress}%`;

      if (event.data.progress >= 100) {
        cacheBarText.textContent = "✔ All files cached!";
        offlineReadyBadge.style.display = "block";
        setTimeout(() => (offlineReadyBadge.style.display = "none"), 4000);
        setTimeout(() => (cacheBarContainer.style.display = "none"), 3000);
      }
    }

    if (event.data.type === "DOCX_CACHED") {
      showToast(`📄 ${event.data.file} cached`);
    }
  });
}

/* -------------------------------------------------------------
   Toast
-------------------------------------------------------------- */
function showToast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 3000);
}

/* -------------------------------------------------------------
   Offline Detection
-------------------------------------------------------------- */
window.addEventListener("offline", () => {
  offlineBanner.style.display = "block";
});
window.addEventListener("online", () => {
  offlineBanner.style.display = "none";
});


/* -------------------------------------------------------------
   Version in footer
-------------------------------------------------------------- */
document.getElementById("buildVersion").textContent = new Date().toLocaleString("en-IN", {
  dateStyle: "medium",
  timeStyle: "short"
});
