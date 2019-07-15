import {MachineState, PlayerToken, WorldTileSurrogate} from "../../simulation/machine/machineState";
import {Tile} from "../types/world";
import {FieldShape, FieldSymbol, ImgSymbol, LineSymbol, PlainPoint} from "../types/drawing";
import {WorldSettings} from "../state/reducers/world/worldSettings/worldSettingsReducer";
import {WorldUnitToImgHelper} from "./worldUnitToImgHelper";
import {Logger} from "./logger";
import {aFrameFrameWrapperId, worldRendererCanvasId} from "../constants";


//hero marker: https://stemkoski.github.io/AR-Examples/markers/hiro.png
const isArJsEnabled = true

// const tileSize = isArJsEnabled ? 1 : 10
// const gameTokenSize = isArJsEnabled ? 0.05 : 1

//for isArJsEnabled: size is relative to the marker size...
const tileSize = isArJsEnabled ? 1 : 10
const gameTokenSize = isArJsEnabled ? 0.05 : 0.5

//see https://github.com/jeromeetienne/AR.js-docs/blob/master/posts/post-XX-how-to-use-arjs-with-aframe.md


/**
 * because the ar scene is in an iframe we need to communicate with postMessage
 * this is the message obj we send
 */
export interface PlayerPosUpdate {
  kind: 'playerPosUpdate'
  positions: (PlainPoint)[]
  gameTokenSize: number
  rolledDiceValue: number
  leftDiveValue: number
  activePlayerIndex: number
  diceValueTextOffsetX: number
  diceValueTextOffsetY: number
}

/**
 * ar helper to setup and interact with ar iframe
 *
 * we use ar with ar.js with uses a-frame to display the scene
 * we host the whole scene in an iframe
 */
export class ArHelper {
  private constructor() {
  }

  static readonly iFrameAFrameId = 'aframe-frame'

  /**
   *
   * @param show true: show the iframe wrapper, false: show world renderer
   */
  static showAFrame(show: boolean) {

    const aFrameWrapper = document.getElementById(aFrameFrameWrapperId)
    const worldRendererCanvas = document.getElementById(worldRendererCanvasId)

    worldRendererCanvas.style.display = show ? 'none' : 'block'
    aFrameWrapper.style.display = show ? 'block' : 'none'

  }


  /**
   * this clears and fills the iframe with the ar scene
   * @param tileSurrogatesState
   * @param allTiles
   * @param fieldSymbols
   * @param imgSymbols
   * @param lineSymbols
   * @param worldSettings
   * @param isArJsEnabled true: to use ar.js (with camera and hero marker),
   *   false: only render a normal aframe scene (wasd movement is enabled)
   * @param tileBackgroundColor
   * @param state
   */
  static initAFrame(tileSurrogatesState: ReadonlyArray<WorldTileSurrogate>,
                    allTiles: ReadonlyArray<Tile>,
                    fieldSymbols: ReadonlyArray<FieldSymbol>,
                    imgSymbols: ReadonlyArray<ImgSymbol>,
                    lineSymbols: ReadonlyArray<LineSymbol>,
                    worldSettings: WorldSettings,
                    isArJsEnabled: boolean,
                    tileBackgroundColor: string | null = '#5d5d5d',
                    state?: MachineState,
  ): void {


    Logger.log('starting a-frame iFrame')

    const aFrameWrapper = document.getElementById(aFrameFrameWrapperId)

    aFrameWrapper.innerHTML = `<iframe id="${this.iFrameAFrameId}" class="fh fw" src="about:blank"></iframe>`

    const tileImgs: string[] = []

    const canvas = document.createElement('canvas')

    //convert tiles to images
    for (let i = 0; i < tileSurrogatesState.length; i++) {
      const tileSurrogate = tileSurrogatesState[i];

      let resultCanvas = WorldUnitToImgHelper.tileByGuidToImg(tileSurrogate.tileGuid,
        allTiles,
        fieldSymbols,
        imgSymbols,
        lineSymbols,
        {
          ...worldSettings,
          printAndExportScale: 2
        },
        canvas,
        tileBackgroundColor
      )

      tileImgs.push(resultCanvas.toDataURL())
    }

    const aFrameHtml = this.createAFrameScene(tileSurrogatesState, allTiles, tileImgs, isArJsEnabled,  state)

    // console.log(aFrameHtml)

    const aFrame = document.querySelector(`#${this.iFrameAFrameId}`) as HTMLIFrameElement

    aFrame.contentWindow.document.write(aFrameHtml)
    aFrame.contentWindow.document.close()
  }


