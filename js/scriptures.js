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

/*-------------------------------------------------------------------
    *                      IMPORTS
    */
import api from "./MapScripApi.js";
import MapHelper from "./MapHelper.js";
import navigation from "./Navigation.js";

/*-------------------------------------------------------------------
    *                      PUBLIC API
    */
const Scriptures = {
    init: api.init,
    onHashChanged: navigation.onHashChanged,
    showLocation: MapHelper.showLocation
};

export default Object.freeze(Scriptures);