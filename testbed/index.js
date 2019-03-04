var firebase = require("firebase");
var config = {
    apiKey: "AIzaSyBeq49d23oguIN6Vv55Ai4q-LmWKyNPk10",
    authDomain: "nventory-a93b9.firebaseapp.com",
    databaseURL: "https://nventory-a93b9.firebaseio.com",
    projectId: "nventory-a93b9",
    storageBucket: "nventory-a93b9.appspot.com",
    messagingSenderId: "212525762281"
};
firebase.initializeApp(config);

async function run() {
    try {
    await firebase.auth().signInWithEmailAndPassword("pjc0247@naver.com", "asdf1234");
    }
    catch (e){ 
        console.log(e);
    }
    console.log(firebase.auth().currentUser.uid);

    var functions = firebase.functions();
    var addMessage = firebase.functions().httpsCallable('getAllItems');
    let param = {
        key: 'a',
        expiry: 10000000,
        item: {}
    };
    let result = await addMessage(param);
    console.log(result.data);
}
run();