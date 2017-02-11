
var sleep = function (time)
{
    return new Promise(function (resolve, reject) {
        setTimeout(function () {
            console.log('程序睡了' + time/ 1000 +'秒');
            resolve();
        },time);
    });
}

var start = async function ()
{
    console.log('start');
    await sleep(3000);
    console.log('end');
}

start();