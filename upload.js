let qiniu = require('qiniu');


let Upload = function (config) {
    console.log(config);

    // 检查配置， 生成七牛签名
    this.init = function (config) {
        console.log(config);
        let {
            accessKey,
            secretKey,
            bucket,
            zone
        } = config;

        let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        let putPolicy = new qiniu.rs.PutPolicy({
            scope: bucket
        });
        let uploadToken = putPolicy.uploadToken(mac);
        let qiniuConfig = new qiniu.conf.Config();
        qiniuConfig.zone = qiniu.zone.Zone_z0; // 空间对应的机房
        console.log(this.checkArea(config.zone));
        let formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
        let putExtra = new qiniu.form_up.PutExtra();
        return {
            formUploader,
            uploadToken
        };
    };

    //开始上传
    this.start = function (config) {
        let localFile = './upload_file/car.png';
        let key = '0612/car.png';

        let {
            accessKey,
            secretKey,
            bucket,
            zone
        } = config;

        let mac = new qiniu.auth.digest.Mac(accessKey, secretKey);
        let putPolicy = new qiniu.rs.PutPolicy({
            scope: bucket
        });
        let uploadToken = putPolicy.uploadToken(mac);
        let qiniuConfig = new qiniu.conf.Config();
        qiniuConfig.zone = qiniu.zone.Zone_z0; // 空间对应的机房
        console.log(this.checkArea(config.zone));
        let formUploader = new qiniu.form_up.FormUploader(qiniuConfig);
        let putExtra = new qiniu.form_up.PutExtra();


        formUploader.putFile(uploadToken, key, localFile, (respErr, respBody, respInfo) => {
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

        return "qiniu.zone." + code;
    }
}


module.exports = Upload;