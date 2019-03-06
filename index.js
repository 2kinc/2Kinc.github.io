function Site() {
    this.elements = {
        postinput: $('#post-input'),
        posts: $('#posts-body'),
        submitpost: $('#submit-post-button'),
        signinwithgoogle: $('#sign-in-with-google'),
        userinfo: $('#user-info'),
        globalchatdisabled: $('#global-chat-disabled')
    };
    this.displayMessage = function(m) {
        var p = document.createElement('p');
        p.innerText = m.name + ' said: "' + m.message + '" at ' + m.time;
        var image = document.createElement('img');
        image.src = m.profilePicture;
        image.className = 'profile-picture';
        image.height = 30;
        var wrapper = document.createElement('p');
        wrapper.appendChild(image);
        wrapper.appendChild(p);
        wrapper.style.padding = '0.1em 0';
        document.querySelector('#posts-body').insertBefore(wrapper, document.querySelector('#posts-body').firstChild);
    }
    this.user;
    this.updateUserInfo = function() {
        var button = document.createElement('button');
        button.className = 'mdc-button mdc-ripple-upgraded mdc-button--unelevated';
        button.innerText = 'Log out of 2K inc';
        button.addEventListener('click', function () {
            auth.signOut();
            location.reload();
        });
        this.elements.userinfo.html('');
        this.elements.userinfo.text('You are signed in as ' + auth.currentUser.displayName + '. ');
        this.elements.userinfo.append(button);
        this.user = auth.currentUser;
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
site.elements.submitpost.click(function() {
    if (site.elements.postinput.val() != '' && site.user != undefined) {
        var d = new Date();
        var chat = {
            message: site.elements.postinput.val(),
            profilePicture: site.user.photoURL,
            name: site.user.displayName,
            time: d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
        };
        databaseref.push().set(chat);
        site.elements.postinput.val('');
        site.elements.postinput.trigger('submit');
    } else if (site.user == undefined) {
        alert('Sign in to 2K inc. to chat!');
    }
});

site.elements.postinput.keyup(function(e) {
    if (e.key == 'Enter' && site.elements.postinput.value != '' && site.user != undefined) {
        var d = new Date();
        var chat = {
            message: site.elements.postinput.val(),
            profilePicture: site.user.photoURL,
            name: site.user.displayName,
            time: d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
        };
        databaseref.push().set(chat);
        site.elements.postinput.val('');
        site.elements.postinput.trigger('submit');
    } else if (site.user == undefined) {
        alert('Sign in to 2K inc. to chat!');
    }
});

//update chat elements on database update
databaseref.on('child_added', function(snapshot) {
    var chat = snapshot.val();
    site.displayMessage(chat);
});

//sign in with google on button click
site.elements.signinwithgoogle.click(function() {
    auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
});

//detect login state change (sign in or sign out) and update username
auth.onAuthStateChanged(function(user) {
    if (user) {
        //user has logged in
        site.updateUserInfo();
        site.elements.globalchatdisabled.hide();
    } else {
        //user has logged out
        site.elements.userinfo.text("You are not signed in to 2K inc. Sign in to save your games and join the party in the Global Chat!");
        site.elements.globalchatdisabled.show();
    }
});
