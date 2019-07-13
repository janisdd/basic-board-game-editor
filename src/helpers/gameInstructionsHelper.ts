import {Tile} from "../types/world";
import {Logger} from "./logger";
import {numberRegex} from "../constants";
import {FieldSymbol, ImgSymbol, LineSymbol} from "../types/drawing";
import {
  absoluteFieldPositionInjectionAttribute,
  singleFieldRendererClass,
  singleTileRendererClass,
  tileGuidInjectionAttribute
} from "./markdownHelper";
import {
  parseAllFieldAbsolutePositions,
  parseAllTileGuids,
  parseFieldAbsolutePosition,
  parseTileGuid
} from "./worldTilesHelper";
import {WorldUnitToImgHelper} from "./worldUnitToImgHelper";
import {WorldUnitAsImgBlobStorage} from "../externalStorage/WorldUnitAsImgBlobStorage";
import {WorldSettings} from "../state/reducers/world/worldSettings/worldSettingsReducer";
import _ = require("lodash");


export interface MarkdownPlaceholderFieldTextExplanationTemplateDictionary {
  /**
   * field text
   */
  text: null | string
}

export interface MarkdownPlaceholderVarTemplateDictionary {
  /**
   * var identifier (name)
   */
  ident: null | string
  /**
   * the default value of the var
   */
  defaultValue: null | string
}

/**
 * all known placeholders
 */
export interface MarkdownPlaceholderDictionary {

  /**
   * global vars list
   */
  globalVarsList: null | (() => string)
  /**
   * player local vars (from game init code)
   */
  playerLocalVarsList: null | (() => string)
  /**
   * all local vars that can be captured when executing field cmds (so this excludes playerLocalVarsList)
   */
  localVarsList: null | (() => string)

  /**
   * max dice value
   */
  maxDiceValue: null | number

  /**
   * number of local vars
   */
  numLocalVars: null | number
  /**
   * number of player local vars
   */
  numPlayerLocalVars: null | number
  /**
   * total number of local vars (local + player local)
   */
  totalLocalVars: null | number
  /**
   * number of global vars
   */
  numGlobalVars: null | number
  /**
   * total number of vars
   */
  totalNumVars: null | number

  startFieldPrefix: null | string
  endFieldPrefix: null | string
  forcedFieldPrefix: null | string
  branchIfFieldPrefix: null | string

  // [placeholderName: string]: string | number | null | (() => string)
}


//we don't need an extra var for @@@ because when we match this we use the matching group to extract the var name
export const markdownPlaceholderRegex = /@@@([\w]*)@@@/ig
export const markdownPlaceholderStringPrefixAndPostfix = '@@@'


export class GameInstructionsHelper {
  private constructor() {
  }

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
  static generateFieldTextExplanationListMarkdown(allUsedTiles: ReadonlyArray<Tile>,
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
   * create an empty replacement dict
   */
  static createEmptyReplacementDictWithAllKnownPlaceholders(): MarkdownPlaceholderDictionary {

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
      startFieldPrefix: null,
      endFieldPrefix: null,
      forcedFieldPrefix: null,
      branchIfFieldPrefix: null,
    }

    replacementDict.globalVarsList

    return replacementDict
  }

  /**
   * an empty replacement var dict
   */
  static createEmptyReplacementVarDictWithAllKnownPlaceholders(): MarkdownPlaceholderVarTemplateDictionary {

    const replacementDict: MarkdownPlaceholderVarTemplateDictionary = {
      ident: null,
      defaultValue: null
    }

    return replacementDict
  }

  static createEmptyReplacementFieldTextExplanationDictWithAllKnownPlaceholders(): MarkdownPlaceholderFieldTextExplanationTemplateDictionary {

    const replacementDict: MarkdownPlaceholderFieldTextExplanationTemplateDictionary = {
      text: null,
    }

    return replacementDict
  }

  /**
   * replaces the placeholders in gameInstructionTemplate and returns the resulting game instructions
   * @param gameInstructionTemplate
   * @param placeholderValues
   */
  static generateReplacedMarkdown(gameInstructionTemplate: string,
                                  placeholderValues: MarkdownPlaceholderDictionary | MarkdownPlaceholderVarTemplateDictionary | MarkdownPlaceholderFieldTextExplanationTemplateDictionary): string {


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


  static async injectFieldImgsIntoMarkdown(markdownBodySelector: string,
                                           markdown: string,
                                           allPossibleTiles: ReadonlyArray<Tile>,
                                           fieldSymbols: ReadonlyArray<FieldSymbol>,
                                           worldSettings: WorldSettings,
                                           document: Document
  ) {

    WorldUnitAsImgBlobStorage.clearFieldStorage()

    const allPositions = parseAllFieldAbsolutePositions(markdown)

    for (let i = 0; i < allPositions.length; i++) {
      const absolutePosition = allPositions[i];

      const canvas = document.createElement('canvas')
      let resultCanvas = WorldUnitToImgHelper.fieldByAbsPosToImg(absolutePosition, allPossibleTiles, fieldSymbols, worldSettings, canvas)

      if (!resultCanvas) continue

      let url: string = ''

      try {
        url = await WorldUnitAsImgBlobStorage.addFieldImg(absolutePosition, resultCanvas)
        // console.log(url)
      } catch (err) {

      }
    }

    const allImgs = document.querySelectorAll(`${markdownBodySelector} img.${singleFieldRendererClass}`)

    for (let i = 0; i < allImgs.length; i++) {
      const img = allImgs.item(i) as HTMLImageElement

      const absolutePositionString = img.getAttribute(absoluteFieldPositionInjectionAttribute)

      const absolutePosition = parseFieldAbsolutePosition(absolutePositionString)

      if (!absolutePosition) continue

      img.src = WorldUnitAsImgBlobStorage.getImgByAbsolutePosition(absolutePosition)
    }
  }

  static async injectTileImgsIntoMarkdown(markdownBodySelector: string,
                                          markdown: string,
                                          allPossibleTiles: ReadonlyArray<Tile>,
                                          fieldSymbols: ReadonlyArray<FieldSymbol>,
                                          imgSymbols: ReadonlyArray<ImgSymbol>,
                                          lineSymbols: ReadonlyArray<LineSymbol>,
                                          worldSettings: WorldSettings,
                                          document: Document
  ) {

    WorldUnitAsImgBlobStorage.clearTileStorage()

    const tileGuids = parseAllTileGuids(markdown)

    for (let i = 0; i < tileGuids.length; i++) {
      const tileGuid = tileGuids[i];

      const canvas = document.createElement('canvas')

      let resultCanvas = WorldUnitToImgHelper.tileByGuidToImg(tileGuid,
        allPossibleTiles,
        fieldSymbols,
        imgSymbols,
        lineSymbols,
        worldSettings,
        canvas
      )

      if (!resultCanvas) continue

      let url: string = ''

      try {
        url = await WorldUnitAsImgBlobStorage.addTileImg(tileGuid, resultCanvas)
        // console.log(url)
      } catch (err) {

      }
    }

    const allImgs = document.querySelectorAll(`${markdownBodySelector} img.${singleTileRendererClass}`)

    for (let i = 0; i < allImgs.length; i++) {
      const img = allImgs.item(i) as HTMLImageElement

      const tileGuidString = img.getAttribute(tileGuidInjectionAttribute)

      const tileGuid = parseTileGuid(tileGuidString)

      if (!tileGuid) continue

      img.src = WorldUnitAsImgBlobStorage.getImgByTileGuid(tileGuid)
    }
  }

}


