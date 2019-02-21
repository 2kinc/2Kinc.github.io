function Site() {
  this.elements = {
    postinput: document.querySelector('#post-input'),
    posts: document.querySelector('#post-body'),
    submitpost: document.querySelector('#submit-post-button')
  };
  this.displayMessage = function(m) {
    this.elements.posts.innerHTML = m.user + ' said: ' + m.message + 'at ' + m.time + '<br>' + this.elements.posts.innerHTML;
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
  var d = new Date();
  var chat = {
    message: site.elements.postinput.value, 
    name: 'Anonymous Dood', 
    time: d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
  };
  databaseref.push().set(chat);
  site.elements.postinput.value = '';
});

databaseref.on('child_added', function(snapshot){
  var chat = snapshot.val();
  site.displayMessage(chat);
});
