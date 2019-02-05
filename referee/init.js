var videoStarted = false
var video = document.getElementById('realImgSrc')


/**
 * call this to init video stream
 */
function initVideo() {
  if (!videoStarted) {
    navigator.mediaDevices.getUserMedia({
      video: {
        // width: 1280,
        // height: 720
        width: {
          exact: 1920
        },
        height: {
          exact: 1080
        }
      },
      audio: false
    })
      .then(function (stream) {
        video.srcObject = stream
        video.play()
        videoStarted = true
      })
      .catch(function (err) {
        console.log("An error occurred! " + err)
      });
  }
}

// video.onloadedmetadata = function ()  {
//   console.log(`actual video2: width: ${video.videoWidth}, height: ${video.videoHeight}`)
// }

function onOpenCvReady() {
  console.log('ready, initing...')
  initVideo()
}
