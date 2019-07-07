import {
  ActionBase,
  ActionType,
  SET_anchorPointColorAction,
  SET_anchorPointDiameterAction,
  SET_anchorPointSnapToleranceRadiusInPxAction,
  SET_fieldSequenceBoxColorAction,
  SET_fieldSequenceFontAction,
  SET_fieldSequenceFontColorAction,
  SET_fieldSequenceFontSizeInPxAction,
  SET_gridStrokeColorAction,
  SET_gridStrokeThicknessInPxAction,
  SET_lineBezierControlPoint1UiColorAction,
  SET_lineBezierControlPoint1UiDiameterAction,
  SET_lineBezierControlPoint2UiColorAction,
  SET_lineBezierControlPoint2UiDiameterAction,
  SET_linePointsUiColorAction,
  SET_linePointsUiDiameterAction,
  SET_selectedFieldBorderColorAction,
  SET_selectedFieldBorderThicknessInPxAction,
  SET_tileMidPointsDiameterAction,
  SET_tileMidPointsUiColorAction,
  SET_world_expectedTileHeightAction,
  SET_world_expectedTileWidthAction,
  SET_world_worldWidthInTilesAction,
  SET_world_worldHeightInTilesAction,
  SET_world_stageOffsetAction,
  SET_world_stageScaleAction,
  SET_world_stageOffsetScaleCorrectionAction,
  SET_world_worldCmdTextAction,
  SET_world_printGameAsOneImageAction,
  SET_world_timeInS_rollDiceAction,
  SET_world_timeInS_choose_bool_funcAction,
  SET_world_timeInS_gotoAction,
  SET_world_timeInS_set_varAction,
  SET_world_timeInS_advancePlayerAction,
  SET_world_timeInS_rollbackAction,
  SET_world_timeInS_var_declAction,
  SET_world_timeInS_expr_primary_leftStepsAction,
  SET_world_timeInS_expr_primary_constantAction,
  SET_world_timeInS_expr_primary_identAction,
  SET_world_timeInS_expr_primary_incrementOrDecrementAction,
  SET_world_timeInS_expr_disjunctionAction,
  SET_world_timeInS_expr_conjunctionAction,
  SET_world_timeInS_expr_comparisonAction,
  SET_world_timeInS_expr_relationAction,
  SET_world_timeInS_expr_sumAction,
  SET_world_timeInS_expr_termAction,
  SET_world_timeInS_expr_factorAction,
  WorldSettings,
  replace_worldSettingsAction,
  SET_world_printScaleAction,
  SET_world_additionalBorderWidthInPxAction,
  SET_alwaysInsertArrowHeadsWhenAutoConnectingFieldsAction,
  SET_forcedFieldAutoPrependTextAction,
  SET_forcedFieldAutoBorderSizeInPxAction,
  SET_forcedFieldBorderColorAction,
  SET_branchIfPrependTextAction,
  SET_forcedFieldIsFontBoldAction,
  SET_forcedFieldIsFontItalicAction,
  SET_branchIfIsFontBoldAction,
  SET_branchIfIsFontItalicAction,
  SET_branchIfAutoBorderSizeInPxAction,
  SET_branchIfBorderColorAction,
  SET_forcedFieldColorAction,
  SET_forcedFieldBgColorAction,
  SET_branchIfColorAction,
  SET_branchIfBgColorAction,
  SET_startFieldAutoPrependTextAction,
  SET_startFieldColorAction,
  SET_startFieldBgColorAction,
  SET_startFieldAutoBorderSizeInPxAction,
  SET_startFieldBorderColorAction,
  SET_startFieldIsFontBoldAction,
  SET_startFieldIsFontItalicAction,
  SET_endFieldAutoPrependTextAction,
  SET_endFieldColorAction,
  SET_endFieldBgColorAction,
  SET_endFieldAutoBorderSizeInPxAction,
  SET_endFieldBorderColorAction,
  SET_endFieldIsFontBoldAction,
  SET_endFieldIsFontItalicAction,
} from "./worldSettingsReducer";


