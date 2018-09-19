var config = {
    apiKey: "AIzaSyBKle39fkAU9jZqegvTpuyA_WYl2a4FwpE",
    authDomain: "lyrics-translator-2f5c5.firebaseapp.com",
    databaseURL: "https://lyrics-translator-2f5c5.firebaseio.com",
    projectId: "lyrics-translator-2f5c5",
    storageBucket: "lyrics-translator-2f5c5.appspot.com",
    messagingSenderId: "367907701669"
};

var username;
var emailAddressl;
var uid;
firebase.initializeApp(config);
initApp = function () {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // User is signed in.
            username = user.displayName;
            emailAddress = user.email;
            uid = user.uid;
            user.getIdToken().then(function (accessToken) {
                //Setting the multilanguage for the login text

                $('#welcomeTextDrawer').html(content["zh"]["welcomeTextDrawerLogin"] + username)

                showMusicList(uid)
            });
            $('#login-btn').hide();
            $('#logout-btn').show()
        } else {
            $('#login-btn').show();
            $('#logout-btn').hide()
        }
    }, function (error) {
        console.log(error);
    });
};
window.addEventListener('load', function () {
    initApp()
});

function logOut() {
    firebase.auth().signOut().then(function () {
        console.log('Signed Out');
        location.reload();
    }, function (error) {
        console.error('Sign Out Error', error);
    });
}

function login() {
    var ui = new firebaseui.auth.AuthUI(firebase.auth());
    ui.start('#firebaseui-auth-container', {
        signInOptions: [
            firebase.auth.EmailAuthProvider.PROVIDER_ID
        ],
        signInFlow: 'popup',
        signInSuccessUrl: 'index.html'
    });
    ui.disableAutoSignIn();
}