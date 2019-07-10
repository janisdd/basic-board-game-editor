import * as React from "react";
import {SyntheticEvent} from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {Checkbox, Dropdown, DropdownItemProps, Form, Input, Modal} from "semantic-ui-react";
import {getI18n} from "../../../i18n/i18nRoot";
import {
  set_gie_createFieldTextExplanationListAs,
  set_gie_createFieldTextExplanationListReplaceVarName,
  set_gie_isGameInstructionsEditorSettingsModalDisplayed,
  set_gie_createFieldTextExplanationListReplaceNumbers,
  set_gie_createFieldTextExplanationListReplacePrefixText,
  set_gie_createFieldTextExplanationListReplacePostfixText,
} from "../../state/reducers/gameInstructionsEditor/actions";
import {CheckboxData} from "../../types/ui";
import {CreateFieldTextExplanationListType} from "../../helpers/markdownHelper";

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    isGameInstructionsEditorSettingsModalDisplayed: rootState.gameInstructionsEditorState.isGameInstructionsEditorSettingsModalDisplayed,

    createFieldTextExplanationListReplaceNumbers: rootState.gameInstructionsEditorState.createFieldTextExplanationListReplaceNumbers,
    createFieldTextExplanationListAs: rootState.gameInstructionsEditorState.createFieldTextExplanationListAs,
    createFieldTextExplanationListReplaceVarName: rootState.gameInstructionsEditorState.createFieldTextExplanationListReplaceVarName,
    createFieldTextExplanationListReplacePrefixText: rootState.gameInstructionsEditorState.createFieldTextExplanationListReplacePrefixText,
    createFieldTextExplanationListReplacePostfixText: rootState.gameInstructionsEditorState.createFieldTextExplanationListReplacePostfixText,

    langId: rootState.i18nState.langId,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  set_gie_isGameInstructionsEditorSettingsModalDisplayed,
  set_gie_createFieldTextExplanationListAs,
  set_gie_createFieldTextExplanationListReplaceVarName,
  set_gie_createFieldTextExplanationListReplaceNumbers,
  set_gie_createFieldTextExplanationListReplacePrefixText,
  set_gie_createFieldTextExplanationListReplacePostfixText,
}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;


class GameInstructionsEditorSettingsModal extends React.Component<Props, any> {
  render(): JSX.Element {

    const createFieldTextExplanationListType: DropdownItemProps[] = [
      {
        text: getI18n(this.props.langId, "Normal list"),
        value: CreateFieldTextExplanationListType.list
      },
      {
        text: getI18n(this.props.langId, "Definition list"),
        value: CreateFieldTextExplanationListType.definitionList
      }
    ]

    return (
      <div>

        <Modal closeIcon={true} centered={false}
               open={this.props.isGameInstructionsEditorSettingsModalDisplayed}
               onClose={() => {
                 this.props.set_gie_isGameInstructionsEditorSettingsModalDisplayed(false)
               }}
               size="large"
        >

          <Modal.Header>{getI18n(this.props.langId, "Game instructions editor settings")}</Modal.Header>


          <Modal.Content>

            <Form as="div">

              <h3 className="ui dividing header">
                {getI18n(this.props.langId, "Create field text explanation")}
              </h3>

              <Form.Field>
                <Checkbox
                  label={getI18n(this.props.langId, "Replace numbers with variables")}
                  checked={this.props.createFieldTextExplanationListReplaceNumbers}
                  onChange={(e: SyntheticEvent<HTMLInputElement>, data: CheckboxData) => {
                    this.props.set_gie_createFieldTextExplanationListReplaceNumbers(data.checked)
                  }}
                />
              </Form.Field>

              <Form.Group widths='equal'>
                <Form.Field>
                  <label>{getI18n(this.props.langId, "List type")}
                  </label>
                  <Dropdown placeholder='Select Friend' fluid selection options={createFieldTextExplanationListType}
                            value={this.props.createFieldTextExplanationListAs}
                            onChange={(event: SyntheticEvent<HTMLSelectElement>, data: { value: string }) => {

                              if (data.value === CreateFieldTextExplanationListType.list) {
                                this.props.set_gie_createFieldTextExplanationListAs(data.value)

                              } else if (data.value === CreateFieldTextExplanationListType.definitionList) {
                                this.props.set_gie_createFieldTextExplanationListAs(data.value)
                              }

                            }}
                  />
                </Form.Field>

                <Form.Field>
                  <label>{getI18n(this.props.langId, "Replace number with variable name")}</label>
                  <Input type="text" placeholder='['
                         value={this.props.createFieldTextExplanationListReplaceVarName}
                         style={{width: '150px'}}
                         onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                           this.props.set_gie_createFieldTextExplanationListReplaceVarName(e.currentTarget.value)
                         }}
                  />
                </Form.Field>

                <Form.Field>
                  <label>{getI18n(this.props.langId, "Replace variable prefix")}</label>
                  <Input type="text" placeholder='[' value={this.props.createFieldTextExplanationListReplacePrefixText}
                         style={{width: '150px'}}
                         onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                           this.props.set_gie_createFieldTextExplanationListReplacePrefixText(e.currentTarget.value)
                         }}
                  />
                </Form.Field>

                <Form.Field>
                  <label>{getI18n(this.props.langId, "Replace variable postfix")}</label>
                  <Input type="text" placeholder='[' value={this.props.createFieldTextExplanationListReplacePostfixText}
                         style={{width: '150px'}}
                         onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                           this.props.set_gie_createFieldTextExplanationListReplacePostfixText(e.currentTarget.value)
                         }}
                  />
                </Form.Field>
              </Form.Group>





            </Form>


          </Modal.Content>

        </Modal>

      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(GameInstructionsEditorSettingsModal)
