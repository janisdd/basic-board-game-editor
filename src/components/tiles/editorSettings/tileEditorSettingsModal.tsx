import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../../state/index";
import {Checkbox, Input, Form, Button, Icon, Divider, Modal, Dropdown, DropdownItemProps} from 'semantic-ui-react'
import {
  set_editor_arePrintGuidesDisplayed,
  set_editor_autoIncrementFieldTextNumbersOnDuplicate,
  set_editor_botBorderPoints, set_editor_insertLinesEvenIfFieldsIntersect,
  set_editor_isTileEditorSettingsModalDisplayed,
  set_editor_leftBorderPoints,
  set_editor_majorLineDirectionAction,
  set_editor_rightBorderPoint,
  set_editor_stageOffsetScaleCorrection,
  set_editor_topBorderPoints,
  setEditor_gridSizeInPx,
  setEditor_moveControlPointWhenPointIsMoved,
  setEditor_printLargeTilePreferredHeightInPx,
  setEditor_printLargeTilePreferredWidthInPx,
  setEditor_showGrid,
  setEditor_showSequenceIds,
  setEditor_snapToGrid,
  setEditor_splitLargeTileForPrint,
  setEditor_stageOffset,
  setEditor_stageScale,
  setEditor_tileDisplayName,
  setEditor_tileHeight,
  setEditor_tileWidth
} from "../../../state/reducers/tileEditor/actions";
import {SyntheticEvent} from "react";
import {CheckboxData} from "../../../types/ui";
import {
  defaultTileHeight,
  defaultTileWidth
} from "../../../constants";
import {getI18n} from "../../../../i18n/i18nRoot";
import IconToolTip from "../../helpers/IconToolTip";
import {MajorLineDirection} from "../../../types/world";

//const css = require('./styles.styl');

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    //test0: rootState...
    //test: props.test
    settings: rootState.tileEditorState,
    tileProps: rootState.tileEditorState.tileProps,
    langId: rootState.i18nState.langId
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  //imported reducer funcs here

  setEditor_moveControlPointWhenPointIsMoved,
  setEditor_gridSizeInPx,
  setEditor_showGrid,
  setEditor_snapToGrid,
  setEditor_showSequenceIds,

  set_editor_stageOffsetScaleCorrection,
  setEditor_stageOffset,
  setEditor_stageScale,

  setEditor_tileWidth,
  setEditor_tileHeight,

  setEditor_printLargeTilePreferredWidthInPx,
  setEditor_printLargeTilePreferredHeightInPx,

  setEditor_splitLargeTileForPrint,

  setEditor_tileDisplayName,

  set_editor_isTileEditorSettingsModalDisplayed,
  set_editor_autoIncrementFieldTextNumbersOnDuplicate,
  set_editor_majorLineDirectionAction,
  set_editor_arePrintGuidesDisplayed,
  set_editor_insertLinesEvenIfFieldsIntersect,

}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;

class tileEditorSettingsModal extends React.Component<Props, any> {
  render(): JSX.Element {

    const majorLineDirectionOptions: DropdownItemProps[] = [
      {
        text: getI18n(this.props.langId, "top to bottom"),
        value: MajorLineDirection.topToBottom
      },
      {
        text: getI18n(this.props.langId, "bottom to top"),
        value: MajorLineDirection.bottomToTop
      },
      {
        text: getI18n(this.props.langId, "left to right"),
        value: MajorLineDirection.leftToRight
      },
      {
        text: getI18n(this.props.langId, "right to left"),
        value: MajorLineDirection.rightToLeft
      }
    ]

    return (
      <div>
        <Modal closeIcon={true} centered={false}
               open={this.props.settings.isTileEditorSettingsModalDisplayed}
               onClose={() => {
                 this.props.set_editor_isTileEditorSettingsModalDisplayed(false)
               }}
               size="large"
        >
          <Modal.Header>{getI18n(this.props.langId, "Tile settings")}</Modal.Header>
          <Modal.Content>

            <Form as="div">


              <Form.Field>
                <label>{getI18n(this.props.langId, "Tile name")}</label>
                <Input type="text" placeholder='tile basic' value={this.props.tileProps.tileSettings.displayName}
                       style={{width: '150px'}}
                       onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                         this.props.setEditor_tileDisplayName(e.currentTarget.value)
                       }}
                />
              </Form.Field>

