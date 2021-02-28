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
const DIV_SCRIPTURES = "scriptures";
const TAG_HEADER5 = "h5";



/*-------------------------------------------------------------------
    *                      PRIVATE VARIABLES
    */


/*-------------------------------------------------------------------
    *                      PRIVATE METHODS
    */

const bookChapterValid = function (bookId, chapter) {
    let book = books[bookId];

    if (book === undefined || chapter < 0 || chapter > book.numChapters) {
        return false;
    }

    if (chapter === 0 && book.numChapters > 0) {
        return false;
    }

    return true;
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
        document.getElementById(DIV_SCRIPTURES).innerHTML = html.div({
            id: DIV_SCRIPTURES_NAVIGATOR,
            content: chapterGrid(book)
        });

        injectBreadcrumbs(api.volumeForId(book.parentBookId), book);
        MapHelper.setUpMarkers();
    }
};


const navigateHome = function (volumeId) {
    document.getElementById(DIV_SCRIPTURES).innerHTML = html.div({
        id: DIV_SCRIPTURES_NAVIGATOR,
        content: volumesGridContent(volumeId)
    });

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


export default Object.freeze(onHashChanged);