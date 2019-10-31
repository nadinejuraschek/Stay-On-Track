// Initialize the FirebaseUI
var ui = new firebaseui.auth.AuthUI(firebase.auth());

ui.start('#firebaseui-auth-container', {
    signInOptions: [
        firebase.auth.GithubAuthProvider.PROVIDER_ID
    ],
});