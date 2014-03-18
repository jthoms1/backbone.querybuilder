/* global test, module, sinon  */
(function (Backbone, _) {
    "use strict";

    var server,
        user,
        users,
        User,
        UserCollection;

    module( "REST XHR url tests", {
        setup: function() {
            User = Backbone.Model.extend({
                urlRoot: '/api/user'
            });

            UserCollection = Backbone.Collection.extend({
                model: User
            });

            server = sinon.fakeServer.create();

            this.setServerData = function (url, testData) {
                server.respondWith("GET", url, [200, {
                    "Content-Type": "application/json"
                }, JSON.stringify({})]);
            };
        },
        teardown: function () {
            server.restore();
        }
    });

    test("include: single option", 4, function() {
        this.setServerData("/api/user/1?" + encodeURIComponent("includes=role"));

        user = new User({'id': 1});
        user
            .include('role')
            .fetch();

        server.respond();
    });

    test("include: multiple options", 8, function () {
        this.setServerData("/api/user/1?" + encodeURIComponent("includes=role,organization"));

        user = new User({'id': 1});
        user
            .include('role', 'organization')
            .fetch();

        server.respond();
    });

    test("include: 2 level deep relationship", 8, function () {
        this.setServerData("/api/user/1?" + encodeURIComponent("includes=organization/role"));

        user = new User({'id': 1});
        user
            .include('organization.owner')
            .fetch();

        server.respond();
    });

    test("include: 3 level deep relationship", 8, function () {
        this.setServerData("/api/user/1?" + encodeURIComponent("includes=organization/role/stuff"));

        user = new User({'id': 1});
        user
            .include('organization.owner.role')
            .fetch();

        server.respond();
    });

    test("include: multiple option deep relationship", 8, function () {
        this.setServerData("/api/user/1?" + encodeURIComponent("includes=organization/role/stuff"));

        user = new User({'id': 1});
        user
            .include('organization.owner', 'organization.staff')
            .fetch();

        server.respond();
    });

    test("where: single field equal", 8, function () {
        this.setServerData("/api/user?" + encodeURIComponent(""));

        users = new UserCollection();
        users
            .where({
                role: {
                    '=': 'editor'
                }
            })
            .fetch();

        server.respond();
    });

    test("where: single field equal shorthand", 8, function () {
        this.setServerData("/api/user?" + encodeURIComponent(""));

        users = new UserCollection();
        users
            .where({
                role: 'editor'
            })
            .fetch();

        server.respond();
    });

    test("where: multiple fields", 8, function () {
        this.setServerData("/api/user?" + encodeURIComponent(""));

        users = new UserCollection();
        users
            .where({
                role: 'editor',
                createdBy: 4
            })
            .fetch();

        server.respond();
    });

    test("where: like field", 8, function () {
        this.setServerData("/api/user?" + encodeURIComponent(""));

        users = new UserCollection();
        users
            .where({
                firstName: 'Joh*'
            })
            .fetch();

        server.respond();
    });

    test("where: in list", 8, function () {
        this.setServerData("/api/user?" + encodeURIComponent(""));

        users = new UserCollection();
        users
            .where({
                role: {
                    'in': ['editor', 'author']
                }
            })
            .fetch();

        server.respond();
    });

    test("where: in list shorthand", 8, function () {
        this.setServerData("/api/user?" + encodeURIComponent(""));

        users = new UserCollection();
        users
            .where({
                role: ['editor', 'author']
            })
            .fetch();

        server.respond();
    });

    test("where: greater than", 8, function () {
        this.setServerData("/api/user?" + encodeURIComponent(""));

        users = new UserCollection();
        users
            .where({
                createdAt: {
                    '>': new Date()
                }
            })
            .fetch();

        server.respond();
    });

    test("where: deep relationship field", 8, function () {
        this.setServerData("/api/user?" + encodeURIComponent(""));

        users = new UserCollection();
        users
            .where({
                'organization.type': 'facility'
            })
            .fetch();

        server.respond();
    });

    test("limit", 8, function () {
        this.setServerData("/api/user?" + encodeURIComponent(""));

        users = new UserCollection();
        users
            .limit(10)
            .fetch();

        server.respond();
    });

    test("skip by integer", 8, function () {
        this.setServerData("/api/user?" + encodeURIComponent(""));

        users = new UserCollection();
        users
            .limit(10)
            .skip(2)
            .fetch();

        server.respond();
    });

    test("sortBy: single field shorthand", 8, function () {
        this.setServerData("/api/user?" + encodeURIComponent(""));

        users = new UserCollection();
        users
            .sortBy('lastName')
            .fetch();

        server.respond();
    });

    test("sortBy: single field ascending", 8, function () {
        this.setServerData("/api/user?" + encodeURIComponent(""));

        users = new UserCollection();
        users
            .sortBy({
                lastName: 'asc'
            })
            .fetch();

        server.respond();
    });

    test("sortBy: single field descending", 8, function () {
        this.setServerData("/api/user?" + encodeURIComponent(""));

        users = new UserCollection();
        users
            .sortBy({
                lastName: 'desc'
            })
            .fetch();

        server.respond();
    });

    test("sortBy: multiple fields", 8, function () {
        this.setServerData("/api/user?" + encodeURIComponent(""));

        users = new UserCollection();
        users
            .sortBy({
                lastName: 'desc',
                firstName: 'asc'
            })
            .fetch();

        server.respond();
    });



})(window.Backbone, window._);