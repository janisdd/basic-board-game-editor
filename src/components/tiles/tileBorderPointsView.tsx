import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {Button, Divider, Form, Icon, Input} from "semantic-ui-react";
import {getNextShapeId} from "../../state/reducers/tileEditor/fieldProperties/fieldPropertyReducer";
import {BorderPoint} from "../../types/drawing";
import {SyntheticEvent} from "react";
import {
  set_editor_botBorderPoints,
  set_editor_leftBorderPoints,
  set_editor_rightBorderPoint, set_editor_topBorderPoints
} from "../../state/reducers/tileEditor/actions";
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
                            <IconToolTip message={ getI18n(this.props.langId, "The next field/border point id is used for simulation to know where we need to go next if we step on this border point")} />
                          </label>
                          <Input type="number" placeholder='' value={point.nextFieldId === null ? '' : point.nextFieldId} style={{width: '135px'}}
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
                    </div>
                  )
                })

              }

              <Button icon color="green"
                      onClick={() => {
                        const newPoint: BorderPoint = {
                          id: getNextShapeId(),
                          val: 100,
                          nextFieldId: null,
                        }
                        this.props.set_editor_topBorderPoints(
                          this.props.tileProps.topBorderPoints.concat(newPoint))
                      }}
              >
                <Icon name="add"/>
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
                                     ))

                                 }}
                          />
                          <Button icon color="red"
                                  onClick={() => {
                                    this.props.set_editor_botBorderPoints(
                                      this.props.tileProps.botBorderPoints.filter(p => p.id !== point.id))
                                  }}
                          >
                            <Icon name="x"/>
                          </Button>
                        </Form.Field>

                        <Form.Field>
                          <label>{getI18n(this.props.langId, "Next (field) id or empty")}
                            <IconToolTip message={ getI18n(this.props.langId, "The next field/border point id is used for simulation to know where we need to go next if we step on this border point")} />
                          </label>
                          <Input type="number" placeholder='' value={point.nextFieldId === null ? '' : point.nextFieldId} style={{width: '135px'}}
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
                                       ))
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
                                     ))
                                 }}
                          />
                        </Form.Field>
                      </Form.Group>
                    </div>
                  )
                })

              }

              <Button icon color="green"
                      onClick={() => {
                        const newPoint: BorderPoint = {
                          id: getNextShapeId(),
                          val: 100,
                          nextFieldId: null,
                        }
                        this.props.set_editor_botBorderPoints(
                          this.props.tileProps.botBorderPoints.concat(newPoint))
                      }}
              >
                <Icon name="add"/>
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
                            <IconToolTip message={ getI18n(this.props.langId, "The next field/border point id is used for simulation to know where we need to go next if we step on this border point")} />
                          </label>
                          <Input type="number" placeholder='' value={point.nextFieldId === null ? '' : point.nextFieldId} style={{width: '135px'}}
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
                    </div>
                  )
                })

              }

              <Button icon color="green"
                      onClick={() => {
                        const newPoint: BorderPoint = {
                          id: getNextShapeId(),
                          val: 100,
                          nextFieldId: null,
                        }
                        this.props.set_editor_leftBorderPoints(
                          this.props.tileProps.leftBorderPoints.concat(newPoint))
                      }}
              >
                <Icon name="add"/>
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
                                     ))

                                 }}
                          />
                          <Button icon color="red"
                                  onClick={() => {
                                    this.props.set_editor_rightBorderPoint(
                                      this.props.tileProps.rightBorderPoint.filter(p => p.id !== point.id))
                                  }}
                          >
                            <Icon name="x"/>
                          </Button>
                        </Form.Field>

                        <Form.Field>
                          <label>{getI18n(this.props.langId, "Next (field) id or empty")}
                            <IconToolTip message={ getI18n(this.props.langId, "The next field/border point id is used for simulation to know where we need to go next if we step on this border point")} />
                          </label>
                          <Input type="number" placeholder='' value={point.nextFieldId === null ? '' : point.nextFieldId} style={{width: '135px'}}
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
                                       ))
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
                                     ))
                                 }}
                          />
                        </Form.Field>
                      </Form.Group>
                    </div>
                  )
                })

              }

              <Button icon color="green"
                      onClick={() => {
                        const newPoint: BorderPoint = {
                          id: getNextShapeId(),
                          val: 100,
                          nextFieldId: null
                        }
                        this.props.set_editor_rightBorderPoint(
                          this.props.tileProps.rightBorderPoint.concat(newPoint))
                      }}
              >
                <Icon name="add"/>
              </Button>
            </div>

          </div>

        </Form>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(tileBorderPointsView)
