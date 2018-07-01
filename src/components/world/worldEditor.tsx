import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import WorldRenderer from './worldRenderer'
import WorldEditorSettingsArea from './worldSettings/worldEditorSettingsArea'
import WorldEditorSettingsModal from './worldSettings/worldEditorSettingsModal'
import WorldTileActions from './worldTileActions'
import TileLibrary from './tileLibrary/tileLibrary'
import {set_tileLibrary_possibleTiles} from "../../state/reducers/world/tileLibrary/actions";
import WorldActionsBar from './worldActionsBar'
import RightWorldEditorTabMenu from './rightWorldEditorTabMenu'
import {set_world_tiles} from "../../state/reducers/world/tileSurrogates/actions";

//const css = require('./styles.styl');

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    selectedTilePos: rootState.worldState.selectedTilePos,

    worldTiles: rootState.tileSurrogateState.present,
    possibleTiles: rootState.tileLibraryState.possibleTiles
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here
  set_world_tiles,
  set_tileLibrary_possibleTiles,

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

class worldEditor extends React.Component<Props, any> {
  render(): JSX.Element {
    return (
      <div className="world-editor">

        <div className="world-editor-settings-bar">

          <WorldActionsBar/>

          <WorldEditorSettingsArea/>
        </div>


        <div style={{visibility: this.props.selectedTilePos === null ? 'hidden' : 'visible'}}>
          <WorldTileActions/>
        </div>

        <TileLibrary/>

        <WorldEditorSettingsModal/>

        <div className="world-editor-main-area">
          <div className="left-area">
            <WorldRenderer/>
          </div>

          <div className="right-area">
            <RightWorldEditorTabMenu />
          </div>
        </div>


      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(worldEditor)