import * as React from "react";
import {SyntheticEvent} from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {
  exportPngImagesBgColor,
  fontAwesomeRegularIconsFontFileLink,
  fontAwesomeSolidIconsFontFileLink,
  printVariableIndicatorStrokeThickness,
  worldFileExtensionWithoutDot
} from "../../constants";
import {Button, Icon} from "semantic-ui-react";
import {
  set_world_isImageLibraryDisplayed,
  set_world_isTileEditorDisplayed,
  set_world_isTileLibraryModalDisplayed
} from "../../state/reducers/world/actions";
import {set_app_activeTabIndex} from "../../state/reducers/actions";
import {set_editor_isCreatingNewTile} from "../../state/reducers/tileEditor/actions";
import {Tile} from "../../types/world";
import {IoHelper} from "../../helpers/ioHelper";
import ControlSimulationBar from '../tiles/controlSimulationBar'
import {Logger} from "../../helpers/logger";
import ToolTip from '../helpers/ToolTip'
import {getI18n} from "../../../i18n/i18nRoot";
import {PrintHelper} from "../../helpers/printHelper";
import {world_tileSurrogates_redo, world_tileSurrogates_undo} from "../../state/reducers/world/tileSurrogates/actions";
import {AvailableAppTabs} from "../../state/reducers/appReducer";
import {Simulator} from "../../../simulation/simulator";
import {WorldTilesHelper} from "../../helpers/worldTilesHelper";
import {set_tileLibrary_possibleTiles} from "../../state/reducers/world/tileLibrary/actions";
import {DialogHelper} from "../../helpers/dialogHelper";
import {MachineState, PlayerToken, WorldTileSurrogate} from "../../../simulation/machine/machineState";
import {WorldUnitToImgHelper} from "../../helpers/worldUnitToImgHelper";
import ImageLibrary from "../tiles/imageLibrary/imageLibrary";
import {FieldShape, FieldSymbol, ImgSymbol, LineSymbol, PlainPoint} from "../../types/drawing";
import {WorldSettings} from "../../state/reducers/world/worldSettings/worldSettingsReducer";

//const css = require('./styles.styl');

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    isTileEditorDisplayed: rootState.worldState.isTileEditorDisplayed,
    isImageLibraryDisplayed: rootState.worldState.isImageLibraryDisplayed,
    worldCmdText: rootState.worldSettingsState.worldCmdText,

    tileSurrogatesState: rootState.tileSurrogateState,
    allTiles: rootState.tileLibraryState.possibleTiles,
    simulationState: rootState.simulationState,

    fieldSymbols: rootState.fieldSymbolState.present,
    imgSymbols: rootState.imgSymbolState.present,
    lineSymbols: rootState.lineSymbolState.present,

    worldSettings: rootState.worldSettingsState,

    variableIndicatorState: rootState.variableIndicatorState,

    langId: rootState.i18nState.langId,


  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here
  set_world_isTileEditorDisplayed,
  set_app_activeTabIndex,
  set_editor_isCreatingNewTile,

  set_world_isTileLibraryModalDisplayed,

  world_tileSurrogates_undo,
  world_tileSurrogates_redo,

  set_tileLibrary_possibleTiles,
  set_world_isImageLibraryDisplayed,
}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

class worldActionsBar extends React.Component<Props, any> {

  importInput: HTMLInputElement = null

  onImportWorld(e: SyntheticEvent<HTMLInputElement>): Promise<void> {

    const files = e.currentTarget.files
    if (!files) return

    const file = files[0]

    const fileReader = new FileReader()

    fileReader.onprogress = ev => {
      Logger.log(`load status: ${ev.loaded}/${ev.total}`)
    }

    fileReader.onload = async (ev) => {
      const json = fileReader.result as string

      IoHelper.importWorld(json)

      this.importInput.value = ''
    }

    fileReader.onerror = ev => {
      Logger.log('error')
      this.importInput.value = ''
    }

    fileReader.readAsText(file)
  }

