import {lang_en} from "./en";
import {Logger} from "../src/helpers/logger";

export interface LangObj {

  //--- about
  "About": string
  "Basic board game editor": string
  "This project was created with other open source projects. <br /> To see a full list go to the github page and find the file package.json file and look for the dependencies section.": string,
  //--- variable indicator editor
  "Variable indicator editor": string
  "Is bool variable": string
  "Draw Qr code": string
  "Outer circle diameter in px": string
  "Inner circle diameter in px": string
  "Number of fields": string
  "Inner text": string
  "Inner text font size in px": string
  "Reset to defaults": string
  "If your variable has a range of e.g. 11 then you need to input 11 * 2 + 2 = 24 because we can have 1 to 11, -1 to -11, 0 and -12": string
  //--- guide
  "Guide": string
  "Game Instructions Editor": string
  //--- world editor
  "World editor": string
  "Undo the last tile placement": string
  "Redo the last tile placement": string
  "Selected tile": string
  "Tile": string
  "Tile library": string
  "Start step by step simulation": string
  "Pause the running simulation": string
  "Do 1 simulation step": string
  "Stop simulation and discard all results": string
  "Start automatic simulation till end. This parses all fields before starting the simulation. We expect 1 start field and at least 1 end field": string
  "Import world": string
  "Export world. This will also export all images in the library": string
  "Print world & all found variables. For the variables the settings in the variable indicator tab are used": string
  "Convert world into one tile": string
  "Convert world into one tile. This assumes all tiles have the same size": string
  "Successfully converted the world into tile. The tile was added to the tile library": string
  "World settings": string
  "Set tile into the selected area": string
  "Edit tile in the selected area": string
  "Remove tile from the selected area": string
  "Zoom": string
  "Global tiles settings": string
  //--- tile library
  "Add tile to world": string
  "Edit tile. This will also change all instances of this the in the map. If you want to change only 1 instance then create a clone first and exchange the tile with the clone": string
  "Export single tile. This will export the tile, only the symbols & only the used images": string
  "Export the current state of the tile. It will also export the used symbols & the used images": string
  "Export as svg (experimental). If you used icons you need to download the font awesome font file and place it in the same folder as the svg. For not filled (regular) icons you will need the file 'fa-regular-400.woff', for the filled (solid) icons you need the file 'fa-solid-900.woff'. Use the buttons in the world editor next to the svg download button.": string
  "Click to download the font awesome font file 'fa-regular-400.woff'. If you used not filled (regular) icons you will need to place this font awesome font file in the same folder as the svg!": string
  "Click to download the font awesome font file 'fa-solid-900.woff'. If you used not filled (regular) icons you will need to place this font awesome font file in the same folder as the svg!" : string
  "Export as png (experimental)": string
  "Export as png (experimental), the world tile size is used": string
  "Print tile": string
  "Clone tile": string
  "Delete tile": string
  "Are you sure you want to delete the tile and all instances in the world (if any)?": string
  "Delete tile. This will also delete all instances of this tile in the world": string
  "Drop tile files(s) or <br/> click to select tile files(s)": string
  "Name": string
  "Guid": string
  //--- world settings
  "World setting": string
  "World width in tiles": string
  "World height in tiles": string
  "Tile width": string
  "Tile height": string
  "Print scale": string
  "The images will be scaled by this factor. If it is less than 1 then the images will be larger, if is more than 1 the images will be smaller": string
  "Additional border width": string
  "Every export or print image will include a black border with this width (might be better for cutting). Note that the real width will be only half that width because the other half is clipped because of the image dimension.": string
  "Game setup code": string
  "Click to validate the code": string
  //---- world settings simulation times
  "Time in seconds needed to...": string
  "Roll the dice": string
  "Choose a bool (choose_bool)": string
  "Execute a goto": string
  "Set a variable to a new value": string
  "Set the next player (e.g. finish the round/give him the dice)": string
  "Rollback the current turn (rollback)": string
  "Define and set a new variable": string
  "Get the left dice value (expr)": string
  "Create a constant (expr)": string
  "Get a variable value (expr)": string
  "Increment/Decrement a variable (expr)": string
  "Calculate or (expr)": string
  "Calculate and (expr)": string
  "Calculate a comparison (==, !=) (expr)": string
  "Calculate a relation (>,<, <=, >=) (expr)": string
  "Calculate a sum (expr)": string
  "Calculate a term (*,/,%) (expr)": string
  "Calculate a factor (unary -, unary +, not) (expr)": string
  //--- simulation tab
  "Simulation": string
  "Random seed number": string
  "You can specify a random seed (a number). Every simulations initializes a random generator. If you specify the same number every simulation run will generate the same sequence of random numbers. For multiple simulations the random generator is only initialized at once. E.g. if you set the seed to 100 and then start the simulation your dice values will be e.g. 5, 3, 2, 6. If you start the simulation again and the seed is still set to 100 then the dice values will be the same (in the same order). If you don't specify a seed you will get different dice values every run.": string
  "Many simulations": string
  "Max total steps per simulation": string
  "The max steps for the simulation (in total over all players). After we exceed this value an error is thrown. This is useful if the game has an infinite loop": string
  "Run X simulations automatic": string
  "The simulation will be run X times in a separate thread and the results are added to the statistic": string
  "Update ui after X results": string
  "Updating the ui is costly (performance wise) so update the ui after X simulations have finished": string
  "Max elapsed time": string
  "Min elapsed time": string
  "Average elapsed time": string
  "Number of error runs": string
  "Last error": string
  "Single simulation": string
  "Speed in ms delay per step": string
  "One step is taken then we pause for delay ms and then take the next step. This is only done for automatic single simulations": string
  "No single simulation is running": string
  "Rolled dice value": string
  "Left moves": string
  "Player": string
  "suspends for next": string
  "Round(s)": string
  "Token": string
  "Player variables": string
  "Player local variables in scope level": string
  "Scope is limited": string
  "Global variables": string
  "Var": string
  "Value": string
  "Type": string
  "Range": string
  //--- simulation tile editor additions
  "Additional tile editor simulation start field or empty": string
  "When you edit a tile that is not a original start tile (has no game start command) and you don't want to add one (because you might forget to remove it later for testing (simulating) the tile), then use this option to define a temporary start field. This option will be ignored for all world simulations" :string
  "Additional tile editor simulation end fields": string
  "You can add additional end fields. This option is ignored for all world simulations": string
  //--- tile editor
  "Tile editor": string
  "Add tile to library": string
  "Apply changes to tile": string
  "Cancel": string
  "Check all fields for correct command syntax" : string
  "Checks if all variables are defined. This also executes the game init/setup code (experimental/not enough tested)": string
  "Auto connect fields by command texts. Fields that are alreay connected through at least one line will be omitted": string
  "Connect all lines to anchor points in snap range. Sometimes the line points will not snap to anchor points properly. This ensures that all lines are properly connected to anchor points if a line point is in snap range. If you have many lines or field this could take a while.": string
  "Clear all commands from all field": string
  //--- shortcuts
  "Hint: Make sure you don't have any text field focused to use the shortcuts. Else the text field will receive the shortcuts and they won't work.": string
  "Shortcut": string
  "Action": string
  "Del": string //delete
  "Removes the selected shapes": string
  "Copy all selected shapes and increment the first found number in the field text (if enabled in tile editor settings & you selected fields) from left to right": string
  "Copy all selected shapes and increment the first found number in the field text (if enabled in tile editor settings & you selected fields) from right to left": string
  "Quits the selected next field mode if active. If not deselects all shapes & symbols": string
  "Hold": string
  "Drag tile": string
  "Used to disable selection when you click on the tile. This is useful if the tile is covered with shapes but you only want to drag the tile": string
  "Click on a shape": string
  "Used to select multiple shapes. Note that you can only select the same kind of shapes (e.g. 2 fields, 3 lines, ...)": string
  "Undo the last shape/symbol edit operation (experimental)": string
  "Redo the last shape/symbol edit operation (experimental)": string
  //--- tile settings
  "Tile settings": string
  "Tile name": string
  "Tile auto insert line direction": string
  "When automatic inserting lines from the commands how the main flow is (where to connect the ingoing & outgoing lines to the shapes)": string
  "Show grid": string
  "Grid size in px": string
  "Snap to Grid": string
  "Show field ids": string
  "Move control points when line is moved": string
  "Split tile into smaller pieces": string
  "If enabled and the tile size is larger than the print tile size then the tile will be split into smaller pieces when printing. When disabled the printing tab will display the tile as one image": string
  "Print tile width in px": string
  "The print tile size specifies the size of the images that will be printed. If the size is small than the actual tile size the tile is split into smaller pieces (if enabled)": string
  "Print tile height in px": string
  "Auto increment field text that contain numbers on duplication": string
  "Display print guides": string
  "Insert lines even if fields intersect": string
  "top to bottom": string
  "bottom to top": string
  "left to right": string
  "right to left": string
  "Symbols": string
  "Outline": string
  //--- symbol editors
  "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used": string
  "Overwritten by symbol, click to select symbol": string
  "Adds a new shape with the props of the symbol": string
  "Adds a new shape that is linked to the symbol. When the symbol changes the shape will change too. Can be changed later": string
  "Removing a symbol will disconnect all shapes from that symbol. The shapes will stay but use its own properties again": string
  "What is a symbol": string
  "A symbol is like a plan for a shape, it defines properties. If you create an instance of this symbol then the created shape will keep a connection to the symbol and use the symbol properties instead of its own properties. Thus when you change the symbol all connected shapes will update too! Symbol instances are marked with a small indicator in the corner. To add a symbol select a shape and create a symbol from shape. Note that changes to symbols are global (applied to all tiles) and are applied immediately (without apply changes) and cannot be cancelled": string
  //--- border points tab
  "Border points": string
  "Add border point": string
  "Top border points": string
  "Bottom border points": string
  "Left border points": string
  "Right border points": string
  "Absolute pos in px": string
  "Next (field) id or empty": string
  "The next field/border point id is used for simulation to know where we need to go next if we step on this border point": string
  //--- properties
  //--- properties field
  "Properties": string
  "Id": string
  "Deselect shape": string
  "Adds the current shape as a new symbol and links this shape to the newly added symbol (this shape is then an instance of the symbol because the properties of the symbols are used for visuals). A little icon is displayed on the shape to indicate a symbol instance": string
  "Attaches the shape to a symbol. The shape will then use the symbol properties": string
  "Detaches the shape from the connected symbol. The shape will then use its own properties again": string
  "Copy this shape and increment the first found number in the field text (if enabled in tile editor settings & you selected fields) for all selected shapes from left to right. Shortcut <div class='keys'>ctrl+d</div>, <div class='keys'>cmd+d</div>": string
  "Copy this shape and increment the first found number in the field text (if enabled in tile editor settings & you selected fields) for all selected shapes from right to left. Shortcut <div class='keys'>ctrl+shift+d</div>, <div class='keys'>cmd+shift+d</div>": string
  "Command text": string
  "Click to validate the code syntactically": string
  "Enables the next field mode. When you then click on a field (the next field) or a border point then a control goto statement is added to the command text and the next field is selected. To quit the mode click elsewhere on the canvas. Shortcut: <div class='keys'>ctrl+n</div>, <div class='keys'>cmd+n</div>. Press the shortcut again to disable the mode or <div class='keys'>esc</div>.": string
  "Height": string
  "Width": string
  "Color": string
  "To use transparent set the color to black (0, 0, 0) and then set alpha to 0": string
  "Background color": string
  "Transparent color": string
  "Border color": string
  "Border size in px": string
  "Font name": string
  "Possible font names are ???": string //TODO
  "Font size in px": string
  "Text decoration": string
  "Text": string
  "You can use fontawesome icons here (use \\[unicode] e.g. \\f061) BUT no brand icons. To get solid/filled icons the text mus be set to bold, SOME icons are only working for bold text (all with fas- prefix)": string
  "Horizontal text align": string
  "Vertical text align": string
  "padding (for text align)": string
  "Corner radius in px": string
  "Z-index": string
  "Anchor point": string
  "Field Anchor point sync": string
  "Field anchor points are always synced with the connected symbol because of connected lines. When connecting to symbols, lines will only stay connected if the symbol anchor point is on the same position as the field anchor point": string
  "Anchor points are used to snap lines to fields. When they are snapped then they are connected": string
  "Connected lines": string
  "The connected lines via anchor points": string
  "The connected lines via this anchor points": string
  "Add anchor point": string
  //--- properties line
  "Thickness in px": string
  "Gaps in px": string
  "Start point": string
  "Is disabled for mouse selection": string
  "If checked you cannot longer select the shape with a mouse click. Use the tile outline to select the shape. This is useful if you want to set the shape as background. It might be good to set the z-index to the lowest possible": string
  "Start arrow": string
  "End arrow": string
  "Arrow width": string
  "Arrow height": string
  "Point": string
  "Curve mode": string
  "Smooth": string
  "Free": string
  "Linear": string
  "Duplicate this shape": string
  "Control point": string
  "Add point to line": string
  //--- properties image
  "Rotation in degree": string
  "Skew x": string
  "Skew y": string
  //--- tile outline
  "Note that almost all operations are much slower when the tile outline is displayed. This is an open issue": string
  "Delete many shapes": string
  "Do you really want to delete all fields?": string
  "Do you really want to delete all images?": string
  "Do you really want to delete all lines?": string
  "Fields": string
  "Select shape in tile": string
  "Select all fields in tile": string
  "Delete all fields in tile": string
  "Lines": string
  "Select all lines in tile": string
  "Delete all lines in tile": string
  "Line, Points": string
  "Images": string
  "Select all images in tile": string
  "Delete all images in tile": string
  "Image": string
  "Add field": string
  "Add line": string
  "Add image": string
  //--- image library
  "Image library": string
  "Drop image(s) or <br /> click to select image(s)": string
  "No/Generic image": string
  "All image (shapes) that use this image will remain but display the generic image": string
  //--- printing
  "Check all": string
  "Uncheck all": string
  "Toggle all": string
  "Remove unchecked": string
  "You can now print the page. Note that this text & other elements will be removed when printing this page. To remove some tiles uncheck them and remove them with a click on the remove button": string
  "Print game as one image": string
  "If enable this will print all game tiles combined into one image. The variables will be put into separate images.": string
  "Always auto insert arrow heads in tile editor": string
  "When auto inserting lines always insert lines(true) or just when branching (control if)": string

