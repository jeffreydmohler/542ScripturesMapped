/*========================================================================
* FILE:    scriptures.js
* AUTHOR:  Jeffrey Mohler
* DATE:    Winter 2021
*
* DESCRIPTION: Front-end JavaScript code for the Scriptures, Mapped.
*              IS 542, Winter 2021, BYU.
*/
/*jslint
browser, long
*/
/*global
console, map, google
*/
/*property
    Animation, DROP, LatLngBounds, Marker, animation, books, classKey, content,
    exec, extend, fitBounds, forEach, freeze, fullName, getAttribute,
    getElementById, getPosition, gridName, hash, href, id, includes, init,
    innerHTML, label, lat, length, lng, map, maps, maxBookId, minBookId,
    numChapters, onHashChanged, onerror, onload, open, parse, position, push,
    querySelectorAll, response, send, setCenter, setMap, setZoom, showLocation,
    slice, split, status, title, toLowerCase, tocName
*/

/*-------------------------------------------------------------------
    *                      CONSTANTS
    */
const BOTTOM_PADDING = "<br/><br/>";
const CLASS_BOOKS = "books";
const CLASS_BOOK_BUTTON = "bookbutton";
const CLASS_BUTTON = "btn";
const CLASS_CHAPTER = "chapter";
const CLASS_VOLUME = "volume";
const CLASS_VOLUME_BUTTON = "volumebutton";
const CLASS_NEXT = "nextchapter";
const CLASS_PREVIOUS = "prevchapter";
const DIV_SCRIPTURES_NAVIGATOR = "scripnav";
const DIV_SCRIPTURES = "scriptures";
const INDEX_FLAG = 11;
const INDEX_LATITUDE = 3;
const INDEX_LONGITUDE = 4;
const INDEX_PLACENAME = 2;
const LAT_LON_PARSER = /\((.*),'(.*)',(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),'(.*)'\)/;
const REQUEST_GET = "GET";
const REQUEST_STATUS_OK = 200;
const REQUEST_STATUS_ERROR = 400;
const TAG_HEADER5 = "h5";
const URL_BASE = "https://scriptures.byu.edu/";
const URL_BOOKS = `${URL_BASE}mapscrip/model/books.php`;
const URL_SCRIPTURES = `${URL_BASE}mapscrip/mapgetscrip.php`;
const URL_VOLUMES = `${URL_BASE}mapscrip/model/volumes.php`;


/*-------------------------------------------------------------------
    *                      PRIVATE VARIABLES
    */
let books;
let gmMarkers = [];
let volumes;

/*-------------------------------------------------------------------
    *                      PRIVATE METHODS
    */
const addMarker = function (placename, latitude, longitude) {
    let bMarkerInArray = false;

    gmMarkers.forEach(function (marker) {
        if (marker.position.lat() === Number(latitude) && marker.position.lng() === Number(longitude)) {
            bMarkerInArray = true;

            if (!marker.title.toLowerCase().includes(placename.toLowerCase()) && !placename.toLowerCase().includes(marker.title.toLowerCase())) {
                marker.title = `${marker.title}, ${placename}`;
                marker.label = marker.title;
            }
        }
    });

    if (!bMarkerInArray) {
        let marker = new google.maps.Marker({
            position: {lat: Number(latitude), lng: Number(longitude)},
            label: placename,
            map,
            title: placename,
            animation: google.maps.Animation.DROP
        });

        gmMarkers.push(marker);
    }
};


const ajax = function (url, successCallback, failureCallback, skipJsonParse) {
    let request = new XMLHttpRequest();

    request.open(REQUEST_GET, url, true);

    request.onload = function () {
        if (request.status >= REQUEST_STATUS_OK && request.status < REQUEST_STATUS_ERROR) {
            let data = (
                skipJsonParse
                ? request.response
                : JSON.parse(request.response)
            );

            if (typeof successCallback === "function") {
                successCallback(data);
            }
        } else {
            if (typeof failureCallback === "function") {
                failureCallback(request);
            }
        }
    };

    request.onerror = failureCallback;
    request.send();
};

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
    return htmlDiv({
        classKey: CLASS_BOOKS,
        content: booksGridContent(volume)
    });
};

