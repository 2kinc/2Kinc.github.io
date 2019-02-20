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


// Confirm the link is a sign-in with email link.
if (firebase.auth().isSignInWithEmailLink(window.location.href)) {
  // Additional state parameters can also be passed via URL.
  // This can be used to continue the user's intended action before triggering
  // the sign-in operation.
  // Get the email if available. This should be available if the user completes
  // the flow on the same device where they started it.
  var email = window.localStorage.getItem('emailForSignIn');
  if (!email) {
    // User opened the link on a different device. To prevent session fixation
    // attacks, ask the user to provide the associated email again. For example:
    email = window.prompt('Please provide your email for confirmation');
  }
  // The client SDK will parse the code from the link for you.
  firebase.auth().signInWithEmailLink(email, window.location.href)
    .then(function(result) {
      // Clear email from storage.
      window.localStorage.removeItem('emailForSignIn');
      // You can access the new user via result.user
      // Additional user info profile not available via:
      // result.additionalUserInfo.profile == null
      // You can check if the user is new or existing:
      // result.additionalUserInfo.isNewUser
    })
    .catch(function(error) {
      // Some error occurred, you can inspect the code: error.code
      // Common errors could be invalid email and invalid or expired OTPs.
    });
}

// After asking the user for their email.
site.elements.signup.addEventListener('click', function(){
  var email = window.prompt('Please provide your email');
  firebase.auth().fetchSignInMethodsForEmail(email)
    .then(function(signInMethods) {
      // This returns the same array as fetchProvidersForEmail but for email
      // provider identified by 'password' string, signInMethods would contain 2
      // different strings:
      // 'emailLink' if the user previously signed in with an email/link
      // 'password' if the user has a password.
      // A user could have both.
      if (signInMethods.indexOf(
              firebase.auth.EmailAuthProvider.EMAIL_PASSWORD_SIGN_IN_METHOD) != -1) {
        // User can sign in with email/password.
      }
       if (signInMethods.indexOf(
               firebase.auth.EmailAuthProvider.EMAIL_LINK_SIGN_IN_METHOD) != -1) {
         // User can sign in with email/link.
      }
    })
    .catch(function(error) {
      // Some error occurred, you can inspect the code: error.code
    });
})

firebase.auth().signOut().then(function() {
  // Sign-out successful.
}).catch(function(error) {
  // An error happened.
});
