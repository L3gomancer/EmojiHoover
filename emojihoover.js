// ==UserScript==
// @name         EmojiHoover
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  copy emoji and their codes
// @author       You
// @match        https://graphemica.com/*
// @grant        GM_setClipboard
// ==/UserScript==

document.addEventListener("keyup", (event) => {
  if (event.code == "ControlLeft") {
    let char = document.querySelector("h1").innerHTML;
    let title = document.querySelector(".char-title").innerHTML;
    let dec = document.querySelectorAll("td")[9].innerHTML;
    let uni = document.querySelectorAll("td")[1].innerHTML;

    function trimlines(x) {
      return x.replace(/\n/gm, "");
    }
    function trimtitle(x) {
      return x.replace(/\n| \(.*/gm, "");
    }
    function trimdec(x) {
      return x.replace(/\n|amp;|<.*|c/gm, "");
    }

    char = trimlines(char);
    dec = trimdec(dec);
    uni = trimlines(uni);
    title = trimtitle(title);

    let combo = char + "\t " + dec + "\t " + uni + "\t " + title;
    GM_setClipboard(combo);
  }
});
