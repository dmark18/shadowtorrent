const admin = require("firebase-admin");
const fs = require("fs");

// Töltsd be a kulcsot
const serviceAccount = require("./shadowtorrent.json");

// Inicializálás
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();

// Töltsd be a JSON adatot fájlból vagy közvetlenül
const torrents = require("./torrents.json"); // vagy használj JSON.parse(...)

async function uploadTorrents() {
  const batch = db.batch();
  const torrentsCollection = db.collection("torrents");

  torrents.forEach(torrent => {
    const docRef = torrentsCollection.doc(torrent.id.toString());
    batch.set(docRef, torrent);
  });

  try {
    await batch.commit();
    console.log("Torrentek sikeresen feltöltve a Firestore-ba!");
  } catch (error) {
    console.error("Hiba történt a feltöltés során:", error);
  }
}

uploadTorrents();
