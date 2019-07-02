import * as React from "react";
import {SyntheticEvent} from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {Button, Divider, Form, Icon, Input, List} from "semantic-ui-react";
import {getNextShapeId} from "../../state/reducers/tileEditor/fieldProperties/fieldPropertyReducer";
import {BorderPoint} from "../../types/drawing";
import {
  set_editor_botBorderPoints,
  set_editor_leftBorderPoints,
  set_editor_rightBorderPoint,
  set_editor_rightTabActiveIndex,
  set_editor_topBorderPoints,
  setSelectedFieldShapeIds,
  setSelectedImageShapeIds,
  setSelectedLineShapeIds
} from "../../state/reducers/tileEditor/actions";
import {getI18n, KnownLangs} from "../../../i18n/i18nRoot";
import IconToolTip from "../helpers/IconToolTip";
import ToolTip from "../helpers/ToolTip";
import {Logger} from "../../helpers/logger";
import {RightTileEditorTabs} from "../../state/reducers/tileEditor/tileEditorReducer";

//const css = require('./styles.styl');

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    tileProps: rootState.tileEditorState.tileProps,
    langId: rootState.i18nState.langId
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

  set_editor_topBorderPoints,
  set_editor_botBorderPoints,
  set_editor_leftBorderPoints,
  set_editor_rightBorderPoint,

  setSelectedFieldShapeIds,
  setSelectedImageShapeIds,
  setSelectedLineShapeIds,
  set_editor_rightTabActiveIndex,

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

class tileBorderPointsView extends React.Component<Props, any> {

