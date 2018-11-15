export interface IdAble {
  readonly id: number
}

export interface GuidAble {
  readonly guid: string
}


export interface Rect {
   x: number
   y: number
   width: number
   height: number
}

export interface ShapeBase {
  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number

  /**
   * don't allow null, use transparent
   */
  readonly bgColor: string

  /**
   * don't allow null, use transparent
   */
  readonly color: string

  /**
   * space between border and text
   */
  readonly padding: AbsolutePosition

  /**
   * the command to execute (used for simulation)
   */
  readonly cmdText: string | null

  /**
   * the z index 0 is bottom max is top most
   * this is absolute over all shapes
   */
  readonly zIndex: number
}


export interface AbsolutePosition {
  readonly top: number
  readonly right: number
  readonly bottom: number
  readonly left: number
}

export enum VerticalAlign {
  top = 0,
  center = 1,
  bottom = 2,
}

export enum HorizontalAlign {
  left = 0,
  center = 1,
  right = 2
}


export interface ConnectedLinesThroughAnchorPointsMap {
  /**
   * the connected points of that line (the ids)
   */
  [lineId: number]: ReadonlyArray<number> | undefined
}

export interface FieldBase extends ShapeBase {
  /**
   * true: the field is a symbol for other fields
   * false: normal field
   *
   * this is useful if we use components for symbols and non-symbols (e.g. props editors)
   */
  readonly isSymbol: boolean

  readonly createdFromSymbolGuid: string | null

  readonly text: string | null
  readonly verticalTextAlign: VerticalAlign
  readonly horizontalTextAlign: HorizontalAlign

  readonly cornerRadiusInPx: number

  /**
   * the border size in px
   *
   * we don't use top,left,right,bot because corner radius... & it's easier
   */
  readonly borderSizeInPx: number
  readonly borderColor: string

  readonly fontSizeInPx: number
  readonly fontName: string

  readonly rotationInDegree: number

  readonly isFontBold: boolean
  readonly isFontItalic: boolean
  /**
   * currently not used because not that easy...
   * e.g. when line breaks
   * https://stackoverflow.com/questions/32534886/easeljs-underline-text
   */
  readonly isFontUnderlined: boolean

  /**
   * the order of the anchor points must not change!
   * because we need to know which anchor point was move to adjust the line point pos
   * @see adjustLinesFromAnchorPoints
   */
  readonly anchorPoints: ReadonlyArray<AnchorPoint>

  /**
   * for every connected line an key: value are the connected points of that line
   *
   * this can not always be trusted... undo not properly working you can recalculate this with
   * @see isFieldAndLineConnectedThroughAnchorPoints
   */
  readonly connectedLinesThroughAnchorPoints: ConnectedLinesThroughAnchorPointsMap

  /**
   * a background image for the field...
   * we still allow background color e.g. when the background img has transparent parts
   *
   * don't store the data twice... use external storage for that
   */
  readonly backgroundImgGuid: string | null
}

export interface FieldShape extends FieldBase, IdAble {
}

export interface FieldSymbol extends FieldBase, GuidAble {

  /**
   * a name e.g. when there is no space for a preview
   * can be changed by user
   */
  readonly displayName: string

  /**
   * 0 is ui top/left, N last
   */
  readonly displayIndex: number
}

export interface ImgBase {
  /**
   * true: the image is a symbol for other images
   * false: normal image
   *
   * this is useful if we use components for symbols and non-symbols (e.g. props editors)
   */
  readonly isSymbol: boolean

  readonly createdFromSymbolGuid: string | null

  /**
   * don't store the data twice... use external storage for that
   * use null for a generic img (fill rect with x or something like a placeholder)
   */
  readonly imgGuid: string | null

  readonly x: number
  readonly y: number
  readonly width: number
  readonly height: number
  readonly zIndex: number

  readonly rotationInDegree: number

  readonly skewX: number
  readonly skewY: number

  /**
   * true: mouse selection is disabled for this image (useful if we use this img as background)
   * false: normal mouse interaction e.g. selectable
   */
  readonly isMouseSelectionDisabled: boolean
}

export interface ImgShape extends ImgBase, IdAble {

}

export interface ImgSymbol extends ImgBase, GuidAble {

  /**
   * a name e.g. when there is no space for a preview
   * can be changed by user
   */
  readonly displayName: string

  /**
   * 0 is ui top/left, N last
   */
  readonly displayIndex: number
}


export interface Point {
  readonly id: number

  readonly x: number
  readonly y: number
}

export interface BorderPoint {
  readonly id: number

  /**
   * relative to the border (e.g. left/right border then this is the y coordinate, x for top/bottom)
   * absolute pos in px!
   */
  readonly val: number

  /**
   * when we come from another tile and we get to this border point
   * we need to know which is the next field
   */
  readonly nextFieldId: number | null
}

export interface BorderPointWithPos extends BorderPoint{

  readonly x: number
  readonly y: number
}

export enum BorderPointOrientation {
  top = 0,
  right = 1,
  bottom = 2,
  left = 3
}

export interface PlainPoint {
  readonly x: number
  readonly y: number
}

export interface AnchorPoint {
  /**
   * the percentage for x (from top left)
   */
  readonly percentX: number
  /**
   * the percentage for y (from top left)
   */
  readonly percentY: number
}

export interface BezierPoint extends Point {

  //control point 1
  readonly cp1: Point

  //control point 2
  readonly cp2: Point

  readonly curveMode: CurveMode
}

/**
 * the relation between cp2 and the cp1 of the next bezier point
 */
export enum CurveMode {

  /**
   * freely rotate cp2 and cp1
   */
  free = 0,
  /**
   * cp2 and the cp1 of the next bezier point need to have 180 degree between
   * @type {number}
   */
  smooth = 1,
  /**
   * actual no curve just a linear line
   * @type {number}
   */
  linear = 2,
}

export interface LineBase {

  /**
   * true: the line is a symbol for other lines
   * false: normal line
   *
   * this is useful if we use components for symbols and non-symbols (e.g. props editors)
   */
  readonly isSymbol: boolean

  readonly createdFromSymbolGuid: string | null


  readonly lineThicknessInPx: number
  readonly color: string

  readonly startPoint: Point
  /**
   * the points are ordered!
   */
  readonly points: ReadonlyArray<BezierPoint>

  readonly hasStartArrow: boolean
  readonly hasEndArrow: boolean

  readonly arrowHeight: number
  readonly arrowWidth: number

  readonly zIndex: number

  readonly dashArray: ReadonlyArray<number>
}

export interface LineShape extends LineBase, IdAble {

}

export interface LineSymbol extends LineBase, GuidAble {

  /**
   * a name e.g. when there is no space for a preview
   * can be changed by user
   */
  readonly displayName: string

  /**
   * 0 is ui top/left, N last
   */
  readonly displayIndex: number
}