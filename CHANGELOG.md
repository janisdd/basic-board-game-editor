# Changelog

## Pending

already changed but version has not changed

## 1.3.1

- fixed issue where importing multiple tiles will only import first tile
- added support for fontawesome icons
  - note that brand icons are not included because this violates copyright
- [lang] `return` is now implicitly forced 
- added global tiles (and tile render) settings

## 1.3.0

- performance fixes
- anchor points cannot longer be outside of the field bounds
  - thus we can check if a line gets connected/disconnected when we check field bounds...
- added lodash

## 1.3.0

- [break-soft] overhaul connected lines and fields
  - now works better reliable
- [added] field and img resize handles
- [package] updated easeljs to version 1.0.2
- sever editor bug fixes

## 1.2.3

???

## 1.1.1

- [improved] the world view will now resize to the window size
- [improved internal]the worker is now always named simulation.worker.js (no longer a hash) which is good for git
- [fixed] hopefully importing version 1.1.0 version world files (the tile settings were not migrated properly)
  - we now use the default values from the default tiles

## 1.1.0

- [fixed] issue where a field was not executed when we stop on a forced field which will force us to step to the next field
  which is also a forced field
  - because we only checked if we are still on a forced field (in this case we didn't execute the statements of the 2nd field
  - now we check if we moved to another field before
  - so: ignore the statements if we are on the same field (where we already executed the force statements) & we are still on a forced field
- [feature/break-soft] we export the world settings now with the world
  - on import we only use the known properties to overwrite the settings

- [feature/break-soft] we now export the tile settings with the tile
  - on import we only use the known properties to overwrite the settings

- fixed issue where many simulations did not respect the simulation times
  - this was because the worker is executed as a separate unit and all classes/code inside is a new instance
    so the app.js > SimulationTimes was !== worker > SimulationTimes and thus the times were not equal
- one can now do tile transitions without intermediate fields (useful e.g. if one player needs to go back to the start or something)
  - note that the max number of transitions without fields is limited (see constants (maxTileBorderPointToBorderPointTransitionWithoutFields)
    because we could get into an infinite loop
- improved automatic check if all variables are defined (we now go deeper into the tree)
- fixed issue where sleep method caused automatic simulation to hang/end
- fixed issue where one could not simulate a single tile with fake simulation start/end
- fixed issue where dragging a field (and some line was connected?) threw an error because we didn't check if we are
  dragging a line or a field properly
- changed back the hack with bitmap.draw = (own func) to draw the desired size of the bitmap
- added selection with area (like on a desktop)
  - added shift+drag to additive select with area
- we now add always borders to tiles when we split one large tile into pieces
- fixed issue with z index
  was always the amount of shapes on the tile but when some shape was deleted that the new z index was invalid
  - we now recreate all z indices of we add/delete/set shapes (not in the actions but we call renewAllZIndicesInTile before every call
- deleting a shape was not switching back the right tab menu
- deselect symbol/shape button was not switching back the right tab menu
- the edit symbol button was not working
- added print guides
- lines with linear connections had a gap when there was and arrow
- if we had too many symbols the flow as horizontal not vertical as expected
- modals are no placed not centered to resolve the flashing when some setting is changed
- renamed all TooTips to ToolTips
- importing a `.world` has produced some errors because there was no selected tile
- setting the next point to 0 for a border point was not displayed (because we used val || '' which is bad for falsy values ...)
- added to the select next field mode tooltip text that one can also select border points not only fields

## 1.0.3

- added about
- moved from bitbucket (private) to public github