  /**
   * creates the initial aframe scene as html
   *
   * what this basically does:
   *
   * create a plane for every tile
   * use the tile images as texture (material)
   * then place simple box elements as player tokens
   * display text as dice value at the players coords
   *
   * @param tileSurrogates
   * @param tiles
   * @param tileImgs
   * @param isArJsEnabled true: to use ar.js (with camera and hero marker),
   *   false: only render a normal aframe scene (wasd movement is enabled)
   * @param state
   */
  static createAFrameScene(tileSurrogates: ReadonlyArray<WorldTileSurrogate>, tiles: ReadonlyArray<Tile>, tileImgs: string[], isArJsEnabled: boolean, state?: MachineState): string {


    Logger.log('disabled adblocker else ar.js could be blocked!')
    Logger.log('disabled adblocker else ar.js could be blocked!')
    Logger.log('disabled adblocker else ar.js could be blocked!')

    const backgroundImgNames = 'plane'

    const backgroundImgsString = tileImgs.map((p, index) => `<img id="${backgroundImgNames}-${index}" src="${p}">`)

    let field: FieldShape
    let pos: PlainPoint

    const tilePlanesString = tileSurrogates.map((p, index) => {

      const tile = tiles.find(k => k.guid === p.tileGuid)

      if (!field) {
        field = tile.fieldShapes[0]
        pos = this.mapTileFieldPosToAFramePos(field, p, tile, tileSize)
        // console.log(pos)
      }

      return `<a-plane src="#${backgroundImgNames}-${index}" width="${tileSize}" height="${tileSize}" rotation="-90 0 0" position="${p.x * tileSize} 0 ${p.y * tileSize}"></a-plane>`
    })

    const playerTokens: PlayerToken[] = state
      ? state.players.map<PlayerToken>(p => {
        const token = p.tokens[0]
        return token
      })
      : []

    // console.log(playerTokens)

    const playerAFrame = playerTokens.map((p, index) => ` <a-box id="player-token-${index}" color="${p.color}" depth="${gameTokenSize}" height="${gameTokenSize}" width="${gameTokenSize}" position="${pos.x} ${gameTokenSize / 2} ${pos.y}"></a-box>`)

    const aFrameTemplate = `
<html>
  <head>
    <script src="https://aframe.io/releases/0.9.2/aframe.min.js"></script>
    ${isArJsEnabled ? '<script src="https://jeromeetienne.github.io/AR.js/aframe/build/aframe-ar.js"></script>' : ''}
  </head>
  <body>
    <a-scene embedded arjs>
    
    <a-asset>
        ${backgroundImgsString.join('\n')}
    </a-asset>
    
    ${isArJsEnabled ? '' : '<a-sky color="blue"></a-sky>'}
      
      ${tilePlanesString.join('\n')}            
      
      ${playerAFrame.join('\n')}
      
     <a-entity id="dice-value" text="align: center; color: #ff85ff; width: ${tileSize}; value: Hello World;" rotation="-45 0 0" position="${-tileSize / 2} ${gameTokenSize} ${-tileSize / 2}"></a-entity>
      
      
      ${isArJsEnabled ? '' : '<a-entity id="cam" camera wasd-controls rotation="-90 0 0" position="0 10 0"></a-entity>'}

    <!-- define a camera which will move according to the marker position -->
    ${isArJsEnabled ? "<a-marker-camera preset='hiro'></a-marker-camera>" : ''}


<a-entity text="align: center; color: #ff85ff; width: ${tileSize}; value: press ctrl+alt+i to inspect scene;" rotation="-45 0 0" position="${-tileSize / 2} ${gameTokenSize} ${-tileSize / 2}"></a-entity>

    </a-scene>
    
    
    <script src="iFrameAFrameHandler.js">
    </script>
    
    <!-- from https://stackoverflow.com/questions/44459356/a-frame-zoom-on-wheel-scroll --> 
    <script>
    window.addEventListener("wheel", event => {
    const delta = Math.sign(event.wheelDelta);
    //getting the mouse wheel change (120 or -120 and normalizing it to 1 or -1)
    var mycam=document.getElementById('cam').getAttribute('camera');
    var finalZoom=document.getElementById('cam').getAttribute('camera').zoom+delta;
    //limiting the zoom so it doesnt zoom too much in or out
    if(finalZoom<1)
      finalZoom=1;
    if(finalZoom>5)
      finalZoom=5;  

    mycam.zoom=finalZoom;
    //setting the camera element
    document.getElementById('cam').setAttribute('camera',mycam);
  });
</script>
  </body>
</html>
`

    return aFrameTemplate
  }


