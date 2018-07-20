import {Action} from "redux";
import {notExhaustive} from "../../_notExhausiveHelper";
import {defaultGameInitCode} from "../../../../constants";
import {SimulationTimes} from "../../../../../simulation/machine/AbstractMachine";


/**
 * the world settings
 * NOTE: if you add a property here then you also need to change the function
 * @link overwriteWorldSettings to overwrite the setting value when importing a world
 */
export interface WorldSettings {
  readonly selectedFieldBorderColor: string
  readonly selectedFieldBorderThicknessInPx: number
  readonly gridStrokeThicknessInPx: number
  readonly gridStrokeColor: string
  readonly linePointsUiDiameter: number
  readonly linePointsUiColor: string
  readonly tileMidPointsUiColor: string
  readonly tileMidPointsDiameter: number
  readonly lineBezierControlPoint1UiDiameter: number
  readonly lineBezierControlPoint1UiColor: string
  readonly lineBezierControlPoint2UiDiameter: number
  readonly lineBezierControlPoint2UiColor: string
  readonly fieldSequenceBoxColor: string
  readonly fieldSequenceFont: string
  readonly fieldSequenceFontColor: string
  readonly fieldSequenceFontSizeInPx: number
  readonly anchorPointColor: string
  readonly anchorPointDiameter: number

  /**
   * when we don't have snap to grid enabled is is practically impossible
   * for the user to set the line point exactly on the anchor point...
   * so use this radius as a tolerance (<= then snap)
   */
  readonly anchorPointSnapToleranceRadiusInPx: number

  readonly stageOffsetX: number
  readonly stageOffsetY: number
  readonly stageScaleX: number
  readonly stageScaleY: number

  /*
 * we need to save the original offset (by user) and the scaled correction offset
 * separately because when we scale we only want to change this but not to user defined
 * offset
 */
  readonly stageOffsetXScaleCorrection: number
  readonly stageOffsetYScaleCorrection: number

  readonly worldWidthInTiles: number
  readonly worldHeightInTiles: number

  /**
   * used to draw the empty tiles grid
   * latex we want to force the user to only use tiles with the same size
   */
  readonly expectedTileWidth: number
  /**
   * used to draw the empty tiles grid
   * latex we want to force the user to only use tiles with the same size
   */
  readonly expectedTileHeight: number

  /**
   * the world cmd text
   */
  readonly worldCmdText: string

  /**
   * true: all tiles will be combined into one image for printing,
   * false: every tile will get a separate image
   */
  readonly printGameAsOneImage: boolean


  readonly timeInS_rollDice: number
  readonly timeInS_choose_bool_func: number
  readonly timeInS_goto: number
  readonly timeInS_set_var: number
  readonly timeInS_advancePlayer: number
  readonly timeInS_rollback: number
  readonly timeInS_var_decl: number

  readonly timeInS_expr_primary_leftSteps: number
  readonly timeInS_expr_primary_constant: number
  readonly timeInS_expr_primary_ident: number
  readonly timeInS_expr_primary_incrementOrDecrement: number

  readonly timeInS_expr_disjunction: number
  readonly timeInS_expr_conjunction: number
  readonly timeInS_expr_comparison: number
  readonly timeInS_expr_relation: number
  readonly timeInS_expr_sum: number
  readonly timeInS_expr_term: number
  readonly timeInS_expr_factor: number

}


export type State = WorldSettings

