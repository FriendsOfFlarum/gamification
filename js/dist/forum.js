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
/*! exports provided: models, components, helpers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/common */ "./src/common/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "models", function() { return _src_common__WEBPACK_IMPORTED_MODULE_0__["models"]; });

/* harmony import */ var _src_forum__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/forum */ "./src/forum/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _src_forum__WEBPACK_IMPORTED_MODULE_1__["components"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "helpers", function() { return _src_forum__WEBPACK_IMPORTED_MODULE_1__["helpers"]; });




/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/extends.js":
/*!************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/extends.js ***!
  \************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _extends; });
function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js":
/*!******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js ***!
  \******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _inheritsLoose; });
/* harmony import */ var _setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./setPrototypeOf.js */ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js");

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  Object(_setPrototypeOf_js__WEBPACK_IMPORTED_MODULE_0__["default"])(subClass, superClass);
}

/***/ }),

/***/ "./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js":
/*!*******************************************************************!*\
  !*** ./node_modules/@babel/runtime/helpers/esm/setPrototypeOf.js ***!
  \*******************************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return _setPrototypeOf; });
function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

/***/ }),

/***/ "./node_modules/lodash.debounce/index.js":
/*!***********************************************!*\
  !*** ./node_modules/lodash.debounce/index.js ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {/**
 * lodash (Custom Build) <https://lodash.com/>
 * Build: `lodash modularize exports="npm" -o ./`
 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */

/** Used as the `TypeError` message for "Functions" methods. */
var FUNC_ERROR_TEXT = 'Expected a function';

/** Used as references for various `Number` constants. */
var NAN = 0 / 0;

/** `Object#toString` result references. */
var symbolTag = '[object Symbol]';

/** Used to match leading and trailing whitespace. */
var reTrim = /^\s+|\s+$/g;

/** Used to detect bad signed hexadecimal string values. */
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;

/** Used to detect binary string values. */
var reIsBinary = /^0b[01]+$/i;

/** Used to detect octal string values. */
var reIsOctal = /^0o[0-7]+$/i;

/** Built-in method references without a dependency on `root`. */
var freeParseInt = parseInt;

/** Detect free variable `global` from Node.js. */
var freeGlobal = typeof global == 'object' && global && global.Object === Object && global;

/** Detect free variable `self`. */
var freeSelf = typeof self == 'object' && self && self.Object === Object && self;

/** Used as a reference to the global object. */
var root = freeGlobal || freeSelf || Function('return this')();

/** Used for built-in method references. */
var objectProto = Object.prototype;

/**
 * Used to resolve the
 * [`toStringTag`](http://ecma-international.org/ecma-262/7.0/#sec-object.prototype.tostring)
 * of values.
 */
var objectToString = objectProto.toString;

/* Built-in method references for those with the same name as other `lodash` methods. */
var nativeMax = Math.max,
    nativeMin = Math.min;

/**
 * Gets the timestamp of the number of milliseconds that have elapsed since
 * the Unix epoch (1 January 1970 00:00:00 UTC).
 *
 * @static
 * @memberOf _
 * @since 2.4.0
 * @category Date
 * @returns {number} Returns the timestamp.
 * @example
 *
 * _.defer(function(stamp) {
 *   console.log(_.now() - stamp);
 * }, _.now());
 * // => Logs the number of milliseconds it took for the deferred invocation.
 */
var now = function() {
  return root.Date.now();
};

/**
 * Creates a debounced function that delays invoking `func` until after `wait`
 * milliseconds have elapsed since the last time the debounced function was
 * invoked. The debounced function comes with a `cancel` method to cancel
 * delayed `func` invocations and a `flush` method to immediately invoke them.
 * Provide `options` to indicate whether `func` should be invoked on the
 * leading and/or trailing edge of the `wait` timeout. The `func` is invoked
 * with the last arguments provided to the debounced function. Subsequent
 * calls to the debounced function return the result of the last `func`
 * invocation.
 *
 * **Note:** If `leading` and `trailing` options are `true`, `func` is
 * invoked on the trailing edge of the timeout only if the debounced function
 * is invoked more than once during the `wait` timeout.
 *
 * If `wait` is `0` and `leading` is `false`, `func` invocation is deferred
 * until to the next tick, similar to `setTimeout` with a timeout of `0`.
 *
 * See [David Corbacho's article](https://css-tricks.com/debouncing-throttling-explained-examples/)
 * for details over the differences between `_.debounce` and `_.throttle`.
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Function
 * @param {Function} func The function to debounce.
 * @param {number} [wait=0] The number of milliseconds to delay.
 * @param {Object} [options={}] The options object.
 * @param {boolean} [options.leading=false]
 *  Specify invoking on the leading edge of the timeout.
 * @param {number} [options.maxWait]
 *  The maximum time `func` is allowed to be delayed before it's invoked.
 * @param {boolean} [options.trailing=true]
 *  Specify invoking on the trailing edge of the timeout.
 * @returns {Function} Returns the new debounced function.
 * @example
 *
 * // Avoid costly calculations while the window size is in flux.
 * jQuery(window).on('resize', _.debounce(calculateLayout, 150));
 *
 * // Invoke `sendMail` when clicked, debouncing subsequent calls.
 * jQuery(element).on('click', _.debounce(sendMail, 300, {
 *   'leading': true,
 *   'trailing': false
 * }));
 *
 * // Ensure `batchLog` is invoked once after 1 second of debounced calls.
 * var debounced = _.debounce(batchLog, 250, { 'maxWait': 1000 });
 * var source = new EventSource('/stream');
 * jQuery(source).on('message', debounced);
 *
 * // Cancel the trailing debounced invocation.
 * jQuery(window).on('popstate', debounced.cancel);
 */
