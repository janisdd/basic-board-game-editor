# Variables & Scopes

if you already know some oop language(s) code scopes can be interpret as the following java-ish code

```java
public class Main {

  public static [game/global vars]
  public [player vars]

  public static void main() {

    //game code

    [functions]

  }
}
```

every player is an instance of the `Main` class.
global variables are `state`, thus accessible by every user
local variables are normal local variables in the main method or in another function

functions can be mimicked by using `begin_scope()`, `end_scope()` statement and for the return value the `return [expr] / result [expr]` statement

however because `begin_scope()`, `end_scope()` only opens a new scope we can access variables inside the main method (from within the function).

in a real function we could not access the variables inside the main method
but we can argue that we use local functions inside the main method.

see below how to fix this

## global variables

the variables defined in the game setup are global and accessibly by every user

they can be used normally e.g.

```bbgel
game {
  int gold {15} = 0
}
---
/* in some field */
gold++
```

## player variables

the variables defined in the player setup are local and can to be referenced specially in case you want to refer to another player

all variables defined in the normal game code (after the setup code) are local (player) variables
e.g.

```bbgel

2 players {
  int gold {15} = 10
}
---
/* in some field */
cp.gold = cp.gold + 1

/* same as */
gold = gold + 1

cp.gold++


/* e.g. if the current player steals the next player 2 gold then you would write */
cp.gold = np.gold + 2
np.gold = np.gold - 2
```

## local variables

all variables not defined in `game setup` or `player setup` are local variables

every variable belongs to a scope (a scope is like a table where the variables & values are stored)

if you open a new scope via `begin_scope()` all after this statement defined variables will belong to the newly opened scope.

if you close the scope with `end_scope()` then you cannot longer access the variables in the closed scope (they are discarded).

if a variable is not found in the current scope we search in the outer scopes

the rules for global, player and local vars are as follows

- if the interpreter finds a variable `x` then
	- check if in the current scope is a variable `x` is defined (local var)
		- if true use it
		- if not search through outer scopes for the local variable `x`
			- if found use it
			- if not treat as `cp.x`, a player variable
				- if found use it
				- if no search for a global variable `x`
					- if found use it
					- else throw/raise an error

- if the interpreter finds a variable `cp.x` then
	- search for a player variable `x`
	- if found use it
	- else thorw/raise an error


this means that
local variables hide other local variables,
local variables hide player variable,
local variables hide global vars,

player variables hide global variables

e.g.

```bbgel
game {
  int gold {15} = 0
}
---
int gold {5} = 5

log(gold) /* will output 5 because first a local variable gold is searched and found */
```

## mimic functions

via scopes and `return [expr]` you can mimic functions

however one can still access variables inside the parent/outer scopes
this is not realistic because normally that's not possible.

if all functions were local functions inside the main method this behavior would be right, for mal functions outside of the main method not

```bbgel
/* function start */
begin_scope()

  limit_scope()
  /* function code */

end_scope()
/* function end */
```

if we don't declare any variables before `limit_scope()` then this is like a real function. After `limit_scope()` we cannot longer access the outer scopes variables (e.g. local variables inside main method).

if you do this for every function then we can interpret the code as 

```java
public class Main {

  public static [game/global vars]
  public [player vars]

  public static void main() {

    //game code

  }

  public  [functions]
}
```