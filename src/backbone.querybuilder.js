/* global module */
(function(root, factory) {
    "use strict";

    // Set up Backbone appropriately for the environment. Start with AMD.
    if (typeof define === 'function' && define.amd) {
        define(['backbone', 'underscore'], function(Backbone, _) {
            // Export global even in AMD case in case this script is loaded with
            // others that may still expect a global Backbone.
            return factory(Backbone, _);
        });

    // Next for Node.js or CommonJS.
    } else if (typeof exports !== 'undefined') {
        var underscore = require('underscore'),
            Backbone = require('backbone');

        module.exports = factory(Backbone, underscore);

    // Finally, as a browser global.
    } else {
        root.querybuilder = factory(root.Backbone, root._);
    }

}(this, function (Backbone, _) {
    "use strict";

    var QueryBuilder = {
        provider: null,
        setProvider: function (provider) {
            this.provider = provider;
        }
    };

    var QueryBuilderMixin = {
        /**
         * Includes additional related objects with the returned data
         *
         * @example
         *  this.model.include('role', 'organization')
         *  this.model.include('organization.owner')
         *  this.model.incldue('organization.owner.role', 'organization.staff')
         *
         * @method include
         * @return {object} Reference to current object
         */
        include: function () {
            //arguments
            this._rbQueryData = this._rbQueryData || {};
            this._rbQueryData['include'] = [].slice.call(arguments);

            return this;
        },

        /**
         * Includes additional related objects with the returned data
         *
         * @example
         *  this.model.where({
         *      role: {
         *          '=': 'editor'
         *      }
         *  })
         *  this.model.include('organization.owner')
         *  this.model.incldue('organization.owner.role', 'organization.staff')
         *
         * @method where
         * @param {object} options used to build the queries
         * @return {object} Reference to current object
         */
        where: function (options) {
            var whereData = {};

            for (var key in options) {
                if (options.hasOwnProperty(key)) {

                    if (typeof options[key] === 'string' || typeof options[key] === "number") {
                        whereData[key] = {
                            '=' : options[key]
                        };
                    } else if (toString.call(options[key]) === '[object Array]') {
                        whereData[key] = {
                            'in' : options[key]
                        };
                    } else {
                        whereData[key] = options[key];
                    }
                }
            }

            this._rbQueryData = this._rbQueryData || {};
            this._rbQueryData['where'] = whereData;

            return this;
        },

        /**
         * Includes additional related objects with the returned data
         *
         * @example
         *  this.model.include('role', 'organization')
         *  this.model.include('organization.owner')
         *  this.model.incldue('organization.owner.role', 'organization.staff')
         *
         * @method limit
         * @return {object} Reference to current object
         */
        limit: function (limitNum) {
            this._rbQueryData = this._rbQueryData || {};
            this._rbQueryData['limit'] = limitNum;

            return this;
        },

        /**
         * Includes additional related objects with the returned data
         *
         * @example
         *  this.model.include('role', 'organization')
         *  this.model.include('organization.owner')
         *  this.model.incldue('organization.owner.role', 'organization.staff')
         *
         * @method skip
         * @return {object} Reference to current object
         */
        skip: function (skipNum) {
            this._rbQueryData = this._rbQueryData || {};
            this._rbQueryData['skip'] = skipNum;

            return this;
        },

        /**
         * Includes additional related objects with the returned data
         * can be called multiple times for each additonal sort item.
         *
         * @example
         *  this.model.include('role', 'organization')
         *  this.model.include('organization.owner')
         *  this.model.incldue('organization.owner.role', 'organization.staff')
         *
         * @method sortBy
         * @return {object} Reference to current object
         */
        sortBy: function (options, order) {
            var fieldName,
                direction;

            if (typeof options === 'string') {
                fieldName = options;
                direction = order || 'asc';
            } else {
                for (var key in options) {
                    if (options.hasOwnProperty(key)) {
                        fieldName = key;
                        direction = options[key];

                        // Prevents more than one sortBy being set per
                        // method call. Otherwise we don't really know the order
                        break;
                    }
                }
            }

            this._rbQueryData = this._rbQueryData || {};
            this._rbQueryData['sortBy'] = this._rbQueryData['sortBy'] || [];
            this._rbQueryData['sortBy'].push({
                field: fieldName,
                direction: direction
            });

            return this;
        },

        /**
         * Overrides backbone sync to include data built by methods
         */
        sync: function (method, item, options) {
            var queryFields = QueryBuilder.provider.getFields(this._rbQueryData);

            options.data = _.extend(queryFields, options.data || {});
            return Backbone.sync.call(this, method, item, options);
        }
    };

    _.extend(Backbone.Model.prototype, QueryBuilderMixin);
    _.extend(Backbone.Collection.prototype, QueryBuilderMixin);

    return QueryBuilder;
}));