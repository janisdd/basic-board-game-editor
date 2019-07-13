import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {
  set_gie_actionResultCopyText,
  set_gie_editorFontSize,
  set_gie_isActionResultCopyModalDisplayed,
  set_gie_isGameInstructionsEditorSettingsModalDisplayed,
  set_gie_isImageLibraryDisplayed,
  set_gie_isMarkdownHelpModalDisplayed
} from "../../state/reducers/gameInstructionsEditor/actions";
import {defaultGameInstructionEditorFontSize, maxZoomedFontSize, minZoomedFontSize} from "../../constants";
import {Icon} from "semantic-ui-react";
import IconToolTip from "../helpers/IconToolTip";
import {getI18n} from "../../../i18n/i18nRoot";
import {WorldTilesHelper} from "../../helpers/worldTilesHelper";
import {Logger} from "../../helpers/logger";
import {Tile} from "../../types/world";
import {LangHelper} from "../../helpers/langHelper";
import {AbstractMachine} from "../../../simulation/machine/AbstractMachine";
import {ExpressionUnit} from "../../../simulation/model/executionUnit";
import {gameInstructionsEditorId} from "./gameInstructionsEditor";
import {GameInstructionsHelper} from "../../helpers/gameInstructionsHelper";
import ImageLibrary from "../tiles/imageLibrary/imageLibrary";
import {editor_wrapper_editorInstancesMap} from "../helpers/editorWrapper";
import {getImageMarkdownBlock} from "../../helpers/markdownHelper";


export interface MyProps {
  // readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    editorFontSize: rootState.gameInstructionsEditorState.editorFontSize,

    worldCmdText: rootState.worldSettingsState.worldCmdText,

    worldSettings: rootState.worldSettingsState,
    allPossibleTiles: rootState.tileLibraryState.possibleTiles,
    worldTilesSurrogates: rootState.tileSurrogateState.present,
    fieldSymbols: rootState.fieldSymbolState.present,
    imgSymbols: rootState.imgSymbolState.present,
    lineSymbols: rootState.lineSymbolState.present,

    createFieldTextExplanationListReplaceNumbers: rootState.gameInstructionsEditorState.createFieldTextExplanationListReplaceNumbers,
    createFieldTextExplanationListReplaceVarName: rootState.gameInstructionsEditorState.createFieldTextExplanationListReplaceVarName,
    createFieldTextExplanationListReplacePrefixText: rootState.gameInstructionsEditorState.createFieldTextExplanationListReplacePrefixText,
    createFieldTextExplanationListReplacePostfixText: rootState.gameInstructionsEditorState.createFieldTextExplanationListReplacePostfixText,

    startFieldAutoPrefixText: rootState.worldSettingsState.startFieldAutoPrefixText,
    endFieldAutoPrefixText: rootState.worldSettingsState.endFieldAutoPrefixText,
    forcedFieldAutoPrefixText: rootState.worldSettingsState.forcedFieldAutoPrefixText,
    branchIfPrefixText: rootState.worldSettingsState.branchIfPrefixText,

    isImageLibraryDisplayed: rootState.gameInstructionsEditorState.isImageLibraryDisplayed,

    markdown: rootState.gameInstructionsEditorState.markdown,

    generalGameInstructionsTemplate: rootState.gameInstructionsEditorState.generalGameInstructionsTemplate,
    generalGameInstructionsVariableListElementTemplate: rootState.gameInstructionsEditorState.generalGameInstructionsVariableListElementTemplate,
    generalGameInstructionsFieldTextExplanationListElementTemplate: rootState.gameInstructionsEditorState.generalGameInstructionsFieldTextExplanationListElementTemplate,


    langId: rootState.i18nState.langId,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  set_gie_editorFontSize,

  set_gie_actionResultCopyText,
  set_gie_isActionResultCopyModalDisplayed,
  set_gie_isGameInstructionsEditorSettingsModalDisplayed,

  set_gie_isMarkdownHelpModalDisplayed,
  set_gie_isImageLibraryDisplayed,
}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;


class EditorActionsBar extends React.Component<Props, any> {


