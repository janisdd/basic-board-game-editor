import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {Tab} from "semantic-ui-react";
import {
  set_editor_rightTabActiveIndex,
  set_editor_simulationEndFieldIds,
  set_editor_simulationStartFieldIds
} from "../../state/reducers/tileEditor/actions";
import TileBorderPointsView from './tileBorderPointsView'
import PropertyEditorsView from './propertyEditorsView'
import {Tile} from "../../types/world";
import {getI18n} from "../../../i18n/i18nRoot";
import TileSimulationView from './tileSimulationView'

//const css = require('./styles.styl');

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    selectedFieldShapeIds: rootState.tileEditorState.selectedFieldShapeIds,
    selectedLineShapeIds: rootState.tileEditorState.selectedLineShapeIds,
    selectedImageShapeIds: rootState.tileEditorState.selectedImageShapeIds,

    selectedLineSymbolGuid: rootState.symbolsState.selectedLineSymbolGuid,
    selectedImgSymbolGuid: rootState.symbolsState.selectedImgSymbolGuid,
    selectedFieldSymbolGuid: rootState.symbolsState.selectedFieldSymbolGuid,

    rightTabActiveIndex: rootState.tileEditorState.rightTabActiveIndex,

    langId: rootState.i18nState.langId,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here
  set_editor_rightTabActiveIndex,

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

class rightEditorTabMenu extends React.Component<Props, any> {
  render(): JSX.Element {

    let isSomPropsEditorDisplayed = this.props.selectedLineShapeIds.length > 0
      || this.props.selectedImageShapeIds.length > 0
      || this.props.selectedFieldShapeIds.length > 0
      || this.props.selectedLineSymbolGuid !== null
      || this.props.selectedImgSymbolGuid !== null
      || this.props.selectedFieldSymbolGuid !== null


    let selectionsState = 0

    if (this.props.selectedFieldShapeIds.length > 0) {
      selectionsState++
    }

    if (this.props.selectedImageShapeIds.length > 0) {
      selectionsState++
    }
    if (this.props.selectedLineShapeIds.length > 0) {
      selectionsState++
    }


    let hidePropertiesEditorForced = false

    if (selectionsState > 1) {
      //we select two different shape types --> no assume no common props only allow moving change (x,y)
      hidePropertiesEditorForced = true
    }



    let panes = [
      {
        menuItem: getI18n(this.props.langId, "Simulation"),
        render: () => {
          return (
            <TileSimulationView />
          )
        }
      },
      {
        menuItem: getI18n(this.props.langId, "Border points"),
        render: () => {
          return (
            <TileBorderPointsView/>
          )
        }
      }
    ]

    if (isSomPropsEditorDisplayed && hidePropertiesEditorForced === false) {
      panes = panes.concat({
        menuItem: getI18n(this.props.langId, "Properties"),
        render: () => {
          return (
            <PropertyEditorsView/>
          )
        }
      })
    }

    return (
      <div className="right-tab-menu">

        <Tab menu={{secondary: true, pointing: true}}
             activeIndex={this.props.rightTabActiveIndex}
          //TODO false not working here...??
             renderActiveOnly
             onTabChange={(event1, data) => {
               this.props.set_editor_rightTabActiveIndex(data.activeIndex as number)
             }}
             panes={panes}/>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(rightEditorTabMenu)