const booksGridContent = function (volume) {
    let gridContent = "";

    volume.books.forEach(function (book) {
        gridContent += htmlLink({
            classKey: CLASS_BUTTON,
            id: book.id,
            href: `#${volume.id}:${book.id}`,
            content: book.gridName
        });
    });

    return gridContent;
};

const cacheBooks = function (callback) {
    volumes.forEach(function (volume) {
        let volumeBooks = [];
        let bookId = volume.minBookId;

        while (bookId <= volume.maxBookId) {
            volumeBooks.push(books[bookId]);
            bookId += 1;
        }

        volume.books = volumeBooks;
    });

    if (typeof callback === "function") {
        callback();
    }
};

const chapterGrid = function (book) {
    return htmlLink({
        classKey: `${CLASS_BUTTON} ${CLASS_VOLUME_BUTTON}`,
        href: "#",
        content: "Volumes"
    }) + htmlDiv({
        classKey: CLASS_VOLUME,
        content: htmlElement(TAG_HEADER5, book.fullName)
    }) + htmlDiv({
        classKey: CLASS_BOOKS,
        content: chapterGridContent(book)
    });
};

const chapterGridContent = function (book) {
    let gridContent = "";
    let chapter = 1;

    while (chapter <= book.numChapters) {
        gridContent += htmlLink({
            classKey: `${CLASS_BUTTON} ${CLASS_CHAPTER}`,
            id: chapter,
            href: `#0:${book.id}:${chapter}`,
            content: chapter
        });

        chapter += 1;
    }

    return gridContent;
};

const clearMarkers = function () {
    gmMarkers.forEach(function (marker) {
        marker.setMap(null);
    });

    gmMarkers = [];
};

const encodedScripturesUrlParameters = function (bookId, chapter, verses, isJst) {
    if (bookId !== undefined && chapter !== undefined) {
        let options = "";

        if (verses !== undefined) {
            options += verses;
        }

        if (isJst !== undefined) {
            options += "&jst=JST";
        }

        return `${URL_SCRIPTURES}?book=${bookId}&chap=${chapter}&verses${options}`;
    }
};

