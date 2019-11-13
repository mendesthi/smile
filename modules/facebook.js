/* Facebook module to post pictures on user's wall */
/* ... parameters set in environment variables */

/** Environment Variables Required: 
 * 
 * FACEBOOK_PAGEID      - Facebook page ID
 * FACEBOOK_TOKEN       - Facebook Access Token
 * 
 * */
    
var req = require('request') // HTTP Client

module.exports = {
    PostToFacebookPage: function (picture, response) {
            return (PostToFacebookPage(picture, response));
        }
}   

function PostToFacebookPage(picture, callback) {
    console.log(picture);
    const pageID = process.env.FACEBOOK_PAGEID;
    const access_token = process.env.FACEBOOK_ACCESSTOKEN;
    const options = {
        method: 'POST',
        headers: {
            'Accept-Encoding': 'gzip, deflate',
        },
        uri: 'https://graph.facebook.com/v4.0/' + pageID + '/photos',
        qs: {
            access_token: access_token,
            url: picture,
            caption: 'I have been at the SAP SMB Innovation Summit!!!'
        }
    };

    req(options, function (error, response, body) {
        if (!error && response.statusCode == 200) {
            var obj = JSON.parse(body);
            resp = obj.post_id;
            console.log("Succesfully posted to Facebook. Response ID: " + resp)
            callback(null, resp);
        } else {
            callback(error.code, error.message);
        }
    });
}