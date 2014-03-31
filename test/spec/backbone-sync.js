/* global test, module, deepEqual */
(function (Backbone, _, sinon, querybuilder, earthlingDataProvider) {
    "use strict";

    var server,
        user,
        users,
        User,
        UserCollection;

    module("Backbone - Sync Compatibility", {
        setup: function() {
            querybuilder.setProvider(window.earthlingDataProvider);

            User = Backbone.Model.extend({
                urlRoot: '/api/user'
            });

            UserCollection = Backbone.Collection.extend({
                model: User,
                url: '/api/user'
            });
        },
        teardown: function () {
            querybuilder.removeProvider();
        }
    });

    test("persistentQuery: default false", 1, function () {
        server = sinon.fakeServer.create();
        server.respondWith("POST", '/api/user', [200, {
            "Content-Type": "application/json"
        }, JSON.stringify([{
            id: 1,
            name: 'John Wilson',
            role: {
                id: 1,
                name: 'editor'
            }
        }])]);

        users = new UserCollection();
        users
            .setPersistentQuery(false)
            .includeRelated('role')
            .fetch({
                complete: function () {
                    deepEqual(users._rbQueryData, {});
                }
            });

        server.respond();
    });

    test("persistentQuery: set true", 1, function () {
        server = sinon.fakeServer.create();
        server.respondWith("POST", '/api/user', [200, {
            "Content-Type": "application/json"
        }, JSON.stringify([{
            id: 1,
            name: 'John Wilson',
            role: {
                id: 1,
                name: 'editor'
            }
        }])]);

        users = new UserCollection();
        users
            .setPersistentQuery(true)
            .includeRelated('role')
            .fetch({
                complete: function () {
                    deepEqual(users._rbQueryData, {
                        "includeRelated": [
                            {
                                "field": "role"
                            }
                        ]
                    });
                }
            });

        server.respond();
    });

    test("persistentQuery: set false", 1, function () {
        server = sinon.fakeServer.create();
        server.respondWith("POST", '/api/user', [200, {
            "Content-Type": "application/json"
        }, JSON.stringify([{
            id: 1,
            name: 'John Wilson',
            role: {
                id: 1,
                name: 'editor'
            }
        }])]);

        users = new UserCollection();
        users
            .includeRelated('role')
            .fetch({
                complete: function () {
                    deepEqual(users._rbQueryData, {});
                }
            });

        server.respond();
    });

    test("Backbone Model: creating", 1, function () {

        server = sinon.fakeServer.create();
        server.respondWith("POST", '/api/user', [200, {
            "Content-Type": "application/json"
        }, JSON.stringify({
            id: 1,
            name: 'John Wilson'
        })]);

        user = new User();
        user.save({
            name: 'John Wilson'
        }, {
            complete: function () {
                deepEqual(user.attributes, {
                    id: 1,
                    name: 'John Wilson'
                });
            }
        });

        server.respond();
    });

    test("Backbone Model: updating", 1, function () {

        server = sinon.fakeServer.create();
        server.respondWith("PUT", '/api/user/1', [200, {
            "Content-Type": "application/json"
        }, JSON.stringify({
            id: 1,
            name: 'Johnny Wilson'
        })]);

        user = new User({id: 1, name: 'John Wilson'});
        user.save({
            'name': 'Johnny Wilson'
        }, {
            complete: function () {
                deepEqual(user.attributes, {
                    id: 1,
                    name: 'Johnny Wilson'
                });
            }
        });

        server.respond();
    });

})(window.Backbone, window._, window.sinon, window.querybuilder, window.earthlingDataProvider);