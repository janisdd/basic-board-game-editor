
/* lexical grammar */
/*
hints:
- we used error recovery (http://dinosaur.compilertools.net/bison/bison_9.html#SEC81)
  to recover from errors in some states (e.g. statements, class members, ...) see all
  rules with special token "error"
- use left recursive rules (according to http://dinosaur.compilertools.net/bison/bison_6.html#SEC42)
- if we need any help see https://github.com/antlr/grammars-v4/blob/master/csharp/CSharpParser.g4
  has a lot grammars for almost all languages ;)
*/

%lex

%x inSingleLineComment inMultiLineComment

%%

<<EOF>>               {return 'EOF';}
[\ \t]+         /* skip whitespace */

([\n]+|';') return 'CMD_SEPARATOR'


<INITIAL>\/\* { this.begin('inMultiLineComment'); }
<inMultiLineComment>\*\/ { this.begin('INITIAL'); }
<inMultiLineComment>\n {}
<inMultiLineComment>[^\n] {}

[\d]+ return 'NUMBER'

'end' return 'end'
'goto' return 'goto'

('cp'|'current_player') return 'cp'
('np'|'next_player') return 'np'
('pp'|'previous_player') return 'pp'


'true' return 'true'
'false' return 'false'

/* need to be before - and -- */
/* separates game def stats from stats */
'---' return '---'


/* built in var */
'$leftSteps' return '$leftSteps'
'$result'|'$return' return '$result'

/* end built in var */

/* built in funcs/statements */

'choose_bool' return 'choose_bool'
'sleep' return 'sleep'
'roll' return 'roll'
'log' return 'log'
'move' return 'move'
'rollback' return 'rollback'
'game_end' return 'game_end'
'game_start' return 'game_start'

'control' return 'control'
'force' return 'force'

'begin_scope' return 'begin_scope'
('limit_scope'|'scope_limit'|'scope_fence') return 'limit_scope'
('return'|'result') return 'return'
'end_scope' return 'end_scope'

/* end built in funcs */

'endCondition' return 'endCondition'

'.' return '.'
',' return ','
':' return ':'
'?' return '?'

'if' return 'if'
'then' return 'then'
'else' return 'else'
'end' return 'end'

'(' return '('
')' return ')'
'{' return '{'
'}' return '}'

'or'|'||' return 'or'
'and'|'&&' return 'and'

'++' return '++'
'--' return '--'

'+' return '+'
'-' return '-'
'*' return '*'
'/' return '/'
'%' return '%'

/* bool ops */
'!='|'<>' return '!='
'==' return '=='
'<=' return '<='
'>=' return '>='
'<' return '<'
'>' return '>'
'not'|'!' return 'not'

'=' return '='

/* types */
'int' return 'int'
'bool' return 'bool'


'numTokens' return 'numTokens'

'players' return 'players'
'game' return 'game'
'maxDiceValue' return 'maxDiceValue'

([a-zA-Z_][\w]*)  return 'IDENT'

/lex

%% /* language grammar */

start
  : game_def_statements_nor_none EOF { return $1;}
  ;

noNLS:;

NLS
  : CMD_SEPARATOR {}
  | NLS CMD_SEPARATOR {}
  ;

no_game_def_statements:;

game_def_statements_nor_none
  : no_game_def_statements { $$ = yy.ExecutionUnitBuilder.buildGameUnit([], []) }

  /* only game def stats */
  | NLS game_def_statements maybe_nls  { $$ = yy.ExecutionUnitBuilder.buildGameUnit($2, []) }
  | game_def_statements maybe_nls { $$ = yy.ExecutionUnitBuilder.buildGameUnit($1, []) }

  /* game def stats and normal stats */
  | NLS game_def_statements maybe_nls '---' pre_statements { $$ = yy.ExecutionUnitBuilder.buildGameUnit($2, $5) }
  | game_def_statements maybe_nls '---' pre_statements { $$ = yy.ExecutionUnitBuilder.buildGameUnit($1, $4) }

  /* only normal stats */
  | pre_statements { $$ = yy.ExecutionUnitBuilder.buildGameUnit([], $1) }
  ;