function debounce(func, wait, options) {
  var lastArgs,
      lastThis,
      maxWait,
      result,
      timerId,
      lastCallTime,
      lastInvokeTime = 0,
      leading = false,
      maxing = false,
      trailing = true;

  if (typeof func != 'function') {
    throw new TypeError(FUNC_ERROR_TEXT);
  }
  wait = toNumber(wait) || 0;
  if (isObject(options)) {
    leading = !!options.leading;
    maxing = 'maxWait' in options;
    maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
    trailing = 'trailing' in options ? !!options.trailing : trailing;
  }

  function invokeFunc(time) {
    var args = lastArgs,
        thisArg = lastThis;

    lastArgs = lastThis = undefined;
    lastInvokeTime = time;
    result = func.apply(thisArg, args);
    return result;
  }

  function leadingEdge(time) {
    // Reset any `maxWait` timer.
    lastInvokeTime = time;
    // Start the timer for the trailing edge.
    timerId = setTimeout(timerExpired, wait);
    // Invoke the leading edge.
    return leading ? invokeFunc(time) : result;
  }

  function remainingWait(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime,
        result = wait - timeSinceLastCall;

    return maxing ? nativeMin(result, maxWait - timeSinceLastInvoke) : result;
  }

  function shouldInvoke(time) {
    var timeSinceLastCall = time - lastCallTime,
        timeSinceLastInvoke = time - lastInvokeTime;

    // Either this is the first call, activity has stopped and we're at the
    // trailing edge, the system time has gone backwards and we're treating
    // it as the trailing edge, or we've hit the `maxWait` limit.
    return (lastCallTime === undefined || (timeSinceLastCall >= wait) ||
      (timeSinceLastCall < 0) || (maxing && timeSinceLastInvoke >= maxWait));
  }

  function timerExpired() {
    var time = now();
    if (shouldInvoke(time)) {
      return trailingEdge(time);
    }
    // Restart the timer.
    timerId = setTimeout(timerExpired, remainingWait(time));
  }

  function trailingEdge(time) {
    timerId = undefined;

    // Only invoke if we have `lastArgs` which means `func` has been
    // debounced at least once.
    if (trailing && lastArgs) {
      return invokeFunc(time);
    }
    lastArgs = lastThis = undefined;
    return result;
  }

  function cancel() {
    if (timerId !== undefined) {
      clearTimeout(timerId);
    }
    lastInvokeTime = 0;
    lastArgs = lastCallTime = lastThis = timerId = undefined;
  }

  function flush() {
    return timerId === undefined ? result : trailingEdge(now());
  }

  function debounced() {
    var time = now(),
        isInvoking = shouldInvoke(time);

    lastArgs = arguments;
    lastThis = this;
    lastCallTime = time;

    if (isInvoking) {
      if (timerId === undefined) {
        return leadingEdge(lastCallTime);
      }
      if (maxing) {
        // Handle invocations in a tight loop.
        timerId = setTimeout(timerExpired, wait);
        return invokeFunc(lastCallTime);
      }
    }
    if (timerId === undefined) {
      timerId = setTimeout(timerExpired, wait);
    }
    return result;
  }
  debounced.cancel = cancel;
  debounced.flush = flush;
  return debounced;
}

/**
 * Checks if `value` is the
 * [language type](http://www.ecma-international.org/ecma-262/7.0/#sec-ecmascript-language-types)
 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
 *
 * @static
 * @memberOf _
 * @since 0.1.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
 * @example
 *
 * _.isObject({});
 * // => true
 *
 * _.isObject([1, 2, 3]);
 * // => true
 *
 * _.isObject(_.noop);
 * // => true
 *
 * _.isObject(null);
 * // => false
 */
function isObject(value) {
  var type = typeof value;
  return !!value && (type == 'object' || type == 'function');
}

/**
 * Checks if `value` is object-like. A value is object-like if it's not `null`
 * and has a `typeof` result of "object".
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
 * @example
 *
 * _.isObjectLike({});
 * // => true
 *
 * _.isObjectLike([1, 2, 3]);
 * // => true
 *
 * _.isObjectLike(_.noop);
 * // => false
 *
 * _.isObjectLike(null);
 * // => false
 */
function isObjectLike(value) {
  return !!value && typeof value == 'object';
}

/**
 * Checks if `value` is classified as a `Symbol` primitive or object.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to check.
 * @returns {boolean} Returns `true` if `value` is a symbol, else `false`.
 * @example
 *
 * _.isSymbol(Symbol.iterator);
 * // => true
 *
 * _.isSymbol('abc');
 * // => false
 */
function isSymbol(value) {
  return typeof value == 'symbol' ||
    (isObjectLike(value) && objectToString.call(value) == symbolTag);
}

/**
 * Converts `value` to a number.
 *
 * @static
 * @memberOf _
 * @since 4.0.0
 * @category Lang
 * @param {*} value The value to process.
 * @returns {number} Returns the number.
 * @example
 *
 * _.toNumber(3.2);
 * // => 3.2
 *
 * _.toNumber(Number.MIN_VALUE);
 * // => 5e-324
 *
 * _.toNumber(Infinity);
 * // => Infinity
 *
 * _.toNumber('3.2');
 * // => 3.2
 */
function toNumber(value) {
  if (typeof value == 'number') {
    return value;
  }
  if (isSymbol(value)) {
    return NAN;
  }
  if (isObject(value)) {
    var other = typeof value.valueOf == 'function' ? value.valueOf() : value;
    value = isObject(other) ? (other + '') : other;
  }
  if (typeof value != 'string') {
    return value === 0 ? value : +value;
  }
  value = value.replace(reTrim, '');
  var isBinary = reIsBinary.test(value);
  return (isBinary || reIsOctal.test(value))
    ? freeParseInt(value.slice(2), isBinary ? 2 : 8)
    : (reIsBadHex.test(value) ? NAN : +value);
}

module.exports = debounce;

/* WEBPACK VAR INJECTION */}.call(this, __webpack_require__(/*! ./../webpack/buildin/global.js */ "./node_modules/webpack/buildin/global.js")))

/***/ }),

/***/ "./node_modules/webpack/buildin/global.js":
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! no static exports found */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || new Function("return this")();
} catch (e) {
	// This works if the window reference is available
	if (typeof window === "object") g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),

/***/ "./src/common/helpers/index.js":
/*!*************************************!*\
  !*** ./src/common/helpers/index.js ***!
  \*************************************/
/*! exports provided: helpers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "helpers", function() { return helpers; });
/* harmony import */ var _rankLabel__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./rankLabel */ "./src/common/helpers/rankLabel.js");

var helpers = {
  rankLabel: _rankLabel__WEBPACK_IMPORTED_MODULE_0__["default"]
};

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
/*! exports provided: models */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _models__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./models */ "./src/common/models/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "models", function() { return _models__WEBPACK_IMPORTED_MODULE_0__["models"]; });



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
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/Model */ "flarum/common/Model");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Model__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_utils_mixin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/utils/mixin */ "flarum/common/utils/mixin");
/* harmony import */ var flarum_common_utils_mixin__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_mixin__WEBPACK_IMPORTED_MODULE_2__);




var Rank = /*#__PURE__*/function (_mixin) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Rank, _mixin);

  function Rank() {
    return _mixin.apply(this, arguments) || this;
  }

  return Rank;
}(flarum_common_utils_mixin__WEBPACK_IMPORTED_MODULE_2___default()(flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default.a, {
  points: flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('points'),
  name: flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('name'),
  color: flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('color')
}));



/***/ }),

/***/ "./src/common/models/index.js":
/*!************************************!*\
  !*** ./src/common/models/index.js ***!
  \************************************/
/*! exports provided: models */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "models", function() { return models; });
/* harmony import */ var _Rank__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./Rank */ "./src/common/models/Rank.js");

var models = {
  Rank: _Rank__WEBPACK_IMPORTED_MODULE_0__["default"]
};

/***/ }),

/***/ "./src/forum/addAlternateLayout.js":
/*!*****************************************!*\
  !*** ./src/forum/addAlternateLayout.js ***!
  \*****************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/components/DiscussionListItem */ "flarum/forum/components/DiscussionListItem");
