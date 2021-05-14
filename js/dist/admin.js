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
/* harmony import */ var flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/admin/components/ExtensionPage */ "flarum/admin/components/ExtensionPage");
/* harmony import */ var flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_1__);
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! flarum/common/components/Button */ "flarum/common/components/Button");
/* harmony import */ var flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2__);
/* harmony import */ var flarum_admin_utils_saveSettings__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! flarum/admin/utils/saveSettings */ "flarum/admin/utils/saveSettings");
/* harmony import */ var flarum_admin_utils_saveSettings__WEBPACK_IMPORTED_MODULE_3___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_utils_saveSettings__WEBPACK_IMPORTED_MODULE_3__);
/* harmony import */ var flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! flarum/common/components/Switch */ "flarum/common/components/Switch");
/* harmony import */ var flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_4___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_4__);
/* harmony import */ var flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_5__ = __webpack_require__(/*! flarum/common/utils/withAttr */ "flarum/common/utils/withAttr");
/* harmony import */ var flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_5___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_5__);
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_6__ = __webpack_require__(/*! flarum/common/utils/Stream */ "flarum/common/utils/Stream");
/* harmony import */ var flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_6___default = /*#__PURE__*/__webpack_require__.n(flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_6__);
/* harmony import */ var _UploadImageButton__WEBPACK_IMPORTED_MODULE_7__ = __webpack_require__(/*! ./UploadImageButton */ "./src/admin/components/UploadImageButton.js");
/* harmony import */ var flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_8__ = __webpack_require__(/*! flarum/common/components/Select */ "flarum/common/components/Select");
/* harmony import */ var flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_8___default = /*#__PURE__*/__webpack_require__.n(flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_8__);










