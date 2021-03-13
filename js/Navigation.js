/*========================================================================
* FILE:    Navigation.js
* AUTHOR:  Jeffrey Mohler
* DATE:    Winter 2021
*
* DESCRIPTION: Front-end JavaScript code for the Scriptures, Mapped.
*              IS 542, Winter 2021, BYU.
*/
/*jslint
browser, long
*/
/*property
    anchor, animate, books, classKey, content, css, div, duration, element,
    forEach, freeze, fullName, getElementById, gridName, hash, href, id,
    innerHTML, isInteger, left, length, link, numChapters, onHashChanged,
    opacity, parentBookId, setUpMarkers, slice, split, volumeForId
*/


/*-------------------------------------------------------------------
    *                      IMPORTS
    */
import api from "./MapScripApi.js";
import {books} from "./MapScripApi.js";
import html from "./htmlHelper.js";
import injectBreadcrumbs from "./Breadcrumbs.js";
import MapHelper from "./MapHelper.js";
import navigateChapter from "./Chapter.js";
import {volumes} from "./MapScripApi.js";

/*-------------------------------------------------------------------
    *                      CONSTANTS
    */
const BOTTOM_PADDING = "<br/><br/>";
const CLASS_BOOKS = "books";
const CLASS_BUTTON = "btn";
const CLASS_CHAPTER = "chapter";
const CLASS_VOLUME = "volume";
const DIV_SCRIPTURES_NAVIGATOR = "scripnav";
const DIV_SCRIPTURES1 = "s1";
const DIV_SCRIPTURES2 = "s2";
const TAG_HEADER5 = "h5";



/*-------------------------------------------------------------------
    *                      PRIVATE VARIABLES
    */
let onScreenDiv = DIV_SCRIPTURES1;
let offScreenDiv = DIV_SCRIPTURES2;

/*-------------------------------------------------------------------
    *                      PRIVATE METHODS
    */

const animate = function (content, animation) {

    if (animation === "next") {
        $(`#${offScreenDiv}`).css({opacity: 1, left: "100%"});
        document.getElementById(offScreenDiv).innerHTML = content;
        $(`#${offScreenDiv}`).animate({left: "0%"}, {duration: 450});
        $(`#${onScreenDiv}`).animate({left: "-100%"}, {duration: 450});
    } else if (animation === "previous") {
        $(`#${offScreenDiv}`).css({opacity: 1, left: "-100%"});
        document.getElementById(offScreenDiv).innerHTML = content;
        $(`#${offScreenDiv}`).animate({left: "0%"}, {duration: 450});
        $(`#${onScreenDiv}`).animate({left: "100%"}, {duration: 450});
    } else {
        //crossfade
        $(`#${offScreenDiv}`).css({opacity: 0, left: "0%"});
        document.getElementById(offScreenDiv).innerHTML = content;
        $(`#${offScreenDiv}`).animate({opacity: 1}, {duration: 700});
        $(`#${onScreenDiv}`).animate({opacity: 0}, {duration: 700});
        $(`#${onScreenDiv}`).css({left: "-100%"});
    }

    let temp = offScreenDiv; offScreenDiv = onScreenDiv; onScreenDiv = temp;
};

const bookChapterValid = function (bookId, chapter) {
    let book = books[bookId];

    if (book === undefined || chapter < 0 || chapter > book.numChapters) {
        return false;
    }

    if (chapter === 0 && book.numChapters > 0) {
        return false;
    }

    return Number.isInteger(chapter);
};

const booksGrid = function (volume) {
    return html.div({
        classKey: CLASS_BOOKS,
        content: booksGridContent(volume)
    });
};

const booksGridContent = function (volume) {
    let gridContent = "";

    volume.books.forEach(function (book) {
        gridContent += html.link({
            classKey: CLASS_BUTTON,
            id: book.id,
            href: `#${volume.id}:${book.id}`,
            content: book.gridName
        });
    });

    return gridContent;
};

const chapterGrid = function (book) {
    return html.div({
        classKey: CLASS_VOLUME,
        content: html.element(TAG_HEADER5, book.fullName)
    }) + html.div({
        classKey: CLASS_BOOKS,
        content: chapterGridContent(book)
    });
};

const chapterGridContent = function (book) {
    let gridContent = "";
    let chapter = 1;

    while (chapter <= book.numChapters) {
        gridContent += html.link({
            classKey: `${CLASS_BUTTON} ${CLASS_CHAPTER}`,
            id: chapter,
            href: `#0:${book.id}:${chapter}`,
            content: chapter
        });

        chapter += 1;
    }

    return gridContent;
};

const navigateBook = function (bookId) {
    let book = books[bookId];

    if (book.numChapters <= 1) {
        navigateChapter(bookId, book.numChapters);
    } else {
        let content = html.div({
            id: DIV_SCRIPTURES_NAVIGATOR,
            content: chapterGrid(book)
        });

        animate(content);
        injectBreadcrumbs(api.volumeForId(book.parentBookId), book);
        MapHelper.setUpMarkers();
    }
};


const navigateHome = function (volumeId) {
    let content = html.div({
        id: DIV_SCRIPTURES_NAVIGATOR,
        content: volumesGridContent(volumeId)
    });

    animate(content);
    injectBreadcrumbs(api.volumeForId(volumeId));
    MapHelper.setUpMarkers();
};

const onHashChanged = function () {
    let ids = [];

    if (location.hash !== "" && location.hash.length > 1) {
        ids = location.hash.slice(1).split(":"); // .map(x => Number(x))
    }

    if (ids.length <= 0) {
        navigateHome();
    } else if (ids.length === 1) {
        let volumeId = Number(ids[0]);

        if (volumeId < volumes[0].id || volumeId > volumes.slice(-1)[0].id) {
            navigateHome();
        } else {
            navigateHome(volumeId);
        }
    } else { // ids.length >= 2
        let bookId = Number(ids[1]);

        if (books[bookId] === undefined) {
            navigateHome();
        } else {
            if (ids.length === 2) {
                navigateBook(bookId);
            } else {
                let chapter = Number(ids[2]);

                if (bookChapterValid(bookId, chapter)) {
                    navigateChapter(bookId, chapter);
                } else {
                    navigateHome();
                }
            }
        }
    }
};

const volumesGridContent = function (volumeId) {
    let gridContent = "";

    volumes.forEach(function (volume) {
        if (volumeId === undefined || volumeId === volume.id) {
            gridContent += html.div({
                classKey: CLASS_VOLUME,
                content: html.anchor(volume) + html.element(TAG_HEADER5, volume.fullName)
            });

            gridContent += booksGrid(volume);
        }
    });

    return gridContent + BOTTOM_PADDING;
};

/*-------------------------------------------------------------------
    *                      PUBLIC API
    */
const Navigation = {
    onHashChanged,
    animate
};

export {onScreenDiv};
export default Object.freeze(Navigation);