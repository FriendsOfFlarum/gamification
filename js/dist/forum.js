module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./forum.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./forum.js":
/*!******************!*\
  !*** ./forum.js ***!
  \******************/
/*! no static exports found */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/common */ "./src/common/index.js");
/* harmony import */ var _src_common__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_src_common__WEBPACK_IMPORTED_MODULE_0__);
/* harmony reexport (unknown) */ for(var __WEBPACK_IMPORT_KEY__ in _src_common__WEBPACK_IMPORTED_MODULE_0__) if(__WEBPACK_IMPORT_KEY__ !== 'default') (function(key) { __webpack_require__.d(__webpack_exports__, key, function() { return _src_common__WEBPACK_IMPORTED_MODULE_0__[key]; }) }(__WEBPACK_IMPORT_KEY__));
/* harmony import */ var _src_forum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/forum */ "./src/forum/index.js");
/* empty/unused harmony star reexport *//*
 * This file is part of Flarum.
 *
 * (c) Toby Zerner <toby.zerner@gmail.com>
 *
 * For the full copyright and license information, please view the LICENSE
 * file that was distributed with this source code.
 */



/***/ }),

/***/ "./node_modules/@babel/runtime/core-js/object/create.js":
/*!**************************************************************!*\
  !*** ./node_modules/@babel/runtime/core-js/object/create.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js/library/fn/object/create */ "./node_modules/core-js/library/fn/object/create.js");

/***/ }),

/***/ "./node_modules/@babel/runtime/core-js/object/keys.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/core-js/object/keys.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(/*! core-js/library/fn/object/keys */ "./node_modules/core-js/library/fn/object/keys.js");

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/es6/inheritsLoose.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/es6/inheritsLoose.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _inheritsLoose; });
/* harmony import */ var _core_js_object_create__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../core-js/object/create */ "./node_modules/@babel/runtime/core-js/object/create.js");
/* harmony import */ var _core_js_object_create__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_core_js_object_create__WEBPACK_IMPORTED_MODULE_0__);

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = _core_js_object_create__WEBPACK_IMPORTED_MODULE_0___default()(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

/***/ }),

/***/ "./node_modules/core-js/library/fn/object/create.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/fn/object/create.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.create */ "./node_modules/core-js/library/modules/es6.object.create.js");
var $Object = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Object;
module.exports = function create(P, D) {
  return $Object.create(P, D);
};


/***/ }),

/***/ "./node_modules/core-js/library/fn/object/keys.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/library/fn/object/keys.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! ../../modules/es6.object.keys */ "./node_modules/core-js/library/modules/es6.object.keys.js");
module.exports = __webpack_require__(/*! ../../modules/_core */ "./node_modules/core-js/library/modules/_core.js").Object.keys;


/***/ }),

/***/ "./node_modules/core-js/library/modules/_a-function.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_a-function.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_an-object.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_an-object.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/library/modules/_is-object.js");
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_array-includes.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_array-includes.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/library/modules/_to-iobject.js");
var toLength = __webpack_require__(/*! ./_to-length */ "./node_modules/core-js/library/modules/_to-length.js");
var toAbsoluteIndex = __webpack_require__(/*! ./_to-absolute-index */ "./node_modules/core-js/library/modules/_to-absolute-index.js");
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_cof.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_cof.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_core.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_core.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.7' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),

/***/ "./node_modules/core-js/library/modules/_ctx.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_ctx.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(/*! ./_a-function */ "./node_modules/core-js/library/modules/_a-function.js");
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_defined.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_defined.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_descriptors.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_descriptors.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(/*! ./_fails */ "./node_modules/core-js/library/modules/_fails.js")(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "./node_modules/core-js/library/modules/_dom-create.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_dom-create.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/library/modules/_is-object.js");
var document = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js").document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_enum-bug-keys.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_enum-bug-keys.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),

/***/ "./node_modules/core-js/library/modules/_export.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_export.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js");
var core = __webpack_require__(/*! ./_core */ "./node_modules/core-js/library/modules/_core.js");
var ctx = __webpack_require__(/*! ./_ctx */ "./node_modules/core-js/library/modules/_ctx.js");
var hide = __webpack_require__(/*! ./_hide */ "./node_modules/core-js/library/modules/_hide.js");
var has = __webpack_require__(/*! ./_has */ "./node_modules/core-js/library/modules/_has.js");
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && has(exports, key)) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),

/***/ "./node_modules/core-js/library/modules/_fails.js":
/*!********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_fails.js ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_global.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_global.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),

/***/ "./node_modules/core-js/library/modules/_has.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_has.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_hide.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_hide.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/library/modules/_object-dp.js");
var createDesc = __webpack_require__(/*! ./_property-desc */ "./node_modules/core-js/library/modules/_property-desc.js");
module.exports = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/library/modules/_descriptors.js") ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_html.js":
/*!*******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_html.js ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js").document;
module.exports = document && document.documentElement;


/***/ }),

