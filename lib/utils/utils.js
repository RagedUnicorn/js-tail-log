'use strict';

/**
 * properties from the second argument object will overwrite those of the first one
 * will create a new object and not modify the passed ones
 * multiple objects are possible
 * @return {Object}
 *            merged object
 */
function merge() {
    var obj = {},
        args = Array.prototype.slice.call(arguments);

    if (!args) {
        throw new Error('merge(): Missing parameter');
    }

    args.forEach(function (item) {
        // ignore non-objects
        if (Object.prototype.toString.call(obj) !== '[object Object]') {
            return;
        }

        for (var attr in item) {
            if (item.hasOwnProperty(attr)) {
                obj[attr] = item[attr];
            }
        }
    });

    return obj;
}

/**
 * returns the path to the homefolder depending on what os it runs on
 * @return {String}
 *              path to userhome
 */
function getUserHome() {
    return process.env.HOME || process.env.HOMEPATH || process.env.USERPROFILE;
}

module.exports = {
    merge: merge,
    getUserHome: getUserHome
};
