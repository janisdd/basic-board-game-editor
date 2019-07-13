import {LangObj} from "./i18nRoot";
import {strict} from "assert";

export const lang_en: LangObj = {
  //--- about
  "About": "About",
  "Basic board game editor": "Basic board game editor",
  "This project was created with other open source projects. <br /> To see a full list go to the github page and find the file package.json file and look for the dependencies section.": "This project was created with other open source projects. <br /> To see a full list go to the github page and find the file package.json file and look for the dependencies section.",
  //--- variable indicator editor
  "Variable indicator editor": "Variable indicator editor",
  "Is bool variable": "Is bool variable",
  "Draw Qr code": "Draw Qr code",
  "Outer circle diameter in px": "Outer circle diameter in px",
  "Inner circle diameter in px": "Inner circle diameter in px",
  "Number of fields": "Number of fields",
  "Inner text": "Inner text",
  "Inner text font size in px": "Inner text font size in px",
  "Reset to defaults": "Reset to defaults",
  "If your variable has a range of e.g. 11 then you need to input 11 * 2 + 2 = 24 because we can have 1 to 11, -1 to -11, 0 and -12": "If your variable has a range of e.g. 11 then you need to input 11 * 2 + 2 = 24 because we can have 1 to 11, -1 to -11, 0 and -12",
  "Guide": "Guide",
  "Game Instructions Editor": "Game Instructions Editor",
  //--- world
  "World editor": "World editor",
  "Undo the last tile placement": "Undo the last tile placement",
  "Redo the last tile placement": "Redo the last tile placement",
  "Selected tile": "Selected tile",
  "Tile": "Tile",
  "Tile library": "Tile library",
  "Copy tile guid to clipboard" : "Copy tile guid to clipboard",
  "Start step by step simulation": "Start step by step simulation",
  "Pause the running simulation": "Pause the running simulation",
  "Do 1 simulation step": "Do 1 simulation step",
  "Stop simulation and discard all results": "Stop simulation and discard all results",
  "Start automatic simulation till end. This parses all fields before starting the simulation. We expect 1 start field and at least 1 end field": "Start automatic simulation till end. This parses all fields before starting the simulation. We expect 1 start field and at least 1 end field",
  "Import world": "Import world",
  "Export world. This will also export all images in the library": "Export world. This will also export all images in the library",
  "Print world & all found variables. For the variables the settings in the variable indicator tab are used": "Print world & all found variables. For the variables the settings in the variable indicator tab are used",
  "Convert world into one tile. This assumes all tiles have the same size": "Convert world into one tile. This assumes all tiles have the same size",
  "Successfully converted the world into tile. The tile was added to the tile library": "Successfully converted the world into tile. The tile was added to the tile library",
  "World settings": "World settings",
  "Convert world into one tile": "Convert world into one tile",
  "Set tile into the selected area": "Set tile into the selected area",
  "Edit tile in the selected area": "Edit tile in the selected area",
  "Remove tile from the selected area": "Remove tile from the selected area",
  "Zoom": "Zoom",
  "Global tiles settings": "Global tiles settings",
  //--- tile //--- til,
  "Add tile to world": "Add tile to world",
  "Edit tile. This will also change all instances of this the in the map. If you want to change only 1 instance then create a clone first and exchange the tile with the clone": "Edit tile. This will also change all instances of this the in the map. If you want to change only 1 instance then create a clone first and exchange the tile with the clone",
  "Export single tile. This will export the tile, only the symbols & only the used images": "Export single tile. This will export the tile, only the symbols & only the used images",
  "Export the current state of the tile. It will also export the used symbols & the used images": "Export the current state of the tile. It will also export the used symbols & the used images",
  "Export as svg (experimental). If you used icons you need to download the font awesome font file and place it in the same folder as the svg. For not filled (regular) icons you will need the file 'fa-regular-400.woff', for the filled (solid) icons you need the file 'fa-solid-900.woff'. Use the buttons in the world editor next to the svg download button.": "Export as svg (experimental). If you used icons you need to download the font awesome font file and place it in the same folder as the svg. For not filled (regular) icons you will need the file 'fa-regular-400.woff', for the filled (solid) icons you need the file 'fa-solid-900.woff'. Use the buttons in the world editor next to the svg download button.",
  "Click to download the font awesome font file 'fa-regular-400.woff'. If you used not filled (regular) icons you will need to place this font awesome font file in the same folder as the svg!": "Click to download the font awesome font file 'fa-regular-400.woff'. If you used not filled (regular) icons you will need to place this font awesome font file in the same folder as the svg!",
  "Click to download the font awesome font file 'fa-solid-900.woff'. If you used not filled (regular) icons you will need to place this font awesome font file in the same folder as the svg!": "Click to download the font awesome font file 'fa-solid-900.woff'. If you used not filled (regular) icons you will need to place this font awesome font file in the same folder as the svg!",
  "Export as png (experimental)": "Export as png (experimental)",
  "Export as png (experimental), the world tile size is used": "Export as png (experimental), the world tile size is used",
  "Print tile": "Print tile",
  "Clone tile": "Clone tile",
  "Delete tile": "Delete tile",
  "Are you sure you want to delete the tile and all instances in the world (if any)?": "Are you sure you want to delete the tile and all instances in the world (if any)?",
  "Delete tile. This will also delete all instances of this tile in the world": "Delete tile. This will also delete all instances of this tile in the world",
  "Drop tile files(s) or <br/> click to select tile files(s)": "Drop tile files(s) or <br/> click to select tile files(s)",
  "Name": "Name",
  "Guid": "Guid",
  //--- world //--- worl,
  "World setting": "World setting",
  "World width in tiles": "World width in tiles",
  "World height in tiles": "World height in tiles",
  "Tile width": "Tile width",
  "Tile height": "Tile height",
  "Print scale": "Print scale",
  "The images will be scaled by this factor. If it is less than 1 then the images will be larger, if is more than 1 the images will be smaller": "The images will be scaled by this factor. If it is less than 1 then the images will be larger, if is more than 1 the images will be smaller",
  "Additional border width": "Additional border width",
  "Every export or print image will include a black border with this width (might be better for cutting). Note that the real width will be only half that width because the other half is clipped because of the image dimension.": "Every export or print image will include a black border with this width (might be better for cutting). Note that the real width will be only half that width because the other half is clipped because of the image dimension.",
  "Game setup code": "Game setup code",
  "Click to validate the code": "Click to validate the code",
  //---- world settings simulation times
  "Time in seconds needed to...": "Time in seconds needed to...",
  "Roll the dice": "Roll the dice",
  "Choose a bool (choose_bool)": "Choose a bool (choose_bool)",
  "Execute a goto": "Execute a goto",
  "Set a variable to a new value": "Set a variable to a new value",
  "Set the next player (e.g. finish the round/give him the dice)": "Set the next player (e.g. finish the round/give him the dice)",
  "Rollback the current turn (rollback)": "Rollback the current turn (rollback)",
  "Define and set a new variable": "Define and set a new variable",
  "Get the left dice value (expr)": "Get the left dice value (expr)",
  "Create a constant (expr)": "Create a constant (expr)",
  "Get a variable value (expr)": "Get a variable value (expr)",
  "Increment/Decrement a variable (expr)": "Increment/Decrement a variable (expr)",
  "Calculate or (expr)": "Calculate or (expr)",
  "Calculate and (expr)": "Calculate and (expr)",
  "Calculate a comparison (==, !=) (expr)": "Calculate a comparison (==, !=) (expr)",
  "Calculate a relation (>,<, <=, >=) (expr)": "Calculate a relation (>,<, <=, >=) (expr)",
  "Calculate a sum (expr)": "Calculate a sum (expr)",
  "Calculate a term (*,/,%) (expr)": "Calculate a term (*,/,%) (expr)",
  "Calculate a factor (unary -, unary +, not) (expr)": "Calculate a factor (unary -, unary +, not) (expr)",
  //--- simulation //--- simulatio,
  "Simulation": "Simulation",
  "Random seed number": "Random seed number",
  "You can specify a random seed (a number). Every simulations initializes a random generator. If you specify the same number every simulation run will generate the same sequence of random numbers. For multiple simulations the random generator is only initialized at once. E.g. if you set the seed to 100 and then start the simulation your dice values will be e.g. 5, 3, 2, 6. If you start the simulation again and the seed is still set to 100 then the dice values will be the same (in the same order). If you don't specify a seed you will get different dice values every run.": "You can specify a random seed (a number). Every simulations initializes a random generator. If you specify the same number every simulation run will generate the same sequence of random numbers. For multiple simulations the random generator is only initialized at once. E.g. if you set the seed to 100 and then start the simulation your dice values will be e.g. 5, 3, 2, 6. If you start the simulation again and the seed is still set to 100 then the dice values will be the same (in the same order). If you don't specify a seed you will get different dice values every run.",
  "Many simulations": "Many simulations",
  "Max total steps per simulation": "Max total steps per simulation",
  "The max steps for the simulation (in total over all players). After we exceed this value an error is thrown. This is useful if the game has an infinite loop": "The max steps for the simulation (in total over all players). After we exceed this value an error is thrown. This is useful if the game has an infinite loop",
  "Run X simulations automatic": "Run X simulations automatic",
  "The simulation will be run X times in a separate thread and the results are added to the statistic": "The simulation will be run X times in a separate thread and the results are added to the statistic",
  "Update ui after X results": "Update ui after X results",
  "Updating the ui is costly (performance wise) so update the ui after X simulations have finished": "Updating the ui is costly (performance wise) so update the ui after X simulations have finished",
  "Max elapsed time": "Max elapsed time",
  "Min elapsed time": "Min elapsed time",
  "Average elapsed time": "Average elapsed time",
  "Number of error runs": "Number of error runs",
  "Last error": "Last error",
  "Single simulation": "Single simulation",
  "Speed in ms delay per step": "Speed in ms delay per step",
  "One step is taken then we pause for delay ms and then take the next step. This is only done for automatic single simulations": "One step is taken then we pause for delay ms and then take the next step. This is only done for automatic single simulations",
  "No single simulation is running": "No single simulation is running",
  "Rolled dice value": "Rolled dice value",
  "Left moves": "Left moves",
  "Player": "Player",
  "suspends for next": "suspends for next",
  "Round(s)": "Round(s)",
  "Token": "Token",
  "Player variables": "Player variables",
  "Player local variables in scope level": "Player local variables in scope level",
  "Scope is limited": "Scope is limited",
  "Global variables": "Global variables",
  "Var": "Var",
  "Value": "Value",
  "Type": "Type",
  "Range": "Range",
  //--- simulation tile editor //--- simulation tile edito,
  "Additional tile editor simulation start field or empty": "Additional tile editor simulation start field or empty",
  "When you edit a tile that is not a original start tile (has no game start command) and you don't want to add one (because you might forget to remove it later for testing (simulating) the tile), then use this option to define a temporary start field. This option will be ignored for all world simulations": "When you edit a tile that is not a original start tile (has no game start command) and you don't want to add one (because you might forget to remove it later for testing (simulating) the tile), then use this option to define a temporary start field. This option will be ignored for all world simulations",
  "Additional tile editor simulation end fields": "Additional tile editor simulation end fields",
  "You can add additional end fields. This option is ignored for all world simulations": "You can add additional end fields. This option is ignored for all world simulations",
  //--- tile //--- til,
  "Tile editor": "Tile editor",
  "Add tile to library": "Add tile to library",
  "Apply changes to tile": "Apply changes to tile",
  "Cancel": "Cancel",
  "Check all fields for correct command syntax": "Check all fields for correct command syntax",
  "Checks if all variables are defined. This also executes the game init/setup code (experimental/not enough tested)": "Checks if all variables are defined. This also executes the game init/setup code (experimental/not enough tested)",
  "Auto connect fields by command texts. Fields that are alreay connected through at least one line will be omitted": "Auto connect fields by command texts. Fields that are alreay connected through at least one line will be omitted",
  "Connect all lines to anchor points in snap range. Sometimes the line points will not snap to anchor points properly. This ensures that all lines are properly connected to anchor points if a line point is in snap range. If you have many lines or field this could take a while.": "Connect all lines to anchor points in snap range. Sometimes the line points will not snap to anchor points properly. This ensures that all lines are properly connected to anchor points if a line point is in snap range. If you have many lines or field this could take a while.",
  "Clear all commands from all field": "Clear all commands from all field",
  //--- shortcuts
  "Hint: Make sure you don't have any text field focused to use the shortcuts. Else the text field will receive the shortcuts and they won't work.": "Hint: Make sure you don't have any text field focused to use the shortcuts. Else the text field will receive the shortcuts and they won't work.",
  "Shortcut": "Shortcut",
  "Action": "Action",
  "Del": "Del",
  "Removes the selected shapes": "Removes the selected shapes",
  "Copy all selected shapes and increment the first found number in the field text (if enabled in tile editor settings & you selected fields) from left to right": "Copy all selected shapes and increment the first found number in the field text (if enabled in tile editor settings & you selected fields) from left to right",
  "Copy all selected shapes and increment the first found number in the field text (if enabled in tile editor settings & you selected fields) from right to left": "Copy all selected shapes and increment the first found number in the field text (if enabled in tile editor settings & you selected fields) from right to left",
  "Enables the next field mode. When you then click on a field (the next field) or a border point then a control goto statement is added to the command text and the next field is selected. To quit the mode click elsewhere on the canvas. Shortcut: <div class='keys'>ctrl+n</div>, <div class='keys'>cmd+n</div>. Press the shortcut again to disable the mode or <div class='keys'>esc</div>.": "Enables the next field mode. When you then click on a field (the next field) or a border point then a control goto statement is added to the command text and the next field is selected. To quit the mode click elsewhere on the canvas. Shortcut: <div class='keys'>ctrl+n</div>, <div class='keys'>cmd+n</div>. Press the shortcut again to disable the mode or <div class='keys'>esc</div>.",
  "Quits the selected next field mode if active. If not deselects all shapes & symbols": "Quits the selected next field mode if active. If not deselects all shapes & symbols",
  "Hold": "Hold",
  "Drag tile": "Drag tile",
  "Used to disable selection when you click on the tile. This is useful if the tile is covered with shapes but you only want to drag the tile": "Used to disable selection when you click on the tile. This is useful if the tile is covered with shapes but you only want to drag the tile",
  "Click on a shape": "Click on a shape",
  "Used to select multiple shapes. Note that you can only select the same kind of shapes (e.g. 2 fields, 3 lines, ...)": "Used to select multiple shapes. Note that you can only select the same kind of shapes (e.g. 2 fields, 3 lines, ...)",
  "Undo the last shape/symbol edit operation (experimental)": "Undo the last shape/symbol edit operation (experimental)",
  "Redo the last shape/symbol edit operation (experimental)": "Redo the last shape/symbol edit operation (experimental)",
  //--- tile //--- til,
  "Tile settings": "Tile settings",
  "Tile name": "Tile name",
  "Tile auto insert line direction": "Tile auto insert line direction",
  "When automatic inserting lines from the commands how the main flow is (where to connect the ingoing & outgoing lines to the shapes)": "When automatic inserting lines from the commands how the main flow is (where to connect the ingoing & outgoing lines to the shapes)",
  "Show grid": "Show grid",
  "Grid size in px": "Grid size in px",
  "Snap to Grid": "Snap to Grid",
  "Show field ids": "Show field ids",
  "Move control points when line is moved": "Move control points when line is moved",
  "Split tile into smaller pieces": "Split tile into smaller pieces",
  "If enabled and the tile size is larger than the print tile size then the tile will be split into smaller pieces when printing. When disabled the printing tab will display the tile as one image": "If enabled and the tile size is larger than the print tile size then the tile will be split into smaller pieces when printing. When disabled the printing tab will display the tile as one image",
  "Print tile width in px": "Print tile width in px",
  "The print tile size specifies the size of the images that will be printed. If the size is small than the actual tile size the tile is split into smaller pieces (if enabled)": "The print tile size specifies the size of the images that will be printed. If the size is small than the actual tile size the tile is split into smaller pieces (if enabled)",
  "Print tile height in px": "Print tile height in px",
  "Auto increment field text that contain numbers on duplication": "Auto increment field text that contain numbers on duplication",
  "Display print guides": "Display print guides",
  "Insert lines even if fields intersect": "Insert lines even if fields intersect",
  "top to bottom": "top to bottom",
  "bottom to top": "bottom to top",
  "left to right": "left to right",
  "right to left": "right to left",
  "Symbols": "Symbols",
  "Outline": "Outline",
  //--- symbol editors
  "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used": "Overwrite, if checked this symbol prop overwrites the shape prop, if not checked the shape props is used",
  "Overwritten by symbol, click to select symbol": "Overwritten by symbol, click to select symbol",
  "Adds a new shape with the props of the symbol": "Adds a new shape with the props of the symbol",
  "Adds a new shape that is linked to the symbol. When the symbol changes the shape will change too. Can be changed later": "Adds a new shape that is linked to the symbol. When the symbol changes the shape will change too. Can be changed later",
  "Removing a symbol will disconnect all shapes from that symbol. The shapes will stay but use its own properties again": "Removing a symbol will disconnect all shapes from that symbol. The shapes will stay but use its own properties again",
  "What is a symbol": "What is a symbol",
  "A symbol is like a plan for a shape, it defines properties. If you create an instance of this symbol then the created shape will keep a connection to the symbol and use the symbol properties instead of its own properties. Thus when you change the symbol all connected shapes will update too! Symbol instances are marked with a small indicator in the corner. To add a symbol select a shape and create a symbol from shape. Note that changes to symbols are global (applied to all tiles) and are applied immediately (without apply changes) and cannot be cancelled": "A symbol is like a plan for a shape, it defines properties. If you create an instance of this symbol then the created shape will keep a connection to the symbol and use the symbol properties instead of its own properties. Thus when you change the symbol all connected shapes will update too! Symbol instances are marked with a small indicator in the corner. To add a symbol select a shape and create a symbol from shape. Note that changes to symbols are global (applied to all tiles) and are applied immediately (without apply changes) and cannot be cancelled",
  //--- border points //--- border point,
  "Border points": "Border points",
  "Add border point": "Add border point",
  "Top border points": "Top border points",
  "Bottom border points": "Bottom border points",
  "Left border points": "Left border points",
  "Right border points": "Right border points",
  "Absolute pos in px": "Absolute pos in px",
  "Next (field) id or empty": "Next (field) id or empty",
  "The next field/border point id is used for simulation to know where we need to go next if we step on this border point": "The next field/border point id is used for simulation to know where we need to go next if we step on this border point",
  //--- //--,
  //--- properties //--- propertie,
  "Properties": "Properties",
  "Id": "Id",
  "Deselect shape": "Deselect shape",
  "Adds the current shape as a new symbol and links this shape to the newly added symbol (this shape is then an instance of the symbol because the properties of the symbols are used for visuals). A little icon is displayed on the shape to indicate a symbol instance": "Adds the current shape as a new symbol and links this shape to the newly added symbol (this shape is then an instance of the symbol because the properties of the symbols are used for visuals). A little icon is displayed on the shape to indicate a symbol instance",
  "Attaches the shape to a symbol. The shape will then use the symbol properties": "Attaches the shape to a symbol. The shape will then use the symbol properties",
  "Detaches the shape from the connected symbol. The shape will then use its own properties again": "Detaches the shape from the connected symbol. The shape will then use its own properties again",
  "Copy this shape and increment the first found number in the field text (if enabled in tile editor settings & you selected fields) for all selected shapes from left to right. Shortcut <div class='keys'>ctrl+d</div>, <div class='keys'>cmd+d</div>": "Copy this shape and increment the first found number in the field text (if enabled in tile editor settings & you selected fields) for all selected shapes from left to right. Shortcut <div class='keys'>ctrl+d</div>, <div class='keys'>cmd+d</div>",
  "Copy this shape and increment the first found number in the field text (if enabled in tile editor settings & you selected fields) for all selected shapes from right to left. Shortcut <div class='keys'>ctrl+shift+d</div>, <div class='keys'>cmd+shift+d</div>": "Copy this shape and increment the first found number in the field text (if enabled in tile editor settings & you selected fields) for all selected shapes from right to left. Shortcut <div class='keys'>ctrl+shift+d</div>, <div class='keys'>cmd+shift+d</div>",
  "Command text": "Command text",
  "Click to validate the code syntactically": "Click to validate the code syntactically",
  "Height": "Height",
  "Width": "Width",
  "Color": "Color",
  "To use transparent set the color to black (0, 0, 0) and then set alpha to 0": "To use transparent set the color to black (0, 0, 0) and then set alpha to 0",
  "Background color": "Background color",
  "Transparent color": "Transparent color",
  "Border color": "Border color",
  "Border size in px": "Border size in px",
  "Font name": "Font name",
  "Possible font names are ???": "Possible font names are ???",
  "Font size in px": "Font size in px",
  "Text decoration": "Text decoration",
  "Text": "Text",
  "You can use fontawesome icons here (use \\[unicode] e.g. \\f061) BUT no brand icons. To get solid/filled icons the text mus be set to bold, SOME icons are only working for bold text (all with fas- prefix)": "You can use fontawesome icons here (use \\[unicode] e.g. \\f061) BUT no brand icons. To get solid/filled icons the text mus be set to bold, SOME icons are only working for bold text (all with fas- prefix)",
  "Horizontal text align": "Horizontal text align",
  "Vertical text align": "Vertical text align",
  "padding (for text align)": "padding (for text align)",
  "Corner radius in px": "Corner radius in px",
  "Z-index": "Z-index",
  "Anchor point": "Anchor point",
  "Field Anchor point sync": "Field Anchor point sync",
  "Field anchor points are always synced with the connected symbol because of connected lines. When connecting to symbols, lines will only stay connected if the symbol anchor point is on the same position as the field anchor point": "Field anchor points are always synced with the connected symbol because of connected lines. When connecting to symbols, lines will only stay connected if the symbol anchor point is on the same position as the field anchor point",
  "Anchor points are used to snap lines to fields. When they are snapped then they are connected": "Anchor points are used to snap lines to fields. When they are snapped then they are connected",
  "Connected lines": "Connected lines",
  "The connected lines via anchor points": "The connected lines via anchor points",
  "The connected lines via this anchor points": "The connected lines via this anchor points",
  "Add anchor point": "Add anchor point",
  //--- properties
  "Thickness in px": "Thickness in px",
  "Gaps in px": "Gaps in px",
  "Start point": "Start point",
  "Is disabled for mouse selection": "Is disabled for mouse selection",
  "If checked you cannot longer select the shape with a mouse click. Use the tile outline to select the shape. This is useful if you want to set the shape as background. It might be good to set the z-index to the lowest possible": "If checked you cannot longer select the shape with a mouse click. Use the tile outline to select the shape. This is useful if you want to set the shape as background. It might be good to set the z-index to the lowest possible",
  "Start arrow": "Start arrow",
  "End arrow": "End arrow",
  "Arrow width": "Arrow width",
  "Arrow height": "Arrow height",
  "Point": "Point",
  "Curve mode": "Curve mode",
  "Smooth": "Smooth",
  "Free": "Free",
  "Linear": "Linear",
  "Duplicate this shape": "Duplicate this shape",
  "Control point": "Control point",
  "Add point to line": "Add point to line",
  //--- properties //--- propertie,
  "Rotation in degree": "Rotation in degree",
  "Skew x": "Skew x",
  "Skew y": "Skew y",
  //--- tile outline
  "Note that almost all operations are much slower when the tile outline is displayed. This is an open issue": "Note that almost all operations are much slower when the tile outline is displayed. This is an open issue",
  "Delete many shapes": "Delete many shapes",
  "Do you really want to delete all fields?": "Do you really want to delete all fields?",
  "Do you really want to delete all images?": "Do you really want to delete all images?",
  "Do you really want to delete all lines?": "Do you really want to delete all lines?",
  "Fields": "Fields",
  "Select shape in tile": "Select shape in tile",
  "Select all fields in tile": "Select all fields in tile",
  "Delete all fields in tile": "Delete all fields in tile",
  "Lines": "Lines",
  "Select all lines in tile": "Select all lines in tile",
  "Delete all lines in tile": "Delete all lines in tile",
  "Line, Points": "Line, Points",
  "Images": "Images",
  "Select all images in tile": "Select all images in tile",
  "Delete all images in tile": "Delete all images in tile",
  "Image": "Image",
  "Add field": "Add field",
  "Add line": "Add line",
  "Add image": "Add image",
  //--- image //--- imag,
  "Image library": "Image library",
  "Copy image guid to clipboard" : "Copy image guid to clipboard",
  "Drop image(s) or <br /> click to select image(s)": "Drop image(s) or <br /> click to select image(s)",
  "No/Generic image": "No/Generic image",
  "All image (shapes) that use this image will remain but display the generic image": "All image (shapes) that use this image will remain but display the generic image",
  //--- printing
  "Check all": "Check all",
  "Uncheck all": "Uncheck all",
  "Toggle all": "Toggle all",
  "Remove unchecked": "Remove unchecked",
  "You can now print the page. Note that this text & other elements will be removed when printing this page. To remove some tiles uncheck them and remove them with a click on the remove button": "You can now print the page. Note that this text & other elements will be removed when printing this page. To remove some tiles uncheck them and remove them with a click on the remove button",
  "Print game as one image": "Print game as one image",
  "If enable this will print all game tiles combined into one image. The variables will be put into separate images.": "If enable this will print all game tiles combined into one image. The variables will be put into separate images.",
  "Always auto insert arrow heads in tile editor": "Always auto insert arrow heads in tile editor",
  "When auto inserting lines always insert lines(true) or just when branching (control if)": "When auto inserting lines always insert lines(true) or just when branching (control if)",

  "Forced field style": "Forced field style",
  "A forced field is a field with the command text containing the force command. The forced style has the lowes priority from all field styles.": "A forced field is a field with the command text containing the force command. The forced style has the lowes priority from all field styles.",

  "Start field style": "Start field style",
  "A start field is a field with the command text containing the game start command": "A start field is a field with the command text containing the game start command",

  "End field style": "End field style",
  "An end field is a field with the command text containing the game end command": "An end field is a field with the command text containing the game end command",
  "Auto prefix text": "Auto prefix text",
  "Auto border size in px": "Auto border size in px",
  "Is font bold": "Is font bold",
  "Is font italic": "Is font italic",
  "Font color": "Font color",

  "Branch if field style": "Branch if field style",
  "A branch if field is a field with the command text containing the control if command": "A branch if field is a field with the command text containing the control if command",


  //--- symbol library
  "Symbol library": "Symbol library",
  "No symbols": "No symbols",

  //--- Game Instructions Editor
  "Editor": "Editor",
  "The editor uses markdown syntax. The editor content is part of the world and is also exported when you export the world. Click to get more information about markdown and the supported syntax.": "The editor uses markdown syntax. The editor content is part of the world and is also exported when you export the world. Click to get more information about markdown and the supported syntax.",
  "Creates the initial template for new game instructions with the current world settings (game init code)": "Creates the initial template for new game instructions with the current world settings (game init code)",
  "This will collect all used phrases from all fields in the world into a markdown list, so that you can explain each one manually": "This will collect all used phrases from all fields in the world into a markdown list, so that you can explain each one manually",
  "Preview": "Preview",
  "Copy modal": "Copy modal",
  "Copy text to clipboard and close modal": "Copy text to clipboard and close modal",
  "Close": "Close",
  "Insert image from library": "Insert image from library",
  "General game instructions template" : "General game instructions template",
  "Variable explanation list element template" : "Variable explanation list element template",
  "This is the list entry template used when replacing the variable list placeholders" : "This is the list entry template used when replacing the variable list placeholders",

  "Game instructions editor settings": "Game instructions editor settings",
  "Create field text explanation": "Create field text explanation",
  "List element template": "List element template",
  "Replace numbers with variables": "Replace numbers with variables",
  "Replace number with variable name" : "Replace number with variable name",
  "Replace variable prefix": "Replace variable prefix",
  "Replace variable postfix": "Replace variable postfix",
  "Normal list": "Normal list",
  "Definition list": "Definition list",
  "Disable automatic preview refresh" : "Disable automatic preview refresh",
  "Refresh preview" : "Refresh preview",

  "Markdown help" : "Markdown help",
  "Cheatsheet": "Cheatsheet",
}
