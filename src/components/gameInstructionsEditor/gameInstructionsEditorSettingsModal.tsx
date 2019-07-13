import * as React from "react";
import {SyntheticEvent} from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {Checkbox, Form, Icon, Input, Modal, Popup, Table, TextArea} from "semantic-ui-react";
import {getI18n} from "../../../i18n/i18nRoot";
import {
  set_gie_createFieldTextExplanationListReplaceNumbers,
  set_gie_createFieldTextExplanationListReplacePostfixText,
  set_gie_createFieldTextExplanationListReplacePrefixText,
  set_gie_createFieldTextExplanationListReplaceVarName,
  set_gie_generalGameInstructionsFieldTextExplanationListElementTemplate,
  set_gie_generalGameInstructionsTemplate,
  set_gie_generalGameInstructionsVariableListElementTemplate,
  set_gie_isGameInstructionsEditorSettingsModalDisplayed,
} from "../../state/reducers/gameInstructionsEditor/actions";
import {CheckboxData} from "../../types/ui";
import IconToolTip, {horizontalIconPopupOffsetInPx} from "../helpers/IconToolTip";
import {markdownPlaceholderStringPrefixAndPostfix} from "../../helpers/gameInstructionsHelper";

export interface MyProps {
  //readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    isGameInstructionsEditorSettingsModalDisplayed: rootState.gameInstructionsEditorState.isGameInstructionsEditorSettingsModalDisplayed,

    createFieldTextExplanationListReplaceNumbers: rootState.gameInstructionsEditorState.createFieldTextExplanationListReplaceNumbers,
    createFieldTextExplanationListReplaceVarName: rootState.gameInstructionsEditorState.createFieldTextExplanationListReplaceVarName,
    createFieldTextExplanationListReplacePrefixText: rootState.gameInstructionsEditorState.createFieldTextExplanationListReplacePrefixText,
    createFieldTextExplanationListReplacePostfixText: rootState.gameInstructionsEditorState.createFieldTextExplanationListReplacePostfixText,

    generalGameInstructionsTemplate: rootState.gameInstructionsEditorState.generalGameInstructionsTemplate,
    generalGameInstructionsVariableListElementTemplate: rootState.gameInstructionsEditorState.generalGameInstructionsVariableListElementTemplate,
    generalGameInstructionsFieldTextExplanationListElementTemplate: rootState.gameInstructionsEditorState.generalGameInstructionsFieldTextExplanationListElementTemplate,

    langId: rootState.i18nState.langId,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  set_gie_isGameInstructionsEditorSettingsModalDisplayed,
  set_gie_createFieldTextExplanationListReplaceVarName,
  set_gie_createFieldTextExplanationListReplaceNumbers,
  set_gie_createFieldTextExplanationListReplacePrefixText,
  set_gie_createFieldTextExplanationListReplacePostfixText,

  set_gie_generalGameInstructionsTemplate,
  set_gie_generalGameInstructionsVariableListElementTemplate,
  set_gie_generalGameInstructionsFieldTextExplanationListElementTemplate,
}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;


const gameInstructionsTemplate = require('./generalGameInstructionsTemplates/de/general.md')
const varListElementTemplate = require('./generalGameInstructionsTemplates/de/varListElement.md')
const fieldTextListElementTemplate = require('./generalGameInstructionsTemplates/de/fieldTextExplanationListElement.md')