/***/ "./node_modules/core-js/library/modules/_ie8-dom-define.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_ie8-dom-define.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/library/modules/_descriptors.js") && !__webpack_require__(/*! ./_fails */ "./node_modules/core-js/library/modules/_fails.js")(function () {
  return Object.defineProperty(__webpack_require__(/*! ./_dom-create */ "./node_modules/core-js/library/modules/_dom-create.js")('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),

/***/ "./node_modules/core-js/library/modules/_iobject.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_iobject.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(/*! ./_cof */ "./node_modules/core-js/library/modules/_cof.js");
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_is-object.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_is-object.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_library.js":
/*!**********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_library.js ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-create.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-create.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/library/modules/_an-object.js");
var dPs = __webpack_require__(/*! ./_object-dps */ "./node_modules/core-js/library/modules/_object-dps.js");
var enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ "./node_modules/core-js/library/modules/_enum-bug-keys.js");
var IE_PROTO = __webpack_require__(/*! ./_shared-key */ "./node_modules/core-js/library/modules/_shared-key.js")('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(/*! ./_dom-create */ "./node_modules/core-js/library/modules/_dom-create.js")('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(/*! ./_html */ "./node_modules/core-js/library/modules/_html.js").appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-dp.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-dp.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/library/modules/_an-object.js");
var IE8_DOM_DEFINE = __webpack_require__(/*! ./_ie8-dom-define */ "./node_modules/core-js/library/modules/_ie8-dom-define.js");
var toPrimitive = __webpack_require__(/*! ./_to-primitive */ "./node_modules/core-js/library/modules/_to-primitive.js");
var dP = Object.defineProperty;

exports.f = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/library/modules/_descriptors.js") ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-dps.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-dps.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(/*! ./_object-dp */ "./node_modules/core-js/library/modules/_object-dp.js");
var anObject = __webpack_require__(/*! ./_an-object */ "./node_modules/core-js/library/modules/_an-object.js");
var getKeys = __webpack_require__(/*! ./_object-keys */ "./node_modules/core-js/library/modules/_object-keys.js");

module.exports = __webpack_require__(/*! ./_descriptors */ "./node_modules/core-js/library/modules/_descriptors.js") ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-keys-internal.js":
/*!***********************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-keys-internal.js ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(/*! ./_has */ "./node_modules/core-js/library/modules/_has.js");
var toIObject = __webpack_require__(/*! ./_to-iobject */ "./node_modules/core-js/library/modules/_to-iobject.js");
var arrayIndexOf = __webpack_require__(/*! ./_array-includes */ "./node_modules/core-js/library/modules/_array-includes.js")(false);
var IE_PROTO = __webpack_require__(/*! ./_shared-key */ "./node_modules/core-js/library/modules/_shared-key.js")('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-keys.js":
/*!**************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-keys.js ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(/*! ./_object-keys-internal */ "./node_modules/core-js/library/modules/_object-keys-internal.js");
var enumBugKeys = __webpack_require__(/*! ./_enum-bug-keys */ "./node_modules/core-js/library/modules/_enum-bug-keys.js");

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_object-sap.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_object-sap.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js");
var core = __webpack_require__(/*! ./_core */ "./node_modules/core-js/library/modules/_core.js");
var fails = __webpack_require__(/*! ./_fails */ "./node_modules/core-js/library/modules/_fails.js");
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_property-desc.js":
/*!****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_property-desc.js ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_shared-key.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_shared-key.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(/*! ./_shared */ "./node_modules/core-js/library/modules/_shared.js")('keys');
var uid = __webpack_require__(/*! ./_uid */ "./node_modules/core-js/library/modules/_uid.js");
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_shared.js":
/*!*********************************************************!*\
  !*** ./node_modules/core-js/library/modules/_shared.js ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var core = __webpack_require__(/*! ./_core */ "./node_modules/core-js/library/modules/_core.js");
var global = __webpack_require__(/*! ./_global */ "./node_modules/core-js/library/modules/_global.js");
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});

(module.exports = function (key, value) {
  return store[key] || (store[key] = value !== undefined ? value : {});
})('versions', []).push({
  version: core.version,
  mode: __webpack_require__(/*! ./_library */ "./node_modules/core-js/library/modules/_library.js") ? 'pure' : 'global',
  copyright: '© 2018 Denis Pushkarev (zloirock.ru)'
});


/***/ }),

/***/ "./node_modules/core-js/library/modules/_to-absolute-index.js":
/*!********************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_to-absolute-index.js ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/core-js/library/modules/_to-integer.js");
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_to-integer.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_to-integer.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_to-iobject.js":
/*!*************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_to-iobject.js ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(/*! ./_iobject */ "./node_modules/core-js/library/modules/_iobject.js");
var defined = __webpack_require__(/*! ./_defined */ "./node_modules/core-js/library/modules/_defined.js");
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_to-length.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_to-length.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(/*! ./_to-integer */ "./node_modules/core-js/library/modules/_to-integer.js");
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_to-object.js":
/*!************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_to-object.js ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(/*! ./_defined */ "./node_modules/core-js/library/modules/_defined.js");
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_to-primitive.js":
/*!***************************************************************!*\
  !*** ./node_modules/core-js/library/modules/_to-primitive.js ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(/*! ./_is-object */ "./node_modules/core-js/library/modules/_is-object.js");
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/_uid.js":
/*!******************************************************!*\
  !*** ./node_modules/core-js/library/modules/_uid.js ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.object.create.js":
/*!*******************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.object.create.js ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(/*! ./_export */ "./node_modules/core-js/library/modules/_export.js");
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: __webpack_require__(/*! ./_object-create */ "./node_modules/core-js/library/modules/_object-create.js") });


/***/ }),

/***/ "./node_modules/core-js/library/modules/es6.object.keys.js":
/*!*****************************************************************!*\
  !*** ./node_modules/core-js/library/modules/es6.object.keys.js ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 Object.keys(O)
var toObject = __webpack_require__(/*! ./_to-object */ "./node_modules/core-js/library/modules/_to-object.js");
var $keys = __webpack_require__(/*! ./_object-keys */ "./node_modules/core-js/library/modules/_object-keys.js");

__webpack_require__(/*! ./_object-sap */ "./node_modules/core-js/library/modules/_object-sap.js")('keys', function () {
  return function keys(it) {
    return $keys(toObject(it));
  };
});


/***/ }),

/***/ "./src/common/helpers/rankLabel.js":
/*!*****************************************!*\
  !*** ./src/common/helpers/rankLabel.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return rankLabel; });
function rankLabel(rank, attrs) {
  if (attrs === void 0) {
    attrs = {};
  }

  attrs.style = attrs.style || {};
  attrs.className = 'rankLabel ' + (attrs.className || '');
  var color = rank.color();
  attrs.style.backgroundColor = attrs.style.color = color;
  attrs.className += ' colored';
  return m('span', attrs, m("span", {
    className: "rankLabel-text"
  }, rank.name()));
}

/***/ }),

/***/ "./src/common/index.js":
/*!*****************************!*\
  !*** ./src/common/index.js ***!
  \*****************************/
/*! no static exports found */
/***/ (function(module, exports) {



/***/ }),

/***/ "./src/common/models/Rank.js":
/*!***********************************!*\
  !*** ./src/common/models/Rank.js ***!
  \***********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return Rank; });
/* harmony import */ var _babel_runtime_helpers_es6_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/es6/inheritsLoose */ "./node_modules/@babel/runtime/helpers/es6/inheritsLoose.js");
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/Model */ "flarum/Model");
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_Model__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/utils/mixin */ "flarum/utils/mixin");
/* harmony import */ var flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2__);




var Rank =
/*#__PURE__*/
function (_mixin) {
  Object(_babel_runtime_helpers_es6_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Rank, _mixin);

  function Rank() {
    return _mixin.apply(this, arguments) || this;
  }

  return Rank;
}(flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2___default()(flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a, {
  points: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('points'),
  name: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('name'),
  color: flarum_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('color')
}));



/***/ }),

/***/ "./src/forum/components/AddAttributes.js":
/*!***********************************************!*\
  !*** ./src/forum/components/AddAttributes.js ***!
  \***********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_helpers_avatar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/helpers/avatar */ "flarum/helpers/avatar");
