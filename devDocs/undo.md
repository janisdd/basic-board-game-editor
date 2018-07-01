# undo & redo

for undo and redo we use `redux-undo`
which stores the previous states and switches back for undo


an usage of undo can be found in
`src/state/reducers/tileEditor/fieldProperties/fieldPropertyReducer.ts`

we wrap the reducer with `undoable` and thus we need to access the reducer state in the `RootState` with `rootState.[reducerState].present`

(the present part is the new piece)

the `src/state/reducers/tileEditor/shapesReducer` manages the tile editor undo

because we store the fields, lines, images in separate reducers we need to keep track of the undo/redo operations because every reducer has its own undo stack/array

every edit action on a field, line, img will also be *reduced* in the `src/state/reducers/tileEditor/shapesReducer/shapesReducer.ts` and we store the last edited state


if we add a new prop to the `fieldPropertyReducer` we might need to update the `groupBy` property in the `undoable` function

the `groupBy` will group the same `repeated` actions into one e.g. if we move a field +10 x then +5 x these actions will be grouped into one operation und undo will undo the +10 and +5 x at once

if the `groupBy` returns the same value then the edit operations are grouped if null then nothing is grouped

because of the separate reducers for fields, lines, images we introduced a `${field/ling/img}UndoVersionId` because when we set the field x to 10 then set an image x to 100 then the field x to 20 we would undo the field x move to 10 and 20 because from the `fieldReducer` undo perspective there were no other changes to the state (because the field reducer only sees changes applied to the field state).

as a workaround if we change a different type (before a field then an image) we increment the history id so that the edit operations are not grouped into one (because after the image edit the `fieldUndoVersionId` is incremented)