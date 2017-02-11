const fs      = require('fs');
const path    = require('path');
const request = require('request');


var movieDir = __dirname + '/movies',
    exts = ['.mkv','.mp4','.avi','.rm','.rmvb','.wmv'];


// 读取文件列表
var readFiles = function () { 
    return new Promise(function(resolve,  reject) {
        fs.readdir(movieDir, function(err, files) {
            resolve(files.filter((v) => exts.includes(path.parse(v).ext)));
        });
    });
 };

// 通过豆瓣api获取海报
var getPoster = function(movieName)
{
    let url =   `https://api.douban.com/v2/movie/search?q=${encodeURI(movieName)}`;
    return new Promise(function(resolve, reject) {
        request({url:url, json: true}, function(error, respose, body) {
            if(error) reject(error);
            resolve(body.subjects[0].images.large);
        });
    });
}

// 保存海报
var savePoster = function (movieName, url)
{
    request.get(url).pipe(fs.createWriteStream(path.join(movieDir + '/images/', movieName + '.jpg')));
}

// 使用 es7 saync await 获取如获取电影图片
var getImages = async () => {
    let files = await readFiles(); // [ '功夫熊猫.mp4', '功夫瑜伽.mkv' ]
    // await
    for(var file of files)
    {
        let name = path.parse(file).name;
        console.log(`正在获取【${name}】的海报`);
        savePoster(name, await getPoster(name));
    }
    console.log('=== 获取海报完成 ===');
};

getImages();

