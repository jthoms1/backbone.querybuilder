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
        includeRelated: function (queryData) {
            var includeRelatedFields = _.map(queryData['includeRelated'], function (obj) {
                return _.values(obj)[0];
            });

            return {
                'with': includeRelatedFields.join()
            };
        },

        when: function (queryData) {
            var whenData = {},
                comparisons = {
                    '=': 'eq',
                    '>': 'gt',
                    '<': 'lt',
                    'in': 'in',
                    'like': 'like'
                };

            _.each(queryData['when'], function (item) {

                if (comparisons[item.operator]) {
                    whenData[item.field] = comparisons[item.operator] + ':' + item.value;
                } else {
                    whenData[item.field] = item.value;
                }
            });

            return whenData;
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

        orderBy: function (queryData) {
            var orderByData = _.map(queryData['orderBy'], function (item) {
                var direction = (item.direction === 'asc') ? '' : '-';
                return direction + item.field;
            });

            return {
                orderBy: orderByData.join()
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