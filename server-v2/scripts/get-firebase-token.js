/**
 * Firebase Token Generator for Testing
 * 
 * This script helps you generate Firebase custom tokens for testing the EverCut API.
 * 
 * Prerequisites:
 * 1. Node.js installed
 * 2. firebase-admin package: npm install firebase-admin
 * 3. firebase-admin-sdk.json file in the root directory
 * 
 * Usage:
 * node scripts/get-firebase-token.js
 */

import admin from 'firebase-admin';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { createRequire } from 'module';

// Get __dirname in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Create require for JSON import
const require = createRequire(import.meta.url);

// Configuration
const SERVICE_ACCOUNT_PATH = path.join(__dirname, '..', 'firebase-admin-sdk.json');

// Check if service account file exists
if (!fs.existsSync(SERVICE_ACCOUNT_PATH)) {
  console.error('❌ Error: firebase-admin-sdk.json not found!');
  console.error('📁 Expected location:', SERVICE_ACCOUNT_PATH);
  console.error('\n📝 To fix this:');
  console.error('1. Go to Firebase Console → Project Settings → Service Accounts');
  console.error('2. Click "Generate New Private Key"');
  console.error('3. Save the file as "firebase-admin-sdk.json" in the project root');
  process.exit(1);
}

// Initialize Firebase Admin
try {
  const serviceAccount = require(SERVICE_ACCOUNT_PATH);
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });
  
  console.log('✅ Firebase Admin SDK initialized successfully\n');
} catch (error) {
  console.error('❌ Error initializing Firebase Admin SDK:', error.message);
  process.exit(1);
}

/**
 * Generate a custom token for testing
 */
async function generateCustomToken(uid, claims = {}) {
  try {
    const customToken = await admin.auth().createCustomToken(uid, claims);
    return customToken;
  } catch (error) {
    console.error('❌ Error creating custom token:', error.message);
    throw error;
  }
}

/**
 * Main function
 */
async function main() {
  console.log('🔐 Firebase Token Generator for EverCut API\n');
  console.log('═'.repeat(60));
  
  // Test User 1: Customer
  console.log('\n👤 Generating token for TEST CUSTOMER...');
  const customerToken = await generateCustomToken('test-customer-001', {
    phoneNumber: '+1234567890',
    role: 'CUSTOMER',
    email: 'test.customer@example.com'
  });
  
  console.log('✅ Custom Token (Customer):', customerToken);
  console.log('\n📋 To get ID Token:');
  console.log('   1. Open browser console on your web app');
  console.log('   2. Run: firebase.auth().signInWithCustomToken("' + customerToken.substring(0, 20) + '...")');
  console.log('   3. Then: firebase.auth().currentUser.getIdToken().then(console.log)');
  
  // Test User 2: Barber
  console.log('\n' + '─'.repeat(60));
  console.log('\n💈 Generating token for TEST BARBER...');
  const barberToken = await generateCustomToken('test-barber-001', {
    phoneNumber: '+1234567891',
    role: 'BARBER',
    email: 'test.barber@example.com'
  });
  
  console.log('✅ Custom Token (Barber):', barberToken);
  console.log('\n📋 To get ID Token:');
  console.log('   1. Open browser console on your web app');
  console.log('   2. Run: firebase.auth().signInWithCustomToken("' + barberToken.substring(0, 20) + '...")');
  console.log('   3. Then: firebase.auth().currentUser.getIdToken().then(console.log)');
  
  // Instructions
  console.log('\n' + '═'.repeat(60));
  console.log('\n📝 NEXT STEPS:\n');
  console.log('1. Copy one of the custom tokens above');
  console.log('2. Exchange it for an ID token using your web app');
  console.log('3. Copy the ID token');
  console.log('4. In Postman:');
  console.log('   - Open any EverCut collection');
  console.log('   - Go to Variables tab');
  console.log('   - Set firebase_token = YOUR_ID_TOKEN');
  console.log('   - Click Save');
  console.log('5. Start testing!\n');
  
  console.log('⏰ Note: ID tokens expire after 1 hour. Regenerate as needed.\n');
  console.log('═'.repeat(60));
  
  // Save tokens to file for reference
  const tokensFile = path.join(__dirname, 'test-tokens.txt');
  const tokensContent = `
EverCut API - Test Tokens
Generated: ${new Date().toISOString()}

CUSTOMER Custom Token:
${customerToken}

BARBER Custom Token:
${barberToken}

Instructions:
1. Exchange custom token for ID token in your web app
2. Use ID token in Postman (firebase_token variable)
3. Tokens expire after 1 hour

DO NOT COMMIT THIS FILE TO GIT!
`;
  
  fs.writeFileSync(tokensFile, tokensContent);
  console.log('\n💾 Tokens saved to:', tokensFile);
  console.log('⚠️  Remember to add test-tokens.txt to .gitignore!\n');
}

// Run the script
main()
  .then(() => {
    console.log('✅ Done!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  });