var SettingsPage = /*#__PURE__*/function (_ExtensionPage) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(SettingsPage, _ExtensionPage);

  function SettingsPage() {
    return _ExtensionPage.apply(this, arguments) || this;
  }

  var _proto = SettingsPage.prototype;

  _proto.oninit = function oninit(vnode) {
    var _this = this;

    _ExtensionPage.prototype.oninit.call(this, vnode);

    this.fields = ['convertedLikes', 'amountPerPost', 'amountPerDiscussion', 'postStartAmount', 'rankAmt', 'iconName', 'blockedUsers', 'pointsPlaceholder'];
    this.switches = ['autoUpvotePosts', 'customRankingImages', 'rateLimit', 'showVotesOnDiscussionPage', 'useAlternateLayout', 'allowSelfVote'];
    this.ranks = app.store.all('ranks');
    this.values = {};
    this.settingsPrefix = 'fof-gamification';
    var settings = app.data.settings;
    this.fields.forEach(function (key) {
      return _this.values[key] = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_6___default()(settings[_this.addPrefix(key)]);
    });
    this.switches.forEach(function (key) {
      return _this.values[key] = flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_6___default()(!!Number(settings[_this.addPrefix(key)]));
    });
    this.newRank = {
      points: flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_6___default()(''),
      name: flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_6___default()(''),
      color: flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_6___default()(''),
      groups: flarum_common_utils_Stream__WEBPACK_IMPORTED_MODULE_6___default()('')
    };
  }
  /**
   * @returns {*}
   */
  ;

  _proto.content = function content() {
    var _this2 = this;

    var groups = {};
    app.store.all('groups').forEach(function (group) {
      return groups[parseInt(group.id())] = group.nameSingular();
    });
    return [m('div', {
      className: 'SettingsPage'
    }, [m('div', {
      className: 'container'
    }, [m('form', {
      onsubmit: this.onsubmit.bind(this)
    }, [m('div', {
      className: 'helpText'
    }, app.translator.trans('fof-gamification.admin.page.convert.help')), this.values.convertedLikes() === undefined ? flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default.a.component({
      type: 'button',
      className: 'Button Button--warning Ranks-button',
      onclick: function onclick() {
        app.request({
          url: app.forum.attribute('apiUrl') + '/fof/gamification/convert',
          method: 'POST'
        }).then(_this2.values.convertedLikes('converting'));
      }
    }, app.translator.trans('fof-gamification.admin.page.convert.button')) : this.values.convertedLikes() === 'converting' ? m('label', {}, app.translator.trans('fof-gamification.admin.page.convert.converting')) : m('label', {}, app.translator.trans('fof-gamification.admin.page.convert.converted', {
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
        oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_5___default()('value', _this2.updatePoints.bind(_this2, rank))
      }), m('input', {
        className: 'FormControl Ranks-name',
        value: rank.name(),
        placeholder: app.translator.trans('fof-gamification.admin.page.ranks.help.name'),
        oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_5___default()('value', _this2.updateName.bind(_this2, rank))
      }), m('input', {
        className: 'FormControl Ranks-color',
        value: rank.color(),
        placeholder: app.translator.trans('fof-gamification.admin.page.ranks.help.color'),
        oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_5___default()('value', _this2.updateColor.bind(_this2, rank))
      }), flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_8___default.a.component({
        className: 'FormControl Ranks-group',
        options: groups,
        value: Array.isArray(rank.groups()) ? rank.groups()[0] : rank.groups(),
        placeholder: app.translator.trans('fof-gamification.admin.page.ranks.help.group'),
        onchange: _this2.updateGroups.bind(_this2, rank)
      }), flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default.a.component({
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
      oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_5___default()('value', this.newRank.points)
    }), m('input', {
      className: 'FormControl Ranks-name',
      value: this.newRank.name(),
      placeholder: app.translator.trans('fof-gamification.admin.page.ranks.help.name'),
      oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_5___default()('value', this.newRank.name)
    }), m('input', {
      className: 'FormControl Ranks-color',
      value: this.newRank.color(),
      placeholder: app.translator.trans('fof-gamification.admin.page.ranks.help.color'),
      oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_5___default()('value', this.newRank.color)
    }), flarum_common_components_Select__WEBPACK_IMPORTED_MODULE_8___default.a.component({
      className: 'FormControl Ranks-group',
      options: groups,
      value: this.newRank.groups(),
      placeholder: app.translator.trans('fof-gamification.admin.page.ranks.help.group'),
      onChange: this.newRank.groups
    }), flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default.a.component({
      type: 'button',
      className: 'Button Button--warning Ranks-button',
      icon: 'fa fa-plus',
      onclick: this.addRank.bind(this)
    })])),
    /*m('legend', {}, app.translator.trans('fof-gamification.admin.page.ranks-group.title')),
    m('label', {}, app.translator.trans('fof-gamification.admin.page.ranks-group.label')),
    m('div', { className: 'helpText' }, app.translator.trans('fof-gamification.admin.page.ranks-group.help')),
    m(
        'div',
        { className: 'Ranks--Container' },
        this.ranks.map((rank) => {
            return m('div', { style: 'float: left;' }, [
                m('input', {
                    className: 'FormControl Ranks-name',
                    value: rank.name(),
                    placeholder: app.translator.trans('fof-gamification.admin.page.ranks.help.name'),
                    oninput: withAttr('value', this.updateName.bind(this, rank)),
                }),
                Select.component({
                    className: 'FormControl Ranks-group',
                    options: groups,
                    value: Array.isArray(rank.groups()) ? rank.groups()[0] : rank.groups(),
                    placeholder: app.translator.trans('fof-gamification.admin.page.ranks.help.group'),
                    onchange: this.updateGroups.bind(this, rank),
                }),
                Button.component({
                    type: 'button',
                    className: 'Button Button--warning Ranks-button',
                    icon: 'fa fa-times',
                    onclick: this.deleteRank.bind(this, rank),
                }),
            ]);
        }),
        m('legend', {}, app.translator.trans('fof-gamification.admin.page.group-sticky-rank.title')),
        m('label', {}, app.translator.trans('fof-gamification.admin.page.group-sticky-rank.label')),
        m('div', { className: 'helpText' }, app.translator.trans('fof-gamification.admin.page.group-sticky-rank.help.help')),
        m('div', { style: 'float: left; margin-bottom: 15px' }, [
            Select.component({
                className: 'FormControl Ranks-name',
                options: groups,
                //value: this.newRank.groups(),
                placeholder: app.translator.trans('fof-gamification.admin.page.ranks.help.group'),
                onChange: withAttr('value', this.newRank.groups),
            }),
            Select.component({
                className: 'FormControl Ranks-group',
                //options: this.ranks,
                //value: this.newRank.groups(),
                placeholder: app.translator.trans('fof-gamification.admin.page.ranks.help.group'),
                onChange: withAttr('value', this.newRank.groups),
            }),
            Button.component({
                type: 'button',
                className: 'Button Button--warning Ranks-button',
                icon: 'fa fa-plus',
                //onclick: this.addRank.bind(this),
            }),
        ])
    ),*/
    m('label', {}, app.translator.trans('fof-gamification.admin.page.ranks.number_title')), m('input', {
      className: 'FormControl Ranks-default',
      value: this.values.rankAmt() || '',
      placeholder: 2,
      oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_5___default()('value', this.values.rankAmt)
    }), m('legend', {}, app.translator.trans('fof-gamification.admin.page.votes.title')), m('label', {}, app.translator.trans('fof-gamification.admin.page.votes.icon_name')), m('div', {
      className: 'helpText'
    }, app.translator.trans('fof-gamification.admin.page.votes.icon_help')), m('input', {
      className: 'FormControl Ranks-default',
      value: this.values.iconName() || '',
      placeholder: 'thumbs',
      oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_5___default()('value', this.values.iconName)
    }), flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_4___default.a.component({
      state: this.values.allowSelfVote(),
      onchange: this.values.allowSelfVote,
      className: 'votes-switch'
    }, app.translator.trans('fof-gamification.admin.page.votes.allow_selfvote')), flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_4___default.a.component({
      state: this.values.autoUpvotePosts() || false,
      onchange: this.values.autoUpvotePosts,
      className: 'votes-switch'
    }, app.translator.trans('fof-gamification.admin.page.votes.auto_upvote')), flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_4___default.a.component({
      state: this.values.rateLimit() || false,
      onchange: this.values.rateLimit,
      className: 'votes-switch'
    }, app.translator.trans('fof-gamification.admin.page.votes.rate_limit')), flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_4___default.a.component({
      state: this.values.showVotesOnDiscussionPage() || false,
      onchange: this.values.showVotesOnDiscussionPage,
      className: 'votes-switch'
    }, app.translator.trans('fof-gamification.admin.page.votes.discussion_page')), flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_4___default.a.component({
      state: this.values.useAlternateLayout() || false,
      onchange: this.values.useAlternateLayout,
      className: 'votes-switch'
    }, app.translator.trans('fof-gamification.admin.page.votes.alternate_layout')), m('label', {}, app.translator.trans('fof-gamification.admin.page.votes.points_title')), m('input', {
      className: 'FormControl Ranks-default',
      value: this.values.pointsPlaceholder() || '',
      placeholder: app.translator.trans('fof-gamification.admin.page.votes.points_placeholder') + '{points}',
      oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_5___default()('value', this.values.pointsPlaceholder)
    }), m('legend', {}, app.translator.trans('fof-gamification.admin.page.rankings.title')), flarum_common_components_Switch__WEBPACK_IMPORTED_MODULE_4___default.a.component({
      state: this.values.customRankingImages() || false,
      onchange: this.values.customRankingImages,
      className: 'votes-switch'
    }, app.translator.trans('fof-gamification.admin.page.rankings.enable')), m('label', {}, app.translator.trans('fof-gamification.admin.page.rankings.blocked.title')), m('input', {
      className: 'FormControl Ranks-blocked',
      placeholder: app.translator.trans('fof-gamification.admin.page.rankings.blocked.placeholder'),
      value: this.values.blockedUsers() || '',
      oninput: flarum_common_utils_withAttr__WEBPACK_IMPORTED_MODULE_5___default()('value', this.values.blockedUsers)
    }), m('div', {
      className: 'helpText'
    }, app.translator.trans('fof-gamification.admin.page.rankings.blocked.help'))].concat([1, 2, 3].map(function (num) {
      return [m("label", {
        className: "Upload-label"
      }, app.translator.trans("fof-gamification.admin.page.rankings.custom_image_" + num)), m(_UploadImageButton__WEBPACK_IMPORTED_MODULE_7__["default"], {
        className: "Upload-button",
        name: "fof-gamification.topimage" + num,
        path: "fof/gamification/topimage" + num
      }), m("br", null)];
    }), [flarum_common_components_Button__WEBPACK_IMPORTED_MODULE_2___default.a.component({
      type: 'submit',
      className: 'Button Button--primary Ranks-save',
      loading: this.loading,
      disabled: !this.changed()
    }, app.translator.trans('fof-gamification.admin.page.save_settings'))]))])])])];
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

  _proto.updateGroups = function updateGroups(rank, value) {
    rank.save({
      groups: value
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
      color: this.newRank.color(),
      groups: this.newRank.groups()
    }).then(function (rank) {
      _this4.newRank.color('');

      _this4.newRank.name('');

      _this4.newRank.points('');

      _this4.newRank.groups('');

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
    flarum_admin_utils_saveSettings__WEBPACK_IMPORTED_MODULE_3___default()(settings).then(function () {
      app.alerts.show({
        type: 'success'
      }, app.translator.trans('core.admin.basics.saved_message'));
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
}(flarum_admin_components_ExtensionPage__WEBPACK_IMPORTED_MODULE_1___default.a);



/***/ }),

/***/ "./src/admin/components/UploadImageButton.js":
/*!***************************************************!*\
  !*** ./src/admin/components/UploadImageButton.js ***!
  \***************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "default", function() { return UploadImageButton; });
/* harmony import */ var _babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! @babel/runtime/helpers/esm/inheritsLoose */ "./node_modules/@babel/runtime/helpers/esm/inheritsLoose.js");
/* harmony import */ var flarum_admin_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! flarum/admin/components/UploadImageButton */ "flarum/admin/components/UploadImageButton");
/* harmony import */ var flarum_admin_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_1___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_1__);