/* harmony import */ var flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/helpers/icon */ "flarum/common/helpers/icon");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_utils_abbreviateNumber__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/utils/abbreviateNumber */ "flarum/common/utils/abbreviateNumber");
/* harmony import */ var flarum_common_utils_abbreviateNumber__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_abbreviateNumber__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/utils/Stream */ "flarum/common/utils/Stream");
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var _helpers_saveVote__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./helpers/saveVote */ "./src/forum/helpers/saveVote.js");
/* harmony import */ var _helpers_setting__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./helpers/setting */ "./src/forum/helpers/setting.js");









var get = function get(discussion, key) {
  var post = discussion.firstPost();

  if (post && post[key]() !== undefined) {
    return post[key]();
  }

  return discussion[key]();
};

/* harmony default export */ __webpack_exports__["default"] = (function () {
  Object(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__["extend"])(flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_2___default.a.prototype, 'oninit', function () {
    this.voteLoading = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_5___default()(false);
  });
  Object(flarum_common_extend__WEBPACK_IMPORTED_MODULE_1__["extend"])(flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_2___default.a.prototype, 'view', function (vdom) {
    if (!vdom || !vdom.children) return;
    var content = vdom.children.find(function (v) {
      return v && v.attrs && v.attrs.className && v.attrs.className.includes('DiscussionListItem-content');
    });
    var discussion = this.attrs.discussion;
    var post = discussion.firstPost();
    var hasUpvoted = get(discussion, 'hasUpvoted');
    var hasDownvoted = get(discussion, 'hasDownvoted'); // We set canVote to true for guest users so that they can access the login by clicking the button

    var canVote = !app.session.user || get(discussion, 'canVote');
    var style = {
      color: app.forum.attribute('themePrimaryColor')
    };
    var attrs = {
      disabled: !canVote
    };
    var useAlternateLayout = Object(_helpers_setting__WEBPACK_IMPORTED_MODULE_7__["default"])('useAlternateLayout', true);
    content.children.unshift(m("div", {
      className: "DiscussionListItem-votes " + (useAlternateLayout && 'alternateLayout')
    }, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_3___default()('fas fa-arrow-up', Object(_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
      style: hasUpvoted ? style : {},
      onclick: canVote && function () {
        return Object(_helpers_saveVote__WEBPACK_IMPORTED_MODULE_6__["default"])(post, !hasUpvoted, false, null, discussion);
      }
    }, attrs)), m("span", null, flarum_common_utils_abbreviateNumber__WEBPACK_IMPORTED_MODULE_4___default()(get(discussion, 'votes') || 0)), flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_3___default()('fas fa-arrow-down', Object(_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
      style: hasDownvoted ? style : {},
      onclick: canVote && function () {
        return Object(_helpers_saveVote__WEBPACK_IMPORTED_MODULE_6__["default"])(post, false, !hasDownvoted, null, discussion);
      }
    }, attrs))));
  });
});

/***/ }),

/***/ "./src/forum/addHotnessSort.js":
/*!*************************************!*\
  !*** ./src/forum/addHotnessSort.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/components/IndexPage */ "flarum/forum/components/IndexPage");
/* harmony import */ var flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/utils/ItemList */ "flarum/common/utils/ItemList");
/* harmony import */ var flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_states_DiscussionListState__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/states/DiscussionListState */ "flarum/forum/states/DiscussionListState");
/* harmony import */ var flarum_forum_states_DiscussionListState__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_states_DiscussionListState__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/Dropdown */ "flarum/common/components/Dropdown");
/* harmony import */ var flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/components/LinkButton */ "flarum/common/components/LinkButton");
/* harmony import */ var flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_6__);







/* harmony default export */ __webpack_exports__["default"] = (function () {
  flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_1___default.a.prototype.viewItems = function () {
    var items = new flarum_common_utils_ItemList__WEBPACK_IMPORTED_MODULE_2___default.a();
    var sortMap = app.discussions.sortMap();
    var sortOptions = {};

    for (var i in sortMap) {
      sortOptions[i] = app.translator.trans('core.forum.index_sort.' + i + '_button');
    }

    var dropDownLabel = sortOptions[app.search.params().sort] || Object.keys(sortMap).map(function (key) {
      return sortOptions[key];
    })[0];

    if (/^.*?\/hot/.test(m.route.get())) {
      dropDownLabel = app.translator.trans('core.forum.index_sort.hot_button');
    }

    items.add('sort', flarum_common_components_Dropdown__WEBPACK_IMPORTED_MODULE_4___default.a.component({
      buttonClassName: 'Button',
      label: dropDownLabel
    }, Object.keys(sortOptions).map(function (value) {
      var label = sortOptions[value];
      var active = (app.search.params().sort || Object.keys(sortMap)[0]) === value;

      if (/^.*?\/hot/.test(m.route.get()) && value === 'hot') {
        active = true;
      }

      if (/^.*?\/hot/.test(m.route.get()) && value === 'latest') {
        active = false;
        m.redraw();
      }

      return flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5___default.a.component({
        icon: active ? 'fas fa-check' : true,
        onclick: app.search.changeSort.bind(app.search, value),
        active: active
      }, label);
    })));
    return items;
  };

  Object(flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_1___default.a.prototype, 'navItems', function (items) {
    if (!app.session.user || app.session.user.data.attributes.canViewRankingPage !== true) {
      return;
    }

    items.add('rankings', flarum_common_components_LinkButton__WEBPACK_IMPORTED_MODULE_6___default.a.component({
      href: app.route('rankings'),
      icon: 'fas fa-trophy'
    }, app.translator.trans('fof-gamification.forum.nav.name')), 80);
  });
  Object(flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_forum_states_DiscussionListState__WEBPACK_IMPORTED_MODULE_3___default.a.prototype, 'sortMap', function (map) {
    map.hot = '-hotness';
  });
});

/***/ }),

/***/ "./src/forum/addPusher.js":
/*!********************************!*\
  !*** ./src/forum/addPusher.js ***!
  \********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_forum_components_DiscussionPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/components/DiscussionPage */ "flarum/forum/components/DiscussionPage");
/* harmony import */ var flarum_forum_components_DiscussionPage__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_DiscussionPage__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! lodash.debounce */ "./node_modules/lodash.debounce/index.js");
/* harmony import */ var lodash_debounce__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(lodash_debounce__WEBPACK_IMPORTED_MODULE_2__);




var fetch = function fetch(postId) {
  return app.store.find('posts', postId).then(function () {
    return m.redraw();
  });
};

var debounced = [];

var update = function update(postId) {
  var func = debounced[postId];
  if (func) return func(postId);
  func = debounced[postId] = lodash_debounce__WEBPACK_IMPORTED_MODULE_2___default()(fetch, 1500);
  return func(postId);
};

