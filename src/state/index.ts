import {combineReducers} from "redux";

import {reducer as tileEditorReducer, State as TileEditorState} from './reducers/tileEditor/tileEditorReducer'
import {
  reducer as fieldPropertyReducer,
  State as TileEditorFieldShapesState
} from './reducers/tileEditor/fieldProperties/fieldPropertyReducer'
import {
  reducer as imgPropertyReducer,
  State as TileEditorImgShapesState
} from './reducers/tileEditor/imgProperties/imgPropertyReducer'

import {
  reducer as linePropertyReducer,
  State as TileEditorLineShapeState
} from './reducers/tileEditor/lineProperties/linePropertyReducer'

import {reducer as imgLibraryReducer, State as ImgLibraryState} from './reducers/imgLibrary/imgLibraryReducer'

import {
  reducer as worldSettingsReducer,
  State as WorldSettingsState
} from './reducers/world/worldSettings/worldSettingsReducer'

import {reducer as symbolsReducer, State as SymbolsState} from './reducers/tileEditor/symbols/symbolsReducer'

import {
  reducer as fieldSymbolReducer,
  State as FieldSymbolState
} from './reducers/tileEditor/symbols/fieldSymbols/fieldSymbolReducer'
import {
  reducer as imgSymbolReducer,
  State as ImgSymbolState
} from './reducers/tileEditor/symbols/imgSymbols/imgSymbolReducer'
import {
  reducer as lineSymbolReducer,
  State as LineSymbolState
} from './reducers/tileEditor/symbols/lineSymbols/lineSymbolReducer'

import {reducer as appReducer, State as AppState} from './reducers/appReducer'
import {reducer as worldReducer, State as WorldState} from './reducers/world/worldReducer'
import {reducer as tileLibraryReducer, State as TileLibraryState} from './reducers/world/tileLibrary/tileLibraryReducer'

import {
  reducer as variableIndicatorReducer,
  State as VariableIndicatorState
} from './reducers/variableIndicator/variableIndicatorReducer'
import {reducer as simulationReducer, State as SimulationState} from './reducers/simulation/simulationReducer'
import {reducer as i18nReducer, State as I18nState} from './reducers/i18n/i18nReducer'
import {
  reducer as tileSurrogateReducer,
  State as TileSurrogateState
} from './reducers/world/tileSurrogates/tileSurrogateReducer'
import {reducer as  shapesReducer, State as ShapesReducerState} from './reducers/tileEditor/shapesReducer/shapesReducer'
import {StateWithHistory} from "redux-undo";

import {
  reducer as tileEditorSelectionReducer,
  State as TileEditorSelectionState
} from './reducers/tileEditorSelection/tileEditorSelectionReducer'


export interface RootState {


  readonly i18nState: I18nState

  readonly appState: AppState

  readonly simulationState: SimulationState

  readonly worldState: WorldState
  readonly tileSurrogateState: StateWithHistory<TileSurrogateState>

  readonly variableIndicatorState: VariableIndicatorState

  readonly tileLibraryState: TileLibraryState

  readonly tileEditorState: TileEditorState
  readonly tileEditorSelectionState: TileEditorSelectionState


  readonly shapesReducerState: StateWithHistory<ShapesReducerState>
  readonly tileEditorFieldShapesState: StateWithHistory<TileEditorFieldShapesState>
  readonly tileEditorImgShapesState: StateWithHistory<TileEditorImgShapesState>
  readonly tileEditorLineShapeState: StateWithHistory<TileEditorLineShapeState>

  readonly symbolsState: SymbolsState
  readonly fieldSymbolState: StateWithHistory<FieldSymbolState>
  readonly imgSymbolState: StateWithHistory<ImgSymbolState>
  readonly lineSymbolState: StateWithHistory<LineSymbolState>

  readonly worldSettingsState: WorldSettingsState

  readonly imgLibraryState: ImgLibraryState
}

export default combineReducers<RootState>({

  i18nState: i18nReducer,

  appState: appReducer,

  simulationState: simulationReducer,

  worldState: worldReducer,

  tileSurrogateState: tileSurrogateReducer,

  variableIndicatorState: variableIndicatorReducer,

  tileLibraryState: tileLibraryReducer,

  tileEditorState: tileEditorReducer,
  tileEditorSelectionState: tileEditorSelectionReducer,

  shapesReducerState: shapesReducer,
  tileEditorFieldShapesState: fieldPropertyReducer,
  tileEditorImgShapesState: imgPropertyReducer,
  tileEditorLineShapeState: linePropertyReducer,

  symbolsState: symbolsReducer,
  fieldSymbolState: fieldSymbolReducer,
  imgSymbolState: imgSymbolReducer,
  lineSymbolState: lineSymbolReducer,

  worldSettingsState: worldSettingsReducer,

  imgLibraryState: imgLibraryReducer
})