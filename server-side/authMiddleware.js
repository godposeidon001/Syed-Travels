const { admin } = require("./firebaseAdmin");

async function verifyFirebaseToken(req, res, next) {
  try {
    const auth = req.headers.authorization || "";
    const match = auth.match(/^Bearer (.+)$/i);
    if (!match) return res.status(401).send({ message: "Missing token" });

    const idToken = match[1];
    const decoded = await admin.auth().verifyIdToken(idToken);

    req.user = {
      uid: decoded.uid,
      email: decoded.email || null,
      decoded,
    };
    return next();
  } catch (e) {
    console.error("Auth error:", e?.message);
    return res.status(401).send({ message: "Invalid or expired token" });
  }
}

module.exports = { verifyFirebaseToken };
