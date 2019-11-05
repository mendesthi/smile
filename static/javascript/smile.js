window.addEventListener('load', function () {
    var facebookButton = document.getElementById('facebook');
    var confirmButton = document.getElementById('confirm');
    var player = document.getElementById('player');
    var snapshotCanvas = document.getElementById('snapshot');
    var captureButton = document.getElementById('capture');
    var videoTracks;


    var handleSuccess = function(stream) {
        // Attach the video stream to the video element and autoplay.
        player.srcObject = stream;
        videoTracks = stream.getVideoTracks();
    };

    var imagefromcam = new Image();
    captureButton.addEventListener('click', function() {
        var context = snapshot.getContext('2d');
        context.drawImage(player, 0, 0, snapshotCanvas.width, snapshotCanvas.height);

        // Stop all video streams.
        videoTracks.forEach(function(track) {
            track.stop()
        });

        imagefromcam.id = "pic";
        imagefromcam.src = snapshotCanvas.toDataURL();
        document.getElementById('snapshot').appendChild(imagefromcam);
        $("#player").fadeOut();
    
        ProcessImage();
    });

    navigator.mediaDevices.getUserMedia({
            video: true
        })
        .then(handleSuccess);

    facebookButton.addEventListener('click', function() {
        uploadAndPost();
    });

    confirmButton.addEventListener('click', function() {
        fillQualtrics();
    });

    var finalRating = 0;
    function processResult(data) { 
        finalRating = data.rating;
        var stars = '/static/resources/star0.png'; // no stars
        switch (data.rating) {
            case 1:
                //one star
                stars = '/static/resources/star1.png';  
                break;
            case 1:
                //one star
                stars = '/static/resources/star1.png';  
                break;
            case 2:
                //two stars
                stars = '/static/resources/star2.png'; 
                break;
            case 2:
                //two stars
                stars = '/static/resources/star2.png'; 
                break;
            case 3:
                //three stars
                stars = '/static/resources/star3.png'; 
                break;
            case 4:
                //four stars
                stars = '/static/resources/star4.png'; 
                break;
            case 5:
                //five stars
                stars = '/static/resources/star5.png'; 
        }

        var table = "<table>";
        table += '<tr><td align="center">' + 'Rating based on image: ' +
            '</td><tr><td align="center"> <img src=' + stars + '></img></td></tr></tr>';
        table += "</table>";

        document.getElementById("opResult").innerHTML = table;
    }

    //Loads selected image and unencodes image bytes for AWS Rekognition DetectFaces API
    function ProcessImage() {
        //Clean the image base64 string
        var imgStrBase64 = snapshot.toDataURL().replace(/^data:image\/(png|jpg);base64,/, "");
        //Sends body with clean string
        bodyTest = {
            "image": imgStrBase64
        };
        //Call server-side image rekognition (uses AWS Rekognition)
        $.ajax({
            url: "https://smiletcm-happy-buffalo.cfapps.eu10.hana.ondemand.com/awsRekogn", //Replace with backend server hostname
            // url: "http://localhost:30000/awsRekogn", //Replace with backend server hostname
            type: "POST",
            data: JSON.stringify(bodyTest),
            contentType: "application/json",
            success: function(data) {
                console.log("Success");
                processResult(data);
            },
            complete: function(jqXHR, textStatus) {
                console.log("Complete");
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("Error: " + JSON.stringify(jqXHR.responseJSON));
            }
        });
    };

    // Create user text feedback on Qualtrics
    function fillQualtrics() {  
        var QID1 = finalRating; // this is the rating from smile
        var QID2_Text = document.getElementsByName("textFeedback")[0].value; //this is a text feedback from user
        var sessionID = '0987612345';

        //Format body with rating (QID1) and feedback text (QID2_Text)
        bodyTest = {
            "question1": QID1,
            "question2": QID2_Text,
            "sessionID": sessionID
        };

        //Call server-side API to process qualtrics survey
        $.ajax({
            url: "https://smiletcm-happy-buffalo.cfapps.eu10.hana.ondemand.com/fillSurvey", //Replace with backend server hostname
            // url: "http://localhost:30000/fillSurvey", //Replace with backend server hostname
            type: "POST",
            data: JSON.stringify(bodyTest),
            contentType: "application/json",
            success: function(data) {
                console.log("Succesfully posted in Qualtrics");
            },
            complete: function(jqXHR, textStatus) {
                console.log("Complete");
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("Error: " + JSON.stringify(jqXHR.responseJSON));
            }
        });
    };
    
    //Post user picture to Facebook Page: SMB Innovation Summits
    function postToFacebook(imageURL) { 
        bodyTest = {
            "image": imageURL
        };
        //Call server-side image rekognition (uses AWS Rekognition)
        $.ajax({
            url: "https://smiletcm-happy-buffalo.cfapps.eu10.hana.ondemand.com/PostToFacebook", //Replace with backend server hostname
            // url: "http://localhost:30000/PostToFacebook", //Replace with backend server hostname
            type: "POST",
            data: JSON.stringify(bodyTest),
            contentType: "application/json",
            success: function(data) {
                console.log("Successfully posted to Facebook: https://www.facebook.com/106114650814584/photos/" + data.postId.split('_')[1]);
                alert("Successfully posted to Facebook: https://www.facebook.com/106114650814584/photos/" + data.postId.split('_')[1]);
                console.log(data);
            },
            complete: function(jqXHR, textStatus) {
                console.log("Complete");
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("Error: " + JSON.stringify(jqXHR.responseJSON));
            }
        });
    }
    
    //Upload user picture to AWS S3 (if ok, post to facebook)
    function uploadAndPost() {
        //Clean the image base64 string
        var imgStrBase64 = snapshot.toDataURL().replace(/^data:image\/(png|jpg);base64,/, "");
        //Sends body with clean string
        bodyTest = {
            "image": imgStrBase64
        };
        //Call server-side image rekognition (uses AWS Rekognition)
        $.ajax({
            url: "https://smiletcm-happy-buffalo.cfapps.eu10.hana.ondemand.com/UploadImage", //Replace with backend server hostname
            // url: "http://localhost:30000/UploadImage", //Replace with backend server hostname
            type: "POST",
            data: JSON.stringify(bodyTest),
            contentType: "application/json",
            success: function(data) {
                console.log("Success");
                postToFacebook(data.imageUrl);
            },
            complete: function(jqXHR, textStatus) {
                console.log("Complete");
            },
            error: function(jqXHR, textStatus, errorThrown) {
                console.log("Error: " + JSON.stringify(jqXHR.responseJSON));
            }
        });
    };
})