class GameInstructionsEditorSettingsModal extends React.Component<Props, any> {
  render(): JSX.Element {

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


          <Modal.Content scrolling>

            <Form as="div">


              <h3 className="ui dividing header">
                {getI18n(this.props.langId, "General game instructions template")}
              </h3>

              <Form.Field>
                <label>
                  <Popup wide="very" horizontalOffset={horizontalIconPopupOffsetInPx} style={{maxWidth: '800px'}}
                         // position="bottom right"
                         trigger={
                           <Icon className="mar-left-half hoverable" name="help circle"/>
                         }
                         content={<div>
                           <span>{getI18n(this.props.langId, "You can use the following placeholders")}</span>
                           <Table basic='very' celled collapsing>
                             <Table.Header>
                               <Table.Row>
                                 <Table.HeaderCell>{getI18n(this.props.langId, "Placeholder")}</Table.HeaderCell>
                                 <Table.HeaderCell>{getI18n(this.props.langId, "Substitution")}</Table.HeaderCell>
                               </Table.Row>
                             </Table.Header>

                             <Table.Body>
                               <Table.Row>
                                 <Table.Cell>
                                   {`${markdownPlaceholderStringPrefixAndPostfix}globalVarsList${markdownPlaceholderStringPrefixAndPostfix}`}
                                 </Table.Cell>
                                 <Table.Cell>
                                   {getI18n(this.props.langId, "The list of global variables (uses the variable list template)")}
                                 </Table.Cell>
                               </Table.Row>

                               <Table.Row>
                                 <Table.Cell>
                                   {`${markdownPlaceholderStringPrefixAndPostfix}playerLocalVarsList${markdownPlaceholderStringPrefixAndPostfix}`}
                                 </Table.Cell>
                                 <Table.Cell>
                                   {getI18n(this.props.langId, "The list of player local variables (from game init code) (uses the variable list template)")}
                                 </Table.Cell>
                               </Table.Row>

                               <Table.Row>
                                 <Table.Cell>
                                   {`${markdownPlaceholderStringPrefixAndPostfix}localVarsList${markdownPlaceholderStringPrefixAndPostfix}`}
                                 </Table.Cell>
                                 <Table.Cell>
                                   {getI18n(this.props.langId, "The list of local variables (declared during the game) (uses the variable list template)")}
                                 </Table.Cell>
                               </Table.Row>

                               <Table.Row>
                                 <Table.Cell>
                                   {`${markdownPlaceholderStringPrefixAndPostfix}numGlobalVars${markdownPlaceholderStringPrefixAndPostfix}`}
                                 </Table.Cell>
                                 <Table.Cell>
                                   {getI18n(this.props.langId, "The number of global variables")}
                                 </Table.Cell>
                               </Table.Row>

                               <Table.Row>
                                 <Table.Cell>
                                   {`${markdownPlaceholderStringPrefixAndPostfix}numPlayerLocalVars${markdownPlaceholderStringPrefixAndPostfix}`}
                                 </Table.Cell>
                                 <Table.Cell>
                                   {getI18n(this.props.langId, "The number of player local variables")}
                                 </Table.Cell>
                               </Table.Row>

                               <Table.Row>
                                 <Table.Cell>
                                   {`${markdownPlaceholderStringPrefixAndPostfix}numLocalVars${markdownPlaceholderStringPrefixAndPostfix}`}
                                 </Table.Cell>
                                 <Table.Cell>
                                   {getI18n(this.props.langId, "The number of local variables")}
                                 </Table.Cell>
                               </Table.Row>

                               <Table.Row>
                                 <Table.Cell>
                                   {`${markdownPlaceholderStringPrefixAndPostfix}totalLocalVars${markdownPlaceholderStringPrefixAndPostfix}`}
                                 </Table.Cell>
                                 <Table.Cell>
                                   {getI18n(this.props.langId, "The total number of local variables (local + player local)")}
                                 </Table.Cell>
                               </Table.Row>


                               <Table.Row>
                                 <Table.Cell>
                                   {`${markdownPlaceholderStringPrefixAndPostfix}totalNumVars${markdownPlaceholderStringPrefixAndPostfix}`}
                                 </Table.Cell>
                                 <Table.Cell>
                                   {getI18n(this.props.langId, "The total number of variables")}
                                 </Table.Cell>
                               </Table.Row>

                               <Table.Row>
                                 <Table.Cell>
                                   {`${markdownPlaceholderStringPrefixAndPostfix}maxDiceValue${markdownPlaceholderStringPrefixAndPostfix}`}
                                 </Table.Cell>
                                 <Table.Cell>
                                   {getI18n(this.props.langId, "The max number of pips the dice can show")}
                                 </Table.Cell>
                               </Table.Row>

                               <Table.Row>
                                 <Table.Cell>
                                   {`${markdownPlaceholderStringPrefixAndPostfix}startFieldPrefix${markdownPlaceholderStringPrefixAndPostfix}`}
                                 </Table.Cell>
                                 <Table.Cell>
                                   {getI18n(this.props.langId, "The start field prefix text you configured")}
                                 </Table.Cell>
                               </Table.Row>

                               <Table.Row>
                                 <Table.Cell>
                                   {`${markdownPlaceholderStringPrefixAndPostfix}endFieldPrefix${markdownPlaceholderStringPrefixAndPostfix}`}
                                 </Table.Cell>
                                 <Table.Cell>
                                   {getI18n(this.props.langId, "The end field prefix text you configured")}
                                 </Table.Cell>
                               </Table.Row>

                               <Table.Row>
                                 <Table.Cell>
                                   {`${markdownPlaceholderStringPrefixAndPostfix}forcedFieldPrefix${markdownPlaceholderStringPrefixAndPostfix}`}
                                 </Table.Cell>
                                 <Table.Cell>
                                   {getI18n(this.props.langId, "The forced field prefix text you configured")}
                                 </Table.Cell>
                               </Table.Row>

                               <Table.Row>
                                 <Table.Cell>
                                   {`${markdownPlaceholderStringPrefixAndPostfix}branchIfFieldPrefix${markdownPlaceholderStringPrefixAndPostfix}`}
                                 </Table.Cell>
                                 <Table.Cell>
                                   {getI18n(this.props.langId, "The branch if field prefix text you configured")}
                                 </Table.Cell>
                               </Table.Row>

                             </Table.Body>
                           </Table>

                         </div>}
                  >
                  </Popup>

                  <IconToolTip
                    message={getI18n(this.props.langId, "Reset to defaults")}
                    icon="undo"
                    onClick={() => {
                      this.props.set_gie_generalGameInstructionsTemplate(gameInstructionsTemplate)
                    }}
                  />
                </label>
                <TextArea rows={20}
                          value={this.props.generalGameInstructionsTemplate}
                          onChange={(e) => {
                            this.props.set_gie_generalGameInstructionsTemplate(e.currentTarget.value)
                          }}
                />
              </Form.Field>

              <Form.Field>
                <label>{getI18n(this.props.langId, "Variable explanation list element template")}
                  <IconToolTip
                    message={getI18n(this.props.langId, "This is the list entry template used when replacing the variable list placeholders")}/>

                  <Popup wide="very" horizontalOffset={horizontalIconPopupOffsetInPx}
                         trigger={
                           <Icon className="mar-left-half hoverable" name="help circle"/>
                         }
                         content={<div>
                           <span>{getI18n(this.props.langId, "You can use the following placeholders")}</span>
                           <Table basic='very' celled collapsing>
                             <Table.Header>
                               <Table.Row>
                                 <Table.HeaderCell>{getI18n(this.props.langId, "Placeholder")}</Table.HeaderCell>
                                 <Table.HeaderCell>{getI18n(this.props.langId, "Substitution")}</Table.HeaderCell>
                               </Table.Row>
                             </Table.Header>

                             <Table.Body>
                               <Table.Row>
                                 <Table.Cell>
                                   {`${markdownPlaceholderStringPrefixAndPostfix}ident${markdownPlaceholderStringPrefixAndPostfix}`}
                                 </Table.Cell>
                                 <Table.Cell>
                                   {getI18n(this.props.langId, "The variable name (identifier)")}
                                 </Table.Cell>
                               </Table.Row>
                               <Table.Row>
                                 <Table.Cell>
                                   {`${markdownPlaceholderStringPrefixAndPostfix}defaultValue${markdownPlaceholderStringPrefixAndPostfix}`}
                                 </Table.Cell>
                                 <Table.Cell>
                                   {getI18n(this.props.langId, "The variable default value")}
                                 </Table.Cell>
                               </Table.Row>
                             </Table.Body>
                           </Table>

                         </div>}
                  >
                  </Popup>

                  <IconToolTip
                    message={getI18n(this.props.langId, "Reset to defaults")}
                    icon="undo"
                    onClick={() => {
                      this.props.set_gie_generalGameInstructionsVariableListElementTemplate(varListElementTemplate)
                    }}
                  />
                </label>
                <TextArea rows={3}
                          value={this.props.generalGameInstructionsVariableListElementTemplate}
                          onChange={(e) => {
                            this.props.set_gie_generalGameInstructionsVariableListElementTemplate(e.currentTarget.value)
                          }}
                />
              </Form.Field>


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
                  <Input type="text" placeholder='['
                         value={this.props.createFieldTextExplanationListReplacePrefixText}
                         style={{width: '150px'}}
                         onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                           this.props.set_gie_createFieldTextExplanationListReplacePrefixText(e.currentTarget.value)
                         }}
                  />
                </Form.Field>

                <Form.Field>
                  <label>{getI18n(this.props.langId, "Replace variable postfix")}</label>
                  <Input type="text" placeholder='['
                         value={this.props.createFieldTextExplanationListReplacePostfixText}
                         style={{width: '150px'}}
                         onChange={(e: SyntheticEvent<HTMLInputElement>) => {
                           this.props.set_gie_createFieldTextExplanationListReplacePostfixText(e.currentTarget.value)
                         }}
                  />
                </Form.Field>
              </Form.Group>

              <Form.Field>
                <label>
                  {getI18n(this.props.langId, "List element template")}
                  <Popup wide horizontalOffset={horizontalIconPopupOffsetInPx}
                         trigger={
                           <Icon className="mar-left-half hoverable" name="help circle"/>
                         }
                         content={<div>
                           <span>{getI18n(this.props.langId, "You can use the following placeholders")}</span>
                           <Table basic='very' celled collapsing>
                             <Table.Header>
                               <Table.Row>
                                 <Table.HeaderCell>{getI18n(this.props.langId, "Placeholder")}</Table.HeaderCell>
                                 <Table.HeaderCell>{getI18n(this.props.langId, "Substitution")}</Table.HeaderCell>
                               </Table.Row>
                             </Table.Header>

                             <Table.Body>
                               <Table.Row>
                                 <Table.Cell>
                                   {`${markdownPlaceholderStringPrefixAndPostfix}text${markdownPlaceholderStringPrefixAndPostfix}`}
                                 </Table.Cell>
                                 <Table.Cell>
                                   {getI18n(this.props.langId, "The field text")}
                                 </Table.Cell>
                               </Table.Row>
                             </Table.Body>
                           </Table>

                         </div>}
                  >
                  </Popup>
                  <IconToolTip
                    message={getI18n(this.props.langId, "Reset to defaults")}
                    icon="undo"
                    onClick={() => {
                      this.props.set_gie_generalGameInstructionsFieldTextExplanationListElementTemplate(fieldTextListElementTemplate)
                    }}
                  />
                </label>
                <TextArea rows={3}
                          value={this.props.generalGameInstructionsFieldTextExplanationListElementTemplate}
                          onChange={(e) => {
                            this.props.set_gie_generalGameInstructionsFieldTextExplanationListElementTemplate(e.currentTarget.value)
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

export default connect(mapStateToProps, mapDispatchToProps)(GameInstructionsEditorSettingsModal)
