const express = require('express');
const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
//const serviceAccount = require('./serviceAccountKey.json');

// Initialize express app
const app = express();
const PORT = process.env.PORT || 3000;

// Access credentials from environment variables
const serviceAccount = {
  project_id: process.env.project_id,
  private_key: process.env.private_key.replace(/\\n/g, '\n'),  // Replace escaped newlines
  client_email: process.env.client_email,

  // project_id: "to-shop-application-db",
  // private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCt45106GAqIgC+\nBQaILKQfMc9NzGRffhFpCgn2ie5hdPjtjDVsOmnXgLYZR2vjBRj/441flTkcrqWM\n6cNdkeic32Z66SSbcA1/cxIBLRACa4/4kjtqcDbjJZQXKBIJt4pq/Kzqxb7KA1ZJ\nUDJkhooEN9JVNg9TAEV8+OYhcJWNQtE3q9lwRAXxTNCBcRfKlvKYOUQYj1GtXfOP\nYNmUCnTiZ1bRDsX60B7pwM0WmVzdrUsOY6MpTC8XZQ3GPgu9IyETIYSDKAII7mfT\nGoQ94AFhtKmFqNRFYpkP5DgoTVgoCd4jT7qLtjGK+nFwN0Bsq7JvY6RRJ6uOpxLm\nkbFPW2lZAgMBAAECggEAQFeq2alqe+ydDbLaWeT6zbgmlwj8UwFY+98FFL6xAErC\nGVP6KJPsuhscRnpRB23JdFYE58tVmLFe/Kc67RKiWfmn9+7w5rsto202ykycUejv\nGvExHw9qn941z+O52PKbOz9H1I9bK3DUqsgL/Xpy82CcaX9ZaEL/c2C99r2r+NqV\n11E4Y2n90bl+ST9bRL6ZPaegsQhEJADOgjRkMsicEcPe67ccLMPltT3GHMtQpGHG\nJWNZSnqsg942c1tw4mm1Qi3RwcVxcR0mL45bmuz0vEHKrDHbwaDqa8bC7B3jxxZd\n4cIC7UrWJp5kXEcYx5PPzAuz/M2BhWfX7xeFDLz1yQKBgQDlJi/fQAhiX425EIj4\nLjCTTlLHBvzSXrtOtq1GxJnEetbyJ8ekY7gQbayc1WrSMEYiVrDYU/E5BGMJrmqZ\nySxTtAStWVbwaVlYWMqtw2tYwdeGyeO+THx5NdP1z1B3zMuXoyRpvtoG8aDfctdh\nO6Eakza6hKEQtp2NeZ3UyxdjLwKBgQDCQ8lMNRBdU/nUNUlIKzD0mZgiEBr2QdoK\nQ7yl4mmg0aNuJUFjt/zmVgm5Gw6aY5CkLS2/5gOgLeCnSHjt7rNZL4hkkGpGp4PB\nPsQudyf1EDPhfkLLqJOSDAFd6ZW9EMu+/lgRnXvqkV0AXRDwVBrAZjhbPGPT4fea\nVs913E759wKBgAfrZvInS2Li/Int2V4CcqlUpqW8RxaaMY0J4Tk16D6TJESgPVUg\nISdoMvQEqDl1c6cSKfCADjEzRpz6CzMfccm+yf6XvNp4OZ9FClQxEc+ye1lsNtPH\n3vFte9LeBGDvkgW+nK6O6wgcZ7vxQyJYJjw95EFT/iEOvqk6D8tf7YH/AoGAQ0vW\nPPcY7yu7HP9EnqKPt/xJTmuD25EeZnXmsRSJAPP+iJaRW2kOTAC8J4qu+V7KaYVZ\nFuQol2GtNGYPtmT9bkTgG+5HUqiPJO+IaIxQpD1zq4bgvspsLKjKBG15uOBLpKNZ\ngOisV6r5q7mRt597EPGYTkrSTkE2VBoEjlC+bysCgYBSaVu4bI44tdM8Wexdir4K\nlvtXRZUOLsYHtnMmZoOlBrzb8FfFfwHNaC066YXgK/dKBvLFBPK3AiNEFw3AAZtC\nEoj2lZB8S1Vt7Uzro2Bz8qhAfl75OIGSMiOaCOsDycTGEw19p2jmQ1GAodpNUG4j\nB52VTSgveZI1BqG1jN9BGg==\n-----END PRIVATE KEY-----\n",  // Replace escaped newlines
  // client_email: "firebase-adminsdk-alsun@to-shop-application-db.iam.gserviceaccount.com",
  
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

// Run deleteDoneItems at start
//deleteDoneItems();

// Route to handle deletion of done items
app.get('/deleteDoneItems', async (req, res) => {
  try {
    await deleteDoneItems();
    //res.send('Done items deleted successfully.');
    res.send('Ok');
  } catch (error) {
    res.status(500).send('Error deleting done items.');
  }
});

// Start express app on the specified port to keep the service alive
app.get('/', (req, res) => res.send('Delete Done Items service is running.'));
app.listen(PORT, () => console.log(`Server is listening on port ${PORT}`));
