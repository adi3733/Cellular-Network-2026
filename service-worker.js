/* -------------------------------------------------------------
   Cellular Network Code Vault — FINAL Offline Service Worker
   With:
   ✔ Caching Progress %
   ✔ DOCX Cached Notifications
   ✔ Automatic Offline Update
-------------------------------------------------------------- */

// Change version to force browser update
const CACHE_NAME = "cn-vault-v5";

/* -------------------------------------------------------------
   ALL FILES TO CACHE (MUST MATCH EXACT FOLDER NAMES)
-------------------------------------------------------------- */
const CACHE_ASSETS = [
  "/", "/index.html", "/style-v2.css", "/script.js", "/manifest.json",

  // Static Icons
  "/assets/favicon.png",
  "/assets/micro_logo.png",
  "/assets/HD Logo PNG.png",
  "/assets/Caution.png",

  // -------------------------------
  // CN LAB PRACTICAL FILES (EXACT PATHS)
  // -------------------------------

  // Expt 1
  "/assets/Expt No.1 - Hata Model for large city/CN_1_Code.txt",
  "/assets/Expt No.1 - Hata Model for large city/CN_1.docx",

  // Expt 3
  "/assets/Expt No.3 - BER performance over a wire line AWGN channel/CN_3_Code.txt",
  "/assets/Expt No.3 - BER performance over a wire line AWGN channel/CN_3.docx",

  // Expt 5
  "/assets/Expt No.5 - Power vs RMS Delay spread/CN_5_Code.txt",
  "/assets/Expt No.5 - Power vs RMS Delay spread/CN_5_Script.txt",
  "/assets/Expt No.5 - Power vs RMS Delay spread/CN_5.docx",

  // Expt 6
  "/assets/Expt No.6 - Link-Budget analysis/CN_6_Code.txt",
  "/assets/Expt No.6 - Link-Budget analysis/CN_6.docx",

  // Expt 7
  "/assets/Expt No.7 - BER MIMO/CN_7_Code.txt",
  "/assets/Expt No.7 - BER MIMO/CN_7.docx",

  // Expt 9
  "/assets/Expt No.9 - MIMO Channel Coefficient/CN_9_Code.txt",
  "/assets/Expt No.9 - MIMO Channel Coefficient/CN_9.docx",

  // Expt 10
  "/assets/Expt No.10 - Doppler Shift/CN_10_Code.txt",
  "/assets/Expt No.10 - Doppler Shift/CN_10.docx",

  // Expt 13
  "/assets/Expt No.13 - OFDM - BER Vs Eb-N0/CN_13_Code.txt",
  "/assets/Expt No.13 - OFDM - BER Vs Eb-N0/CN_13.docx",

  // Expt 15
  "/assets/Expt No.15 - Cellular System/CN_15_Code.txt",
  "/assets/Expt No.15 - Cellular System/CN_15.docx"
];

/* -------------------------------------------------------------
   INSTALL EVENT → CACHE WITH PROGRESS UPDATES
-------------------------------------------------------------- */
self.addEventListener("install", (event) => {
  event.waitUntil(
    (async () => {
      const cache = await caches.open(CACHE_NAME);

      const total = CACHE_ASSETS.length;
      let done = 0;

      for (const asset of CACHE_ASSETS) {
        try {
          await cache.add(asset);
          done++;

          // Send caching progress to the webpage
          const percent = Math.floor((done / total) * 100);
          notifyClients({ type: "CACHE_PROGRESS", progress: percent });

          // Notify when a DOCX file is cached
          if (asset.endsWith(".docx")) {
            const filename = asset.split("/").pop();
            notifyClients({
              type: "DOCX_CACHED",
              file: filename,
            });
          }

        } catch (err) {
          console.warn("Failed to cache:", asset);
        }
      }
    })()
  );

  self.skipWaiting();
});

/* -------------------------------------------------------------
   ACTIVATE EVENT → CLEAR OLD CACHES
-------------------------------------------------------------- */
self.addEventListener("activate", async (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((key) => key !== CACHE_NAME && caches.delete(key)))
    )
  );
  self.clients.claim();
});

/* -------------------------------------------------------------
   FETCH EVENT → OFFLINE FIRST
-------------------------------------------------------------- */
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedFile) => {
      return (
        cachedFile ||
        fetch(event.request)
          .then((response) => {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, clone);
            });
            return response;
          })
          .catch(() => caches.match("/index.html"))
      );
    })
  );
});

/* -------------------------------------------------------------
   SEND MESSAGES TO ALL CLIENTS (PAGES)
-------------------------------------------------------------- */
function notifyClients(message) {
  self.clients.matchAll().then((clients) => {
    clients.forEach((client) => client.postMessage(message));
  });
}

