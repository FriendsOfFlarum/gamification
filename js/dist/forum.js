module.exports=function(t){var o={};function n(e){if(o[e])return o[e].exports;var r=o[e]={i:e,l:!1,exports:{}};return t[e].call(r.exports,r,r.exports,n),r.l=!0,r.exports}return n.m=t,n.c=o,n.d=function(t,o,e){n.o(t,o)||Object.defineProperty(t,o,{enumerable:!0,get:e})},n.r=function(t){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})},n.t=function(t,o){if(1&o&&(t=n(t)),8&o)return t;if(4&o&&"object"==typeof t&&t&&t.__esModule)return t;var e=Object.create(null);if(n.r(e),Object.defineProperty(e,"default",{enumerable:!0,value:t}),2&o&&"string"!=typeof t)for(var r in t)n.d(e,r,function(o){return t[o]}.bind(null,r));return e},n.n=function(t){var o=t&&t.__esModule?function(){return t.default}:function(){return t};return n.d(o,"a",o),o},n.o=function(t,o){return Object.prototype.hasOwnProperty.call(t,o)},n.p="",n(n.s=51)}([function(t,o){t.exports=flarum.core.compat["forum/app"]},,function(t,o){t.exports=flarum.core.compat["common/extend"]},function(t,o){t.exports=flarum.core.compat["common/Model"]},function(t,o){t.exports=flarum.core.compat["common/components/Button"]},function(t,o,n){"use strict";function e(t,o){return(e=Object.setPrototypeOf||function(t,o){return t.__proto__=o,t})(t,o)}function r(t,o){t.prototype=Object.create(o.prototype),t.prototype.constructor=t,e(t,o)}n.d(o,"a",(function(){return r}))},,function(t,o){t.exports=flarum.core.compat["common/components/LoadingIndicator"]},function(t,o,n){"use strict";n.d(o,"a",(function(){return s}));var e=n(5),r=n(3),a=n.n(r),i=n(21),s=function(t){function o(){return t.apply(this,arguments)||this}return Object(e.a)(o,t),o}(n.n(i)()(a.a,{points:a.a.attribute("points"),name:a.a.attribute("name"),color:a.a.attribute("color")}))},function(t,o,n){"use strict";function e(t,o){void 0===o&&(o={}),o.style=o.style||{},o.className="rankLabel "+(o.className||"");var n=t.color();return o.style.backgroundColor=o.style.color=n,o.className+=" colored",m("span",o,m("span",{className:"rankLabel-text"},t.name()))}n.d(o,"a",(function(){return e}))},function(t,o){t.exports=flarum.core.compat["common/models/Post"]},,function(t,o){t.exports=flarum.core.compat["common/helpers/icon"]},function(t,o){t.exports=flarum.core.compat["common/helpers/avatar"]},function(t,o){t.exports=flarum.core.compat["common/components/Link"]},function(t,o){t.exports=flarum.core.compat["common/utils/abbreviateNumber"]},function(t,o){t.exports=flarum.core.compat["forum/components/CommentPost"]},function(t,o){t.exports=flarum.core.compat["common/models/Discussion"]},,function(t,o,n){"use strict";n.d(o,"a",(function(){return e}));var e={Rank:n(8).a}},function(t,o,n){"use strict";n.d(o,"a",(function(){return e}));var e={rankLabel:n(9).a}},function(t,o){t.exports=flarum.core.compat["common/utils/mixin"]},function(t,o){t.exports=flarum.core.compat["forum/components/IndexPage"]},function(t,o){t.exports=flarum.core.compat["forum/components/DiscussionListItem"]},function(t,o){t.exports=flarum.core.compat["forum/components/DiscussionPage"]},function(t,o){t.exports=flarum.core.compat["common/helpers/username"]},function(t,o){t.exports=flarum.core.compat["common/utils/classList"]},,function(t,o){t.exports=flarum.core.compat["common/models/User"]},function(t,o){t.exports=flarum.core.compat["forum/components/UserCard"]},function(t,o,n){t.exports=n(50)},function(t,o){t.exports=flarum.core.compat["common/components/Page"]},function(t,o){t.exports=flarum.core.compat["common/helpers/listItems"]},function(t,o){t.exports=flarum.core.compat["forum/states/DiscussionListState"]},function(t,o){t.exports=flarum.core.compat["common/components/LinkButton"]},function(t,o){t.exports=flarum.core.compat["forum/utils/PostControls"]},function(t,o){t.exports=flarum.core.compat["common/components/Modal"]},function(t,o){t.exports=flarum.core.compat["forum/utils/DiscussionControls"]},function(t,o){t.exports=flarum.core.compat["forum/components/PostUser"]},function(t,o,n){(function(o){var n=/^\s+|\s+$/g,e=/^[-+]0x[0-9a-f]+$/i,r=/^0b[01]+$/i,a=/^0o[0-7]+$/i,i=parseInt,s="object"==typeof o&&o&&o.Object===Object&&o,c="object"==typeof self&&self&&self.Object===Object&&self,u=s||c||Function("return this")(),f=Object.prototype.toString,l=Math.max,m=Math.min,p=function(){return u.Date.now()};function d(t){var o=typeof t;return!!t&&("object"==o||"function"==o)}function v(t){if("number"==typeof t)return t;if(function(t){return"symbol"==typeof t||function(t){return!!t&&"object"==typeof t}(t)&&"[object Symbol]"==f.call(t)}(t))return NaN;if(d(t)){var o="function"==typeof t.valueOf?t.valueOf():t;t=d(o)?o+"":o}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(n,"");var s=r.test(t);return s||a.test(t)?i(t.slice(2),s?2:8):e.test(t)?NaN:+t}t.exports=function(t,o,n){var e,r,a,i,s,c,u=0,f=!1,h=!1,y=!0;if("function"!=typeof t)throw new TypeError("Expected a function");function g(o){var n=e,a=r;return e=r=void 0,u=o,i=t.apply(a,n)}function b(t){return u=t,s=setTimeout(w,o),f?g(t):i}function x(t){var n=t-c;return void 0===c||n>=o||n<0||h&&t-u>=a}function w(){var t=p();if(x(t))return N(t);s=setTimeout(w,function(t){var n=o-(t-c);return h?m(n,a-(t-u)):n}(t))}function N(t){return s=void 0,y&&e?g(t):(e=r=void 0,i)}function L(){var t=p(),n=x(t);if(e=arguments,r=this,c=t,n){if(void 0===s)return b(c);if(h)return s=setTimeout(w,o),g(c)}return void 0===s&&(s=setTimeout(w,o)),i}return o=v(o)||0,d(n)&&(f=!!n.leading,a=(h="maxWait"in n)?l(v(n.maxWait)||0,o):a,y="trailing"in n?!!n.trailing:y),L.cancel=function(){void 0!==s&&clearTimeout(s),u=0,e=c=r=s=void 0},L.flush=function(){return void 0===s?i:N(p())},L}}).call(this,n(49))},function(t,o){t.exports=flarum.core.compat["common/states/DiscussionListState"]},function(t,o){t.exports=flarum.core.compat["forum/components/Notification"]},function(t,o){t.exports=flarum.core.compat["forum/components/NotificationGrid"]},function(t,o){t.exports=flarum.core.compat["common/Component"]},function(t,o){t.exports=flarum.core.compat["common/components/Tooltip"]},function(t,o){t.exports=flarum.core.compat["common/utils/SubtreeRetainer"]},,,,function(t,o){var n;n=function(){return this}();try{n=n||new Function("return this")()}catch(t){"object"==typeof window&&(n=window)}t.exports=n},function(t,o,n){var e=function(t){"use strict";var o=Object.prototype,n=o.hasOwnProperty,e="function"==typeof Symbol?Symbol:{},r=e.iterator||"@@iterator",a=e.asyncIterator||"@@asyncIterator",i=e.toStringTag||"@@toStringTag";function s(t,o,n){return Object.defineProperty(t,o,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[o]}try{s({},"")}catch(t){s=function(t,o,n){return t[o]=n}}function c(t,o,n,e){var r=o&&o.prototype instanceof l?o:l,a=Object.create(r.prototype),i=new L(e||[]);return a._invoke=function(t,o,n){var e="suspendedStart";return function(r,a){if("executing"===e)throw new Error("Generator is already running");if("completed"===e){if("throw"===r)throw a;return k()}for(n.method=r,n.arg=a;;){var i=n.delegate;if(i){var s=x(i,n);if(s){if(s===f)continue;return s}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if("suspendedStart"===e)throw e="completed",n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);e="executing";var c=u(t,o,n);if("normal"===c.type){if(e=n.done?"completed":"suspendedYield",c.arg===f)continue;return{value:c.arg,done:n.done}}"throw"===c.type&&(e="completed",n.method="throw",n.arg=c.arg)}}}(t,n,i),a}function u(t,o,n){try{return{type:"normal",arg:t.call(o,n)}}catch(t){return{type:"throw",arg:t}}}t.wrap=c;var f={};function l(){}function m(){}function p(){}var d={};s(d,r,(function(){return this}));var v=Object.getPrototypeOf,h=v&&v(v(O([])));h&&h!==o&&n.call(h,r)&&(d=h);var y=p.prototype=l.prototype=Object.create(d);function g(t){["next","throw","return"].forEach((function(o){s(t,o,(function(t){return this._invoke(o,t)}))}))}function b(t,o){var e;this._invoke=function(r,a){function i(){return new o((function(e,i){!function e(r,a,i,s){var c=u(t[r],t,a);if("throw"!==c.type){var f=c.arg,l=f.value;return l&&"object"==typeof l&&n.call(l,"__await")?o.resolve(l.__await).then((function(t){e("next",t,i,s)}),(function(t){e("throw",t,i,s)})):o.resolve(l).then((function(t){f.value=t,i(f)}),(function(t){return e("throw",t,i,s)}))}s(c.arg)}(r,a,e,i)}))}return e=e?e.then(i,i):i()}}function x(t,o){var n=t.iterator[o.method];if(void 0===n){if(o.delegate=null,"throw"===o.method){if(t.iterator.return&&(o.method="return",o.arg=void 0,x(t,o),"throw"===o.method))return f;o.method="throw",o.arg=new TypeError("The iterator does not provide a 'throw' method")}return f}var e=u(n,t.iterator,o.arg);if("throw"===e.type)return o.method="throw",o.arg=e.arg,o.delegate=null,f;var r=e.arg;return r?r.done?(o[t.resultName]=r.value,o.next=t.nextLoc,"return"!==o.method&&(o.method="next",o.arg=void 0),o.delegate=null,f):r:(o.method="throw",o.arg=new TypeError("iterator result is not an object"),o.delegate=null,f)}function w(t){var o={tryLoc:t[0]};1 in t&&(o.catchLoc=t[1]),2 in t&&(o.finallyLoc=t[2],o.afterLoc=t[3]),this.tryEntries.push(o)}function N(t){var o=t.completion||{};o.type="normal",delete o.arg,t.completion=o}function L(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(w,this),this.reset(!0)}function O(t){if(t){var o=t[r];if(o)return o.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var e=-1,a=function o(){for(;++e<t.length;)if(n.call(t,e))return o.value=t[e],o.done=!1,o;return o.value=void 0,o.done=!0,o};return a.next=a}}return{next:k}}function k(){return{value:void 0,done:!0}}return m.prototype=p,s(y,"constructor",p),s(p,"constructor",m),m.displayName=s(p,i,"GeneratorFunction"),t.isGeneratorFunction=function(t){var o="function"==typeof t&&t.constructor;return!!o&&(o===m||"GeneratorFunction"===(o.displayName||o.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,p):(t.__proto__=p,s(t,i,"GeneratorFunction")),t.prototype=Object.create(y),t},t.awrap=function(t){return{__await:t}},g(b.prototype),s(b.prototype,a,(function(){return this})),t.AsyncIterator=b,t.async=function(o,n,e,r,a){void 0===a&&(a=Promise);var i=new b(c(o,n,e,r),a);return t.isGeneratorFunction(n)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},g(y),s(y,i,"Generator"),s(y,r,(function(){return this})),s(y,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var o=[];for(var n in t)o.push(n);return o.reverse(),function n(){for(;o.length;){var e=o.pop();if(e in t)return n.value=e,n.done=!1,n}return n.done=!0,n}},t.values=O,L.prototype={constructor:L,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=void 0,this.done=!1,this.delegate=null,this.method="next",this.arg=void 0,this.tryEntries.forEach(N),!t)for(var o in this)"t"===o.charAt(0)&&n.call(this,o)&&!isNaN(+o.slice(1))&&(this[o]=void 0)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var o=this;function e(n,e){return i.type="throw",i.arg=t,o.next=n,e&&(o.method="next",o.arg=void 0),!!e}for(var r=this.tryEntries.length-1;r>=0;--r){var a=this.tryEntries[r],i=a.completion;if("root"===a.tryLoc)return e("end");if(a.tryLoc<=this.prev){var s=n.call(a,"catchLoc"),c=n.call(a,"finallyLoc");if(s&&c){if(this.prev<a.catchLoc)return e(a.catchLoc,!0);if(this.prev<a.finallyLoc)return e(a.finallyLoc)}else if(s){if(this.prev<a.catchLoc)return e(a.catchLoc,!0)}else{if(!c)throw new Error("try statement without catch or finally");if(this.prev<a.finallyLoc)return e(a.finallyLoc)}}}},abrupt:function(t,o){for(var e=this.tryEntries.length-1;e>=0;--e){var r=this.tryEntries[e];if(r.tryLoc<=this.prev&&n.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var a=r;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=o&&o<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=o,a?(this.method="next",this.next=a.finallyLoc,f):this.complete(i)},complete:function(t,o){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&o&&(this.next=o),f},finish:function(t){for(var o=this.tryEntries.length-1;o>=0;--o){var n=this.tryEntries[o];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),N(n),f}},catch:function(t){for(var o=this.tryEntries.length-1;o>=0;--o){var n=this.tryEntries[o];if(n.tryLoc===t){var e=n.completion;if("throw"===e.type){var r=e.arg;N(n)}return r}}throw new Error("illegal catch attempt")},delegateYield:function(t,o,n){return this.delegate={iterator:O(t),resultName:o,nextLoc:n},"next"===this.method&&(this.arg=void 0),f}},t}(t.exports);try{regeneratorRuntime=e}catch(t){"object"==typeof globalThis?globalThis.regeneratorRuntime=e:Function("r","regeneratorRuntime = r")(e)}},function(t,o,n){"use strict";n.r(o),n.d(o,"models",(function(){return e.a})),n.d(o,"components",(function(){return Et})),n.d(o,"helpers",(function(){return Bt}));var e=n(19),r=n(0),a=n.n(r),i=n(3),s=n.n(i),c=n(17),u=n.n(c),f=n(10),l=n.n(f),p=n(28),d=n.n(p),v=n(8),h=n(5),y=n(13),g=n.n(y),b=n(31),x=n.n(b),w=n(22),N=n.n(w),L=n(4),O=n.n(L),k=n(7),j=n.n(k),P=n(32),V=n.n(P),F=n(25),_=n.n(F),I=n(12),S=n.n(I),E=function(t,o){void 0===o&&(o=!1);var n=a.a.data["fof-gamification."+t];return o?!!parseInt(n):n},G=n(14),R=n.n(G),B=function(t){function o(){return t.apply(this,arguments)||this}Object(h.a)(o,t);var n=o.prototype;return n.oninit=function(o){t.prototype.oninit.call(this,o),app.session.user&&!0===app.session.user.data.attributes.canViewRankingPage||m.route.set("/"),this.loading=!0,this.users=[],this.refresh()},n.view=function(){var t,o=this;return t=this.loading?j.a.component():O.a.component({className:"Button",onclick:this.loadMore.bind(this)},app.translator.trans("core.forum.discussion_list.load_more_button")),m("div",{className:"IndexPage"},N.a.prototype.hero(),m("div",{className:"container"},m("div",{className:"sideNavContainer"},m("nav",{className:"IndexPage-nav sideNav"},m("ul",null,V()(N.a.prototype.sidebarItems().toArray()))),m("div",{className:"IndexPage-results sideNavOffset"},m("table",{class:"rankings"},m("tr",null,m("th",{className:"rankings-mobile"},app.translator.trans("fof-gamification.forum.ranking.rank")),m("th",null,app.translator.trans("fof-gamification.forum.ranking.name")),m("th",null,app.translator.trans("fof-gamification.forum.ranking.amount"))),this.users.map((function(t,n){return++n,[m("tr",{className:"ranking-"+n},n<4?E("customRankingImages",!0)?m("img",{className:"rankings-mobile rankings-image",src:app.forum.attribute("baseUrl")+app.forum.attribute("fof-gamification.topimage"+n+"Url")}):m("td",{className:"rankings-mobile rankings-"+n},S()("fas fa-trophy")):m("td",{className:"rankings-4 rankings-mobile"},o.addOrdinalSuffix(n)),m("td",null,m("div",{className:"PostUser"},m("h3",{className:"rankings-info"},m(R.a,{href:app.route.user(t),force:!0},n<4?g()(t,{className:"info-avatar rankings-"+n+"-avatar"}):""," ",_()(t))))),n<4?m("td",{className:"rankings-"+n},t.points()):m("td",{className:"rankings-4"},t.points()))]}))),m("div",{className:"rankings-loadmore"}," ",t)))))},n.refresh=function(t){var o=this;return void 0===t&&(t=!0),t&&(this.loading=!0,this.users=[]),this.loadResults().then((function(t){o.users=[],o.parseResults(t)}),(function(){o.loading=!1,m.redraw()}))},n.addOrdinalSuffix=function(t){if("en"===app.data.locale){var o=t%10,n=t%100;return 1===o&&11!==n?t+"st":2===o&&12!==n?t+"nd":3===o&&13!==n?t+"rd":t+"th"}return t},n.loadResults=function(t){var o={};return o.page={offset:t,limit:"10"},app.store.find("rankings",o)},n.loadMore=function(){this.loading=!0,this.loadResults(this.users.length).then(this.parseResults.bind(this))},n.parseResults=function(t){return[].push.apply(this.users,t),this.loading=!1,this.users.sort((function(t,o){return parseFloat(o.points())-parseFloat(t.points())})),m.redraw(),t},o}(x.a),D=n(2),M=n(33),U=n.n(M),T=n(34),C=n.n(T),A=n(16),$=n.n(A),z=n(26),H=n.n(z),W=n(35),Y=n.n(W),q=n(36),J=function(t){function o(){return t.apply(this,arguments)||this}Object(h.a)(o,t);var n=o.prototype;return n.className=function(){return"VotesModal Modal--small"},n.title=function(){return a.a.translator.trans("fof-gamification.forum.modal.title")},n.oninit=function(o){t.prototype.oninit.call(this,o),this.loading=!this.attrs.post.upvotes()||!this.attrs.post.downvotes(),this.loading&&this.load()},n.content=function(){var t=this;return this.loading?m("div",{className:"Modal-body"},m(j.a,null)):m("div",{className:"Modal-body"},m("ul",{className:"VotesModal-list"},["upvotes","downvotes"].map((function(o){var n=t.attrs.post[o]();if(n&&n.length)return m("div",null,m("legend",null,a.a.translator.trans("fof-gamification.forum.modal."+o+"_label")),n.map((function(t){return m("li",null,m(R.a,{href:a.a.route.user(t)},g()(t)," ",_()(t)))})))}))))},n.load=function(){return a.a.store.find("posts",this.attrs.post.id(),{include:"upvotes,downvotes"}).then(this.loaded.bind(this))},o}(n.n(q).a),K=n(37),Q=n.n(K),X=function(t,o,n,e,r){if(void 0===r&&(r=t.discussion()),a.a.session.user){if(!r||r.canVote()||t.canVote())return o&&n&&(o=!1,n=!1),e&&e(!0),m.redraw(),t.save([o,n,"vote"]).then((function(){return null}),(function(){return null})).then((function(){e&&e(!1),r&&r.pushAttributes({votes:t.votes()}),m.redraw()}))}else Q.a.replyAction.call(r,!0)},Z=n(23),tt=n.n(Z),ot=n(15),nt=n.n(ot),et=n(38),rt=n.n(et),at=n(29),it=n.n(at),st=n(9),ct=function(){var t=function(t){return function(o){return o&&o.attrs&&o.attrs.className&&String(o.attrs.className).split(" ").includes(t)}};Object(D.extend)(it.a.prototype,"infoItems",(function(t){var o,n=E("pointsPlaceholder"),e=String(this.attrs.user.points());o=n?m("div",null,n.replace("{points}",e)):a.a.translator.trans("fof-gamification.forum.user.points",{points:e}),t.add("points",o)})),Object(D.extend)(it.a.prototype,"view",(function(o){var n=this.attrs.user,e=function o(n,e){var r=[];if(n&&n.children&&Array.isArray(n.children)){var a=n.children.find(t(e));a&&r.push(a),n.children.forEach((function(t){r.push.apply(r,o(t,e))}))}return r}(o,"UserCard-profile")[0],r=Number(E("rankAmt"));if(e){var a=e.children.find(t("UserCard-badges"));return n.ranks()&&(a?n.ranks().reverse().map((function(t,o){if(!r||o<r)return m("li",{className:"User-Rank"},Object(st.a)(t))})).forEach((function(t){t&&a.children.push(t)})):e.children.splice(1,0,m("ul",{className:"UserCard-badges badges"},n.ranks().reverse().map((function(t,o){if(!r||o<r)return m("li",{className:"User-Rank"},Object(st.a)(t))}))))),o}})),Object(D.extend)(rt.a.prototype,"view",(function(t){var o,n=this.attrs.post.user();if(!n)return t;var e,r=t.children.find((e="h3",function(t){return t&&t.tag&&t.tag===e})),a=null!=(o=Number(E("rankAmt")))?o:n.ranks().length;r.children=r.children.concat(n.ranks().reverse().splice(0,a).map((function(t){return m("span",{className:"Post-Rank"},Object(st.a)(t))}))).filter((function(t){return void 0!==t.tag}))}))},ut=n(24),ft=n.n(ut),lt=n(39),mt=n.n(lt),pt=function(t){return a.a.store.find("posts",t).then((function(){return m.redraw()}))},dt=[],vt=function(){Object(D.extend)(ft.a.prototype,"oncreate",(function(){a.a.pusher&&a.a.pusher.then((function(t){t.main.bind("newVote",(function(t){var o,n,e=a.a.store.getById("posts",t.post_id),r=t.user_id;e&&e.votes()!==t.votes&&r!=a.a.session.user.id()&&(o=e.id(),(n=dt[o])?n(o):(n=dt[o]=mt()(pt,1500))(o))}))}))})),Object(D.extend)(ft.a.prototype,"onremove",(function(){a.a.pusher&&a.a.pusher.then((function(t){t.main.unbind("newVote")}))}))},ht=function(t,o){var n=t.firstPost();return n&&void 0!==n[o]()?n[o]():t[o]()};var yt=n(40),gt=n.n(yt);var bt=n(41),xt=function(t){function o(){return t.apply(this,arguments)||this}Object(h.a)(o,t);var n=o.prototype;return n.icon=function(){return this.attrs.notification.content()>0?"fas fa-thumbs-up":"fas fa-thumbs-down"},n.href=function(){return a.a.route.post(this.attrs.notification.subject())},n.content=function(){var t=this.attrs.notification.fromUser(),o=parseInt(this.attrs.notification.content());return o>0?a.a.translator.trans("fof-gamification.forum.notification.upvote",{user:t}):a.a.translator.trans("fof-gamification.forum.notification.downvote",{user:t})},n.excerpt=function(){return this.attrs.notification.subject().contentPlain()},o}(n.n(bt).a),wt=n(42),Nt=n.n(wt);function Lt(t,o,n,e,r,a,i){try{var s=t[a](i),c=s.value}catch(t){return void n(t)}s.done?o(c):Promise.resolve(c).then(e,r)}var Ot=n(30),kt=n.n(Ot),jt=n(43),Pt=n.n(jt),Vt=n(44),Ft=n.n(Vt),_t=n(45),It=n.n(_t),St=function(t){function o(){for(var o,n=arguments.length,e=new Array(n),r=0;r<n;r++)e[r]=arguments[r];return(o=t.call.apply(t,[this].concat(e))||this).subtreeRetainer=void 0,o.lastRenderVotes=-1,o.loading=!1,o}Object(h.a)(o,t);var n=o.prototype;return n.oninit=function(o){var n=this;t.prototype.oninit.call(this,o),this.loading=!this.attrs.post.upvotes(),this.loading&&this.load(),this.subtreeRetainer=new It.a((function(){return n.loading}),(function(){return n.attrs.post.votes()}),(function(){var t,o;return null==(t=n.attrs.post)||null==t.upvotes||null==(o=t.upvotes())?void 0:o.length}))},n.onbeforeupdate=function(o){return t.prototype.onbeforeupdate.call(this,o),this.subtreeRetainer.needsRebuild()},n.onupdate=function(t){this.lastRenderVotes!==this.attrs.post.votes()&&(this.loading=!0,setTimeout((function(){return m.redraw()}),0),this.lastRenderVotes=this.attrs.post.votes(),this.load())},n.view=function(){if(!1===this.attrs.post.votes()||!1===this.attrs.post.upvotes())return m("div",{className:"VotingContainer"},m("div",{className:"FoFGamification-voters"},m("div",{className:"FoFGamification-voters-title"},m("span",{className:"FoFGamification-voters-title-icon"},S()("fas fa-users"),m("span",{className:"FoFGamification-voters-title-label"},a.a.translator.trans("fof-gamification.forum.voters.label")),m("span",{className:"FoFGamification-voters-title-label FoFGamification-voters-title-label--mobile"},a.a.translator.trans("fof-gamification.forum.voters.label")))),m(j.a,{display:"inline"})));var t=this.attrs.post.upvotes();return m("div",{className:"VotingContainer"},m("div",{className:"FoFGamification-voters"},m("div",{className:"FoFGamification-voters-title"},m("span",{className:"FoFGamification-voters-title-icon"},S()("fas fa-users"),m("span",{className:"FoFGamification-voters-title-label"},a.a.translator.trans("fof-gamification.forum.voters.label")),m("span",{className:"FoFGamification-voters-title-label FoFGamification-voters-title-label--mobile"},0===t.length?a.a.translator.trans("fof-gamification.forum.voters.label_none"):a.a.translator.trans("fof-gamification.forum.voters.label")))),m("div",{className:"FoFGamification-voters-message"},0===t.length?a.a.translator.trans("fof-gamification.forum.voters.none"):null),m("div",{className:"FoFGamification-voters-list"},t.slice(0,15).map((function(t){return m(R.a,{href:a.a.route("user",{username:t.slug()}),className:"FoFGamification-voters-item"},m(Ft.a,{text:t.displayName()},g()(t)))})),t.length>15?m("span",{className:"FoFGamification-voters-item FoFGamification-voters-item--plus"},m("span",{className:"Avatar"},"+"+(t.length-15))):null)))},n.load=function(){var t,o=(t=kt.a.mark((function t(){return kt.a.wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,a.a.store.find("posts",this.attrs.post.id(),{include:"upvotes"});case 2:this.loading=!1,m.redraw();case 4:case"end":return t.stop()}}),t,this)})),function(){var o=this,n=arguments;return new Promise((function(e,r){var a=t.apply(o,n);function i(t){Lt(a,e,r,i,s,"next",t)}function s(t){Lt(a,e,r,i,s,"throw",t)}i(void 0)}))});return function(){return o.apply(this,arguments)}}(),o}(Pt.a);var Et={RankingsPage:B,VoteNotification:xt,VotesModal:J,Voters:St};function Gt(){return(Gt=Object.assign||function(t){for(var o=1;o<arguments.length;o++){var n=arguments[o];for(var e in n)Object.prototype.hasOwnProperty.call(n,e)&&(t[e]=n[e])}return t}).apply(this,arguments)}var Rt=n(20),Bt=Gt({saveVote:X,setting:E},Rt.a);a.a.initializers.add("fof-gamification",(function(t){u.a.prototype.votes=s.a.attribute("votes"),u.a.prototype.hasUpvoted=s.a.attribute("hasUpvoted"),u.a.prototype.hasDownvoted=s.a.attribute("hasDownvoted"),u.a.prototype.canVote=s.a.attribute("canVote"),u.a.prototype.seeVotes=s.a.attribute("seeVotes"),d.a.prototype.points=s.a.attribute("points"),d.a.prototype.ranks=s.a.hasMany("ranks"),l.a.prototype.upvotes=s.a.hasMany("upvotes"),l.a.prototype.downvotes=s.a.hasMany("downvotes"),l.a.prototype.votes=s.a.attribute("votes"),l.a.prototype.canVote=s.a.attribute("canVote"),l.a.prototype.canSeeVotes=s.a.attribute("canSeeVotes"),l.a.prototype.hasUpvoted=s.a.attribute("hasUpvoted"),l.a.prototype.hasDownvoted=s.a.attribute("hasDownvoted"),l.a.prototype.seeVoters=s.a.attribute("seeVoters"),t.store.models.ranks=v.a,t.routes.rankings={path:"/rankings",component:B},Object(D.extend)(Y.a,"moderationControls",(function(t,o){o.seeVoters()&&t.add("viewVotes",[m(O.a,{icon:"fas fa-thumbs-up",onclick:function(){a.a.modal.show(J,{post:o})}},a.a.translator.trans("fof-gamification.forum.mod_item"))])})),Object(D.extend)($.a.prototype,"actionItems",(function(t){var o=this,n=this.attrs.post,e=n.hasDownvoted(),r=n.hasUpvoted(),i=E("iconName")||"thumbs",s=E("upVotesOnly",!0),c=n.canSeeVotes(),u=!a.a.session.user||n.canVote(),f=function(t,e){return X(n,t,e,(function(t){return o.voteLoading=t}))};t.add("votes",m("div",{className:H()("CommentPost-votes",E("useAlternateLayout",!0)&&"alternateLayout")},O.a.component({icon:this.voteLoading?void 0:"fas fa-fw fa-"+i+"-up",className:H()("Post-vote Post-upvote",r&&"Post-vote--active"),loading:this.voteLoading,disabled:this.voteLoading||!u||!c,onclick:function(){return f(!r,!1)},"aria-label":a.a.translator.trans("fof-gamification.forum.post.upvote_button")}),m("label",{className:"Post-points"},n.votes()),!s&&O.a.component({icon:this.voteLoading?void 0:"fas fa-fw fa-"+i+"-down",className:H()("Post-vote Post-downvote",e&&"Post-vote--active"),loading:this.voteLoading,disabled:!u||!c,onclick:function(){return f(!1,!e)},"aria-label":a.a.translator.trans("fof-gamification.forum.post.downvote_button")})),10)})),Object(D.extend)(N.a.prototype,"navItems",(function(t){a.a.session.user&&!0===a.a.session.user.data.attributes.canViewRankingPage&&t.add("rankings",C.a.component({href:a.a.route("rankings"),icon:"fas fa-trophy"},a.a.translator.trans("fof-gamification.forum.nav.name")),80)})),Object(D.extend)(U.a.prototype,"sortMap",(function(t){t.hot="-hotness"})),Object(D.extend)(gt.a.prototype,"sortMap",(function(t){t.votes="-votes"})),ct(),E("showVotesOnDiscussionPage",!0)&&!E("useAlternateLayout",!0)&&Object(D.extend)(tt.a.prototype,"infoItems",(function(t){this.attrs.discussion.seeVotes()&&t.add("discussion-votes",m("span",{className:"DiscussionListItem-votes",title:a.a.translator.trans("fof-gamification.forum.votes")},S()("far fa-thumbs-up"),nt()(this.attrs.discussion.votes())),20)})),vt(),a.a.notificationComponents.vote=xt,Object(D.extend)(Nt.a.prototype,"notificationTypes",(function(t){t.add("vote",{name:"vote",icon:"fas fa-thumbs-up",label:a.a.translator.trans("fof-gamification.forum.notification.prefrences.vote")})})),Object(D.extend)(ft.a.prototype,"sidebarItems",(function(t){var o=this.discussion.posts()[0];t.replace("controls",null,100),t.replace("subscription",null,80),null!=o&&null!=o.canSeeVotes&&o.canSeeVotes()&&a.a.forum.attribute("fof-gamification-op-votes-only")&&t.add("op-voters",m(St,{post:o}),90)})),E("useAlternateLayout",!0)&&(Object(D.extend)(tt.a.prototype,"oninit",(function(){var t=this;this.attrs.discussion.seeVotes()&&this.subtree.check((function(){return t.voteLoading}))})),Object(D.extend)(tt.a.prototype,"view",(function(t){var o=this,n=this.attrs.discussion;if(n.seeVotes()&&t&&t.children){var e=t.children.find((function(t){return t&&t.attrs&&t.attrs.className&&t.attrs.className.includes("DiscussionListItem-content")})),r=n.firstPost(),i=ht(n,"hasUpvoted"),s=ht(n,"hasDownvoted"),c=!a.a.session.user||ht(n,"canVote"),u=E("upVotesOnly",!0),f=E("iconNameAlt")||"arrow",l=function(t,n){return X(r,t,n,(function(t){return o.voteLoading=t}))};e.children.unshift(m("div",{className:"DiscussionListItem-votes alternateLayout","data-upvotes-only":u},m(O.a,{className:"DiscussionListItem-voteButton DiscussionListItem-voteButton--up Button Button--icon Button--text",icon:"fas fa-fw fa-"+f+"-up","data-active":i,disabled:!c||this.voteLoading,onclick:function(){return l(!i,!1)},"aria-label":a.a.translator.trans("fof-gamification.forum.post.upvote_button")}),m("span",{class:"DiscussionListItem-voteCount"},nt()(ht(n,"votes")||0)),!u&&m(O.a,{className:"DiscussionListItem-voteButton DiscussionListItem-voteButton--down Button Button--icon Button--text",icon:"fas fa-fw fa-"+f+"-down","data-active":s,disabled:!c||this.voteLoading,onclick:function(){return l(!1,!s)},"aria-label":a.a.translator.trans("fof-gamification.forum.post.downvote_button")}),this.voteLoading&&m(j.a,{display:"inline",size:"small"})))}}))),E("altPostVotingUi",!0)&&(Object(D.extend)($.a.prototype,"actionItems",(function(t){this.attrs.post.isHidden()||t.remove("votes")})),Object(D.extend)($.a.prototype,"classes",(function(t){if(!this.attrs.post.isHidden()){var o=E("upVotesOnly",!0);t.push("votesAlternativeLayout"),o&&t.push("votesUpvotesOnly")}})),Object(D.extend)($.a.prototype,"headerItems",(function(t){var o=this,n=this.attrs.post;if(!n.isHidden()&&n.canSeeVotes()){var e=n.hasDownvoted(),r=n.hasUpvoted(),i=E("iconName")||"thumbs",s=E("upVotesOnly",!0),c=n.canSeeVotes(),u=!a.a.session.user||n.canVote(),f=function(t,e){return X(n,t,e,(function(t){o.voteLoading=t}))};t.add("votes",m("div",{className:"Post-votes alternateLayout","data-upvotes-only":s},m(O.a,{className:"Post-voteButton Post-voteButton--up Button Button--icon Button--text",icon:"fas fa-fw fa-"+i+"-up","data-active":r,disabled:!u||this.voteLoading||!c,onclick:function(){return f(!r,!1)},"aria-label":a.a.translator.trans("fof-gamification.forum.post.upvote_button")}),m("span",{class:"Post-voteCount"},nt()(n.votes()||0)),!s&&m(O.a,{className:"Post-voteButton Post-voteButton--down Button Button--icon Button--text",icon:"fas fa-fw fa-"+i+"-down","data-active":e,disabled:!u||this.voteLoading,onclick:function(){return f(!1,!e)},"aria-label":a.a.translator.trans("fof-gamification.forum.post.downvote_button")}),this.voteLoading&&m(j.a,{display:"inline",size:"small"})),1e4)}})))}))}]);
//# sourceMappingURL=forum.js.map