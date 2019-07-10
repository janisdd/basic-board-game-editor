# Markdown overview

You can use the common markdown syntax (parser is markdown-it).

You can also use some special syntax:

```text
:::new-page
:::

or 

::: new-page
:::

```

to force a page break when printing

```text
:::box
Text with a border left
:::
```

:::box
Text with a border left
:::

you can also change the color and add text or icon to the left border

`box [info|warning|css-color] [text or font awesome unicode with \ prefix]`

`info` is the default color, no text/icon by default

```text
:::box info
Text with a border left
:::

:::box blue !
Text with a border left
:::


:::box #ff0000 \f1d8
Text with a border left
:::
```

:::box info
Text with a border left
:::

:::box blue !
Text with a border left
:::


:::box #ff0000 \f1d8
Text with a border left
:::



## Definition list

```text
Term 1
: explanation 1

Term 2
:  must be at least 1 space indented
```

Term 1
: explanation 1

Term 2
:  must be at least 1 space indented


## Font Awesome icons

You can use font awesome icons via unicode

```text
search the icon you want at https://fontawesome.com/icons?d=gallery&m=free
and copy the unicode

a \ followed by the unicode e.g. f1d8 (a plane)

for solid icons you need to make the font bold

**\ f1d8** a filled plane
```

\f1d8 a plane

for solid icons you need to make the font bold

**\f1d8** a filled plane

## Footnotes


```text
Here's a simple footnote,[^1] and here's a longer one.[^bignote]

[^1]: This is the first footnote.

[^bignote]: Here's one with multiple paragraphs and code.

    Indent paragraphs to include them in the footnote.
```

Here's a simple footnote,[^1] and here's a longer one.[^bignote]

[^1]: This is the first footnote (see bottom of the page).

[^bignote]: Here's one with multiple paragraphs. 

    Indent paragraphs to include them in the footnote.
    Note that the return makers are not rendered.

---

Everything below is taken from [https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet](https://github.com/adam-p/markdown-here/wiki/Markdown-Cheatsheet)

## Headers

```text
# H1
## H2
### H3
#### H4
##### H5
###### H6
```

# H1
## H2
### H3
#### H4
##### H5
###### H6

Normal text size

## Emphasis

```text
Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~
```


Emphasis, aka italics, with *asterisks* or _underscores_.

Strong emphasis, aka bold, with **asterisks** or __underscores__.

Combined emphasis with **asterisks and _underscores_**.

Strikethrough uses two tildes. ~~Scratch this.~~



## Lists

```text
1. First ordered list item
2. Another item
⋅⋅* Unordered sub-list. 
1. Actual numbers don't matter, just that it's a number
⋅⋅1. Ordered sub-list
4. And another item.

⋅⋅⋅You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).

⋅⋅⋅To have a line break without a paragraph, you will need to use two trailing spaces.⋅⋅
⋅⋅⋅Note that this line is separate, but within the same paragraph.⋅⋅
⋅⋅⋅(This is contrary to the typical GFM line break behaviour, where trailing spaces are not required.)

* Unordered list can use asterisks
- Or minuses
+ Or pluses
```


1. First ordered list item
2. Another item
⋅⋅* Unordered sub-list. 
1. Actual numbers don't matter, just that it's a number
⋅⋅1. Ordered sub-list
4. And another item.

⋅⋅⋅You can have properly indented paragraphs within list items. Notice the blank line above, and the leading spaces (at least one, but we'll use three here to also align the raw Markdown).

⋅⋅⋅To have a line break without a paragraph, you will need to use two trailing spaces.⋅⋅
⋅⋅⋅Note that this line is separate, but within the same paragraph.⋅⋅
⋅⋅⋅(This is contrary to the typical GFM line break behaviour, where trailing spaces are not required.)

* Unordered list can use asterisks
- Or minuses
+ Or pluses


## Images

```text
Here's our logo (hover to see the title text):

Inline-style: 
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")

Reference-style: 
![alt text][logo]

[logo]: https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 2"
```

Here's our logo (hover to see the title text):

Inline-style: 
![alt text](https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 1")

Reference-style: 
![alt text][logo]

[logo]: https://github.com/adam-p/markdown-here/raw/master/src/common/images/icon48.png "Logo Title Text 2"


## Code and Syntax Highlighting

```text
Inline `code` has `back-ticks around` it.
```

Inline `code` has normally `back-ticks around` it.

We changed the output to only have a border so it's more printer friendly.  


```text
A larger code block
can have multiple
lines

Syntax highlighting is not supported because probably not needed
```


## Tables

```text
Colons can be used to align columns.

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

There must be at least 3 dashes separating each header cell.
The outer pipes (|) are optional, and you don't need to make the 
raw Markdown line up prettily. You can also use inline Markdown.

Markdown | Less | Pretty
--- | --- | ---
*Still* | `renders` | **nicely**
1 | 2 | 3
```

Colons can be used to align columns.

| Tables        | Are           | Cool  |
| ------------- |:-------------:| -----:|
| col 3 is      | right-aligned | $1600 |
| col 2 is      | centered      |   $12 |
| zebra stripes | are neat      |    $1 |

There must be at least 3 dashes separating each header cell.
The outer pipes (|) are optional, and you don't need to make the 
raw Markdown line up prettily. You can also use inline Markdown.

Markdown | Less | Pretty
--- | --- | ---
*Still* | `renders` | **nicely**
1 | 2 | 3



## Blockquotes


````text
> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can *put* **Markdown** into a blockquote. 
````

> Blockquotes are very handy in email to emulate reply text.
> This line is part of the same quote.

Quote break.

> This is a very long line that will still be quoted properly when it wraps. Oh boy let's keep writing to make sure this is long enough to actually wrap for everyone. Oh, you can *put* **Markdown** into a blockquote. 


## Html

Is not supported


## Horizontal Rule


````text
Three or more...

---

Hyphens

***

Asterisks

___

Underscores
````

Three or more...

---

Hyphens

***

Asterisks

___

Underscores


---

Wee trimmed some parts and changed some descriptions (manily when the markdown renderer renders parts other than you might expect)

CC-BY [Original license](https://creativecommons.org/licenses/by/3.0/)