  /**
   * maps field coordinates to aframe coordinates
   * @param field
   * @param tileSurrogate
   * @param tile
   * @param tileSizeInAFrame
   */
  static mapTileFieldPosToAFramePos(field: FieldShape, tileSurrogate: WorldTileSurrogate, tile: Tile, tileSizeInAFrame: number): PlainPoint {

    return this.mapTilePosToAFramePos({x: field.x, y: field.y}, tileSurrogate, tile, tileSizeInAFrame)
  }


  /**
   * maps coordinates to aframe coordinates
   * @param pos
   * @param tileSurrogate
   * @param tile
   * @param tileSizeInAFrame
   */
  static mapTilePosToAFramePos(pos: PlainPoint, tileSurrogate: WorldTileSurrogate, tile: Tile, tileSizeInAFrame: number): PlainPoint {

    const offsetX = tileSurrogate.x * tileSizeInAFrame
    const offsetY = tileSurrogate.y * tileSizeInAFrame

    /*

    tile.tileSettings.width     tileSizeInAFrame
    -----------------------  =  ----------------
    100%                        100%

     tile.tileSettings.width     field.x
     -----------------------  = ------------
     tileSizeInAFrame           ? (AFrame x)
    */

    const aFrameX = pos.x * tileSizeInAFrame / tile.tileSettings.width
    const aFrameY = pos.y * tileSizeInAFrame / tile.tileSettings.height

    //aframe coords start from the center...

    return {
      x: offsetX + aFrameX - (tileSizeInAFrame / 2),
      y: offsetY + aFrameY - (tileSizeInAFrame / 2)
    }
  }


  /**
   * returns the player (first) token positions in the given state relative to the given tile size
   * @param gameState
   * @param tileSurrogates
   * @param allTile
   * @param tileSizeInAFrame
   */
  static getPlayerTokenPositionsFromState(gameState: MachineState, tileSurrogates: ReadonlyArray<WorldTileSurrogate>, allTile: ReadonlyArray<Tile>, tileSizeInAFrame: number): PlainPoint[] {

    return gameState.players.map<PlainPoint>((player, index) => {
      const token = player.tokens[0]

      //if to tokens are on the same field...
      const tokenInternalPlayerOffsetY = ((index + 1) * (gameTokenSize / 2))
      const tokenInternalPlayerOffsetX = ((index) * (gameTokenSize / 2))

      if (!token.tileGuid || !token.fieldId) {
        return this.mapTilePosToAFramePos({//don't use 0,0 because we multiply with this
          x: 1 + tokenInternalPlayerOffsetY,
          y: 1 + tokenInternalPlayerOffsetY
        }, {
          x: 0,
          y: 0,
        } as WorldTileSurrogate, {
          tileSettings: {
            width: 500,
            height: 500
          }
        } as Tile, tileSizeInAFrame)
      }

      const tileSurrogate = tileSurrogates.find(p => p.tileGuid === token.tileGuid)

      const tile = allTile.find(p => p.guid === token.tileGuid)

      const field = tile.fieldShapes.find(p => p.id === token.fieldId)

      // console.log('player - ' + index)
      // console.log(`${field.x}, ${field.y}`)

      const pos = this.mapTileFieldPosToAFramePos(field, tileSurrogate, tile, tileSizeInAFrame)

      return {
        ...pos,
        x: pos.x + tokenInternalPlayerOffsetY,
        y: pos.y + tokenInternalPlayerOffsetY,
      }
    })

  }


  /**
   * updates the iframe a frame secne with the game state player (first) tokeb positions and dice value
   * @param gameState
   * @param tileSurrogates
   * @param allTile
   * @param tileSizeInAFrame
   */
  static sendIframeAFrameNewState(gameState: MachineState, tileSurrogates: ReadonlyArray<WorldTileSurrogate>, allTile: ReadonlyArray<Tile>, tileSizeInAFrame: number = tileSize) {

    const aFrame = document.getElementById(`${this.iFrameAFrameId}`) as HTMLIFrameElement

    // console.log('update player pos')

    const tokenPositions = this.getPlayerTokenPositionsFromState(gameState, tileSurrogates, allTile, tileSizeInAFrame)

    const palyerPosUpdateMsg: PlayerPosUpdate = {
      kind: "playerPosUpdate",
      positions: tokenPositions,
      gameTokenSize,
      rolledDiceValue: gameState.rolledDiceValue,
      leftDiveValue: gameState.leftDiceValue,
      activePlayerIndex: gameState.currentPlayerIndex,
      diceValueTextOffsetY: gameTokenSize,
      diceValueTextOffsetX: gameTokenSize
    }

    aFrame.contentWindow.postMessage(JSON.stringify(palyerPosUpdateMsg), "*")
  }


}