let qiniu = require('qiniu');
let Upload = require('./Upload');
const CONFIG = require('./config.js');
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
    return {
        formUploader,
        uploadToken,
        putExtra
    };
}


function findFile(path) {
    let jsonFiles = []; // 存放文件
    let files = fs.readdirSync(path);
    files.forEach(function (item, index) {
        let fPath = join(path, item);
        let stat = fs.statSync(fPath);
        if (stat.isDirectory() === true) {
            findFile(fPath);
        }
        if (stat.isFile() === true) {
            jsonFiles.push(fPath);
        }
    });
    return jsonFiles;
    console.log(jsonFiles);
}

function upload() {
    // let files = findFile('./upload_file/');

    for (let i = 0; i < files.length; i++) {
        var localFile = files[i];
        var key = files[i];
        return new Promice
        async function aaa() {
            let {
                formUploader,
                uploadToken,
                putExtra
            } = init();
            let uolodad = promisify(formUploader.putFile);

            let a = await uolodad(uploadToken, key, localFile, putExtra);
            return a;
        }
        console.log(aaa());
        // // 文件上传
        // formUploader.putFile(uploadToken, key, localFile, putExtra, function (respErr,
        //     respBody, respInfo) {
        //     if (respErr) {
        //         throw respErr;
        //     }
        //     if (respInfo.statusCode == 200) {
        //         console.log(respBody);
        //     } else {
        //         console.log(respInfo.statusCode);
        //         console.log(respBody);
        //     }
        // });
    }

}




upload();