/* harmony import */ var flarum_helpers_avatar__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_helpers_avatar__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_AvatarEditor__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/AvatarEditor */ "flarum/components/AvatarEditor");
/* harmony import */ var flarum_components_AvatarEditor__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_AvatarEditor__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_helpers_username__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/helpers/username */ "flarum/helpers/username");
/* harmony import */ var flarum_helpers_username__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_helpers_username__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_models_Discussion__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/models/Discussion */ "flarum/models/Discussion");
/* harmony import */ var flarum_models_Discussion__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_models_Discussion__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_components_Dropdown__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/components/Dropdown */ "flarum/components/Dropdown");
/* harmony import */ var flarum_components_Dropdown__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Dropdown__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_helpers_listItems__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/helpers/listItems */ "flarum/helpers/listItems");
/* harmony import */ var flarum_helpers_listItems__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_helpers_listItems__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/Model */ "flarum/Model");
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_Model__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var flarum_models_Post__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/models/Post */ "flarum/models/Post");
/* harmony import */ var flarum_models_Post__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_models_Post__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var flarum_components_PostUser__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! flarum/components/PostUser */ "flarum/components/PostUser");
/* harmony import */ var flarum_components_PostUser__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(flarum_components_PostUser__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var flarum_models_User__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! flarum/models/User */ "flarum/models/User");
/* harmony import */ var flarum_models_User__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(flarum_models_User__WEBPACK_IMPORTED_MODULE_10__);
/* harmony import */ var flarum_components_UserCard__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! flarum/components/UserCard */ "flarum/components/UserCard");
/* harmony import */ var flarum_components_UserCard__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(flarum_components_UserCard__WEBPACK_IMPORTED_MODULE_11__);
/* harmony import */ var flarum_utils_UserControls__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! flarum/utils/UserControls */ "flarum/utils/UserControls");
/* harmony import */ var flarum_utils_UserControls__WEBPACK_IMPORTED_MODULE_12___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_UserControls__WEBPACK_IMPORTED_MODULE_12__);
/* harmony import */ var flarum_helpers_userOnline__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! flarum/helpers/userOnline */ "flarum/helpers/userOnline");
/* harmony import */ var flarum_helpers_userOnline__WEBPACK_IMPORTED_MODULE_13___default = /*#__PURE__*/__webpack_require__.n(flarum_helpers_userOnline__WEBPACK_IMPORTED_MODULE_13__);
/* harmony import */ var _common_helpers_rankLabel__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ../../common/helpers/rankLabel */ "./src/common/helpers/rankLabel.js");















/* harmony default export */ __webpack_exports__["default"] = (function () {
  flarum_models_Discussion__WEBPACK_IMPORTED_MODULE_4___default.a.prototype.canVote = flarum_Model__WEBPACK_IMPORTED_MODULE_7___default.a.attribute('canVote');
  flarum_models_Discussion__WEBPACK_IMPORTED_MODULE_4___default.a.prototype.canSeeVotes = flarum_Model__WEBPACK_IMPORTED_MODULE_7___default.a.attribute('canSeeVotes');
  flarum_models_Discussion__WEBPACK_IMPORTED_MODULE_4___default.a.prototype.votes = flarum_Model__WEBPACK_IMPORTED_MODULE_7___default.a.attribute('votes');
  flarum_models_User__WEBPACK_IMPORTED_MODULE_10___default.a.prototype.points = flarum_Model__WEBPACK_IMPORTED_MODULE_7___default.a.attribute('points');
  flarum_models_User__WEBPACK_IMPORTED_MODULE_10___default.a.prototype.ranks = flarum_Model__WEBPACK_IMPORTED_MODULE_7___default.a.hasMany('ranks');
  flarum_models_Post__WEBPACK_IMPORTED_MODULE_8___default.a.prototype.upvotes = flarum_Model__WEBPACK_IMPORTED_MODULE_7___default.a.hasMany('upvotes');
  flarum_models_Post__WEBPACK_IMPORTED_MODULE_8___default.a.prototype.downvotes = flarum_Model__WEBPACK_IMPORTED_MODULE_7___default.a.hasMany('downvotes');
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_components_UserCard__WEBPACK_IMPORTED_MODULE_11___default.a.prototype, 'infoItems', function (items, user) {
    var points = '';

    if (points == 0) {
      points = '0';
    }

    if (app.forum.attribute('PointsPlaceholder')) {
      points = app.forum.attribute('PointsPlaceholder').replace('{points}', this.props.user.data.attributes.Points);
    } else {
      points = app.translator.trans('reflar-gamification.forum.user.points', {
        points: this.props.user.data.attributes.Points
      });
    }

    items.add('points', points);
  });

  flarum_components_UserCard__WEBPACK_IMPORTED_MODULE_11___default.a.prototype.view = function () {
    var user = this.props.user;
    var controls = flarum_utils_UserControls__WEBPACK_IMPORTED_MODULE_12___default.a.controls(user, this).toArray();
    var color = user.color();
    var badges = user.badges().toArray();
    return m("div", {
      className: 'UserCard ' + (this.props.className || ''),
      style: color ? {
        backgroundColor: color
      } : ''
    }, m("div", {
      className: "darkenBackground"
    }, m("div", {
      className: "container"
    }, controls.length ? flarum_components_Dropdown__WEBPACK_IMPORTED_MODULE_5___default.a.component({
      children: controls,
      className: 'UserCard-controls App-primaryControl',
      menuClassName: 'Dropdown-menu--right',
      buttonClassName: this.props.controlsButtonClassName,
      label: app.translator.trans('core.forum.user_controls.button'),
      icon: 'fas fa-ellipsis-v'
    }) : '', m("div", {
      className: "UserCard-profile"
    }, m("h2", {
      className: "UserCard-identity"
    }, this.props.editable ? [flarum_components_AvatarEditor__WEBPACK_IMPORTED_MODULE_2___default.a.component({
      user: user,
      className: 'UserCard-avatar'
    }), flarum_helpers_username__WEBPACK_IMPORTED_MODULE_3___default()(user)] : m("a", {
      href: app.route.user(user),
      config: m.route
    }, m("div", {
      className: "UserCard-avatar"
    }, flarum_helpers_avatar__WEBPACK_IMPORTED_MODULE_1___default()(user)), flarum_helpers_username__WEBPACK_IMPORTED_MODULE_3___default()(user))), badges.length ? m("ul", {
      className: "UserCard-badges badges"
    }, flarum_helpers_listItems__WEBPACK_IMPORTED_MODULE_6___default()(badges), user.ranks() !== false ? user.ranks().reverse().map(function (rank, i) {
      if (i >= app.forum.attribute('ranksAmt') && app.forum.attribute('ranksAmt') !== null) {} else {
        return m("li", {
          className: "User-Rank"
        }, Object(_common_helpers_rankLabel__WEBPACK_IMPORTED_MODULE_14__["default"])(rank));
      }
    }) : '') : '', m("ul", {
      className: "UserCard-info"
    }, flarum_helpers_listItems__WEBPACK_IMPORTED_MODULE_6___default()(this.infoItems().toArray()))))));
  };

  flarum_components_PostUser__WEBPACK_IMPORTED_MODULE_9___default.a.prototype.view = function () {
    var post = this.props.post;
    var user = post.user();

    if (!user) {
      return m("div", {
        className: "PostUser"
      }, m("h3", null, flarum_helpers_avatar__WEBPACK_IMPORTED_MODULE_1___default()(user, {
        className: 'PostUser-avatar'
      }), " ", flarum_helpers_username__WEBPACK_IMPORTED_MODULE_3___default()(user), " ", rank[0]));
    }

    var card = '';

    if (!post.isHidden() && this.cardVisible) {
      card = flarum_components_UserCard__WEBPACK_IMPORTED_MODULE_11___default.a.component({
        user: user,
        className: 'UserCard--popover',
        controlsButtonClassName: 'Button Button--icon Button--flat'
      });
    }

    return m("div", {
      className: "PostUser"
    }, flarum_helpers_userOnline__WEBPACK_IMPORTED_MODULE_13___default()(user), m("h3", null, m("a", {
      href: app.route.user(user),
      config: m.route
    }, flarum_helpers_avatar__WEBPACK_IMPORTED_MODULE_1___default()(user, {
      className: 'PostUser-avatar'
    }), ' ', flarum_helpers_username__WEBPACK_IMPORTED_MODULE_3___default()(user)), user.ranks().reverse().map(function (rank, i) {
      if (i >= app.forum.attribute('ranksAmt') && app.forum.attribute('ranksAmt') !== null) {} else {
        return m("span", {
          className: "Post-Rank"
        }, Object(_common_helpers_rankLabel__WEBPACK_IMPORTED_MODULE_14__["default"])(rank));
      }
    })), m("ul", {
      className: "PostUser-badges badges"
    }, flarum_helpers_listItems__WEBPACK_IMPORTED_MODULE_6___default()(user.badges().toArray())), card);
  };
});