/* harmony default export */ __webpack_exports__["default"] = (function () {
  Object(flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_forum_components_DiscussionPage__WEBPACK_IMPORTED_MODULE_1___default.a.prototype, 'oncreate', function () {
    if (app.pusher) {
      app.pusher.then(function (channels) {
        channels.main.bind('newVote', function (data) {
          var post = app.store.getById('posts', data.post_id);
          var userId = data.user_id;
          if (!post || post.votes() === data.votes || userId == app.session.user.id()) return;
          update(post.id());
        });
      });
    }
  });
  Object(flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_forum_components_DiscussionPage__WEBPACK_IMPORTED_MODULE_1___default.a.prototype, 'onremove', function () {
    if (app.pusher) {
      app.pusher.then(function (channels) {
        channels.main.unbind('newVote');
      });
    }
  });
});

/***/ }),

/***/ "./src/forum/addUpvotesToDiscussion.js":
/*!*********************************************!*\
  !*** ./src/forum/addUpvotesToDiscussion.js ***!
  \*********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/components/DiscussionListItem */ "flarum/forum/components/DiscussionListItem");
/* harmony import */ var flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_utils_abbreviateNumber__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/utils/abbreviateNumber */ "flarum/common/utils/abbreviateNumber");
/* harmony import */ var flarum_common_utils_abbreviateNumber__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_abbreviateNumber__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/helpers/icon */ "flarum/common/helpers/icon");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _helpers_setting__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./helpers/setting */ "./src/forum/helpers/setting.js");





/* harmony default export */ __webpack_exports__["default"] = (function () {
  if (!Object(_helpers_setting__WEBPACK_IMPORTED_MODULE_4__["default"])('showVotesOnDiscussionPage', true) || Object(_helpers_setting__WEBPACK_IMPORTED_MODULE_4__["default"])('useAlternateLayout', true)) {
    return;
  }

  Object(flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_forum_components_DiscussionListItem__WEBPACK_IMPORTED_MODULE_1___default.a.prototype, 'infoItems', function (items) {
    items.add('discussion-votes', m("span", {
      className: "DiscussionListItem-votes",
      title: app.translator.trans('fof-gamification.forum.votes')
    }, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_3___default()('far fa-thumbs-up'), flarum_common_utils_abbreviateNumber__WEBPACK_IMPORTED_MODULE_2___default()(this.attrs.discussion.votes())), 20);
  });
});

/***/ }),

/***/ "./src/forum/addUserInfo.js":
/*!**********************************!*\
  !*** ./src/forum/addUserInfo.js ***!
  \**********************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_forum_components_PostUser__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/components/PostUser */ "flarum/forum/components/PostUser");
/* harmony import */ var flarum_forum_components_PostUser__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_PostUser__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_components_UserCard__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/components/UserCard */ "flarum/forum/components/UserCard");
/* harmony import */ var flarum_forum_components_UserCard__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_UserCard__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _common_helpers_rankLabel__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/helpers/rankLabel */ "./src/common/helpers/rankLabel.js");
/* harmony import */ var _helpers_setting__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./helpers/setting */ "./src/forum/helpers/setting.js");





/* harmony default export */ __webpack_exports__["default"] = (function () {
  var matchClass = function matchClass(className) {
    return function (node) {
      return node && node.attrs && node.attrs.className && String(node.attrs.className).split(' ').includes(className);
    };
  };

  var matchTag = function matchTag(tagName) {
    return function (node) {
      return node && node.tag && node.tag === tagName;
    };
  };

  var findMatchClass = function findMatchClass(node, className) {
    var arr = [];

    if (node && node.children && Array.isArray(node.children)) {
      var nodeInChildren = node.children.find(matchClass(className));

      if (nodeInChildren) {
        arr.push(nodeInChildren);
      }

      node.children.forEach(function (currentValue) {
        arr.push.apply(arr, findMatchClass(currentValue, className));
      });
    }

    return arr;
  };

  Object(flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_forum_components_UserCard__WEBPACK_IMPORTED_MODULE_2___default.a.prototype, 'infoItems', function (items) {
    var placeholder = Object(_helpers_setting__WEBPACK_IMPORTED_MODULE_4__["default"])('pointsPlaceholder');
    var pts = String(this.attrs.user.points());
    var points;

    if (placeholder) {
      points = m("div", null, placeholder.replace('{points}', pts));
    } else {
      points = app.translator.trans('fof-gamification.forum.user.points', {
        points: pts
      });
    }

    items.add('points', points);
  });
  Object(flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_forum_components_UserCard__WEBPACK_IMPORTED_MODULE_2___default.a.prototype, 'view', function (vnode) {
    var user = this.attrs.user;
    var profile_node = findMatchClass(vnode, 'UserCard-profile')[0];
    var amt = Number(Object(_helpers_setting__WEBPACK_IMPORTED_MODULE_4__["default"])('rankAmt'));
    if (!profile_node) return;
    var badges_node = profile_node.children.find(matchClass('UserCard-badges'));

    if (user.ranks()) {
      if (!badges_node) {
        profile_node.children.splice(1, 0, m("ul", {
          className: "UserCard-badges badges"
        }, user.ranks().reverse().map(function (rank, i) {
          if (!amt || i < amt) {
            return m("li", {
              className: "User-Rank"
            }, Object(_common_helpers_rankLabel__WEBPACK_IMPORTED_MODULE_3__["default"])(rank));
          }
        })));
      } else {
        user.ranks().reverse().map(function (rank, i) {
          if (!amt || i < amt) {
            return m("li", {
              className: "User-Rank"
            }, Object(_common_helpers_rankLabel__WEBPACK_IMPORTED_MODULE_3__["default"])(rank));
          }
        }).forEach(function (rank) {
          if (!rank) {
            return;
          }

          badges_node.children.push(rank);
        });
      }
    }

    return vnode;
  });
  Object(flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_forum_components_PostUser__WEBPACK_IMPORTED_MODULE_1___default.a.prototype, 'view', function (vnode) {
    var _Number;

    var post = this.attrs.post;
    var user = post.user();

    if (!user) {
      return vnode;
    }

    var header_node = vnode.children.find(matchTag('h3'));
    var amt = (_Number = Number(Object(_helpers_setting__WEBPACK_IMPORTED_MODULE_4__["default"])('rankAmt'))) != null ? _Number : user.ranks().length;
    header_node.children = header_node.children.concat(user.ranks().reverse().splice(0, amt).map(function (rank) {
      return m("span", {
        className: "Post-Rank"
      }, Object(_common_helpers_rankLabel__WEBPACK_IMPORTED_MODULE_3__["default"])(rank));
    })).filter(function (el) {
      return el.tag !== undefined;
    });
  });
});

/***/ }),

/***/ "./src/forum/addVoteButtons.js":
/*!*************************************!*\
  !*** ./src/forum/addVoteButtons.js ***!
  \*************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/extend */ "flarum/common/extend");
