import {RefereeHelper} from "./helpers/RefereeHelper";
import {Referee} from "./Referee";
import {ExportWorld} from "../src/types/world";
import {MigrationHelper} from "../src/helpers/MigrationHelpers";
import {WorldDrawer} from "./helpers/worldDrawer";

declare var cv: any


let videoStarted = false
let video = document.getElementById('realImgSrc') as HTMLVideoElement
let canvasSnapshot = document.getElementById("canvasSnaptshot") as HTMLCanvasElement
let ctxSnapshot = canvasSnapshot.getContext('2d');

const worldCanvas = document.getElementById('world-renderer-canvas') as HTMLCanvasElement
let referee: Referee = new Referee()
let worldDrawer: WorldDrawer = new WorldDrawer()

/**
 * call this to init video stream
 */
export function init() {
  if (!videoStarted) {
    navigator.mediaDevices.getUserMedia({video: true, audio: false})
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

/**
 * returns img as mat
 */
export function getSnapshot(): any {

  if (!videoStarted) {
    return
  }

  ctxSnapshot.drawImage(video, 0, 0, canvasSnapshot.width, canvasSnapshot.height);
  return cv.matFromImageData(ctxSnapshot.getImageData(0, 0, canvasSnapshot.width, canvasSnapshot.height))
}


// export function getDices() {
//
//   const img = getSnapshot()
//
//   const copy = img.clone()
//
//   const dices = Referee.getDiceValue(copy)
//
//   if (dices.length > 1) {
//     console.warn(`we got more than 1 dice... using first`)
//   }
//
//   cv.imshow(canvas, copy)
//
//   img.delete()
//   copy.delete()
// }

export function onWorldInputChanged(e: any) {

  const files = e.currentTarget.files
  if (!files) return

  const file = files[0]

  const fileReader = new FileReader()

  fileReader.onprogress = ev => {
    console.log(ev.loaded + '/' + ev.total)
  }

  fileReader.onload = ev => {
    const json = fileReader.result as string

    let exportedWorld: ExportWorld | null = JSON.parse(json)

    //maybe we need to migrate...
    exportedWorld = MigrationHelper.applyMigrationsToWorld(exportedWorld)

    if (exportedWorld === null) {
      //error is already displayed in MigrationHelper.applyMigrationsToTile
      return
    }

    referee.importWorld(exportedWorld)

    worldDrawer.drawWorld(exportedWorld, null)

  }

  fileReader.onerror = ev => {
    throw ev
  }

  fileReader.readAsText(file)

}





/**
 * called when opencv js is loaded (mostly)
 */
export function onOpenCvReady() {
  console.log('ready, initing...')
  init()
}

export function initReferee()  {
  referee.init()

  worldDrawer.init(worldCanvas)

  const test = getSnapshot()

  cv.imshow(canvasSnapshot, test)

  test.delete()
}


// let streaming = true
// export function stop() {
//     streaming = false
// }
//
// export function go()  {
//
//
//     let video = document.getElementById('realImgSrc') as HTMLVideoElement
//
//     navigator.mediaDevices.getUserMedia({ video: true, audio: false })
//       .then(function(stream) {
//           video.srcObject = stream;
//           video.play();
//       })
//       .catch(function(err) {
//           console.log("An error occurred! " + err);
//       });
//
//     // @ts-ignore
//     let src = new cv.Mat(video.height, video.width, cv.CV_8UC4);
//     // @ts-ignore
//     let dst = new cv.Mat(video.height, video.width, cv.CV_8UC1);
//     let cap = new cv.VideoCapture(video);
//
//     const FPS = 30;
//     function processVideo() {
//         try {
//             if (!streaming) {
//                 // clean and stop.
//                 src.delete();
//                 dst.delete();
//                 return;
//             }
//             let begin = Date.now();
//             // start processing.
//             cap.read(src);
//             cv.cvtColor(src, dst, cv.COLOR_RGBA2GRAY);
//             cv.imshow('canvasOutput', dst);
//             // schedule the next one.
//             let delay = 1000/FPS - (Date.now() - begin);
//             setTimeout(processVideo, delay);
//         } catch (err) {
//             console.error(err)
//         }
//     };
//
// // schedule the first one.
//     setTimeout(processVideo, 0);
//
// }



