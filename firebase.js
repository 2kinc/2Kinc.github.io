function Site() {
  this.elements = {
    postinput: document.querySelector('#post-input'),
    posts: document.querySelector('#posts-body'),
    submitpost: document.querySelector('#submit-post-button'),
    signinwithgoogle: document.querySelector('#sign-in-with-google'),
    userinfo: document.querySelector('#user-info')
  };
  this.displayMessage = function(m) {
    var el = document.createElement('p');
    el.innerText = m.name + ' said: "' + m.message + '" at ' + m.time;
    this.elements.posts.insertBefore(el, this.elements.posts.firstChild);
  }
  this.user;
  this.updateUserInfo = function(u) {
    this.elements.userinfo.innerText = 'You are signed in as ' + u.displayName + '. ';
    this.user = u;
  }
}

var site = new Site();

// Initialize Firebase
var config = {
  apiKey: "AIzaSyADD6YWKrzibRMwJNi1FwUR0jcR0GitZPI",
  authDomain: "k-inc-232222.firebaseapp.com",
  databaseURL: "https://k-inc-232222.firebaseio.com",
  projectId: "k-inc-232222",
  storageBucket: "",
  messagingSenderId: "827804821456"
};

//firebase variables
var app = firebase.initializeApp(config);
var database = app.database();
var auth = app.auth();
var storage = app.storage();
var databaseref = database.ref().child('chat');

//submit post on button click and add to database
site.elements.submitpost.addEventListener('click', function () {
  if (site.elements.postinput.value != '') {
    var d = new Date();
    var chat = {
      message: site.elements.postinput.value, 
      name: site.user.displayName, 
      time: d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
    };
    databaseref.push().set(chat);
    site.elements.postinput.value = '';
    }
});

site.elements.postinput.addEventListener('keyup', function (e) {
  if (e.key == 'Enter' && site.elements.postinput.value != '') {
    var d = new Date();
    var chat = {
      message: site.elements.postinput.value, 
      name: site.user.displayName, 
      time: d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
    };
    databaseref.push().set(chat);
    site.elements.postinput.value = '';
  }
});

//update chat elements on database update
databaseref.on('child_added', function(snapshot){
  var chat = snapshot.val();
  site.displayMessage(chat);
});

//sign in with google on button click
site.elements.signinwithgoogle.addEventListener('click', function() {
  auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
});

//detect login state change (sign in or sign out) and update username
auth.onAuthStateChanged(function(user) {
  if (user) {
    //user has logged in
    site.updateUserInfo(user);
  } else {
    //user has logged out
    site.elements.userinfo.innerText = "You are not signed in to 2K inc.";
  }
});
