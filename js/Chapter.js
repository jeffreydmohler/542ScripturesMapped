/*========================================================================
* FILE:    Chapter.js
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
    classKey, content, freeze, getElementById, hash, href, id, innerHTML, link,
    numChapters, parentBookId, requestChapter, setUpMarkers, slice, split,
    tocName, volumeForId
*/


/*-------------------------------------------------------------------
    *                      IMPORTS
    */
import html from "./htmlHelper.js";
import MapHelper from "./MapHelper.js";
import injectBreadcrumbs from "./Breadcrumbs.js";
import api from "./MapScripApi.js";
import {books} from "./MapScripApi.js";

/*-------------------------------------------------------------------
    *                      CONSTANTS
    */

const CLASS_BOOK_BUTTON = "bookbutton";
const CLASS_BUTTON = "btn";
const CLASS_NEXT = "nextchapter";
const CLASS_PREVIOUS = "prevchapter";
const DIV_SCRIPTURES = "scriptures";

/*-------------------------------------------------------------------
    *                      PRIVATE VARIABLES
    */


/*-------------------------------------------------------------------
    *                      PRIVATE METHODS
    */
const getScripturesCallback = function (chapterHtml) {
    let ids = location.hash.slice(1).split(":");
    let nextChapterButton = "";
    let prevChapterButton = "";
    let book = books[ids[1]];

    let nextChapterArray = nextChapter(Number(ids[1]), Number(ids[2]));
    nextChapterButton = html.link({
        classKey: `${CLASS_BUTTON} ${CLASS_NEXT}`,
        href: (
            (nextChapterArray)
            ? `#0:${nextChapterArray[0]}:${nextChapterArray[1]}`
            : "#"
        ),
        content: (
            (nextChapterArray)
            ? nextChapterArray[2]
            : ""
        )
    });

    let prevChapterArray = previousChapter(Number(ids[1]), Number(ids[2]));
    prevChapterButton = html.link({
        classKey: `${CLASS_BUTTON} ${CLASS_PREVIOUS}`,
        href: (
            (prevChapterArray)
            ? `#0:${prevChapterArray[0]}:${prevChapterArray[1]}`
            : "#"
        ),
        content: (
            (prevChapterArray)
            ? prevChapterArray[2]
            : ""
        )
    });


    let bookButton = html.link({
        classKey: `${CLASS_BUTTON} ${CLASS_BOOK_BUTTON}`,
        href: `#0:${ids[1]}`,
        content: book.tocName
    });

    document.getElementById(DIV_SCRIPTURES).innerHTML = `${prevChapterButton}${bookButton}${nextChapterButton}<div style="clear: both;"></div>${chapterHtml}`;
    injectBreadcrumbs(api.volumeForId(book.parentBookId), book, Number(ids[2]));
    MapHelper.setUpMarkers();
};

const getScripturesFailure = function () {
    document.getElementById(DIV_SCRIPTURES).innerHTML = "Unable to receive chapter contents.";
    injectBreadcrumbs();
};

const navigateChapter = function (bookId, chapter) {
    api.requestChapter(bookId, chapter, getScripturesCallback, getScripturesFailure, true);
};

const nextChapter = function (bookId, chapter) {
    let book = books[bookId];

    if (book !== undefined) {
        if (chapter < book.numChapters) {
            return [
                bookId,
                chapter + 1,
                titleForBookChapter(book, chapter + 1)
            ];
        }
    }

    let nextBook = books[bookId + 1];

    if (nextBook !== undefined) {
        let nextChapterValue = 0;

        if (nextBook.numChapters > 0) {
            nextChapterValue = 1;
        }

        return [
            nextBook.id,
            nextChapterValue,
            titleForBookChapter(nextBook, nextChapterValue)
        ];
    }
};

const previousChapter = function (bookId, chapter) {
    let book = books[bookId];

    if (book !== undefined) {
        if (chapter > 1) {
            return [
                bookId,
                chapter - 1,
                titleForBookChapter(book, chapter - 1)
            ];
        }
    }

    let previousBook = books[bookId - 1];

    if (previousBook !== undefined) {
        return [
            bookId - 1,
            previousBook.numChapters,
            titleForBookChapter(previousBook, previousBook.numChapters)
        ];
    }
};

const titleForBookChapter = function (book, chapter) {
    if (book !== undefined) {
        if (chapter > 0) {
            return `${book.tocName} ${chapter}`;
        }

        return book.tocName;
    }
};

/*-------------------------------------------------------------------
    *                      PUBLIC API
    */

export default Object.freeze(navigateChapter);