/* harmony import */ var flarum_common_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_forum_components_CommentPost__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/forum/components/CommentPost */ "flarum/forum/components/CommentPost");
/* harmony import */ var flarum_forum_components_CommentPost__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_CommentPost__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_utils_PostControls__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/utils/PostControls */ "flarum/forum/utils/PostControls");
/* harmony import */ var flarum_forum_utils_PostControls__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_utils_PostControls__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _components_VotesModal__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components/VotesModal */ "./src/forum/components/VotesModal.js");
/* harmony import */ var _helpers_setting__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./helpers/setting */ "./src/forum/helpers/setting.js");
/* harmony import */ var _helpers_saveVote__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./helpers/saveVote */ "./src/forum/helpers/saveVote.js");







/* harmony default export */ __webpack_exports__["default"] = (function () {
  Object(flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_forum_utils_PostControls__WEBPACK_IMPORTED_MODULE_3___default.a, 'moderationControls', function (items, post) {
    if (post.canSeeVotes()) {
      items.add('viewVotes', [m(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default.a, {
        icon: 'fas fa-thumbs-up',
        onclick: function onclick() {
          app.modal.show(_components_VotesModal__WEBPACK_IMPORTED_MODULE_4__["default"], {
            post: post
          });
        }
      }, app.translator.trans('fof-gamification.forum.mod_item'))]);
    }
  });
  Object(flarum_common_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_forum_components_CommentPost__WEBPACK_IMPORTED_MODULE_2___default.a.prototype, 'actionItems', function (items) {
    var _this = this;

    var post = this.attrs.post;
    var hasDownvoted = post.hasDownvoted();
    var hasUpvoted = post.hasUpvoted();
    var icon = Object(_helpers_setting__WEBPACK_IMPORTED_MODULE_5__["default"])('iconName') || 'thumbs'; // We set canVote to true for guest users so that they can access the login by clicking the button

    var canVote = !app.session.user || post.canVote();
    items.add('votes', m("div", {
      className: "CommentPost-votes " + (Object(_helpers_setting__WEBPACK_IMPORTED_MODULE_5__["default"])('useAlternateLayout', true) && 'alternateLayout')
    }, flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default.a.component({
      icon: this.voteLoading || "fas fa-" + icon + "-up",
      className: 'Post-vote Post-upvote',
      style: hasUpvoted && {
        color: app.forum.attribute('themePrimaryColor')
      },
      loading: this.voteLoading,
      disabled: this.voteLoading || !canVote,
      onclick: function onclick() {
        return Object(_helpers_saveVote__WEBPACK_IMPORTED_MODULE_6__["default"])(post, !hasUpvoted, false, function (val) {
          return _this.voteLoading = val;
        });
      }
    }), m("label", {
      className: "Post-points"
    }, post.votes()), flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_1___default.a.component({
      icon: this.voteLoading || "fas fa-" + icon + "-down",
      className: 'Post-vote Post-downvote',
      style: hasDownvoted && {
        color: app.forum.attribute('themePrimaryColor')
      },
      loading: this.voteLoading,
      disabled: !canVote,
      onclick: function onclick() {
        return Object(_helpers_saveVote__WEBPACK_IMPORTED_MODULE_6__["default"])(post, false, !hasDownvoted, function (val) {
          return _this.voteLoading = val;
        });
      }
    })), 10);
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
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_helpers_avatar__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/helpers/avatar */ "flarum/common/helpers/avatar");
/* harmony import */ var flarum_common_helpers_avatar__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_avatar__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Page */ "flarum/common/components/Page");
/* harmony import */ var flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/forum/components/IndexPage */ "flarum/forum/components/IndexPage");
/* harmony import */ var flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_forum_components_AffixedSidebar__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/forum/components/AffixedSidebar */ "flarum/forum/components/AffixedSidebar");
/* harmony import */ var flarum_forum_components_AffixedSidebar__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_AffixedSidebar__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! flarum/common/helpers/listItems */ "flarum/common/helpers/listItems");
/* harmony import */ var flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_7___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_7__);
/* harmony import */ var flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/common/helpers/username */ "flarum/common/helpers/username");
/* harmony import */ var flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_8__);
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! flarum/common/helpers/icon */ "flarum/common/helpers/icon");
/* harmony import */ var flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_9___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_9__);
/* harmony import */ var _helpers_setting__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ../helpers/setting */ "./src/forum/helpers/setting.js");
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! flarum/common/components/Link */ "flarum/common/components/Link");
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_11___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_11__);













