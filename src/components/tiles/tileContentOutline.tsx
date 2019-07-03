import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {Button, Icon, List} from 'semantic-ui-react'
import {
  clearAllBorderPoints_connectedLines,
  set_editor_rightTabActiveIndex,
  setSelectedFieldShapeIds,
  setSelectedImageShapeIds,
  setSelectedLineShapeIds
} from "../../state/reducers/tileEditor/actions";
import {
  clearAllConnectedLinesFromAllFields,
  removeFieldShape,
  setPropertyEditor_fieldsShapes
} from "../../state/reducers/tileEditor/fieldProperties/actions";
import {removeLineShape, setPropertyEditor_lineShapes} from "../../state/reducers/tileEditor/lineProperties/actions";
import {removeImageShape, setPropertyEditor_imgShapes} from "../../state/reducers/tileEditor/imgProperties/actions";
import {getI18n} from "../../../i18n/i18nRoot";
import ToolTip from '../helpers/ToolTip'
import {RightTileEditorTabs} from "../../state/reducers/tileEditor/tileEditorReducer";
import {DialogHelper} from "../../helpers/dialogHelper";
import IconToolTip from '../helpers/IconToolTip'
import {renewAllZIndicesInTile} from "../../helpers/someIndexHelper";

//const css = require('./styles.styl');

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    fieldShapes: rootState.tileEditorFieldShapesState.present,
    imgShapes: rootState.tileEditorImgShapesState.present,
    lineShapes: rootState.tileEditorLineShapeState.present,

    selectedFieldShapeIds: rootState.tileEditorState.selectedFieldShapeIds,
    selectedImageShapeIds: rootState.tileEditorState.selectedImageShapeIds,
    selectedLineShapeIds: rootState.tileEditorState.selectedLineShapeIds,

    rightActiveTabIndex: rootState.tileEditorState.rightTabActiveIndex,
    lastRightTabActiveIndex: rootState.tileEditorState.lastRightTabActiveIndex,

    langId: rootState.i18nState.langId
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

  setSelectedFieldShapeIds,
  setSelectedLineShapeIds,
  setSelectedImageShapeIds,


  //for removing many
  setPropertyEditor_fieldsShapes,
  setPropertyEditor_lineShapes,
  clearAllConnectedLinesFromAllFields,
  clearAllBorderPoints_connectedLines,
  setPropertyEditor_imgShapes,

  removeFieldShape,
  removeLineShape,
  removeImageShape,
  set_editor_rightTabActiveIndex,

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

class tileContentOutline extends React.Component<Props, any> {


  openPropertyEditorTabIfNecessary() {
    if (this.props.rightActiveTabIndex !== RightTileEditorTabs.propertyEditorTab) {
      this.props.set_editor_rightTabActiveIndex(RightTileEditorTabs.propertyEditorTab)
    }
  }

