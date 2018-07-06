# TODO

- reattach to symbol?

- add more dev docs

ISSUES

- could all be resolved by creating a new reducer & new actions that do multiple actions at once e.g.
  change field pos + update line pos in one action
  this could be undone as one action
  this would also remove the overloaded actions (update field pos)
  because the additional logic is handled in the new actions
  - connecting a line to a field via anchor points is bad undoable
    - when a line is connected to a field and we need to call adjustLinesFromAnchorPoints then undo gets bad...
      - we undo field then line then field then line ...
    - is works but is not really visible
    - when a line is connected to an anchor point and moved a bit (so that it is not detached) then this can be
      undone but is not visible for the user

  - when a line is connected to a symbol field and we change the symbol width/height/rotation
    - the line gets disconnected

  - when we change field symbol update connected lines pos

- when a line is connected (through an anchor point) to a field symbol instance and we change the width/height of the symbol
  - then the line is still connected to the field but is not moved!

- printing vars ... will all vars be found?
  - add tests to check this, they are not part of the simulation so create a new dir
- check if all vars are defined... will all vars be found?
  - add tests to check this, they are not part of the simulation so create a new dir

- when the tile outline is displayed the drag operations (fields/lines/imgs) are slow
  - this is because the lists & items are always re-rendered?

- error messages are not i18n ready



QUESTIONS
- move showGrid
       gridSizeInPx
       to world settings??
- hide cp point if multiple lines selected ??
- if we delete a symbol ... delete all instances?
- select multiple e.g. field height: only fixed val for all or delta?

- maybe use tabs.renderActiveOnly for property editors?
  - this way we could preserve the scroll position

IDEAS
- allow computed field texts
  - e.g. field {{x++}}
  - through the goto connections we can calculate the x...
  - tile ui vars e.g. x = 10 (to avoid duplicates) [not part of the game itself only for design/ui]
  - world ui vars e.g. x = 100 (to avoid duplicates) [not part of the game itself only for design/ui]
- random generate worlds with estimated runtime
- - simulation times
    - min & max values then use math.random(min, max)...

harder
- i18n for error messages
- add some missing ask dialogs

- add drag handels (width/height + rotation) for img + field
  - propose 1: html el overlay
    - this is bad because if we translate/scale the stage (or rotate the field)... everything must be done manually
    + the drag handles are always top most elements & easy cursor change

  - propose 2: as canvas graphic
    + easy to draw we get rotate ... for free (?)
    - drag handles are not top most (e.g. another el can hide the handles)
      - to solve this we might add the drag handles separately to the stage (maximal z index)
      - then we cannot add the handles to the same container as the field --> no more rotation for free
      - also if we add the drag handles to the same container we don't get the mouse handlers properly
        because the container itself has already mouse up, down attached

- built in  ladder is broken in production mode
- add simple markdown editor for game rules??
  - allow images?
  - gfm (git markdown)

- adding an img should use correct aspect ratio
  - max 100 height? then match width?
    - what if width is too big then?

- shift + drag to select multiple... maybe only when we support selecting different shapes together?

- sometimes the img symbol img won't show... because img storage is not loaded yet??
- http://www.unfocus.com/2014/03/03/hidpiretina-for-createjs-flash-pro-html5-canvas/

maybe
- select with area performance is bad if we select many shapes) because we calculate array (selected shapes) completely new on every mousemove
- move tile settings to own reducer... (from tile editor reducer)
- add an icon
- how do we know the id of the border points??
  - currently we can only use the select next field mode to get the border point
- add some tile settings to the tile itself?
  - e.g. tile auto insert line direction should be saved on every tile?
- create a marketplace for tiles/worlds?
- enable ts lint?
- printing tab is constantly loading ... but works??
- dynamic size world editor (use blank space)
- inspect bundle size...
  - exclude all languages from hljs?

- for running x simulations we use only 1 seed
  - maybe increase the random seed by +1 for every run so the user can actually reproduce all results?
  - now the user can only reproduce the first run...
- more img options (stretch, crop)
  - original aspect ratio
    - lock width/height
- world force tile width & height .... e.g. filter tile library by the forced size or mark the tiles red in the world view (when different size than forced)?
- wie excel formel view (für code)
- show programmatic order (lines)
- error (logger) messages are EN no i18n
-  error when displaying props editor:
      Failed prop type: Invalid prop `children` supplied to `Form`, expected a ReactNode.
      in Form (created by fieldPropertyEditor)
