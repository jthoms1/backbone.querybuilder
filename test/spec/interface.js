/* global test, module, deepEqual  */
(function (Backbone, _) {
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

        }
    });

    test("include: single option", 1, function() {

        user = new User({'id': 1});
        user
            .include('role');

        deepEqual(user._rbQueryData, {
            include: [
                {
                    field: 'role'
                }
            ]
        });
    });

    test("include: multiple options", 1, function () {
        user = new User({'id': 1});
        user
            .include('role', 'organization');

        deepEqual(user._rbQueryData, {
            include: [
                {
                    field: 'role'
                },
                {
                    field: 'organization'
                }
            ]
        });
    });

    test("include: 2 level deep relationship", 1, function () {
        user = new User({'id': 1});
        user
            .include('organization.owner');

        deepEqual(user._rbQueryData, {
            include: [
                {
                    field: 'organization.owner'
                }
            ]
        });
    });

    test("include: 3 level deep relationship", 1, function () {
        user = new User({'id': 1});
        user
            .include('organization.owner.role');

        deepEqual(user._rbQueryData, {
            include: [
                {
                    field: 'organization.owner.role'
                }
            ]
        });
    });

    test("include: multiple option deep relationship", 1, function () {
        user = new User({'id': 1});
        user
            .include('organization.owner', 'organization.staff');

        deepEqual(user._rbQueryData, {
            include: [
                {
                    field: 'organization.owner'
                },
                {
                    field: 'organization.staff'
                }
            ]
        });
    });

    test("where: single field equal", 1, function () {
        users = new UserCollection();
        users
            .where({
                role: {
                    '=': 'editor'
                }
            });

        deepEqual(users._rbQueryData, {
            where: [
                {
                    field: 'role',
                    operator: '=',
                    value: 'editor'
                }
            ]
        });
    });

    test("where: single field equal shorthand", 1, function () {
        users = new UserCollection();
        users
            .where({
                role: 'editor'
            });

        deepEqual(users._rbQueryData, {
            where: [
                {
                    field: 'role',
                    operator: '=',
                    value: 'editor'
                }
            ]
        });
    });

    test("where: multiple fields", 1, function () {
        users = new UserCollection();
        users
            .where({
                role: 'editor',
                createdBy: 4
            });

        deepEqual(users._rbQueryData, {
            where: [
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

    test("where: like field", 1, function () {
        users = new UserCollection();
        users
            .where({
                firstName: {
                    'like': 'Joh*'
                }
            });

        deepEqual(users._rbQueryData, {
            where: [
                {
                    field: 'firstName',
                    operator: 'like',
                    value: 'Joh*'
                }
            ]
        });
    });

    test("where: in list", 1, function () {
        users = new UserCollection();
        users
            .where({
                role: {
                    'in': ['editor', 'author']
                }
            });

        deepEqual(users._rbQueryData, {
            where: [
                {
                    field: 'role',
                    operator: 'in',
                    value: ['editor', 'author']
                }
            ]
        });
    });

    test("where: in list shorthand", 1, function () {
        users = new UserCollection();
        users
            .where({
                role: ['editor', 'author']
            });

        deepEqual(users._rbQueryData, {
            where: [
                {
                    field: 'role',
                    operator: 'in',
                    value: ['editor', 'author']
                }
            ]
        });
    });

    test("where: greater than", 1, function () {
        users = new UserCollection();
        users
            .where({
                createdAt: {
                    '>': 10
                }
            });

        deepEqual(users._rbQueryData, {
            where: [
                {
                    field: 'createdAt',
                    operator: '>',
                    value: 10
                }
            ]
        });
    });

    test("where: greater than", 1, function () {
        users = new UserCollection();
        users
            .where({
                createdAt: {
                    '<': 10
                }
            });

        deepEqual(users._rbQueryData, {
            where: [
                {
                    field: 'createdAt',
                    operator: '<',
                    value: 10
                }
            ]
        });
    });

    test("where: deep relationship field", 1, function () {
        users = new UserCollection();
        users
            .where({
                'organization.type': {
                    '=': 'facility'
                }
            });

        deepEqual(users._rbQueryData, {
            where: [
                {
                    field: 'organization.type',
                    operator: '=',
                    value: 'facility'
                }
            ]
        });
    });

    test("where: deep relationship field shorthand", 1, function () {
        users = new UserCollection();
        users
            .where({
                'organization.type': 'facility'
            });

        deepEqual(users._rbQueryData, {
            where: [
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
    test("sortBy: single field shorthand", 1, function () {
        users = new UserCollection();
        users
            .sortBy('lastName');

        deepEqual(users._rbQueryData, {
            sortBy: [
                {
                    field: 'lastName',
                    direction: 'asc'
                }
            ]
        });
    });

    // Dan has completed interface on first30
    test("sortBy: single field ascending", 1, function () {
        users = new UserCollection();
        users
            .sortBy({
                lastName: 'asc'
            });

        deepEqual(users._rbQueryData, {
            sortBy: [
                {
                    field: 'lastName',
                    direction: 'asc'
                }
            ]
        });
    });

    // Dan has completed interface on first30
    test("sortBy: single field descending", 1, function () {
        users = new UserCollection();
        users
            .sortBy({
                lastName: 'desc'
            });

        deepEqual(users._rbQueryData, {
            sortBy: [
                {
                    field: 'lastName',
                    direction: 'desc'
                }
            ]
        });
    });

    //TODO: Figure out order of importance for sort fields
    test("sortBy: multiple fields", 1, function () {
        users = new UserCollection();
        users
            .sortBy({
                lastName: 'desc'
            })
            .sortBy({
                firstName: 'asc'
            });

        deepEqual(users._rbQueryData, {
            sortBy: [
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



})(window.Backbone, window._);