var RankingsPage = /*#__PURE__*/function (_Page) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(RankingsPage, _Page);

  function RankingsPage() {
    return _Page.apply(this, arguments) || this;
  }

  var _proto = RankingsPage.prototype;

  _proto.oninit = function oninit(vnode) {
    _Page.prototype.oninit.call(this, vnode);

    if (!app.session.user || app.session.user.data.attributes.canViewRankingPage !== true) {
      m.route.set('/');
    }

    this.loading = true;
    this.users = [];
    this.refresh();
  };

  _proto.view = function view() {
    var _this = this;

    var loading;

    if (this.loading) {
      loading = flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_6___default.a.component();
    } else {
      loading = flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_5___default.a.component({
        className: 'Button',
        onclick: this.loadMore.bind(this)
      }, app.translator.trans('core.forum.discussion_list.load_more_button'));
    }

    return m("div", {
      className: "TagsPage"
    }, flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_3___default.a.prototype.hero(), m("div", {
      className: "container"
    }, m(flarum_forum_components_AffixedSidebar__WEBPACK_IMPORTED_MODULE_4___default.a, null, m("nav", {
      className: "RankingPage-nav IndexPage-nav sideNav"
    }, m("ul", null, flarum_common_helpers_listItems__WEBPACK_IMPORTED_MODULE_7___default()(flarum_forum_components_IndexPage__WEBPACK_IMPORTED_MODULE_3___default.a.prototype.sidebarItems().toArray())))), m("div", {
      className: "RankingPage sideNavOffset"
    }, m("table", {
      "class": "rankings"
    }, m("tr", null, m("th", {
      className: "rankings-mobile"
    }, app.translator.trans('fof-gamification.forum.ranking.rank')), m("th", null, app.translator.trans('fof-gamification.forum.ranking.name')), m("th", null, app.translator.trans('fof-gamification.forum.ranking.amount'))), this.users.map(function (user, i) {
      ++i;
      return [m("tr", {
        className: 'ranking-' + i
      }, i < 4 ? Object(_helpers_setting__WEBPACK_IMPORTED_MODULE_10__["default"])('customRankingImages', true) ? m("img", {
        className: "rankings-mobile rankings-image",
        src: app.forum.attribute('baseUrl') + app.forum.attribute("fof-gamification.topimage" + i + "Url")
      }) : m("td", {
        className: 'rankings-mobile rankings-' + i
      }, flarum_common_helpers_icon__WEBPACK_IMPORTED_MODULE_9___default()('fas fa-trophy')) : m("td", {
        className: "rankings-4 rankings-mobile"
      }, _this.addOrdinalSuffix(i)), m("td", null, m("div", {
        className: "PostUser"
      }, m("h3", {
        className: "rankings-info"
      }, m(flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_11___default.a, {
        href: app.route.user(user)
      }, i < 4 ? flarum_common_helpers_avatar__WEBPACK_IMPORTED_MODULE_1___default()(user, {
        className: 'info-avatar rankings-' + i + '-avatar'
      }) : '', ' ', flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_8___default()(user))))), i < 4 ? m("td", {
        className: 'rankings-' + i
      }, user.points()) : m("td", {
        className: "rankings-4"
      }, user.points()))];
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
    if (app.data.locale === 'en') {
      var j = i % 10;
      var k = i % 100;

      if (j === 1 && k !== 11) {
        return i + 'st';
      } else if (j === 2 && k !== 12) {
        return i + 'nd';
      } else if (j === 3 && k !== 13) {
        return i + 'rd';
      }

      return i + 'th';
    } else {
      return i;
    }
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
      return parseFloat(b.points()) - parseFloat(a.points());
    });
    m.redraw();
    return results;
  };

  return RankingsPage;
}(flarum_common_components_Page__WEBPACK_IMPORTED_MODULE_2___default.a);



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
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_forum_components_Notification__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/forum/components/Notification */ "flarum/forum/components/Notification");
/* harmony import */ var flarum_forum_components_Notification__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_components_Notification__WEBPACK_IMPORTED_MODULE_1__);



var UpvotedNotification = /*#__PURE__*/function (_Notification) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(UpvotedNotification, _Notification);

  function UpvotedNotification() {
    return _Notification.apply(this, arguments) || this;
  }

  var _proto = UpvotedNotification.prototype;

  _proto.icon = function icon() {
    if (this.attrs.notification.content() > 0) {
      return 'fas fa-thumbs-up';
    } else {
      return 'fas fa-thumbs-down';
    }
  };

  _proto.href = function href() {
    return app.route.post(this.attrs.notification.subject());
  };

  _proto.content = function content() {
    var user = this.attrs.notification.fromUser();
    var content = parseInt(this.attrs.notification.content());

    if (content > 0) {
      return app.translator.trans('fof-gamification.forum.notification.upvote', {
        user: user
      });
    } else {
      return app.translator.trans('fof-gamification.forum.notification.downvote', {
        user: user
      });
    }
  };

  _proto.excerpt = function excerpt() {
    return this.attrs.notification.subject().contentPlain();
  };

  return UpvotedNotification;
}(flarum_forum_components_Notification__WEBPACK_IMPORTED_MODULE_1___default.a);



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
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/components/Modal */ "flarum/common/components/Modal");
/* harmony import */ var flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/LoadingIndicator */ "flarum/common/components/LoadingIndicator");
/* harmony import */ var flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_helpers_avatar__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/helpers/avatar */ "flarum/common/helpers/avatar");
/* harmony import */ var flarum_common_helpers_avatar__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_avatar__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/helpers/username */ "flarum/common/helpers/username");
/* harmony import */ var flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/components/Link */ "flarum/common/components/Link");
/* harmony import */ var flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_5__);







var VotesModal = /*#__PURE__*/function (_Modal) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(VotesModal, _Modal);

  function VotesModal() {
    return _Modal.apply(this, arguments) || this;
  }

  var _proto = VotesModal.prototype;

  _proto.className = function className() {
    return 'VotesModal Modal--small';
  };

  _proto.title = function title() {
    return app.translator.trans('fof-gamification.forum.modal.title');
  };

  _proto.oninit = function oninit(vnode) {
    _Modal.prototype.oninit.call(this, vnode);

    this.loading = !this.attrs.post.upvotes();

    if (this.loading) {
      this.load();
    }
  };

  _proto.content = function content() {
    var _this = this;

    if (this.loading) {
      return m("div", {
        className: "Modal-body"
      }, m(flarum_common_components_LoadingIndicator__WEBPACK_IMPORTED_MODULE_2___default.a, null));
    }

    return m("div", {
      className: "Modal-body"
    }, m("ul", {
      className: "VotesModal-list"
    }, ['upvotes'].map(function (type) {
      var voters = _this.attrs.post[type]();

      if (!voters || !voters.length) return;
      return m("div", null, m("legend", null, app.translator.trans("fof-gamification.forum.modal." + type + "_label")), voters.map(function (user) {
        return m("li", null, m(flarum_common_components_Link__WEBPACK_IMPORTED_MODULE_5___default.a, {
          href: app.route.user(user)
        }, flarum_common_helpers_avatar__WEBPACK_IMPORTED_MODULE_3___default()(user), " ", flarum_common_helpers_username__WEBPACK_IMPORTED_MODULE_4___default()(user)));
      }));
    })));
  };

  _proto.load = function load() {
    return app.store.find('posts', this.attrs.post.id(), {
      include: 'upvotes'
    }).then(this.loaded.bind(this));
  };

  return VotesModal;
}(flarum_common_components_Modal__WEBPACK_IMPORTED_MODULE_1___default.a);



/***/ }),

/***/ "./src/forum/components/index.js":
/*!***************************************!*\
  !*** ./src/forum/components/index.js ***!
  \***************************************/
/*! exports provided: components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
/* harmony import */ var _RankingsPage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./RankingsPage */ "./src/forum/components/RankingsPage.js");
/* harmony import */ var _VoteNotification__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./VoteNotification */ "./src/forum/components/VoteNotification.js");
/* harmony import */ var _VotesModal__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./VotesModal */ "./src/forum/components/VotesModal.js");



var components = {
  RankingsPage: _RankingsPage__WEBPACK_IMPORTED_MODULE_0__["default"],
  VoteNotification: _VoteNotification__WEBPACK_IMPORTED_MODULE_1__["default"],
  VotesModal: _VotesModal__WEBPACK_IMPORTED_MODULE_2__["default"]
};

/***/ }),

/***/ "./src/forum/helpers/index.js":
/*!************************************!*\
  !*** ./src/forum/helpers/index.js ***!
  \************************************/
/*! exports provided: helpers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "helpers", function() { return helpers; });
/* harmony import */ var _babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/extends */ "./node_modules/@babel/runtime/helpers/esm/extends.js");
/* harmony import */ var _saveVote__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./saveVote */ "./src/forum/helpers/saveVote.js");
/* harmony import */ var _setting__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ./setting */ "./src/forum/helpers/setting.js");
/* harmony import */ var _common_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../../common/helpers */ "./src/common/helpers/index.js");




var helpers = Object(_babel_runtime_helpers_esm_extends__WEBPACK_IMPORTED_MODULE_0__["default"])({
  saveVote: _saveVote__WEBPACK_IMPORTED_MODULE_1__["default"],
  setting: _setting__WEBPACK_IMPORTED_MODULE_2__["default"]
}, _common_helpers__WEBPACK_IMPORTED_MODULE_3__["helpers"]);