export const initial: State = {
  selectedFieldBorderColor: 'blue',
  selectedFieldBorderThicknessInPx: 1,
  gridStrokeThicknessInPx: 0.2,
  gridStrokeColor: 'gray',
  linePointsUiDiameter: 3,
  linePointsUiColor: 'black',
  tileMidPointsUiColor: '#f1b213',
  tileMidPointsDiameter: 3,
  lineBezierControlPoint1UiDiameter: 3,
  lineBezierControlPoint1UiColor: 'green',
  lineBezierControlPoint2UiDiameter: 3,
  lineBezierControlPoint2UiColor: 'blue',
  fieldSequenceBoxColor: 'black',
  fieldSequenceFont: 'Arial',
  fieldSequenceFontColor: 'black',
  fieldSequenceFontSizeInPx: 12,
  anchorPointColor: '#f1b213',
  anchorPointDiameter: 3,
  anchorPointSnapToleranceRadiusInPx: 7,

  stageOffsetX: 0,
  stageOffsetY: 0,
  stageScaleX: 1,
  stageScaleY: 1,
  stageOffsetXScaleCorrection: 0,
  stageOffsetYScaleCorrection: 0,


  worldWidthInTiles: 5,
  worldHeightInTiles: 5,
  expectedTileWidth: 500,
  expectedTileHeight: 500,

  worldCmdText: defaultGameInitCode,
  printGameAsOneImage: false,


  timeInS_rollDice: SimulationTimes.timeInS_rollDice_default,
  timeInS_choose_bool_func: SimulationTimes.timeInS_choose_bool_func_default,
  timeInS_goto: SimulationTimes.timeInS_goto_default,
  timeInS_set_var: SimulationTimes.timeInS_set_var_default,
  timeInS_advancePlayer: SimulationTimes.timeInS_advancePlayer_default,
  timeInS_rollback: SimulationTimes.timeInS_rollback_default,
  timeInS_var_decl: SimulationTimes.timeInS_var_decl_default,

  timeInS_expr_primary_leftSteps: SimulationTimes.timeInS_expr_primary_leftSteps_default,
  timeInS_expr_primary_constant: SimulationTimes.timeInS_expr_primary_constant_default,
  timeInS_expr_primary_ident: SimulationTimes.timeInS_expr_primary_ident_default,
  timeInS_expr_primary_incrementOrDecrement: SimulationTimes.timeInS_expr_primary_incrementOrDecrement_default,

  timeInS_expr_disjunction: SimulationTimes.timeInS_expr_disjunction_default,
  timeInS_expr_conjunction: SimulationTimes.timeInS_expr_conjunction_default,
  timeInS_expr_comparison: SimulationTimes.timeInS_expr_comparison_default,
  timeInS_expr_relation: SimulationTimes.timeInS_expr_relation_default,
  timeInS_expr_sum: SimulationTimes.timeInS_expr_sum_default,
  timeInS_expr_term: SimulationTimes.timeInS_expr_term_default,
  timeInS_expr_factor: SimulationTimes.timeInS_expr_factor_default,

}

export interface ActionBase extends Action {
  readonly type: ActionType
}


export enum ActionType {

  replace_worldSettings = 'worldSettingsReducer_replace_worldSettings',

  SET_selectedFieldBorderColor = 'worldSettingsReducer_SET_selectedFieldBorderColor',
  SET_selectedFieldBorderThicknessInPx = 'worldSettingsReducer_SET_selectedFieldBorderThicknessInPx',
  SET_gridStrokeThicknessInPx = 'worldSettingsReducer_SET_gridStrokeThicknessInPx',
  SET_gridStrokeColor = 'worldSettingsReducer_SET_gridStrokeColor',
  SET_linePointsUiDiameter = 'worldSettingsReducer_SET_linePointsUiDiameter',
  SET_linePointsUiColor = 'worldSettingsReducer_SET_linePointsUiColor',
  SET_tileMidPointsUiColor = 'worldSettingsReducer_SET_tileMidPointsUiColor',
  SET_tileMidPointsDiameter = 'worldSettingsReducer_SET_tileMidPointsDiameter',
  SET_lineBezierControlPoint1UiDiameter = 'worldSettingsReducer_SET_lineBezierControlPoint1UiDiameter',
  SET_lineBezierControlPoint1UiColor = 'worldSettingsReducer_SET_lineBezierControlPoint1UiColor',
  SET_lineBezierControlPoint2UiDiameter = 'worldSettingsReducer_SET_lineBezierControlPoint2UiDiameter',
  SET_lineBezierControlPoint2UiColor = 'worldSettingsReducer_SET_lineBezierControlPoint2UiColor',
  SET_fieldSequenceBoxColor = 'worldSettingsReducer_SET_fieldSequenceBoxColor',
  SET_fieldSequenceFont = 'worldSettingsReducer_SET_fieldSequenceFont',
  SET_fieldSequenceFontColor = 'worldSettingsReducer_SET_fieldSequenceFontColor',
  SET_fieldSequenceFontSizeInPx = 'worldSettingsReducer_SET_fieldSequenceFontSizeInPx',
  SET_anchorPointColor = 'worldSettingsReducer_SET_anchorPointColor',
  SET_anchorPointDiameter = 'worldSettingsReducer_SET_anchorPointDiameter',

