/* AWS Rekognition module to run analysis on given picture */
/* AWS Server Configuration, User Credentials and other parameters set in environment variables */

/** Environment Variables Required: 
 * 
 * AWS_POOLID           - AWS Cognito Identity Pool ID
 * AWS_USERPOOLID       - AWS User Pool Id
 * AWS_CLIENTID         - AWS Client ID
 * AWS_USERNAME         - AWS Cognito User Name goes here
 * AWS_PASSWORD         - AWS Cognito Password goes here
 * */

    //AWS Cognito
    const AmazonCognitoIdentity = require('amazon-cognito-identity-js');
    const AWS = require('aws-sdk');
    global.fetch = require('node-fetch');

    module.exports = {
        Rekogn: function (imageBase64, response) {
                return (ProcessImage(imageBase64, response));
            }
    }

    //Calls DetectFaces API and shows emotions of detected faces
    function DetectFaces(imageBase64, callback) {
        console.log('Detecting faces for image: ' + imageBase64);
        var imageString = imageBase64.toString();
        var newImage = Buffer.alloc(imageString.length,imageBase64, "base64");
        
        AWS.config.update({region:'eu-west-1'});
        AWS.config.credentials = new AWS.CognitoIdentityCredentials({
            IdentityPoolId: process.env.AWS_POOLID, //Your AWS Cognito Identity Pool ID goes here
          });
        
        var rekognition = new AWS.Rekognition();
        var params = {
            Image: {
                Bytes: newImage
            },
            Attributes: ['ALL',]
        };
        
        rekognition.detectFaces(params, function (err, data) {
            if (err) console.log(err, err.stack);
            else {
                // retrieve the higher graded emotion
                for (var i = 0; i < data.FaceDetails.length; i++) {
                    var arr = data.FaceDetails[i].Emotions;
                    function getMax(arr, prop) {
                        var max;
                        for (var k=0 ; k<arr.length ; k++) {
                            if (max == null || parseInt(arr[k][prop]) > parseInt(max[prop]))
                            max = arr[k];
                        }
                        return max;
                    }
                    var maxConf = getMax(arr, "Confidence");
                    console.log(maxConf.Type + " - " + maxConf.Confidence); //E.g.: "Happy - 0.874302"
                    var finalRating = 0;
                    switch (maxConf.Type) {
                        case 'ANGRY':
                            //one star
                            finalRating = 1;
                            break;
                        case 'DISGUSTED':
                            //one star
                            finalRating = 1;
                            break;
                        case 'SAD':
                            //two stars
                            finalRating = 2;
                            break;
                        case 'CONFUSED':
                            //two stars
                            finalRating = 2;
                            break;
                        case 'CALM':
                            //three stars
                            finalRating = 3;
                            break;
                        case 'SURPRISED':
                            //four stars
                            finalRating = 4;
                            break;
                        case 'HAPPY':
                            //five stars
                            finalRating = 5;
                    }
                    console.log('Final Estimated Rating: ' + finalRating + ' stars'); //E.g.: "Final Estimated Rating: 5 stars"
                    callback(null, finalRating);
                }
            }
        });
    }

    const poolData = {    
        UserPoolId : process.env.AWS_USERPOOLID,     //Your AWS User Pool Id goes here
        ClientId : process.env.AWS_CLIENTID // Your AWS Client ID goes here
    }; 

    const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

    function ProcessImage(imageBase64, callback) {
        var authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
            Username : process.env.AWS_USERNAME,    //Your AWS Cognito User Name goes here
            Password : process.env.AWS_PASSWORD,  //Your AWS Cognito Password goes here
        });

        var userData = {
            Username : process.env.AWS_USERNAME,    //Your AWS Cognito User Name goes here
            Pool : userPool
        };

        var cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);
        cognitoUser.authenticateUser(authenticationDetails, {
            onSuccess: function (result) {
                console.log("Amazon Cognito authenticated!");
                DetectFaces(imageBase64, callback);
            },
            onFailure: function(err) {
                console.log(err);
            },
        });
    }