- use only 1 component for symbol menus?? generic one
- when printing allow x px overlap (because inaccurate cutting??)
- draw print lines on tile so we know where we cut
- maybe add all images directly as symbols??
- make world settings accessible to user
- match reducer action type names reducer name
- draw grid behind all shapes
- sort tile outline by ... zindex?
- moving fields is slow when there are line(s) connected to this field
- disconnect/reconnect shapes from symbols...
- warning if some shape is outside of tile
- some shape reducers have set_array and add + remove actions ... only use set array??
- add a new line point not at x+50,y+50 of the last point??


DOCS
- publish to github pages `git subtree push --prefix dist origin gh-pages`
  - from http://stephenplusplus.github.io/yeoman.io/deployment.html
- img transparent pixels are now clickable because a bug with svg width="100%" height="100%" viewBox="0 0 41 103"
  - the easeljs hittest will fail for such svgs so we used an extra hitTest object (rectangle)
  --> as a downside we no longer respect transparent pixels on clicks for imgs

- adding preset imgs...
  - src/externalStorage/imgStorage.ts add import + array entry
  - img guid must be set manually e.g. unix md5 function
- img base64:
  - for built in images this is the url (we can use this as img src)
  - for user imported imgs this is the base64 value
- bbgel ace mode is located in libs/ace-editor/bbgel-mode.js
- bbgel highlight.js definition is inside src/components/guide/guide.tsx
- undo is done via redux undo
  - this is bad if we have a lot of shapes because it keeps the old states for undo so we end up with a lot of copies of the state...
  - also there is a little issue left when we connect a line to a field
  - it's also not that good the we sometimes not see what was undone...
- esc to disable select next field or again press ctrl+n /super+n
- tests are only available for the lang compiler/interpreter and are written in jest (see simulation/__tests__)
  - execute all with npm run test
- printing grid is hard coded disabled see usage of public print PrintHelper usage for locations
- fir single tile simulation & world simulation the same state is used (this is the reason we disable the tabs)
- game end is checked outside of the game state (the game only sets the winners)
- symbol line ids (points ...) are grabbed from the normal get id func (getNextShapeId)
  - this is ok even if we collide because when we edit a line we search in the line state only
    not in the symbol line storage
- when changing single simulation (auto simulation) which uses Simulator.runSimulationTillEnd
  - then you need to change single stepping to! should be the same workflow

- max simulation run in a web worker at helpers/workers
- single simulation runs in ui thread with promises...
- times for simulation elapsed time must be set in AbstractMachine timeInS_ funcs
- for img guids we use the bas64 hash to identify equal images
  - bad for large images! maybe hint? or chunk read like https://www.npmjs.com/package/spark-md5 ?
- symbols are global because the renderer uses automatically the symbol if any for all tiles (-> world)
  - the only exception where we need to change something are the field anchor points because
    when we change a field symbol width/height we need to update ALL connected lines in ALL tiles!
    - THIS IS A TODO!
- auto increment increments the max found number+1 for every duplicated field
  - only replaced the first occurrence of the first number
- underline not yet because not that easy e.g. multi line & not built in
- better dpi printing set printHelper scaleFactor to 6?
- ctrl+d / super+d to duplicate selected shapes
  - + shift to invert auto increment order (don't work on macos??)
- alt + click + drag to always drag the stage (not select any shape)
  - when the whole tile is covered it's hard to drag the stage...
- del/backspace to delete all selected shapes
- select with multiple should be: [shift + click to select multiple!]
  - selecting one when mouse down --> able to mouse down, drag
  - when selecting multile (with shift) -> mouse up
  - when selecting multiple (shift) --> mouse up
  - when selecting multiple (shift), selecting already selected --> unselect on mouse up

- why only ref from tile lib not create new instance?
  - easier because we only have references to the original tile stored --> auto update on tile change
  - we can have multiple instances by copying the tile in the lib
- zoom to mouse works but why *newScale? -(oldPoint canvas local.x - zoomed point canvas local.x)*newScale
- offset is not the real offset ... it's user offset + scale correction
- field border points get normal field ids (to make them a jump target)
- img lib allows multiple file drops and filters imgs
- zindex is over all shapes in a tile (for the editor)
- zindex 0 is bottom MAX is top
- id is now unique for all shapes (no control points)
- field seq is unique for a tile, only field has seq id because it has cmd text
- symbols are just shapes with basically no effect
  - when a shape is rendered the renderer checks if there is a connected symbol
    and uses the props of the symbol that's it
- middle mosue button on canvas --> zoom to normal
- mouse wheel on canvas -> zoom
- zoom is mouse position agnostic

----

https://boardgamegeek.com/thread/299033/inkscape-extensions-boardgame-development
http://battlegroundsgames.com/links/#anchor7