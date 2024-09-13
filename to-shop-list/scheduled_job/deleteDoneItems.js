const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const serviceAccount = require('./serviceAccountKey.json'); // Adjust path as needed

// Initialize Firebase with the service account key
initializeApp({
  credential: cert(serviceAccount),
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