  "Forced field style": string
  "A forced field is a field with the command text containing the force command. The forced style has the lowes priority from all field styles.": string

  "Start field style": string
  "A start field is a field with the command text containing the game start command": string

  "End field style": string
  "An end field is a field with the command text containing the game end command": string
  "Auto prefix text": string
  "Auto border size in px": string
  "Is font bold": string
  "Is font italic": string
  "Font color": string

  "Branch if field style": string
  "A branch if field is a field with the command text containing the control if command": string


  //--- symbol library
  "Symbol library": string
  "No symbols": string

  //--- Game Instructions Editor
  "Editor": string
  "The editor uses markdown syntax. The editor content is part of the world and is also exported when you export the world. Click to get more information about markdown and the supported syntax.": string
  "Creates the initial template for new game instructions with the current world settings (game init code)": string
  "This will collect all used phrases from all fields in the world into a markdown list, so that you can explain each one manually": string
  "Preview": string
  "Copy modal": string
  "Copy text to clipboard and close modal": string
  "Close": string

  "Game instructions editor settings": string
  "Create field text explanation": string
  "List type": string
  "Replace numbers with variables": string
  "Replace number with variable name": string
  "Replace variable prefix": string
  "Replace variable postfix": string
  "Normal list": string
  "Definition list": string

  "Markdown help": string
  "Cheatsheet": string

}


export enum KnownLangs {
  english = 'en'
}

interface LangMap {
  [lang_id: string]: LangObj
}

const i18n: LangMap = {
  'en': lang_en
}


export function getI18n(lang_id: KnownLangs, messageKey: keyof LangObj): string {
  const message = i18n[lang_id][messageKey]

  if (message.indexOf('<') !== -1 || message.indexOf('</') !== -1) {
      Logger.fatal(`The message '${message}' with the key: ${messageKey} for the lang: ${lang_id.toString()} contains html markup (< or </) but was not rendered with the proper function, use getRawI18n`)
  }

  return message
}

export function getRawI18n(lang_id: KnownLangs, messageKey: keyof LangObj): {__html: string} {
  return {
    __html: i18n[lang_id][messageKey]
  }
}