  getAllUsedUniqueTiles(): ReadonlyArray<Tile> {

    //we could iterate over the bounding box but all world tile surrogates are actually used...

    //faster but the order might be odd
    // const allUsedTiles = this.props.worldTilesSurrogates.map(surr => {
    //   const tile = this.props.allPossibleTiles.find(p => p.guid === surr.tileGuid)
    //
    //   if (!tile) {
    //     Logger.fatal(`tile for surrogate with tile guid: ${surr.tileGuid} at pos x: ${surr.x}, ${surr.y} could not be found, ignoring`)
    //     return null
    //   }
    //
    //   return tile
    // })
    //   .filter(p => p !== null)

    const boundingBox = WorldTilesHelper.getWorldBoundingBox(this.props.worldTilesSurrogates)
    const widthInTiles = boundingBox.maxX - boundingBox.minX + 1 //+1 max = min = 1 --> 0 but this is 1 tile
    const heightInTiles = boundingBox.maxY - boundingBox.minY + 1

    const allUsedTiles: Tile[] = []

    for (let i = 0; i < widthInTiles; i++) {
      for (let j = 0; j < heightInTiles; j++) {

        const tileSurrogate = WorldTilesHelper.getTileFromPos(i, j, this.props.worldTilesSurrogates)

        if (tileSurrogate === null) continue

        const tile = this.props.allPossibleTiles.find(p => p.guid === tileSurrogate.tileGuid)

        if (!tile) continue


        allUsedTiles.push(tile)

      }
    }

    return allUsedTiles
  }

  generateFieldTextExplanation() {

    const allUsedTiles = this.getAllUsedUniqueTiles()

    const uniquePhrases = GameInstructionsHelper.generateFieldTextExplanationListMarkdown(allUsedTiles,
      this.props.fieldSymbols,
      this.props.createFieldTextExplanationListReplaceNumbers,
      this.props.createFieldTextExplanationListReplacePrefixText,
      this.props.createFieldTextExplanationListReplaceVarName,
      this.props.createFieldTextExplanationListReplacePostfixText
    )

    // if (uniquePhrases.length === 0) {
    //   return
    // }

    let markdown = ''

    for (let i = 0; i < uniquePhrases.length; i++) {
      const uniquePhrase = uniquePhrases[i];

      const replacemantDict = GameInstructionsHelper.createEmptyReplacementFieldTextExplanationDictWithAllKnownPlaceholders()
      replacemantDict.text = uniquePhrase.text
      replacemantDict.cmdText = uniquePhrase.cmdText

      const listEntry = GameInstructionsHelper.generateReplacedMarkdown(this.props.generalGameInstructionsFieldTextExplanationListElementTemplate, replacemantDict)

      markdown += `${listEntry}\n`
    }

    this.props.set_gie_actionResultCopyText(markdown)
    this.props.set_gie_isActionResultCopyModalDisplayed(true)
  }


  execExpr(expr: ExpressionUnit): string {

    try {
      const tmp = AbstractMachine.execExpression(expr, AbstractMachine.createNewMachineState())

      const strValue = tmp.val !== null
        ? `${tmp.val}`
        : tmp.boolVal !== null
          ? (tmp.boolVal ? `true` : `false`)
          : 'ERROR'

      return strValue
    } catch (err) {
      Logger.fatal(err)
      return `ERROR`
    }
  }

