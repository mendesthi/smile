/* AWS S3 module to temporarily store pictures on S3 bucket, and delete them */
/* ... parameters set in environment variables */

/** Environment Variables Required: 
 * 
 * AWS_BUCKET           - S3 Bucket ID
 * AWS_REGION           - AWS Region
 * AWS_ACCESS_KEY       - AWS Access Key
 * AWS_SECRET_KEY       - AWS Secret Key
 * 
 * */

var AWS = require('aws-sdk')
const fs = require('fs')

const BUCKET = process.env.AWS_BUCKET
const REGION = process.env.AWS_REGION
const ACCESS_KEY = process.env.AWS_ACCESS_KEY
const SECRET_KEY = process.env.AWS_SECRET_KEY

const imageRemoteName = `selfie_${new Date().getTime()}.png`

module.exports = {
    UploadImage: function (userImage, response) {
            return (UploadImage(userImage, response));
        },
    DeleteImage: function (userImage, response) {
        return (DeleteImage(userImage, response));
    }
}

function UploadImage(userImage, callback) {
    AWS.config.update({
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_KEY,
        region: REGION
    })
    
    var s3 = new AWS.S3()
    buf = new Buffer(userImage,'base64')

    s3.putObject({
        Bucket: BUCKET,
        Body: buf,
        Key: imageRemoteName,
        ACL: "public-read",
        ContentType: 'image/png'
    })
        .promise()
        .then(response => {
        console.log(`done! - `, response)
        console.log(
            `The URL is ${s3.getSignedUrl('getObject', { Bucket: BUCKET, Key: imageRemoteName })}`
        )

        response = `${s3.getSignedUrl('getObject', { Bucket: BUCKET, Key: imageRemoteName })}`
        callback(null, response);
        })
        .catch(err => {
        console.log('failed:', err)
        }
    )
}

function DeleteImage(imageToDelete, callback) {
    AWS.config.update({
        accessKeyId: ACCESS_KEY,
        secretAccessKey: SECRET_KEY,
        region: REGION
    })
    
    var s3 = new AWS.S3()
    var params = {Bucket: BUCKET, Key: imageToDelete};

    s3.deleteObject(params, function(err, data) {
        if (!err) 
            console.log("Image deleted from S3: " + data);
            
        else
            console.log(err, err.stack);  
            response = data;
            callback(null, response);    
    });
}
