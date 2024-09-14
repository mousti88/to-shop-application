const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Access credentials from environment variables
const serviceAccount = {
  project_id: process.env.project_id,
  private_key: process.env.private_key,//.replace(/\\n/g, '\n'),  // Replace escaped newlines
  client_email: process.env.client_email,
};

// Initialize Firebase with environment variables
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
