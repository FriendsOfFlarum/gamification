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
/******/ 	return __webpack_require__(__webpack_require__.s = "./admin.js");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./admin.js":
/*!******************!*\
  !*** ./admin.js ***!
  \******************/
/*! exports provided: models, helpers, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _src_common__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./src/common */ "./src/common/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "models", function() { return _src_common__WEBPACK_IMPORTED_MODULE_0__["models"]; });

/* harmony import */ var _src_admin__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./src/admin */ "./src/admin/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "helpers", function() { return _src_admin__WEBPACK_IMPORTED_MODULE_1__["helpers"]; });

/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _src_admin__WEBPACK_IMPORTED_MODULE_1__["components"]; });




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
function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;
  subClass.__proto__ = superClass;
}

/***/ }),

/***/ "./src/admin/addSettingsPage.js":
/*!**************************************!*\
  !*** ./src/admin/addSettingsPage.js ***!
  \**************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_components_AdminNav__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/components/AdminNav */ "flarum/components/AdminNav");
/* harmony import */ var flarum_components_AdminNav__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_components_AdminNav__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_AdminLinkButton__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/AdminLinkButton */ "flarum/components/AdminLinkButton");
/* harmony import */ var flarum_components_AdminLinkButton__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_AdminLinkButton__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _components_SettingsPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./components/SettingsPage */ "./src/admin/components/SettingsPage.js");




/* harmony default export */ __webpack_exports__["default"] = (function () {
  app.routes['fof-gamification'] = {
    path: '/fof/gamification',
    component: _components_SettingsPage__WEBPACK_IMPORTED_MODULE_3__["default"].component()
  };

  app.extensionSettings['fof-gamification'] = function () {
    return m.route(app.route('fof-gamification'));
  };

  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_0__["extend"])(flarum_components_AdminNav__WEBPACK_IMPORTED_MODULE_1___default.a.prototype, 'items', function (items) {
    items.add('fof-gamification', flarum_components_AdminLinkButton__WEBPACK_IMPORTED_MODULE_2___default.a.component({
      href: app.route('fof-gamification'),
      icon: 'fas fa-thumbs-up',
      children: 'Gamification',
      description: app.translator.trans('fof-gamification.admin.nav.desc')
    }));
  });
});

/***/ }),

/***/ "./src/admin/components/SettingsPage.js":
/*!**********************************************!*\
  !*** ./src/admin/components/SettingsPage.js ***!
  \**********************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return SettingsPage; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_components_Alert__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/components/Alert */ "flarum/components/Alert");
/* harmony import */ var flarum_components_Alert__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Alert__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_Page__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/Page */ "flarum/components/Page");
/* harmony import */ var flarum_components_Page__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Page__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/components/Button */ "flarum/components/Button");
/* harmony import */ var flarum_components_Button__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Button__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/components/UploadImageButton */ "flarum/components/UploadImageButton");
/* harmony import */ var flarum_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_utils_saveSettings__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/utils/saveSettings */ "flarum/utils/saveSettings");
/* harmony import */ var flarum_utils_saveSettings__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_saveSettings__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_components_Switch__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/components/Switch */ "flarum/components/Switch");
/* harmony import */ var flarum_components_Switch__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_components_Switch__WEBPACK_IMPORTED_MODULE_6__);