/***/ }),

/***/ "./src/forum/components/AddHotnessSort.js":
/*!************************************************!*\
  !*** ./src/forum/components/AddHotnessSort.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/core-js/object/keys */ "./node_modules/@babel/runtime/core-js/object/keys.js");
/* harmony import */ var _babel_runtime_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(_babel_runtime_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_IndexPage__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/IndexPage */ "flarum/components/IndexPage");
/* harmony import */ var flarum_components_IndexPage__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_IndexPage__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_utils_ItemList__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/utils/ItemList */ "flarum/utils/ItemList");
/* harmony import */ var flarum_utils_ItemList__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_ItemList__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_components_DiscussionList__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/components/DiscussionList */ "flarum/components/DiscussionList");
/* harmony import */ var flarum_components_DiscussionList__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_components_DiscussionList__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_components_Dropdown__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/components/Dropdown */ "flarum/components/Dropdown");
/* harmony import */ var flarum_components_Dropdown__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Dropdown__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/components/Button */ "flarum/components/Button");
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Button__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_components_LinkButton__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/components/LinkButton */ "flarum/components/LinkButton");
/* harmony import */ var flarum_components_LinkButton__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_components_LinkButton__WEBPACK_IMPORTED_MODULE_7__);








/* harmony default export */ __webpack_exports__["default"] = (function () {
  flarum_components_IndexPage__WEBPACK_IMPORTED_MODULE_2___default.a.prototype.viewItems = function () {
    var _this = this;

    var items = new flarum_utils_ItemList__WEBPACK_IMPORTED_MODULE_3___default.a();
    var sortMap = app.cache.discussionList.sortMap();
    var sortOptions = {};

    for (var i in sortMap) {
      sortOptions[i] = app.translator.trans('core.forum.index_sort.' + i + '_button');
    }

    var dropDownLabel = sortOptions[this.params().sort] || _babel_runtime_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0___default()(sortMap).map(function (key) {
      return sortOptions[key];
    })[0];

    if (/^.*?\/hot/.test(m.route())) {
      dropDownLabel = app.translator.trans('core.forum.index_sort.hot_button');
    }

    items.add('sort', flarum_components_Dropdown__WEBPACK_IMPORTED_MODULE_5___default.a.component({
      buttonClassName: 'Button',
      label: dropDownLabel,
      children: _babel_runtime_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0___default()(sortOptions).map(function (value) {
        var label = sortOptions[value];
        var active = (_this.params().sort || _babel_runtime_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0___default()(sortMap)[0]) === value;

        if (/^.*?\/hot/.test(m.route()) && value === 'hot') {
          active = true;
        }

        if (/^.*?\/hot/.test(m.route()) && value === 'latest') {
          active = false;
          m.redraw();
        }

        return flarum_components_Button__WEBPACK_IMPORTED_MODULE_6___default.a.component({
          children: label,
          icon: active ? 'fas fa-check' : true,
          onclick: _this.changeSort.bind(_this, value),
          active: active
        });
      })
    }));
    return items;
  };

  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_1__["extend"])(flarum_components_IndexPage__WEBPACK_IMPORTED_MODULE_2___default.a.prototype, 'navItems', function (items) {
    items.add('rankings', flarum_components_LinkButton__WEBPACK_IMPORTED_MODULE_7___default.a.component({
      href: app.route('rankings'),
      children: app.translator.trans('reflar-gamification.forum.nav.name'),
      icon: 'fas fa-trophy'
    }), 80);
  });

  flarum_components_IndexPage__WEBPACK_IMPORTED_MODULE_2___default.a.prototype.changeSort = function (sort) {
    var params = this.params();

    if (sort === 'hot') {
      m.route('/');
      m.route(m.route() + 'hot');
    } else {
      if (sort === _babel_runtime_core_js_object_keys__WEBPACK_IMPORTED_MODULE_0___default()(app.cache.discussionList.sortMap())[0]) {
        delete params.sort;
      } else {
        params.sort = sort;
      }

      if (params.filter === 'hot') {
        delete params.filter;
      }

      m.route(app.route('index', params));
    }
  };

  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_1__["extend"])(flarum_components_DiscussionList__WEBPACK_IMPORTED_MODULE_4___default.a.prototype, 'sortMap', function (map) {
    map.hot = 'hot';
  });
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_1__["extend"])(flarum_components_DiscussionList__WEBPACK_IMPORTED_MODULE_4___default.a.prototype, 'requestParams', function (params) {
    if (this.props.params.filter === 'hot') {
      params.filter.q = ' is:hot';
    }
  });
});

