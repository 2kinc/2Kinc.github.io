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


firebase.auth().sendSignInLinkToEmail(email, actionCodeSettings)
  .then(function() {
    // The link was successfully sent. Inform the user.
    alert('Success! A verification link was sent to your email.');
    // Save the email locally so you don't need to ask the user for it again
    // if they open the link on the same device.
    window.localStorage.setItem('emailForSignIn', email);
  })
  .catch(function(error) {
    // Some error occurred, you can inspect the code: error.code
  });
