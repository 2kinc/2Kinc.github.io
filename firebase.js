// Initialize Firebase
var config = {
  apiKey: "AIzaSyDMuGYsD_rUZUBRDQeKvQiWW7jo7gOuW-k",
  authDomain: "exp-game.firebaseapp.com",
databaseURL: "https://exp-game.firebaseio.com",
projectId: "exp-game",
storageBucket: "exp-game.appspot.com",
messagingSenderId: "770010726831"
};
firebase.initializeApp(config);

var actionCodeSettings = {
  // URL you want to redirect back to. The domain (www.example.com) for this
  // URL must be whitelisted in the Firebase Console.
  url: 'https://2kinc.github.io/callback',
  // This must be true.
  handleCodeInApp: true
};