/***/ }),

/***/ "./src/forum/components/AddVoteButtons.js":
/*!************************************************!*\
  !*** ./src/forum/components/AddVoteButtons.js ***!
  \************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/app */ "flarum/app");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/Button */ "flarum/components/Button");
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Button__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_components_LogInModal__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/components/LogInModal */ "flarum/components/LogInModal");
/* harmony import */ var flarum_components_LogInModal__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_components_LogInModal__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_components_CommentPost__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/components/CommentPost */ "flarum/components/CommentPost");
/* harmony import */ var flarum_components_CommentPost__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_components_CommentPost__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_utils_PostControls__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/utils/PostControls */ "flarum/utils/PostControls");
/* harmony import */ var flarum_utils_PostControls__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_PostControls__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _VotesModal__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./VotesModal */ "./src/forum/components/VotesModal.js");







/* harmony default export */ __webpack_exports__["default"] = (function () {
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_components_CommentPost__WEBPACK_IMPORTED_MODULE_4___default.a.prototype, 'config', function (x, isInitialized, context) {
    var _this = this;

    if (isInitialized) return;

    if (flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.pusher) {
      flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.pusher.then(function (channels) {
        channels.main.bind('newVote', function (data) {
          var userId = parseInt(data.userId);
          if (userId == flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.session.user.id()) return;
          m.startComputation();

          if (_this.postId() == data.postId) {
            var upData = _this.upvotedata();

            var downData = _this.downvotedata();

            switch (data.before) {
              case 'up':
                upData = _this.removeVote(upData, userId);
                break;

              case 'down':
                downData = _this.removeVote(downData, userId);
                break;
            }

            switch (data.after) {
              case 'up':
                upData.unshift({
                  type: 'users',
                  id: userId
                });
                break;

              case 'down':
                downData.unshift({
                  type: 'users',
                  id: userId
                });
                break;

              case 'none':
                downData = _this.removeVote(downData, userId);
                upData = _this.removeVote(upData, userId);
                break;
            }

            _this.downvotedata(downData);

            _this.upvotedata(upData);

            m.redraw.strategy('all');
          }

          m.endComputation();
        });
        Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(context, 'onunload', function () {
          return channels.main.unbind('newVote');
        });
      });
    }
  });
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_utils_PostControls__WEBPACK_IMPORTED_MODULE_5___default.a, 'moderationControls', function (items, post) {
    if (post.discussion().canSeeVotes()) {
      items.add('viewVotes', [m(flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default.a, {
        icon: 'fas fa-thumbs-up',
        onclick: function onclick() {
          flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.modal.show(new _VotesModal__WEBPACK_IMPORTED_MODULE_6__["default"]({
            post: post
          }));
        }
      }, flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.translator.trans('reflar-gamification.forum.mod_item'))]);
    }
  });
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_components_CommentPost__WEBPACK_IMPORTED_MODULE_4___default.a.prototype, 'actionItems', function (items) {
    var post = this.props.post;
    this.postId = m.prop(post.data.id);
    this.downvotedata = m.prop(post.data.relationships.downvotes.data);
    this.upvotedata = m.prop(post.data.relationships.upvotes.data);
    var isUpvoted = flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.session.user && post.upvotes().some(function (user) {
      return user === flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.session.user;
    });
    var isDownvoted = flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.session.user && post.downvotes().some(function (user) {
      return user === flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.session.user;
    });

    if (!flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.session.user) {
      isDownvoted = false;
      isUpvoted = false;
    }

    var icon = flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.forum.attribute('IconName');

    if (icon === null || icon === '') {
      icon = 'thumbs';
    }

    this.removeVote = function (data, userId) {
      data.some(function (vote, i) {
        if (vote.id == userId) {
          data.splice(i, 1);
        }
      });
      return data;
    };

    items.add('upvote', flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default.a.component({
      icon: 'fas fa-' + icon + '-up',
      className: 'Post-vote Post-upvote',
      style: isUpvoted !== false ? 'color:' + flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.forum.data.attributes.themePrimaryColor : 'color:',
      disabled: !post.discussion().canVote(),
      onclick: function onclick() {
        if (!flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.session.user) {
          flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.modal.show(new flarum_components_LogInModal__WEBPACK_IMPORTED_MODULE_3___default.a());
          return;
        }

        if (!post.discussion().canVote()) return;
        var upData = post.data.relationships.upvotes.data;
        var downData = post.data.relationships.downvotes.data;
        isUpvoted = !isUpvoted;
        isDownvoted = false;
        post.save([isUpvoted, isDownvoted, 'vote']);
        upData.some(function (upvote, i) {
          if (upvote.id === flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.session.user.id()) {
            upData.splice(i, 1);
            return true;
          }
        });
        downData.some(function (downvote, i) {
          if (downvote.id === flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.session.user.id()) {
            downData.splice(i, 1);
            return true;
          }
        });

        if (isUpvoted) {
          upData.unshift({
            type: 'users',
            id: flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.session.user.id()
          });
        }
      }
    }), 3);
    items.add('points', m("label", {
      className: "Post-points"
    }, this.upvotedata().length - this.downvotedata().length), 2);
    items.add('downvote', flarum_components_Button__WEBPACK_IMPORTED_MODULE_2___default.a.component({
      icon: 'fas fa-' + icon + '-down',
      className: 'Post-vote Post-downvote',
      style: isDownvoted !== false ? 'color:' + flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.forum.data.attributes.themePrimaryColor : '',
      disabled: !post.discussion().canVote(),
      onclick: function onclick() {
        if (!flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.session.user) {
          flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.modal.show(new flarum_components_LogInModal__WEBPACK_IMPORTED_MODULE_3___default.a());
          return;
        }

        if (!post.discussion().canVote()) return;
        var upData = post.data.relationships.upvotes.data;
        var downData = post.data.relationships.downvotes.data;
        isDownvoted = !isDownvoted;
        isUpvoted = false;
        post.save([isUpvoted, isDownvoted, 'vote']);
        upData.some(function (upvote, i) {
          if (upvote.id === flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.session.user.id()) {
            upData.splice(i, 1);
            return true;
          }
        });
        downData.some(function (downvote, i) {
          if (downvote.id === flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.session.user.id()) {
            downData.splice(i, 1);
            return true;
          }
        });

        if (isDownvoted) {
          downData.unshift({
            type: 'users',
            id: flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.session.user.id()
          });
        }
      }
    }), 1);
  });
});

