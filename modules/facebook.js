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
    const pageID = process.env.FACEBOOK_PAGEID || '106114650814584';
    const access_token = process.env.FACEBOOK_ACCESSTOKEN || 'EAAH1r8MogLIBAEIfgjq5YkA00A9pWF6MDKeQHpQGZAnH9rNPaFJ1Huzqw3UWxicxCl6VKZAsUAyYxeHvZBInridlPoUYloMh0Vvi5YReGkVwDTmr9T0JaH3fkZCE03PaASOIZAl3QW077oxKwwHK2e7eT5jZAmd5lZAavmjcI2OOgZDZD';
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
            // vault_image_id: picture
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