import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../state";
import AppBar from './appBar'
import WorldEditor from './world/worldEditor'
import AppContentWrapper from './appContentWrapper'
import TileEditor from './tiles/tileEditor'
import VariableIndicatorEditor from './variableIndicator/variableIndicatorEditor'
import {Menu, Tab} from "semantic-ui-react";
import {set_app_activeTabIndex} from "../state/reducers/actions";
import {getI18n} from "../../i18n/i18nRoot";
import Guide from './guide/guide'
import GameInstructionsEditor from './gameInstructionsEditor/gameInstructionsEditor'

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    activeTabIndex: rootState.appState.activeTabIndex,
    isTileEditorDisplayed: rootState.worldState.isTileEditorDisplayed,
    simulationState: rootState.simulationState,
    langId: rootState.i18nState.langId
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here
  set_app_activeTabIndex,
}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

class app extends React.Component<Props, any> {

  componentDidMount() {
    //this is probably not wanted to drop anything here...
    window.addEventListener("dragover", function (e: DragEvent) {
      e.preventDefault();
    }, false);
    window.addEventListener("drop", function (e: DragEvent) {
      e.preventDefault();
    }, false);

  }

  render(): JSX.Element {

    let tabs: Array<{
      menuItem: any
      render: () => React.ReactNode
    }>
      = [
      {
        menuItem: <Menu.Item key="guide"
                             className={this.props.simulationState.simulationStatus !== null || this.props.simulationState.machineState !== null ? 'div-disabled' : ''}>
          {
            getI18n(this.props.langId, "Guide")
          }
        </Menu.Item>,
        render: () => {
          return (
            <Guide/>
          )
        }
      },
      {
        menuItem: <Menu.Item key="gameInstructionEditor"
                             className={this.props.simulationState.simulationStatus !== null || this.props.simulationState.machineState !== null ? 'div-disabled' : ''}>
          {
            getI18n(this.props.langId, "Game Instruction Editor")
          }
        </Menu.Item>,
        render: () => {
          return (
            <GameInstructionsEditor/>
          )
        }
      },
      {
        menuItem: <Menu.Item key="world editor"
                             className={this.props.simulationState.simulationStatus !== null || this.props.simulationState.machineState !== null ? 'div-disabled' : ''}>
          {
            getI18n(this.props.langId, "World editor")
          }
        </Menu.Item>,
        render: () => {
          return (
            <WorldEditor/>
          )
        }
      },
      {
        menuItem: <Menu.Item key="Variable
          indicator editor"
                             className={this.props.simulationState.simulationStatus !== null || this.props.simulationState.machineState !== null ? 'div-disabled' : ''}>
          {
            getI18n(this.props.langId, "Variable indicator editor")
          }
        </Menu.Item>,
        render: () => {
          return (
            <VariableIndicatorEditor/>
          )
        }
      }
    ]


    if (this.props.isTileEditorDisplayed) {
      tabs.push(
        {
          menuItem: <Menu.Item key="tile editor"
                               className={this.props.simulationState.simulationStatus !== null || this.props.simulationState.machineState !== null ? 'div-disabled' : ''}>
            {
              getI18n(this.props.langId, "Tile editor")
            }
          </Menu.Item>,
          render: () => {
            return (
              <TileEditor/>
            )
          }
        }
      )
    }

    return (
      <div className="fh">

        <AppBar/>
        <AppContentWrapper>
          <Tab menu={{secondary: true, pointing: true}} className="fh"
               activeIndex={this.props.activeTabIndex}
               onTabChange={(event1, data) => {
                 this.props.set_app_activeTabIndex(data.activeIndex as number)
               }}
               panes={tabs}/>
        </AppContentWrapper>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(app)