game_def_statements
  : game_def_statement { $$ = [$1]; }
  | game_def_statements NLS game_def_statement { $$ = $1.concat($3) }
  ;


/* real statements */
pre_statements
  : statements noNLS { $$ = $1}
  | statements NLS { $$ = $1}
  | NLS statements { $$ = $2}
  | NLS statements NLS { $$ = $2}
  ;

statements
  : statement { $$ = [$1]; }
  | statements NLS statement { $$ = $1.concat($3); }
  ;

/* returns 1 unit */
statement
  : expression
  | var_decl
  | clause /* if */

  /* control statements */
  | 'force' { $$ = yy.ExecutionUnitBuilder.forceUnit()}
  | 'control' control_clause { $$ = $2}
  | 'control' 'goto' NUMBER { $$ = yy.ExecutionUnitBuilder.controlGotoUnit(yy.convertNumber($3))}

  | 'begin_scope' '(' ')' { $$ = yy.ExecutionUnitBuilder.beginScope() }
  | 'return' expression   { $$ = yy.ExecutionUnitBuilder.setReturnResult($2) }
  | 'end_scope' '(' ')'   { $$ = yy.ExecutionUnitBuilder.endScope() }
  | 'limit_scope' '(' ')' { $$ = yy.ExecutionUnitBuilder.limitScope() }

  /* built in funcs */
  | logStmt { $$ = yy.ExecutionUnitBuilder.buildLogUnit($1) }
  | 'game_start' '(' ')' { $$ = yy.ExecutionUnitBuilder.buildStartUnit(null) }
  | 'game_start' '(' expression ')' { $$ = yy.ExecutionUnitBuilder.buildStartUnit($3) }
  | 'game_end' '(' ')' { $$ = yy.ExecutionUnitBuilder.buildEndUnit() }
  | 'move' '(' expression ')' { $$ = yy.ExecutionUnitBuilder.moveFunc($3) }
  | 'rollback' '(' ')' { $$ = yy.ExecutionUnitBuilder.rollbackFunc() }
  | 'sleep' '(' some_player ',' expression ')' { $$ = yy.ExecutionUnitBuilder.sleepFunc($3, $5) }
  | 'goto' NUMBER { $$ = yy.ExecutionUnitBuilder.gotoUnit(yy.convertNumber($2)) }
  ;


logStmt
  : 'log' '(' expression ')' { $$ = $3}
  ;

var_decl
                                                                                        /* 0 = int */
  : 'int' IDENT '{' NUMBER '}' '=' expression  { $$ = yy.ExecutionUnitBuilder.varDeclUnit($2, 0, yy.convertNumber($4), $7) }
                                                                                          /* 1 = bool */
  | 'bool' IDENT '=' expression  { $$ = yy.ExecutionUnitBuilder.varDeclUnit($2, 1, null, $4) }
  ;

/* expressions */

expression
  : assignment { $$ = yy.ExecutionUnitBuilder.expressionUnit($1) }
  | non_assignment_expression { $$ = yy.ExecutionUnitBuilder.expressionUnit($1) }
  ;

/* returns { ident: $1, player: null} */
qualified_name
  : IDENT /* x */ { $$ = { ident: $1, player: null} }
  | some_player '.' IDENT /* cp.x = y */  { $$ = { ident: $3, player: $1} }
  ;

assignment
  : qualified_name '=' expression {
      $$ = $1.player === null
        ? yy.ExecutionUnitBuilder.assignmentUnit($1.ident, $3)
        : $$ = yy.ExecutionUnitBuilder.playerVarAssignUnit($1.player, $1.ident, $3)
   }
  ;


/* like https://blogs.msdn.microsoft.com/lucian/2010/04/19/vb-and-c-grammar-for-vs2010/ c# */
non_assignment_expression
  : ternary_expression { $$ = $1}
  ;

ternary_expression
  : disjunction { $$ = yy.ExecutionUnitBuilder.ternaryExpressionUnit($1, null, null, null) }
  | disjunction '?' expression  ':' expression { $$ = yy.ExecutionUnitBuilder.ternaryExpressionUnit(null, $1, $3, $5) } */
  ;

