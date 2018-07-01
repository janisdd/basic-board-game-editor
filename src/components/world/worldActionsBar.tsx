import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {worldFileExtensionWithoutDot} from "../../constants";
import {Button, Icon} from "semantic-ui-react";
import {
  set_world_isTileEditorDisplayed, set_world_isTileLibraryModalDisplayed
} from "../../state/reducers/world/actions";
import {set_app_activeTabIndex} from "../../state/reducers/actions";
import {set_editor_isCreatingNewTile} from "../../state/reducers/tileEditor/actions";
import {Tile} from "../../types/world";
import {IoHelper} from "../../helpers/ioHelper";
import {SyntheticEvent} from "react";
import ControlSimulationBar from '../tiles/controlSimulationBar'
import {Logger} from "../../helpers/logger";
import TooTip from '../helpers/TooTip'
import {getI18n} from "../../../i18n/i18nRoot";
import {PrintHelper} from "../../helpers/printHelper";
import {world_tileSurrogates_redo, world_tileSurrogates_undo} from "../../state/reducers/world/tileSurrogates/actions";
import {AvailableAppTabs} from "../../state/reducers/appReducer";
import {Simulator} from "../../../simulation/simulator";
import ToolTip from '../helpers/TooTip'

//const css = require('./styles.styl');

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    isTileEditorDisplayed: rootState.worldState.isTileEditorDisplayed,
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
      console.log(ev.loaded + '/' + ev.total)
    }

    fileReader.onload = ev => {
      const json = fileReader.result as string

      IoHelper.importWorld(json)

      this.importInput.value = ''
    }

    fileReader.onerror = ev => {
      console.log('error')
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

          <TooTip
            message={getI18n(this.props.langId, "Import world")}
          >
            <Button icon
                    onClick={() => {
                      this.importInput.click()
                    }}
            >
              <Icon name="download"/>
            </Button>
          </TooTip>
          <input ref={(i) => this.importInput = i} type="file" className="collapsed"
                 accept={'.' + worldFileExtensionWithoutDot}
                 multiple={false}
                 onChange={(e: SyntheticEvent<HTMLInputElement>) => this.onImportWorld(e)}/>
        </div>

        <TooTip
          message={getI18n(this.props.langId, "Export world. This will also export all images in the library")}>
          <Button disabled={tiles.length === 0} icon
                  onClick={() => {
                    IoHelper.exportWorld()
                  }}
          >
            <Icon name="upload"/>
          </Button>
        </TooTip>


        <TooTip
          message={getI18n(this.props.langId, "Print world & all found variables")}>
          <Button disabled={tiles.length === 0} icon onClick={() => {

            PrintHelper.printWorld(this.props.tileSurrogatesState.present,
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
              this.props.variableIndicatorState.innerTextFontSizeInPx,
            )
          }}>
            <Icon name="print"/>
          </Button>
        </TooTip>

        <TooTip
          message={getI18n(this.props.langId, "Export as svg (experimental)")}>
          <Button disabled={tiles.length === 0} icon onClick={() => {

            PrintHelper.exportWorldAsLargeSvg(this.props.tileSurrogatesState.present, tiles, this.props.fieldSymbols,
              this.props.imgSymbols, this.props.lineSymbols, this.props.allTiles, false, //TODO maybe set to hardcoded to false ??
              10, this.props.worldSettings.gridStrokeThicknessInPx, this.props.worldSettings.gridStrokeColor,
              this.props.worldSettings
            )

          }}>
            <Icon.Group>
              <Icon name='upload'/>
              <Icon corner name='image'/>
            </Icon.Group>
          </Button>
        </TooTip>

      </div>

      <div className="mar-left flexed">
        <TooTip
          message={getI18n(this.props.langId, "Undo the last tile placement")}>
          <Button disabled={this.props.tileSurrogatesState.past.length === 0} icon onClick={() => {
            this.props.world_tileSurrogates_undo()
          }}>
            <Icon name="undo"/>
          </Button>
        </TooTip>

        <TooTip
          message={getI18n(this.props.langId, "Redo the last tile placement")}>
          <Button disabled={this.props.tileSurrogatesState.future.length === 0} icon onClick={() => {
            this.props.world_tileSurrogates_redo()
          }}>
            <Icon name="redo"/>
          </Button>
        </TooTip>

      </div>


    </div>)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(worldActionsBar)