/* global module */
(function(root, factory) {
    "use strict";

    // Set up Backbone appropriately for the environment. Start with AMD.
    if (typeof define === 'function' && define.amd) {
        define(['underscore'], function(Backbone, _) {
            // Export global even in AMD case in case this script is loaded with
            // others that may still expect a global Backbone.
            factory(Backbone, _);
        });

    // Next for Node.js or CommonJS.
    } else if (typeof exports !== 'undefined') {
        var underscore = require('underscore');

        module.exports = factory(underscore);

    // Finally, as a browser global.
    } else {
        root.earthlingDataProvider = factory(root._);
    }

}(this, function (_) {
    "use strict";

    return {
        include: function (_includesList) {
            var includeList = [];
            _.each(_includesList, function (includedItem, modelName) {
                var includeString = modelName;
                if (includedItem.subIncludes.length > 0) {
                    includeString += '/' + (includedItem.subIncludes[0].prototype.getModelName());
                }
                includeList.push(includeString);
            });
            return includeList.join();
        },

        where: function () {

        },

        limit: function (limitNum) {

        },

        skip: function (skipNum, limitNum) {
            return {

            }
        },

        sortBy: function (sortFields) {
            var i = 0,
                items = [];

            for (; i < sortFields.length; i++) {
                var direction = (sortFields[i].direction === 'asc') ? '' : '-';
                items.push(direction + sortFields[i].field);
            }

            return {
                orderBy: items.join()
            };
        }
    };
}));