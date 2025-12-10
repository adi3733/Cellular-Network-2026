/* -------------------------------------------------------------
   Cellular Network Code Vault — PREMIUM SCRIPT (v11)
   ✔ Search Functionality
   ✔ New UI Integration
   ✔ Service Worker & Caching
-------------------------------------------------------------- */

const CACHE_NAME = "cn-vault-v11";

/* -------------------------------------------------------------
   PRACTICALS DATA
-------------------------------------------------------------- */
const practicals = [
  {
    id: 1,
    name: "Expt No.1 - Hata Model for large city",
    desc: "Hata / Okumura propagation model",
    files: [
      { name: "CN_1_Code.txt", path: "/assets/Expt%20No.1%20-%20Hata%20Model%20for%20large%20city/CN_1_Code.txt" }
    ],
    output: "/assets/Expt%20No.1%20-%20Hata%20Model%20for%20large%20city/CN_1.docx"
  },
  {
    id: 3,
    name: "Expt No.3 - BER performance over AWGN",
    desc: "BER over a wire-line AWGN channel",
    files: [
      { name: "CN_3_Code.txt", path: "/assets/Expt%20No.3%20-%20BER%20performance%20over%20a%20wire%20line%20AWGN%20channel/CN_3_Code.txt" }
    ],
    output: "/assets/Expt%20No.3%20-%20BER%20performance%20over%20a%20wire%20line%20AWGN%20channel/CN_3.docx"
  },
  {
    id: 5,
    name: "Expt No.5 - Power vs RMS Delay Spread",
    desc: "Delay spread & power relation",
    files: [
      { name: "CN_5_Code.txt", path: "/assets/Expt%20No.5%20-%20Power%20vs%20RMS%20Delay%20spread/CN_5_Code.txt" },
      { name: "CN_5_Script.txt", path: "/assets/Expt%20No.5%20-%20Power%20vs%20RMS%20Delay%20spread/CN_5_Script.txt" }
    ],
    output: "/assets/Expt%20No.5%20-%20Power%20vs%20RMS%20Delay%20spread/CN_5.docx"
  },
  {
    id: 6,
    name: "Expt No.6 - Link-Budget analysis",
    desc: "Link budget & path loss calculations",
    files: [
      { name: "CN_6_Code.txt", path: "/assets/Expt%20No.6%20-%20Link-Budget%20analysis/CN_6_Code.txt" }
    ],
    output: "/assets/Expt%20No.6%20-%20Link-Budget%20analysis/CN_6.docx"
  },
  {
    id: 7,
    name: "Expt No.7 - BER MIMO",
    desc: "Bit error rate for MIMO systems",
    files: [
      { name: "CN_7_Code.txt", path: "/assets/Expt%20No.7%20-%20BER%20MIMO/CN_7_Code.txt" }
    ],
    output: "/assets/Expt%20No.7%20-%20BER%20MIMO/CN_7.docx"
  },
  {
    id: 9,
    name: "Expt No.9 - MIMO Channel Coefficient",
    desc: "Channel estimation for MIMO",
    files: [
      { name: "CN_9_Code.txt", path: "/assets/Expt%20No.9%20-%20MIMO%20Channel%20Coefficient/CN_9_Code.txt" }
    ],
    output: "/assets/Expt%20No.9%20-%20MIMO%20Channel%20Coefficient/CN_9.docx"
  },
  {
    id: 10,
    name: "Expt No.10 - Doppler Shift",
    desc: "Mobile Doppler shift simulation",
    files: [
      { name: "CN_10_Code.txt", path: "/assets/Expt%20No.10%20-%20Doppler%20Shift/CN_10_Code.txt" }
    ],
    output: "/assets/Expt%20No.10%20-%20Doppler%20Shift/CN_10.docx"
  },
  {
    id: 13,
    name: "Expt No.13 - OFDM - BER Vs Eb/N0",
    desc: "OFDM BER performance",
    files: [
      { name: "CN_13_Code.txt", path: "/assets/Expt%20No.13%20-%20OFDM%20-%20BER%20Vs%20Eb-N0/CN_13_Code.txt" }
    ],
    output: "/assets/Expt%20No.13%20-%20OFDM%20-%20BER%20Vs%20Eb-N0/CN_13.docx"
  },
  {
    id: 15,
    name: "Expt No.15 - Cellular System",
    desc: "Cell planning & reuse",
    files: [
      { name: "CN_15_Code.txt", path: "/assets/Expt%20No.15%20-%20Cellular%20System/CN_15_Code.txt" }
    ],
    output: "/assets/Expt%20No.15%20-%20Cellular%20System/CN_15.docx"
  }
];