var SettingsPage = /*#__PURE__*/function (_Page) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(SettingsPage, _Page);

  function SettingsPage() {
    return _Page.apply(this, arguments) || this;
  }

  var _proto = SettingsPage.prototype;

  _proto.init = function init() {
    var _this = this;

    this.fields = ['convertedLikes', 'amountPerPost', 'amountPerDiscussion', 'postStartAmount', 'rankAmt', 'iconName', 'blockedUsers', 'pointsPlaceholder'];
    this.switches = ['autoUpvotePosts', 'customRankingImages', 'rateLimit', 'showVotesOnDiscussionPage', 'useAlternateLayout'];
    this.ranks = app.store.all('ranks');
    this.values = {};
    this.settingsPrefix = 'fof-gamification';
    var settings = app.data.settings;
    this.fields.forEach(function (key) {
      return _this.values[key] = m.prop(settings[_this.addPrefix(key)]);
    });
    this.switches.forEach(function (key) {
      return _this.values[key] = m.prop(!!Number(settings[_this.addPrefix(key)]));
    });
    this.newRank = {
      points: m.prop(''),
      name: m.prop(''),
      color: m.prop('')
    };
  }
  /**
   * @returns {*}
   */
  ;

  _proto.view = function view() {
    var _this2 = this;

    return [m('div', {
      className: 'SettingsPage'
    }, [m('div', {
      className: 'container'
    }, [m('form', {
      onsubmit: this.onsubmit.bind(this)
    }, [m('div', {
      className: 'helpText'
    }, app.translator.trans('fof-gamification.admin.page.convert.help')), this.values.convertedLikes() === undefined ? flarum_components_Button__WEBPACK_IMPORTED_MODULE_3___default.a.component({
      type: 'button',
      className: 'Button Button--warning Ranks-button',
      children: app.translator.trans('fof-gamification.admin.page.convert.button'),
      onclick: function onclick() {
        app.request({
          url: app.forum.attribute('apiUrl') + '/fof/gamification/convert',
          method: 'POST'
        }).then(_this2.values.convertedLikes('converting'));
      }
    }) : this.values.convertedLikes() === 'converting' ? m('label', {}, app.translator.trans('fof-gamification.admin.page.convert.converting')) : m('label', {}, app.translator.trans('fof-gamification.admin.page.convert.converted', {
      number: this.values.convertedLikes()
    })), m('fieldset', {
      className: 'SettingsPage-ranks'
    }, [m('legend', {}, app.translator.trans('fof-gamification.admin.page.ranks.title')), m('label', {}, app.translator.trans('fof-gamification.admin.page.ranks.ranks')), m('div', {
      className: 'helpText'
    }, app.translator.trans('fof-gamification.admin.page.ranks.help.help')), m('div', {
      className: 'Ranks--Container'
    }, this.ranks.map(function (rank) {
      return m('div', {
        style: 'float: left;'
      }, [m('input', {
        className: 'FormControl Ranks-number',
        type: 'number',
        value: rank.points(),
        placeholder: app.translator.trans('fof-gamification.admin.page.ranks.help.points'),
        oninput: m.withAttr('value', _this2.updatePoints.bind(_this2, rank))
      }), m('input', {
        className: 'FormControl Ranks-name',
        value: rank.name(),
        placeholder: app.translator.trans('fof-gamification.admin.page.ranks.help.name'),
        oninput: m.withAttr('value', _this2.updateName.bind(_this2, rank))
      }), m('input', {
        className: 'FormControl Ranks-color',
        value: rank.color(),
        placeholder: app.translator.trans('fof-gamification.admin.page.ranks.help.color'),
        oninput: m.withAttr('value', _this2.updateColor.bind(_this2, rank))
      }), flarum_components_Button__WEBPACK_IMPORTED_MODULE_3___default.a.component({
        type: 'button',
        className: 'Button Button--warning Ranks-button',
        icon: 'fa fa-times',
        onclick: _this2.deleteRank.bind(_this2, rank)
      })]);
    }), m('div', {
      style: 'float: left; margin-bottom: 15px'
    }, [m('input', {
      className: 'FormControl Ranks-number',
      value: this.newRank.points(),
      placeholder: app.translator.trans('fof-gamification.admin.page.ranks.help.points'),
      type: 'number',
      oninput: m.withAttr('value', this.newRank.points)
    }), m('input', {
      className: 'FormControl Ranks-name',
      value: this.newRank.name(),
      placeholder: app.translator.trans('fof-gamification.admin.page.ranks.help.name'),
      oninput: m.withAttr('value', this.newRank.name)
    }), m('input', {
      className: 'FormControl Ranks-color',
      value: this.newRank.color(),
      placeholder: app.translator.trans('fof-gamification.admin.page.ranks.help.color'),
      oninput: m.withAttr('value', this.newRank.color)
    }), flarum_components_Button__WEBPACK_IMPORTED_MODULE_3___default.a.component({
      type: 'button',
      className: 'Button Button--warning Ranks-button',
      icon: 'fa fa-plus',
      onclick: this.addRank.bind(this)
    })])), m('label', {}, app.translator.trans('fof-gamification.admin.page.ranks.number_title')), m('input', {
      className: 'FormControl Ranks-default',
      value: this.values.rankAmt() || '',
      placeholder: 2,
      oninput: m.withAttr('value', this.values.rankAmt)
    }), m('legend', {}, app.translator.trans('fof-gamification.admin.page.votes.title')), m('label', {}, app.translator.trans('fof-gamification.admin.page.votes.icon_name')), m('div', {
      className: 'helpText'
    }, app.translator.trans('fof-gamification.admin.page.votes.icon_help')), m('input', {
      className: 'FormControl Ranks-default',
      value: this.values.iconName() || '',
      placeholder: 'thumbs',
      oninput: m.withAttr('value', this.values.iconName)
    }), flarum_components_Switch__WEBPACK_IMPORTED_MODULE_6___default.a.component({
      state: this.values.autoUpvotePosts() || false,
      children: app.translator.trans('fof-gamification.admin.page.votes.auto_upvote'),
      onchange: this.values.autoUpvotePosts,
      className: 'votes-switch'
    }), flarum_components_Switch__WEBPACK_IMPORTED_MODULE_6___default.a.component({
      state: this.values.rateLimit() || false,
      children: app.translator.trans('fof-gamification.admin.page.votes.rate_limit'),
      onchange: this.values.rateLimit,
      className: 'votes-switch'
    }), flarum_components_Switch__WEBPACK_IMPORTED_MODULE_6___default.a.component({
      state: this.values.showVotesOnDiscussionPage() || false,
      children: app.translator.trans('fof-gamification.admin.page.votes.discussion_page'),
      onchange: this.values.showVotesOnDiscussionPage,
      className: 'votes-switch'
    }), flarum_components_Switch__WEBPACK_IMPORTED_MODULE_6___default.a.component({
      state: this.values.useAlternateLayout() || false,
      children: app.translator.trans('fof-gamification.admin.page.votes.alternate_layout'),
      onchange: this.values.useAlternateLayout,
      className: 'votes-switch'
    }), m('label', {}, app.translator.trans('fof-gamification.admin.page.votes.points_title')), m('input', {
      className: 'FormControl Ranks-default',
      value: this.values.pointsPlaceholder() || '',
      placeholder: app.translator.trans('fof-gamification.admin.page.votes.points_placeholder') + '{points}',
      oninput: m.withAttr('value', this.values.pointsPlaceholder)
    }), m('legend', {}, app.translator.trans('fof-gamification.admin.page.rankings.title')), flarum_components_Switch__WEBPACK_IMPORTED_MODULE_6___default.a.component({
      state: this.values.customRankingImages() || false,
      children: app.translator.trans('fof-gamification.admin.page.rankings.enable'),
      onchange: this.values.customRankingImages,
      className: 'votes-switch'
    }), m('label', {}, app.translator.trans('fof-gamification.admin.page.rankings.blocked.title')), m('input', {
      className: 'FormControl Ranks-blocked',
      placeholder: app.translator.trans('fof-gamification.admin.page.rankings.blocked.placeholder'),
      value: this.values.blockedUsers() || '',
      oninput: m.withAttr('value', this.values.blockedUsers)
    }), m('div', {
      className: 'helpText'
    }, app.translator.trans('fof-gamification.admin.page.rankings.blocked.help')), m('label', {
      className: 'Upload-label'
    }, app.translator.trans('fof-gamification.admin.page.rankings.custom_image_1')), m(flarum_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_4___default.a, {
      className: "Upload-button",
      name: "fof-gamification.topimage1"
    }), m('br'), m('label', {
      className: 'Upload-label'
    }, app.translator.trans('fof-gamification.admin.page.rankings.custom_image_2')), m(flarum_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_4___default.a, {
      className: "Upload-button",
      name: "fof-gamification.topimage2"
    }), m('br'), m('label', {
      className: 'Upload-label'
    }, app.translator.trans('fof-gamification.admin.page.rankings.custom_image_3')), m(flarum_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_4___default.a, {
      className: "Upload-button",
      name: "fof-gamification.topimage3"
    }), m('br'), flarum_components_Button__WEBPACK_IMPORTED_MODULE_3___default.a.component({
      type: 'submit',
      className: 'Button Button--primary Ranks-save',
      children: app.translator.trans('fof-gamification.admin.page.save_settings'),
      loading: this.loading,
      disabled: !this.changed()
    })])])])])];
  };

  _proto.updateName = function updateName(rank, value) {
    rank.save({
      name: value
    });
  };

  _proto.updatePoints = function updatePoints(rank, value) {
    rank.save({
      points: value
    });
  };

  _proto.updateColor = function updateColor(rank, value) {
    rank.save({
      color: value
    });
  };

  _proto.deleteRank = function deleteRank(rankToDelete) {
    var _this3 = this;

    rankToDelete["delete"]();
    this.ranks.some(function (rank, i) {
      if (rank.data.id === rankToDelete.data.id) {
        _this3.ranks.splice(i, 1);

        return true;
      }
    });
  };

  _proto.addRank = function addRank(rank) {
    var _this4 = this;

    app.store.createRecord('ranks').save({
      points: this.newRank.points(),
      name: this.newRank.name(),
      color: this.newRank.color()
    }).then(function (rank) {
      _this4.newRank.color('');

      _this4.newRank.name('');

      _this4.newRank.points('');

      _this4.ranks.push(rank);

      m.redraw();
    });
  }
  /**
   *
   * @returns boolean
   */
  ;

  _proto.changed = function changed() {
    var _this5 = this;

    var switchesCheck = this.switches.some(function (key) {
      return _this5.values[key]() !== (app.data.settings[_this5.addPrefix(key)] == '1');
    });
    var fieldsCheck = this.fields.some(function (key) {
      return _this5.values[key]() !== app.data.settings[_this5.addPrefix(key)];
    });
    return fieldsCheck || switchesCheck;
  }
  /**
   * @param e
   */
  ;

  _proto.onsubmit = function onsubmit(e) {
    var _this6 = this;

    e.preventDefault();
    if (this.loading) return;
    this.loading = true;
    app.alerts.dismiss(this.successAlert);
    var settings = {};
    this.switches.forEach(function (key) {
      return settings[_this6.addPrefix(key)] = _this6.values[key]();
    });
    this.fields.forEach(function (key) {
      return settings[_this6.addPrefix(key)] = _this6.values[key]();
    });
    flarum_utils_saveSettings__WEBPACK_IMPORTED_MODULE_5___default()(settings).then(function () {
      app.alerts.show(_this6.successAlert = new flarum_components_Alert__WEBPACK_IMPORTED_MODULE_1___default.a({
        type: 'success',
        children: app.translator.trans('core.admin.basics.saved_message')
      }));
    })["catch"](function () {}).then(function () {
      _this6.loading = false;
      window.location.reload();
    });
  }
  /**
   * @returns string
   */
  ;

  _proto.addPrefix = function addPrefix(key) {
    return this.settingsPrefix + '.' + key;
  };

  return SettingsPage;
}(flarum_components_Page__WEBPACK_IMPORTED_MODULE_2___default.a);



