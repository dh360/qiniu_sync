let qiniu = require('qiniu');


let util = {

    //获取本地文件的路径

    // 上传处理函数 


    //根据 地区返回相应 地区代码

    returnCode: function (name) {
        let code = '';
        switch (name) {
            case "华东":

                break;

            default:
                break;
        }

        return
    },
    //上传动作
    doUpload: function (config, callback) {
        let {
            accessKey,
            secretKey,
            bucket
        } = config;
        //要上传文件的本地路径
        let localFile = './car.png';
        let key = 'dinghao/car.png';
        // 文件上传
        let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        let options = {
            scope: bucket,
        };
        let putPolicy = new qiniu.rs.PutPolicy(options);
        let uploadToken = putPolicy.uploadToken(mac);
        let qiniuConfig = new qiniu.conf.Config();
        qiniuConfig.zone = qiniu.zone.Zone_z0; // 空间对应的机房
        let formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
        let putExtra = new qiniu.form_up.PutExtra();

        function a(respErr,
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
        }

        formUploader.putFile(uploadToken, key, localFile, a);
    },
    // 根据文件类型 处理
    uploadHandler: function () {

    }

    // "华东": "Zone_z0",
    // "华北": "Zone_z1",
    // "华南": "Zone_z2",
    // "北美": "Zone_na0"

};


module.exports = util;