var UploadImageButton = /*#__PURE__*/function (_FlarumUploadImageBut) {
  Object(_babel_runtime_helpers_esm_inheritsLoose__WEBPACK_IMPORTED_MODULE_0__["default"])(UploadImageButton, _FlarumUploadImageBut);

  function UploadImageButton() {
    return _FlarumUploadImageBut.apply(this, arguments) || this;
  }

  var _proto = UploadImageButton.prototype;

  _proto.resourceUrl = function resourceUrl() {
    return app.forum.attribute('apiUrl') + '/' + this.attrs.path;
  };

  return UploadImageButton;
}(flarum_admin_components_UploadImageButton__WEBPACK_IMPORTED_MODULE_1___default.a);



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
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! flarum/admin/app */ "flarum/admin/app");
/* harmony import */ var flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default = /*#__PURE__*/__webpack_require__.n(flarum_admin_app__WEBPACK_IMPORTED_MODULE_0__);
/* harmony import */ var _components_SettingsPage__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ./components/SettingsPage */ "./src/admin/components/SettingsPage.js");
/* harmony import */ var _common_models_Rank__WEBPACK_IMPORTED_MODULE_2__ = __webpack_require__(/*! ../common/models/Rank */ "./src/common/models/Rank.js");
/* harmony import */ var _common_helpers__WEBPACK_IMPORTED_MODULE_3__ = __webpack_require__(/*! ../common/helpers */ "./src/common/helpers/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "helpers", function() { return _common_helpers__WEBPACK_IMPORTED_MODULE_3__["helpers"]; });

/* harmony import */ var _components__WEBPACK_IMPORTED_MODULE_4__ = __webpack_require__(/*! ./components */ "./src/admin/components/index.js");
/* harmony reexport (safe) */ __webpack_require__.d(__webpack_exports__, "components", function() { return _components__WEBPACK_IMPORTED_MODULE_4__["components"]; });




flarum_admin_app__WEBPACK_IMPORTED_MODULE_0___default.a.initializers.add('fof-gamification', function (app) {
  app.store.models.ranks = _common_models_Rank__WEBPACK_IMPORTED_MODULE_2__["default"];
  app.extensionData["for"]('fof-gamification').registerPermission({
    icon: 'fas fa-thumbs-up',
    label: app.translator.trans('fof-gamification.admin.permissions.vote_label'),
    permission: 'discussion.votePosts'
  }, 'reply').registerPermission({
    icon: 'fas fa-info-circle',
    label: app.translator.trans('fof-gamification.admin.permissions.see_votes_label'),
    permission: 'discussion.canSeeVotes'
  }, 'view').registerPermission({
    icon: 'fas fa-trophy',
    label: app.translator.trans('fof-gamification.admin.permissions.see_ranking_page'),
    permission: 'fof.gamification.viewRankingPage'
  }, 'view').registerPage(_components_SettingsPage__WEBPACK_IMPORTED_MODULE_1__["default"]);
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
  color: flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('color'),
  groups: flarum_common_Model__WEBPACK_IMPORTED_MODULE_1___default.a.attribute('groups')
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

/***/ "flarum/admin/app":
/*!**************************************************!*\
  !*** external "flarum.core.compat['admin/app']" ***!
  \**************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['admin/app'];

/***/ }),

/***/ "flarum/admin/components/ExtensionPage":
/*!***********************************************************************!*\
  !*** external "flarum.core.compat['admin/components/ExtensionPage']" ***!
  \***********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['admin/components/ExtensionPage'];

/***/ }),

