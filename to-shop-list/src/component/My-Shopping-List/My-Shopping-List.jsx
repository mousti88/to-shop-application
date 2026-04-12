// import React, { useEffect, useState,Component } from "react";
// import { Card, Header, Form, Input, Icon } from "semantic-ui-react";
// import db from "./firebase"; // Import Firestore instance
// import "./my-shopping-list.css";
// import { getDatabase, ref, onValue } from "firebase/database";
import React, { Component } from "react";
import { Card, Header, Form, Input, Icon } from "semantic-ui-react"; //, Button
import { db,app } from "./firebase"; // Import the configured Firestore instance
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, query, where, writeBatch } from "firebase/firestore";
import "./my-shopping-list.css";
import { getMessaging, getToken, onMessage } from "firebase/messaging";
// import { app } from "./firebase"; // make sure firebase exports initialized `app`

class MyShoppingList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      item: "",
      shoppinglist: [],
      loading: true,
      error: null
    };
  }

  componentDidMount = () => {
    this.getShopList();
    this.scheduleDeleteDoneItems();

    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register(`${process.env.PUBLIC_URL}/firebase-messaging-sw.js`)
        .then((registration) => console.log("Service Worker registered:", registration))
        .catch((error) => console.error("SW registration failed:", error));
    }
    
    // Don’t call automatically — wait for user to click the button
    this.initNotifications();
  };

  scheduleDeleteDoneItems = () => {
  const now = new Date();
  const msUntilMidnight = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1).getTime() - now.getTime();
      //Set target time to 12:27 PM
  const targetTime = new Date();
  targetTime.setHours(13, 55, 0, 0); // 12:22:00 PM
  
  //If the target time has already passed today, schedule it for tomorrow
  if (now.getTime() > targetTime.getTime()) {
    targetTime.setDate(targetTime.getDate() + 1); // Schedule for the next day
  }

  const msUntilTarget = targetTime.getTime() - now.getTime();
  console.log(`Milliseconds until 12:22: ${msUntilTarget}`);

  // <Button onClick={this.deleteDoneItems} color="red" style={{ marginTop: "20px" }}>
  //         Delete All Done Items
  //       </Button>

  
    // Schedule the deletion to run at midnight
    setTimeout(() => {
      this.deleteDoneItems(); 
      // Schedule it to run again every 24 hours
      setInterval(this.deleteDoneItems, 24 * 60 * 60 * 1000);
    //}, msUntilMidnight);
    }, msUntilTarget);
  };

  initNotifications = async () => {
  try {
    // Feature detection
    if (!("serviceWorker" in navigator) || !("PushManager" in window)) {
      console.warn("🚫 This browser does not support Firebase Messaging.");
      return; // Exit early
    }

    const messaging = getMessaging(app);

    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const token = await getToken(messaging, {
        vapidKey: "BEWR2dOQqXu6bfIHJm9Bw32Z8ysLVSzGkNC5tWP0qe7wpGifbr7yULuQl4VvpQeLkSIiEHuV233iFuCLOwuTX6I", // replace with your VAPID key
        serviceWorkerRegistration: await navigator.serviceWorker.register(
          `${process.env.PUBLIC_URL}/firebase-messaging-sw.js`
        ),
        
      });

      if (token) {
        console.log("✅ Notification token:", token);
        // Optional: send token to backend
        // await fetch("/save-token", { method: "POST", body: JSON.stringify({ token }) });
        await fetch("http://localhost:3001/api/save-token", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
  });
      } else {
        console.warn("⚠️ No token received. Push notifications won't work.");
      }
    } else {
      console.log("❌ Notification permission denied");
      return;
    }

    // Listen for messages while app is open
    onMessage(messaging, (payload) => {
      console.log("📩 Message received:", payload);
      if (payload.notification) {
        alert(`${payload.notification.title}: ${payload.notification.body}`);
      }
    });

  } catch (err) {
    console.error("Error setting up notifications:", err);
  }
};


  // <<<< NEW: Function to delete all done items
  deleteDoneItems = async () => {
    try {
      const doneItemsQuery = query(collection(db, "shoppinglist"), where("status", "==", true));
      const querySnapshot = await getDocs(doneItemsQuery);

      
      if (querySnapshot.empty) {
        console.log('No done items to delete');
        return;
      }

      // Initialize a batch
      const batch = writeBatch(db);

      querySnapshot.forEach((doc) => {
        batch.delete(doc.ref);
      });

      await batch.commit();
      console.log('Done items successfully deleted');
      this.getShopList(); // Reload the shopping list after deletion
    } catch (error) {
      console.error('Error deleting done items:', error);
    }
  };

  onChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    });
  };

  // Helper function to normalize the item by removing emojis and converting to lowercase
  normalizeItem = (item) => {
    // Use regex to remove emojis (matches any Unicode emoji) and convert to lowercase
    return item.replace(/[\u{1F600}-\u{1F6FF}]/gu, "").trim().toLowerCase();
  };

  onSubmit = async () => {
    if (this.state.item) {
      try {
        const normalizedNewItem = this.normalizeItem(this.state.item);

        // Get all items from Firestore
        const shoppinglistRef = collection(db, "shoppinglist");
        const querySnapshot = await getDocs(shoppinglistRef);

        // Check if any of the existing items (normalized) match the new item
        let isDuplicate = false;
        querySnapshot.forEach((doc) => {
          const existingItem = doc.data().item;
          const normalizedExistingItem = this.normalizeItem(existingItem);

          if (normalizedExistingItem === normalizedNewItem) {
            isDuplicate = true;
          }
        });

        if (isDuplicate) {
          alert("This item is already on the list.");
          return;
        }

        // If the item is not a duplicate, add it
        const docRef = await addDoc(shoppinglistRef, {
          item: `😭 ${this.state.item}`, // Keep the emoji when storing
          status: false
        });
        console.log("Document written with ID: ", docRef.id);
        this.setState({ item: "" });
        this.getShopList();
        await fetch("http://localhost:3001/api/send-notification", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            title: "New Shopping Item",
            body: `Someone added: ${this.state.item}`,
          }),
        });
      } catch (error) {
        console.error("Error adding document: ", error);
      }
    }
  };


  getShopList = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "shoppinglist"));
      const shoppinglist = [];
      querySnapshot.forEach((doc) => {
        let item = doc.data();
      item.id = doc.id;

      // Default styles for incomplete items
      let color = "yellow";
      let cardBackground = { background: "white" };
      let shopComplete = { textDecoration: "none" };
      
      // Update styles if the item end with a "!"
      if (item.item.endsWith("!") && item.status !== true) {
        color = "purple";
        cardBackground.background = "#fca09a";
      }
      
      // Update styles if the item is marked as completed
      if (item.status) {
        color = "green";
        cardBackground.background = "beige";
        shopComplete["textDecoration"] = "line-through";
      }

      // Add styles to the item object
      shoppinglist.push({ ...item, color, cardBackground, shopComplete });
    });
      this.setState({ shoppinglist, loading: false });
    } catch (error) {
      console.error("Error getting documents: ", error);
      this.setState({ loading: false, error: "Failed to load shopping list" });
    }
  };

  updateItem = async (id) => {
    const docRef = doc(db, "shoppinglist", id);
    try {
      await updateDoc(docRef, { status: true });
      this.getShopList();
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  undoItem = async (id) => {
    const docRef = doc(db, "shoppinglist", id);
    try {
      await updateDoc(docRef, { status: false });
      this.getShopList();
    } catch (error) {
      console.error("Error updating document: ", error);
    }
  };

  deleteItem = async (id) => {
    const docRef = doc(db, "shoppinglist", id);
    try {
      await deleteDoc(docRef);
      this.getShopList();
    } catch (error) {
      console.error("Error deleting document: ", error);
    }
  };

  render() {
    const { shoppinglist, loading, error } = this.state;

    if (loading) {
      return <div>Loading...</div>;
    }

    if (error) {
      return <div>{error}</div>;
    }

    return (
      <div>
        <Header as="h1">
          <div className="app-header">📝 Ghaddar Household Shopping List</div>
        </Header>
        <Form onSubmit={this.onSubmit} className="form-class">
          <Input
            type="text"
            name="item"
            onChange={this.onChange}
            value={this.state.item}
            fluid
            placeholder="item..."
          />
        </Form>

        <Card.Group>
          {shoppinglist.map((item) => (
            <Card key={item.id} fluid color={item.color} style={item.cardBackground}>
              <Card.Content>
                <Card.Header style={item.shopComplete}>{item.item}</Card.Header>
                <Card.Meta textAlign="right">
                  <Icon
                    link
                    name="check circle"
                    color="green"
                    onClick={() => this.updateItem(item.id)}
                  />
                  <span style={{ paddingRight: 10 }}>Done</span>
                  <Icon
                    link
                    name="undo"
                    color="yellow"
                    onClick={() => this.undoItem(item.id)}
                  />
                  <span style={{ paddingRight: 10 }}>Undo</span>
                  <Icon
                    link
                    name="delete"
                    color="red"
                    onClick={() => this.deleteItem(item.id)}
                  />
                  <span style={{ paddingRight: 10 }}>Delete</span>
                </Card.Meta>
              </Card.Content>
            </Card>
          ))}
        </Card.Group>
        {/* <button
          onClick={this.initNotifications}
          style={{
            marginTop: "20px",
            padding: "10px 20px",
            backgroundColor: "#007bff",
            color: "white",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer"
          }}
        >
          🔔 Enable Notifications
        </button> */}

      </div>
    );
  }
}

export default MyShoppingList;
