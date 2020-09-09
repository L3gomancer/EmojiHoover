# EmojiHoover

A Tampermonkey user script to copy emoji and their metadata from https://graphemica.com

## Explanation

In one tab I have a Google Sheet of my favorite emoji and their names, Unicode codes, HTML decimal codes to use in sites.
In another tab there's a resource website https://graphemica.com/☭ that I can manually copy the codes from, but each emoji entry is on its own page and I want to skip some of them, also it involves pasting and tab switching 4 times for each piece of data.
I wanted to automatically grab specific strings and store them in the clipboard for easier pasting.
User scripts to the rescue!
/ Yes, I realise if a data set is cumbersome to use then find a better data set. Or scrape the whole site and clean up the formatting afterwards... but I wanted to practice.

[Tampermonkey](https://www.tampermonkey.net/) is a user script manager that lives in an extension for Firefox. It has a dashboard to create your JavaScript scripts and toggle them on or off. It has a configuration syntax or "header" in JS comments, that's where you declare what sites the script runs on, what libraries to link in, metadata for organising, and special functions to do what JavaScript cannot e.g. accessing the system disk or clipboard. The [documentation](https://www.tampermonkey.net/documentation.php) explains what's what.
/ if you're wondering why the Tampermonkey functions begin with "GM*" and not "TM*" it is because it used to be called Greasemonkey before it went cross-platform.
I used my browser's dev tools to analyse the HTML source code for the website and pick targets to manipulate based on text content and ease of selecting.

## Usage

Copy the script into your own Tampermonkey script

## A Brief Tour Of The Script

At the top is the header, everything between `UserScript`
`@name` is the name of your script which shows up in your Tampermonkey dashboard and its online text editor.
`// @name EmojiHoover`
`@match` is the website the script will function on. It can use Bash-like wildcard characters to activate it on a many web pages under a domain, or just `*` for every site.
`// @match https://graphemica.com/*`
.`@grant` allows access to special Tampermonkey functions. Explanation below.
// @grant GM_setClipboard

I needed to identify and select each of the 4 target elements and then assign their text content to variables. JavaScript has the DOM property `.innerHTML` which grabs the text. Methods like `.querySelector()` can take CSS-like arguments to select elements.
For example, this selects an element by tag name:
`querySelector('div')`
This selects an id:
`querySelector('#button')`

For some reason all selected text strings had new lines at the start and end. The existing JS method `.trim()` did not seem remove them so I had to roll my own function `trimlines()` for all returned results. I used Regular Expressions since I wanted to alter the other results anyway. The JS method `.replace()` can replace part of a string, the argument before the comma is what to select, the argument after is what to replace it with, it can take regex between two slashes, the `g` means global which selects every occurrence per line. In JS regex, a letter "n" escaped with a backslash means a newline, so I replaced this with empty quotes (meaning a null value string).
x.replace(/\n/gm, '')

#### Emoji

`<h1 ...>🐀</h1>`
The emoji was in the only h1 element in the page. Easy to select
`let char = document.querySelector('h1').innerHTML`

#### Unicode code

`<td class="value">U+1F4A9</td>`
The unicode did not have a unique class so I selected all table cells. This returns an array and the desired value can be selected by index in the order it appears on the page. The unicode code is the second table cell so its index is 1
`let uni = document.querySelectorAll('td')[1].innerHTML`

#### Name

`<h2 class="char-title">Lion (U+1F981)</h2>`
The emoji name had a unique class `.char-title`
`let title = document.querySelector('.char-title').innerHTML`
But I wanted to remove the text in parenthesis so made the `trimtitle()`. This regex deletes either a newline, or a space followed immediately by an open bracket and then anything after that.
/ ...then a close bracket
`x.replace(/\n| \(.*/gm, '')`

#### HTML decimal code

Again, selected all cells and found the index
`let dec = document.querySelectorAll('td')[9].innerHTML`
This was the hardest text to clean up after selecting so it needed a function `trimdec()`.
/
Remove newlines
`/\n/`
Remove span from first angle bracket to end
`/<.*/`
For some reason the span's "c" (which doesnt show on page) is left. So also remove
`/c/`
Replace html chara code "&amp;" with "&"
`/amp;/`
Chain em all together with OR operators
`/\n|amp;|<.*|c/`
/
`x.replace(/\n|amp;|<.*|c/gm, '')`

The DOM method `trim()` I had to roll my own function

`GM_clipboard()` copies the string into the system clipboard
I wrapped the whole thing in an event listener `.addEventListener()` listening for key "ControlLeft" to trigger the script, because I wanted to skip some emoji. I used a control key instead of a letter key because the website always focuses the cursor on the search box on page load, and I wanted to avoid accidentally typing.

## Postmortem

The site focuses the cursor on the search box on load, so I should have added a control key to the keyboard shortcut. Or inserted a button into the page.
Some pages have extra entries so this throws off the absolute indexing of the table cells. I could have found a more specific selector.
For the HTML code I remove the span but it leaves the "c" for some reason. There must be a better way
I could have found a more specific selector for the HTML code plaintext avoiding the sibling span element.

## References

MDN keyboard event listener  
https://developer.mozilla.org/en-US/docs/Web/API/KeyboardEvent
Wes Bos' keycode tool  
https://keycode.info/
Other methods can click elements  
https://developer.mozilla.org/en-US/docs/Web/API/HTMLElement/click
