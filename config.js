let Config = {
    accessKey: '_CghcYndvysaLVqfLaDKc80StCcwOWlxXS4MwAB2',
    secretKey: 'X3DSDndHKOMzmms3dh886XwzTiC9t3pHWpkHav0b',
    bucket: "leomeo", // 对象存储名称
    zone: "华东", //机房 位置

    uploadFileOrDirs: { //需要上传的文件或者目录  格式    上传到七牛之后的名称  :   本地路径
        "images": "",
        "": "",
        "": "",
        "": ""

    },
    uploadDir: './dinghao/'
};

module.exports = Config;