  SET_anchorPointSnapToleranceRadiusInPx = 'worldSettingsReducer_SET_anchorPointSnapToleranceRadiusInPx',

  SET_world_stageOffset = 'worldSettingsReducer_SET_world_stageOffset',
  SET_world_stageOffsetScaleCorrection = 'worldSettingsReducer_SET_world_stageOffsetScaleCorrection',
  SET_world_stageScale = 'worldSettingsReducer_SET_world_stageScale',

  SET_world_worldWidthInTiles = 'worldSettingsReducer_SET_world_worldWidthInTiles',
  SET_world_worldHeightInTiles = 'worldSettingsReducer_SET_world_worldHeightInTiles',

  SET_world_expectedTileWidth = 'worldSettingsReducer_SET_world_expectedTileWidth',
  SET_world_expectedTileHeight = 'worldSettingsReducer_SET_world_expectedTileHeight',

  SET_world_worldCmdText = 'worldSettingsReducer_SET_world_worldCmdText',
  SET_world_printGameAsOneImage = 'worldSettingsReducer_SET_world_printGameAsOneImage',


  SET_world_timeInS_rollDice = 'worldSettingsReducer_SET_timeInS_rollDice',
  SET_world_timeInS_choose_bool_func = 'worldSettingsReducer_SET_timeInS_choose_bool_func',
  SET_world_timeInS_goto = 'worldSettingsReducer_SET_timeInS_goto',
  SET_world_timeInS_set_var = 'worldSettingsReducer_SET_timeInS_set_var',
  SET_world_timeInS_advancePlayer = 'worldSettingsReducer_SET_timeInS_advancePlayer',
  SET_world_timeInS_rollback = 'worldSettingsReducer_SET_timeInS_rollback',
  SET_world_timeInS_var_decl = 'worldSettingsReducer_SET_timeInS_var_decl',
  SET_world_timeInS_expr_primary_leftSteps = 'worldSettingsReducer_SET_timeInS_expr_primary_leftSteps',
  SET_world_timeInS_expr_primary_constant = 'worldSettingsReducer_SET_timeInS_expr_primary_constant',
  SET_world_timeInS_expr_primary_ident = 'worldSettingsReducer_SET_timeInS_expr_primary_ident',
  SET_world_timeInS_expr_primary_incrementOrDecrement = 'worldSettingsReducer_SET_timeInS_expr_primary_incrementOrDecrement',
  SET_world_timeInS_expr_disjunction = 'worldSettingsReducer_SET_timeInS_expr_disjunction',
  SET_world_timeInS_expr_conjunction = 'worldSettingsReducer_SET_timeInS_expr_conjunction',
  SET_world_timeInS_expr_comparison = 'worldSettingsReducer_SET_timeInS_expr_comparison',
  SET_world_timeInS_expr_relation = 'worldSettingsReducer_SET_timeInS_expr_relation',
  SET_world_timeInS_expr_sum = 'worldSettingsReducer_SET_timeInS_expr_sum',
  SET_world_timeInS_expr_term = 'worldSettingsReducer_SET_timeInS_expr_term',
  SET_world_timeInS_expr_factor = 'worldSettingsReducer_SET_timeInS_expr_factor',

  RESET = 'worldSettingsReducer_RESET',
}


//--- some static ui settings


export interface replace_worldSettingsAction extends ActionBase {
  readonly type: ActionType.replace_worldSettings
  readonly newWorldSettings: WorldSettings
}

export interface SET_selectedFieldBorderColorAction extends ActionBase {
  readonly type: ActionType.SET_selectedFieldBorderColor
  readonly selectedFieldBorderColor: string
}