              <Form.Field>
                <label>{getI18n(this.props.langId, "Tile auto insert line direction")}
                  <IconToolTip message={getI18n(this.props.langId,
                    "When automatic inserting lines from the commands how the main flow is (where to connect the ingoing & outgoing lines to the shapes)")}/>
                </label>
                <Dropdown placeholder='Select Friend' fluid selection options={majorLineDirectionOptions}
                          value={this.props.settings.tileProps.tileSettings.majorLineDirection}
                          onChange={(event: SyntheticEvent<HTMLSelectElement>, data: { value: MajorLineDirection }) => {
                            this.props.set_editor_majorLineDirectionAction(data.value)
                          }}
                />
              </Form.Field>

              <Form.Field>
                <Checkbox
                  label={getI18n(this.props.langId, "Insert lines even if fields intersect")}
                  checked={this.props.settings.tileProps.tileSettings.insertLinesEvenIfFieldsIntersect}
                  onChange={(e: SyntheticEvent<HTMLInputElement>, data: CheckboxData) => {
                    this.props.set_editor_insertLinesEvenIfFieldsIntersect(data.checked)
                  }}
                />
              </Form.Field>

              <Form.Field>
                <Checkbox label={getI18n(this.props.langId, "Show grid")} checked={this.props.settings.tileProps.tileSettings.showGrid}
                          onChange={(e: SyntheticEvent<HTMLInputElement>, data: CheckboxData) => {
                            this.props.setEditor_showGrid(data.checked)
                          }}
                />
              </Form.Field>
              <Form.Field>
                <label>{getI18n(this.props.langId, "Grid size in px")}</label>
                <Input type="number" placeholder='10' value={this.props.settings.tileProps.tileSettings.gridSizeInPx}
                       style={{width: '100px'}}
                       onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                         this.props.setEditor_gridSizeInPx(parseInt(e.currentTarget.value))
                       }}
                />
              </Form.Field>

              <Form.Field>
                <Checkbox label={getI18n(this.props.langId, "Snap to Grid")} checked={this.props.settings.tileProps.tileSettings.snapToGrid}
                          onChange={(e: SyntheticEvent<HTMLInputElement>, data: CheckboxData) => {
                            this.props.setEditor_snapToGrid(data.checked)
                          }}
                />
              </Form.Field>

              <Form.Field>
                <Checkbox label={getI18n(this.props.langId, "Show field ids")}
                          checked={this.props.settings.tileProps.tileSettings.showSequenceIds}
                          onChange={(e: SyntheticEvent<HTMLInputElement>, data: CheckboxData) => {
                            this.props.setEditor_showSequenceIds(data.checked)
                          }}
                />
              </Form.Field>

              <Form.Field>
                <Checkbox label={getI18n(this.props.langId, "Move control points when line is moved")}
                          checked={this.props.settings.tileProps.tileSettings.moveBezierControlPointsWhenLineIsMoved}
                          onChange={(e: SyntheticEvent<HTMLInputElement>, data: CheckboxData) => {
                            this.props.setEditor_moveControlPointWhenPointIsMoved(data.checked)
                          }}
                />
              </Form.Field>

              <Form.Field>
                <Checkbox label={getI18n(this.props.langId, "Split tile into smaller pieces")}
                          checked={this.props.settings.tileProps.tileSettings.splitLargeTileForPrint}
                          onChange={(e: SyntheticEvent<HTMLInputElement>, data: CheckboxData) => {
                            this.props.setEditor_splitLargeTileForPrint(data.checked)
                          }}
                />
                <IconToolTip
                  message={getI18n(this.props.langId,
                    "If enabled and the tile size is larger than the print tile size then the tile will be split into smaller pieces when printing. When disabled the printing tab will display the tile as one image")}
                />
              </Form.Field>

              <Form.Group widths='equal'>
                <Form.Field>
                  <label>{getI18n(this.props.langId, "Tile width")}</label>
                  <Input type="number" placeholder={defaultTileWidth} value={this.props.tileProps.tileSettings.width}
                         step="10" min="10"
                         style={{width: '100px'}}
                         onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                           const val = parseInt(e.currentTarget.value)
                           this.props.setEditor_tileWidth(val)
                         }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>{getI18n(this.props.langId, "Tile height")}</label>
                  <Input type="number" placeholder={defaultTileHeight} value={this.props.tileProps.tileSettings.height}
                         step="10" min="10"
                         style={{width: '100px'}}
                         onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                           const val = parseInt(e.currentTarget.value)
                           this.props.setEditor_tileHeight(val)
                         }}
                  />
                </Form.Field>
                <Form.Field>
                  <Button icon
                          onClick={() => {
                            this.props.setEditor_tileWidth(defaultTileWidth)
                            this.props.setEditor_tileHeight(defaultTileHeight)
                          }}>
                    <Icon name="undo"/>
                  </Button>
                </Form.Field>
              </Form.Group>

              <Form.Group widths='equal'>
                <Form.Field>
                  <label>{getI18n(this.props.langId, "Print tile width in px")}
                  <IconToolTip message={getI18n(this.props.langId, "The print tile size specifies the size of the images that will be printed. If the size is small than the actual tile size the tile is split into smaller pieces (if enabled)")} />
                  </label>
                  <Input type="number" placeholder="500"
                         value={this.props.settings.tileProps.tileSettings.printLargeTilePreferredWidthInPx}
                         step="10" min="10"
                         style={{width: '100px'}}
                         onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                           let val = parseInt(e.currentTarget.value)

                           //if we disable this check the img will be larger but the area where we draw will still be just
                           //the actual tile dimension...
                           if (val > this.props.tileProps.tileSettings.width) {
                             val = this.props.tileProps.tileSettings.width
                           }

                           this.props.setEditor_printLargeTilePreferredWidthInPx(val)
                         }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>{getI18n(this.props.langId, "Print tile height in px")}
                    <IconToolTip message={getI18n(this.props.langId, "The print tile size specifies the size of the images that will be printed. If the size is small than the actual tile size the tile is split into smaller pieces (if enabled)")} />
                  </label>
                  <Input type="number" placeholder="500"
                         value={this.props.settings.tileProps.tileSettings.printLargeTilePreferredHeightInPx}
                         step="10" min="10"
                         style={{width: '100px'}}
                         onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                           let val = parseInt(e.currentTarget.value)

                           //if we disable this check the img will be larger but the area where we draw will still be just
                           //the actual tile dimension...
                           if (val > this.props.tileProps.tileSettings.height) {
                             val = this.props.tileProps.tileSettings.height
                           }

                           this.props.setEditor_printLargeTilePreferredHeightInPx(val)
                         }}
                  />
                </Form.Field>
                <Form.Field>
                  <Button icon
                          onClick={() => {
                            this.props.setEditor_printLargeTilePreferredWidthInPx(500)
                            this.props.setEditor_printLargeTilePreferredHeightInPx(500)
                          }}>
                    <Icon name="undo"/>
                  </Button>
                </Form.Field>
              </Form.Group>


              <Form.Field>
                <Checkbox
                  label={getI18n(this.props.langId, "Auto increment field text that contain numbers on duplication")}
                  checked={this.props.settings.tileProps.tileSettings.autoIncrementFieldTextNumbersOnDuplicate}
                  onChange={(e: SyntheticEvent<HTMLInputElement>, data: CheckboxData) => {
                    this.props.set_editor_autoIncrementFieldTextNumbersOnDuplicate(data.checked)
                  }}
                />
              </Form.Field>

              <Form.Field>
                <Checkbox
                  label={getI18n(this.props.langId, "Display print guides")}
                  checked={this.props.settings.tileProps.tileSettings.arePrintGuidesDisplayed}
                  onChange={(e: SyntheticEvent<HTMLInputElement>, data: CheckboxData) => {
                    this.props.set_editor_arePrintGuidesDisplayed(data.checked)
                  }}
                />
              </Form.Field>


            </Form>

          </Modal.Content>
        </Modal>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(tileEditorSettingsModal)