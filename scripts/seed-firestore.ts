import * as admin from 'firebase-admin';
import { products } from '../lib/data/products';

// Initialize Firebase Admin SDK
function initializeFirebase() {
  // Support both FIREBASE_SERVICE_ACCOUNT_PATH and GOOGLE_APPLICATION_CREDENTIALS
  const serviceAccountPath =
    process.env.FIREBASE_SERVICE_ACCOUNT_PATH ||
    process.env.GOOGLE_APPLICATION_CREDENTIALS;

  if (!serviceAccountPath) {
    throw new Error(
      'Please set FIREBASE_SERVICE_ACCOUNT_PATH or GOOGLE_APPLICATION_CREDENTIALS'
    );
  }

  // Load service account
  const serviceAccount = require(serviceAccountPath);

  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });

  return admin.firestore();
}

async function seedFirestore() {
  console.log('[Seed] Starting Firestore seeding...');
  console.log(`[Seed] Found ${products.length} products to seed`);

  const db = initializeFirebase();
  const collection = db.collection('products');

  try {
    // Get existing product count
    const snapshot = await collection.get();
    console.log(`[Seed] Existing products in Firestore: ${snapshot.size}`);

    // Batch write for efficiency (Firestore has 500 write limit per batch)
    const batchSize = 500;
    let successCount = 0;
    let errorCount = 0;

    for (let i = 0; i < products.length; i += batchSize) {
      const batch = db.batch();
      const chunk = products.slice(i, i + batchSize);

      chunk.forEach((product) => {
        const docRef = collection.doc(product.id);
        batch.set(docRef, {
          ...product,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
          updatedAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      });

      await batch.commit();
      successCount += chunk.length;
      console.log(
        `[Seed] Uploaded batch: ${Math.min(i + batchSize, products.length)}/${products.length}`
      );
    }

    console.log(`[Seed] Successfully seeded ${successCount} products`);
    console.log('[Seed] Firestore seeding complete!');

    // Verify upload
    const finalSnapshot = await collection.get();
    console.log(`[Seed] Final product count in Firestore: ${finalSnapshot.size}`);

    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding Firestore:', error);
    process.exit(1);
  }
}

seedFirestore();