export interface SET_selectedFieldBorderThicknessInPxAction extends ActionBase {
  readonly type: ActionType.SET_selectedFieldBorderThicknessInPx
  readonly selectedFieldBorderThicknessInPx: number
}

export interface SET_gridStrokeThicknessInPxAction extends ActionBase {
  readonly type: ActionType.SET_gridStrokeThicknessInPx
  readonly gridStrokeThicknessInPx: number
}

export interface SET_gridStrokeColorAction extends ActionBase {
  readonly type: ActionType.SET_gridStrokeColor
  readonly gridStrokeColor: string
}

export interface SET_linePointsUiDiameterAction extends ActionBase {
  readonly type: ActionType.SET_linePointsUiDiameter
  readonly linePointsUiDiameter: number
}

export interface SET_linePointsUiColorAction extends ActionBase {
  readonly type: ActionType.SET_linePointsUiColor
  readonly linePointsUiColor: string
}

export interface SET_tileMidPointsUiColorAction extends ActionBase {
  readonly type: ActionType.SET_tileMidPointsUiColor
  readonly tileMidPointsUiColor: string
}

export interface SET_tileMidPointsDiameterAction extends ActionBase {
  readonly type: ActionType.SET_tileMidPointsDiameter
  readonly tileMidPointsDiameter: number
}

export interface SET_lineBezierControlPoint1UiDiameterAction extends ActionBase {
  readonly type: ActionType.SET_lineBezierControlPoint1UiDiameter
  readonly lineBezierControlPoint1UiDiameter: number
}


export interface SET_lineBezierControlPoint1UiColorAction extends ActionBase {
  readonly type: ActionType.SET_lineBezierControlPoint1UiColor
  readonly lineBezierControlPoint1UiColor: string
}

export interface SET_lineBezierControlPoint2UiDiameterAction extends ActionBase {
  readonly type: ActionType.SET_lineBezierControlPoint2UiDiameter
  readonly lineBezierControlPoint2UiDiameter: number
}

export interface SET_lineBezierControlPoint2UiColorAction extends ActionBase {
  readonly type: ActionType.SET_lineBezierControlPoint2UiColor
  readonly lineBezierControlPoint2UiColor: string
}


export interface SET_fieldSequenceBoxColorAction extends ActionBase {
  readonly type: ActionType.SET_fieldSequenceBoxColor
  readonly fieldSequenceBoxColor: string
}

export interface SET_fieldSequenceFontAction extends ActionBase {
  readonly type: ActionType.SET_fieldSequenceFont
  readonly fieldSequenceFont: string
}

export interface SET_fieldSequenceFontColorAction extends ActionBase {
  readonly type: ActionType.SET_fieldSequenceFontColor
  readonly fieldSequenceFontColor: string
}

export interface SET_fieldSequenceFontSizeInPxAction extends ActionBase {
  readonly type: ActionType.SET_fieldSequenceFontSizeInPx
  readonly fieldSequenceFontSizeInPx: number
}

export interface SET_anchorPointColorAction extends ActionBase {
  readonly type: ActionType.SET_anchorPointColor
  readonly anchorPointColor: string
}

export interface SET_anchorPointDiameterAction extends ActionBase {
  readonly type: ActionType.SET_anchorPointDiameter
  readonly anchorPointDiameter: number
}

export interface SET_anchorPointSnapToleranceRadiusInPxAction extends ActionBase {
  readonly type: ActionType.SET_anchorPointSnapToleranceRadiusInPx
  readonly anchorPointSnapToleranceRadiusInPx: number
}


//--- real settings

export interface SET_world_stageOffsetAction extends ActionBase {
  readonly type: ActionType.SET_world_stageOffset
  readonly stageOffsetX: number
  readonly stageOffsetY: number
}

export interface SET_world_stageOffsetScaleCorrectionAction extends ActionBase {
  readonly type: ActionType.SET_world_stageOffsetScaleCorrection
  readonly stageOffsetXScaleCorrection: number
  readonly stageOffsetYScaleCorrection: number
}

