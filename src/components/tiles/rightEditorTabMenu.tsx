import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {Button, Divider, Form, Icon, Input, Tab} from "semantic-ui-react";
import {
  set_editor_rightTabActiveIndex,
  set_editor_simulationEndFieldIds, set_editor_simulationStartFieldIds
} from "../../state/reducers/tileEditor/actions";
import TileBorderPointsView from './tileBorderPointsView'
import PropertyEditorsView from './propertyEditorsView'
import SimulationOverview from './simulationOverview'
import {Tile} from "../../types/world";
import {SyntheticEvent} from "react";
import {getI18n} from "../../../i18n/i18nRoot";
import IconToolTip from "../helpers/IconToolTip";

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

    tileProps: rootState.tileEditorState.tileProps,
    fieldShapes: rootState.tileEditorFieldShapesState.present,
    worldCmdText: rootState.worldSettingsState.worldCmdText,

    langId: rootState.i18nState.langId,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here
  set_editor_rightTabActiveIndex,
  set_editor_simulationStartFieldIds,
  set_editor_simulationEndFieldIds,

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


    const tile: Tile = {
      ...this.props.tileProps,
      guid: '"single tile simulation"',
      imgShapes: [],
      lineShapes: [],
      fieldShapes: this.props.fieldShapes
    }


    let extendedSimulationOverview = (
      <div className="property-editor-right">
        <div>
          <Form as="div">

            <Form.Field>
              <label>{getI18n(this.props.langId, "Additional tile editor simulation start field or empty")}
                <IconToolTip message={getI18n(this.props.langId,
                  "When you edit a tile that is not a original start tile (has no game start command) and you don't want to add one (because you might forget to remove it later for testing (simulating) the tile), then use this option to define a temporary start field. This option will be ignored for all world simulations")}/>
              </label>
              <Input type="number" placeholder=''
                     value={this.props.tileProps.simulationStartFieldIds.length === 0 ? '' : this.props.tileProps.simulationStartFieldIds[0]}
                     style={{width: '100px'}}
                     onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                       const val = parseInt(e.currentTarget.value)

                       if (isNaN(val)) {
                         this.props.set_editor_simulationStartFieldIds([])
                         return
                       }

                       this.props.set_editor_simulationStartFieldIds([val])
                     }}
              />
            </Form.Field>

            <Form.Field>
              <label>{getI18n(this.props.langId, "Additional tile editor simulation end fields")}
                <IconToolTip message={getI18n(this.props.langId,
                  "You can add additional end fields. This option is ignored for all world simulations")}/>
              </label>
              {
                this.props.tileProps.simulationEndFieldIds.map((value, index) => {
                  return (
                    <div key={index}>
                      <Form.Field>

                        <Input type="number" placeholder=''
                               value={value}
                               style={{width: '100px'}}
                               onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                 const val = parseInt(e.currentTarget.value)

                                 if (isNaN(val)) {
                                   return
                                 }

                                 this.props.set_editor_simulationEndFieldIds(
                                   this.props.tileProps.simulationEndFieldIds.map((fieldId, i) =>
                                     i !== index
                                       ? fieldId
                                       : val
                                   )
                                 )
                               }}
                        />

                        <Button icon color="red"
                                onClick={() => {
                                  this.props.set_editor_simulationEndFieldIds(
                                    this.props.tileProps.simulationEndFieldIds.filter((fieldId, i) =>
                                      i !== index)
                                  )
                                }}
                        >
                          <Icon name="x"/>
                        </Button>
                      </Form.Field>
                    </div>
                  )
                })
              }
            </Form.Field>

            <Button icon color="green" onClick={() => {
              this.props.set_editor_simulationEndFieldIds(
                this.props.tileProps.simulationEndFieldIds.concat(0)
              )
            }}>
              <Icon name="add"/>
            </Button>

          </Form>

        </div>

        <Divider/>

        <div>
          <SimulationOverview
            tiles={[tile]}
            gameInitCmdText={this.props.worldCmdText}
            title={'Singe tile simulation'}
            tileSurrogates={null}
            isSingleSimulation={true}
          />
        </div>
      </div>
    )

    let panes = [
      {
        menuItem: getI18n(this.props.langId, "Simulation"),
        render: () => {
          return (
            extendedSimulationOverview
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