import firebase from "firebase";

export const Firebase = firebase.initializeApp({
  apiKey: "AIzaSyCpXysbh1Vs52-r4iqmgyK_A-Bqi3P1nok",
  authDomain: "duolingohelper-a97e4.firebaseapp.com",
  databaseURL: "https://duolingohelper-a97e4.firebaseio.com",
  projectId: "duolingohelper-a97e4",
  storageBucket: "duolingohelper-a97e4.appspot.com",
  messagingSenderId: "136887288189",
  appId: "1:136887288189:web:615b01a46f0966b178cc14"
});

let DICTIONARY = [];
let GROUPS = [];

export let CONNECTED = false;

export function loginGoogle() {
  let provider = new firebase.auth.GoogleAuthProvider();
  firebase.auth().signInWithRedirect(provider);
}

export function logout() {
  firebase.auth().signOut().then(doOnLogout);
}

let doOnLogout;

export function initFirebaseStuff(setConected, onLogin, onDictionaryUpdated, onGroupsUpdated, onLogout) {
  doOnLogout = onLogout;

  firebase.auth().onAuthStateChanged((a) => {
    if (a) {
      if (onLogin) {
        DICTIONARY = [];
        onLogin(a.uid);

        Firebase.database().ref(`dicts/${a.uid}`).on("value", (a) => {
          console.log("sending!", DICTIONARY.length, a.numChildren());
          if (onDictionaryUpdated) {
            onDictionaryUpdated(DICTIONARY.sort((a, b) => {
              return (a.es.trim() < b.es.trim()) ? -1 : 1;
            }));
          }
        })

        Firebase.database().ref(`dicts/${a.uid}`).on("child_added", (a) => {
          let word = Object.assign(a.val(), { key: a.key });
          DICTIONARY.push(word);
        })

        Firebase.database().ref(`dicts/${a.uid}`).on("child_removed", (a) => {
          DICTIONARY = DICTIONARY.filter((e) => e.es !== a.val().es && e.pl !== a.val().pl)
        })

        Firebase.database().ref(`groups/${a.uid}`).on("child_added", (a) => {
          GROUPS.push(Object.assign(a.val(), { key: a.key }));
          onGroupsUpdated(GROUPS.sort((a, b) => a.title < b.title ? -1 : 1));
        })

        Firebase.database().ref(`groups/${a.uid}`).on("child_removed", (a) => {
          GROUPS = GROUPS.filter((e) => e.title != a.val().title);
          onGroupsUpdated(GROUPS);
        })
      }
    }
  })

  firebase.auth().getRedirectResult().then((result) => {
    if (result && result.user && result.user.uid) {
      let uid = result.user.uid;
      console.log({ uid });
      firebase.database().ref(`users/${uid}`).set({ test: { string: 'User creating test!' } });
    }
  }).catch((reason) => {
    console.log("error", reason);
  })

  Firebase.database().ref().child('.info/connected').on('value', function (connectedSnap) {
    if (connectedSnap.val() === true)
      setConected();
  });


}