/* or */
disjunction
  : conjunction  { $$ = yy.ExecutionUnitBuilder.disjunctionUnit(null, $1) }
  | disjunction 'or' conjunction  { $$ = yy.ExecutionUnitBuilder.disjunctionUnit($1, $3) }
  ;

/* and */
conjunction
  : comparison { $$ = yy.ExecutionUnitBuilder.conjunctionUnit(null, $1) }
  | conjunction 'and' comparison { $$ = yy.ExecutionUnitBuilder.conjunctionUnit($1, $3) }
  ;


/* == */
comparison
  : relation { $$ = yy.ExecutionUnitBuilder.comparisonUnit(null, $1, null) }
  | relation eqOp relation { $$ = yy.ExecutionUnitBuilder.comparisonUnit($1, $3, $2) }
  ;

eqOp
  : '==' { $$ = '=='}
  | '!=' { $$ = '!='}
  ;

relation
  : sum { $$ = yy.ExecutionUnitBuilder.relationUnit(null, $1, null) }
  | sum relOp sum { $$ = yy.ExecutionUnitBuilder.relationUnit($1, $3, $2) }
  ;

relOp
  : '<' { $$ = '<'}
  | '>' { $$ = '>'}
  | '<=' { $$ = '<='}
  | '>=' { $$ = '>='}
  ;

/* + comes after * */
sum
  : term { $$ = yy.ExecutionUnitBuilder.sumUnit(null, $1, null) }
  | sum plusOp term { $$ = yy.ExecutionUnitBuilder.sumUnit($1, $3, $2) }
  ;

plusOp
  : '+' { $$ = '+'}
  | '-' { $$ = '-'}
  ;

term
  : factor { $$ = yy.ExecutionUnitBuilder.termUnit(null, $1, null) }
  | term malOp factor { $$ = yy.ExecutionUnitBuilder.termUnit($1, $3, $2) }
  ;

malOp
  : '*' { $$ = '*'}
  | '/' { $$ = '/'}
  | '%' { $$ = '%'}
  ;

factor
  : primary { $$ = yy.ExecutionUnitBuilder.factorUnit(null, yy.ExecutionUnitBuilder.primaryUnit($1), null) }
  | unOp factor { $$ = yy.ExecutionUnitBuilder.factorUnit($2, null, $1)}
  ;

unOp
  : '+' { $$ = '+'}
  | '-' { $$ = '-'}
  | 'not' { $$ = 'not'}
  ;

/* bottom exprs */
primary
  : NUMBER /* constant */ { $$ = yy.ExecutionUnitBuilder.primaryConstantUnit_int(yy.convertNumber($1)) }
  | 'true' { $$ = yy.ExecutionUnitBuilder.primaryConstantUnit_bool(true) }
  | 'false' { $$ = yy.ExecutionUnitBuilder.primaryConstantUnit_bool(false) }
  | '$leftSteps' /* built in var, the left dice value / steps */ { $$ = yy.ExecutionUnitBuilder.primaryIdentLeftStepsUnit() }
  | '$result' /* built in var, the last returned value by return */ { $$ = yy.ExecutionUnitBuilder.primaryIdentLastResult() }

  | '(' expression ')' { $$ = $2}
  | inc_expr
  | inc_post_expr
  | dec_expr
  | dec_post_expr
  | 'roll' '(' ')' /* built in func */ { $$ = yy.ExecutionUnitBuilder.primaryRollDiceFunc(null) }
  | 'roll' '(' expression ')' /* built in func */ { $$ = yy.ExecutionUnitBuilder.primaryRollDiceFunc($3) }
  | 'choose_bool' '(' ')' /* built in func */ { $$ = yy.ExecutionUnitBuilder.primaryChooseBoolFunc() }

  /* var */ /*  cp.x */ /* qualified_name returns { ident: $1, player: null} */
  | qualified_name {
      $$ = $1.player === null
        ? yy.ExecutionUnitBuilder.primaryIdentUnit($1.ident)
        : yy.ExecutionUnitBuilder.primaryPlayerVarIdentUnit($1.player, $1.ident)

  }
  ;


/* qualified_name returns { ident: $1, player: null} */
inc_expr
  : qualified_name '++' { $$ = yy.ExecutionUnitBuilder.primaryIncrementUnit($1.ident, true, $1.player)}
  ;

