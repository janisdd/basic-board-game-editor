# FAQ

## What is it?

A *basic* board game editor

You can design a board game visually and after than you could simulate the board game (requires coding)

>some notes are inside boxed (like this one) these are developer notes and are maybe only useful if you want to develop this editor further
>if you just want to use the editor then ignore them

## What games can be created with this *basic* editor?

Form the visual perspective almost all board games

*there is a lack of default shapes (and custom shapes) but this could be done via images*

actually any other svg editor is probably better

That being said you can easily print out your game in the browser and it's automatically split into smaller pieces (not part of many/any? svg editors)

And it's online ;)

## What games can be simulated?

the criteria for the simulations are

- one start field for all players
- one or more dedicated end field and/or a global game end condition
- one token per player
- no interaction with other player tokens
- no cards (ony a dice and tokens)
- no moving parts (? no modification of the board at runtime)


## It's so limited... why?

The visual part because of time (cost-benefit ratio)

The simulation part because of time too and i only needed these features for my board game (not all but many)

Also expressing the rules of simple games e.g. *Mensch ärgere Dich nicht* is pretty complex

some of them
- you need to make sure every player has its own starting point,
- if one token stops on another players token (could be more than one)
- if one token would be set on another token of you than this is an invalid turn (must be checked before the token is moved)
- you can only walk around the game field one time

All this would be possible but feeds hard to implement in the current editor & workflow.
It's also might not add many value for other games than *Mensch ärgere Dich nicht* when we extend
the language to support the rules for this specific game (you could exchange *Mensch ärgere Dich nicht* with any other game and argue with that)

## Alternatives

- http://www.nand.it/nandeck/ - card games (very cool!)
- https://www.gamestructor.com - for board games, cards
- https://boardgamegeek.com/thread/1876312/card-editor-free-open-source-gui-tool-creating-boa - for cards
- https://sourceforge.net/projects/bgmapeditor/ - for board games

## My board game (initial idea)

I originally created the editor for my own board game project which was a programming game

You would step through the game and execute programming commands.
There were global and player local variables and thus one player can affect other players e.g. by setting a global var and then an condition inside the if would force a player to take another path

Before this online editor I created an editor in c# but without the simulation part... we played the game once and it took 3 hours and we didn't even finished it D;

The simulation should help to estimate the game a time better this time ;)

# Notes

Sometimes I mention a compiler, which *compiles* the simulation language **bbgel** - *basic board game editor language*
Actually this is an **interpreter**