export interface SET_world_stageScaleAction extends ActionBase {
  readonly type: ActionType.SET_world_stageScale
  readonly stageScaleX: number
  readonly stageScaleY: number
}


export interface SET_world_worldWidthInTilesAction extends ActionBase {
  readonly type: ActionType.SET_world_worldWidthInTiles
  readonly worldWidthInTiles: number
}

export interface SET_world_worldHeightInTilesAction extends ActionBase {
  readonly type: ActionType.SET_world_worldHeightInTiles
  readonly worldHeightInTiles: number
}

export interface SET_world_expectedTileWidthAction extends ActionBase {
  readonly type: ActionType.SET_world_expectedTileWidth
  readonly expectedTileWidth: number
}

export interface SET_world_expectedTileHeightAction extends ActionBase {
  readonly type: ActionType.SET_world_expectedTileHeight
  readonly expectedTileHeight: number
}

export interface SET_world_worldCmdTextAction extends ActionBase {
  readonly type: ActionType.SET_world_worldCmdText
  readonly worldCmdText: string
}

export interface SET_world_printGameAsOneImageAction extends ActionBase {
  readonly type: ActionType.SET_world_printGameAsOneImage
  readonly printGameAsOneImage: boolean
}

//--- times for simulation
export interface SET_world_timeInS_rollDiceAction extends ActionBase {
  readonly type: ActionType.SET_world_timeInS_rollDice
  readonly timeInS_rollDice: number
}

export interface SET_world_timeInS_choose_bool_funcAction extends ActionBase {
  readonly type: ActionType.SET_world_timeInS_choose_bool_func
  readonly timeInS_choose_bool_func: number
}

export interface SET_world_timeInS_gotoAction extends ActionBase {
  readonly type: ActionType.SET_world_timeInS_goto
  readonly timeInS_goto: number
}

export interface SET_world_timeInS_set_varAction extends ActionBase {
  readonly type: ActionType.SET_world_timeInS_set_var
  readonly timeInS_set_var: number
}


export interface SET_world_timeInS_advancePlayerAction extends ActionBase {
  readonly type: ActionType.SET_world_timeInS_advancePlayer
  readonly timeInS_advancePlayer: number
}


export interface SET_world_timeInS_rollbackAction extends ActionBase {
  readonly type: ActionType.SET_world_timeInS_rollback
  readonly timeInS_rollback: number
}

export interface SET_world_timeInS_var_declAction extends ActionBase {
  readonly type: ActionType.SET_world_timeInS_var_decl
  readonly timeInS_var_decl: number
}

export interface SET_world_timeInS_expr_primary_leftStepsAction extends ActionBase {
  readonly type: ActionType.SET_world_timeInS_expr_primary_leftSteps
  readonly timeInS_expr_primary_leftSteps: number
}

export interface SET_world_timeInS_expr_primary_constantAction extends ActionBase {
  readonly type: ActionType.SET_world_timeInS_expr_primary_constant
  readonly timeInS_expr_primary_constant: number
}

export interface SET_world_timeInS_expr_primary_identAction extends ActionBase {
  readonly type: ActionType.SET_world_timeInS_expr_primary_ident
  readonly timeInS_expr_primary_ident: number
}

export interface SET_world_timeInS_expr_primary_incrementOrDecrementAction extends ActionBase {
  readonly type: ActionType.SET_world_timeInS_expr_primary_incrementOrDecrement
  readonly timeInS_expr_primary_incrementOrDecrement: number
}

export interface SET_world_timeInS_expr_disjunctionAction extends ActionBase {
  readonly type: ActionType.SET_world_timeInS_expr_disjunction
  readonly timeInS_expr_disjunction: number
}

export interface SET_world_timeInS_expr_conjunctionAction extends ActionBase {
  readonly type: ActionType.SET_world_timeInS_expr_conjunction
  readonly timeInS_expr_conjunction: number
}

export interface SET_world_timeInS_expr_comparisonAction extends ActionBase {
  readonly type: ActionType.SET_world_timeInS_expr_comparison
  readonly timeInS_expr_comparison: number
}

