import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {Tab} from "semantic-ui-react";
import SimulationOverview from '../tiles/simulationOverview'
import {Logger} from "../../helpers/logger";
import {Tile} from "../../types/world";
import {getI18n} from "../../../i18n/i18nRoot";

//const css = require('./styles.styl');

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    worldCmdText: rootState.worldSettingsState.worldCmdText,
    tileSurrogates: rootState.tileSurrogateState.present,
    allTiles: rootState.tileLibraryState.possibleTiles,
    langId: rootState.i18nState.langId,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

class rightWorldEditorTabMenu extends React.Component<Props, any> {
  render(): JSX.Element {

    let tiles: Tile[] = []
    for (const tileSurrogate of this.props.tileSurrogates) {
      const tile = this.props.allTiles.find(p => p.guid === tileSurrogate.tileGuid)
      if (!tile) {
        Logger.fatal(`for a tiles the data could not be found, guid: ${tileSurrogate.tileGuid}`)
      }
      tiles.push(tile)
    }

    const simulationOverview = (
      <SimulationOverview
      title={'Multi tile simulation'}
      gameInitCmdText={this.props.worldCmdText}
      tiles={tiles}
      tileSurrogates={this.props.tileSurrogates}
      className="property-editor-right"
      isSingleSimulation={false}
      />
    )

    return (
      <div className="right-tab-menu">
        <Tab menu={{secondary: true, pointing: true}}
             //activeIndex={this.props.rightTabActiveIndex}
             onTabChange={(event1, data) => {
               //this.props.set_editor_rightTabActiveIndex(data.activeIndex as number)
             }}
             panes={

               [
                 {
                   menuItem: getI18n(this.props.langId, "Simulation"),
                   render: () => {
                     return (
                       simulationOverview
                     )
                   }
                 },
               ]
             }/>
      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(rightWorldEditorTabMenu)