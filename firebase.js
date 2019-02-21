function Site() {
  this.elements = {
    postinput: document.querySelector('#post-input'),
    posts: document.querySelector('#post-body'),
    submitpost: document.querySelector('#submit-post-button')
  };
  this.displayMessage = function(message) {
    this.elements.posts.innerHTML = message + this.elements.posts.innerHTML;
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

var app = firebase.initializeApp(config);
var database = app.database();
var auth = app.auth();
var storage = app.storage();
var databaseref = database.ref().child('chat');

site.elements.submitpost.addEventListener('click', function () {
  var chat = {message: site.elements.postinput.value, name: 'Anonymous Dood'};
  databaseref.push().set(chat);
  site.elements.postinput.value = '';
});

databaseref.on('child_added', function(snapshot){
  var chat = snapshot.val();
  site.displayMessage(chat);
});
