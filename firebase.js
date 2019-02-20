var site = {
  elements: {
    signup: document.querySelector('#signup')
  }
}

// Initialize Firebase
var config = {
  apiKey: "AIzaSyADD6YWKrzibRMwJNi1FwUR0jcR0GitZPI",
  authDomain: "k-inc-232222.firebaseapp.com",
  databaseURL: "https://k-inc-232222.firebaseio.com",
  projectId: "k-inc-232222",
  storageBucket: "",
  messagingSenderId: "827804821456"
};

var app = firebase.initializeApp(config);
var database = app.database();
var auth = app.auth();
var storage = app.storage();
var databaseref = database.ref().child('chat');

var actionCodeSettings = {
  // URL you want to redirect back to.
  // URL must be whitelisted in the Firebase Console.
  url: 'https://2kinc.github.io/callback',
  // This must be true.
  handleCodeInApp: true
};