  render(): JSX.Element {

    let tiles: Tile[] = []
    for (const tileSurrogate of this.props.tileSurrogatesState.present) {
      const tile = this.props.allTiles.find(p => p.guid === tileSurrogate.tileGuid)
      if (!tile) {
        Logger.fatal(`for a tiles the data could not be found, guid: ${tileSurrogate.tileGuid}`)
      }
      tiles.push(tile)
    }

    return (<div className="flexed">

      <ImageLibrary
        isCreatingNewImgShape={false}
        onImageTaken={null}
        isDisplayed={this.props.isImageLibraryDisplayed}
        set_isDisplayed={(isDisplayed) => {
          this.props.set_world_isImageLibraryDisplayed(isDisplayed)
        }}
        displayGenericImg={false}
      />

      <div
        className={['flexed',
          this.props.simulationState.simulationStatus !== null || this.props.simulationState.machineState !== null
            ? 'div-disabled'
            : ''].join(' ')} style={{marginRight: '3em'}}

      >

        <Button icon labelPosition='left' disabled={this.props.isTileEditorDisplayed}
                onClick={() => {

                  this.props.set_editor_isCreatingNewTile(true, null)
                  this.props.set_world_isTileEditorDisplayed(true)
                  this.props.set_app_activeTabIndex(AvailableAppTabs.tileEditor)
                }}>
          <Icon name='add'/>
          {getI18n(this.props.langId, "Tile")}
        </Button>


        <Button icon labelPosition='left'
                onClick={() => {
                  this.props.set_world_isTileLibraryModalDisplayed(true)
                }}>
          <Icon name='lab'/>
          {getI18n(this.props.langId, "Tile library")}
        </Button>

        <Button icon
                onClick={() => {
                  this.props.set_world_isImageLibraryDisplayed(true)
                }}>
          <Icon name='image'/>
        </Button>

      </div>

      <ControlSimulationBar
        className="mar-right"
        tiles={tiles}
        gameInitCmdText={this.props.worldCmdText}
        tileSurrogates={this.props.tileSurrogatesState.present}
        isSingleSimulation={false}
      />


      <div className="flexed mar-right">

        <ToolTip
          message={getI18n(this.props.langId, "Check all fields for correct command syntax")}
        >
          <Button icon
                  onClick={() => {
                    //parse all field cmds for syntax errors
                    Simulator.parseAllFields(this.props.worldCmdText, tiles, false, false, false, false)

                    Logger.success('All commands are syntactical ok')
                  }}
          >
            <Icon name="code"/>
          </Button>
        </ToolTip>

        <ToolTip
          message={getI18n(
            this.props.langId, "Checks if all variables are defined. This also executes the game init/setup code (experimental/not enough tested)")}
        >
          <Button icon
                  onClick={() => {

                    //parse all field cmds for syntax

                    Simulator.checkAllVarsDefined(this.props.worldCmdText, tiles)

                    Logger.success('All variables are defined')
                  }}
          >
            <Icon name="terminal"/>
          </Button>
        </ToolTip>


      </div>

      <div className="flexed">


        <div>

          <ToolTip
            message={getI18n(this.props.langId, "Import world")}
          >
            <Button icon
                    onClick={() => {
                      this.importInput.click()
                    }}
            >
              <Icon name="download"/>
            </Button>
          </ToolTip>
          <input ref={(i) => this.importInput = i} type="file" className="collapsed"
                 accept={'.' + worldFileExtensionWithoutDot}
                 multiple={false}
                 onChange={(e: SyntheticEvent<HTMLInputElement>) => this.onImportWorld(e)}/>
        </div>

        <ToolTip
          message={getI18n(this.props.langId, "Export world. This will also export all images in the library")}>
          <Button disabled={tiles.length === 0} icon
                  onClick={() => {
                    IoHelper.exportWorld()
                  }}
          >
            <Icon name="upload"/>
          </Button>
        </ToolTip>


        <ToolTip
          message={getI18n(this.props.langId, "Print world & all found variables. For the variables the settings in the variable indicator tab are used")}>
          <Button disabled={tiles.length === 0} icon
                  className="mar-right"
                  onClick={async () => {

                    await PrintHelper.printWorld(this.props.tileSurrogatesState.present,
                      tiles,
                      this.props.fieldSymbols,
                      this.props.imgSymbols,
                      this.props.lineSymbols,
                      this.props.allTiles,
                      false, //TODO maybe set to hardcoded to false ??
                      10,
                      this.props.worldSettings.gridStrokeThicknessInPx,
                      this.props.worldSettings.gridStrokeColor,
                      this.props.worldSettings,
                      this.props.langId,
                      this.props.worldSettings.printGameAsOneImage,
                      this.props.variableIndicatorState.outerCircleDiameterInPx,
                      this.props.variableIndicatorState.innerCircleDiameterInPx,
                      this.props.worldSettings.expectedTileWidth,
                      this.props.worldSettings.expectedTileHeight,
                      this.props.variableIndicatorState.fontSizeInPx,
                      this.props.variableIndicatorState.fontName,
                      printVariableIndicatorStrokeThickness,
                      this.props.variableIndicatorState.drawQrCode,
                      null,
                      this.props.worldSettings.printAndExportScale,
                      this.props.worldSettings.additionalBorderWidthInPx
                    )
                  }}>
            <Icon name="print"/>
          </Button>
        </ToolTip>

        <ToolTip
          message={'Convert world into one tile. This assumes all tiles have the same size'}
        >
          <Button icon disabled={tiles.length === 0}
                  onClick={() => {

                    let newTile: Tile


                    try {
                      newTile = WorldTilesHelper.convertWorldToTile(this.props.tileSurrogatesState.present, this.props.allTiles, this.props.worldSettings.expectedTileWidth, this.props.worldSettings.expectedTileHeight)
                    } catch (err) {
                      return
                    }

                    this.props.set_tileLibrary_possibleTiles(this.props.allTiles.concat(newTile))
                    DialogHelper.okDialog(getI18n(this.props.langId, "Convert world into one tile"), getI18n(this.props.langId, "Successfully converted the world into tile. The tile was added to the tile library"))

                  }}>
            <Icon name="compress"/>
          </Button>
        </ToolTip>

        <ToolTip
          message={getI18n(this.props.langId, "Export as svg (experimental). If you used icons you need to download the font awesome font file and place it in the same folder as the svg. For not filled (regular) icons you will need the file 'fa-regular-400.woff', for the filled (solid) icons you need the file 'fa-solid-900.woff'. Use the buttons in the world editor next to the svg download button.")}>
          <Button disabled={tiles.length === 0} icon onClick={() => {

            PrintHelper.exportWorldAsLargeImage(this.props.tileSurrogatesState.present, tiles, this.props.fieldSymbols,
              this.props.imgSymbols, this.props.lineSymbols, this.props.allTiles, false, //TODO maybe set to hardcoded to false ??
              10, this.props.worldSettings.gridStrokeThicknessInPx, this.props.worldSettings.gridStrokeColor,
              this.props.worldSettings, exportPngImagesBgColor, 'svg',
              this.props.worldSettings.printAndExportScale,
              this.props.worldSettings.additionalBorderWidthInPx
            )

          }}>
            <Icon.Group>
              <Icon name='upload'/>
              <Icon corner name='code'/>
            </Icon.Group>
          </Button>
        </ToolTip>

        <ToolTip
          message={getI18n(this.props.langId, "Click to download the font awesome font file 'fa-regular-400.woff'. If you used not filled (regular) icons you will need to place this font awesome font file in the same folder as the svg!")}>
          <a href={fontAwesomeRegularIconsFontFileLink} download="fa-regular-400.woff">
            <Button icon>
              <Icon.Group>
                <Icon name='upload'/>
                <Icon corner name='font'/>
              </Icon.Group>
            </Button>
          </a>
        </ToolTip>

        <ToolTip
          message={getI18n(this.props.langId, "Click to download the font awesome font file 'fa-solid-900.woff'. If you used not filled (regular) icons you will need to place this font awesome font file in the same folder as the svg!")}>
          <a href={fontAwesomeSolidIconsFontFileLink} download="fa-solid-900.woff">
            <Button icon>
              <Icon.Group>
                <Icon name='upload'/>
                <Icon corner name='font'/>
              </Icon.Group>
            </Button>
          </a>
        </ToolTip>

        <ToolTip
          message={getI18n(this.props.langId, "Export as png (experimental)")}>
          <Button disabled={tiles.length === 0} icon onClick={() => {

            PrintHelper.exportWorldAsLargeImage(this.props.tileSurrogatesState.present, tiles, this.props.fieldSymbols,
              this.props.imgSymbols, this.props.lineSymbols, this.props.allTiles, false, //TODO maybe set to hardcoded to false ??
              10, this.props.worldSettings.gridStrokeThicknessInPx, this.props.worldSettings.gridStrokeColor,
              this.props.worldSettings, exportPngImagesBgColor, 'png',
              this.props.worldSettings.printAndExportScale,
              this.props.worldSettings.additionalBorderWidthInPx
            )

          }}>
            <Icon.Group>
              <Icon name='upload'/>
              <Icon corner name='image'/>
            </Icon.Group>
          </Button>
        </ToolTip>

      </div>

      <div className="mar-left flexed">
        <ToolTip
          message={getI18n(this.props.langId, "Undo the last tile placement")}>
          <Button disabled={this.props.tileSurrogatesState.past.length === 0} icon onClick={() => {
            this.props.world_tileSurrogates_undo()
          }}>
            <Icon name="undo"/>
          </Button>
        </ToolTip>

        <ToolTip
          message={getI18n(this.props.langId, "Redo the last tile placement")}>
          <Button disabled={this.props.tileSurrogatesState.future.length === 0} icon onClick={() => {
            this.props.world_tileSurrogates_redo()
          }}>
            <Icon name="redo"/>
          </Button>
        </ToolTip>

        <Button disabled={this.props.tileSurrogatesState.present.length === 0} icon onClick={async () => {


          const aFrame = document.getElementById('aframe-frame') as HTMLIFrameElement
          const worldRendererCanvas = document.getElementById('world-renderer-canvas')

          if (worldRendererCanvas.style.display === 'none') {

            worldRendererCanvas.style.display = "block"
            aFrame.style.display = "none"

          } else {
            worldRendererCanvas.style.display = "none"
            aFrame.style.display = "block"
          }


          // startAFrame(
          //   this.props.tileSurrogatesState.present,
          //   this.props.allTiles,
          //   this.props.fieldSymbols,
          //   this.props.imgSymbols,
          //   this.props.lineSymbols,
          //   this.props.worldSettings
          // )
        }}>
          <Icon name="camera"/>
        </Button>
      </div>


    </div>)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(worldActionsBar)


export function startAFrame(tileSurrogatesState: ReadonlyArray<WorldTileSurrogate>,
                            allTiles: ReadonlyArray<Tile>,
                            fieldSymbols: ReadonlyArray<FieldSymbol>,
                            imgSymbols: ReadonlyArray<ImgSymbol>,
                            lineSymbols: ReadonlyArray<LineSymbol>,
                            worldSettings: WorldSettings,
                            state?: MachineState): void {

  console.log('aaaaaaaaaaaa')

  const aFrameWrapper = document.getElementById('aframe-frame-wrapper')
  const worldRendererCanvas = document.getElementById('world-renderer-canvas')

  worldRendererCanvas.style.display = "none"
  aFrameWrapper.style.display = "block"

  aFrameWrapper.innerHTML = `<iframe id="aframe-frame" class="fh fw" src="about:blank"></iframe>`

  const tileImgs: string[] = []

  const canvas = document.createElement('canvas')

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
      '#5d5d5d'
    )
    tileImgs.push(resultCanvas.toDataURL())
  }

