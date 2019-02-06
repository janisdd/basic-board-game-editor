import {PlayerColorMap, RefereeHelper} from "./helpers/RefereeHelper";
import {Referee} from "./Referee";
import {ExportWorld} from "../src/types/world";
import {MigrationHelper} from "../src/helpers/MigrationHelpers";
import {WorldDrawer} from "./helpers/worldDrawer";
import {
  CvRealMachineState,
  CvRect,
  CvScalar, CvToken,
  HomographyTuple,
  HomographyVarIndicatorTuple,
  SyntheticImgTuple, SyntheticVarTuple,
  TokenPosition
} from "./types";
import {Cvt} from "./helpers/Cvt";
import {Simulator} from "../simulation/simulator";
import {
  DefinitionTableBoolEntry,
  DefinitionTableIntEntry,
  isBoolVar,
  isIntVar,
  MachineState
} from "../simulation/machine/machineState";

declare var cv: any


//zuordnung farbe / player (1mal get token --> farben hsv, benutzer muss dann zuordnen)

declare var videoStarted: boolean
declare var video: HTMLVideoElement

const trackGlobalVarsCb = document.getElementById('track-global-vars-cb') as HTMLInputElement
let trackGlobalVars = true

let canvasSnapshot = document.getElementById("canvasSnaptshot") as HTMLCanvasElement
let ctxSnapshot = canvasSnapshot.getContext('2d');

const worldCanvas = document.getElementById('world-renderer-canvas') as HTMLCanvasElement
let referee: Referee = new Referee()
let worldDrawer: WorldDrawer = new WorldDrawer()
let variablesTableWrapperDiv = document.getElementById('variables-table') as HTMLDivElement

let variablesTableRealWrapperDiv = document.getElementById('variables-table-real') as HTMLDivElement

let playerColorMappingTableWrapper = document.getElementById('player-color-mapping-table-wrapper') as HTMLDivElement

let debugSynImgsWrapper = document.getElementById('debug-syn-imgs-wrapper') as HTMLDivElement

//a read img with the rect of the synthetic img we found
const debugSynHomographiessWrapper = document.getElementById('debug-syn-homographies') as HTMLDivElement
const debugSynHomographyGlobalVarssWrapper = document.getElementById('debug-syn-homographies-global-vars') as HTMLDivElement


const worldRealCanvas = document.getElementById('world-real-canvas') as HTMLCanvasElement

let synImgCanvases: SyntheticImgTuple[] = [] //one for every tile in the world
let homographies: HomographyTuple[] = [] //one for every img in synImgCanvases --> one for every tile


let synGlobalVarIndicatorImgCanvases: SyntheticVarTuple[] = [] //one for every global var in the world
let homographyGlobalVarIndicators: HomographyVarIndicatorTuple[] = [] //one for every in synVarIndicatorImgCanvases


let realSimulationState: MachineState = null
let realSimulationStateCv: CvRealMachineState =  null
const refereeHelper = new RefereeHelper()

let lastDiceValue = 2

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
    console.log(`set the player id of tokens with invalid colors to -1`)
  }

  const maxSV = 256 //max val for s / v


  for (let i = 0; i < tokens.length; i++) {

    const tokenColorHsv = tokens[i].color

    const tokenColor = tokens[i].colorRgb

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

    if (playerId === -1) {
      //invalid ... user want's to delete
      continue
    }

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

  referee.updateVariablesTable(variablesTableWrapperDiv, referee.simulationMachineState.globalDefTable)

}


export async function onWorldInputChanged(e: any) {

  const files = e.currentTarget.files
  if (!files) return

  const file = files[0]

  const fileReader = new FileReader()

  fileReader.onprogress = ev => {
    console.log(ev.loaded + '/' + ev.total)
  }

  fileReader.onload = async (ev) => {
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
    referee.updateVariablesTable(variablesTableWrapperDiv, referee.simulationMachineState.globalDefTable)

    //get the synthetic imgs
    synImgCanvases = worldDrawer.getWorldSyntheticImgs(exportedWorld)

    synGlobalVarIndicatorImgCanvases = []
    if (trackGlobalVars) {
      synGlobalVarIndicatorImgCanvases = await worldDrawer.getGlobalVarIndicators(exportedWorld, referee)
    }


    //append to document
    worldDrawer.drawSyntheticImgs(debugSynImgsWrapper,
      synImgCanvases.map(p => p.canvas),
      synGlobalVarIndicatorImgCanvases.map(p => p.canvas)
    )


  }

  fileReader.onerror = ev => {
    throw ev
  }

  fileReader.readAsText(file)
}


