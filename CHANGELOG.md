# Changelog

## Pending

already changed but version has not changed

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