export function SET_world_selectedFieldBorderColor(selectedFieldBorderColor: string): SET_selectedFieldBorderColorAction {
  return {
    type: ActionType.SET_selectedFieldBorderColor,
    selectedFieldBorderColor
  }
}

export function SET_world_selectedFieldBorderThicknessInPx(selectedFieldBorderThicknessInPx: number): SET_selectedFieldBorderThicknessInPxAction {
  return {
    type: ActionType.SET_selectedFieldBorderThicknessInPx,
    selectedFieldBorderThicknessInPx
  }
}

export function SET_world_gridStrokeThicknessInPx(gridStrokeThicknessInPx: number): SET_gridStrokeThicknessInPxAction {
  return {
    type: ActionType.SET_gridStrokeThicknessInPx,
    gridStrokeThicknessInPx
  }
}

export function SET_world_gridStrokeColor(gridStrokeColor: string): SET_gridStrokeColorAction {
  return {
    type: ActionType.SET_gridStrokeColor,
    gridStrokeColor
  }
}

export function SET_world_linePointsUiDiameter(linePointsUiDiameter: number): SET_linePointsUiDiameterAction {
  return {
    type: ActionType.SET_linePointsUiDiameter,
    linePointsUiDiameter
  }
}

export function SET_world_linePointsUiColor(linePointsUiColor: string): SET_linePointsUiColorAction {
  return {
    type: ActionType.SET_linePointsUiColor,
    linePointsUiColor
  }
}

export function SET_world_tileMidPointsUiColor(tileMidPointsUiColor: string): SET_tileMidPointsUiColorAction {
  return {
    type: ActionType.SET_tileMidPointsUiColor,
    tileMidPointsUiColor
  }
}

export function SET_world_tileMidPointsDiameter(tileMidPointsDiameter: number): SET_tileMidPointsDiameterAction {
  return {
    type: ActionType.SET_tileMidPointsDiameter,
    tileMidPointsDiameter
  }
}

export function SET_world_lineBezierControlPoint1UiDiameterAction(lineBezierControlPoint1UiDiameter: number): SET_lineBezierControlPoint1UiDiameterAction {
  return {
    type: ActionType.SET_lineBezierControlPoint1UiDiameter,
    lineBezierControlPoint1UiDiameter
  }
}

export function SET_world_lineBezierControlPoint1UiColorAction(lineBezierControlPoint1UiColor: string): SET_lineBezierControlPoint1UiColorAction {
  return {
    type: ActionType.SET_lineBezierControlPoint1UiColor,
    lineBezierControlPoint1UiColor
  }
}

export function SET_world_lineBezierControlPoint2UiDiameterAction(lineBezierControlPoint2UiDiameter: number): SET_lineBezierControlPoint2UiDiameterAction {
  return {
    type: ActionType.SET_lineBezierControlPoint2UiDiameter,
    lineBezierControlPoint2UiDiameter
  }
}

export function SET_world_lineBezierControlPoint2UiColorAction(lineBezierControlPoint2UiColor: string): SET_lineBezierControlPoint2UiColorAction {
  return {
    type: ActionType.SET_lineBezierControlPoint2UiColor,
    lineBezierControlPoint2UiColor
  }
}


export function SET_world_fieldSequenceBoxColor(fieldSequenceBoxColor: string): SET_fieldSequenceBoxColorAction {
  return {
    type: ActionType.SET_fieldSequenceBoxColor,
    fieldSequenceBoxColor
  }
}

export function SET_world_fieldSequenceFont(fieldSequenceFont: string): SET_fieldSequenceFontAction {
  return {
    type: ActionType.SET_fieldSequenceFont,
    fieldSequenceFont
  }
}

export function SET_world_fieldSequenceFontColor(fieldSequenceFontColor: string): SET_fieldSequenceFontColorAction {
  return {
    type: ActionType.SET_fieldSequenceFontColor,
    fieldSequenceFontColor
  }
}

