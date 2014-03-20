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

    var conversionMethods = {
        include: function (queryData) {
            var includeFields = queryData['include'];
            console.log({
                'with': includeFields.join()
            });
            return {
                'with': includeFields.join()
            };
        },

        where: function (queryData) {
            var whereFields = queryData['where'],
                whereData = {};
            
            for (var key in whereFields) {
                if (whereFields.hasOwnProperty(key)) {

                    for (var comparison in whereFields[key]) {
                        if (whereFields[key].hasOwnProperty(comparison)) {

                            if (comparison === '=') {
                                whereData[key] = 'eq:' + whereFields[key][comparison];
                            } else if (comparison === '>') {
                                whereData[key] = 'gt:' + whereFields[key][comparison];
                            } else if (comparison === '<') {
                                whereData[key] = 'lt:' + whereFields[key][comparison];
                            } else if (comparison === 'in') {
                                whereData[key] = 'in:' + whereFields[key][comparison].join();
                            } else if (comparison === 'like') {
                                whereData[key] = 'like:' + whereFields[key][comparison];
                            } else {
                                whereData[key] = whereFields[key][comparison];
                            }
                        }
                    }
                }
            }

            return whereData;
        },

        limit: function (queryData) {
            var limitField = queryData['limit'],
                skipField = queryData['skip'];

            if (skipField) {
                limitField = (skipField * limitField) + ',' + limitField;
            }

            return {
                limit: limitField
            };
        },

        sortBy: function (queryData) {
            var sortFields = queryData['sortBy'],
                i = 0,
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

    return {
        getFields: function (queryData) {
            var data = {};

            for (var name in queryData) {
                if (queryData.hasOwnProperty(name) && conversionMethods[name]) {
                    var tempData = conversionMethods[name](queryData);
                    _.extend(data, tempData || {});
                }
            }

            return data;
        }
    };
}));