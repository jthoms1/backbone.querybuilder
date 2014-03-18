(function(root, factory) {
    "use strict";

    // Set up Backbone appropriately for the environment. Start with AMD.
    if (typeof define === 'function' && define.amd) {
        define(['backbone', 'underscore'], function(Backbone, _) {
            // Export global even in AMD case in case this script is loaded with
            // others that may still expect a global Backbone.
            factory(Backbone, _);
        });

    // Next for Node.js or CommonJS.
    } else if (typeof exports !== 'undefined') {
        var underscore = require('underscore'),
            Backbone = require('backbone');

        factory(Backbone, underscore);

    // Finally, as a browser global.
    } else {
        factory(root.Backbone, root._);
    }

}(this, function(Backbone, _) {
    "use strict";

    // Create query data
    // fetch clears query data or not


    var RESTBuilderMixin = {
        // Default build process for including sub models and collections
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

        

        sync: function (method, item, options) {
            options.data = _.extend(this._rbQueryData || {}, options.data || {});
            return Backbone.sync.call(this, method, item, options);
        }
    };

    _.extend(Backbone.Model.prototype, RESTBuilderMixin);
    _.extend(Backbone.Collection.prototype, RESTBuilderMixin);
}));