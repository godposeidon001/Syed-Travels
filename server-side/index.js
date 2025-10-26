require("dotenv").config();

const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const { verifyFirebaseToken } = require("./authMiddleware");

const app = express();
const port = process.env.PORT || 5000;

// ----- Middleware -----
app.use(
  cors({
    origin: process.env.CLIENT_ORIGIN || "http://localhost:5173",
    credentials: false,
  })
);
app.use(express.json());

// ----- Mongo -----
const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

// small helper
function oid(id) {
  return ObjectId.isValid(id) ? new ObjectId(id) : null;
}

let spotCollection;
let userCollection;
let bookingCollection;

async function start() {
  await client.connect();

  userCollection = client.db("syed_travels").collection("users");
  spotCollection = client.db("syed_travels_spots").collection("spots");
  bookingCollection = client.db("syed_travels_spots").collection("bookings");

  await userCollection.createIndex({ uid: 1 }, { unique: true });

  await spotCollection.createIndex({ uid: 1 });

  await bookingCollection.createIndex({ uid: 1 });

  await client.db("admin").command({ ping: 1 });
  console.log("Connected to MongoDB");

  // ----- Routes -----

  // Health
  app.get("/", (_req, res) => {
    res.send("syed-travels server is running");
  });

  // PUBLIC: list all spots
  app.get("/spots", async (_req, res) => {
    try {
      const cursor = spotCollection.find({}, { sort: { _id: -1 } });
      const result = await cursor.toArray();
      res.send(result);
    } catch (e) {
      console.error("GET /spots error:", e);
      res.status(500).send({ message: "Failed to fetch spots" });
    }
  });

  // PUBLIC: get a single spot
  app.get("/spots/:id", async (req, res) => {
    try {
      const _id = oid(req.params.id);
      if (!_id) return res.status(400).send({ message: "Invalid id" });

      const doc = await spotCollection.findOne({ _id });
      if (!doc) return res.status(404).send({ message: "Spot not found" });
      res.send(doc);
    } catch (e) {
      console.error("GET /spots/:id error:", e);
      res.status(500).send({ message: "Failed to fetch spot" });
    }
  });

  // PUBLIC: get a single country
  app.get("/countries/:country", async (req, res) => {
    try {
      const country = req.params.country.toLowerCase(); 
      const db = client.db("syed_travels_countries");
      const collection = db.collection(country);

      const docs = await collection.find().toArray();

      res.send(docs);
    } catch (err) {
      console.error("Error fetching country data:", err);
      res.status(500).send({ message: "Failed to fetch country data" });
    }
  });

  // PUBLIC: get single detail of place of single country
  app.get("/countries/:country/:id", async (req, res) => {
    try {
      const country = String(req.params.country || "").toLowerCase();
      const id = String(req.params.id || "");

      
      const db = client.db("syed_travels_countries");
      const col = db.collection(country);

      
      let _id;
      try {
        _id = new ObjectId(id);
      } catch {
        return res.status(400).send({ message: "Invalid id" });
      }

      const doc = await col.findOne({ _id });
      if (!doc) return res.status(404).send({ message: "Not found" });

      res.send(doc);
    } catch (err) {
      console.error("GET /countries/:country/:id error:", err);
      res.status(500).send({ message: "Failed to fetch item" });
    }
  });

  // PRIVATE: get my spots
  app.get("/myspots/:uid", verifyFirebaseToken, async (req, res) => {
    try {
      const uidFromUrl = req.params.uid;
      if (uidFromUrl !== req.user.uid) {
        return res.status(403).send({ message: "Forbidden" });
      }

      const cursor = spotCollection.find(
        { uid: req.user.uid },
        { sort: { _id: -1 } }
      );
      const result = await cursor.toArray();
      res.send(result);
    } catch (e) {
      console.error("GET /myspots error:", e);
      res.status(500).send({ message: "Failed to fetch user spots" });
    }
  });

  // PRIVATE: get my bookings
  app.get("/mybookings/:uid", verifyFirebaseToken, async (req, res) => {
    try {
      const uidFromUrl = req.params.uid;
      if (uidFromUrl !== req.user.uid) {
        return res.status(403).send({ message: "Forbidden" });
      }

      const cursor = bookingCollection.find(
        { uid: req.user.uid },
        { sort: { _id: -1 } }
      );
      const result = await cursor.toArray();
      res.send(result);
    } catch (e) {
      console.error("GET /myspots error:", e);
      res.status(500).send({ message: "Failed to fetch user spots" });
    }
  });

  // PRIVATE: create a spot — force uid from token
  app.post("/spots", verifyFirebaseToken, async (req, res) => {
    try {
      const payload = { ...(req.body || {}) };
      delete payload._id;

      payload.uid = req.user.uid;
      payload.createdAt = new Date().toISOString();
      payload.editedAt = payload.editedAt || payload.createdAt;

      const result = await spotCollection.insertOne(payload);

      const created = await spotCollection.findOne({ _id: result.insertedId });
      res.status(201).send(created);
    } catch (e) {
      console.error("POST /spots error:", e);
      res.status(500).send({ message: "Failed to create spot" });
    }
  });

// PRIVATE: create a booking — force uid from token
  app.post("/bookings", verifyFirebaseToken, async (req, res) => {
    try {
      const payload = { ...(req.body || {}) };
      delete payload._id;

      payload.uid = req.user.uid;
      payload.createdAt = new Date().toISOString();
      payload.editedAt = payload.editedAt || payload.createdAt;

      const result = await bookingCollection.insertOne(payload);

      const created = await bookingCollection.findOne({ _id: result.insertedId });
      res.status(201).send(created);
    } catch (e) {
      console.error("POST /booking error:", e);
      res.status(500).send({ message: "Failed to create booking" });
    }
  });

  // PRIVATE: update a spot — enforce ownership
  app.put("/spots/:id", verifyFirebaseToken, async (req, res) => {
    try {
      const _id = oid(req.params.id);
      if (!_id) return res.status(400).send({ message: "Invalid id" });

      const payload = { ...(req.body || {}) };
      delete payload._id;
      delete payload.uid;

      for (const k of Object.keys(payload)) {
        if (payload[k] === undefined) delete payload[k];
      }

      const existing = await spotCollection.findOne({ _id });
      if (!existing) return res.status(404).send({ message: "Spot not found" });

      if (existing.uid && existing.uid !== req.user.uid) {
        console.warn("PUT forbidden: uid mismatch", {
          docUid: existing.uid,
          callerUid: req.user.uid,
          _id: String(_id),
        });
        return res.status(403).send({ message: "You do not own this spot" });
      }

      const result = await spotCollection.updateOne(
        { _id },
        { $set: { ...payload, editedAt: new Date().toISOString() } }
      );

      if (result.matchedCount === 0) {
        return res.status(404).send({ message: "Spot not found" });
      }

      const updated = await spotCollection.findOne({ _id });
      res.send({
        success: true,
        message: "Spot updated successfully",
        data: updated,
      });
    } catch (e) {
      console.error("PUT /spots/:id error:", e);
      res.status(500).send({ message: "Failed to update spot" });
    }
  });

  // PRIVATE: delete a spot — enforce ownership
  app.delete("/spots/:id", verifyFirebaseToken, async (req, res) => {
    try {
      const _id = oid(req.params.id);
      if (!_id) return res.status(400).send({ message: "Invalid id" });

      const existing = await spotCollection.findOne({ _id });
      if (!existing) return res.status(404).send({ message: "Spot not found" });

      if (existing.uid && existing.uid !== req.user.uid) {
        console.warn("DELETE forbidden: uid mismatch", {
          docUid: existing.uid,
          callerUid: req.user.uid,
          _id: String(_id),
        });
        return res.status(403).send({ message: "You do not own this spot" });
      }

      const result = await spotCollection.deleteOne({ _id });
      if (result.deletedCount === 0) {
        return res.status(404).send({ message: "Spot not found" });
      }
      res.send({ success: true, message: "Spot deleted successfully" });
    } catch (e) {
      console.error("DELETE /spots/:id error:", e);
      res.status(500).send({ message: "Failed to delete spot" });
    }
  });

  // PRIVATE: delete a booking — enforce ownership
  app.delete("/bookings/:id", verifyFirebaseToken, async (req, res) => {
    try {
      const _id = oid(req.params.id);
      if (!_id) return res.status(400).send({ message: "Invalid id" });

      const existing = await bookingCollection.findOne({ _id });
      if (!existing) return res.status(404).send({ message: "Booking not found" });

      if (existing.uid && existing.uid !== req.user.uid) {
        console.warn("DELETE forbidden: uid mismatch", {
          docUid: existing.uid,
          callerUid: req.user.uid,
          _id: String(_id),
        });
        return res.status(403).send({ message: "You do not own this booking" });
      }

      const result = await bookingCollection.deleteOne({ _id });
      if (result.deletedCount === 0) {
        return res.status(404).send({ message: "Booking not found" });
      }
      res.send({ success: true, message: "Booking deleted successfully" });
    } catch (e) {
      console.error("DELETE /spots/:id error:", e);
      res.status(500).send({ message: "Failed to delete booking" });
    }
  });

  app.post("/users", async (req, res) => {
    try {
      const { uid, displayName, email, photoURL, provider, role } =
        req.body || {};
      if (!uid) return res.status(400).send({ message: "uid is required" });

      const now = new Date().toISOString();

      const update = {
        ...(displayName !== undefined && { displayName }),
        ...(email !== undefined && { email }),
        ...(photoURL !== undefined && { photoURL }),
        ...(provider !== undefined && { provider }),
        ...(role !== undefined && { role }),
        updatedAt: now,
      };

      const result = await userCollection.updateOne(
        { uid },
        { $set: update, $setOnInsert: { uid, createdAt: now } },
        { upsert: true }
      );

      res.send({
        ok: true,
        upserted: Boolean(result.upsertedId),
        matched: result.matchedCount,
        modified: result.modifiedCount,
      });
    } catch (e) {
      console.error("POST /users error:", e);
      res.status(500).send({ message: "Failed to save user" });
    }
  });

  // ----- Start server -----
  app.listen(port, () => {
    console.log(`syed-travels server running on port ${port}`);
  });
}

start().catch((e) => {
  console.error("Failed to start server:", e);
  process.exit(1);
});
