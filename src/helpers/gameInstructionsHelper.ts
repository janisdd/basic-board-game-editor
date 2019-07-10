import {Tile} from "../types/world";
import {Logger} from "./logger";
import {numberRegex} from "../constants";
import {FieldSymbol} from "../types/drawing";
import {notExhaustiveThrow} from "../state/reducers/_notExhausiveHelper";
import {CreateFieldTextExplanationListType} from "./markdownHelper";
import _ = require("lodash");


/**
 * captures all phrases from all fields and optionally replaces numbers with placeholders (variables)
 * this will process tiles only once (distinct/unique) resulting phrases list is also made unique
 * @param allUsedTiles all tiles
 * @param fieldSymbols all field symbols
 * @param createFieldTextExplanationListReplaceNumbers true: replace numbers with vars, false: not
 * @param createFieldTextExplanationListReplacePrefixText e.g. [
 * @param createFieldTextExplanationListReplaceVarName e.g. X
 * @param createFieldTextExplanationListReplacePostfixText e.g. ]
 */
export function generateFieldTextExplanationListMarkdown(allUsedTiles: ReadonlyArray<Tile>,
                                                         fieldSymbols: ReadonlyArray<FieldSymbol>,
                                                         createFieldTextExplanationListReplaceNumbers: boolean,
                                                         createFieldTextExplanationListReplacePrefixText: string,
                                                         createFieldTextExplanationListReplaceVarName: string,
                                                         createFieldTextExplanationListReplacePostfixText: string
): string[] {

  const uniqueTiles = _.uniqWith<Tile>(allUsedTiles, (tile1, tile2) => tile1.guid === tile2.guid)

  let phrases: string[] = []

  for (let i = 0; i < uniqueTiles.length; i++) {
    const uniqueTile = uniqueTiles[i];

    for (let j = 0; j < uniqueTile.fieldShapes.length; j++) {
      const fieldShape = uniqueTile.fieldShapes[j];

      let fieldText = fieldShape.text === null ? '' : fieldShape.text

      if (fieldShape.createdFromSymbolGuid !== null) {
        const fieldSymbol = fieldSymbols.find(p => p.guid === fieldShape.createdFromSymbolGuid)

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

  if (createFieldTextExplanationListReplaceNumbers) {

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
            ? `${createFieldTextExplanationListReplacePrefixText}${createFieldTextExplanationListReplaceVarName}${createFieldTextExplanationListReplacePostfixText}`
            : `${createFieldTextExplanationListReplacePrefixText}${createFieldTextExplanationListReplaceVarName}${i + 1}${createFieldTextExplanationListReplacePostfixText}`)
        }

        phrases[i] = phrase
      }
    }

  }

  const uniquePhrases = _.uniqWith(phrases, (p1, p2) => p1 === p2)

  return uniquePhrases

}


/**
 * generates a markdown list from phrases
 * @param phrases
 * @param listType
 */
export function generateMarkdownPhraseDefinitionList(phrases: string[], listType: CreateFieldTextExplanationListType): string {

  switch (listType) {
    case CreateFieldTextExplanationListType.list: {

      return phrases.map(p => `- \`${p}\` - `).join('\n')
    }

    case CreateFieldTextExplanationListType.definitionList: {

      return phrases.map(p => `${p}\n: todo\n`).join('\n')
    }
    default:
      notExhaustiveThrow(listType)

  }
}


export interface MarkdownPlaceholderVarTemplateDictionary {
  /**
   * var identifier (name)
   */
    ['ident']: null | string
  /**
   * the default value of the var
   */
    ['defaultValue']: null | string
}

/**
 * all known placeholders
 */
export interface MarkdownPlaceholderDictionary {

  /**
   * the global list
   */
    ['globalVarsList']: null | (() => string)
  /**
   * player local vars (from game init code)
   */
    ['playerLocalVarsList']: null | (() => string)
  /**
   * all local vars that can be captured when executing field cmds
   * so this excludes playerLocalVarsList
   */
    ['localVarsList']: null | (() => string)

  /**
   * the max dice value
   */
    ['maxDiceValue']: null | number

  /**
   * number of local vars
   */
    ['numLocalVars']: null | number
  /**
   * number of player local vars
   */
    ['numPlayerLocalVars']: null | number
  /**
   * total number of local vars (local + player local)
   */
    ['totalLocalVars']: null | number
  /**
   * number of global vars
   */
    ['numGlobalVars']: null | number
  /**
   * total number of vars
   */
    ['totalNumVars']: null | number

  /**
   * the section header for field text explanation
   */
    ['markdownGameInstructionsFieldTextExplanationHeader']: null | string

  ['startFieldPrefix']: null | string
  ['endFieldPrefix']: null | string
  ['forcedFieldPrefix']: null | string
  ['branchIfFieldPrefix']: null | string

  // [placeholderName: string]: string | number | null | (() => string)
}


export const markdownPlaceholderStringPrefixAndPostfix = '@@@'
export const markdownPlaceholderRegex = /@@@([\w]*)@@@/ig


/**
 * create an empty replacement dict
 */
export function createEmptyReplacementDictWithAllKnownPlaceholders(): MarkdownPlaceholderDictionary {

  const replacementDict: MarkdownPlaceholderDictionary = {
    globalVarsList: null,
    playerLocalVarsList: null,
    localVarsList: null,
    maxDiceValue: null,
    numLocalVars: null,
    numPlayerLocalVars: null,
    totalLocalVars: null,
    numGlobalVars: null,
    totalNumVars: null,
    markdownGameInstructionsFieldTextExplanationHeader: null,
    startFieldPrefix: null,
    endFieldPrefix: null,
    forcedFieldPrefix: null,
    branchIfFieldPrefix: null,
  }

  replacementDict.globalVarsList

  return replacementDict
}

export function createEmptyReplacementVarDictWithAllKnownPlaceholders(): MarkdownPlaceholderVarTemplateDictionary {

  const replacementDict: MarkdownPlaceholderVarTemplateDictionary = {
    ident: null,
    defaultValue: null
  }

  return replacementDict
}

/**
 * replaces the placeholders in gameInstructionTemplate and returns the resulting game instructions
 * @param gameInstructionTemplate
 * @param placeholderValues
 */
export function generateReplacedMarkdown(gameInstructionTemplate: string,
                                         placeholderValues: MarkdownPlaceholderDictionary | MarkdownPlaceholderVarTemplateDictionary): string {


  // do not work directly on gameInstructionTemplate because markdownPlaceholderRegex keeps track of the last index
  //and when we replace a long placeholder we might skip the next one because the string got shorter...
  let replaced = gameInstructionTemplate

  //see https://stackoverflow.com/questions/432493/how-do-you-access-the-matched-groups-in-a-javascript-regular-expression
  //regex must have /g (global flag)
  let matchResults: RegExpExecArray

  let regex = new RegExp(markdownPlaceholderRegex) //create a new obj to keep track of the index else we might have an infinite loop

  while ((matchResults = regex.exec(gameInstructionTemplate)) !== null) {

    const fullMatch = matchResults[0]

    const placeholderName = matchResults[1] //the real placeholder

    let replacement = placeholderValues[placeholderName]

    if (replacement === null || replacement === undefined) {

      Logger.fatal(`Could not find replacement for placeholder: ${placeholderName}`)

      return ''
    }

    if (typeof replacement === "function") {
      replacement = replacement()
    }

    replaced = replaced.replace(fullMatch, `${replacement}`)
  }


  return replaced
}