  render(): JSX.Element {
    return (
      <div className="property-editor-left">

        <div>
          <IconToolTip iconSize="large" message={getI18n(this.props.langId,
            "Note that almost all operations are much slower when the tile outline is displayed. This is an open issue")}/>
        </div>

        <List divided verticalAlign='middle'>
          <List.Item>
            <List.Icon name='cube'/>
            <List.Content>
              <List.Header>{getI18n(this.props.langId, "Fields")} ({this.props.fieldShapes.length})
                {
                  this.props.fieldShapes.length > 0 &&
                  <ToolTip
                    message={getI18n(this.props.langId, "Delete all fields in tile")}
                  >
                    <Icon style={{marginLeft: '1em'}} name="trash" className="clickable"
                          onClick={async () => {

                            const shouldDelete = await DialogHelper.askDialog(
                              getI18n(this.props.langId, "Delete many shapes"),
                              getI18n(this.props.langId, "Do you really want to delete all fields?"))

                            if (!shouldDelete) return


                            if (this.props.selectedFieldShapeIds.length > 0) {
                              this.props.set_editor_rightTabActiveIndex(this.props.lastRightTabActiveIndex)
                            }

                            this.props.setSelectedImageShapeIds([])
                            this.props.setSelectedLineShapeIds([])
                            //select null else the property editor would try to display the undefined obj
                            this.props.setSelectedFieldShapeIds([])

                            //too slow
                            // for (const item of this.props.fieldShapes) {
                            //   this.props.removeFieldShape(item.id)
                            // }
                            this.props.setPropertyEditor_fieldsShapes([])

                            renewAllZIndicesInTile()
                          }}
                    />
                  </ToolTip>
                }

                {
                  this.props.fieldShapes.length > 0 &&
                  <ToolTip
                    message={getI18n(this.props.langId, "Select all fields in tile")}
                  >
                    <Icon style={{marginLeft: '1em'}} name="mouse pointer" className="clickable"
                          onClick={() => {
                            this.props.setSelectedImageShapeIds([])
                            this.props.setSelectedLineShapeIds([])
                            this.props.setSelectedFieldShapeIds(this.props.fieldShapes.map(p => p.id))
                          }}
                    />
                  </ToolTip>
                }

              </List.Header>
              <List.List>
                {
                  //fields
                  this.props.fieldShapes.map((p, index) => {
                    return (
                      <List.Item key={p.id}
                                 className={['flexed-i', this.props.selectedFieldShapeIds.indexOf(
                                   p.id) !== -1 ? 'tile-outline-selected' : ''].join(
                                   ' ')}>

                        <div className="tile-outline-line-icon">
                          <Icon className="tile-outline-line-icon" name="cube"/>
                        </div>

                        <List.Content>
                          <List.Header>
                            <ToolTip
                              message={getI18n(this.props.langId, "Select shape in tile")}
                            >
                              <Button icon labelPosition='left' size='mini'
                                      onClick={() => {
                                        this.props.setSelectedImageShapeIds([])
                                        this.props.setSelectedLineShapeIds([])
                                        this.props.setSelectedFieldShapeIds([p.id])
                                        this.openPropertyEditorTabIfNecessary()
                                      }}
                              >
                                <Icon name='mouse pointer'/>
                                {p.text} [id: {p.id}]
                              </Button>
                            </ToolTip>

                          </List.Header>
                        </List.Content>

                        <List.Content floated='right'>
                          <Button color="red" icon size='mini'
                                  onClick={() => {
                                    this.props.setSelectedImageShapeIds([])
                                    this.props.setSelectedLineShapeIds([])
                                    this.props.setSelectedFieldShapeIds([])
                                    this.props.removeFieldShape(p.id)

                                    renewAllZIndicesInTile()
                                  }}
                          >
                            <Icon name="trash"/>
                          </Button>
                        </List.Content>

                      </List.Item>
                    )
                  })
                }
              </List.List>
            </List.Content>
          </List.Item>

          <List.Item>
            <List.Icon name='exchange'/>
            <List.Content>
              <List.Header>{getI18n(this.props.langId, "Lines")} ({this.props.lineShapes.length})
                {
                  this.props.lineShapes.length > 0 &&
                  <ToolTip
                    message={getI18n(this.props.langId, "Delete all lines in tile")}
                  >
                    <Icon style={{marginLeft: '1em'}} name="trash" className="clickable"
                          onClick={async () => {

                            const shouldDelete = await DialogHelper.askDialog(
                              getI18n(this.props.langId, "Delete many shapes"),
                              getI18n(this.props.langId, "Do you really want to delete all lines?"))

                            if (!shouldDelete) return

                            if (this.props.selectedLineShapeIds.length > 0) {
                              this.props.set_editor_rightTabActiveIndex(this.props.lastRightTabActiveIndex)
                            }

                            this.props.setSelectedImageShapeIds([])
                            this.props.setSelectedFieldShapeIds([])
                            //select null else the property editor would try to display the undefined obj
                            this.props.setSelectedLineShapeIds([])

                            //too slow
                            // for (const item of this.props.lineShapes) {
                            //   this.props.removeLineShape(item.id)
                            // }

                            //but we need to clear all connected lines maps (from all fields)
                            //because we removed all
                            this.props.setPropertyEditor_lineShapes([])
                            this.props.clearAllConnectedLinesFromAllFields()
                            this.props.clearAllBorderPoints_connectedLines()

                            renewAllZIndicesInTile()
                          }}
                    />
                  </ToolTip>
                }
                {
                  this.props.lineShapes.length > 0 &&
                  <ToolTip
                    message={getI18n(this.props.langId, "Select all lines in tile")}
                  >
                    <Icon style={{marginLeft: '1em'}} name="mouse pointer" className="clickable"
                          onClick={() => {
                            this.props.setSelectedImageShapeIds([])
                            this.props.setSelectedFieldShapeIds([])
                            this.props.setSelectedLineShapeIds(this.props.lineShapes.map(p => p.id))
                          }}
                    />
                  </ToolTip>
                }
              </List.Header>
              <List.List>
                {
                  //lines
                  this.props.lineShapes.map((p, index) => {
                    return (
                      <List.Item key={p.id}
                                 className={['flexed-i', this.props.selectedLineShapeIds.indexOf(
                                   p.id) !== -1 ? 'tile-outline-selected' : ''].join(
                                   ' ')}>


                        <div className="tile-outline-line-icon">
                          <Icon className="tile-outline-line-icon" name="exchange"/>
                        </div>

                        <List.Content>
                          <List.Header>
                            <ToolTip
                              message={getI18n(this.props.langId, "Select shape in tile")}
                            >
                              <Button icon labelPosition='left' size='mini'
                                      onClick={() => {
                                        this.props.setSelectedImageShapeIds([])
                                        this.props.setSelectedFieldShapeIds([])
                                        this.props.setSelectedLineShapeIds([p.id])
                                        this.openPropertyEditorTabIfNecessary()
                                      }}
                              >
                                <Icon name='mouse pointer'/>
                                {getI18n(this.props.langId, "Line, Points")}: {p.points.length + 1} [id: {p.id}]
                              </Button>
                            </ToolTip>
                          </List.Header>
                        </List.Content>

                        <List.Content floated='right'>
                          <Button color="red" icon size='mini'
                                  onClick={() => {
                                    this.props.setSelectedImageShapeIds([])
                                    this.props.setSelectedFieldShapeIds([])
                                    this.props.setSelectedLineShapeIds([])
                                    this.props.removeLineShape(p.id)

                                    renewAllZIndicesInTile()
                                  }}
                          >
                            <Icon name="trash"/>
                          </Button>
                        </List.Content>

                      </List.Item>
                    )
                  })
                }
              </List.List>
            </List.Content>
          </List.Item>

          <List.Item>
            <List.Icon>
              <Icon name="image" style={{verticalAlign: 'top!important'}}/>
            </List.Icon>
            <List.Content>
              <List.Header>{getI18n(this.props.langId, "Images")} ({this.props.imgShapes.length})
                {
                  this.props.imgShapes.length > 0 &&
                  <ToolTip
                    message={getI18n(this.props.langId, "Delete all images in tile")}
                  >
                    <Icon style={{marginLeft: '1em'}} name="trash" className="clickable"
                          onClick={async () => {

                            const shouldDelete = await DialogHelper.askDialog(
                              getI18n(this.props.langId, "Delete many shapes"),
                              getI18n(this.props.langId, "Do you really want to delete all images?"))

                            if (!shouldDelete) return

                            if (this.props.selectedImageShapeIds.length > 0) {
                              this.props.set_editor_rightTabActiveIndex(this.props.lastRightTabActiveIndex)
                            }

                            this.props.setSelectedLineShapeIds([])
                            this.props.setSelectedFieldShapeIds([])
                            //select null else the property editor would try to display the undefined obj
                            this.props.setSelectedImageShapeIds([])
                            //too slow
                            // for (const item of this.props.imgShapes) {
                            //   this.props.removeImageShape(item.id)
                            // }
                            this.props.setPropertyEditor_imgShapes([])
                            renewAllZIndicesInTile()
                          }}
                    />
                  </ToolTip>
                }
                {
                  this.props.imgShapes.length > 0 &&
                  <ToolTip
                    message={getI18n(this.props.langId, "Select all images in tile")}
                  >
                    <Icon style={{marginLeft: '1em'}} name="mouse pointer" className="clickable"
                          onClick={() => {
                            this.props.setSelectedLineShapeIds([])
                            this.props.setSelectedImageShapeIds(this.props.imgShapes.map(p => p.id))
                          }}
                    />
                  </ToolTip>
                }
              </List.Header>
              <List.List>
                {
                  //images
                  this.props.imgShapes.map((p, index) => {
                    return (
                      <List.Item key={p.id}
                                 className={['flexed-i', this.props.selectedImageShapeIds.indexOf(
                                   p.id) !== -1 ? 'tile-outline-selected' : ''].join(
                                   ' ')}>

                        <div className="tile-outline-line-icon">
                          <Icon name="image" style={{verticalTextAlign: 'top!important'}}/>
                        </div>


                        <List.Content>
                          <List.Header>
                            <ToolTip
                              message={getI18n(this.props.langId, "Select shape in tile")}
                            >
                              <Button icon labelPosition='left' size='mini'
                                      onClick={() => {
                                        this.props.setSelectedLineShapeIds([])
                                        this.props.setSelectedImageShapeIds([p.id])
                                        this.openPropertyEditorTabIfNecessary()
                                      }}
                              >
                                <Icon name='mouse pointer'/>
                                {getI18n(this.props.langId, "Image")} {p.id} [id: {p.id}]
                              </Button>
                            </ToolTip>
                          </List.Header>
                        </List.Content>

                        <List.Content floated='right'>

                          <div style={{
                            display: 'inline-block',
                            visibility: p.isMouseSelectionDisabled ? 'initial' : 'collapse'
                          }}>
                            <IconToolTip
                              message={getI18n(this.props.langId, "Is disabled for mouse selection")}
                              iconGroup={
                                <Icon.Group>
                                  <Icon size='large' name='dont'/>
                                  <Icon color='black' name='mouse pointer'/>
                                </Icon.Group>
                              }
                            />
                          </div>

                          <Button color="red" icon size='mini'
                                  onClick={() => {
                                    this.props.setSelectedLineShapeIds([])
                                    this.props.setSelectedImageShapeIds([])
                                    this.props.removeImageShape(p.id)

                                    renewAllZIndicesInTile()
                                  }}
                          >
                            <Icon name="trash"/>
                          </Button>
                        </List.Content>

                      </List.Item>
                    )
                  })
                }
              </List.List>
            </List.Content>
          </List.Item>

        </List>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(tileContentOutline)
