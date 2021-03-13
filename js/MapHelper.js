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
/*global
console, map, google, MarkerWithLabel
*/
/*property
    Animation, DROP, LatLngBounds, abs, animation, exec, extend, fitBounds,
    forEach, freeze, getAttribute, getPosition, includes, indexOf, labelClass,
    labelContent, lat, length, lng, map, maps, position, push, querySelectorAll,
    setCenter, setMap, setUpMarkers, setZoom, showLocation, splice, title,
    toLowerCase
*/

/*-------------------------------------------------------------------
    *                      IMPORTS
    */
import {onScreenDiv} from "./Navigation.js";

/*-------------------------------------------------------------------
    *                      CONSTANTS
    */
const INDEX_FLAG = 11;
const INDEX_LATITUDE = 3;
const INDEX_LONGITUDE = 4;
const INDEX_PLACENAME = 2;
const LAT_LON_PARSER = /\((.*),'(.*)',(.*),(.*),(.*),(.*),(.*),(.*),(.*),(.*),'(.*)'\)/;

/*-------------------------------------------------------------------
    *                      PRIVATE VARIABLES
    */

let gmMarkers = [];

/*-------------------------------------------------------------------
    *                      PRIVATE METHODS
    */
const addMarker = function (placename, latitude, longitude) {
    let bMarkerInArray = false;

    gmMarkers.forEach(function (marker) {
        let latDelta = Math.abs(marker.position.lat() - Number(latitude));
        let longDelta = Math.abs(marker.position.lng() - Number(longitude));

        if (latDelta < 0.00000001 && longDelta < 0.00000001) {
            bMarkerInArray = true;

            if (!marker.title.toLowerCase().includes(placename.toLowerCase()) && !placename.toLowerCase().includes(marker.title.toLowerCase())) {
                placename = `${marker.title}, ${placename}`;

                // delete marker from array
                let index = gmMarkers.indexOf(marker);
                if (index !== -1) {
                    gmMarkers.splice(index, 1);
                }

                // set to false so marker is re-added
                bMarkerInArray = false;
            }
        }
    });

    if (!bMarkerInArray) {
        //uses the marker with Label js class linked in the index.html
        let marker = new MarkerWithLabel({
            position: {lat: Number(latitude), lng: Number(longitude)},
            labelContent: placename,
            labelClass: "labels",
            map,
            title: placename,
            animation: google.maps.Animation.DROP
        });

        gmMarkers.push(marker);
    }
};

const clearMarkers = function () {
    gmMarkers.forEach(function (marker) {
        marker.setMap(null);
    });

    gmMarkers = [];
};

const setUpMarkers = function () {
    if (gmMarkers.length > 0) {
        clearMarkers();
    }

    document.querySelectorAll(`#${onScreenDiv} a[onclick^=\"showLocation(\"]`).forEach(function (element) {
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
const MapHelper = {
    setUpMarkers,
    showLocation
};

export default Object.freeze(MapHelper);