function Site() {
    this.elements = {
        postinput: $('#post-input'),
        posts: $('#posts-body'),
        submitpost: $('#submit-post-button'),
        signinwithgoogle: $('#sign-in-with-google'),
        userinfo: $('#user-info'),
        globalchatdisabled: $('#global-chat-disabled'),
        yourpropic: $('#your-pro-pic'),
        bigbanner: $('#big-banner'),
        editprofiledialog: new mdc.dialog.MDCDialog(document.querySelector('#edit-profile-dialog')),
        totleaderboard: $('#tot-leaderboard')
    };
    this.displayMessage = function (m) {
        var p = document.createElement('p');
        p.innerText = m.message;
        p.className = 'message-body enlargable';
        var messageinfo = document.createElement('p');
        messageinfo.innerText = m.name + ' at ' + m.time;
        messageinfo.className = 'message-info';
        var image = document.createElement('img');
        image.src = m.profilePicture;
        image.className = 'profile-picture enlargable';
        image.height = 30;
        var wrapper = document.createElement('div');
        wrapper.className = 'message';
        wrapper.appendChild(image);
        wrapper.appendChild(p);
        wrapper.appendChild(messageinfo);
        wrapper.style.padding = '0.1em 0';
        document.querySelector('#posts-body').insertBefore(wrapper, document.querySelector('#posts-body').firstChild);
        document.querySelector('#posts-body').scrollTop = 0;
    }
    this.user;
    this.updateUserInfo = function () {
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
        this.elements.yourpropic.attr('src', auth.currentUser.photoURL);
        this.elements.yourpropic.show();
        this.elements.signinwithgoogle.hide();
        this.user = auth.currentUser;
    };
    this.DropdownMenu = function (title, items, coordinate) {
        //items is an array like this:
        //[{name: 'OPTION NAME', handler: handler()}]
        //coordinate is an object with {x: ?, y: ?}, x and y are numbers
        //usually just use event.clientX and event.clientY
        this.el = document.createElement('div');
        this.el.className = 'dropdown-menu mdc-card';
        this.el.style.display = 'none';
        var ul = document.createElement('ul');
        ul.className = 'mdc-list';
        var titleEl = document.createElement('div');
        titleEl.className = 'dropdown-menu-title';
        titleEl.innerText = title;
        this.el.appendChild(titleEl);
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
                if (that.primed == true) {
                    element.handler();
                } else {
                    that.primed = true;
                }
            }

            li.onclick = clickHandler;
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
            this.primed = false;
        }

        document.body.appendChild(this.el);
    };

    this.toggleProfileDropdownMenu = false;

    this.profileDropdownMenu;

    this.rightClickDropdownMenu;

    this.elements.bigbanner.typedjsOptions = {
        strings: ['2K inc.', 'games++', 'levels++', 'xp++', 'skills++', 'We are awesome.', 'We are ^600 2K inc.'],
        typeSpeed: 45,
        smartDelay: 100,
        backSpeed: 25,
        backDelay: 600
    }

    this.elements.bigbanner.typed = new Typed('#big-banner', this.elements.bigbanner.typedjsOptions);
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
var chatdatabaseref = database.ref().child('chat');
var totdatabaseref = database.ref().child('tot');
setInterval(function () {
    site.elements.totleaderboard.html(''); totdatabaseref.orderByChild('candy').on('child_added', function (snapshot) {
        var d = snapshot.val();
        var e = document.createElement('li');
        site.elements.totleaderboard.prepend(e);
        e.outerHTML = `<li class="mdc-list-item"><span class="mdc-list-item__text" style="width:25%">` + d.name + `</span>
                  <span class="mdc-list-item__text" style="width:25%">`+ d.candy + `</span>
                  <span class="mdc-list-item__text" style="width:25%">`+ d.pumpkins + `</span>
                  <span class="mdc-list-item__text" style="width:25%">`+ d.cps + `</span></li>`;
    })
}, 1000);
//render player high scores on tot
totdatabaseref.orderByChild('candy').on('child_added', function (snapshot) {
    var d = snapshot.val();
    var e = document.createElement('li');
    e.innerHTML = `<span class="mdc-list-item__text" style="width:25%">` + d.name + `</span>
                  <span class="mdc-list-item__text" style="width:25%">`+ d.candy + `</span>
                  <span class="mdc-list-item__text" style="width:25%">`+ d.pumpkins + `</span>
                  <span class="mdc-list-item__text" style="width:25%">`+ d.cps + `</span>`;
    e.classList.add('mdc-list-item');
    site.elements.totleaderboard.prepend(e);
})
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
        chatdatabaseref.push().set(chat);
        site.elements.postinput.val('');
        site.elements.postinput.trigger('submit');
    } else if (site.user == undefined) {
        alert('Sign in to 2K inc. to chat!');
    }
});

