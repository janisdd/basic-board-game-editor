import {PlayerColorMap, RefereeHelper} from "./helpers/RefereeHelper";
import {Referee} from "./Referee";
import {ExportWorld} from "../src/types/world";
import {MigrationHelper} from "../src/helpers/MigrationHelpers";
import {WorldDrawer} from "./helpers/worldDrawer";
import {CvScalar, HomographyTuple, SyntheticImgTuple} from "./types";
import {Cvt} from "./helpers/Cvt";

declare var cv: any


//zuordnung farbe / player (1mal get token --> farben hsv, benutzer muss dann zuordnen)

let videoStarted = false
let video = document.getElementById('realImgSrc') as HTMLVideoElement
let canvasSnapshot = document.getElementById("canvasSnaptshot") as HTMLCanvasElement
let ctxSnapshot = canvasSnapshot.getContext('2d');

const worldCanvas = document.getElementById('world-renderer-canvas') as HTMLCanvasElement
let referee: Referee = new Referee()
let worldDrawer: WorldDrawer = new WorldDrawer()
let variablesTableWrapperDiv = document.getElementById('variables-table') as HTMLDivElement

let playerColorMappingTableWrapper = document.getElementById('player-color-mapping-table-wrapper') as HTMLDivElement

let debugSynImgsWrapper = document.getElementById('debug-syn-imgs-wrapper') as HTMLDivElement
const debugSynHomographiessWrapper = document.getElementById('debug-syn-homographies') as HTMLDivElement

const worldRealCanvas = document.getElementById('world-real-canvas') as HTMLCanvasElement

let synImgCanvases: SyntheticImgTuple[] = []
let homographies: HomographyTuple[] = [] //one for every img in synImgCanvases --> one for every tile


let lastDiceValue = 2

/**
 * call this to init video stream
 */
export function initVideo() {
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
      } as any,
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


/**
 * note that a world needs to be imported here (else we don't know the player count)
 */
export function onDetectColors() {
  const snapshot = getSnapshot()

  //if we don't do this we get wrong colors when we draw tokens?
  cv.cvtColor(snapshot, snapshot, cv.COLOR_BGRA2BGR);

  const tuple = referee.getTokens(snapshot)
  const tokens = tuple[0]
  const debugImgMat = tuple[1]

  cv.imshow(canvasSnapshot, debugImgMat)


  let html = `<table>
<thead>
<tr>
    <th>color</th>
    <th>player id/number</th>
</tr>
</thead>
<tbody>
`

  const initialMapping: PlayerColorMap = {}

  //start a temp simulation to get the player count...
  referee.startNewSimulation()

  const preState = referee.simulationMachineState

  const numPlayers = preState.players.length

  if (tokens.length !== numPlayers) {
    console.log(`we got ${numPlayers} players but ${tokens.length} token(s)...`)
  }

  const maxSV = 256 //max val for s / v


  for (let i = 0; i < numPlayers; i++) {

    const tokenColorHsv = i < tokens.length
      ? tokens[i].color
      : [0, 0, 0] as CvScalar

    const tokenColor = i < tokens.length
      ? tokens[i].colorRgb
      : [0, 0, 0] as CvScalar

    initialMapping[i] = [tokenColorHsv, tokenColor]

    // const percentageS = tokenColor[1] * 100 / maxSV
    // const percentageV = tokenColor[2] * 100 / maxSV

    html += `
    <tr>
        <td>
            <div class="player-color-indicator" style="background-color: rgb(${tokenColor[0]}, ${tokenColor[1]}, ${tokenColor[2]})"></div>
            <span>${tokenColor[0]}, ${tokenColor[1]}, ${tokenColor[2]} (${Cvt.rgbToHex(tokenColor[0], tokenColor[1], tokenColor[2])})</span>
        </td>
        <td>
            <input data-player-color-id="${i}" type="number" value="${i}" />
        </td>
    </tr>
    `
  }

  html += `
</tbody>
<tfoot>
<tr>
<td colspan="99">
    <button onclick="bbge.applyPlayerColorMapping()">apply mapping</button>
</td>
</tr>
</tfoot>
</table>
`

  playerColorMappingTableWrapper.innerHTML = html

  referee.playerColorMap = initialMapping

  debugImgMat.delete()
  snapshot.delete()
}