const getScripturesCallback = function (chapterHtml) {
    let ids = location.hash.slice(1).split(":");
    let nextChapterButton = "";
    let prevChapterButton = "";

    let nextChapterArray = nextChapter(Number(ids[1]), Number(ids[2]));
    nextChapterButton = htmlLink({
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
    prevChapterButton = htmlLink({
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


    let bookButton = htmlLink({
        classKey: `${CLASS_BUTTON} ${CLASS_BOOK_BUTTON}`,
        href: `#0:${ids[1]}`,
        content: books[ids[1]].tocName
    });

    document.getElementById(DIV_SCRIPTURES).innerHTML = `${prevChapterButton}${bookButton}${nextChapterButton}<div style="clear: both;"></div>${chapterHtml}`;

    setUpMarkers();
};

const getScripturesFailure = function () {
    document.getElementById(DIV_SCRIPTURES).innerHTML = "Unable to receive chapter contents.";
};

const htmlAnchor = function (volume) {
    return `<a name="v${volume.id}" />`;
};

const htmlDiv = function (parameters) {
    let classString = "";
    let contentString = "";
    let idString = "";

    if (parameters.classKey !== undefined) {
        classString = ` class="${parameters.classKey}"`;
    }

    if (parameters.content !== undefined) {
        contentString = parameters.content;
    }

    if (parameters.id !== undefined) {
        idString = ` id="${parameters.id}"`;
    }

    return `<div${idString}${classString}>${contentString}</div>`;
};

const htmlElement = function (tagName, content) {
    return `<${tagName}>${content}</${tagName}>`;
};

const htmlLink = function (parameters) {
    let classString = "";
    let contentString = "";
    let hrefString = "";
    let idString = "";

    if (parameters.classKey !== undefined) {
        classString = ` class="${parameters.classKey}"`;
    }

    if (parameters.content !== undefined) {
        contentString = parameters.content;
    }

    if (parameters.href !== undefined) {
        hrefString = ` href="${parameters.href}"`;
    }

    if (parameters.id !== undefined) {
        idString = ` id="${parameters.id}"`;
    }

    return `<a${idString}${classString}${hrefString}>${contentString}</a>`;
};

const init = function (callback) {
    let booksLoaded = false;
    let volumesLoaded = false;

    ajax(URL_BOOKS, function (data) {
        books = data;
        booksLoaded = true;

        if (volumesLoaded) {
            cacheBooks(callback);
        }
    });
    ajax(URL_VOLUMES, function (data) {
        volumes = data;
        volumesLoaded = true;

        if (booksLoaded) {
            cacheBooks(callback);
        }
    });
};

const navigateBook = function (bookId) {
    let book = books[bookId];

    if (book.numChapters <= 1) {
        navigateChapter(bookId, book.numChapters);
    } else {
        document.getElementById(DIV_SCRIPTURES).innerHTML = htmlDiv({
            id: DIV_SCRIPTURES_NAVIGATOR,
            content: chapterGrid(book)
        });
    }
};

const navigateChapter = function (bookId, chapter) {
    ajax(encodedScripturesUrlParameters(bookId, chapter), getScripturesCallback, getScripturesFailure, true);
};

const navigateHome = function (volumeId) {
    document.getElementById(DIV_SCRIPTURES).innerHTML = htmlDiv({
        id: DIV_SCRIPTURES_NAVIGATOR,
        content: volumesGridContent(volumeId)
    });

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

const setUpMarkers = function () {
    if (gmMarkers.length > 0) {
        clearMarkers();
    }

    document.querySelectorAll("a[onclick^=\"showLocation(\"]").forEach(function (element) {
        let matches = LAT_LON_PARSER.exec(element.getAttribute("onclick"));

        if (matches) {
            let placename = matches[INDEX_PLACENAME];
            let latitude = matches[INDEX_LATITUDE];
            let longitude = matches[INDEX_LONGITUDE];
            let flag = matches[INDEX_FLAG];

            if (flag !== "") {
                placename = `${placename} ${flag}`;
            }

            addMarker(placename, latitude, longitude);
        }
    });

    zoomAppropriateLevel();
};

const showLocation = function (geotagId, placename, latitude, longitude, viewLatitude, viewLongitude, viewTilt, viewRoll, viewAltitude, viewHeading) {
    map.setCenter({lat: latitude, lng: longitude});
    map.setZoom(viewAltitude / 400); //13
};

const titleForBookChapter = function (book, chapter) {
    if (book !== undefined) {
        if (chapter > 0) {
            return `${book.tocName} ${chapter}`;
        }

        return book.tocName;
    }
};

const volumesGridContent = function (volumeId) {
    let gridContent = "";

    volumes.forEach(function (volume) {
        if (volumeId === undefined || volumeId === volume.id) {
            gridContent += htmlDiv({
                classKey: CLASS_VOLUME,
                content: htmlAnchor(volume) + htmlElement(TAG_HEADER5, volume.fullName)
            });

            gridContent += booksGrid(volume);
        }
    });

    return gridContent + BOTTOM_PADDING;
};

const zoomAppropriateLevel = function () {
    if (gmMarkers.length === 1) {
        map.setCenter({lat: gmMarkers[0].position.lat(), lng: gmMarkers[0].position.lng()});
        map.setZoom(13);
    } else if (gmMarkers.length > 1) {
        let bounds = new google.maps.LatLngBounds();
        gmMarkers.forEach(function (marker) {
            bounds.extend(marker.getPosition());
            map.fitBounds(bounds);
        });
    }
};

/*-------------------------------------------------------------------
    *                      PUBLIC API
    */
const Scriptures = {
    init,
    onHashChanged,
    showLocation
};

export default Object.freeze(Scriptures);