/***/ "flarum/admin/components/UploadImageButton":
/*!***************************************************************************!*\
  !*** external "flarum.core.compat['admin/components/UploadImageButton']" ***!
  \***************************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['admin/components/UploadImageButton'];

/***/ }),

/***/ "flarum/admin/utils/saveSettings":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['admin/utils/saveSettings']" ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['admin/utils/saveSettings'];

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

/***/ "flarum/common/components/Select":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Select']" ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['common/components/Select'];

/***/ }),

/***/ "flarum/common/components/Switch":
/*!*****************************************************************!*\
  !*** external "flarum.core.compat['common/components/Switch']" ***!
  \*****************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['common/components/Switch'];

/***/ }),

/***/ "flarum/common/utils/Stream":
/*!************************************************************!*\
  !*** external "flarum.core.compat['common/utils/Stream']" ***!
  \************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['common/utils/Stream'];

/***/ }),

/***/ "flarum/common/utils/mixin":
/*!***********************************************************!*\
  !*** external "flarum.core.compat['common/utils/mixin']" ***!
  \***********************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['common/utils/mixin'];

/***/ }),

/***/ "flarum/common/utils/withAttr":
/*!**************************************************************!*\
  !*** external "flarum.core.compat['common/utils/withAttr']" ***!
  \**************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

module.exports = flarum.core.compat['common/utils/withAttr'];

/***/ })

/******/ });
//# sourceMappingURL=admin.js.map