/***/ }),

/***/ "./src/forum/helpers/saveVote.js":
/*!***************************************!*\
  !*** ./src/forum/helpers/saveVote.js ***!
  \***************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/forum/utils/DiscussionControls */ "flarum/forum/utils/DiscussionControls");
/* harmony import */ var flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_0__);

/* harmony default export */ __webpack_exports__["default"] = (function (post, upvoted, downvoted, load, discussion) {
  if (discussion === void 0) {
    discussion = post.discussion();
  }

  if (!app.session.user) {
    // We use this instead of showing LogInModal so that extensions can override it
    flarum_forum_utils_DiscussionControls__WEBPACK_IMPORTED_MODULE_0___default.a.replyAction.call(discussion, true);
    return;
  } else if (discussion && !discussion.canVote() && !post.canVote()) {
    return;
  }

  if (upvoted && downvoted) {
    upvoted = false;
    downvoted = false;
  }

  if (load) load(true);
  m.redraw();
  return post.save([upvoted, downvoted, 'vote']).then(function () {
    return null;
  }, function () {
    return null;
  }).then(function () {
    if (load) load(false);

    if (discussion) {
      discussion.pushAttributes({
        votes: post.votes()
      });
    }

    m.redraw();
  });
});

/***/ }),

/***/ "./src/forum/helpers/setting.js":
/*!**************************************!*\
  !*** ./src/forum/helpers/setting.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony default export */ __webpack_exports__["default"] = (function (key, isBool) {
  if (isBool === void 0) {
    isBool = false;
  }

  var val = app.data["fof-gamification." + key];

  if (isBool) {
    return !!Number(val);
  }

  return val;
});

/***/ }),

/***/ "./src/forum/index.js":
/*!****************************!*\
  !*** ./src/forum/index.js ***!
  \****************************/
/*! exports provided: components, helpers */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/common/Model */ "flarum/common/Model");
/* harmony import */ var flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_common_Model__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_common_models_Discussion__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/common/models/Discussion */ "flarum/common/models/Discussion");
/* harmony import */ var flarum_common_models_Discussion__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_common_models_Discussion__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_models_Post__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/models/Post */ "flarum/common/models/Post");
/* harmony import */ var flarum_common_models_Post__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_models_Post__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_common_models_User__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/common/models/User */ "flarum/common/models/User");
/* harmony import */ var flarum_common_models_User__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_common_models_User__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var _common_models_Rank__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/models/Rank */ "./src/common/models/Rank.js");
/* harmony import */ var _components_RankingsPage__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ./components/RankingsPage */ "./src/forum/components/RankingsPage.js");
/* harmony import */ var _components_VoteNotification__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components/VoteNotification */ "./src/forum/components/VoteNotification.js");
/* harmony import */ var _addHotnessSort__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./addHotnessSort */ "./src/forum/addHotnessSort.js");
/* harmony import */ var _addVoteButtons__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! ./addVoteButtons */ "./src/forum/addVoteButtons.js");
/* harmony import */ var _addUpvotesToDiscussion__WEBPACK_IMPORTED_MODULE_9__ = __webpack_require__(/*! ./addUpvotesToDiscussion */ "./src/forum/addUpvotesToDiscussion.js");
/* harmony import */ var _addUserInfo__WEBPACK_IMPORTED_MODULE_10__ = __webpack_require__(/*! ./addUserInfo */ "./src/forum/addUserInfo.js");
/* harmony import */ var _addPusher__WEBPACK_IMPORTED_MODULE_11__ = __webpack_require__(/*! ./addPusher */ "./src/forum/addPusher.js");
/* harmony import */ var _addAlternateLayout__WEBPACK_IMPORTED_MODULE_12__ = __webpack_require__(/*! ./addAlternateLayout */ "./src/forum/addAlternateLayout.js");
/* harmony import */ var _helpers_setting__WEBPACK_IMPORTED_MODULE_13__ = __webpack_require__(/*! ./helpers/setting */ "./src/forum/helpers/setting.js");
/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_14__ = __webpack_require__(/*! ./components */ "./src/forum/components/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _components__WEBPACK_IMPORTED_MODULE_14__["components"]; });

/* harmony import */ var _helpers__WEBPACK_IMPORTED_MODULE_15__ = __webpack_require__(/*! ./helpers */ "./src/forum/helpers/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "helpers", function() { return _helpers__WEBPACK_IMPORTED_MODULE_15__["helpers"]; });















app.initializers.add('fof-gamification', function (app) {
  flarum_common_models_Discussion__WEBPACK_IMPORTED_MODULE_1___default.a.prototype.votes = flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default.a.attribute('votes');
  flarum_common_models_Discussion__WEBPACK_IMPORTED_MODULE_1___default.a.prototype.hasUpvoted = flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default.a.attribute('hasUpvoted');
  flarum_common_models_Discussion__WEBPACK_IMPORTED_MODULE_1___default.a.prototype.hasDownvoted = flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default.a.attribute('hasDownvoted');
  flarum_common_models_Discussion__WEBPACK_IMPORTED_MODULE_1___default.a.prototype.canVote = flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default.a.attribute('canVote');
  flarum_common_models_User__WEBPACK_IMPORTED_MODULE_3___default.a.prototype.points = flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default.a.attribute('points');
  flarum_common_models_User__WEBPACK_IMPORTED_MODULE_3___default.a.prototype.ranks = flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default.a.hasMany('ranks');
  flarum_common_models_Post__WEBPACK_IMPORTED_MODULE_2___default.a.prototype.upvotes = flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default.a.hasMany('upvotes');
  flarum_common_models_Post__WEBPACK_IMPORTED_MODULE_2___default.a.prototype.votes = flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default.a.attribute('votes');
  flarum_common_models_Post__WEBPACK_IMPORTED_MODULE_2___default.a.prototype.canVote = flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default.a.attribute('canVote');
  flarum_common_models_Post__WEBPACK_IMPORTED_MODULE_2___default.a.prototype.canSeeVotes = flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default.a.attribute('canSeeVotes');
  flarum_common_models_Post__WEBPACK_IMPORTED_MODULE_2___default.a.prototype.hasUpvoted = flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default.a.attribute('hasUpvoted');
  flarum_common_models_Post__WEBPACK_IMPORTED_MODULE_2___default.a.prototype.hasDownvoted = flarum_common_Model__WEBPACK_IMPORTED_MODULE_0___default.a.attribute('hasDownvoted');
  app.store.models.ranks = _common_models_Rank__WEBPACK_IMPORTED_MODULE_4__["default"];
  app.notificationComponents.vote = _components_VoteNotification__WEBPACK_IMPORTED_MODULE_6__["default"];
  app.routes.rankings = {
    path: '/rankings',
    component: _components_RankingsPage__WEBPACK_IMPORTED_MODULE_5__["default"]
  };
  Object(_addVoteButtons__WEBPACK_IMPORTED_MODULE_8__["default"])();
  Object(_addHotnessSort__WEBPACK_IMPORTED_MODULE_7__["default"])();
  Object(_addUserInfo__WEBPACK_IMPORTED_MODULE_10__["default"])();
  Object(_addUpvotesToDiscussion__WEBPACK_IMPORTED_MODULE_9__["default"])();
  Object(_addPusher__WEBPACK_IMPORTED_MODULE_11__["default"])();

  if (Object(_helpers_setting__WEBPACK_IMPORTED_MODULE_13__["default"])('useAlternateLayout', true)) {
    Object(_addAlternateLayout__WEBPACK_IMPORTED_MODULE_12__["default"])();
  }
});



/***/ }),