export function SET_world_fieldSequenceFontSizeInPx(fieldSequenceFontSizeInPx: number): SET_fieldSequenceFontSizeInPxAction {
  return {
    type: ActionType.SET_fieldSequenceFontSizeInPx,
    fieldSequenceFontSizeInPx
  }
}

export function SET_world_anchorPointColor(anchorPointColor: string): SET_anchorPointColorAction {
  return {
    type: ActionType.SET_anchorPointColor,
    anchorPointColor
  }
}

export function SET_world_anchorPointDiameter(anchorPointDiameter: number): SET_anchorPointDiameterAction {
  return {
    type: ActionType.SET_anchorPointDiameter,
    anchorPointDiameter
  }
}

export function set_world_anchorPointSnapToleranceRadiusInPx(anchorPointSnapToleranceRadiusInPx: number): SET_anchorPointSnapToleranceRadiusInPxAction {
  return {
    type: ActionType.SET_anchorPointSnapToleranceRadiusInPx,
    anchorPointSnapToleranceRadiusInPx
  }
}

//--- real world settings

export function set_world_stageScale(stageScaleX: number, stageScaleY: number): SET_world_stageScaleAction {
  return {
    type: ActionType.SET_world_stageScale,
    stageScaleX,
    stageScaleY
  }
}


export function set_world_stageOffset(stageOffsetX: number, stageOffsetY: number): SET_world_stageOffsetAction {
  return {
    type: ActionType.SET_world_stageOffset,
    stageOffsetX,
    stageOffsetY
  }
}

export function set_world_stageOffsetScaleCorrection(stageOffsetXScaleCorrection: number, stageOffsetYScaleCorrection: number): SET_world_stageOffsetScaleCorrectionAction {
  return {
    type: ActionType.SET_world_stageOffsetScaleCorrection,
    stageOffsetXScaleCorrection,
    stageOffsetYScaleCorrection
  }
}

export function set_world_worldWidthInTiles(sizeInTilesX: number): SET_world_worldWidthInTilesAction {
  return {
    type: ActionType.SET_world_worldWidthInTiles,
    worldWidthInTiles: sizeInTilesX
  }
}


export function set_world_worldHeightInTiles(sizeInTilesY: number): SET_world_worldHeightInTilesAction {
  return {
    type: ActionType.SET_world_worldHeightInTiles,
    worldHeightInTiles: sizeInTilesY
  }
}

export function set_world_expectedTileWidth(expectedTileWidth: number): SET_world_expectedTileWidthAction {
  return {
    type: ActionType.SET_world_expectedTileWidth,
    expectedTileWidth
  }
}

export function set_world_expectedTileHeight(expectedTileHeight: number): SET_world_expectedTileHeightAction {
  return {
    type: ActionType.SET_world_expectedTileHeight,
    expectedTileHeight
  }
}

export function set_world_worldCmdTextAction(worldCmdText: string): SET_world_worldCmdTextAction {
  return {
    type: ActionType.SET_world_worldCmdText,
    worldCmdText
  }
}

export function set_world_printGameAsOneImageAction(printGameAsOneImage: boolean): SET_world_printGameAsOneImageAction {
  return {
    type: ActionType.SET_world_printGameAsOneImage,
    printGameAsOneImage
  }
}

export function set_world_printScale(printScale: number): SET_world_printScaleAction {
  return {
    type: ActionType.SET_world_printScale,
    printScale
  }
}

export function set_world_additionalBorderWidthInPx(additionalBorderWidthInPx: number): SET_world_additionalBorderWidthInPxAction {
  return {
    type: ActionType.SET_world_additionalBorderWidthInPx,
    additionalBorderWidthInPx
  }
}


//--- times for simulation

export function set_world_timeInS_rollDiceAction(timeInS_rollDice: number): SET_world_timeInS_rollDiceAction {
  return {
    type: ActionType.SET_world_timeInS_rollDice,
    timeInS_rollDice
  }
}

