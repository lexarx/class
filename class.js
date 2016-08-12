/*
 * Class implementation with classical inheritance and super method.
 *
 * Usage:
 *
 * Class.extend(prototype, staticProperties)
 * Class.extend(prototype)
 *
 * Example:
 *
 * var Parent = Class.extend({
 *     constructor: function(name) {
 *         this.name = name;
 *     },
 *     
 *     getName: function() {
 *         return this.name;
 *     }
 * });
 *
 * var Child = Parent.extend({
 *     getName: function() {
 *         return 'child_' + this.super();
 *     }
 * }, {
 *     extra: 1
 * });
 *
 * var child = new Child('name');
 * child.getName(); // 'child_name'
 * Child.extra // 1
 */

var superRegExp = /\bsuper\b/;
var createObject = function() {};

/**
 * Creates a new function that defines super method in the original function.
 * @param {Function} func
 * @param {Function} superFunc
 * @returns {Function}
 */
function defineSuper(func, superFunc) {
	return function() {
		var tmp = this.super;
		this.super = superFunc;
		var ret;
		try {
			ret = func.apply(this, arguments);
		} finally {
			this.super = tmp;
		}
		return ret;
	};
};

/**
 * Class with extend capabilities.
 * @class Class
 */
var Class = function() {};
var BaseClass = Class;

/**
 * Extends class with new methods and properties and returns a new class.
 * @param {Object} [prototype]
 * @param {Object} [staticProperties]
 * @returns {Function}
 */
Class.extend = function(prototype, staticProperties) {
	var Class = function() {
		if (typeof this.constructor === 'function') {
			this.constructor.apply(this, arguments);
		}
	};
	createObject.prototype = this.prototype;
	Class.prototype = new createObject();
	if (prototype !== undefined && prototype !== null) {
		for (var name in prototype) {
			Class.prototype[name] = (typeof prototype[name] === 'function' &&
				superRegExp.test(prototype[name])) ?
				defineSuper(prototype[name], this.prototype[name]) :
				prototype[name];
		}
	}
	Class.extend = BaseClass.extend;
	if (staticProperties !== undefined && staticProperties !== null) {
		for (var name in staticProperties) {
			Class[name] = staticProperties[name];
		}
	}
	return Class;
};

/**
 * Extends constructor with new methods and properties and returns a new class.
 * @param {Function} constructor
 * @param {Object} [prototype]
 * @param {Object} [staticProperties]
 * @returns {Function}
 */
Class.extendConstructor = function(constructor, prototype, staticProperties) {
	return Class.extend.call(constructor, prototype, staticProperties);
};
	
module.exports = Class;