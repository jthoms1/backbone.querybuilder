[![Build
Status](https://travis-ci.org/jthoms1/backbone.querybuilder.png?branch=master)](https://travis-ci.org/jthoms1/backbone.querybuilder)


backbone.includes
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