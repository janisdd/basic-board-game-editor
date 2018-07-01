# Language

## basics

the language **bbgel** - *basic board game editor language* is...

`case sensitive` e.g. variable `x` is different from variable `X`

`space insensitive` (whitespace & tab) e.g. `bool b = true` equals `bool b=true`

*in some places spaces are needed e.g. between `bool` and `b`. this is also true for some multi word keywords*


different statements (e.g. variable definitions) are separated by `;` or a `new line`

*through all tests were made with the `new line` delimiter `;` should work too*

## comments

you can add `multi line comments` with

```bbgel
/* this is a
comment*/

/*
this
too
*/
```
there are no single line comments

## structure

there are different parts/blocks in the language

because we use the language for simulation we have a part for game setup, player setup and the actual simulation code

every part is optional, the order not

## game setup

the common structure for game setup is

```bbgel
game {
	maxDiceValue: [NUMBER]
}
```

```bbgel
game {
	endCondition: [bool expression]
}
```

```bbgel
game {
	maxDiceValue: [NUMBER]
	endCondition: [bool expression]
}
```

```bbgel
game {
	maxDiceValue: [NUMBER]
	[variables]
}
```

```bbgel
game {
	maxDiceValue: [NUMBER]
	endCondition: [bool expression]
	[variables]
}
```

```bbgel
game {
	[variables]
}
```

the `maxDiceValue` specifies the possible dice values, always the range `1` till `maxDiceValue`

*if not specified this is `6`*

`endCondition` can be used to check globally if one player has won e.g. if the game has no ending field or something

*not that only the current player can win through this condition*

`variables` can be specified and are accessible by every player

the `variables` syntax is the same as normal variables. make sure to use `;` or `new line` after one variable declaration

*see expressions & vars for definitions & syntax*

The variables defined in `game` are global and can be written and read by all players.


## players setup

the common structure for game setup is

```bbgel
[NUMBER] players {
}
```

```bbgel
[NUMBER] players {
	numTokens: [NUMBER]
}
```

```bbgel
[NUMBER] players {
	[variables]
}
```

```bbgel
[NUMBER] players {
	numTokens: [NUMBER]
	[variables]
}
```

the `NUMBER` before the `players` keyword is used to specify the number of players in the game

`numTokens` is used to set the number of tokens per player

*this is currently not usable because you cannot access/interact with the player tokens*

>this was originally planned for games with multiple tokens but almost all games with multiple tokens have every complex rules that feel a bit hard to cover with this language & editor`
>think of https://en.wikipedia.org/wiki/Mensch_ärgere_Dich_nicht
> you need to make sure every player has its own starting point,
>if one token stops on another players token
>if one token would be set on another token of you than this is an invalid turn (must be checked before the token is moved)
>you can only walk around the game field one time
>it would be possible but feeds hard to implement

the `variables` syntax is the same as normal variables. make sure to use `;` or `new line` after one variable declaration

*see expressions & vars for definitions & syntax*

These `variables` are local variables and are separate for every player.
These are the same as normal local variables but are defined before the game code.

>for testing there is a default player so we can write int x{1} = 0

>after the player setup is finished the cp, np, pp indices are set because now we know how many players we have

## game code

if you specified game or/and player setup indicate that you are done with that and write `---`

```
[game setup]
[player setup]
---
[game code]
```

if you specified neither you can just write your game code

*this is primary for writing tests and to be able to write code into field command inputs*

every unit in the game code is a `statement`

so the game code consists of multiple `statements` separated by a `new line` or `;`

a statement has no return value but changes the game state

a statement can be 

- expression
- variable declaration
- if
- if else

for expressions & variable declaration see *expressions & vars*

## if / if else

common syntax, only `if ... then` must be on the same line

```bbgel
if [bool expression] then
   [statements]
end

if [bool expression] then [statements]
end

if [bool expression] then [statements] end

if [bool expression] then
   [statements] end
```

this will execute the statements only if the `[bool expression]` evaluates to true

`if else` is also possible

```bbgel
if [bool expression] then
   [statements 1]
else
   [statements 2]
end
```

this will execute the statements 1 only if the `[bool expression]` evaluates to true
else it will execute the statements 2

e.g.

```bbgel
if x == 3 then
	x = 6
else
	x = 3