/* -------------------------------------------------------------
   DOM ELEMENTS
-------------------------------------------------------------- */
const list = document.getElementById("practicalList");
const searchInput = document.getElementById("searchInput");

// Popup Elements
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupCode = document.getElementById("popupCode");
const fileTabs = document.getElementById("fileTabs");
const closeBtn = document.getElementById("closeBtn");
const fontMinus = document.getElementById("fontMinus");
const fontPlus = document.getElementById("fontPlus");
const copyBtn = document.getElementById("copyBtn");
const downloadBtn = document.getElementById("downloadBtn");

// Status Elements
const cacheBar = document.getElementById("cacheBar");
const cacheBarContainer = document.getElementById("cacheBarContainer");
const offlineBanner = document.getElementById("offlineBanner");

let currentCode = "";
let currentFontSize = 0.95;
let currentPractical = null;

/* -------------------------------------------------------------
   RENDER LOGIC
-------------------------------------------------------------- */
function renderCards(filterText = "") {
  list.innerHTML = "";
  const lowerFilter = filterText.toLowerCase();

  const filtered = practicals.filter(p =>
    p.name.toLowerCase().includes(lowerFilter) ||
    p.desc.toLowerCase().includes(lowerFilter)
  );

  if (filtered.length === 0) {
    list.innerHTML = `<div style="text-align:center; grid-column: 1/-1; color: var(--text-muted); padding: 50px;">
      No practicals found matching "${filterText}"
    </div>`;
    return;
  }

  filtered.forEach((p) => {
    const card = document.createElement("div");
    card.className = "card";
    card.innerHTML = `
      <div class="card-icon">⚡</div>
      <h3>${p.name.replace(/Expt No\.(\d+)/, '<span style="color:var(--primary)">#$1</span>')}</h3>
      <span>${p.desc}</span>
    `;
    card.onclick = () => openPopup(p);
    list.appendChild(card);
  });
}

// Initial Render
renderCards();

// Search Listener
searchInput.addEventListener("input", (e) => {
  renderCards(e.target.value);
});


/* -------------------------------------------------------------
   POPUP LOGIC
-------------------------------------------------------------- */
function openPopup(p) {
  currentPractical = p;
  popupTitle.innerHTML = p.name;
  fileTabs.innerHTML = "";
  popup.style.display = "flex";

  // Trigger reflow for animation
  setTimeout(() => popup.classList.add("active"), 10);

  p.files.forEach((file, index) => {
    const tab = document.createElement("button");
    tab.className = "file-tab";
    tab.textContent = file.name;
    tab.onclick = () => setActiveFile(p, index);
    fileTabs.appendChild(tab);
  });

  setActiveFile(p, 0);
}

function closePopup() {
  popup.classList.remove("active");
  setTimeout(() => popup.style.display = "none", 300);
  currentCode = "";
}

closeBtn.onclick = closePopup;
popup.onclick = (e) => {
  if (e.target === popup) closePopup();
};