  render(): JSX.Element {
    return (
      <div className="property-editor-right">


        <Form as="div">

          {
            //border points
          }
          <div>


            <h3>{getI18n(this.props.langId, "Top border points")}</h3>
            <div>
              {
                this.props.tileProps.topBorderPoints.map((point, index) => {
                  return (
                    <div key={point.id}>
                      <Form.Field>
                        <p>{getI18n(this.props.langId, "Id")}: {point.id}</p>
                      </Form.Field>
                      <Form.Group widths='equal'>
                        <Form.Field>
                          <label>{getI18n(this.props.langId, "Absolute pos in px")}</label>
                          <Input type="number" placeholder='250' value={point.val}
                                 style={{width: '100px'}}
                                 onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                   const val = parseInt(e.currentTarget.value)

                                   this.props.set_editor_topBorderPoints(
                                     this.props.tileProps.topBorderPoints.map(p =>
                                       p.id !== point.id
                                         ? p
                                         : {
                                           ...point,
                                           val
                                         }
                                     ))

                                 }}
                          />
                          <Button icon color="red"
                                  onClick={() => {
                                    this.props.set_editor_topBorderPoints(
                                      this.props.tileProps.topBorderPoints.filter(p => p.id !== point.id))
                                  }}
                          >
                            <Icon name="x"/>
                          </Button>
                        </Form.Field>

                        <Form.Field>
                          <label>{getI18n(this.props.langId, "Next (field) id or empty")}
                            <IconToolTip
                              message={getI18n(this.props.langId, "The next field/border point id is used for simulation to know where we need to go next if we step on this border point")}/>
                          </label>
                          <Input type="number" placeholder=''
                                 value={point.nextFieldId === null ? '' : point.nextFieldId} style={{width: '135px'}}
                                 onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                   const nextFieldId = parseInt(e.currentTarget.value)

                                   if (isNaN(nextFieldId)) {

                                     this.props.set_editor_topBorderPoints(
                                       this.props.tileProps.topBorderPoints.map(p =>
                                         p.id !== point.id
                                           ? p
                                           : {
                                             ...point,
                                             nextFieldId: null
                                           }
                                       ))
                                     return
                                   }

                                   this.props.set_editor_topBorderPoints(
                                     this.props.tileProps.topBorderPoints.map(p =>
                                       p.id !== point.id
                                         ? p
                                         : {
                                           ...point,
                                           nextFieldId
                                         }
                                     ))
                                 }}
                          />
                        </Form.Field>
                      </Form.Group>
                      {
                        createBorderPointConnectedLinesList(this.props.langId, point, "top", this.props)
                      }
                    </div>
                  )
                })

              }

              <Button icon color="green" labelPosition='left' className="mar-top"
                      onClick={() => {
                        const newPoint: BorderPoint = {
                          id: getNextShapeId(),
                          val: 100,
                          nextFieldId: null,
                          connectedLineTuples: [],
                        }
                        this.props.set_editor_topBorderPoints(
                          this.props.tileProps.topBorderPoints.concat(newPoint))
                      }}
              >
                <Icon name="add"/>
                <span>{getI18n(this.props.langId, "Add border point")}</span>
              </Button>
            </div>
            <Divider/>

            <h3>{getI18n(this.props.langId, "Bottom border points")}</h3>
            <div>
              {
                this.props.tileProps.botBorderPoints.map((point, index) => {
                  return (
                    <div key={point.id}>
                      <Form.Field>
                        <p>{getI18n(this.props.langId, "Id")}: {point.id}</p>
                      </Form.Field>
                      <Form.Group widths='equal'>
                        <Form.Field>
                          <label>{getI18n(this.props.langId, "Absolute pos in px")}</label>
                          <Input type="number" placeholder='250' value={point.val}
                                 style={{width: '100px'}}
                                 onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                   const val = parseInt(e.currentTarget.value)

                                   this.props.set_editor_botBorderPoints(
                                     this.props.tileProps.botBorderPoints.map(p =>
                                       p.id !== point.id
                                         ? p
                                         : {
                                           ...point,
                                           val
                                         }
                                     ), this.props.tileProps.tileSettings.height)

                                 }}
                          />
                          <Button icon color="red"
                                  onClick={() => {
                                    this.props.set_editor_botBorderPoints(
                                      this.props.tileProps.botBorderPoints.filter(p => p.id !== point.id),
                                      this.props.tileProps.tileSettings.height)
                                  }}
                          >
                            <Icon name="x"/>
                          </Button>
                        </Form.Field>

                        <Form.Field>
                          <label>{getI18n(this.props.langId, "Next (field) id or empty")}
                            <IconToolTip
                              message={getI18n(this.props.langId, "The next field/border point id is used for simulation to know where we need to go next if we step on this border point")}/>
                          </label>
                          <Input type="number" placeholder=''
                                 value={point.nextFieldId === null ? '' : point.nextFieldId} style={{width: '135px'}}
                                 onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                   const nextFieldId = parseInt(e.currentTarget.value)

                                   if (isNaN(nextFieldId)) {

                                     this.props.set_editor_botBorderPoints(
                                       this.props.tileProps.botBorderPoints.map(p =>
                                         p.id !== point.id
                                           ? p
                                           : {
                                             ...point,
                                             nextFieldId: null
                                           }
                                       ), this.props.tileProps.tileSettings.height)
                                     return
                                   }

                                   this.props.set_editor_botBorderPoints(
                                     this.props.tileProps.botBorderPoints.map(p =>
                                       p.id !== point.id
                                         ? p
                                         : {
                                           ...point,
                                           nextFieldId
                                         }
                                     ), this.props.tileProps.tileSettings.height)
                                 }}
                          />
                        </Form.Field>
                      </Form.Group>

                      {
                        createBorderPointConnectedLinesList(this.props.langId, point, "bottom", this.props)
                      }
                    </div>
                  )
                })

              }

              <Button icon color="green" labelPosition='left' className="mar-top"
                      onClick={() => {
                        const newPoint: BorderPoint = {
                          id: getNextShapeId(),
                          val: 100,
                          nextFieldId: null,
                          connectedLineTuples: [],
                        }
                        this.props.set_editor_botBorderPoints(
                          this.props.tileProps.botBorderPoints.concat(newPoint), this.props.tileProps.tileSettings.height)
                      }}
              >
                <Icon name="add"/>
                <span>{getI18n(this.props.langId, "Add border point")}</span>
              </Button>
            </div>
            <Divider/>

            <h3>{getI18n(this.props.langId, "Left border points")}</h3>
            <div>
              {
                this.props.tileProps.leftBorderPoints.map((point, index) => {
                  return (
                    <div key={point.id}>
                      <Form.Field>
                        <p>{getI18n(this.props.langId, "Id")}: {point.id}</p>
                      </Form.Field>
                      <Form.Group widths='equal'>
                        <Form.Field>
                          <label>{getI18n(this.props.langId, "Absolute pos in px")}</label>
                          <Input type="number" placeholder='250' value={point.val}
                                 style={{width: '100px'}}
                                 onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                   const val = parseInt(e.currentTarget.value)

                                   this.props.set_editor_leftBorderPoints(
                                     this.props.tileProps.leftBorderPoints.map(p =>
                                       p.id !== point.id
                                         ? p
                                         : {
                                           ...point,
                                           val
                                         }
                                     ))

                                 }}
                          />
                          <Button icon color="red"
                                  onClick={() => {
                                    this.props.set_editor_leftBorderPoints(
                                      this.props.tileProps.leftBorderPoints.filter(p => p.id !== point.id))
                                  }}
                          >
                            <Icon name="x"/>
                          </Button>
                        </Form.Field>

                        <Form.Field>
                          <label>{getI18n(this.props.langId, "Next (field) id or empty")}
                            <IconToolTip
                              message={getI18n(this.props.langId, "The next field/border point id is used for simulation to know where we need to go next if we step on this border point")}/>
                          </label>
                          <Input type="number" placeholder=''
                                 value={point.nextFieldId === null ? '' : point.nextFieldId} style={{width: '135px'}}
                                 onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                   const nextFieldId = parseInt(e.currentTarget.value)

                                   if (isNaN(nextFieldId)) {

                                     this.props.set_editor_leftBorderPoints(
                                       this.props.tileProps.leftBorderPoints.map(p =>
                                         p.id !== point.id
                                           ? p
                                           : {
                                             ...point,
                                             nextFieldId: null
                                           }
                                       ))
                                     return
                                   }

                                   this.props.set_editor_leftBorderPoints(
                                     this.props.tileProps.leftBorderPoints.map(p =>
                                       p.id !== point.id
                                         ? p
                                         : {
                                           ...point,
                                           nextFieldId
                                         }
                                     ))
                                 }}
                          />
                        </Form.Field>
                      </Form.Group>

                      {
                        createBorderPointConnectedLinesList(this.props.langId, point, "left", this.props)
                      }

                    </div>
                  )
                })

              }

              <Button icon color="green" labelPosition='left' className="mar-top"
                      onClick={() => {
                        const newPoint: BorderPoint = {
                          id: getNextShapeId(),
                          val: 100,
                          nextFieldId: null,
                          connectedLineTuples: [],
                        }
                        this.props.set_editor_leftBorderPoints(
                          this.props.tileProps.leftBorderPoints.concat(newPoint))
                      }}
              >
                <Icon name="add"/>
                <span>{getI18n(this.props.langId, "Add border point")}</span>
              </Button>
            </div>
            <Divider/>

            <h3>{getI18n(this.props.langId, "Right border points")}</h3>
            <div>
              {
                this.props.tileProps.rightBorderPoint.map((point, index) => {
                  return (
                    <div key={point.id}>
                      <Form.Field>
                        <p>{getI18n(this.props.langId, "Id")}: {point.id}</p>
                      </Form.Field>
                      <Form.Group widths='equal'>
                        <Form.Field>
                          <label>{getI18n(this.props.langId, "Absolute pos in px")}</label>
                          <Input type="number" placeholder='250' value={point.val}
                                 style={{width: '100px'}}
                                 onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                   const val = parseInt(e.currentTarget.value)

                                   this.props.set_editor_rightBorderPoint(
                                     this.props.tileProps.rightBorderPoint.map(p =>
                                       p.id !== point.id
                                         ? p
                                         : {
                                           ...point,
                                           val
                                         }
                                     ), this.props.tileProps.tileSettings.width)

                                 }}
                          />
                          <Button icon color="red"
                                  onClick={() => {
                                    this.props.set_editor_rightBorderPoint(
                                      this.props.tileProps.rightBorderPoint.filter(p => p.id !== point.id), this.props.tileProps.tileSettings.width)
                                  }}
                          >
                            <Icon name="x"/>
                          </Button>
                        </Form.Field>

                        <Form.Field>
                          <label>{getI18n(this.props.langId, "Next (field) id or empty")}
                            <IconToolTip
                              message={getI18n(this.props.langId, "The next field/border point id is used for simulation to know where we need to go next if we step on this border point")}/>
                          </label>
                          <Input type="number" placeholder=''
                                 value={point.nextFieldId === null ? '' : point.nextFieldId} style={{width: '135px'}}
                                 onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                                   const nextFieldId = parseInt(e.currentTarget.value)

                                   if (isNaN(nextFieldId)) {

                                     this.props.set_editor_rightBorderPoint(
                                       this.props.tileProps.rightBorderPoint.map(p =>
                                         p.id !== point.id
                                           ? p
                                           : {
                                             ...point,
                                             nextFieldId: null
                                           }
                                       ), this.props.tileProps.tileSettings.width)
                                     return
                                   }

                                   this.props.set_editor_rightBorderPoint(
                                     this.props.tileProps.rightBorderPoint.map(p =>
                                       p.id !== point.id
                                         ? p
                                         : {
                                           ...point,
                                           nextFieldId
                                         }
                                     ), this.props.tileProps.tileSettings.width)
                                 }}
                          />
                        </Form.Field>
                      </Form.Group>

                      {
                        createBorderPointConnectedLinesList(this.props.langId, point, "right", this.props)
                      }

                    </div>
                  )
                })

              }

              <Button icon color="green" labelPosition='left' className="mar-top"
                      onClick={() => {
                        const newPoint: BorderPoint = {
                          id: getNextShapeId(),
                          val: 100,
                          nextFieldId: null,
                          connectedLineTuples: [],
                        }
                        this.props.set_editor_rightBorderPoint(
                          this.props.tileProps.rightBorderPoint.concat(newPoint), this.props.tileProps.tileSettings.width)
                      }}
              >
                <Icon name="add"/>
                <span>{getI18n(this.props.langId, "Add border point")}</span>
              </Button>
            </div>

          </div>

        </Form>

      </div>
    )
  }
}