/***/ }),

/***/ "./src/admin/components/index.js":
/*!***************************************!*\
  !*** ./src/admin/components/index.js ***!
  \***************************************/
/*! exports provided: components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "components", function() { return components; });
/* harmony import */ var _SettingsPage__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./SettingsPage */ "./src/admin/components/SettingsPage.js");

var components = {
  SettingsPage: _SettingsPage__WEBPACK_IMPORTED_MODULE_0__["default"]
};

/***/ }),

/***/ "./src/admin/index.js":
/*!****************************!*\
  !*** ./src/admin/index.js ***!
  \****************************/
/*! exports provided: helpers, components */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/app */ "flarum/app");
/* harmony import */ var flarum_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/extend */ "flarum/extend");
/* harmony import */ var flarum_extend__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_extend__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_components_PermissionGrid__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/components/PermissionGrid */ "flarum/components/PermissionGrid");
/* harmony import */ var flarum_components_PermissionGrid__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_components_PermissionGrid__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var _addSettingsPage__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ./addSettingsPage */ "./src/admin/addSettingsPage.js");
/* harmony import */ var _common_models_Rank__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ../common/models/Rank */ "./src/common/models/Rank.js");
/* harmony import */ var _common_helpers__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! ../common/helpers */ "./src/common/helpers/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "helpers", function() { return _common_helpers__WEBPACK_IMPORTED_MODULE_5__["helpers"]; });

