let qiniu = require('qiniu');
let ProgressBar = require('./process_bar');
const CONFIG = require('./config.js');
let fs = require("fs");
let join = require('path').join;

function Uploader() {
    /*
     *初始化  生成mac 签名验证  返回formUploader 上传对象
     */
    this.init = function () {
        let accessKey = CONFIG.accessKey;
        let secretKey = CONFIG.secretKey;
        let putPolicy = new qiniu.rs.PutPolicy({
            scope: CONFIG.upLoad.bucket
        });
        let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        let uploadToken = putPolicy.uploadToken(mac);
        let config = new qiniu.conf.Config();
        config.zone = this.checkArea(CONFIG.upLoad.zone); //  把存储地区换成相应的zone code
        let formUploader = new qiniu.form_up.FormUploader(config);
        let putExtra = new qiniu.form_up.PutExtra();
        return {
            formUploader,
            uploadToken,
            putExtra
        };
    };

    /*
     *  读取上传目录 遍历 其中的文件 
     * params path  目录路径
     */
    this.readFiles = function (filePath) {
        console.log("正在读取文件目录...");
        let finalFiles = [];

        //检查有无需要忽略的文件或者目录
        let ignores = CONFIG.upLoad.ignore;
        if (ignores.length > 0) {
            ignores.map((path) => {
                return path
            });
            let filePath = join(path, item);
        }

        function doRead(path) {
            fs.readdirSync(path).forEach((item, index) => {
                let filePath = join(path, item);
                let stat = fs.statSync(filePath);
                // if () {

                // }
                if (stat.isDirectory()) {
                    doRead(filePath);
                }
                if (stat.isFile()) {
                    finalFiles.push(filePath);
                }
            });
        }
        doRead(filePath);

        return finalFiles;
    };

    /*
     * 将上传函数包装成 promise函数
     */
    this.doUpload = function (formUploader, uploadToken, putExtra, localFile, key) {
        return new Promise((resolve, reject) => {
            formUploader.putFile(uploadToken, key, localFile, putExtra, (respErr, respBody, respInfo) => {
                if (respErr) {
                    reject(respErr);
                }
                console.log("跑出错误");
                let res = {
                    respBody,
                    respInfo
                }
                console.log("继续执行");

                resolve(res);
            })
        })

    };

    this.start = async function () {
        const {
            formUploader,
            uploadToken,
            putExtra
        } = this.init();
        let files = this.readFiles(CONFIG.upLoad.fileDir);
        console.log('文件目录读取成功，开始上传目录文件')
        console.log("待上传的文件队列个数为：   ", files.length);
        //进度条
        let NumTotal = files.length;
        let NumDone = 0;
        let processBar = new ProgressBar(NumTotal);
        for (let i in files) {
            processBar.render("正在上传", NumTotal, i);

            let localFile = files[i];
            let key = localFile;
            const uploadRes = await this.doUpload(formUploader, uploadToken, putExtra, localFile, key);
        };
        processBar.render("正在上传", NumTotal, NumTotal);
    };

    this.checkArea = function (name) {
        let code = 'Zone_z0'; //默认华北
        if (!name) {
            console.log("请输入要传输的对象存储的区域")
        };
        switch (name) {
            case "华北":
                code = "Zone_z1";

                break;

            case "华南":
                code = "Zone_z2";

                break;
            case "北美":
                code = "Zone_na0";

                break;
            default:
                code = "Zone_z0";
                break;
        }

        let zoneUrlObj = qiniu.zone[code];
        return zoneUrlObj;
    };
}


module.exports = Uploader;