/***/ "flarum/common/Model":
/*!*****************************************************!*\
  !*** external "flarum.core.compat['common/Model']" ***!
  \*****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['common/Model'];

/***/ }),

/***/ "flarum/common/components/Button":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Button']" ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['common/components/Button'];

/***/ }),

/***/ "flarum/common/components/Dropdown":
/*!*******************************************************************!*\
  !*** external "flarum.core.compat['common/components/Dropdown']" ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['common/components/Dropdown'];

/***/ }),

/***/ "flarum/common/components/Link":
/*!***************************************************************!*\
  !*** external "flarum.core.compat['common/components/Link']" ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['common/components/Link'];

/***/ }),

/***/ "flarum/common/components/LinkButton":
/*!*********************************************************************!*\
  !*** external "flarum.core.compat['common/components/LinkButton']" ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['common/components/LinkButton'];

/***/ }),

/***/ "flarum/common/components/LoadingIndicator":
/*!***************************************************************************!*\
  !*** external "flarum.core.compat['common/components/LoadingIndicator']" ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['common/components/LoadingIndicator'];

/***/ }),

/***/ "flarum/common/components/Modal":
/*!****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Modal']" ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['common/components/Modal'];

/***/ }),

/***/ "flarum/common/components/Page":
/*!***************************************************************!*\
  !*** external "flarum.core.compat['common/components/Page']" ***!
  \***************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['common/components/Page'];

/***/ }),

/***/ "flarum/common/extend":
/*!******************************************************!*\
  !*** external "flarum.core.compat['common/extend']" ***!
  \******************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['common/extend'];

/***/ }),

/***/ "flarum/common/helpers/avatar":
/*!**************************************************************!*\
  !*** external "flarum.core.compat['common/helpers/avatar']" ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['common/helpers/avatar'];

/***/ }),

/***/ "flarum/common/helpers/icon":
/*!************************************************************!*\
  !*** external "flarum.core.compat['common/helpers/icon']" ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['common/helpers/icon'];

/***/ }),

/***/ "flarum/common/helpers/listItems":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/helpers/listItems']" ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['common/helpers/listItems'];

/***/ }),

/***/ "flarum/common/helpers/username":
/*!****************************************************************!*\
  !*** external "flarum.core.compat['common/helpers/username']" ***!
  \****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['common/helpers/username'];

/***/ }),

/***/ "flarum/common/models/Discussion":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/models/Discussion']" ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['common/models/Discussion'];

/***/ }),

/***/ "flarum/common/models/Post":
/*!***********************************************************!*\
  !*** external "flarum.core.compat['common/models/Post']" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['common/models/Post'];

/***/ }),

/***/ "flarum/common/models/User":
/*!***********************************************************!*\
  !*** external "flarum.core.compat['common/models/User']" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['common/models/User'];

/***/ }),

/***/ "flarum/common/utils/ItemList":
/*!**************************************************************!*\
  !*** external "flarum.core.compat['common/utils/ItemList']" ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['common/utils/ItemList'];

/***/ }),

/***/ "flarum/common/utils/Stream":
/*!************************************************************!*\
  !*** external "flarum.core.compat['common/utils/Stream']" ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['common/utils/Stream'];

/***/ }),

/***/ "flarum/common/utils/abbreviateNumber":
/*!**********************************************************************!*\
  !*** external "flarum.core.compat['common/utils/abbreviateNumber']" ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['common/utils/abbreviateNumber'];

/***/ }),

/***/ "flarum/common/utils/mixin":
/*!***********************************************************!*\
  !*** external "flarum.core.compat['common/utils/mixin']" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['common/utils/mixin'];

/***/ }),

/***/ "flarum/forum/components/AffixedSidebar":
/*!************************************************************************!*\
  !*** external "flarum.core.compat['forum/components/AffixedSidebar']" ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['forum/components/AffixedSidebar'];

/***/ }),

/***/ "flarum/forum/components/CommentPost":
/*!*********************************************************************!*\
  !*** external "flarum.core.compat['forum/components/CommentPost']" ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['forum/components/CommentPost'];

/***/ }),

/***/ "flarum/forum/components/DiscussionListItem":
/*!****************************************************************************!*\
  !*** external "flarum.core.compat['forum/components/DiscussionListItem']" ***!
  \****************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['forum/components/DiscussionListItem'];

/***/ }),

/***/ "flarum/forum/components/DiscussionPage":
/*!************************************************************************!*\
  !*** external "flarum.core.compat['forum/components/DiscussionPage']" ***!
  \************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['forum/components/DiscussionPage'];

/***/ }),

/***/ "flarum/forum/components/IndexPage":
/*!*******************************************************************!*\
  !*** external "flarum.core.compat['forum/components/IndexPage']" ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['forum/components/IndexPage'];

/***/ }),

/***/ "flarum/forum/components/Notification":
/*!**********************************************************************!*\
  !*** external "flarum.core.compat['forum/components/Notification']" ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['forum/components/Notification'];

/***/ }),

/***/ "flarum/forum/components/PostUser":
/*!******************************************************************!*\
  !*** external "flarum.core.compat['forum/components/PostUser']" ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['forum/components/PostUser'];

/***/ }),

/***/ "flarum/forum/components/UserCard":
/*!******************************************************************!*\
  !*** external "flarum.core.compat['forum/components/UserCard']" ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['forum/components/UserCard'];

/***/ }),

/***/ "flarum/forum/states/DiscussionListState":
/*!*************************************************************************!*\
  !*** external "flarum.core.compat['forum/states/DiscussionListState']" ***!
  \*************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['forum/states/DiscussionListState'];

/***/ }),

/***/ "flarum/forum/utils/DiscussionControls":
/*!***********************************************************************!*\
  !*** external "flarum.core.compat['forum/utils/DiscussionControls']" ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['forum/utils/DiscussionControls'];

/***/ }),

/***/ "flarum/forum/utils/PostControls":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['forum/utils/PostControls']" ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['forum/utils/PostControls'];

/***/ })

/******/ });
//# sourceMappingURL=forum.js.map