/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! ./components */ "./src/admin/components/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _components__WEBPACK_IMPORTED_MODULE_6__["components"]; });






flarum_app__WEBPACK_IMPORTED_MODULE_0___default.a.initializers.add('fof-gamification', function (app) {
  app.store.models.ranks = _common_models_Rank__WEBPACK_IMPORTED_MODULE_4__["default"];
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_1__["extend"])(flarum_components_PermissionGrid__WEBPACK_IMPORTED_MODULE_2___default.a.prototype, 'replyItems', function (items) {
    items.add('Vote', {
      icon: 'fas fa-thumbs-up',
      label: app.translator.trans('fof-gamification.admin.permissions.vote_label'),
      permission: 'discussion.vote'
    });
  });
  Object(flarum_extend__WEBPACK_IMPORTED_MODULE_1__["extend"])(flarum_components_PermissionGrid__WEBPACK_IMPORTED_MODULE_2___default.a.prototype, 'viewItems', function (items) {
    items.add('canSeeVotes', {
      icon: 'fas fa-info-circle',
      label: app.translator.trans('fof-gamification.admin.permissions.see_votes_label'),
      permission: 'discussion.canSeeVotes'
    });
    items.add('canViewRankingPage', {
      icon: 'fas fa-trophy',
      label: app.translator.trans('fof-gamification.admin.permissions.see_ranking_page'),
      permission: 'fof.gamification.viewRankingPage',
      allowGuest: true
    });
  });
  Object(_addSettingsPage__WEBPACK_IMPORTED_MODULE_3__["default"])();
});



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
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/Model */ "flarum/Model");
/* harmony import */ var flarum_Model__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_Model__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/utils/mixin */ "flarum/utils/mixin");
/* harmony import */ var flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_utils_mixin__WEBPACK_IMPORTED_MODULE_2__);