/***/ }),

/***/ "./src/forum/components/RankingsPage.js":
/*!**********************************************!*\
  !*** ./src/forum/components/RankingsPage.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return RankingsPage; });
/* harmony import */ var _babel_runtime_helpers_es6_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/es6/inheritsLoose */ "./node_modules/@babel/runtime/helpers/es6/inheritsLoose.js");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_helpers_avatar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/helpers/avatar */ "flarum/helpers/avatar");
/* harmony import */ var flarum_helpers_avatar__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_helpers_avatar__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_components_Page__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/components/Page */ "flarum/components/Page");
/* harmony import */ var flarum_components_Page__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Page__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_components_IndexPage__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/components/IndexPage */ "flarum/components/IndexPage");
/* harmony import */ var flarum_components_IndexPage__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_components_IndexPage__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/components/Button */ "flarum/components/Button");
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Button__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_utils_ItemList__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/utils/ItemList */ "flarum/utils/ItemList");
/* harmony import */ var flarum_utils_ItemList__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_ItemList__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_components_LogInModal__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/components/LogInModal */ "flarum/components/LogInModal");
/* harmony import */ var flarum_components_LogInModal__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_components_LogInModal__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/components/LoadingIndicator */ "flarum/components/LoadingIndicator");
/* harmony import */ var flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var flarum_helpers_listItems__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! flarum/helpers/listItems */ "flarum/helpers/listItems");
/* harmony import */ var flarum_helpers_listItems__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(flarum_helpers_listItems__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var flarum_helpers_username__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! flarum/helpers/username */ "flarum/helpers/username");
/* harmony import */ var flarum_helpers_username__WEBPACK_IMPORTED_MODULE_10___default = /*#__PURE__*/__webpack_require__.n(flarum_helpers_username__WEBPACK_IMPORTED_MODULE_10__);












var RankingsPage =
/*#__PURE__*/
function (_Page) {
  Object(_babel_runtime_helpers_es6_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(RankingsPage, _Page);

  function RankingsPage() {
    return _Page.apply(this, arguments) || this;
  }

  var _proto = RankingsPage.prototype;

  _proto.init = function init() {
    _Page.prototype.init.call(this);

    if (!app.session.user || app.session.user.data.attributes.canViewRankingPage !== true) {
      m.route('/');
    }

    this.loading = true;
    this.users = [];
    this.refresh();
  };

  _proto.view = function view() {
    var _this = this;

    var loading;

    if (this.loading) {
      loading = flarum_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_8___default.a.component();
    } else {
      loading = flarum_components_Button__WEBPACK_IMPORTED_MODULE_5___default.a.component({
        children: app.translator.trans('core.forum.discussion_list.load_more_button'),
        className: 'Button',
        onclick: this.loadMore.bind(this)
      });
    }

    return m("div", {
      className: "TagsPage"
    }, flarum_components_IndexPage__WEBPACK_IMPORTED_MODULE_4___default.a.prototype.hero(), m("div", {
      className: "container"
    }, m("nav", {
      className: "RankingPage-nav IndexPage-nav sideNav",
      config: flarum_components_IndexPage__WEBPACK_IMPORTED_MODULE_4___default.a.prototype.affixSidebar
    }, m("ul", null, flarum_helpers_listItems__WEBPACK_IMPORTED_MODULE_9___default()(flarum_components_IndexPage__WEBPACK_IMPORTED_MODULE_4___default.a.prototype.sidebarItems().toArray()))), m("div", {
      className: "RankingPage sideNavOffset"
    }, m("table", {
      class: "rankings"
    }, m("tr", null, m("th", {
      className: "rankings-mobile"
    }, app.translator.trans('reflar-gamification.forum.ranking.rank')), m("th", null, app.translator.trans('reflar-gamification.forum.ranking.name')), m("th", null, app.translator.trans('reflar-gamification.forum.ranking.amount'))), this.users.map(function (user, i) {
      ++i;
      return [m("tr", {
        className: 'ranking-' + i
      }, i < 4 ? app.forum.attribute('CustomRankingImages') == '1' ? m("img", {
        className: "rankings-mobile rankings-image",
        src: app.forum.attribute('baseUrl') + '/assets/' + app.forum.attribute('TopImage' + i)
      }) : m("td", {
        className: 'rankings-mobile rankings-' + i
      }, m("i", {
        className: "icon fas fa-trophy"
      })) : m("td", {
        className: "rankings-4 rankings-mobile"
      }, _this.addOrdinalSuffix(i)), m("td", null, m("div", {
        className: "PostUser"
      }, m("h3", {
        className: "rankings-info"
      }, m("a", {
        href: app.route.user(user),
        config: m.route
      }, i < 4 ? flarum_helpers_avatar__WEBPACK_IMPORTED_MODULE_2___default()(user, {
        className: 'info-avatar rankings-' + i + '-avatar'
      }) : '', " ", flarum_helpers_username__WEBPACK_IMPORTED_MODULE_10___default()(user))))), i < 4 ? m("td", {
        className: 'rankings-' + i
      }, user.data.attributes.Points) : m("td", {
        className: "rankings-4"
      }, user.data.attributes.Points))];
    })), m("div", {
      className: "rankings-loadmore"
    }, " ", loading))));
  };

  _proto.refresh = function refresh(clear) {
    var _this2 = this;

    if (clear === void 0) {
      clear = true;
    }

    if (clear) {
      this.loading = true;
      this.users = [];
    }

    return this.loadResults().then(function (results) {
      _this2.users = [];

      _this2.parseResults(results);
    }, function () {
      _this2.loading = false;
      m.redraw();
    });
  };

  _proto.addOrdinalSuffix = function addOrdinalSuffix(i) {
    if (app.forum.attribute('DefaultLocale') == 'en') {
      var j = i % 10,
          k = i % 100;

      if (j == 1 && k != 11) {
        return i + 'st';
      }

      if (j == 2 && k != 12) {
        return i + 'nd';
      }

      if (j == 3 && k != 13) {
        return i + 'rd';
      }

      return i + 'th';
    } else {
      return i;
    }
  };

  _proto.stickyParams = function stickyParams() {
    return {
      sort: m.route.param('sort'),
      q: m.route.param('q')
    };
  };

  _proto.actionItems = function actionItems() {
    var items = new flarum_utils_ItemList__WEBPACK_IMPORTED_MODULE_6___default.a();
    items.add('refresh', flarum_components_Button__WEBPACK_IMPORTED_MODULE_5___default.a.component({
      title: app.translator.trans('core.forum.index.refresh_tooltip'),
      icon: 'fas fa-refresh',
      className: 'Button Button--icon',
      onclick: function onclick() {
        app.cache.discussionList.refresh();

        if (app.session.user) {
          app.store.find('users', app.session.user.id());
          m.redraw();
        }
      }
    }));
    return items;
  };

  _proto.newDiscussion = function newDiscussion() {
    var deferred = m.deferred();

    if (app.session.user) {
      this.composeNewDiscussion(deferred);
    } else {
      app.modal.show(new flarum_components_LogInModal__WEBPACK_IMPORTED_MODULE_7___default.a({
        onlogin: this.composeNewDiscussion.bind(this, deferred)
      }));
    }

    return deferred.promise;
  };

  _proto.composeNewDiscussion = function composeNewDiscussion(deferred) {
    var component = new DiscussionComposer({
      user: app.session.user
    });
    app.composer.load(component);
    app.composer.show();
    deferred.resolve(component);
    return deferred.promise;
  };

  _proto.loadResults = function loadResults(offset) {
    var params = {};
    params.page = {
      offset: offset,
      limit: '10'
    };
    return app.store.find('rankings', params);
  };

  _proto.loadMore = function loadMore() {
    this.loading = true;
    this.loadResults(this.users.length).then(this.parseResults.bind(this));
  };

  _proto.parseResults = function parseResults(results) {
    [].push.apply(this.users, results);
    this.loading = false;
    this.users.sort(function (a, b) {
      return parseFloat(b.data.attributes.Points) - parseFloat(a.data.attributes.Points);
    });
    m.lazyRedraw();
    return results;
  };

  return RankingsPage;
}(flarum_components_Page__WEBPACK_IMPORTED_MODULE_3___default.a);



/***/ }),

