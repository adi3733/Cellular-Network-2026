/* service-worker.js
   Fixed: URL-encoded asset paths for Vercel
   Cache name must match script.js (cn-vault-v10)
*/

const CACHE_NAME = "cn-vault-v10";

const CACHE_ASSETS = [
  "/", "/index.html", "/style-v2.css", "/script.js", "/manifest.json",

  "/assets/favicon.png",
  "/assets/micro_logo.png",
  "/assets/HD%20Logo%20PNG.png",
  "/assets/Caution.png",

  // Expt 1
  "/assets/Expt%20No.1%20-%20Hata%20Model%20for%20large%20city/CN_1_Code.txt",
  "/assets/Expt%20No.1%20-%20Hata%20Model%20for%20large%20city/CN_1.docx",

  // Expt 3
  "/assets/Expt%20No.3%20-%20BER%20performance%20over%20a%20wire%20line%20AWGN%20channel/CN_3_Code.txt",
  "/assets/Expt%20No.3%20-%20BER%20performance%20over%20a%20wire%20line%20AWGN%20channel/CN_3.docx",

  // Expt 5
  "/assets/Expt%20No.5%20-%20Power%20vs%20RMS%20Delay%20spread/CN_5_Code.txt",
  "/assets/Expt%20No.5%20-%20Power%20vs%20RMS%20Delay%20spread/CN_5_Script.txt",
  "/assets/Expt%20No.5%20-%20Power%20vs%20RMS%20Delay%20spread/CN_5.docx",

  // Expt 6
  "/assets/Expt%20No.6%20-%20Link-Budget%20analysis/CN_6_Code.txt",
  "/assets/Expt%20No.6%20-%20Link-Budget%20analysis/CN_6.docx",

  // Expt 7
  "/assets/Expt%20No.7%20-%20BER%20MIMO/CN_7_Code.txt",
  "/assets/Expt%20No.7%20-%20BER%20MIMO/CN_7.docx",

  // Expt 9
  "/assets/Expt%20No.9%20-%20MIMO%20Channel%20Coefficient/CN_9_Code.txt",
  "/assets/Expt%20No.9%20-%20MIMO%20Channel%20Coefficient/CN_9.docx",

  // Expt 10
  "/assets/Expt%20No.10%20-%20Doppler%20Shift/CN_10_Code.txt",
  "/assets/Expt%20No.10%20-%20Doppler%20Shift/CN_10.docx",

  // Expt 13
  "/assets/Expt%20No.13%20-%20OFDM%20-%20BER%20Vs%20Eb-N0/CN_13_Code.txt",
  "/assets/Expt%20No.13%20-%20OFDM%20-%20BER%20Vs%20Eb-N0/CN_13.docx",

  // Expt 15
  "/assets/Expt%20No.15%20-%20Cellular%20System/CN_15_Code.txt",
  "/assets/Expt%20No.15%20-%20Cellular%20System/CN_15.docx"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const total = CACHE_ASSETS.length;
    let done = 0;
    for (const asset of CACHE_ASSETS) {
      try {
        await cache.add(asset);
        done++;
        const progress = Math.floor((done / total) * 100);
        notifyClients({ type: "CACHE_PROGRESS", progress });
        if (asset.endsWith(".docx")) {
          notifyClients({ type: "DOCX_CACHED", file: asset.split("/").pop() });
        }
      } catch (err) {
        console.warn("Cache failed for:", asset, err);
      }
    }
  })());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then(keys =>
    Promise.all(keys.map(k => k !== CACHE_NAME && caches.delete(k)))
  ));
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then(cached => {
      return cached || fetch(event.request).then(resp => {
        const clone = resp.clone();
        caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
        return resp;
      }).catch(() => caches.match("/index.html"));
    })
  );
});

function notifyClients(msg) {
  self.clients.matchAll().then(clients => clients.forEach(c => c.postMessage(msg)));
}
