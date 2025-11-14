/* -------------------------------------------------------------
   Cellular Network Code Vault — Clean Final Version (No ZIP)
   Developer: Adiii
-------------------------------------------------------------- */

/* -------------------------------------------------------------
   PRACTICAL LIST (CN LAB 304196)
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
    desc: "BER analysis over wire-line AWGN channel",
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
    desc: "Path loss, margin & gain computations",
    files: [
      { name: "CN_6_Code.txt", path: "/assets/Expt No.6 - Link-Budget analysis/CN_6_Code.txt" }
    ],
    output: "/assets/Expt No.6 - Link-Budget analysis/CN_6.docx"
  },

  {
    id: 7,
    name: "Expt No.7 - BER MIMO",
    desc: "Bit error rate for MIMO systems",
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
    desc: "OFDM performance with noise",
    files: [
      { name: "CN_13_Code.txt", path: "/assets/Expt No.13 - OFDM - BER Vs Eb-N0/CN_13_Code.txt" }
    ],
    output: "/assets/Expt No.13 - OFDM - BER Vs Eb-N0/CN_13.docx"
  },

  {
    id: 15,
    name: "Expt No.15 - Cellular System",
    desc: "Cell structure, reuse, capacity",
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

const cacheProgress = document.getElementById("cacheProgress");

let currentCode = "";
let currentFontSize = 0.95;

/* -------------------------------------------------------------
   RENDER PRACTICAL CARDS
-------------------------------------------------------------- */
practicals.forEach((p) => {
  const card = document.createElement("div");
  card.className = "card";

  const count = p.files.length;

  card.innerHTML = `
    <h3>${p.name}</h3>
    <span>${p.desc} — ${count} file${count > 1 ? "s" : ""}</span>
  `;

  card.onclick = () => openPopup(p);
  list.appendChild(card);
});

/* -------------------------------------------------------------
   POPUP VIEWER
-------------------------------------------------------------- */
function openPopup(p) {
  popup.style.display = "flex";

  popupTitle.textContent = `${p.name}`;

  fileTabs.innerHTML = "";
  popupCode.textContent = "";
  currentFontSize = 0.95;

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
  const tabs = Array.from(fileTabs.children);
  tabs.forEach((tab, i) => tab.classList.toggle("active", i === index));

  const file = practical.files[index];

  fetch(file.path)
    .then((res) => res.text())
    .then((code) => {
      currentCode = code;
      popupCode.textContent = code;
      popupCode.style.fontSize = `${currentFontSize}rem`;
    })
    .catch(() => {
      popupCode.textContent = `⚠️ Cannot load ${file.name}`;
    });
}

function renderControls(practical) {
  const controls = document.querySelector(".popup-controls");
  controls.innerHTML = "";

  if (practical.output) {
    const downloadBtn = document.createElement("button");
    downloadBtn.textContent = "⬇️ Download Output (.docx)";
    downloadBtn.className = "copy-btn";

    downloadBtn.onclick = async () => {
      try {
        const cache = await caches.open("cellular-network-v1");
        const cached = await cache.match(practical.output);

        let blob;
        if (cached) blob = await cached.blob();
        else {
          const net = await fetch(practical.output);
          blob = await net.blob();
          cache.put(practical.output, net.clone());
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = practical.output.split("/").pop();
        a.click();
        URL.revokeObjectURL(url);

      } catch (err) {
        alert("⚠ File not cached yet. Please open online once.");
      }
    };

    controls.appendChild(downloadBtn);
  }

  const btnMinus = document.createElement("button");
  btnMinus.className = "font-btn";
  btnMinus.textContent = "−";
  btnMinus.onclick = () => {
    if (currentFontSize > 0.6) {
      currentFontSize -= 0.1;
      popupCode.style.fontSize = `${currentFontSize}rem`;
    }
  };

  const btnPlus = document.createElement("button");
  btnPlus.className = "font-btn";
  btnPlus.textContent = "+";
  btnPlus.onclick = () => {
    currentFontSize += 0.1;
    popupCode.style.fontSize = `${currentFontSize}rem`;
  };

  const copyBtn = document.createElement("button");
  copyBtn.className = "copy-btn";
  copyBtn.textContent = "📋 Copy Code";
  copyBtn.onclick = () => {
    navigator.clipboard.writeText(currentCode);
    copyBtn.textContent = "✓ Copied!";
    setTimeout(() => (copyBtn.textContent = "📋 Copy Code"), 1500);
  };

  controls.appendChild(btnMinus);
  controls.appendChild(btnPlus);
  controls.appendChild(copyBtn);
}

closeBtn.onclick = () => (popup.style.display = "none");

/* -------------------------------------------------------------
   BUILD VERSION (FOOTER)
-------------------------------------------------------------- */
document.getElementById("buildVersion").textContent =
  new Date().toLocaleString("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  });

/* -------------------------------------------------------------
   CACHE PROGRESS LISTENER
-------------------------------------------------------------- */
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (event.data?.type === "CACHE_PROGRESS") {
      cacheProgress.style.display = "block";
      cacheProgress.textContent =
        `Downloading for offline use: ${event.data.progress}%`;

      if (event.data.progress >= 100) {
        setTimeout(() => {
          cacheProgress.textContent = "✔ Ready Offline!";
        }, 800);
      }
    }
  });
}

