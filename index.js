function Site() {
  this.elements = {
    postinput: $('#post-input'),
    posts: $('#posts-body'),
    submitpost: $('#submit-post-button'),
    signinwithgoogle: $('#sign-in-with-google'),
    userinfo: $('#user-info'),
    globalchatdisabled: $('#global-chat-disabled'),
    yourpropic: $('#your-pro-pic')
  };
  this.displayMessage = function (m) {
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
  this.updateUserInfo = function () {
    this.elements.userinfo.text('You are signed in as ' + auth.currentUser.displayName + '. ');
    this.user = auth.currentUser;
  }
  this.DropdownMenu = function (items, coordinate) {
    //items is an array like this:
    //[{name: 'OPTION NAME', handler: handler()}]
    //coordinate is an object with {x: ?, y: ?}, x and y are numbers
    //usually just use event.clientX and event.clientY
    this.el = document.createElement('div');
    this.el.classList.add('dropdown-menu');
    this.el.classList.add('mdc-card');
    this.el.style.display = 'none';
    var ul = document.createElement('ul');
    ul.classList.add('mdc-list');
    this.primed = false;
    var that = this;
    items.forEach(function (element) {
      var li = document.createElement('li');
      li.classList.add('mdc-list-item');
      var span = document.createElement('span');
      span.classList.add('mdc-list-item__text');
      span.innerText = element.name;
      li.appendChild(span);
      that.el.appendChild(li);
      function clickHandler() {
        if (that.primed)
          element.handler;
        that.primed = true;
      }
      li.addEventListener('click', function(){clickHandler()});
    });
    if (coordinate.x < 0) {
      this.el.style.right = Math.abs(coordinate.x) + 'px';
    } else {
      this.el.style.left = coordinate.x + 'px';
    }

    if (coordinate.y < 0) {
      this.el.style.bottom = Math.abs(coordinate.y) + 'px';
    } else {
      this.el.style.top = coordinate.y + 'px';
    }

    this.show = function () {
      this.el.style.display = 'block';
    };
    this.hide = function () {
      this.el.style.display = 'none';
    };
    this.delete = function () {
      if (this.el.parentNode != null)
        document.body.removeChild(this.el);
    }
    document.body.appendChild(this.el);
  };
  this.toggleProfileDropdownMenu = false;
  this.profileDropdownMenu;
  this.rightClickDropdownMenu;
  this.deleteRightClickDropdownMenu = function (e) {
    if (site.rightClickDropdownMenu != undefined) {
      if (e.target != site.rightClickDropdownMenu.el)
        site.rightClickDropdownMenu.delete();
      console.log(e);
    }
  };
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
site.elements.submitpost.click(function () {
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

site.elements.postinput.keyup(function (e) {
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
databaseref.on('child_added', function (snapshot) {
  var chat = snapshot.val();
  site.displayMessage(chat);
});

//sign in with google on button click
site.elements.signinwithgoogle.click(function () {
  auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());
});

//detect login state change (sign in or sign out) and update username
auth.onAuthStateChanged(function (user) {
  if (user) {
    //user has logged in
    site.updateUserInfo();
    site.elements.globalchatdisabled.hide();
    site.elements.signinwithgoogle.hide();
    site.elements.yourpropic.show();
    site.elements.yourpropic.attr('src', site.user.photoURL);
  } else {
    //user has logged out
    site.elements.userinfo.text("You are not signed in to 2K inc. Sign in to save your games and join the party in the Global Chat!");
    site.elements.globalchatdisabled.show();
    site.elements.signinwithgoogle.show();
    site.elements.yourpropic.hide();
  }
});

site.elements.yourpropic.click(function () {
  if (site.toggleProfileDropdownMenu) {
    site.profileDropdownMenu.delete();
    site.toggleProfileDropdownMenu = false;
  } else {
    site.profileDropdownMenu = new site.DropdownMenu(
      [{
        name: 'Username: ' + site.user.displayName,
        handler: function () { }
      },
      {
        name: 'Email: ' + site.user.email,
        handler: function () { }
      }
      ], {
        x: -10,
        y: site.elements.yourpropic.position().top + 55
      });
    site.profileDropdownMenu.el.id = 'profile-dropdown-menu';
    site.profileDropdownMenu.show();
    site.toggleProfileDropdownMenu = true;
  }
});

document.addEventListener('click', site.deleteRightClickDropdownMenu, false);

document.oncontextmenu = function (e) {
  e.preventDefault();
  if (site.rightClickDropdownMenu != undefined) {
    if (site.rightClickDropdownMenu.el.parentNode != null)
      site.rightClickDropdownMenu.delete();
  }
  site.rightClickDropdownMenu = new site.DropdownMenu(
    [{
      name: 'Copy',
      handler: document.execCommand('copy')
    },
    /*{
      name: 'Reload',
      handler: location.reload()
    },*/
    {
      name: 'Go to Global Chat',
      handler: $('post-stuff-button').trigger('click')
    }
    ], {
      x: e.clientX + 5,
      y: e.clientY + 5
    });
  site.rightClickDropdownMenu.show();
  return false;
};
$(document.body).not(".dropdown-menu").click(function () {
  $('.dropdown-menu').not('#profile-dropdown-menu').hide();
});