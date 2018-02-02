var video = document.getElementById("video");
var medias = { audio:false, video:{}};
if(!!navigator.mediaDevices&&!!navigator.mediaDevices.getUserMedia) {
  navigator.mediaDevices.getUserMedia(medias).then(function(stream) {
    //　video.srcObject にストリームを入れます。
    video.srcObject = stream;
  }).catch(function(err) {
    // カメラを許可してください。
    window.alert("カメラの使用が許可されませんでした");
  });
}
else {
  // カメラがないです。
    window.alert("非対応環境です");
}
var image = new Image();
image.crossOrigin = "Anonymous";
image.src = "img/run2.png";

var saveFileName = "sample";

var canvas = document.getElementById("canvas");

video.addEventListener("loadedmetadata",function(e) {

  var ctx = canvas.getContext("2d");
  canvas.height = Math.floor(window.parent.screen.height*0.45);
  var new_image_height = canvas.height;
  var new_image_width = Math.floor(canvas.height*image.width/image.height);
  ctx.beginPath();
  ctx.rect(Math.floor((canvas.width-new_image_width)/2),0,new_image_width,new_image_height);
  ctx.clip();
  // canvas.height = new_image_height;
  // canvas.width = new_image_width;
  ctx.translate(canvas.width,0);
  ctx.scale(-1,1);

  setInterval(function(e) {
    ctx.drawImage(video,0,0,video.videoWidth,video.videoHeight);
    ctx.drawImage(image,Math.floor((canvas.width-new_image_width)/2),0,new_image_width,new_image_height);
  },33);
});

function chromaKey(){
  var canvas = document.getElementById("canvas");
  var ctx = canvas.getContext("2d");
  var imageData = ctx.getImageData(0,0,1,1);
  data = imageData.data;
  var ch_red = data[0];
  var ch_green = data[1];
  var ch_blue = data[2];
  var output = ctx.createImageData(canvas.width, canvas.height);
  data = ctx.getImageData(0,0,canvas.width,canvas.height).data;
  for (var i = 0, l = data.length; i < l; i += 4) {
    output.data[i]=data[i];
    output.data[i+1]=data[i+1];
    output.data[i+2]=data[i+2];
    if(output.data[i]==ch_red && output.data[i+1]==ch_green && output.data[i+2]==ch_blue){
      output.data[i+3]=0;
    }
    else{
      output.data[i+3]=data[i+3];
    }
  }
  //imageData.data = data;
  ctx.putImageData(output,0,0);
}

// ファイルのサイズを変更する
function changeImageSize(){
  var canvas = document.getElementById('canvas');
  var ctx = canvas.getContext("2d");
  var imagedata = ctx.getImageData(0,0,canvas.width,canvas.height);

  var canvas4save = document.getElementById("canvas_forsaving");
  var ctx4save = canvas4save.getContext("2d");

  var dstWidth = 100;
  var dstHeight = 200;

  // canvas4save.width = dstWidth;
  // canvas4save.height = dstHeight;
  //
  // ctx4save.putImageData(imagedata,dstWidth,dstHeight);
  ctx4save.putImageData(imagedata,0,0);
}


// canvas上のイメージを保存
function saveCanvas(saveType){
    chromaKey();
    changeImageSize();
    var imageType = "image/png";
    var canvas = document.getElementById('canvas_forsaving');
    var base64 = canvas.toDataURL(imageType);
    var blob = Base64toBlob(base64);
    saveBlob(blob);
}

// Base64データをBlobデータに変換
function Base64toBlob(base64)
{
    var tmp = base64.split(',');
    var data = atob(tmp[1]);
    var mime = tmp[0].split(':')[1].split(';')[0];
    var buf = new Uint8Array(data.length);
    for (var i = 0; i < data.length; i++) {
        buf[i] = data.charCodeAt(i);
    }
    // blobデータを作成
    var blob = new Blob([buf], { type: mime });
    return blob;
}

// 画像のダウンロード
function saveBlob(blob)
{
    var url = (window.URL || window.webkitURL);
    var dataUrl = url.createObjectURL(blob);
    var event = document.createEvent("MouseEvents");
    event.initMouseEvent("click", true, false, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
    // a要素を作成
    var a = document.createElementNS("http://www.w3.org/1999/xhtml", "a");
    a.href = dataUrl;
    a.download = saveFileName;
    a.dispatchEvent(event);
}

function imgClick(fileName) {
  image.src = "img/"+fileName+".png";
  saveFileName = fileName+".png";
}
