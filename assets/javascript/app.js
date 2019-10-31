/***********************************
FIREBASE
***********************************/
// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyComNTXNIOun4VV90ifLnBI2ygZHxOTBTk",
    authDomain: "train-scheduler-cf00f.firebaseapp.com",
    databaseURL: "https://train-scheduler-cf00f.firebaseio.com",
    projectId: "train-scheduler-cf00f",
    storageBucket: "train-scheduler-cf00f.appspot.com",
    messagingSenderId: "1084784664653",
    appId: "1:1084784664653:web:bdbf0d4ff556fde7a7bc04"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// set up database
var database = firebase.database();

/***********************************
VARIABLES
***********************************/
// Initial Values
var trainName = "";
var destination = "";
var firstTrainTime = "";
var frequency = "";

var currentTime = "";

/***********************************
FUNCTIONS
***********************************/
function addTableRow() {
    // select new tr and td, tbody
    var tr = $("<tr>");
    var td1 = $("<td id='train-name'>");
    var td2 = $("<td id='destination'>");
    var td3 = $("<td id='frequency'>");
    var td4 = $("<td id='next-arrival'>");
    var td5 = $("<td id='minutes-away'>");
    var tbody = $("#train-table");

    // get inputs
    td1.text(trainName);
    td2.text(destination);
    td3.text(frequency);
    td4.text("");
    td5.text("");

    // append tr to tbody
    tbody.append(tr);

    // append td to tr
    tr.append(td1);
    tr.append(td2);
    tr.append(td3);
    tr.append(td4);
    tr.append(td5);
}
// function minutesAwayFunc() {

// }

// get current time
function getTime() {
    var today = new Date();
    currentTime = today.getHours() + ":" + today.getMinutes();
    console.log(currentTime);
}

// function nextArrivalFunc() {
//     var nextArrival = new Date((date.getTime()) + minutes() * 20000);
//     console.log(nextArrival);
// }

/***********************************
EVENTS
***********************************/
// add train button click
$("#add-btn").on("click", function (event) {
    $("#train-table").empty();
    // keep button from submitting form 
    event.preventDefault();

    // store inputs
    trainName = $("#train-name-input").val().trim();
    destination = $("#destination-input").val().trim();
    firstTrainTime = $("#first-time-input").val().trim();
    frequency = $("#frequency-input").val().trim();

    // push to firebase database
    database.ref().push({
        trainName: trainName,
        destination: destination,
        firstTrainTime: firstTrainTime,
        frequency: frequency,
    });

    // empty input fields
    $("#train-name-input").val("");
    $("#destination-input").val("");
    $("#first-time-input").val("");
    $("#frequency-input").val("");
});
// Firebase watcher + initial loader
database.ref().on("child_added", function (childSnapshot) {
    // TEST
    console.log(childSnapshot.val().trainName);
    console.log(childSnapshot.val().destination);
    console.log(childSnapshot.val().firstTrainTime);
    console.log(childSnapshot.val().frequency);

    addTableRow();

    // Handle the errors
}, function (errorObject) {
    console.log("Errors handled: " + errorObject.code);
});

database.ref().orderByChild("dateAdded").limitToLast(1).on("child_added", function (snapshot) {
    // Change the HTML to reflect
    $("#train-name").text(snapshot.val().trainName);
    $("#destination").text(snapshot.val().destination);
    $("#frequency").text(snapshot.val().frequency);
});

/***********************************
MAIN CODE
***********************************/

getTime();
// nextArrivalFunc();