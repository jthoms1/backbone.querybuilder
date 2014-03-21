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
            var includeFields = _.map(queryData['include'], function (obj) {
                return _.values(obj)[0];
            });

            return {
                'with': includeFields.join()
            };
        },

        where: function (queryData) {
            var whereData = {},
                comparisons = {
                    '=': 'eq',
                    '>': 'gt',
                    '<': 'lt',
                    'in': 'in',
                    'like': 'like'
                };

            _.each(queryData['where'], function (item) {

                if (comparisons[item.operator]) {
                    whereData[item.field] = comparisons[item.operator] + ':' + item.value;
                } else {
                    whereData[item.field] = item.value;
                }
            });

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
            var sortByData = _.map(queryData['sortBy'], function (item) {
                var direction = (item.direction === 'asc') ? '' : '-';
                return direction + item.field;
            });

            return {
                orderBy: sortByData.join()
            };
        }
    };

    return {
        getFields: function (queryData) {
            var data = {};

            _.each(queryData, function (value, key) {
                if (conversionMethods[key]) {
                    var tempData = conversionMethods[key](queryData);
                    _.extend(data, tempData || {});
                }
            });

            return data;
        }
    };
}));