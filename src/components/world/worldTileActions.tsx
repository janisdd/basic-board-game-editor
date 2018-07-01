import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {Button, Icon} from "semantic-ui-react";
import {
  set_world_isTileEditorDisplayed,
  set_world_isTileLibraryModalDisplayed,
} from "../../state/reducers/world/actions";
import {set_editor_isCreatingNewTile} from "../../state/reducers/tileEditor/actions";
import {set_app_activeTabIndex} from "../../state/reducers/actions";
import ToolTip from '../helpers/ToolTip'
import {getI18n} from "../../../i18n/i18nRoot";
import {Logger} from "../../helpers/logger";
import {set_world_tiles} from "../../state/reducers/world/tileSurrogates/actions";
import {AvailableAppTabs} from "../../state/reducers/appReducer";


//const css = require('./styles.styl');

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test

    worldTiles: rootState.tileSurrogateState.present,
    selectedTilePos: rootState.worldState.selectedTilePos,
    allTiles: rootState.tileLibraryState.possibleTiles,

    isTileEditorDisplayed: rootState.worldState.isTileEditorDisplayed,

    simulationState: rootState.simulationState,
    langId: rootState.i18nState.langId,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here
  set_world_isTileLibraryModalDisplayed,

  set_world_tiles,
  set_editor_isCreatingNewTile,
  set_world_isTileEditorDisplayed,
  set_app_activeTabIndex,
}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

class worldTileActions extends React.Component<Props, any> {
  render(): JSX.Element {

    const tileSurrogate =
      this.props.selectedTilePos === null
        ? undefined
        : this.props.worldTiles.find(p =>
        p.x === this.props.selectedTilePos.x &&
        p.y === this.props.selectedTilePos.y
        )

    return (
      <div
        className={this.props.simulationState.simulationStatus !== null || this.props.simulationState.machineState !== null ? 'div-disabled' : ''}
      >
        <div className="flexed">

          <ToolTip
            message={getI18n(this.props.langId, "Set tile into the selected area")}
          >
            <Button icon onClick={() => {
              this.props.set_world_isTileLibraryModalDisplayed(true)
            }}>
              <Icon name='add'/>
            </Button>
          </ToolTip>

          {
            tileSurrogate !== undefined &&
            <ToolTip
              message={getI18n(this.props.langId, "Edit tile in the selected area")}
            >
              <Button icon disabled={this.props.isTileEditorDisplayed}
                      onClick={() => {

                        const tile = this.props.allTiles.find(p => p.guid === tileSurrogate.tileGuid)

                        if (!tile) {
                          Logger.fatal(`cannot find tile from surrogate, guid: ${tileSurrogate.tileGuid}`)
                        }

                        this.props.set_editor_isCreatingNewTile(false, tile)
                        this.props.set_world_isTileEditorDisplayed(true)
                        this.props.set_app_activeTabIndex(AvailableAppTabs.tileEditor)

                      }}>
                <Icon name="write"/>
              </Button>
            </ToolTip>
          }


          {
            tileSurrogate !== undefined &&

            <ToolTip
              message={getI18n(this.props.langId, "Remove tile from the selected area")}
            >
              <Button icon onClick={() => {

                this.props.set_world_tiles(this.props.worldTiles.filter(p =>
                  p.x !== this.props.selectedTilePos.x ||
                  p.y !== this.props.selectedTilePos.y
                ))

              }}>
                <Icon name="x"/>
              </Button>
            </ToolTip>
          }

        </div>


      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(worldTileActions)