export interface SET_world_timeInS_expr_relationAction extends ActionBase {
  readonly type: ActionType.SET_world_timeInS_expr_relation
  readonly timeInS_expr_relation: number
}

export interface SET_world_timeInS_expr_sumAction extends ActionBase {
  readonly type: ActionType.SET_world_timeInS_expr_sum
  readonly timeInS_expr_sum: number
}

export interface SET_world_timeInS_expr_termAction extends ActionBase {
  readonly type: ActionType.SET_world_timeInS_expr_term
  readonly timeInS_expr_term: number
}

export interface SET_world_timeInS_expr_factorAction extends ActionBase {
  readonly type: ActionType.SET_world_timeInS_expr_factor
  readonly timeInS_expr_factor: number
}

export interface ResetAction extends ActionBase {
  readonly type: ActionType.RESET
}


export type AllActions =
  ResetAction
  | replace_worldSettingsAction
  | SET_selectedFieldBorderColorAction
  | SET_selectedFieldBorderThicknessInPxAction
  | SET_gridStrokeThicknessInPxAction
  | SET_gridStrokeColorAction
  | SET_linePointsUiDiameterAction
  | SET_linePointsUiColorAction
  | SET_tileMidPointsUiColorAction
  | SET_tileMidPointsDiameterAction
  | SET_lineBezierControlPoint1UiDiameterAction
  | SET_lineBezierControlPoint1UiColorAction
  | SET_lineBezierControlPoint2UiDiameterAction
  | SET_lineBezierControlPoint2UiColorAction
  | SET_fieldSequenceBoxColorAction
  | SET_fieldSequenceFontAction
  | SET_fieldSequenceFontColorAction
  | SET_fieldSequenceFontSizeInPxAction
  | SET_anchorPointColorAction
  | SET_anchorPointDiameterAction
  | SET_anchorPointSnapToleranceRadiusInPxAction

  | SET_world_stageOffsetAction
  | SET_world_stageOffsetScaleCorrectionAction
  | SET_world_stageScaleAction
  | SET_world_worldWidthInTilesAction
  | SET_world_worldHeightInTilesAction
  | SET_world_expectedTileWidthAction
  | SET_world_expectedTileHeightAction
  | SET_world_worldCmdTextAction
  | SET_world_printGameAsOneImageAction

  | SET_world_timeInS_rollDiceAction
  | SET_world_timeInS_choose_bool_funcAction
  | SET_world_timeInS_choose_bool_funcAction
  | SET_world_timeInS_gotoAction
  | SET_world_timeInS_set_varAction
  | SET_world_timeInS_advancePlayerAction
  | SET_world_timeInS_rollbackAction
  | SET_world_timeInS_var_declAction
  | SET_world_timeInS_expr_primary_leftStepsAction
  | SET_world_timeInS_expr_primary_constantAction
  | SET_world_timeInS_expr_primary_identAction
  | SET_world_timeInS_expr_primary_incrementOrDecrementAction
  | SET_world_timeInS_expr_disjunctionAction
  | SET_world_timeInS_expr_conjunctionAction
  | SET_world_timeInS_expr_comparisonAction
  | SET_world_timeInS_expr_relationAction
  | SET_world_timeInS_expr_sumAction
  | SET_world_timeInS_expr_termAction
  | SET_world_timeInS_expr_factorAction