function setActiveFile(practical, index) {
  [...fileTabs.children].forEach((tab, i) =>
    tab.classList.toggle("active", i === index)
  );

  popupCode.innerHTML = '<span style="color:grey">Loading...</span>';

  /* Syntax Highlighting Logic */
  const highlightMatlab = (code) => {
    // Escape HTML to prevent injection
    let html = code
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;");

    // Patterns (Order matters!)
    const patterns = [
      // Comments (% ...)
      { regex: /(%.*?)$/gm, class: "code-comment" },
      // Strings ('...')
      { regex: /(')(?:''|[^'\n])*(')/g, class: "code-string" },
      // Numbers
      { regex: /\b\d+(\.\d+)?\b/g, class: "code-number" },
      // Keywords
      { regex: /\b(break|case|catch|classdef|continue|else|elseif|end|for|function|global|if|methods|otherwise|parfor|persistent|properties|return|spmd|switch|try|while|clc|clear|subplot|plot|title|xlabel|ylabel|grid|legend|hold)\b/g, class: "code-keyword" }
    ];

    // We need a way to apply regex without corrupting already replaced HTML tags.
    // A simple approach for this complexity: split by line and process, or use a tokenizer.
    // Given the constraints, we'll try a sequential replacement but be careful with overlap.
    // To avoid replacing inside tags, we can use a placeholder approach, but for this simple set:

    // 1. Comments (take precedence over keywords inside them)
    // We will process line by line to handle comments correctly
    return html.split('\n').map(line => {
      // Find the first % that refers to a comment (not inside a string)
      let commentIndex = -1;
      let inString = false;
      for (let i = 0; i < line.length; i++) {
        const char = line[i];
        if (char === "'" && (i === 0 || line[i - 1] !== '\\')) { // Simple quote toggle check
          inString = !inString;
        }
        if (!inString && char === '%') {
          commentIndex = i;
          break;
        }
      }

      let commentPart = "";
      let codePart = line;

      if (commentIndex !== -1) {
        commentPart = `<span class="code-comment">${line.substring(commentIndex)}</span>`;
        codePart = line.substring(0, commentIndex);
      }

      // Highlight code part
      if (codePart.trim().length > 0) {
        // Strings
        codePart = codePart.replace(/(')(?:''|[^'\n])*(')/g, '<span class="code-string">$&</span>');

        // Keywords (boundary check)
        codePart = codePart.replace(/\b(break|case|catch|classdef|continue|else|elseif|end|for|function|global|if|methods|otherwise|parfor|persistent|properties|return|spmd|switch|try|while|clc|clear|subplot|plot|title|xlabel|ylabel|grid|legend|hold)\b/g, '<span class="code-keyword">$1</span>');

        // Numbers (simple)
        codePart = codePart.replace(/\b\d+(\.\d+)?\b/g, '<span class="code-number">$&</span>');
      }

      return codePart + commentPart;
    }).join('\n');
  };

  const file = practical.files[index];

  fetch(file.path)
    .then((res) => {
      if (!res.ok) throw new Error("Failed to load");
      return res.text();
    })
    .then((code) => {
      currentCode = code;
      popupCode.innerHTML = highlightMatlab(code); // Use innerHTML
      popupCode.style.fontSize = currentFontSize + "rem";
    })
    .catch(() => {
      popupCode.textContent = "⚠ Unable to load file content from assets.";
    });
}

/* -------------------------------------------------------------
   CONTROLS
-------------------------------------------------------------- */
fontMinus.onclick = () => {
  currentFontSize = Math.max(0.6, currentFontSize - 0.1);
  popupCode.style.fontSize = currentFontSize + "rem";
};

fontPlus.onclick = () => {
  currentFontSize = Math.min(2.0, currentFontSize + 0.1);
  popupCode.style.fontSize = currentFontSize + "rem";
};

copyBtn.onclick = () => {
  if (!currentCode) return;
  navigator.clipboard.writeText(currentCode);
  const originalText = copyBtn.textContent;
  copyBtn.textContent = "✓ Copied!";
  copyBtn.style.borderColor = "var(--primary)";
  setTimeout(() => {
    copyBtn.textContent = originalText;
    copyBtn.style.borderColor = "";
  }, 1500);
};

downloadBtn.onclick = () => {
  if (currentPractical) {
    const originalText = downloadBtn.innerText;
    downloadBtn.innerText = "⏳ Downloading...";
    downloadBtn.style.opacity = "0.7";

    // Tiny delay to show the feedback
    setTimeout(() => {
      downloadDocx(currentPractical.output);
      downloadBtn.innerText = originalText;
      downloadBtn.style.opacity = "1";
    }, 500);
  }
};

/* -------------------------------------------------------------
   OFFLINE & CACHING
-------------------------------------------------------------- */
async function downloadDocx(path) {
  try {
    // Try network first, fall back to cache
    const cache = await caches.open(CACHE_NAME);
    let response = await cache.match(path);

    if (!response) {
      // If not in cache, try fetching (it might be online)
      try {
        const netRes = await fetch(path);
        if (netRes.ok) response = netRes;
      } catch (e) { }
    }

    if (!response) {
      showToast("⚠ File not cached and you are offline.");
      return;
    }

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = path.split("/").pop();
    a.click();
    URL.revokeObjectURL(url);
    showToast("⬇ Download started");

  } catch (err) {
    showToast("⚠ Error downloading file.");
  }
}

// Service Worker Messages
if ("serviceWorker" in navigator) {
  navigator.serviceWorker.addEventListener("message", (event) => {
    if (!event.data) return;

    if (event.data.type === "CACHE_PROGRESS") {
      cacheBarContainer.style.display = "block";
      cacheBar.style.width = event.data.progress + "%";

      if (event.data.progress >= 100) {
        setTimeout(() => (cacheBarContainer.style.display = "none"), 2000);
        showToast("✔ Offline Ready!");
      }
    }
  });
}

// Network Status
window.addEventListener("offline", () => offlineBanner.style.display = "block");
window.addEventListener("online", () => offlineBanner.style.display = "none");

// Toast Notification
function showToast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);

  // Trigger animation
  requestAnimationFrame(() => t.classList.add("show"));

  setTimeout(() => {
    t.classList.remove("show");
    setTimeout(() => t.remove(), 500);
  }, 3000);
}

// Splash Screen Logic
window.addEventListener("load", () => {
  setTimeout(() => {
    const splash = document.getElementById("splash-screen");
    if (splash) {
      splash.style.opacity = "0";
      setTimeout(() => splash.remove(), 800);
    }
  }, 2500);
});
