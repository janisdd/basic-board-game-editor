import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../../state/index";
import {Checkbox, Input, Form, Button, Icon, Divider, Modal, Dropdown, DropdownItemProps} from 'semantic-ui-react'
import {
  set_editor_arePrintGuidesDisplayed,
  set_editor_autoIncrementFieldTextNumbersOnDuplicate,
  set_editor_botBorderPoints,
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
  defaultTileWidth,
  globalMinimalZoom,
  globalZoomStep,
  maxPrintTileHeight,
  maxPrintTileWidth
} from "../../../constants";
import {BorderPoint} from "../../../types/drawing";
import {getNextShapeId} from "../../../state/reducers/tileEditor/fieldProperties/fieldPropertyReducer";
import {MajorLineDirection} from "../../../state/reducers/tileEditor/tileEditorReducer";
import {getI18n} from "../../../../i18n/i18nRoot";
import IconToolTip from "../../helpers/IconToolTip";

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
                <Input type="text" placeholder='tile basic' value={this.props.tileProps.displayName}
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
                          value={this.props.settings.majorLineDirection}
                          onChange={(event: SyntheticEvent<HTMLSelectElement>, data: { value: MajorLineDirection }) => {
                            this.props.set_editor_majorLineDirectionAction(data.value)
                          }}
                />
              </Form.Field>

              <Form.Field>
                <Checkbox label={getI18n(this.props.langId, "Show grid")} checked={this.props.settings.showGrid}
                          onChange={(e: SyntheticEvent<HTMLInputElement>, data: CheckboxData) => {
                            this.props.setEditor_showGrid(data.checked)
                          }}
                />
              </Form.Field>
              <Form.Field>
                <label>{getI18n(this.props.langId, "Grid size in px")}</label>
                <Input type="number" placeholder='10' value={this.props.settings.gridSizeInPx}
                       style={{width: '100px'}}
                       onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                         this.props.setEditor_gridSizeInPx(parseInt(e.currentTarget.value))
                       }}
                />
              </Form.Field>

              <Form.Field>
                <Checkbox label={getI18n(this.props.langId, "Snap to Grid")} checked={this.props.settings.snapToGrid}
                          onChange={(e: SyntheticEvent<HTMLInputElement>, data: CheckboxData) => {
                            this.props.setEditor_snapToGrid(data.checked)
                          }}
                />
              </Form.Field>

              <Form.Field>
                <Checkbox label={getI18n(this.props.langId, "Show field ids")}
                          checked={this.props.settings.showSequenceIds}
                          onChange={(e: SyntheticEvent<HTMLInputElement>, data: CheckboxData) => {
                            this.props.setEditor_showSequenceIds(data.checked)
                          }}
                />
              </Form.Field>

              <Form.Field>
                <Checkbox label={getI18n(this.props.langId, "Move control points when line is moved")}
                          checked={this.props.settings.moveControlPointWhenPointIsMoved}
                          onChange={(e: SyntheticEvent<HTMLInputElement>, data: CheckboxData) => {
                            this.props.setEditor_moveControlPointWhenPointIsMoved(data.checked)
                          }}
                />
              </Form.Field>

              <Form.Field>
                <Checkbox label={getI18n(this.props.langId, "Split tile into smaller pieces")}
                          checked={this.props.settings.splitLargeTileForPrint}
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
                  <Input type="number" placeholder={defaultTileWidth} value={this.props.tileProps.width}
                         step="20" min="20"
                         style={{width: '100px'}}
                         onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                           const val = parseInt(e.currentTarget.value)
                           this.props.setEditor_tileWidth(val)
                         }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>{getI18n(this.props.langId, "Tile height")}</label>
                  <Input type="number" placeholder={defaultTileHeight} value={this.props.tileProps.height}
                         step="20" min="20"
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
                  <label>{getI18n(this.props.langId, "Print tile width in px")} ({'<'} {maxPrintTileWidth})</label>
                  <Input type="number" placeholder={maxPrintTileWidth}
                         value={this.props.settings.printLargeTilePreferredWidthInPx}
                         step="20" min="20"
                         style={{width: '100px'}}
                         onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                           const val = parseInt(e.currentTarget.value)
                           this.props.setEditor_printLargeTilePreferredWidthInPx(Math.min(maxPrintTileWidth, val))
                         }}
                  />
                </Form.Field>
                <Form.Field>
                  <label>{getI18n(this.props.langId, "Print tile height in px")} ({'<'} {maxPrintTileHeight})</label>
                  <Input type="number" placeholder={maxPrintTileHeight}
                         value={this.props.settings.printLargeTilePreferredHeightInPx}
                         step="50" min="10"
                         style={{width: '100px'}}
                         onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                           const val = parseInt(e.currentTarget.value)
                           this.props.setEditor_printLargeTilePreferredHeightInPx(Math.min(maxPrintTileHeight, val))
                         }}
                  />
                </Form.Field>
                <Form.Field>
                  <Button icon
                          onClick={() => {
                            this.props.setEditor_printLargeTilePreferredWidthInPx(maxPrintTileWidth)
                            this.props.setEditor_printLargeTilePreferredHeightInPx(maxPrintTileHeight)
                          }}>
                    <Icon name="undo"/>
                  </Button>
                </Form.Field>
              </Form.Group>


              <Form.Field>
                <Checkbox
                  label={getI18n(this.props.langId, "Auto increment field text that contain numbers on duplication")}
                  checked={this.props.settings.autoIncrementFieldTextNumbersOnDuplicate}
                  onChange={(e: SyntheticEvent<HTMLInputElement>, data: CheckboxData) => {
                    this.props.set_editor_autoIncrementFieldTextNumbersOnDuplicate(data.checked)
                  }}
                />
              </Form.Field>

              <Form.Field>
                <Checkbox
                  label={getI18n(this.props.langId, "Display print guides")}
                  checked={this.props.settings.arePrintGuidesDisplayed}
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