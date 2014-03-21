[![Build
Status](https://travis-ci.org/jthoms1/backbone.querybuilder.png?branch=master)](https://travis-ci.org/jthoms1/backbone.querybuilder)


backbone.querybuilder
=================

Simple library that helps manage api interactions with web services.

Usage
==================
```JavaScript
/*
 * Create model, define expected sub models/collections that will be included.
 * Passing reference to the submodels collections always backbone.includes to choose
 * whether a model or collection should be used based on whether the attribute is a
 * collection or an object.
 */
var user = new User();
user.limit(10).fetch();
```

```JavaScript
var user = new User({'id': 1});
user.include('role', 'organization').fetch();
```

```JavaScript
var user = new User({'id': 1});
user.where({
    role: ['editor', 'author']
}).fetch();
```

```JavaScript
var users = new UserCollection();
users.limit(10).skip(2).fetch();
```

```JavaScript
var users = new UserCollection();
users.orderBy('lastName').fetch();
```