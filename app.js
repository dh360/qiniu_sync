let qiniu = require('qiniu');
let Upload = require('./Upload');
const CONFIG = require('./config.js');
let fs = require("fs");

// let upload = new Upload(CONFIG);
// upload.start(CONFIG);



var accessKey = CONFIG.accessKey;
var secretKey = CONFIG.secretKey;
var putPolicy = new qiniu.rs.PutPolicy({
    scope: 'leomeo'
});
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var uploadToken = putPolicy.uploadToken(mac);
var config = new qiniu.conf.Config();
config.zone = qiniu.zone.Zone_z0;
var formUploader = new qiniu.form_up.FormUploader(config);
var putExtra = new qiniu.form_up.PutExtra();
var localFile = "./upload_file/car.png";
var key = '0612/ddddd.png';
// 文件上传
formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr,
    respBody, respInfo) {
    if (respErr) {
        throw respErr;
    }
    if (respInfo.statusCode == 200) {
        console.log(respBody);
    } else {
        console.log(respInfo.statusCode);
        console.log(respBody);
    }
});