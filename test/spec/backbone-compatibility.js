/* global test, module, ok */
(function (Backbone, _, querybuilder, earthlingDataProvider) {
    "use strict";

    var user,
        users,
        User,
        UserCollection,
        bbMixin = querybuilder.getMixin(),
        expectedCollisions = ['sync'];

    module("Backbone - Method Compatibility", {
        setup: function() {
            User = Backbone.Model.extend({
                urlRoot: '/api/user'
            });

            UserCollection = Backbone.Collection.extend({
                model: User,
                url: '/api/user'
            });
        }
    });

    test("Backbone Model: unexpected method collisions", _.keys(bbMixin).length - expectedCollisions.length, function () {
        user = new User();

        _.each(bbMixin, function (value, prop) {
            if (_.indexOf(expectedCollisions, prop) !== -1) {
                return;
            }

            ok(typeof user[prop] === 'undefined', 'Backbone.Model already has method ' + prop);
        });
    });

    test("Backbone Model: expected method collisions", expectedCollisions.length, function () {
        var i = 0;
        user = new User();

        for (; i < expectedCollisions.length; i++) {
            ok(expectedCollisions[i] !== 'undefined', 'Backbone.Model does not have method ' + expectedCollisions[i]);
        }
    });

    test("Backbone Collection: unexpected method collisions", _.keys(bbMixin).length - expectedCollisions.length, function () {
        users = new UserCollection();

        _.each(bbMixin, function (value, prop) {
            if (_.indexOf(expectedCollisions, prop) !== -1) {
                return;
            }

            ok(typeof users[prop] === 'undefined', 'Backbone.Collection already has method ' + prop);
        });
    });

    test("Backbone Collection: expected method collisions", expectedCollisions.length, function () {
        var i = 0;
        users = new UserCollection();
    
        for (; i < expectedCollisions.length; i++) {
            ok(expectedCollisions[i] !== 'undefined', 'Backbone.Model does not have method ' + expectedCollisions[i]);
        }
    });

})(window.Backbone, window._, window.querybuilder, window.earthlingDataProvider);