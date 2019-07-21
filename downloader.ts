let Qiniu = require('qiniu');
let request = require("request");
let Fs = require('fs');
let CONFsIG = require('./config.js');
console.log(CONFIG);
let accessKey = CONFIG.accessKey;
let secretKey = CONFIG.secretKey;
let mac = new Qiniu.auth.digest.Mac(accessKey, secretKey);
let config = new Qiniu.conf.Config();
let bucketManager = new Qiniu.rs.BucketManager(mac, config);
let publicBucketDomain = 'http://Qiniucdn.netcaa.com';
let key = 'bbb/upload_test_files/car.png';
let path = require('path');
// 公开空间访问链接
let url = bucketManager.publicDownloadUrl(publicBucketDomain, key);
console.log(url);


let options = ['leomeo', {
    limit: 500,
    prefix: '' //前缀
}];

class Downloader{ 
    
    //保存文件到本地
    saveFile(fileName: string, savePath: string) {
        let rootPath = path.join(__dirname);
        if (Fs.existsSync(rootPath)) {
            console.log('路径已经存在， 请更换其他路径');
        } else {
            Fs.mkdirSync(rootPath);
        }
        if (fileName) {
    
        }
    }
    
    //解析路径   创建相应的目录和文件
    parsePath(url: string) {
        let domin = CONFIG.domin;
        let filePath = url.split(domin)[1];
        let fileAndDirs = filePath.split('/');
        // 第一个元素是空字符串  ， 从第二个开始
        for (let i in fileAndDirs) {
            if (i > 1) {
                //判断文件夹在不在， 不在就创建新的文件夹， 在的话 放进去
                //最后一个是文件名， 而不是文件夹
                if (i == fileAndDirs.length - 1) {
                    create(files);
                }
            }
        }
        
    }
    
    //获取空间中的文件列表
    getFilesList() {

        let bucket = 'leomeo';
        // @param options 列举操作的可选参数
        //                prefix    列举的文件前缀
        //                marker    上一次列举返回的位置标记，作为本次列举的起点信息
        //                limit     每次返回的最大列举文件数量
        //                delimiter 指定目录分隔符
        let options = {
            limit: 500,
            prefix: '', //前缀
        };
    
        bucketManager.listPrefix(bucket, options, function (err: string, respBody: object, respInfo: object) {
            if (err) {
                console.log(err);
                throw err;
            }
    
            if (respInfo.statusCode == 200) {
                //如果这个nextMarker不为空，那么还有未列举完毕的文件列表，下次调用listPrefix的时候，
                //指定options里面的marker为这个值
                let nextMarker = respBody.marker;
                let commonPrefixes = respBody.commonPrefixes;
                // console.log(nextMarker);
                // console.log(commonPrefixes);
                let items = respBody.items;
                items.forEach(function (item) {});
            } else {
                console.log(respInfo.statusCode);
                console.log(respBody);
            }
        });
    
    }

    //把原api 包装成 promise 
// bucket: 空间存储名
//options ： 设置 传输限制， 以及文件前缀
    getInfo(bucket: string, options: object) {
        return new Promise((resolve, reject) => {
            bucketManager.listPrefix(bucket, options, function (err, respBody, respInfo) {
                let res = {
                    statusCode: '', //返回状态码
                    msg: ''
                };
    
                if (err) {
                    let errInfo = err.message.split('\n');
                    res.statusCode = errInfo[0] || 'error';
                    res.msg = JSON.parse(errInfo[1]).error;
                    reject(res);
                } else {
    
                    console.log('err', err);
                    console.log(respInfo);
                    if (respInfo.statusCode == 200) {
                        let nextMarker = respBody.marker;
                        let commonPrefixes = respBody.commonPrefixes; //这个地方是用来判断 空间中是否还有没下载的额文件， 记录本次下载的文件到哪个地方， 以实现断点续传
                        let items = respBody.items;
                        items.forEach(function (item) {});
                    }
                    res.statusCode = respInfo.statusCode;
                    res.msg = respBody;
                    resolve(res);
                }
    
            });
        });
    }
}