  generateGeneralGameInstructions() {

    const allUsedTiles = this.getAllUsedUniqueTiles()


    const tmpState = LangHelper.executeGameInitCode(this.props.worldCmdText)

    const allVarDefs = LangHelper.getAllVarDefiningStatements(this.props.worldCmdText, allUsedTiles)
    const replacementDict = GameInstructionsHelper.createEmptyReplacementDictWithAllKnownPlaceholders()


    const globalVarListReplacement = () => {

      let markdownList = ''

      for (let i = 0; i < allVarDefs.globalVars.length; i++) {
        const varDeclUnit = allVarDefs.globalVars[i];

        const template = this.props.generalGameInstructionsVariableListElementTemplate

        const replacementDict = GameInstructionsHelper.createEmptyReplacementVarDictWithAllKnownPlaceholders()

        replacementDict.ident = varDeclUnit.ident

        const testValue = this.execExpr(varDeclUnit.expr)

        replacementDict.defaultValue = testValue

        const listEntry = GameInstructionsHelper.generateReplacedMarkdown(template, replacementDict)
        markdownList += `${listEntry}\n`
      }

      return markdownList
    }

    const playerLocalVarListReplacement = () => {

      let markdownList = ''

      for (let i = 0; i < allVarDefs.playerVars.length; i++) {
        const varDeclUnit = allVarDefs.playerVars[i];

        const template = this.props.generalGameInstructionsVariableListElementTemplate

        const replacementDict = GameInstructionsHelper.createEmptyReplacementVarDictWithAllKnownPlaceholders()

        replacementDict.ident = varDeclUnit.ident

        const testValue = this.execExpr(varDeclUnit.expr)

        replacementDict.defaultValue = testValue

        const listEntry = GameInstructionsHelper.generateReplacedMarkdown(template, replacementDict)
        markdownList += `${listEntry}\n`
      }

      return markdownList
    }

    const localVarListReplacement = () => {

      let markdownList = ''

      const template = this.props.generalGameInstructionsVariableListElementTemplate

      for (let i = 0; i < allVarDefs.localVars.length; i++) {
        const localVarScope = allVarDefs.localVars[i];

        for (let j = 0; j < localVarScope.localVars.length; j++) {
          const localVar = localVarScope.localVars[j];

          const replacementDict = GameInstructionsHelper.createEmptyReplacementVarDictWithAllKnownPlaceholders()

          replacementDict.ident = localVar.ident

          const testValue = this.execExpr(localVar.expr)

          replacementDict.defaultValue = testValue

          const listEntry = GameInstructionsHelper.generateReplacedMarkdown(template, replacementDict)
          markdownList += `${listEntry}\n`

        }

      }

      return markdownList
    }

    const numAllLocalVars = allVarDefs.localVars.reduce<number>((previousValue, currentValue) => previousValue + currentValue.localVars.length, 0)

    replacementDict.globalVarsList = globalVarListReplacement
    replacementDict.playerLocalVarsList = playerLocalVarListReplacement
    replacementDict.localVarsList = localVarListReplacement


    replacementDict.maxDiceValue = tmpState.maxDiceValue

    replacementDict.numLocalVars = numAllLocalVars
    replacementDict.numPlayerLocalVars = allVarDefs.playerVars.length
    replacementDict.totalLocalVars = allVarDefs.playerVars.length + numAllLocalVars
    replacementDict.numGlobalVars = allVarDefs.globalVars.length
    replacementDict.totalNumVars = allVarDefs.globalVars.length + allVarDefs.playerVars.length + numAllLocalVars

    replacementDict.startFieldPrefix = this.props.startFieldAutoPrefixText
    replacementDict.endFieldPrefix = this.props.endFieldAutoPrefixText
    replacementDict.forcedFieldPrefix = this.props.forcedFieldAutoPrefixText
    replacementDict.branchIfFieldPrefix = this.props.branchIfPrefixText


    const gameInstructions = GameInstructionsHelper.generateReplacedMarkdown(this.props.generalGameInstructionsTemplate, replacementDict)

    this.props.set_gie_actionResultCopyText(gameInstructions)
    this.props.set_gie_isActionResultCopyModalDisplayed(true)
  }


  render(): JSX.Element {
    return (
      <div className="action-bar">

        <ImageLibrary
          isCreatingNewImgShape={true}
          onImageTaken={(imgSurrogate) => {

            const gameInstructionEditorInstance = editor_wrapper_editorInstancesMap[gameInstructionsEditorId]

            if (gameInstructionEditorInstance) {
              // const pos = gameInstructionEditorInstance.getCursorPosition()
              // gameInstructionsEditorAceSession.insert()
              gameInstructionEditorInstance.insert(getImageMarkdownBlock(imgSurrogate.guid))
            }

            this.props.set_gie_isImageLibraryDisplayed(false)
          }}
          isDisplayed={this.props.isImageLibraryDisplayed}
          set_isDisplayed={(isDisplayed) => {
            this.props.set_gie_isImageLibraryDisplayed(isDisplayed)
          }}
          displayGenericImg={false}
        />

        <div className="item" style={{marginLeft: '1em'}} onClick={() => {
          this.props.set_gie_editorFontSize(Math.min(maxZoomedFontSize, this.props.editorFontSize + 1))
        }}>
          <Icon name="zoom in"/>
        </div>

        <div className="item" onClick={() => {
          this.props.set_gie_editorFontSize(defaultGameInstructionEditorFontSize)
        }}>
          <Icon name="undo"/>
        </div>

        <div className="item" onClick={() => {
          this.props.set_gie_editorFontSize(Math.max(minZoomedFontSize, this.props.editorFontSize - 1))
        }}>
          <Icon name="zoom out"/>
        </div>


        <div className="item">
          <IconToolTip
            message={getI18n(this.props.langId, "Creates the initial template for new game instructions with the current world settings (game init code)")}
            icon="asterisk"
            onClick={() => this.generateGeneralGameInstructions()}
          />
        </div>

        <div className="item">
          <IconToolTip
            message={getI18n(this.props.langId, "This will collect all used phrases from all fields in the world into a markdown list, so that you can explain each one manually")}
            icon="list"
            onClick={() => this.generateFieldTextExplanation()}
          />
        </div>

        <div className="item">
          <IconToolTip
            message={getI18n(this.props.langId, "Insert image from library")}
            icon="image"
            onClick={() => {
              this.props.set_gie_isImageLibraryDisplayed(true)
            }}
          />
        </div>

        <div className="item" onClick={() => {
          this.props.set_gie_isGameInstructionsEditorSettingsModalDisplayed(true)
        }}>
          <Icon name="setting"/>
        </div>


      </div>
    )
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(EditorActionsBar)