export function onInitReferee() {
  referee.init()

  trackGlobalVars = trackGlobalVarsCb.checked
  console.log(`track global vars ? ${trackGlobalVars}`)

  const test = getSnapshot()

  cv.imshow(canvasSnapshot, test)

  test.delete()
}


export function onGetHomography() {

  console.log('started get homography')
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

    const _color: CvScalar = [255,0,0,255] //red, for some reason we need alpha
    let worldCorners = referee.worldHelper.drawWorldRect(synImgMat, copy, homography_synth_to_real, _color);
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


export function onGetGLobalVarIndicatorHomographies() {

  if (!trackGlobalVars) return

  console.log('started get homography for global vars')

  console.time('get homography global vars')
  const snapshotWorld = getSnapshot()

  let synImgMats = synGlobalVarIndicatorImgCanvases.map(p => cv.imread(p.canvas))

  homographyGlobalVarIndicators.forEach(p => {
    p.synToRealMat.delete()
    p.realToSynMat.delete()
    p.syntheticImgMat.delete()
  })

  homographyGlobalVarIndicators = []
  debugSynHomographyGlobalVarssWrapper.innerHTML = ""

  for (let i = 0; i < synImgMats.length; i++) {

    const synImgMat = synImgMats[i]
    const tuple = synGlobalVarIndicatorImgCanvases[i]

    let homography_real_to_synth = new cv.Mat()
    let homography_synth_to_real = new cv.Mat()

    //
    let debugImg = referee.worldHelper.getWorldHomography(synImgMat, snapshotWorld, homography_real_to_synth, homography_synth_to_real);

    debugImg.delete()

    //the qr code is actually not really (the information from it) needed because keypoint detectr finds the right var indicator...
    //but the qr code makes a unique (mostly) pattern (for that var) so maybe this is good for keypoint detection?
    //TODO read qr code to get var information (e.g. needed when we have multiple?)

    let copy = snapshotWorld.clone()

    const _color: CvScalar = [255,0,0,255] //red, for some reason we need alpha
    let worldCorners = referee.worldHelper.drawWorldRect(synImgMat, copy, homography_synth_to_real, _color);
    console.log(worldCorners)

    homographyGlobalVarIndicators.push({
      realToSynMat: homography_real_to_synth,
      synToRealMat: homography_synth_to_real,
      entry: tuple.entry,
      syntheticImgMat: synImgMat,
      indicatorRect: Cvt.convertRect(worldCorners)
    })


    const canvas = document.createElement('canvas')

    debugSynHomographyGlobalVarssWrapper.appendChild(canvas)

    cv.imshow(canvas, copy)

    copy.delete()

  }


  snapshotWorld.delete()
  console.timeEnd('get homography global vars')
}

export function drawRealWorldPlain() {

  worldDrawer.drawWorld(worldRealCanvas, referee.world, referee.simulationMachineState)
  // referee.updateVariablesTable(variablesTableWrapperDiv)

}

export function drawTileFieldsOnRealImg(tuple: HomographyTuple, targetMat: any, maxDiffInPx: number = 0)  {

  for (const fieldShape of tuple.tile.fieldShapes) {

    const fieldRect: CvRect = {
      x: fieldShape.x - maxDiffInPx,
      y: fieldShape.y - maxDiffInPx,
      width: fieldShape.width + maxDiffInPx*2,
      height: fieldShape.height + maxDiffInPx*2
    }

    const fieldPos = referee.worldHelper.perspectiveTransformRect(fieldRect, tuple.synToRealMat)

    //draw

    const _color: CvScalar = [0,0,255,0] //blue
    referee.worldHelper.drawRect(fieldPos, targetMat, _color)
  }
}

//we assume homographies are already set here
//get the tokens, clip them on the tiles (outside of tiles is not drawn?), draw tokens on debug synthetic real field
//does not refreshs the dice value
export async function onGetRealState()  {

  //clear
  drawRealWorldPlain()

  //then get & draw tokens
  const snapshot = getSnapshot()



  //if we don't do this we get wrong colors when we draw tokens?
  cv.cvtColor(snapshot, snapshot, cv.COLOR_BGRA2BGR);

  const tuple = referee.getTokens(snapshot)
  const tokens = tuple[0]
  const debugImgMat = tuple[1]
  const maxDiffInPx = 10

  cv.imshow(canvasSnapshot, debugImgMat)


  //refresh single synthetic imgs
  debugSynImgsWrapper.innerHTML = ""

  synImgCanvases = worldDrawer.getWorldSyntheticImgs(referee.world)

  synGlobalVarIndicatorImgCanvases = []
  if (trackGlobalVars) {
    synGlobalVarIndicatorImgCanvases = await worldDrawer.getGlobalVarIndicators(referee.world, referee)
  }

  worldDrawer.drawSyntheticImgs(debugSynImgsWrapper,
    synImgCanvases.map(p => p.canvas),
    synGlobalVarIndicatorImgCanvases.map(p => p.canvas)
  )

  const _color: CvScalar = [200,100,10,255] //orange

  for(let i = 0; i < homographies.length;i++) {
    const homography = homographies[i]

    let worldCornersVec = referee.worldHelper.drawWorldRect(homography.syntheticImgMat, debugImgMat, homography.synToRealMat, _color);
    console.log(worldCornersVec)

    // const tileRect = Cvt.convertRect(worldCornersVec)

    drawTileFieldsOnRealImg(homography, debugImgMat, maxDiffInPx)

    //also draw the tokens on the synthetic single imgs (the real pos we got, not snapped to a field)

    const synImgCanvas = synImgCanvases[i]
    const synImgMat = cv.imread(synImgCanvas.canvas)

    //then draw tokens on this tile (on the synthetic img)

    for(const token of tokens) {
      if (refereeHelper.isTokenInRect(token, homography.tileRect, maxDiffInPx) === false) continue
      const tokenPos: CvRect = referee.worldHelper.perspectiveTransformRect(token.bbox, homography.realToSynMat)
      const _color: CvScalar = [255,0,0,255] //red for some reason we need alpha
      referee.worldHelper.drawRect(tokenPos, synImgMat, _color)
    }

    cv.imshow(synImgCanvas.canvas, synImgMat)

    cv.imshow(canvasSnapshot, debugImgMat)
    synImgMat.delete()
  }

  const colorMapKeys = Object.keys(referee.playerColorMap)

  if (colorMapKeys.length === 0) {
    console.log(`we have currently no color map, player ids will be random (order or discovery), detect colros first`)
  }

  let tokenPositions: TokenPosition[] = []
  for(const homography of homographies) {

    const pos = refereeHelper.getTokenPositionsFromTile(tokens, homography.tileRect, homography.tile, referee.playerColorMap,
      homography.synToRealMat, referee.worldHelper,  false, maxDiffInPx)
      console.log(`tokens on tile ${homography.tile.guid}`, pos)
      tokenPositions = tokenPositions.concat(pos)
  }

  //discard unknown tokens
  const temp_tokenPositions = tokenPositions.filter(p => p.playerId === null)

  if (temp_tokenPositions.length > 0) {
    console.log(`found ${temp_tokenPositions.length} tokens on tiles that doesn't match any players color, discarding`)
    tokenPositions = tokenPositions.filter(p => p.playerId !== null)
  }


  //set the token positions in the real synthetic img...
  //for debug we set the player id random...
  let tokenCount = 0

  let tempMachineState = Simulator.initNew(referee.startPos, true, referee.world.worldSettings.worldCmdText)

  tempMachineState = {
    ...tempMachineState,
    players: tempMachineState.players.map(player => {
      return {
        ...player,
        tokens: player.tokens.map(p => {

          if (tokenCount >= tokenPositions.length) return p

          const count = tokenCount++

          let color = p.color

          if (tokenPositions[count].playerId !== null) {

            let tempColor = referee.playerColorMap[tokenPositions[count].playerId]
            if (tempColor) {
              const rgb = tempColor[1]
              color = Cvt.rgbToHex(rgb[0], rgb[1], rgb[2])
            }
            else {
              console.log(`token on tile (${p.tileGuid}), field id (${p.fieldId}) has known color but not found in color map`)
            }

          } else {
            console.log(`token on tile (${p.tileGuid}), field id (${p.fieldId}) has no playerId (or unknown color), using default`)
          }

          return {
            ...p,
            tileGuid: tokenPositions[count].tileGuid,
            fieldId:tokenPositions[count].fieldId,
            color
          }
        })
      }
    })
  }

  if (trackGlobalVars) {
    tempMachineState = _getGlobalVarIndicators(snapshot, tokens, debugImgMat, maxDiffInPx, tempMachineState)
  }


  realSimulationState = tempMachineState

  realSimulationStateCv = {
    globalDefTable:tempMachineState.globalDefTable,
    tokenPositions: tokenPositions,
    players: tempMachineState.players,
    rolledDiceValue: lastDiceValue
  }

  referee.updateVariablesTable(variablesTableRealWrapperDiv, realSimulationStateCv.globalDefTable)

  console.log(realSimulationStateCv)

  worldDrawer.drawWorld(worldRealCanvas, referee.world, tempMachineState)

  debugImgMat.delete()
  snapshot.delete()

}

//returns [new state, debugImgMat]
function _getGlobalVarIndicators(snapshotMat: any, tokens: CvToken[], debugImgMat: any, maxDiffInPx: number, machineState: MachineState): MachineState {

  const _color2: CvScalar = [200,100,10,255] //orange

  for(let i = 0; i < homographyGlobalVarIndicators.length;i++) {
    const homography = homographyGlobalVarIndicators[i]

    let worldCornersVec = referee.worldHelper.drawWorldRect(homography.syntheticImgMat, debugImgMat, homography.synToRealMat, _color2);
    cv.imshow(canvasSnapshot, debugImgMat)

    let numFields = 1
    let entry = homography.entry

    if (isBoolVar(homography.entry)) {
        numFields = 2
    } else if (isIntVar(homography.entry)) {
      numFields = homography.entry.maxVal*2+1
    }

    const indicatorSynRect: CvRect = {
      x: 0,
      y: 0,
      width: homography.syntheticImgMat.cols,
      height: homography.syntheticImgMat.rows
    }


    const position = refereeHelper.getVarValuesFromIndicator(tokens, entry.ident, numFields, indicatorSynRect, homography.indicatorRect, referee.playerColorMap, homography.realToSynMat, referee.worldHelper, false, maxDiffInPx)

    if (position === null) continue

    //draw positions on indicator
    const synGlobalVarIndicatorImgCanvas = synGlobalVarIndicatorImgCanvases[i]


    const synImgMat = cv.imread(synGlobalVarIndicatorImgCanvas.canvas)
    const _color: CvScalar = [255,0,0,255] //red for some reason we need alpha


    for(const token of tokens) {
      if (refereeHelper.isTokenInRect(token, homography.indicatorRect, maxDiffInPx) === false) continue

      const tokenPos: CvRect = referee.worldHelper.perspectiveTransformRect(token.bbox, homography.realToSynMat)

      referee.worldHelper.drawRect(tokenPos, synImgMat, _color)

      cv.imshow(synGlobalVarIndicatorImgCanvas.canvas, synImgMat)
    }

    if (isBoolVar(entry)) {
      machineState = {
        ...machineState,
        globalDefTable: {
          ...machineState.globalDefTable,
          [entry.ident]: {
            ...entry,
            boolVal: position.value === 0 ? false : true
          } as DefinitionTableBoolEntry
        }
      }
    }
    else if (isIntVar(entry)) {
      machineState = {
        ...machineState,
        globalDefTable: {
          ...machineState.globalDefTable,
          [entry.ident]: {
            ...entry,
            val: position.value //TOOD maybe make sure we are in the bounds of maxVal??
          } as DefinitionTableIntEntry
        }
      }
    }

    synImgMat.delete()
  }

  return machineState
}


export function onCompareStatesClicked()  {

  if (!referee.simulationMachineState) {
    console.log(`simulation state was null`)
  }

  if (!realSimulationState) {
    console.log(`get the real state first`)
  }

  const checkGlobalVars = trackGlobalVars
  const checkPlayerVars = false

  const res = refereeHelper.compareStates(referee.simulationMachineState, realSimulationStateCv, checkGlobalVars, checkPlayerVars)


  if (res === null) {
    //all ok
    alert(`all ok! [equal (checkGlobalVars: ${checkGlobalVars}, checkPlayerVars: ${checkPlayerVars})]`)
  } else {
    const error = res[0]
    alert(`something is wrong... [${error}]`)
  }


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



