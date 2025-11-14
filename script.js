/* script.js - final (cache name matches service-worker) */

const CACHE_NAME = "cn-vault-v10";

const practicals = [
  { id:1, name:"Expt No.1 - Hata Model for large city", desc:"Hata / Okumura propagation model",
    files:[ {name:"CN_1_Code.txt", path:"/assets/Expt%20No.1%20-%20Hata%20Model%20for%20large%20city/CN_1_Code.txt"} ],
    output:"/assets/Expt%20No.1%20-%20Hata%20Model%20for%20large%20city/CN_1.docx"
  },
  /* ... include all practical objects exactly as in your current script (use the URL-encoded paths) ... */
  { id:3, name:"Expt No.3 - BER performance over AWGN", desc:"BER over AWGN",
    files:[ {name:"CN_3_Code.txt", path:"/assets/Expt%20No.3%20-%20BER%20performance%20over%20a%20wire%20line%20AWGN%20channel/CN_3_Code.txt"} ],
    output:"/assets/Expt%20No.3%20-%20BER%20performance%20over%20a%20wire%20line%20AWGN%20channel/CN_3.docx"
  },
  // ... rest ...
];

const list = document.getElementById("practicalList");
const popup = document.getElementById("popup");
const popupTitle = document.getElementById("popupTitle");
const popupCode = document.getElementById("popupCode");
const fileTabs = document.getElementById("fileTabs");
const closeBtn = document.getElementById("closeBtn");

const cacheBarContainer = document.getElementById("cacheBarContainer");
const cacheBar = document.getElementById("cacheBar");
const cacheBarText = document.getElementById("cacheBarText");
const offlineBanner = document.getElementById("offlineBanner");
const offlineReadyBadge = document.getElementById("offlineReadyBadge");

let currentCode = "";
let currentFontSize = 0.95;

practicals.forEach(p => {
  const card = document.createElement("div");
  card.className = "card";
  card.innerHTML = `<h3>${p.name}</h3><span>${p.desc}</span>`;
  card.onclick = () => openPopup(p);
  list.appendChild(card);
});

function openPopup(p) {
  popup.style.display = "flex";
  popupTitle.textContent = p.name;
  fileTabs.innerHTML = "";
  p.files.forEach((f,i) => {
    const btn = document.createElement("button");
    btn.className = "file-tab";
    btn.textContent = f.name;
    btn.onclick = () => setActiveFile(p,i);
    fileTabs.appendChild(btn);
  });
  renderControls(p);
  setActiveFile(p,0);
}

function setActiveFile(practical, index) {
  [...fileTabs.children].forEach((t,i)=> t.classList.toggle("active", i===index));
  const file = practical.files[index];
  fetch(file.path).then(r=>r.text()).then(txt=>{
    currentCode = txt;
    popupCode.textContent = txt;
    popupCode.style.fontSize = currentFontSize + "rem";
  }).catch(()=> popupCode.textContent = "Unable to load file.");
}

function renderControls(p) {
  const ctrls = document.querySelector(".popup-controls");
  ctrls.innerHTML = "";
  const dl = document.createElement("button");
  dl.className = "copy-btn";
  dl.textContent = "⬇️ Download Output (.docx)";
  dl.onclick = () => downloadDocx(p.output);
  ctrls.appendChild(dl);

  const minus = document.createElement("button");
  minus.className = "font-btn"; minus.textContent = "−";
  minus.onclick = ()=> { currentFontSize = Math.max(0.6, currentFontSize-0.1); popupCode.style.fontSize = currentFontSize + "rem"; };
  const plus = document.createElement("button");
  plus.className = "font-btn"; plus.textContent = "+"; 
  plus.onclick = ()=> { currentFontSize += 0.1; popupCode.style.fontSize = currentFontSize + "rem"; };

  const copyBtn = document.createElement("button");
  copyBtn.className = "copy-btn"; copyBtn.textContent = "📋 Copy Code";
  copyBtn.onclick = () => { navigator.clipboard.writeText(currentCode); copyBtn.textContent = "✓ Copied!"; setTimeout(()=> copyBtn.textContent = "📋 Copy Code",1200); };

  ctrls.append(minus, plus, copyBtn);
}

closeBtn.onclick = ()=> popup.style.display = "none";

async function downloadDocx(path) {
  try {
    const cache = await caches.open(CACHE_NAME);
    const match = await cache.match(path);
    if (!match) {
      showToast("⚠️ Not cached yet. Open online once to cache.");
      return;
    }
    const blob = await match.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url; a.download = path.split("/").pop(); a.click();
    URL.revokeObjectURL(url);
  } catch (e) {
    showToast("⚠️ Error downloading file.");
  }
}

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
        setTimeout(()=> offlineReadyBadge.style.display = "none", 3500);
        setTimeout(()=> cacheBarContainer.style.display = "none", 3000);
      }
    }
    if (event.data.type === "DOCX_CACHED") {
      showToast(`📄 ${event.data.file} cached for offline use`);
    }
  });
}

function showToast(msg) {
  const t = document.createElement("div");
  t.className = "toast";
  t.textContent = msg;
  document.body.appendChild(t);
  setTimeout(()=> t.remove(), 3000);
}

window.addEventListener("offline", ()=> offlineBanner.style.display = "block");
window.addEventListener("online", ()=> offlineBanner.style.display = "none");

document.getElementById("buildVersion").textContent = new Date().toLocaleString("en-IN", { dateStyle:"medium", timeStyle:"short" });