export function applyPlayerColorMapping() {


  const colorInputs = document.querySelectorAll(`[data-player-color-id]`)


  const keys = Object.keys(referee.playerColorMap)

  const newMap: PlayerColorMap = {}

  for (let i = 0; i < keys.length; i++) {
    const id = i //we assume index never changes

    const input = colorInputs.item(id) as HTMLInputElement

    const playerId = parseInt(input.value)

    if (isNaN(playerId) || playerId > keys.length - 1) throw new Error(`player id (${playerId}) is not a number or the id is larger than the player count - 1`)

    const oldPlayerIndex = parseInt(input.getAttribute('data-player-color-id'))

    if (isNaN(oldPlayerIndex)) throw new Error(`player id (${playerId}) old index was not a number (internal error)`)


    if (newMap[playerId]) throw new Error(`player id (${playerId}) was set multiple times`)

    newMap[playerId] = referee.playerColorMap[oldPlayerIndex]
  }

  console.log(newMap)

  referee.applyNewColorMapping(newMap)
  worldDrawer.drawWorld(worldCanvas,referee.world, referee.simulationMachineState)

}


export function getDiceValue(): number {

  const snapshot = getSnapshot()
  let lastDiceValue = 0

  try {
    let dice = referee.getDiceValue(snapshot)
    lastDiceValue = dice.value

    cv.imshow(canvasSnapshot, snapshot)

  } catch (err) {
    console.error(err)
  } finally {

    cv.imshow(canvasSnapshot, snapshot)
    snapshot.delete()
  }

  return lastDiceValue

}

export function onGetDice() {

  const diceValue = getDiceValue()
  lastDiceValue = diceValue

}

export function onNextRound() {

  referee.simulateNextRound(lastDiceValue)
  worldDrawer.drawWorld(worldCanvas,referee.world, referee.simulationMachineState)

  referee.updateVariablesTable(variablesTableWrapperDiv)

}


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

    referee.settWorld(exportedWorld)
    referee.startNewSimulation()

    worldDrawer.drawWorld(worldCanvas,exportedWorld, referee.simulationMachineState)
    referee.updateVariablesTable(variablesTableWrapperDiv)

    synImgCanvases = worldDrawer.getWorldSyntheticImgs(exportedWorld)
    worldDrawer.drawSyntheticImgs(debugSynImgsWrapper, synImgCanvases.map(p => p.canvas))

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
  initVideo()
}

export function onInitReferee() {
  referee.init()


  const test = getSnapshot()

  cv.imshow(canvasSnapshot, test)

  test.delete()
}


export function onGetHomography() {

  console.time('get homography')
  const snapshotWorld = getSnapshot()

  let synImgMats = synImgCanvases.map(p => cv.imread(p.canvas))

  homographies.forEach(p => {
    p.synToRealMat.delete()
    p.realToSynMat.delete()
    p.syntheticImgMat.delete()
  })
  homographies = []
  debugSynHomographiessWrapper.innerHTML = ""

  for (let i = 0; i < synImgMats.length; i++) {

    const synImgMat = synImgMats[i]
    const tuple = synImgCanvases[i]

    let homography_real_to_synth = new cv.Mat()
    let homography_synth_to_real = new cv.Mat()

    //
    let debugImg = referee.worldHelper.getWorldHomography(synImgMat, snapshotWorld, homography_real_to_synth, homography_synth_to_real);

    debugImg.delete()

    let copy = snapshotWorld.clone()

    let worldCorners = referee.worldHelper.drawWorldRect(synImgMat, copy, homography_synth_to_real);
    console.log(worldCorners)

    homographies.push({
      realToSynMat: homography_real_to_synth,
      synToRealMat: homography_synth_to_real,
      tile: tuple.tile,
      syntheticImgMat: synImgMat,
      tileRect: Cvt.convertRect(worldCorners)
    })


    const canvas = document.createElement('canvas')

    debugSynHomographiessWrapper.appendChild(canvas)

    cv.imshow(canvas, copy)

    copy.delete()

  }


  snapshotWorld.delete()
  console.timeEnd('get homography')

}


export function drawRealWorldPlain() {

  worldDrawer.drawWorld(worldRealCanvas, referee.world, referee.simulationMachineState)
  // referee.updateVariablesTable(variablesTableWrapperDiv)

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



