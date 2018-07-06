import {Rect} from "../../../types/drawing";
import {createAction, createReducer} from "../../../helpers/reduxActions";

export interface State {
  readonly rect: Rect | null
}

export const initial: State = {
  rect: null
}

export const set_editorSelection_rect = createAction('tileEditorSelectionReducer_SET_editorSelection_rect',
  (rect: Rect) => {
    return {
      rect
    }
  },
  (state: State, action) => {
    return {
      ...state,
      rect: action.rect
    }
  }
)


export const reducer = createReducer(
  initial,
  set_editorSelection_rect
)