/***/ "./src/forum/components/VoteNotification.js":
/*!**************************************************!*\
  !*** ./src/forum/components/VoteNotification.js ***!
  \**************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return UpvotedNotification; });
/* harmony import */ var _babel_runtime_helpers_es6_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/es6/inheritsLoose */ "./node_modules/@babel/runtime/helpers/es6/inheritsLoose.js");
/* harmony import */ var flarum_components_Notification__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/components/Notification */ "flarum/components/Notification");
/* harmony import */ var flarum_components_Notification__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Notification__WEBPACK_IMPORTED_MODULE_1__);



var UpvotedNotification =
/*#__PURE__*/
function (_Notification) {
  Object(_babel_runtime_helpers_es6_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(UpvotedNotification, _Notification);

  function UpvotedNotification() {
    return _Notification.apply(this, arguments) || this;
  }

  var _proto = UpvotedNotification.prototype;

  _proto.icon = function icon() {
    if (this.props.notification.content() === 'Up') {
      return 'fas fa-thumbs-up';
    } else {
      return 'fas fa-thumbs-down';
    }
  };

  _proto.href = function href() {
    return app.route.post(this.props.notification.subject());
  };

  _proto.content = function content() {
    var username = this.props.notification.fromUser().username();

    if (this.props.notification.content() === 'Up') {
      return app.translator.trans('reflar-gamification.forum.notification.upvote', {
        username: username
      });
    } else {
      return app.translator.trans('reflar-gamification.forum.notification.downvote', {
        username: username
      });
    }
  };

  _proto.excerpt = function excerpt() {
    return this.props.notification.subject().contentPlain();
  };

  return UpvotedNotification;
}(flarum_components_Notification__WEBPACK_IMPORTED_MODULE_1___default.a);



/***/ }),

/***/ "./src/forum/components/VotesModal.js":
/*!********************************************!*\
  !*** ./src/forum/components/VotesModal.js ***!
  \********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return VotesModal; });
/* harmony import */ var _babel_runtime_helpers_es6_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/es6/inheritsLoose */ "./node_modules/@babel/runtime/helpers/es6/inheritsLoose.js");
/* harmony import */ var flarum_components_Modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/components/Modal */ "flarum/components/Modal");
/* harmony import */ var flarum_components_Modal__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Modal__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_helpers_avatar__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/helpers/avatar */ "flarum/helpers/avatar");
/* harmony import */ var flarum_helpers_avatar__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_helpers_avatar__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_helpers_username__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/helpers/username */ "flarum/helpers/username");
/* harmony import */ var flarum_helpers_username__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_helpers_username__WEBPACK_IMPORTED_MODULE_3__);





var VotesModal =
/*#__PURE__*/
function (_Modal) {
  Object(_babel_runtime_helpers_es6_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(VotesModal, _Modal);

  function VotesModal() {
    return _Modal.apply(this, arguments) || this;
  }

  var _proto = VotesModal.prototype;

  _proto.className = function className() {
    return 'VotesModal Modal--small';
  };

  _proto.title = function title() {
    return app.translator.trans('reflar-gamification.forum.modal.title');
  };

  _proto.content = function content() {
    return m("div", {
      className: "Modal-body"
    }, m("ul", {
      className: "VotesModal-list"
    }, m("legend", null, app.translator.trans('reflar-gamification.forum.modal.upvotes_label')), this.props.post.upvotes().map(function (user) {
      return m("li", null, m("a", {
        href: app.route.user(user),
        config: m.route
      }, flarum_helpers_avatar__WEBPACK_IMPORTED_MODULE_2___default()(user), " ", ' ', flarum_helpers_username__WEBPACK_IMPORTED_MODULE_3___default()(user)));
    }), m("legend", null, app.translator.trans('reflar-gamification.forum.modal.downvotes_label')), this.props.post.downvotes().map(function (user) {
      return m("li", null, m("a", {
        href: app.route.user(user),
        config: m.route
      }, flarum_helpers_avatar__WEBPACK_IMPORTED_MODULE_2___default()(user), " ", ' ', flarum_helpers_username__WEBPACK_IMPORTED_MODULE_3___default()(user)));
    })));
  };

  return VotesModal;
}(flarum_components_Modal__WEBPACK_IMPORTED_MODULE_1___default.a);



/***/ }),

/***/ "./src/forum/index.js":
/*!****************************!*\
  !*** ./src/forum/index.js ***!
  \****************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/app */ "flarum/app");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_app__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var _components_AddAttributes__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./components/AddAttributes */ "./src/forum/components/AddAttributes.js");
