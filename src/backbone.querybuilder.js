/* global module, toString */
(function(root, factory) {
    "use strict";

    // Set up Backbone appropriately for the environment. Start with AMD.
    if (typeof define === 'function' && define.amd) {
        define('backbone.querybuilder', ['backbone', 'underscore'], function(Backbone, _) {
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

        /*
         * When provider is set then update Backbone Model and Collection prototypes
         * to have new querybuilder methods.
         */
        setProvider: function (provider) {
            this.provider = provider;
            _.extend(Backbone.Model.prototype, QueryBuilderMixin);
            _.extend(Backbone.Collection.prototype, QueryBuilderMixin);
        },
        getMixin: function () {
            return QueryBuilderMixin;
        }
    };

    var QueryBuilderMixin = {
        /**
         * Includes additional related objects with the returned data
         *
         * @example
         *  this.model.includeRelated('role', 'organization')
         *  this.model.includeRelated('organization.owner')
         *  this.model.incldue('organization.owner.role', 'organization.staff')
         *
         * @method includeRelated
         * @return {object} Reference to current object
         */
        includeRelated: function () {
            var options = [].slice.call(arguments),
                includeRelatedData = [];

            _.each(options, function (includeRelatedItem) {
                includeRelatedData.push({
                    field: includeRelatedItem
                });
            });

            this._rbQueryData = this._rbQueryData || {};
            this._rbQueryData['includeRelated'] = includeRelatedData;

            return this;
        },

        /**
         * Includes additional related objects with the returned data
         *
         * @example
         *  this.model.when({
         *      role: {
         *          '=': 'editor'
         *      }
         *  })
         *  this.model.includeRelated('organization.owner')
         *  this.model.incldue('organization.owner.role', 'organization.staff')
         *
         * @method when
         * @param {object} options used to build the queries
         * @return {object} Reference to current object
         */
        when: function (options) {
            var whenData = [];

            _.each(options, function (value, key) {
                if (typeof value === 'string' || typeof value === "number") {
                    whenData.push({
                        field: key,
                        operator: '=',
                        value: value
                    });
                } else if (toString.call(value) === '[object Array]') {
                    whenData.push({
                        field: key,
                        operator: 'in',
                        value: value
                    });
                } else if (typeof value === 'object') {
                    whenData.push({
                        field: key,
                        operator: _.keys(value)[0],
                        value: _.values(value)[0]
                    });
                }
            });

            this._rbQueryData = this._rbQueryData || {};
            this._rbQueryData['when'] = whenData;

            return this;
        },

        /**
         * Includes additional related objects with the returned data
         *
         * @example
         *  this.model.includeRelatedRelated('role', 'organization')
         *  this.model.includeRelated('organization.owner')
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
         *  this.model.includeRelated('role', 'organization')
         *  this.model.includeRelated('organization.owner')
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
         *  this.model.includeRelated('role', 'organization')
         *  this.model.includeRelated('organization.owner')
         *  this.model.incldue('organization.owner.role', 'organization.staff')
         *
         * @method orderBy
         * @return {object} Reference to current object
         */
        orderBy: function (options, order) {
            var fieldName,
                direction;

            if (typeof options === 'string') {
                fieldName = options;
                direction = order || 'asc';
            } else if (typeof options === 'object') {
                fieldName = _.keys(options)[0];
                direction = _.values(options)[0];
            }

            this._rbQueryData = this._rbQueryData || {};
            this._rbQueryData['orderBy'] = this._rbQueryData['orderBy'] || [];
            this._rbQueryData['orderBy'].push({
                field: fieldName,
                direction: direction
            });

            return this;
        },

        /**
         * Overrides backbone sync to includeRelated data built by methods
         */
        sync: function (method, item, options) {
            var queryFields = QueryBuilder.provider.getFields(this._rbQueryData);

            // After gathering data reset the query info because it should only be
            // used on one request.
            this._rbQueryData = {};

            options.data = _.extend(queryFields, options.data || {});
            return Backbone.sync.call(this, method, item, options);
        }
    };

    return QueryBuilder;
}));