  const aFrameHGtml = getAFrame(tileSurrogatesState, allTiles, tileImgs, state)

  console.log(aFrameHGtml)

  const aFrame = document.querySelector(`#aframe-frame`) as HTMLIFrameElement

  aFrame.contentWindow.document.write(aFrameHGtml)
  aFrame.contentWindow.document.close()
}


//hero marker: https://stemkoski.github.io/AR-Examples/markers/hiro.png
const isArJsEnabled = true

// const tileSize = isArJsEnabled ? 1 : 10
// const gameTokenSize = isArJsEnabled ? 0.05 : 1

//for isArJsEnabled: size is relative to the marker size...
const tileSize = isArJsEnabled ? 1 : 10
const gameTokenSize = isArJsEnabled ? 0.05 : 0.5

//see https://github.com/jeromeetienne/AR.js-docs/blob/master/posts/post-XX-how-to-use-arjs-with-aframe.md

function getAFrame(tileSurrogates: ReadonlyArray<WorldTileSurrogate>, tiles: ReadonlyArray<Tile>, tileImgs: string[], state?: MachineState): string {


  console.log('disabled adblocker else ar.js will be blocked!!')
  console.log('disabled adblocker else ar.js will be blocked!!')
  console.log('disabled adblocker else ar.js will be blocked!!')

  const backgroundImgNames = 'plane'

  const backgroundImgsString = tileImgs.map((p, index) => `<img id="${backgroundImgNames}-${index}" src="${p}">`)

  let field: FieldShape
  let pos: PlainPoint

  const tilePlanesString = tileSurrogates.map((p, index) => {

    const tile = tiles.find(k => k.guid === p.tileGuid)

    if (!field) {
      field = tile.fieldShapes[0]
      pos = mapTileFieldPosToAFramePos(field, p, tile, tileSize)
      console.log(pos)
    }

    return `<a-plane src="#${backgroundImgNames}-${index}" width="${tileSize}" height="${tileSize}" rotation="-90 0 0" position="${p.x * tileSize} 0 ${p.y * tileSize}"></a-plane>`
  })

  const playerTokens: PlayerToken[] = state
    ? state.players.map<PlayerToken>(p => {
      const token = p.tokens[0]
      return token
    })
    : []

  console.log(playerTokens)

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
      
<!--      <a-box color="tomato" depth="${gameTokenSize}" height="${gameTokenSize}" width="${gameTokenSize}" position="${pos.x} ${gameTokenSize / 2} ${pos.y}"></a-box>-->
        ${playerAFrame.join('\n')}
      
     <a-entity id="dice-value" text="align: center; color: #ff85ff; width: ${tileSize}; value: Hello World;" rotation="-45 0 0" position="${-tileSize / 2} ${gameTokenSize} ${-tileSize / 2}"></a-entity>
      
      
      ${isArJsEnabled ? '' : '<a-entity id="cam" camera wasd-controls rotation="-90 0 0" position="0 10 0"></a-entity>'}

    <!-- define a camera which will move according to the marker position -->
    ${isArJsEnabled ? "<a-marker-camera preset='hiro'></a-marker-camera>" : ''}

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


function mapTileFieldPosToAFramePos(field: FieldShape, tileSurrogate: WorldTileSurrogate, tile: Tile, tileSizeInAFrame: number): PlainPoint {

  return mapTilePosToAFramePos({x: field.x, y: field.y}, tileSurrogate, tile, tileSizeInAFrame)
}


function mapTilePosToAFramePos(pos: PlainPoint, tileSurrogate: WorldTileSurrogate, tile: Tile, tileSizeInAFrame: number): PlainPoint {

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
    x: offsetX + aFrameX - (tileSizeInAFrame / 2), //TODO offsetY ??
    y: offsetY + aFrameY - (tileSizeInAFrame / 2)
  }
}


