let qiniu = require('qiniu');
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
            scope: 'leomeo'
        });
        let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        let uploadToken = putPolicy.uploadToken(mac);
        let config = new qiniu.conf.Config();
        config.zone = qiniu.zone.Zone_z0;
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
        let finalFiles = [];

        function doRead(path) {
            fs.readdirSync(path).forEach((item, index) => {
                let filePath = join(path, item);
                let stat = fs.statSync(filePath);

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
                let res = {
                    respBody,
                    respInfo
                }
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
        let files = this.readFiles(CONFIG.uploadDir);
        console.log('开始上传目录文件')

        for (let i in files) {
            let localFile = files[i];
            let key = '';
            const uploadRes = await this.doUpload(formUploader, uploadToken, putExtra, localFile, localFile);
        };
    }

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

        return "qiniu.zone." + code;
    }
}


module.exports = Uploader;