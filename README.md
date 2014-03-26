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
// Fetch User model and include related role and organization
var user = new User({'id': 1});
user.includeRelated('role', 'organization').fetch();
```

```JavaScript
// Fetch User models when user's role is editor or author
var users = new UserCollection();
users.when({
    role: ['editor', 'author']
}).fetch();
```

```JavaScript
// Fetch 10 User models that are on the 
var users = new UserCollection();
users.limit(10).skip(2).fetch();
```

```JavaScript
var users = new UserCollection();
users.orderBy('lastName').fetch();
```