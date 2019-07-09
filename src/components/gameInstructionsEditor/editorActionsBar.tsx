import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators, Dispatch} from "redux";
import {returntypeof} from 'react-redux-typescript';
import {RootState} from "../../state";
import {
  set_gie_actionResultCopyText,
  set_gie_editorFontSize,
  set_gie_isActionResultCopyModalDisplayed,
  set_gie_isGameInstructionsEditorSettingsModalDisplayed
} from "../../state/reducers/gameInstructionsEditor/actions";
import {defaultGameInstructionEditorFontSize, maxZoomedFontSize, minZoomedFontSize, numberRegex} from "../../constants";
import {Icon} from "semantic-ui-react";
import IconToolTip from "../helpers/IconToolTip";
import ToolTip from "../helpers/ToolTip";
import {getI18n} from "../../../i18n/i18nRoot";
import {generateMarkdownPhraseDefinitionList} from "../../helpers/markdownHelper";
import {WorldTilesHelper} from "../../helpers/worldTilesHelper";
import {Logger} from "../../helpers/logger";
import {Tile} from "../../types/world";
import _ = require("lodash");

export interface MyProps {
  // readonly test: string
}

const mapStateToProps = (rootState: RootState /*, props: MyProps*/) => {
  return {
    editorFontSize: rootState.gameInstructionsEditorState.editorFontSize,

    worldCmdText: rootState.worldSettingsState.worldCmdText,

    allPossibleTiles: rootState.tileLibraryState.possibleTiles,
    worldTilesSurrogates: rootState.tileSurrogateState.present,
    fieldSymbols: rootState.fieldSymbolState.present,

    createFieldTextExplanationListAs: rootState.gameInstructionsEditorState.createFieldTextExplanationListAs,
    createFieldTextExplanationListReplaceNumbers: rootState.gameInstructionsEditorState.createFieldTextExplanationListReplaceNumbers,
    createFieldTextExplanationListReplaceVarName: rootState.gameInstructionsEditorState.createFieldTextExplanationListReplaceVarName,
    createFieldTextExplanationListReplacePrefixText: rootState.gameInstructionsEditorState.createFieldTextExplanationListReplacePrefixText,
    createFieldTextExplanationListReplacePostfixText: rootState.gameInstructionsEditorState.createFieldTextExplanationListReplacePostfixText,

    langId: rootState.i18nState.langId,
  }
}

const mapDispatchToProps = (dispatch: Dispatch<any>) => bindActionCreators({
  set_gie_editorFontSize,

  set_gie_actionResultCopyText,
  set_gie_isActionResultCopyModalDisplayed,
  set_gie_isGameInstructionsEditorSettingsModalDisplayed,
}, dispatch)


const stateProps = returntypeof(mapStateToProps);
const dispatchProps = returntypeof(mapDispatchToProps);
type Props = typeof stateProps & typeof dispatchProps;


class EditorActionsBar extends React.Component<Props, any> {


  generateFieldTextExplanationList() {

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

    //iterate column by column
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


    const uniqueTiles = _.unionBy<Tile>(allUsedTiles, (tile) => tile.guid)

    let phrases: string[] = []

    for (let i = 0; i < uniqueTiles.length; i++) {
      const uniqueTile = uniqueTiles[i];

      for (let j = 0; j < uniqueTile.fieldShapes.length; j++) {
        const fieldShape = uniqueTile.fieldShapes[j];

        let fieldText = fieldShape.text === null ? '' : fieldShape.text

        if (fieldShape.createdFromSymbolGuid !== null) {
          const fieldSymbol = this.props.fieldSymbols.find(p => p.guid === fieldShape.createdFromSymbolGuid)

          if (!fieldSymbol) {

            Logger.fatal(`could not find field symbol with guid ${fieldShape.createdFromSymbolGuid} for field id: ${fieldShape.id} on tile '${uniqueTile.tileSettings.displayName}', tile guid: ${uniqueTile.guid}`)

            continue
          }

          if (fieldSymbol.overwriteText) {
            fieldText = fieldSymbol.text === null ? '' : fieldSymbol.text
          }
        }

        phrases.push(fieldText)
      }
    }

    //--- some cleanup ---

    //replace only empty or trimmed just whitespace texts
    phrases = phrases.filter(p => p !== null && p.trim() !== '')

    //replace new lines with a single whitespace character because this is better for markdown lists...

    phrases = phrases.map(p => p.replace(/\n/gm, ' '))

    if (this.props.createFieldTextExplanationListReplaceNumbers) {

      //replace concrete numbers with placeholders
      //note that every number needs its own placeholder e.g. ... 3 do ... 3 --> ... X do ... Y

      for (let i = 0; i < phrases.length; i++) {
        let phrase = phrases[i];

        const matchResults = phrase.match(numberRegex)

        if (matchResults) {

          for (let i = 0; i < matchResults.length; i++) {
            const matchResult = matchResults[i]
            phrase = phrase.replace(matchResult, matchResults.length === 1
              //e.g. [X] or [X1]
              ? `${this.props.createFieldTextExplanationListReplacePrefixText}${this.props.createFieldTextExplanationListReplaceVarName}${this.props.createFieldTextExplanationListReplacePostfixText}`
              : `${this.props.createFieldTextExplanationListReplacePrefixText}${this.props.createFieldTextExplanationListReplaceVarName}${i + 1}${this.props.createFieldTextExplanationListReplacePostfixText}`)
          }

          phrases[i] = phrase
        }
      }

    }

    const uniquePhrases = _.unionBy(phrases, (p) => p)

    // if (uniquePhrases.length === 0) {
    //   return
    // }

    let markdown = generateMarkdownPhraseDefinitionList(uniquePhrases, this.props.createFieldTextExplanationListAs)

    markdown = `## Texte auf Feldern erklärt

${markdown}`

    this.props.set_gie_actionResultCopyText(markdown)
    this.props.set_gie_isActionResultCopyModalDisplayed(true)
  }

  render(): JSX.Element {
    return (
      <div className="action-bar">


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
            onClick={() => {

            }}
          />
        </div>

        <div className="item">
          <IconToolTip
            message={getI18n(this.props.langId, "This will collect all used phrases from all fields in the world into a markdown list, so that you can explain each one manually")}
            icon="list"
            onClick={() => this.generateFieldTextExplanationList()}
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
