# Data types, variables, expressions

## data types

there are only the following data types

- bool
- int

bool values can have only two possible values
- true
- false

for int you need to specify a value range

## bool variables

the common syntax to define bool variables is

```bbgel
bool [variable name] = [bool expression]

bool b1 = true
bool b2 = false

bool b3 = 3 == 3
```

as you can see the `bool expression` can be the two bool constants (true/false) or the result of some operation where the result is true/false

## expressions

an expression is a constant, one or multiple operations together
this important thing is that an expression always *returns* a result (an expression has a result)

a `bool expression` always returns a `bool`

here are the operators that return a bool value
- e1/e2 can be any expression (of any type),
- i1/i2 are expressions with int type,
- b1/b2 are expressions with bool type

the operators

- e1 `==` e2 returns true if e1 and e2 have equal values
- e1 `!=` e1 returns true if e1 and e2 have a different value
- e1 `<>` e1 alternative for `!=`
- i1 `<` i2 returns true if i1 is smaller than i2
- i1 `>` i2 returns true if i1 is larger than i2
- i1 `<=` i2 returns true if i1 is smaller than i2 or equals i2
- i1 `>=` i2 returns true if i1 is larger than i2 or equals i2
- b1 `and` b2 returns true if b1 is true and b2 is true
- b1 `&&` b2 alternative for `and`
- b1 `or` b2 returns true if b1 is true or b2 is true
- b1 `||` b2 alternative for `or`
- `not` b1 negates the value of b1
- `!` b1 alternative for `not`


here are the operators that return an int value
- e1/e2 can be any expression (of any type),
- i1/i2 are expressions with int type,
- b1/b2 are expressions with bool type

the operators

- i1 `+` i2
- i1 `-` i2
- i1 `*` i2
- i1 `/` i2 returns i1 divided by i2, all decimal values are removed
- i1 `%` i2 (modulo) returns the remainder when we try to fit i2 x times into i1
	e.g. 8 % 3 is 2 because 3 fits 2 times into 8 --> 3*2 = 6 the remainder is 8 - 6 = 2
	if this don't help you jump over to wikipedia https://en.wikipedia.org/wiki/Euclidean_division

And don't forget https://en.wikipedia.org/wiki/Order_of_operations#Mnemonics is applied ;)

If this is not what you want you can add braces around any expression
e.g.
`3 + 3 * 3 is 3 + 9 is 12`
vs.
`(3 + 3) * 3 is 6 * 3 is 18`

As mentioned above an expression can consists of many operators (sub expressions actually)
e.g.
`true and 3 + 1 == 4` is `true`


## operator precedence table

because it's really hard to tell which operator is applied first here is the operator precedence table (higher will be applied first)

operator | precedence
--- | ---
`++` (post), `--` (post), `++` (pre), `--` (pre) | 10
 `+` (unary), `-` (unary), `not` | 9
`*`, `/`, `%` | 8
`+`, `-` | 7
`<`, `>`, `<=`, `>=` | 6
`==`, `!=` | 5
`and` | 4
`or` | 3
`?:` (ternary expression) | 2
`=` | 1

ff you can't interpret this table, no fear, just use `()` to make sure the interpreter uses the right order

there are also some operators not mentioned yet. this is because they are special in some way

## post / pre increment / decrement

often you might just want to increment a variable like `x = x + 1`

a short version of this is `x++`
this is called post increment and also works with `--` (decrement)

`x--` equals `x = x - 1`

the pre increment is `++x` and pre decrement `--x`

if written on a separate line there is not difference between post and pre increment/decrement

but sometimes you might want to use the variable in an expression and then increment it after the expression is evaluated e.g.
`y = 10 + x++`
this way `y` will get the value `10 + x` and after that `x` is immediately incremented

in contrast `y = 10 + ++x` will set `y` to `10 + x` but x is incremented before y gets its value

it's worth mentioning that you cannot combine both e.g. `++x++`

the reason is that the common syntax is `[variable]++` and `++[variable]`

`x++` returns the value of `x+1` and is therefore a value not a variable

however you can write `cp.x++`

## unary +, -, not

they are pretty much self explaining
e.g.
`y = -x`
`x = -10`
`b = not true`

## ternary expression

a ternary expression returns one of two possible values
the common syntax is `[bool expression] ? [expression] : [expression]`

**note that the both expression must be of the same type!**
>this is actually checked by evaluating both branches and checking the results

e.g.
```bbgel
y = b ? 0 : 10
```

if b is true then 0 gets assigned to y
if b is false then 10 gets assigned to y

## int variables

int variables can store integer values and have a value range

the common syntax is `int [variable name] {NUMBER} = [int expression]`

`NUMBER` must be a positive integer number. it defines the maximal value the variable can store e.g.

```bbgel
int x {15} = 15
```

what if we exceed the maximal value?
like in real programming languages this different than real mathematics

after we exceed the maximal value we start over again at `-(NUMBER+1)`
e.g.
`int x {15} = 16` will set x to -16
`int x {15} = 17` will set x to -15
`int x {15} = 15+3` will set x to -14
`int x {15} = -16` will set x to -16
`int x {15} = -17` will set x to 15

so a variable with max value `{15}` can store values from `-16` till `15`
if we exceed one edge value then we get out on the other edge

**this is only applied when storing an integer into a variable**

`int x {15} = 3*6` will set x to -14
`int x {15} = 3*6-3` will set x to 15 because 18 is not immediately converted to -14 only the final result of 15 is stored into the integer x

>this is not optimal tested e.g. multiple exceedance