end
```

## control statements

there are also some control statements

these are used to control the game e.g. where is the next field

they are always executed!

- force
- control if
- control goto

`force` is used to indicate that all following statements need to be executed no matter if the player token just moves over the field
`force` must be the first statement in a field command text

`control goto [NUMBER]` will set the player token to the field with the given `NUMBER`


`control if` is like a normal if else but with the syntax

```bbgel
control if [bool expression] then
	goto [NUMBER]
else
	goto [NUMBER]
end
```

this will evaluate the if and then `control goto` the `NUMBER` in the evaluated branch


## built-in functions

### statements

the last possible statements are built-in functions that return no results

`log ([expression])` will log the expression result to the browser console

```bbgel
log(3)
```

`game_start()` indicate the starting field

```bbgel
game_start()
```

`game_start([bool expression])` indicate the starting field & some condition if the current player can start or not

*do not use this, but the parser will not throw an error*
>bool expression not implemented...

`game_end()` indicate the games end field
if the user steps on this field he has won
this always needs to be inside a force field (a field with a force statement)

if this is not the desired end behavior then have a look at *end behaviors*

```bbgel
force
game_end()
```

`move([int expression])` increments the left steps for the current players token

```bbgel
move(3)
```

*note the [int expression] can be negative so that the player might need to move back, if the `$leftSteps` value becomes negative*

*note and error is thrown if the player token would move before the game start field*

>the move back is done with an array saving all steps taken by the player token >so we can move back and don't need to deal with tile transitions

`rollback()` rolls all state changes back before the turn started and ends the players turn (used for different game end behaviors)

```bbgel
rollback()
```

`sleep([some player], [int expression])` suspends the `[some player]` for `[int expression]` many rounds

```bbgel
sleep(cp, 3)

sleep(np, 3+1)
```

*note a negative [int expression] will set the suspend counter to 0*
*note if this is on a force field (field with force statement) then the `$leftSteps` variable is set to 0, the suspend counter is set and the turn ends*

`goto [NUMBER]` sets the player token to the field with the given `NUMBER`

*this is not really a function*

```bbgel
goto 10
```

`begin_scope()` begins a new scope (for local variables)

**all statements in the same field will be always executed (field is implicit forced)!**

if you use this statement then all following variable declarations are put inside the current (opened) scope

>we use an array of definition tables [0] is the default scope, [1] would be the first opened scope
> when we lookup local variables we start at [last index] and go through all indices till [0] to check if we find a variable



```bbgel
begin_scope()
```

`end_scope()` end a prior opened scope all variables defined in the currently closed scope are not longer accessible

**all statements in the same field will be always executed (field is implicit forced)!**

```bbgel
end_scope()
```

`return [expr]` or `result [expr]` sets the player last return/result value this is useful if you want to mimic a function with a value value

```bbgel
return 3
/* or */
result 3
```


```bbgel
end_scope()
```

`limit_scope()` or `scope_limit()` or `scope_fence()` this will limit the interpreter to search for local variables only inside the scopes and nested scopes (outer scopes are excluded from the lookup)

**all statements in the same field will be always executed (field is implicit forced)!**

the position of this statement is important. if you open a scope then you can access outer scopes variables. immediately after `limit_scope()` is finished you cannot longer access outer scopes variables.

```bbgel
limit_scope()
/* or */
scope_limit()
/* or */
scope_fence()
```

a real function scope would be

```bbgel
/* function start */
begin_scope()

  limit_scope()
  /* function code */

end_scope()
/* function end */
```

>actually we have a flag inside every scope/def table that is set by this method

**note that this only limit the lookup for local variables, you can still access global & player variables**

### expressions

the last possible statements are built-in functions that return a result, thus can be used in other statements/expressions

`roll()` will return a number rolled with the dice

```bbgel
x = roll()
```

`roll([int expression])` will return a number rolled with the dice, the max value from the game setup is overwritten temporarily with the `[int expression]`

```bbgel
x = roll(10) /* x will be between 1 and 10 */
```

`choose_bool()` the current player can choose if this function returns `true` or `false`

```bbgel
b = choose_bool()
```

## built-in vars (cannot be set)

`$leftSteps` the left steps the player token can move
*can become negative when the move function is called with a negative value*

`$result` or `$result` will set when you call `return [expr] / result [expr]`
then `$result` will have the value of `[expr]`

## built-in constants

`cp` or `current_player` is the current player
`np` or `next_player` is the next player
`pp` or `previous_player` is the previous player

these can be used where a `[some player]` value is needed

these can also be used to reference the player values like `cp.x` when x is defined for players (in the player setup)