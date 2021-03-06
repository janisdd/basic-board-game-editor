import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {Button, Divider, Form, Icon, Input} from "semantic-ui-react";
import {getI18n} from "../../../i18n/i18nRoot";
import IconToolTip from "../helpers/IconToolTip";
import {SyntheticEvent} from "react";
import SimulationOverview from "./simulationOverview";
import {set_world_tileEditorRightSimulationTabScrollY} from "../../state/reducers/world/actions";
import {
  set_editor_simulationEndFieldIds,
  set_editor_simulationStartFieldIds
} from "../../state/reducers/tileEditor/actions";
import {Tile} from "../../types/world";

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {

    tileProps: rootState.tileEditorState.tileProps,
    fieldShapes: rootState.tileEditorFieldShapesState.present,
    worldCmdText: rootState.worldSettingsState.worldCmdText,

    tileEditorRightSimulationTabScrollY: rootState.worldState.tileEditorRightSimulationTabScrollY,

    langId: rootState.i18nState.langId,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

  set_editor_simulationStartFieldIds,
  set_editor_simulationEndFieldIds,

  set_world_tileEditorRightSimulationTabScrollY,

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;


class TileSimulationView extends React.Component<Props, any> {

  scrollHost: HTMLDivElement | null = null
  scrollHandler: (e: Event) => void

  componentDidMount(): void {

    if (this.scrollHost) {
      this.scrollHandler = this.onScroll.bind(this)
      this.scrollHost.addEventListener('scroll', this.scrollHandler)

      this.scrollHost.scrollTop = this.props.tileEditorRightSimulationTabScrollY
    }

  }

  componentWillUnmount(): void {
    if (this.scrollHost) {
      this.scrollHost.removeEventListener('scroll', this.scrollHandler)
    }
  }

  onScroll(e: Event) {
    this.props.set_world_tileEditorRightSimulationTabScrollY(this.scrollHost.scrollTop)
  }

  render(): JSX.Element {

    const tile: Tile = {
      ...this.props.tileProps,
      guid: '"single tile simulation"',
      imgShapes: [],
      lineShapes: [],
      fieldShapes: this.props.fieldShapes
    }

    return (
      <div ref={r => this.scrollHost = r} className="property-editor-right">
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(TileSimulationView)