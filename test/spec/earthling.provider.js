/* global test, module, sinon, equal, deepEqual  */
(function (Backbone, _, querybuilder, earthlingDataProvider) {
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
                model: User,
                url: '/api/user'
            });

            server = sinon.fakeServer.create();

            this.setServerData = function (url, testData) {
                server.respondWith("GET", url, [200, {
                    "Content-Type": "application/json"
                }, JSON.stringify({})]);
            };

            window.querybuilder.setProvider(window.earthlingDataProvider);
        },
        teardown: function () {
            server.restore();
        }
    });

    test("includeRelated: single option", 1, function() {
        var requestUrl = "/api/user/1?with=" + encodeURIComponent("role");

        this.setServerData(requestUrl);

        user = new User({'id': 1});
        user
            .includeRelated('role')
            .fetch({
                complete: function () {
                    equal(requestUrl, this.url);
                }
            });

        server.respond();
    });

    test("includeRelated: multiple options", 1, function () {
        var requestUrl = "/api/user/1?with=" + encodeURIComponent("role,organization");

        this.setServerData(requestUrl);

        user = new User({'id': 1});
        user
            .includeRelated('role', 'organization')
            .fetch({
                complete: function () {
                    equal(requestUrl, this.url);
                }
            });

        server.respond();
    });

    test("includeRelated: 2 level deep relationship", 1, function () {
        var requestUrl = "/api/user/1?with=" + encodeURIComponent("organization.owner");

        this.setServerData(requestUrl);

        user = new User({'id': 1});
        user
            .includeRelated('organization.owner')
            .fetch({
                complete: function () {
                    equal(requestUrl, this.url);
                }
            });

        server.respond();
    });

    test("includeRelated: 3 level deep relationship", 1, function () {
        var requestUrl = "/api/user/1?with=" + encodeURIComponent("organization.owner.role");

        this.setServerData(requestUrl);

        user = new User({'id': 1});
        user
            .includeRelated('organization.owner.role')
            .fetch({
                complete: function () {
                    equal(requestUrl, this.url);
                }
            });

        server.respond();
    });

    test("includeRelated: multiple option deep relationship", 1, function () {
        var requestUrl = "/api/user/1?with=" + encodeURIComponent("organization.owner,organization.staff");

        this.setServerData(requestUrl);

        user = new User({'id': 1});
        user
            .includeRelated('organization.owner', 'organization.staff')
            .fetch({
                complete: function () {
                    equal(requestUrl, this.url);
                }
            });

        server.respond();
    });

    test("when: single field equal", 1, function () {
        var requestUrl = "/api/user?role=" + encodeURIComponent("eq:editor");

        this.setServerData(requestUrl);

        users = new UserCollection();
        users
            .when({
                role: {
                    '=': 'editor'
                }
            })
            .fetch({
                complete: function () {
                    equal(requestUrl, this.url);
                }
            });

        server.respond();
    });

    test("when: single field equal shorthand", 1, function () {
        var requestUrl = "/api/user?role=" + encodeURIComponent("eq:editor");

        this.setServerData(requestUrl);

        users = new UserCollection();
        users
            .when({
                role: 'editor'
            })
            .fetch({
                complete: function () {
                    equal(requestUrl, this.url);
                }
            });

        server.respond();
    });

    test("when: multiple fields", 1, function () {
        var requestUrl = "/api/user?role=" + encodeURIComponent("eq:editor") + "&createdBy=" + encodeURIComponent("eq:4");

        this.setServerData(requestUrl);

        users = new UserCollection();
        users
            .when({
                role: 'editor',
                createdBy: 4
            })
            .fetch({
                complete: function () {
                    equal(requestUrl, this.url);
                }
            });

        server.respond();
    });

    test("when: like field", 1, function () {
        var requestUrl = "/api/user?firstName=" + encodeURIComponent("like:Joh*");

        this.setServerData(requestUrl);

        users = new UserCollection();
        users
            .when({
                firstName: {
                    'like': 'Joh*'
                }
            })
            .fetch({
                complete: function () {
                    equal(requestUrl, this.url);
                }
            });

        server.respond();
    });

    test("when: in list", 1, function () {
        var requestUrl = "/api/user?role=" + encodeURIComponent("in:editor,author");

        this.setServerData(requestUrl);

        users = new UserCollection();
        users
            .when({
                role: {
                    'in': ['editor', 'author']
                }
            })
            .fetch({
                complete: function () {
                    equal(requestUrl, this.url);
                }
            });

        server.respond();
    });

    test("when: in list shorthand", 1, function () {
        var requestUrl = "/api/user?role=" + encodeURIComponent("in:editor,author");

        this.setServerData(requestUrl);

        users = new UserCollection();
        users
            .when({
                role: ['editor', 'author']
            })
            .fetch({
                complete: function () {
                    equal(requestUrl, this.url);
                }
            });

        server.respond();
    });

    test("when: greater than", 1, function () {
        var requestUrl = "/api/user?createdAt=" + encodeURIComponent("gt:10");

        this.setServerData(requestUrl);

        users = new UserCollection();
        users
            .when({
                createdAt: {
                    '>': 10
                }
            })
            .fetch({
                complete: function () {
                    equal(requestUrl, this.url);
                }
            });

        server.respond();
    });

    test("when: less than", 1, function () {
        var requestUrl = "/api/user?createdAt=" + encodeURIComponent("lt:10");

        this.setServerData(requestUrl);

        users = new UserCollection();
        users
            .when({
                createdAt: {
                    '<': 10
                }
            })
            .fetch({
                complete: function () {
                    equal(requestUrl, this.url);
                }
            });

        server.respond();
    });

    test("when: deep relationship field", 1, function () {
        var requestUrl = "/api/user?organization.type=" + encodeURIComponent("eq:facility");

        this.setServerData(requestUrl);

        users = new UserCollection();
        users
            .when({
                'organization.type': {
                    '=': 'facility'
                }
            })
            .fetch({
                complete: function () {
                    equal(requestUrl, this.url);
                }
            });

        server.respond();
    });

    test("when: deep relationship field shorthand", 1, function () {
        var requestUrl = "/api/user?organization.type=" + encodeURIComponent("eq:facility");

        this.setServerData(requestUrl);

        users = new UserCollection();
        users
            .when({
                'organization.type': 'facility'
            })
            .fetch({
                complete: function () {
                    equal(requestUrl, this.url);
                }
            });

        server.respond();
    });

    // Dan has completed interface on first30
    test("limit", 1, function () {
        var requestUrl = "/api/user?limit=" + encodeURIComponent("10");

        this.setServerData(requestUrl);

        users = new UserCollection();
        users
            .limit(10)
            .fetch({
                complete: function () {
                    equal(requestUrl, this.url);
                }
            });

        server.respond();
    });

    // Dan has completed interface on first30
    test("skip by integer", 1, function () {
        var requestUrl = "/api/user?limit=" + encodeURIComponent("20,10");

        this.setServerData(requestUrl);

        users = new UserCollection();
        users
            .limit(10)
            .skip(2)
            .fetch({
                complete: function () {
                    equal(requestUrl, this.url);
                }
            });

        server.respond();
    });

    // Dan has completed interface on first30
    test("orderBy: single field shorthand", 1, function () {
        var requestUrl = "/api/user?orderBy=" + encodeURIComponent("lastName");

        this.setServerData(requestUrl);

        users = new UserCollection();
        users
            .orderBy('lastName')
            .fetch({
                complete: function () {
                    equal(requestUrl, this.url);
                }
            });

        server.respond();
    });

    // Dan has completed interface on first30
    test("orderBy: single field ascending", 1, function () {
        var requestUrl = "/api/user?orderBy=" + encodeURIComponent("lastName");

        this.setServerData(requestUrl);

        users = new UserCollection();
        users
            .orderBy({
                lastName: 'asc'
            })
            .fetch({
                complete: function () {
                    equal(requestUrl, this.url);
                }
            });

        server.respond();
    });

    // Dan has completed interface on first30
    test("orderBy: single field descending", 1, function () {
        var requestUrl = "/api/user?orderBy=" + encodeURIComponent("-lastName");

        this.setServerData(requestUrl);

        users = new UserCollection();
        users
            .orderBy({
                lastName: 'desc'
            })
            .fetch({
                complete: function () {
                    equal(requestUrl, this.url);
                }
            });

        server.respond();
    });

    //TODO: Figure out order of importance for sort fields
    test("orderBy: multiple fields", 1, function () {
        var requestUrl = "/api/user?orderBy=" + encodeURIComponent("-lastName,firstName");

        this.setServerData(requestUrl);

        users = new UserCollection();
        users
            .orderBy({
                lastName: 'desc'
            })
            .orderBy({
                firstName: 'asc'
            })
            .fetch({
                complete: function () {
                    equal(requestUrl, this.url);
                }
            });

        server.respond();
    });

})(window.Backbone, window._, window.querybuilder, window.earthlingDataProvider);
