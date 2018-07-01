import {FieldShape, FieldSymbol, ImgShape, ImgSymbol, LineShape, LineSymbol} from "../types/drawing";


export function isFieldShape(field: FieldShape | FieldSymbol): field is FieldShape {
  return (field as FieldShape).id !== undefined
}

export function isFieldSymbol(field: FieldShape | FieldSymbol): field is FieldSymbol {
  return (field as FieldSymbol).guid !== undefined
}

export function isLineShape(field: LineShape | LineSymbol): field is LineShape {
  return (field as LineShape).id !== undefined
}

export function isLineSymbol(field: LineShape | LineSymbol): field is LineSymbol {
  return (field as LineSymbol).guid !== undefined
}

export function isImgShape(field: ImgShape | ImgSymbol): field is ImgShape {
  return (field as ImgShape).id !== undefined
}

export function isImgSymbol(field: ImgShape | ImgSymbol): field is ImgSymbol {
  return (field as ImgSymbol).guid !== undefined
}