/* harmony import */ var _components_AddHotnessSort__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/AddHotnessSort */ "./src/forum/components/AddHotnessSort.js");
/* harmony import */ var _components_AddVoteButtons__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/AddVoteButtons */ "./src/forum/components/AddVoteButtons.js");
/* harmony import */ var _common_models_Rank__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/models/Rank */ "./src/common/models/Rank.js");
/* harmony import */ var _components_RankingsPage__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/RankingsPage */ "./src/forum/components/RankingsPage.js");
/* harmony import */ var _components_VoteNotification__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./components/VoteNotification */ "./src/forum/components/VoteNotification.js");








flarum_app__WEBPACK_IMPORTED_MODULE_1___default.a.initializers.add('reflar-gamification', function (app) {
  app.store.models.ranks = _common_models_Rank__WEBPACK_IMPORTED_MODULE_5__["default"];
  app.notificationComponents.vote = _components_VoteNotification__WEBPACK_IMPORTED_MODULE_7__["default"];
  app.routes.rankings = {
    path: '/rankings',
    component: _components_RankingsPage__WEBPACK_IMPORTED_MODULE_6__["default"].component()
  };
  Object(_components_AddVoteButtons__WEBPACK_IMPORTED_MODULE_4__["default"])();
  Object(_components_AddHotnessSort__WEBPACK_IMPORTED_MODULE_3__["default"])();
  Object(_components_AddAttributes__WEBPACK_IMPORTED_MODULE_2__["default"])();
});

/***/ }),

/***/ "flarum/Model":
/*!**********************************************!*\
  !*** external "flarum.core.compat['Model']" ***!
  \**********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['Model'];

/***/ }),

/***/ "flarum/app":
/*!********************************************!*\
  !*** external "flarum.core.compat['app']" ***!
  \********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['app'];

/***/ }),

/***/ "flarum/components/AvatarEditor":
/*!****************************************************************!*\
  !*** external "flarum.core.compat['components/AvatarEditor']" ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/AvatarEditor'];

/***/ }),

/***/ "flarum/components/Button":
/*!**********************************************************!*\
  !*** external "flarum.core.compat['components/Button']" ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Button'];

/***/ }),

/***/ "flarum/components/CommentPost":
/*!***************************************************************!*\
  !*** external "flarum.core.compat['components/CommentPost']" ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/CommentPost'];

/***/ }),

/***/ "flarum/components/DiscussionList":
/*!******************************************************************!*\
  !*** external "flarum.core.compat['components/DiscussionList']" ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/DiscussionList'];

/***/ }),

/***/ "flarum/components/Dropdown":
/*!************************************************************!*\
  !*** external "flarum.core.compat['components/Dropdown']" ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Dropdown'];

/***/ }),

/***/ "flarum/components/IndexPage":
/*!*************************************************************!*\
  !*** external "flarum.core.compat['components/IndexPage']" ***!
  \*************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/IndexPage'];

/***/ }),

/***/ "flarum/components/LinkButton":
/*!**************************************************************!*\
  !*** external "flarum.core.compat['components/LinkButton']" ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/LinkButton'];

/***/ }),

/***/ "flarum/components/LoadingIndicator":
/*!********************************************************************!*\
  !*** external "flarum.core.compat['components/LoadingIndicator']" ***!
  \********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/LoadingIndicator'];

/***/ }),

/***/ "flarum/components/LogInModal":
/*!**************************************************************!*\
  !*** external "flarum.core.compat['components/LogInModal']" ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/LogInModal'];

/***/ }),

/***/ "flarum/components/Modal":
/*!*********************************************************!*\
  !*** external "flarum.core.compat['components/Modal']" ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Modal'];

/***/ }),

/***/ "flarum/components/Notification":
/*!****************************************************************!*\
  !*** external "flarum.core.compat['components/Notification']" ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Notification'];

/***/ }),

/***/ "flarum/components/Page":
/*!********************************************************!*\
  !*** external "flarum.core.compat['components/Page']" ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Page'];

/***/ }),

/***/ "flarum/components/PostUser":
/*!************************************************************!*\
  !*** external "flarum.core.compat['components/PostUser']" ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/PostUser'];

/***/ }),

/***/ "flarum/components/UserCard":
/*!************************************************************!*\
  !*** external "flarum.core.compat['components/UserCard']" ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/UserCard'];

/***/ }),

/***/ "flarum/extend":
/*!***********************************************!*\
  !*** external "flarum.core.compat['extend']" ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['extend'];

/***/ }),

/***/ "flarum/helpers/avatar":
/*!*******************************************************!*\
  !*** external "flarum.core.compat['helpers/avatar']" ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['helpers/avatar'];

/***/ }),

/***/ "flarum/helpers/listItems":
/*!**********************************************************!*\
  !*** external "flarum.core.compat['helpers/listItems']" ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['helpers/listItems'];

/***/ }),

/***/ "flarum/helpers/userOnline":
/*!***********************************************************!*\
  !*** external "flarum.core.compat['helpers/userOnline']" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['helpers/userOnline'];

/***/ }),

/***/ "flarum/helpers/username":
/*!*********************************************************!*\
  !*** external "flarum.core.compat['helpers/username']" ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['helpers/username'];

/***/ }),

/***/ "flarum/models/Discussion":
/*!**********************************************************!*\
  !*** external "flarum.core.compat['models/Discussion']" ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['models/Discussion'];

/***/ }),

/***/ "flarum/models/Post":
/*!****************************************************!*\
  !*** external "flarum.core.compat['models/Post']" ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['models/Post'];

/***/ }),

/***/ "flarum/models/User":
/*!****************************************************!*\
  !*** external "flarum.core.compat['models/User']" ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['models/User'];

/***/ }),

/***/ "flarum/utils/ItemList":
/*!*******************************************************!*\
  !*** external "flarum.core.compat['utils/ItemList']" ***!
  \*******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['utils/ItemList'];

/***/ }),

/***/ "flarum/utils/PostControls":
/*!***********************************************************!*\
  !*** external "flarum.core.compat['utils/PostControls']" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['utils/PostControls'];

/***/ }),

/***/ "flarum/utils/UserControls":
/*!***********************************************************!*\
  !*** external "flarum.core.compat['utils/UserControls']" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['utils/UserControls'];

/***/ }),

/***/ "flarum/utils/mixin":
/*!****************************************************!*\
  !*** external "flarum.core.compat['utils/mixin']" ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['utils/mixin'];

/***/ })

/******/ });
//# sourceMappingURL=forum.js.map