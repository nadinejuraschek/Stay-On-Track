$(document).ready(function () {
    /***********************************
    FIREBASE
    ***********************************/
    // Firebase configuration
    // var config = process.env.config;
    const config = {
        apiKey: "AIzaSyComNTXNIOun4VV90ifLnBI2ygZHxOTBTk",
        authDomain: "train-scheduler-cf00f.firebaseapp.com",
        databaseURL: "https://train-scheduler-cf00f.firebaseio.com",
        projectId: "train-scheduler-cf00f",
        storageBucket: "train-scheduler-cf00f.appspot.com",
        messagingSenderId: "1084784664653",
        appId: "1:1084784664653:web:bdbf0d4ff556fde7a7bc04"
    };

    // Initialize Firebase
    firebase.initializeApp(config);

    // set up database
    var database = firebase.database();

    /***********************************
    VARIABLES
    ***********************************/
    // Initial Values
    var trainName = "";
    var destination = "";
    var firstTrainTime = "";
    var frequency = 0;

    var currentTime = moment();
    var nextArrival = "";
    var minutesAway = "";

    /***********************************
    FUNCTIONS
    ***********************************/
    function getTime() {
        var currentTimeDisplay = moment().format("hh:mm");
        $("#current-time").text(currentTimeDisplay);
        setTimeout(currentTimeDisplay, 1000);
    }

    /***********************************
    MAIN CODE
    ***********************************/
    // display current time
    getTime();

    // add train button click
    $("#add-btn").on("click", function (event) {
        // keep button from submitting form 
        event.preventDefault();

        // store inputs
        trainName = $("#train-name-input").val().trim();
        destination = $("#destination-input").val().trim();
        firstTrainTime = $("#first-time-input").val().trim();
        frequency = $("#frequency-input").val().trim();

        // TEST
        console.log("Entered Train Name: " + trainName);
        console.log("Entered Destination: " + destination);
        console.log("Entered First Time: " + firstTrainTime);
        console.log("Entered Frequency: " + frequency);

        // push to firebase database
        database.ref().push({
            trainName: trainName,
            destination: destination,
            firstTrainTime: firstTrainTime,
            frequency: frequency,
            nextArrival: nextArrival,
            minutesAway: minutesAway,
            timeAdded: firebase.database.ServerValue.TIMESTAMP
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
        // console.log(childSnapshot.val().trainName);
        // console.log(childSnapshot.val().destination);
        // console.log(childSnapshot.val().firstTrainTime);
        // console.log(childSnapshot.val().frequency);

        var firstTrainConverted = moment(childSnapshot.val().firstTrainTime, "hh:mm").subtract(1, "years");
        // console.log(firstTrainConverted);
        var timeDifference = moment().diff(moment(firstTrainConverted), "minutes");
        // console.log(timeDifference);
        var timeAway = timeDifference % childSnapshot.val().frequency;
        // console.log(timeAway);
        minutesAway = (childSnapshot.val().frequency) - timeAway;
        console.log("Calculated Minutes Away: " + minutesAway);
        nextArrival = moment().add(minutesAway, "minutes").format("hh:mm");
        console.log("Calculated Next Arrival: " + nextArrival);

        // add new table row
        var tr = $("<tr class=''>");
        tr.append($("<td>" + childSnapshot.val().trainName + "</td>"));
        tr.append($("<td>" + childSnapshot.val().destination + "</td>"));
        tr.append($("<td>" + childSnapshot.val().frequency + "</td>"));
        tr.append($("<td>" + nextArrival + "</td>"));
        tr.append($("<td>" + minutesAway + "</td>"));
        $("#train-table").append(tr);

        // Handle the errors
    }, function (errorObject) {
        console.log("Errors handled: " + errorObject.code);
    });

    setInterval(function () {
        window.location.reload();
    }, 60000);

    /***********************************
    CURRENT YEAR
    ***********************************/
    const year = new Date().getFullYear();
    $("#currentYear").html(year);
});