function createBorderPointConnectedLinesList(langId: KnownLangs, borderPoint: BorderPoint, direction: "top" | "bottom" | "left" | "right",
                                             self: Props): JSX.Element {

  return (
    <div>
      <label>{getI18n(langId, "Connected lines")}
        <IconToolTip message={getI18n(langId, "The connected lines via this anchor points")}/>
      </label>

      {
        borderPoint.connectedLineTuples.length > 0 &&
        <List divided verticalAlign='middle'>
          {
            borderPoint.connectedLineTuples.map((value, _index) => {
              return (
                <List.Item key={_index}>

                  <List.Content>
                    <ToolTip
                      message={getI18n(langId, "Select shape in tile")}
                    >
                      <Button icon labelPosition='left' size='mini'
                              onClick={() => {
                                self.setSelectedFieldShapeIds([])
                                self.setSelectedImageShapeIds([])
                                self.setSelectedLineShapeIds([value.lineId])
                                self.set_editor_rightTabActiveIndex(RightTileEditorTabs.propertyEditorTab)
                              }}
                      >
                        <Icon name='mouse pointer'/>
                        {getI18n(langId, "Line, Points")} id: {value.lineId} (via point
                        id: {value.pointId})
                      </Button>
                    </ToolTip>

                    <Button className="mar-left-half" color="red" icon size='mini'
                            onClick={() => {


                              switch (direction) {
                                case "top": {
                                  const tmp = self.tileProps.topBorderPoints.map(p => {
                                    return p.id !== borderPoint.id
                                      ? p
                                      : {
                                        ...p,
                                        connectedLineTuples: p.connectedLineTuples.filter(k => k.lineId !== value.lineId || k.pointId !== value.pointId)
                                      }
                                  })

                                  self.set_editor_topBorderPoints(tmp)
                                  break;
                                }
                                case "bottom": {
                                  const tmp = self.tileProps.botBorderPoints.map(p => {
                                    return p.id !== borderPoint.id
                                      ? p
                                      : {
                                        ...p,
                                        connectedLineTuples: p.connectedLineTuples.filter(k => k.lineId !== value.lineId || k.pointId !== value.pointId)
                                      }
                                  })

                                  self.set_editor_botBorderPoints(tmp, self.tileProps.tileSettings.height)
                                  break;
                                }

                                case "left": {
                                  const tmp = self.tileProps.leftBorderPoints.map(p => {
                                    return p.id !== borderPoint.id
                                      ? p
                                      : {
                                        ...p,
                                        connectedLineTuples: p.connectedLineTuples.filter(k => k.lineId !== value.lineId || k.pointId !== value.pointId)
                                      }
                                  })

                                  self.set_editor_leftBorderPoints(tmp)
                                  break;
                                }

                                case "right": {
                                  const tmp = self.tileProps.rightBorderPoint.map(p => {
                                    return p.id !== borderPoint.id
                                      ? p
                                      : {
                                        ...p,
                                        connectedLineTuples: p.connectedLineTuples.filter(k => k.lineId !== value.lineId || k.pointId !== value.pointId)
                                      }
                                  })

                                  self.set_editor_rightBorderPoint(tmp, self.tileProps.tileSettings.width)
                                  break;
                                }
                                default:
                                  Logger.fatal('not implemented')
                              }

                            }}
                    >
                      <Icon name="x"/>
                    </Button>

                  </List.Content>


                </List.Item>
              )
            })
          }
        </List>
      }

      <Divider/>

    </div>
  )
}

export default connect(mapStateToProps, mapDispatchToProps)(tileBorderPointsView)
