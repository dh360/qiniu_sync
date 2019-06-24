var qiniu = require('qiniu');
var request = require("request");
var fs = require('fs');
const CONFIG = require('./config.js');
let accessKey = CONFIG.accessKey;
let secretKey = CONFIG.secretKey;
var mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
var config = new qiniu.conf.Config();
var bucketManager = new qiniu.rs.BucketManager(mac, config);
var publicBucketDomain = 'http://qiniucdn.netcaa.com';
var key = 'bbb/upload_test_files/car.png';


// 公开空间访问链接
var url = bucketManager.publicDownloadUrl(publicBucketDomain, key);
console.log(url);

request(url, (req, res) => {
    console.log(req);
    console.log(res);
});

//保存文件到本地
function saveFile(fileName, savePath) {
    let rootPath = path.join(__dirname);
    if (fs.existsSync(rootPath)) {
        console.log('路径已经存在， 请更换其他路径');
    } else {
        fs.mkdirSync(rootPath);
    }
    if (fileName) {

    }
}