export function set_world_timeInS_choose_bool_funcAction(timeInS_choose_bool_func: number): SET_world_timeInS_choose_bool_funcAction {
  return {
    type: ActionType.SET_world_timeInS_choose_bool_func,
    timeInS_choose_bool_func
  }
}

export function set_world_timeInS_gotoAction(timeInS_goto: number): SET_world_timeInS_gotoAction {
  return {
    type: ActionType.SET_world_timeInS_goto,
    timeInS_goto
  }
}

export function set_world_timeInS_set_varAction(timeInS_set_var: number): SET_world_timeInS_set_varAction {
  return {
    type: ActionType.SET_world_timeInS_set_var,
    timeInS_set_var
  }
}

export function set_world_timeInS_advancePlayerAction(timeInS_advancePlayer: number): SET_world_timeInS_advancePlayerAction {
  return {
    type: ActionType.SET_world_timeInS_advancePlayer,
    timeInS_advancePlayer
  }
}

export function set_world_timeInS_rollbackAction(timeInS_rollback: number): SET_world_timeInS_rollbackAction {
  return {
    type: ActionType.SET_world_timeInS_rollback,
    timeInS_rollback
  }
}

export function set_world_timeInS_var_declAction(timeInS_var_decl: number): SET_world_timeInS_var_declAction {
  return {
    type: ActionType.SET_world_timeInS_var_decl,
    timeInS_var_decl
  }
}

export function set_world_timeInS_expr_primary_leftStepsAction(timeInS_expr_primary_leftSteps: number): SET_world_timeInS_expr_primary_leftStepsAction {
  return {
    type: ActionType.SET_world_timeInS_expr_primary_leftSteps,
    timeInS_expr_primary_leftSteps
  }
}

export function set_world_timeInS_expr_primary_constantAction(timeInS_expr_primary_constant: number): SET_world_timeInS_expr_primary_constantAction {
  return {
    type: ActionType.SET_world_timeInS_expr_primary_constant,
    timeInS_expr_primary_constant
  }
}

export function set_world_timeInS_expr_primary_identAction(timeInS_expr_primary_ident: number): SET_world_timeInS_expr_primary_identAction {
  return {
    type: ActionType.SET_world_timeInS_expr_primary_ident,
    timeInS_expr_primary_ident
  }
}

export function set_world_timeInS_expr_primary_incrementOrDecrementAction(timeInS_expr_primary_incrementOrDecrement: number): SET_world_timeInS_expr_primary_incrementOrDecrementAction {
  return {
    type: ActionType.SET_world_timeInS_expr_primary_incrementOrDecrement,
    timeInS_expr_primary_incrementOrDecrement
  }
}

export function set_world_timeInS_expr_disjunctionAction(timeInS_expr_disjunction: number): SET_world_timeInS_expr_disjunctionAction {
  return {
    type: ActionType.SET_world_timeInS_expr_disjunction,
    timeInS_expr_disjunction
  }
}

export function set_world_timeInS_expr_conjunctionAction(timeInS_expr_conjunction: number): SET_world_timeInS_expr_conjunctionAction {
  return {
    type: ActionType.SET_world_timeInS_expr_conjunction,
    timeInS_expr_conjunction
  }
}

export function set_world_timeInS_expr_comparisonAction(timeInS_expr_comparison: number): SET_world_timeInS_expr_comparisonAction {
  return {
    type: ActionType.SET_world_timeInS_expr_comparison,
    timeInS_expr_comparison
  }
}

export function set_world_timeInS_expr_relationAction(timeInS_expr_relation: number): SET_world_timeInS_expr_relationAction {
  return {
    type: ActionType.SET_world_timeInS_expr_relation,
    timeInS_expr_relation
  }
}

export function set_world_timeInS_expr_sumAction(timeInS_expr_sum: number): SET_world_timeInS_expr_sumAction {
  return {
    type: ActionType.SET_world_timeInS_expr_sum,
    timeInS_expr_sum
  }
}

