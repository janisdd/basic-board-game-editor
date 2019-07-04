import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../../state";
import {Button, Icon, Modal} from "semantic-ui-react";
import TileRenderer from '../../tiles/tileRenderer'
import {Tile} from "../../../types/world";
import {set_editor_isCreatingNewTile} from "../../../state/reducers/tileEditor/actions";
import {set_app_activeTabIndex} from "../../../state/reducers/actions";
import {
  set_world_isTileEditorDisplayed,
  set_world_isTileLibraryModalDisplayed,
} from "../../../state/reducers/world/actions";
import {set_tileLibrary_possibleTiles} from "../../../state/reducers/world/tileLibrary/actions";
import {SyntheticEvent} from "react";
import {IoHelper} from "../../../helpers/ioHelper";
import {tileFileExtensionWithoutDot} from "../../../constants";
import {DragEvent} from "react";
import {getGuid} from "../../../helpers/guid";
import {WorldTileSurrogate} from "../../../../simulation/machine/machineState";
import ToolTip from '../../helpers/ToolTip'
import {getI18n, getRawI18n} from "../../../../i18n/i18nRoot";
import {Logger} from "../../../helpers/logger";
import {set_world_tiles} from "../../../state/reducers/world/tileSurrogates/actions";
import {AvailableAppTabs} from "../../../state/reducers/appReducer";
import {DialogHelper} from "../../../helpers/dialogHelper";
import {WorldTilesHelper} from "../../../helpers/worldTilesHelper";

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState, /*props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    possibleTiles: rootState.tileLibraryState.possibleTiles,
    isTileLibraryModelDisplayed: rootState.worldState.isTileLibraryModalDisplayed,

    isTileEditorDisplayed: rootState.worldState.isTileEditorDisplayed,

    selectedTilePos: rootState.worldState.selectedTilePos,
    worldTiles: rootState.tileSurrogateState.present,
    langId: rootState.i18nState.langId,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here
  set_editor_isCreatingNewTile,
  set_world_isTileEditorDisplayed,
  set_app_activeTabIndex,

  set_world_isTileLibraryModalDisplayed,
  set_tileLibrary_possibleTiles,
  set_world_tiles,

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

let nop = (...p: any[]) => {
}


class tileLibrary extends React.Component<Props, any> {


  dropElementId: string = 'tileLibDropArea'
  importInput: HTMLInputElement = null

  componentWillMount() {
    this.onTileDrop = this.onTileDrop.bind(this)
    this.onTileDragEnter = this.onTileDragEnter.bind(this)
    this.onTileDragLeave = this.onTileDragLeave.bind(this)
  }

  async onImportTile(e: SyntheticEvent<HTMLInputElement>): Promise<void> {

    const files = e.currentTarget.files
    if (!files) return

    for (let i = 0; i < files.length; i++) {
      const file = files.item(i)
      //TODO maybe make real promise?
      await this.importTileFile(file)
    }

  }

  async importTileFile(file: File): Promise<void> {

    const fileReader = new FileReader()

    fileReader.onprogress = ev => {
      Logger.log(ev.loaded + '/' + ev.total)
    }

    fileReader.onload = ev => {
      const json = fileReader.result as string

      IoHelper.importTile(json)

      this.importInput.value = ''
    }

    fileReader.onerror = ev => {
      this.importInput.value = ''
      Logger.fatal('Some error occurred during tile upload/import')
    }

    fileReader.readAsText(file)
  }

  // getValidFilesIds(e: DragEvent<HTMLDivElement>): number[] {
  //
  //   let fileIds: number[] = []
  //
  //   for (let i = 0; i < e.dataTransfer.items.length; i++) {
  //     const item = e.dataTransfer.items[i]
  //     if (item.kind === 'file') {
  //       console.log(item.type)
  //       if (allowedTypes.indexOf(item.type) !== -1) {
  //         fileIds.push(i)
  //       }
  //     }
  //   }
  //   return fileIds
  // }

  async onTileDrop(e: DragEvent<HTMLDivElement>) {

    //because async
    e.persist()

    // const imgFilesIds = this.getValidFilesIds(e)
    for (let i = 0; i < e.dataTransfer.items.length; i++) {
      const file = e.dataTransfer.files.item(i)
      if (file.name.endsWith(tileFileExtensionWithoutDot)) {
        await this.importTileFile(file)
      }
    }

    e.preventDefault()
    this.onTileDragLeave(null)
  }

  onTileDragOver(e: DragEvent<HTMLDivElement>) {

    // this.onImgDragEnter(e)
    //TODO only show effect when we drop allowed types
    if (e.dataTransfer.types[0] === 'Files') {
      e.dataTransfer.dropEffect = 'link'
    } else {
      e.dataTransfer.dropEffect = 'none'
    }

    e.preventDefault()
  }

  onTileDragEnter(e: DragEvent<HTMLDivElement>) {

    //we don't know the custom file extension ...
    //https://stackoverflow.com/questions/34771177/detect-file-type-on-dragenter-cross-browser-solution
    //--> no permission
    if (e.dataTransfer.types[0] === 'Files' /*&& this.getValidFilesIds(e).length > 0*/) {
      e.dataTransfer.dropEffect = 'link'
      const areaDiv = document.getElementById(this.dropElementId) as HTMLDivElement
      (areaDiv.childNodes[0] as HTMLElement).classList.add('library-add-div-drop')
      areaDiv.classList.add('imgLibDropAreaEffect')
    } else {
      e.dataTransfer.dropEffect = 'none'
    }
    e.preventDefault()
  }

  onTileDragLeave(e: DragEvent<HTMLDivElement> | null) {
    const areaDiv = document.getElementById(this.dropElementId) as HTMLDivElement
    (areaDiv.childNodes[0] as HTMLElement).classList.remove('library-add-div-drop')
    areaDiv.classList.remove('imgLibDropAreaEffect')
    if (e) {
      e.preventDefault()
    }

  }


  render(): JSX.Element {

    let tilesList = this.props.possibleTiles

    return (
      <div>
        {
          //without this we get no parent error
          this.props.isTileLibraryModelDisplayed &&
          <Modal closeIcon={true} centered={false}
                 open={this.props.isTileLibraryModelDisplayed}
                 onClose={() => {
                   this.props.set_world_isTileLibraryModalDisplayed(false)
                 }}
                 size="fullscreen"
          >
            <Modal.Header>{getI18n(this.props.langId, "Tile library")}</Modal.Header>
            <Modal.Content>
              <div className="flexed">
                <div>
                  {
                    //we need the padding else we trigger instantly onTileDragLeave after onTileDragEnter
                    //because we disable cursor events?
                  }
                  <div id="tileLibDropArea" className="tile-library-item"
                       style={{padding: '0.5em'}}
                       onClick={() => this.importInput.click()}
                       onDragOver={this.onTileDragOver}
                       onDrop={this.onTileDrop}
                       onDragEnter={this.onTileDragEnter}
                       onDragLeave={this.onTileDragLeave}

                  >
                    <div className="library-add-div">
                      <div className="img-library-img-wrapper-inner">
                        <div className="img-library-img">
                          <Icon name="add" size="big"/>
                          <p dangerouslySetInnerHTML={getRawI18n(this.props.langId,
                            "Drop tile files(s) or <br/> click to select tile files(s)")}></p>
                        </div>
                      </div>
                    </div>
                  </div>
                  <input ref={(i) => this.importInput = i} type="file" className="collapsed" multiple={true}
                         accept={'.' + tileFileExtensionWithoutDot}
                         onChange={(e: SyntheticEvent<HTMLInputElement>) => this.onImportTile(e)}/>
                </div>

                {
                  tilesList.map((tile, index) => {
                    return (
                      <div key={index} className="tile-library-item">
                        <TileRenderer
                          setSelectionRect={nop}
                          selectionRect={null}
                          printLargeTilePreferredHeightInPx={0}
                          printLargeTilePreferredWidthInPx={0}
                          displayPrintGuidesDisplayed={false}
                          setTileEditorSelectingNextField={nop}
                          setPropertyEditor_FieldCmdText={nop}
                          sourceForSelectingNextField={null}
                          isSelectingNextField={false}
                          simulationMachineState={null}
                          stageScaleY={1}
                          stageScaleX={1}
                          setEditor_stageScale={nop}
                          setEditor_stageOffset={nop}
                          stageOffsetX={0}
                          stageOffsetY={0}
                          setLinePointNewPos={nop}
                          setPropertyEditor_ImageY={nop}
                          setPropertyEditor_FieldX={nop}
                          setPropertyEditor_FieldY={nop}
                          setSelectedLineShapeIds={nop}
                          setPropertyEditor_ImageX={nop}
                          selectedFieldShapeIds={[]}
                          selectedImageShapeIds={[]}
                          selectedLineShapeIds={[]}
                          setSelectedFieldShapeIds={nop}
                          setSelectedImageShapeIds={nop}
                          drawFieldIds={false}
                          drawGrid={false}
                          gridSizeInPx={10}
                          snapToGrid={false}
                          fieldShapes={tile.fieldShapes}
                          imgShapes={tile.imgShapes}
                          lineShapes={tile.lineShapes}
                          canvasHeight={500}
                          canvasWidth={500}
                          viewMaxHeight={250}
                          viewMaxWidth={250}
                          tileWidth={tile.tileSettings.width}
                          tileHeight={tile.tileSettings.height}
                          topBorderPoints={tile.topBorderPoints}
                          botBorderPoints={tile.botBorderPoints}
                          leftBorderPoints={tile.leftBorderPoints}
                          rightBorderPoint={tile.rightBorderPoint}
                          set_editor_stageOffsetScaleCorrection={nop}
                          stageOffsetYScaleCorrection={0}
                          stageOffsetXScaleCorrection={0}
                          selectedFieldSymbolGuid={null}
                          selectedImageSymbolGuid={null}
                          selectedLineSymbolGuid={null}
                          setSelectedFieldSymbolGuid={nop}
                          setSelectedImageSymbolGuid={nop}
                          setSelectedLineSymbolGuid={nop}
                          setPropertyEditor_FieldHeight={nop}
                          setPropertyEditor_FieldWidth={nop}
                          setPropertyEditor_ImageWidth={nop}
                          setPropertyEditor_ImageHeight={nop}
                        />

                        <div>
                          <span>{getI18n(this.props.langId, "Name")}: {tile.tileSettings.displayName}</span>
                        </div>
                        <div>
                          <span>{getI18n(this.props.langId, "Guid")}: {tile.guid}</span>
                        </div>

                        <div className="flex-left-right">
                          {
                            this.props.selectedTilePos !== null &&
                            <ToolTip
                              message={getI18n(this.props.langId, "Add tile to world")}
                            >
                              <Button icon onClick={() => {

                                //add or replace...

                                const tileSurrogate: WorldTileSurrogate = {
                                  tileGuid: tile.guid,
                                  x: this.props.selectedTilePos.x,
                                  y: this.props.selectedTilePos.y
                                }

                                const oldTileSurrogate = this.props.worldTiles.find(
                                  p => p.x === tileSurrogate.x && p.y === tileSurrogate.y)

                                this.props.set_world_isTileLibraryModalDisplayed(false)

                                if (oldTileSurrogate) {

                                  //replace
                                  this.props.set_world_tiles(this.props.worldTiles.map(p =>
                                    p.x !== tileSurrogate.x || p.y !== tileSurrogate.y
                                      ? p
                                      : tileSurrogate)
                                  )

                                } else {
                                  //add new tile surrogate
                                  this.props.set_world_tiles(this.props.worldTiles.concat(tileSurrogate))
                                }


                              }}>
                                <Icon name="add"/>
                              </Button>
                            </ToolTip>
                          }


                          <ToolTip
                            message={getI18n(this.props.langId,
                              "Edit tile. This will also change all instances of this the in the map. If you want to change only 1 instance then create a clone first and exchange the tile with the clone")}
                          >
                            <Button icon disabled={this.props.isTileEditorDisplayed}
                                    onClick={() => {

                              this.props.set_world_isTileLibraryModalDisplayed(false)

                              this.props.set_editor_isCreatingNewTile(false, tile)
                              this.props.set_world_isTileEditorDisplayed(true)
                              this.props.set_app_activeTabIndex(AvailableAppTabs.tileEditor)

                            }}>
                              <Icon name="write"/>
                            </Button>
                          </ToolTip>

                          <ToolTip
                            message={getI18n(this.props.langId, "Export single tile. This will export the tile, only the symbols & only the used images")}
                          >
                            <Button icon onClick={() => {

                              IoHelper.exportTile(tile)

                            }}>
                              <Icon name="upload"/>
                            </Button>
                          </ToolTip>

                          <ToolTip
                            message={getI18n(this.props.langId, "Clone tile")}
                          >
                            <Button icon onClick={() => {

                              const _copy = WorldTilesHelper.cloneTile(tile)

                              const copy: Tile = {
                                ..._copy,
                                tileSettings: {
                                  ...tile.tileSettings,
                                  displayName: tile.tileSettings.displayName + ' copy',
                                }
                              }

                              this.props.set_tileLibrary_possibleTiles(this.props.possibleTiles.concat(copy))
                            }}>
                              <Icon name="clone"/>
                            </Button>
                          </ToolTip>

                          <ToolTip
                            message={getI18n(this.props.langId,
                              "Delete tile. This will also delete all instances of this tile in the world")}
                          >
                            <Button icon color="red"
                                    onClick={async () => {

                                     const shouldDelete = await DialogHelper.askDialog(getI18n(this.props.langId, "Delete tile"), getI18n(this.props.langId, "Are you sure you want to delete the tile and all instances in the world (if any)?"))

                                      if (!shouldDelete) return

                                      this.props.set_world_tiles(this.props.worldTiles.filter(p => p.tileGuid !== tile.guid))

                                      this.props.set_tileLibrary_possibleTiles(
                                        this.props.possibleTiles.filter((value) => value.guid !== tile.guid)
                                      )
                                    }}
                            >
                              <Icon name="trash"/>
                            </Button>
                          </ToolTip>
                        </div>


                      </div>
                    )
                  })
                }

              </div>
            </Modal.Content>
          </Modal>
        }
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(tileLibrary)