export function reducer(state: State = initial, action: AllActions): State {

  switch (action.type) {

    case ActionType.SET_selectedFieldBorderColor:
      return {
        ...state,
        selectedFieldBorderColor: action.selectedFieldBorderColor
      }

    case ActionType.SET_selectedFieldBorderThicknessInPx:
      return {
        ...state,
        selectedFieldBorderThicknessInPx: action.selectedFieldBorderThicknessInPx
      }

    case ActionType.SET_gridStrokeThicknessInPx:
      return {
        ...state,
        gridStrokeThicknessInPx: action.gridStrokeThicknessInPx
      }

    case ActionType.SET_gridStrokeColor:
      return {
        ...state,
        gridStrokeColor: action.gridStrokeColor
      }

    case ActionType.SET_linePointsUiDiameter:
      return {
        ...state,
        linePointsUiDiameter: action.linePointsUiDiameter
      }

    case ActionType.SET_linePointsUiColor:
      return {
        ...state,
        linePointsUiColor: action.linePointsUiColor
      }

    case ActionType.SET_tileMidPointsUiColor:
      return {
        ...state,
        tileMidPointsUiColor: action.tileMidPointsUiColor
      }

    case ActionType.SET_tileMidPointsDiameter:
      return {
        ...state,
        tileMidPointsDiameter: action.tileMidPointsDiameter
      }

    case ActionType.SET_lineBezierControlPoint1UiDiameter:
      return {
        ...state,
        lineBezierControlPoint1UiDiameter: action.lineBezierControlPoint1UiDiameter
      }

    case ActionType.SET_lineBezierControlPoint1UiColor:
      return {
        ...state,
        lineBezierControlPoint1UiColor: action.lineBezierControlPoint1UiColor
      }

    case ActionType.SET_lineBezierControlPoint2UiDiameter:
      return {
        ...state,
        lineBezierControlPoint2UiDiameter: action.lineBezierControlPoint2UiDiameter
      }

    case ActionType.SET_lineBezierControlPoint2UiColor:
      return {
        ...state,
        lineBezierControlPoint2UiColor: action.lineBezierControlPoint2UiColor
      }

    case ActionType.SET_fieldSequenceBoxColor:
      return {
        ...state,
        fieldSequenceBoxColor: action.fieldSequenceBoxColor
      }

    case ActionType.SET_fieldSequenceFont:
      return {
        ...state,
        fieldSequenceFont: action.fieldSequenceFont
      }

    case ActionType.SET_fieldSequenceFontColor:
      return {
        ...state,
        fieldSequenceFontColor: action.fieldSequenceFontColor
      }

    case ActionType.SET_fieldSequenceFontSizeInPx:
      return {
        ...state,
        fieldSequenceFontSizeInPx: action.fieldSequenceFontSizeInPx
      }

    case ActionType.SET_anchorPointColor:
      return {
        ...state,
        anchorPointColor: action.anchorPointColor
      }

    case ActionType.SET_anchorPointDiameter:
      return {
        ...state,
        anchorPointDiameter: action.anchorPointDiameter
      }
    case ActionType.SET_anchorPointSnapToleranceRadiusInPx:
      return {
        ...state,
        anchorPointSnapToleranceRadiusInPx: action.anchorPointSnapToleranceRadiusInPx
      }

    case ActionType.SET_world_stageOffset:
      return {
        ...state,
        stageOffsetX: action.stageOffsetX,
        stageOffsetY: action.stageOffsetY
      }

    case ActionType.SET_world_stageOffsetScaleCorrection:
      return {
        ...state,
        stageOffsetXScaleCorrection: action.stageOffsetXScaleCorrection,
        stageOffsetYScaleCorrection: action.stageOffsetYScaleCorrection
      }

    case ActionType.SET_world_stageScale:
      return {
        ...state,
        stageScaleX: action.stageScaleX,
        stageScaleY: action.stageScaleY
      }


    case ActionType.SET_world_worldWidthInTiles:
      return {
        ...state,
        worldWidthInTiles: action.worldWidthInTiles
      }
    case ActionType.SET_world_worldHeightInTiles:
      return {
        ...state,
        worldHeightInTiles: action.worldHeightInTiles
      }

    case ActionType.SET_world_expectedTileWidth:
      return {
        ...state,
        expectedTileWidth: action.expectedTileWidth
      }
    case ActionType.SET_world_expectedTileHeight:
      return {
        ...state,
        expectedTileHeight: action.expectedTileHeight
      }

    case ActionType.SET_world_worldCmdText:
      return {
        ...state,
        worldCmdText: action.worldCmdText
      }
    case ActionType.SET_world_printGameAsOneImage:
      return {
        ...state,
        printGameAsOneImage: action.printGameAsOneImage
      }


    case ActionType.SET_world_timeInS_rollDice:

      //if we run multiple simulations we set the simulation times again because
      //SimulationTimes is a new instance in the worker
      //for normal simulation (debug) we want the right times too

      const copy = {
        ...state,
        timeInS_rollDice: SimulationTimes._timeInS_rollDice = action.timeInS_rollDice
      }

      return copy
    case ActionType.SET_world_timeInS_choose_bool_func:
      return {
        ...state,
        timeInS_choose_bool_func: SimulationTimes._timeInS_choose_bool_func = action.timeInS_choose_bool_func
      }

    case ActionType.SET_world_timeInS_goto:
      return {
        ...state,
        timeInS_goto: SimulationTimes._timeInS_goto = action.timeInS_goto
      }

    case ActionType.SET_world_timeInS_set_var:
      return {
        ...state,
        timeInS_set_var: SimulationTimes._timeInS_set_var = action.timeInS_set_var
      }

    case ActionType.SET_world_timeInS_advancePlayer:
      return {
        ...state,
        timeInS_advancePlayer: SimulationTimes._timeInS_advancePlayer = action.timeInS_advancePlayer
      }

    case ActionType.SET_world_timeInS_rollback:
      return {
        ...state,
        timeInS_rollback: SimulationTimes._timeInS_rollback = action.timeInS_rollback
      }

    case ActionType.SET_world_timeInS_var_decl:
      return {
        ...state,
        timeInS_var_decl: SimulationTimes._timeInS_var_decl = action.timeInS_var_decl
      }

    case ActionType.SET_world_timeInS_expr_primary_leftSteps:
      return {
        ...state,
        timeInS_expr_primary_leftSteps: SimulationTimes._timeInS_expr_primary_leftSteps = action.timeInS_expr_primary_leftSteps
      }

    case ActionType.SET_world_timeInS_expr_primary_constant:
      return {
        ...state,
        timeInS_expr_primary_constant: SimulationTimes._timeInS_expr_primary_constant = action.timeInS_expr_primary_constant
      }

    case ActionType.SET_world_timeInS_expr_primary_ident:
      return {
        ...state,
        timeInS_expr_primary_ident: SimulationTimes._timeInS_expr_primary_ident = action.timeInS_expr_primary_ident
      }

    case ActionType.SET_world_timeInS_expr_primary_incrementOrDecrement:
      return {
        ...state,
        timeInS_expr_primary_incrementOrDecrement: SimulationTimes._timeInS_expr_primary_incrementOrDecrement = action.timeInS_expr_primary_incrementOrDecrement
      }

    case ActionType.SET_world_timeInS_expr_disjunction:
      return {
        ...state,
        timeInS_expr_disjunction: SimulationTimes._timeInS_expr_disjunction = action.timeInS_expr_disjunction
      }

    case ActionType.SET_world_timeInS_expr_conjunction:
      return {
        ...state,
        timeInS_expr_conjunction: SimulationTimes._timeInS_expr_conjunction = action.timeInS_expr_conjunction
      }

    case ActionType.SET_world_timeInS_expr_comparison:
      return {
        ...state,
        timeInS_expr_comparison: SimulationTimes._timeInS_expr_comparison = action.timeInS_expr_comparison
      }

    case ActionType.SET_world_timeInS_expr_relation:
      return {
        ...state,
        timeInS_expr_relation: SimulationTimes._timeInS_expr_relation = action.timeInS_expr_relation
      }

    case ActionType.SET_world_timeInS_expr_sum:
      return {
        ...state,
        timeInS_expr_sum: SimulationTimes._timeInS_expr_sum = action.timeInS_expr_sum
      }

    case ActionType.SET_world_timeInS_expr_term:
      return {
        ...state,
        timeInS_expr_term: SimulationTimes._timeInS_expr_term = action.timeInS_expr_term
      }

    case ActionType.SET_world_timeInS_expr_factor:
      return {
        ...state,
        timeInS_expr_factor: SimulationTimes._timeInS_expr_factor = action.timeInS_expr_factor
      }

    case ActionType.replace_worldSettings:
      return {
        ...action.newWorldSettings
      }

    case ActionType.RESET:
      return initial

    default:
      notExhaustive(action)
      return state
  }
}