var Rank = /*#__PURE__*/function (_mixin) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(Rank, _mixin);

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

/***/ "flarum/components/AdminLinkButton":
/*!*******************************************************************!*\
  !*** external "flarum.core.compat['components/AdminLinkButton']" ***!
  \*******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/AdminLinkButton'];

/***/ }),

/***/ "flarum/components/AdminNav":
/*!************************************************************!*\
  !*** external "flarum.core.compat['components/AdminNav']" ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/AdminNav'];

/***/ }),

/***/ "flarum/components/Alert":
/*!*********************************************************!*\
  !*** external "flarum.core.compat['components/Alert']" ***!
  \*********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Alert'];

/***/ }),

/***/ "flarum/components/Button":
/*!**********************************************************!*\
  !*** external "flarum.core.compat['components/Button']" ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Button'];

/***/ }),

/***/ "flarum/components/Page":
/*!********************************************************!*\
  !*** external "flarum.core.compat['components/Page']" ***!
  \********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Page'];

/***/ }),

/***/ "flarum/components/PermissionGrid":
/*!******************************************************************!*\
  !*** external "flarum.core.compat['components/PermissionGrid']" ***!
  \******************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/PermissionGrid'];

/***/ }),

/***/ "flarum/components/Switch":
/*!**********************************************************!*\
  !*** external "flarum.core.compat['components/Switch']" ***!
  \**********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/Switch'];

/***/ }),

/***/ "flarum/components/UploadImageButton":
/*!*********************************************************************!*\
  !*** external "flarum.core.compat['components/UploadImageButton']" ***!
  \*********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['components/UploadImageButton'];

/***/ }),

/***/ "flarum/extend":
/*!***********************************************!*\
  !*** external "flarum.core.compat['extend']" ***!
  \***********************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['extend'];

/***/ }),

/***/ "flarum/utils/mixin":
/*!****************************************************!*\
  !*** external "flarum.core.compat['utils/mixin']" ***!
  \****************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['utils/mixin'];

/***/ }),

/***/ "flarum/utils/saveSettings":
/*!***********************************************************!*\
  !*** external "flarum.core.compat['utils/saveSettings']" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['utils/saveSettings'];

/***/ })

/******/ });
//# sourceMappingURL=admin.js.map