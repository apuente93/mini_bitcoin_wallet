# Mini Bitcoin Wallet

Mini Bitcoin Wallet is a web application that enables users to view Bitcoin transaction history and manage their favorite transactions. The application leverages React, Firebase for authentication, and Bootstrap for styling. The application is deployed to the cloud using AWS Amplify.

## Features

- **User Authentication:** Secure login via email link using Firebase authentication.
- **View Bitcoin Transaction History:** Retrieve and display the transaction history for a given Bitcoin address.
- **Manage Favorites:** Mark transactions as favorites for easy reference.
- **Responsive Design:** Ensures usability across different devices.
- **Cloud Deployment:** The application is deployed to AWS Amplify, providing scalability and ease of access.

## Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or later)
- npm or yarn
- Firebase project set up (optional, for authentication)
- AWS Amplify CLI (optional, for deployment)

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/apuente93/mini_bitcoin_wallet.git
cd mini_bitcoin_wallet
```
### 2. Install Dependencies

```bash
npm install
```
### 3. Run the Application

```bash
npm start
```

## Firebase Setup (NOT REQUIRED / OPTIONAL)

To enable Firebase authentication, follow these steps:

1. **Create a Firebase Project:**

   - Go to [Firebase Console](https://console.firebase.google.com/).
   - Click "Add project" and follow the prompts to create a new project.

2. **Register Your App with Firebase:**

   - In the Firebase Console, click on the project you created.
   - Click on the "Web" icon to add Firebase to your web app.
   - Register the app and copy the Firebase configuration object.

3. **Add Firebase SDK to Your Project:**

   - Create a `firebaseConfig.js` file in the `src` directory of your project.
   - Add the following content to `firebaseConfig.js`:

   ```javascript
   // src/firebaseConfig.js
   import { initializeApp } from 'firebase/app';
   import { getAuth } from 'firebase/auth';

   const firebaseConfig = {
     apiKey: "YOUR_API_KEY",
     authDomain: "YOUR_AUTH_DOMAIN",
     projectId: "YOUR_PROJECT_ID",
     storageBucket: "YOUR_STORAGE_BUCKET",
     messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
     appId: "YOUR_APP_ID"
   };

   const app = initializeApp(firebaseConfig);
   export const auth = getAuth(app);
   ```
## Deploy to AWS Amplify (NOT REQUIRED / OPTIONAL)
To deploy your application to AWS Amplify, follow these steps:

### 1. Install AWS Amplify CLI:

```bash
npm install -g @aws-amplify/cli
```
Follow the instructions in the terminal to set up your AWS profile.
### 2. Configure Amplify:

```bash
amplify configure
```
### 3. Initialize Amplify in Your Project:

```bash
amplify init
```
### 4. Deploy to Amplify:
```bash
amplify add hosting
amplify publish
```
Follow the prompts to set up and deploy your hosting environment. You have now set up Firebase for authentication and deployed your application to AWS Amplify.
