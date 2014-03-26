/* global test, module, deepEqual  */
(function (Backbone, _, querybuilder, earthlingDataProvider) {
    "use strict";

    var user,
        users,
        User,
        UserCollection;

    module("Interface Expectations", {
        setup: function() {
            User = Backbone.Model.extend({
                urlRoot: '/api/user'
            });

            UserCollection = Backbone.Collection.extend({
                model: User,
                url: '/api/user'
            });

            querybuilder.setProvider(window.earthlingDataProvider);
        }
    });

    test("includeRelated: single option", 1, function() {

        user = new User({'id': 1});
        user
            .includeRelated('role');

        deepEqual(user._rbQueryData, {
            includeRelated: [
                {
                    field: 'role'
                }
            ]
        });
    });

    test("includeRelated: multiple options", 1, function () {
        user = new User({'id': 1});
        user
            .includeRelated('role', 'organization');

        deepEqual(user._rbQueryData, {
            includeRelated: [
                {
                    field: 'role'
                },
                {
                    field: 'organization'
                }
            ]
        });
    });

    test("includeRelated: 2 level deep relationship", 1, function () {
        user = new User({'id': 1});
        user
            .includeRelated('organization.owner');

        deepEqual(user._rbQueryData, {
            includeRelated: [
                {
                    field: 'organization.owner'
                }
            ]
        });
    });

    test("includeRelated: 3 level deep relationship", 1, function () {
        user = new User({'id': 1});
        user
            .includeRelated('organization.owner.role');

        deepEqual(user._rbQueryData, {
            includeRelated: [
                {
                    field: 'organization.owner.role'
                }
            ]
        });
    });

    test("includeRelated: multiple option deep relationship", 1, function () {
        user = new User({'id': 1});
        user
            .includeRelated('organization.owner', 'organization.staff');

        deepEqual(user._rbQueryData, {
            includeRelated: [
                {
                    field: 'organization.owner'
                },
                {
                    field: 'organization.staff'
                }
            ]
        });
    });

    test("when: single field equal", 1, function () {
        users = new UserCollection();
        users
            .when({
                role: {
                    '=': 'editor'
                }
            });

        deepEqual(users._rbQueryData, {
            when: [
                {
                    field: 'role',
                    operator: '=',
                    value: 'editor'
                }
            ]
        });
    });

    test("when: single field equal shorthand", 1, function () {
        users = new UserCollection();
        users
            .when({
                role: 'editor'
            });

        deepEqual(users._rbQueryData, {
            when: [
                {
                    field: 'role',
                    operator: '=',
                    value: 'editor'
                }
            ]
        });
    });

    test("when: multiple fields", 1, function () {
        users = new UserCollection();
        users
            .when({
                role: 'editor',
                createdBy: 4
            });

        deepEqual(users._rbQueryData, {
            when: [
                {
                    field: 'role',
                    operator: '=',
                    value: 'editor'
                },
                {
                    field: 'createdBy',
                    operator: '=',
                    value: 4
                }
            ]
        });
    });

    test("when: like field", 1, function () {
        users = new UserCollection();
        users
            .when({
                firstName: {
                    'like': 'Joh*'
                }
            });

        deepEqual(users._rbQueryData, {
            when: [
                {
                    field: 'firstName',
                    operator: 'like',
                    value: 'Joh*'
                }
            ]
        });
    });

    test("when: in list", 1, function () {
        users = new UserCollection();
        users
            .when({
                role: {
                    'in': ['editor', 'author']
                }
            });

        deepEqual(users._rbQueryData, {
            when: [
                {
                    field: 'role',
                    operator: 'in',
                    value: ['editor', 'author']
                }
            ]
        });
    });

    test("when: in list shorthand", 1, function () {
        users = new UserCollection();
        users
            .when({
                role: ['editor', 'author']
            });

        deepEqual(users._rbQueryData, {
            when: [
                {
                    field: 'role',
                    operator: 'in',
                    value: ['editor', 'author']
                }
            ]
        });
    });

    test("when: greater than", 1, function () {
        users = new UserCollection();
        users
            .when({
                createdAt: {
                    '>': 10
                }
            });

        deepEqual(users._rbQueryData, {
            when: [
                {
                    field: 'createdAt',
                    operator: '>',
                    value: 10
                }
            ]
        });
    });

    test("when: greater than", 1, function () {
        users = new UserCollection();
        users
            .when({
                createdAt: {
                    '<': 10
                }
            });

        deepEqual(users._rbQueryData, {
            when: [
                {
                    field: 'createdAt',
                    operator: '<',
                    value: 10
                }
            ]
        });
    });

    test("when: deep relationship field", 1, function () {
        users = new UserCollection();
        users
            .when({
                'organization.type': {
                    '=': 'facility'
                }
            });

        deepEqual(users._rbQueryData, {
            when: [
                {
                    field: 'organization.type',
                    operator: '=',
                    value: 'facility'
                }
            ]
        });
    });

    test("when: deep relationship field shorthand", 1, function () {
        users = new UserCollection();
        users
            .when({
                'organization.type': 'facility'
            });

        deepEqual(users._rbQueryData, {
            when: [
                {
                    field: 'organization.type',
                    operator: '=',
                    value: 'facility'
                }
            ]
        });
    });

    // Dan has completed interface on first30
    test("limit", 1, function () {
        users = new UserCollection();
        users
            .limit(10);

        deepEqual(users._rbQueryData, {
            limit: 10
        });
    });

    // Dan has completed interface on first30
    test("skip by integer", 1, function () {
        users = new UserCollection();
        users
            .limit(10)
            .skip(2);

        deepEqual(users._rbQueryData, {
            limit: 10,
            skip: 2
        });
    });

    // Dan has completed interface on first30
    test("orderBy: single field shorthand", 1, function () {
        users = new UserCollection();
        users
            .orderBy('lastName');

        deepEqual(users._rbQueryData, {
            orderBy: [
                {
                    field: 'lastName',
                    direction: 'asc'
                }
            ]
        });
    });

    // Dan has completed interface on first30
    test("orderBy: single field ascending", 1, function () {
        users = new UserCollection();
        users
            .orderBy({
                lastName: 'asc'
            });

        deepEqual(users._rbQueryData, {
            orderBy: [
                {
                    field: 'lastName',
                    direction: 'asc'
                }
            ]
        });
    });

    // Dan has completed interface on first30
    test("orderBy: single field descending", 1, function () {
        users = new UserCollection();
        users
            .orderBy({
                lastName: 'desc'
            });

        deepEqual(users._rbQueryData, {
            orderBy: [
                {
                    field: 'lastName',
                    direction: 'desc'
                }
            ]
        });
    });

    //TODO: Figure out order of importance for sort fields
    test("orderBy: multiple fields", 1, function () {
        users = new UserCollection();
        users
            .orderBy({
                lastName: 'desc'
            })
            .orderBy({
                firstName: 'asc'
            });

        deepEqual(users._rbQueryData, {
            orderBy: [
                {
                    field: 'lastName',
                    direction: 'desc'
                },
                {
                    field: 'firstName',
                    direction: 'asc'
                }
            ]
        });
    });



})(window.Backbone, window._, window.querybuilder, window.earthlingDataProvider);