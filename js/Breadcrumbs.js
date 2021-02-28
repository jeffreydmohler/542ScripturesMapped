/*========================================================================
* FILE:    MapHelper.js
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
*/

/*-------------------------------------------------------------------
    *                      IMPORTS
    */
import html from "./htmlHelper.js";

/*-------------------------------------------------------------------
    *                      CONSTANTS
    */
const DIV_BREADCRUMBS = "crumbs";
const TAG_UNORDERED_LIST = "ul";
const TEXT_TOP_LEVEL = "The Scriptures";

/*-------------------------------------------------------------------
    *                      PRIVATE VARIABLES
    */


/*-------------------------------------------------------------------
    *                      PRIVATE METHODS
    */
const breadcrumbsHtml = function (volume, book, chapter) {
    let crumbs = "";

    if (volume === undefined) {
        crumbs = html.listItem(TEXT_TOP_LEVEL);
    } else {
        crumbs = html.listItemLink(TEXT_TOP_LEVEL);

        if (book === undefined) {
            crumbs += html.listItem(volume.fullName);
        } else {
            crumbs += html.listItemLink(volume.fullName, volume.id);

            if (chapter === undefined || chapter <= 0) {
                crumbs += html.listItem(book.tocName);
            } else {
                crumbs += html.listItemLink(book.tocName, `${volume.id}:${book.id}`);
                crumbs += html.listItem(chapter);
            }
        }
    }

    return html.element(TAG_UNORDERED_LIST, crumbs);
};

const injectBreadcrumbs = function (volume, book, chapter) {
    document.getElementById(DIV_BREADCRUMBS).innerHTML = breadcrumbsHtml(volume, book, chapter);
};


/*-------------------------------------------------------------------
    *                      PUBLIC API
    */
export default Object.freeze(injectBreadcrumbs);