inc_post_expr
  : '++' qualified_name { $$ = yy.ExecutionUnitBuilder.primaryIncrementUnit($2.ident, false, $2.player)}
  ;

dec_expr
  : qualified_name '--' { $$ = yy.ExecutionUnitBuilder.primaryDecrementUnit($1.ident, true, $1.player)}
  ;

dec_post_expr
  : '--' qualified_name { $$ = yy.ExecutionUnitBuilder.primaryDecrementUnit($2.ident, false, $2.player)}
  ;

/* the possible new lines are inside the pre_statements */
clause
  : 'if' expression maybe_nls 'then' pre_statements 'end' { $$ = yy.ExecutionUnitBuilder.ifUnit($2, $5) }
  | 'if' expression maybe_nls 'then' pre_statements 'else' pre_statements 'end' { $$ = yy.ExecutionUnitBuilder.ifElseUnit($2, $5, $7) }
  ;

control_clause
  : 'if' expression maybe_nls 'then' maybe_nls 'goto' NUMBER maybe_nls 'else' maybe_nls 'goto' NUMBER maybe_nls 'end' { $$ = yy.ExecutionUnitBuilder.controlIfElseUnit($2, yy.convertNumber($7), yy.convertNumber($12)) }
  ;


/* statements defining the game */
game_def_statement
  : game_vars
  | player_vars
  ;

/* could be better... maybe not all combinations??? */
game_vars
  : 'game' '{' maybe_nls
    'maxDiceValue' NUMBER
    maybe_nls '}' { $$ = yy.ExecutionUnitBuilder.gameVarsUnit(yy.convertNumber($5), null, []) }

  | 'game' '{' maybe_nls
        'endCondition' expression
         maybe_nls '}' { $$ = yy.ExecutionUnitBuilder.gameVarsUnit(null, $5, []) }

  | 'game' '{' maybe_nls
      'maxDiceValue' NUMBER NLS
      'endCondition' expression
       maybe_nls '}' { $$ = yy.ExecutionUnitBuilder.gameVarsUnit(yy.convertNumber($5), $8, []) }

  | 'game' '{' maybe_nls
       'maxDiceValue' NUMBER NLS
        var_decls
        maybe_nls '}' { $$ = yy.ExecutionUnitBuilder.gameVarsUnit(yy.convertNumber($5), null, $7) }

  | 'game' '{' maybe_nls
          var_decls
          maybe_nls '}' { $$ = yy.ExecutionUnitBuilder.gameVarsUnit(null, null, $4) }

  | 'game' '{' maybe_nls
       'maxDiceValue' NUMBER NLS
       'endCondition' expression NLS
        var_decls
        maybe_nls '}' { $$ = yy.ExecutionUnitBuilder.gameVarsUnit(yy.convertNumber($5), $8, $10) }
  ;


maybe_nls
  : noNLS
  | NLS
  ;

var_decls
  : var_decl { $$ = [$1]; }
  | var_decls NLS var_decl { $$ = $1.concat($3); }
  ;


/* could be better... maybe not all combinations??? */
player_vars

  : NUMBER 'players' '{' maybe_nls '}' { $$ = yy.ExecutionUnitBuilder.playersDefUnit(yy.convertNumber($1), 1, []) }

  | NUMBER 'players' '{' maybe_nls
      'numTokens' NUMBER
       maybe_nls '}' { $$ = yy.ExecutionUnitBuilder.playersDefUnit(yy.convertNumber($1), yy.convertNumber($6), []) }

  | NUMBER 'players' '{' maybe_nls
       var_decls
       maybe_nls '}' { $$ = yy.ExecutionUnitBuilder.playersDefUnit(yy.convertNumber($1), 1, $5) }

  | NUMBER 'players' '{' maybe_nls
     'numTokens' NUMBER NLS
      var_decls
      maybe_nls '}' { $$ = yy.ExecutionUnitBuilder.playersDefUnit(yy.convertNumber($1), yy.convertNumber($6), $8) }
  ;

some_player
  : 'cp' { $$ = 0; }
  | 'np' { $$ = 1; }
  | 'pp' { $$ = 2; }
  ;