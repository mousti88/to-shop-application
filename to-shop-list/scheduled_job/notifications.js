const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const admin = require("firebase-admin");

const app = express();
app.use(cors());
app.use(bodyParser.json());
const PORT = process.env.PORT || 3001;

const serviceAccount = require("../certificates/to-shop-application-db-firebase-adminsdk-alsun-f04c924f48.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "to-shop-application-db",
});
const appInfo = admin.app().options;
console.log("Admin SDK connected to project:", appInfo.projectId);
let tokens = [];

// Save FCM token
app.post("/api/save-token", (req, res) => {
  const { token } = req.body;
  if (token && !tokens.includes(token)) {
    tokens.push(token);
    console.log("✅ Saved token:", token);
  }
  res.send("Token saved");
});

// Send notification
app.post("/api/send-notification", async (req, res) => {
  const { title, body } = req.body;

  if (!tokens.length) {
    return res.status(400).send("No tokens saved");
  }

  const message = {
    tokens,
    notification: { title, body },
  };

  try {
    const response = await admin.messaging().sendEachForMulticast(message);
    //const response = await admin.messaging().sendMulticast(message);
    console.log(`✅ Sent notifications: ${response.successCount}/${tokens.length}`);
    res.send("Notification sent");
  } catch (err) {
    console.error("❌ Error sending notification:", err);
    res.status(500).send("Failed to send notification");
  }
});

app.get("/", (req, res) => res.send("Notifications service running"));
app.listen(PORT, () => console.log(`Notifications server on port ${PORT}`));