export function set_world_timeInS_expr_termAction(timeInS_expr_term: number): SET_world_timeInS_expr_termAction {
  return {
    type: ActionType.SET_world_timeInS_expr_term,
    timeInS_expr_term
  }
}

export function set_world_timeInS_expr_factorAction(timeInS_expr_factor: number): SET_world_timeInS_expr_factorAction {
  return {
    type: ActionType.SET_world_timeInS_expr_factor,
    timeInS_expr_factor
  }
}

export function replace_worldSettings(newWorldSettings: WorldSettings): replace_worldSettingsAction {
  return {
    type: ActionType.replace_worldSettings,
    newWorldSettings
  }
}


//--- global tile settings

export function set_world_alwaysInsertArrowHeadsWhenAutoConnectingFields(alwaysInsertArrowHeadsWhenAutoConnectingFields: boolean): SET_alwaysInsertArrowHeadsWhenAutoConnectingFieldsAction {
  return {
    type: ActionType.SET_alwaysInsertArrowHeadsWhenAutoConnectingFields,
    alwaysInsertArrowHeadsWhenAutoConnectingFields
  }
}

//--- force field style

export function set_world_forcedFieldAutoPrependText(forcedFieldAutoPrependText: string): SET_forcedFieldAutoPrependTextAction {
  return {
    type: ActionType.SET_forcedFieldAutoPrependText,
    forcedFieldAutoPrependText
  }
}

export function set_world_forcedFieldAutoBorderSizeInPx(forcedFieldAutoBorderSizeInPx: number): SET_forcedFieldAutoBorderSizeInPxAction {
  return {
    type: ActionType.SET_forcedFieldAutoBorderSizeInPx,
    forcedFieldAutoBorderSizeInPx
  }
}

export function set_world_forcedFieldBorderColor(forcedFieldBorderColor: string): SET_forcedFieldBorderColorAction {
  return {
    type: ActionType.SET_forcedFieldBorderColor,
    forcedFieldBorderColor
  }
}

export function set_world_forcedFieldIsFontBold(forcedFieldIsFontBold: boolean): SET_forcedFieldIsFontBoldAction {
  return {
    type: ActionType.SET_forcedFieldIsFontBold,
    forcedFieldIsFontBold
  }
}

export function set_world_forcedFieldIsFontItalic(forcedFieldIsFontItalic: boolean): SET_forcedFieldIsFontItalicAction {
  return {
    type: ActionType.SET_forcedFieldIsFontItalic,
    forcedFieldIsFontItalic
  }
}

export function set_world_forcedFieldColor(forcedFieldColor: string): SET_forcedFieldColorAction {
  return {
    type: ActionType.SET_forcedFieldColor,
    forcedFieldColor
  }
}


export function set_world_forcedFieldBgColor(forcedFieldBgColor: string): SET_forcedFieldBgColorAction {
  return {
    type: ActionType.SET_forcedFieldBgColor,
    forcedFieldBgColor
  }
}


//--- start field style

export function set_world_startFieldAutoPrependText(startFieldAutoPrependText: string) : SET_startFieldAutoPrependTextAction {
  return {
    type: ActionType.SET_startFieldAutoPrependText,
    startFieldAutoPrependText
  }
}
export function set_world_startFieldColor(startFieldColor: string) : SET_startFieldColorAction {
  return {
    type: ActionType.SET_startFieldColor,
    startFieldColor
  }
}
export function set_world_startFieldBgColor(startFieldBgColor: string) : SET_startFieldBgColorAction {
  return {
    type: ActionType.SET_startFieldBgColor,
    startFieldBgColor
  }
}
export function set_world_startFieldAutoBorderSizeInPx(startFieldAutoBorderSizeInPx: number) : SET_startFieldAutoBorderSizeInPxAction {
  return {
    type: ActionType.SET_startFieldAutoBorderSizeInPx,
    startFieldAutoBorderSizeInPx
  }
}
export function set_world_startFieldBorderColor(startFieldBorderColor: string) : SET_startFieldBorderColorAction {
  return {
    type: ActionType.SET_startFieldBorderColor,
    startFieldBorderColor
  }
}
export function set_world_startFieldIsFontBold(startFieldIsFontBold: boolean) : SET_startFieldIsFontBoldAction {
  return {
    type: ActionType.SET_startFieldIsFontBold,
    startFieldIsFontBold
  }
}
export function set_world_startFieldIsFontItalic(startFieldIsFontItalic: boolean) : SET_startFieldIsFontItalicAction {
  return {
    type: ActionType.SET_startFieldIsFontItalic,
    startFieldIsFontItalic
  }
}

