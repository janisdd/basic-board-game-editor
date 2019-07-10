# Readme for general game instructions


placeholders are enclosed inside @@@ e.g. `@@@TEST@@@`

for general game instruction template you can use the following placeholders

- globalVarsList - global vars list
- playerLocalVarsList - player local vars (from game init code)
- localVarsList - all local vars that can be captured when executing field cmds (so this excludes playerLocalVarsList)
- maxDiceValue - max dice value
- numLocalVars - number of local vars
- numPlayerLocalVars - number of player local vars
- totalLocalVars - total number of local vars (local + player local)
- numGlobalVars - number of global vars
- totalNumVars - total number of vars
- markdownGameInstructionsFieldTextExplanationHeader - section header for field text explanation 
- startFieldPrefix - 
- endFieldPrefix - 
- forcedFieldPrefix - 
- branchIfFieldPrefix - 


For var list entries template you can use the following placeholders

- ident - name of the variable
- defaultValue - default value for the variable