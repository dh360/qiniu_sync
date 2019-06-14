let qiniu = require('qiniu');
let Upload = require('./Upload');
const CONFIG = require('./config.js');
const util = require("util");
const {
    promisify
} = require('util');
let fs = require("fs");
let join = require('path').join;

function init() {
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
    var key = "addddddddd/car.png";


    //包装成 promise
    function upload(uploadToken, key, localFile, putExtra) {

        return new Promise((resolve, reject) => {
            formUploader.putFile(uploadToken, key, localFile, putExtra, (respErr, respBody, respInfo) => {
                if (respErr) {
                    reject(respErr);
                }
                let res = {
                    respBody,
                    respInfo
                }
                resolve(res);
            })
        })

    }
    async function start() {
        console.log(':::', formUploader.putFile);
        let a = util.promisify(formUploader.putFile);
        let b = await a(uploadToken, key, localFile, putExtra);
        console.log('开始执行')
        // let a = await upload(uploadToken, key, localFile, putExtra);
        console.log(b);
        console.log(process.memoryUsage);
    }
    // // 文件上传
    start();

}




init();