site.elements.postinput.keyup(function (e) {
    if (e.key == 'Enter' && site.elements.postinput.val() != '' && site.user != undefined) {
        var d = new Date();
        var chat = {
            message: site.elements.postinput.val(),
            profilePicture: site.user.photoURL,
            name: site.user.displayName,
            time: d.getHours() + ':' + d.getMinutes() + ':' + d.getSeconds()
        };
        chatdatabaseref.push().set(chat);
        site.elements.postinput.val('');
        site.elements.postinput.trigger('submit');
    } else if (site.user == undefined) {
        alert('Sign in to 2K inc. to chat!');
    }
});

//update chat elements on database update
chatdatabaseref.on('child_added', function (snapshot) {
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
    } else {
        //user has logged out
        site.elements.userinfo.text("You are not signed in to 2K inc. Sign in to save your games and join the party in the Global Chat!");
        site.elements.globalchatdisabled.show();
    }
});

site.elements.yourpropic.click(function () {
    if (site.toggleProfileDropdownMenu) {
        site.profileDropdownMenu.hide();
        site.toggleProfileDropdownMenu = false;
    } else {
        if (site.profileDropdownMenu == undefined) {
            site.profileDropdownMenu = new site.DropdownMenu(
                'Profile',
                [{
                    name: 'Username: ' + site.user.displayName,
                    handler: function () { }
                },
                {
                    name: 'Email: ' + site.user.email,
                    handler: function () { }
                },
                {
                    name: 'Edit',
                    handler: function () { }
                }
                ], {
                    x: -10,
                    y: site.elements.yourpropic.position().top + 55
                });
            site.profileDropdownMenu.el.lastChild.addEventListener('click', function () {
                site.elements.editprofiledialog.open();
                site.profileDropdownMenu.hide();
                site.toggleProfileDropdownMenu = false;
            });
            site.profileDropdownMenu.el.id = 'profile-dropdown-menu';
        }
        site.profileDropdownMenu.show();
        site.toggleProfileDropdownMenu = true;
    }
});

document.oncontextmenu = function (e) {
    e.preventDefault();
    if (site.rightClickDropdownMenu != undefined) {
        if (site.rightClickDropdownMenu.el.parentNode != null)
            site.rightClickDropdownMenu.delete();
    }
    site.rightClickDropdownMenu = new site.DropdownMenu(
        'Action Menu',
        [{
            name: 'Copy',
            handler: document.execCommand('copy')
        },
            /*{
              name: 'Reload',
              handler: location.reload()
            },*/
            /*{
              name: 'Go to Global Chat',
              handler: $('#post-stuff-button').trigger('click')
            }*/
        ], {
            x: e.clientX + 5,
            y: e.clientY + 5
        });
    site.rightClickDropdownMenu.show();
    return false;
};

$(document.body).not(".dropdown-menu").click(function (e) {
    if (site.rightClickDropdownMenu != undefined)
        site.rightClickDropdownMenu.delete();
});

$('#edit-profile-dialog-submit-button').click(function () {
    $('#edit-profile-dialog-username-input').trigger('submit');
})

$('#edit-profile-dialog-username-input').submit(function () {
    if ($('#edit-profile-dialog-username-input').val() != '') {
        auth.currentUser.updateProfile({
            displayName: $('#edit-profile-dialog-username-input').val()
        }).then(function () {
            console.log('success');
            site.updateUserInfo();
        }).catch(function (error) {
            console.log('bad');
        });;
        $('#edit-profile-dialog-username-input').val('');
        site.elements.editprofiledialog.close();
    }
})
