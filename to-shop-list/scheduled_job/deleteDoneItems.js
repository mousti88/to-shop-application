const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const { readFileSync } = require('fs');
const { join } = require('path');

// Read service account key from environment variable
const serviceAccountPath = process.env.GOOGLE_APPLICATION_CREDENTIALS || '/etc/secrets/serviceAccountKey.json';
const serviceAccount = JSON.parse(readFileSync(serviceAccountPath, 'utf8'));

// Initialize Firebase with the service account credentials
initializeApp({
  credential: applicationDefault(),
  credential: serviceAccount
});

const db = getFirestore();

async function deleteDoneItems() {
  try {
    const shoppingListRef = db.collection('shoppinglist');
    const doneItemsQuery = shoppingListRef.where('status', '==', true);
    const doneItemsSnapshot = await doneItemsQuery.get();

    if (doneItemsSnapshot.empty) {
      console.log('No done items to delete');
      return;
    }

    const batch = db.batch();

    doneItemsSnapshot.forEach((doc) => {
      batch.delete(doc.ref);
    });

    await batch.commit();
    console.log('Done items successfully deleted');
  } catch (error) {
    console.error('Error deleting done items:', error);
  }
}

// Execute the function
deleteDoneItems();