//--- end field style

export function set_world_endFieldAutoPrependText(endFieldAutoPrependText: string): SET_endFieldAutoPrependTextAction {
  return {
    type: ActionType.SET_endFieldAutoPrependText,
    endFieldAutoPrependText
  }
}
export function set_world_endFieldColor(endFieldColor: string): SET_endFieldColorAction {
  return {
    type: ActionType.SET_endFieldColor,
    endFieldColor
  }
}
export function set_world_endFieldBgColor(endFieldBgColor: string): SET_endFieldBgColorAction {
  return {
    type: ActionType.SET_endFieldBgColor,
    endFieldBgColor
  }
}
export function set_world_endFieldAutoBorderSizeInPx(endFieldAutoBorderSizeInPx: number): SET_endFieldAutoBorderSizeInPxAction {
  return {
    type: ActionType.SET_endFieldAutoBorderSizeInPx,
    endFieldAutoBorderSizeInPx
  }
}
export function set_world_endFieldBorderColor(endFieldBorderColor: string): SET_endFieldBorderColorAction {
  return {
    type: ActionType.SET_endFieldBorderColor,
    endFieldBorderColor
  }
}
export function set_world_endFieldIsFontBold(endFieldIsFontBold: boolean): SET_endFieldIsFontBoldAction {
  return {
    type: ActionType.SET_endFieldIsFontBold,
    endFieldIsFontBold
  }
}
export function set_world_endFieldIsFontItalic(endFieldIsFontItalic: boolean): SET_endFieldIsFontItalicAction {
  return {
    type: ActionType.SET_endFieldIsFontItalic,
    endFieldIsFontItalic
  }
}

//--- branch if field style

export function set_world_branchIfPrependText(branchIfPrependText: string): SET_branchIfPrependTextAction {
  return {
    type: ActionType.SET_branchIfPrependText,
    branchIfPrependText
  }
}

export function set_world_branchIfAutoBorderSizeInPx(branchIfAutoBorderSizeInPx: number): SET_branchIfAutoBorderSizeInPxAction {
  return {
    type: ActionType.SET_branchIfAutoBorderSizeInPx,
    branchIfAutoBorderSizeInPx
  }
}

export function set_world_branchIfBorderColor(branchIfBorderColor: string): SET_branchIfBorderColorAction {
  return {
    type: ActionType.SET_branchIfBorderColor,
    branchIfBorderColor
  }
}

export function set_world_branchIfIsFontBold(branchIfIsFontBold: boolean): SET_branchIfIsFontBoldAction {
  return {
    type: ActionType.SET_branchIfIsFontBold,
    branchIfIsFontBold
  }
}

export function set_world_branchIfIsFontItalic(branchIfIsFontItalic: boolean): SET_branchIfIsFontItalicAction {
  return {
    type: ActionType.SET_branchIfIsFontItalic,
    branchIfIsFontItalic
  }
}

export function set_world_branchIfColor(branchIfColor: string): SET_branchIfColorAction {
  return {
    type: ActionType.SET_branchIfColor,
    branchIfColor
  }
}

export function set_world_branchIfBgColor(branchIfBgColor: string): SET_branchIfBgColorAction {
  return {
    type: ActionType.SET_branchIfBgColor,
    branchIfBgColor
  }
}

