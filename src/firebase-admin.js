import admin from 'firebase-admin';

try {
  admin.app();
} catch (error) {
  const serviceAccount = require("./firebase-service-account.json"); 
  
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}


export default admin;