function getPlayerTokenPositionsFromState(gameState: MachineState, tileSurrogates: ReadonlyArray<WorldTileSurrogate>, allTile: ReadonlyArray<Tile>, tileSizeInAFrame: number): PlainPoint[] {

  return gameState.players.map<PlainPoint>((player, index) => {
    const token = player.tokens[0]

    //if to tokens are on the same field...
    const tokenInternalPlayerOffsetY = ((index + 1) * (gameTokenSize / 2))
    const tokenInternalPlayerOffsetX = ((index) * (gameTokenSize / 2))

    if (!token.tileGuid || !token.fieldId) {
      return mapTilePosToAFramePos({//don't use 0,0 because we multiply with this
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

    console.log('player - ' + index)
    console.log(`${field.x}, ${field.y}`)

    const pos = mapTileFieldPosToAFramePos(field, tileSurrogate, tile, tileSizeInAFrame)

    return {
      ...pos,
      x: pos.x + tokenInternalPlayerOffsetY,
      y: pos.y + tokenInternalPlayerOffsetY,
    }
  })

}


export function sendIframeAFrameNewState(gameState: MachineState, tileSurrogates: ReadonlyArray<WorldTileSurrogate>, allTile: ReadonlyArray<Tile>, tileSizeInAFrame: number = tileSize) {

  const aFrame = document.getElementById('aframe-frame') as HTMLIFrameElement

  console.log('update player pos')

  const tokenPositions = getPlayerTokenPositionsFromState(gameState, tileSurrogates, allTile, tileSizeInAFrame)

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


interface PlayerPosUpdate {
  kind: 'playerPosUpdate'
  positions: (PlainPoint)[]
  gameTokenSize: number
  rolledDiceValue: number
  leftDiveValue: number
  activePlayerIndex: number
  diceValueTextOffsetX: number
  diceValueTextOffsetY: number
}