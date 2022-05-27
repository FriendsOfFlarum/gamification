(()=>{var t={195:(t,o,n)=>{t.exports=n(236)},987:(t,o,n)=>{var e=/^\s+|\s+$/g,r=/^[-+]0x[0-9a-f]+$/i,a=/^0b[01]+$/i,i=/^0o[0-7]+$/i,s=parseInt,c="object"==typeof n.g&&n.g&&n.g.Object===Object&&n.g,u="object"==typeof self&&self&&self.Object===Object&&self,l=c||u||Function("return this")(),f=Object.prototype.toString,m=Math.max,p=Math.min,d=function(){return l.Date.now()};function v(t){var o=typeof t;return!!t&&("object"==o||"function"==o)}function h(t){if("number"==typeof t)return t;if(function(t){return"symbol"==typeof t||function(t){return!!t&&"object"==typeof t}(t)&&"[object Symbol]"==f.call(t)}(t))return NaN;if(v(t)){var o="function"==typeof t.valueOf?t.valueOf():t;t=v(o)?o+"":o}if("string"!=typeof t)return 0===t?t:+t;t=t.replace(e,"");var n=a.test(t);return n||i.test(t)?s(t.slice(2),n?2:8):r.test(t)?NaN:+t}t.exports=function(t,o,n){var e,r,a,i,s,c,u=0,l=!1,f=!1,g=!0;if("function"!=typeof t)throw new TypeError("Expected a function");function y(o){var n=e,a=r;return e=r=void 0,u=o,i=t.apply(a,n)}function b(t){return u=t,s=setTimeout(N,o),l?y(t):i}function w(t){var n=t-c;return void 0===c||n>=o||n<0||f&&t-u>=a}function N(){var t=d();if(w(t))return x(t);s=setTimeout(N,function(t){var n=o-(t-c);return f?p(n,a-(t-u)):n}(t))}function x(t){return s=void 0,g&&e?y(t):(e=r=void 0,i)}function L(){var t=d(),n=w(t);if(e=arguments,r=this,c=t,n){if(void 0===s)return b(c);if(f)return s=setTimeout(N,o),y(c)}return void 0===s&&(s=setTimeout(N,o)),i}return o=h(o)||0,v(n)&&(l=!!n.leading,a=(f="maxWait"in n)?m(h(n.maxWait)||0,o):a,g="trailing"in n?!!n.trailing:g),L.cancel=function(){void 0!==s&&clearTimeout(s),u=0,e=c=r=s=void 0},L.flush=function(){return void 0===s?i:x(d())},L}},236:t=>{var o=function(t){"use strict";var o,n=Object.prototype,e=n.hasOwnProperty,r="function"==typeof Symbol?Symbol:{},a=r.iterator||"@@iterator",i=r.asyncIterator||"@@asyncIterator",s=r.toStringTag||"@@toStringTag";function c(t,o,n){return Object.defineProperty(t,o,{value:n,enumerable:!0,configurable:!0,writable:!0}),t[o]}try{c({},"")}catch(t){c=function(t,o,n){return t[o]=n}}function u(t,o,n,e){var r=o&&o.prototype instanceof h?o:h,a=Object.create(r.prototype),i=new O(e||[]);return a._invoke=function(t,o,n){var e=f;return function(r,a){if(e===p)throw new Error("Generator is already running");if(e===d){if("throw"===r)throw a;return j()}for(n.method=r,n.arg=a;;){var i=n.delegate;if(i){var s=P(i,n);if(s){if(s===v)continue;return s}}if("next"===n.method)n.sent=n._sent=n.arg;else if("throw"===n.method){if(e===f)throw e=d,n.arg;n.dispatchException(n.arg)}else"return"===n.method&&n.abrupt("return",n.arg);e=p;var c=l(t,o,n);if("normal"===c.type){if(e=n.done?d:m,c.arg===v)continue;return{value:c.arg,done:n.done}}"throw"===c.type&&(e=d,n.method="throw",n.arg=c.arg)}}}(t,n,i),a}function l(t,o,n){try{return{type:"normal",arg:t.call(o,n)}}catch(t){return{type:"throw",arg:t}}}t.wrap=u;var f="suspendedStart",m="suspendedYield",p="executing",d="completed",v={};function h(){}function g(){}function y(){}var b={};c(b,a,(function(){return this}));var w=Object.getPrototypeOf,N=w&&w(w(_([])));N&&N!==n&&e.call(N,a)&&(b=N);var x=y.prototype=h.prototype=Object.create(b);function L(t){["next","throw","return"].forEach((function(o){c(t,o,(function(t){return this._invoke(o,t)}))}))}function k(t,o){function n(r,a,i,s){var c=l(t[r],t,a);if("throw"!==c.type){var u=c.arg,f=u.value;return f&&"object"==typeof f&&e.call(f,"__await")?o.resolve(f.__await).then((function(t){n("next",t,i,s)}),(function(t){n("throw",t,i,s)})):o.resolve(f).then((function(t){u.value=t,i(u)}),(function(t){return n("throw",t,i,s)}))}s(c.arg)}var r;this._invoke=function(t,e){function a(){return new o((function(o,r){n(t,e,o,r)}))}return r=r?r.then(a,a):a()}}function P(t,n){var e=t.iterator[n.method];if(e===o){if(n.delegate=null,"throw"===n.method){if(t.iterator.return&&(n.method="return",n.arg=o,P(t,n),"throw"===n.method))return v;n.method="throw",n.arg=new TypeError("The iterator does not provide a 'throw' method")}return v}var r=l(e,t.iterator,n.arg);if("throw"===r.type)return n.method="throw",n.arg=r.arg,n.delegate=null,v;var a=r.arg;return a?a.done?(n[t.resultName]=a.value,n.next=t.nextLoc,"return"!==n.method&&(n.method="next",n.arg=o),n.delegate=null,v):a:(n.method="throw",n.arg=new TypeError("iterator result is not an object"),n.delegate=null,v)}function V(t){var o={tryLoc:t[0]};1 in t&&(o.catchLoc=t[1]),2 in t&&(o.finallyLoc=t[2],o.afterLoc=t[3]),this.tryEntries.push(o)}function F(t){var o=t.completion||{};o.type="normal",delete o.arg,t.completion=o}function O(t){this.tryEntries=[{tryLoc:"root"}],t.forEach(V,this),this.reset(!0)}function _(t){if(t){var n=t[a];if(n)return n.call(t);if("function"==typeof t.next)return t;if(!isNaN(t.length)){var r=-1,i=function n(){for(;++r<t.length;)if(e.call(t,r))return n.value=t[r],n.done=!1,n;return n.value=o,n.done=!0,n};return i.next=i}}return{next:j}}function j(){return{value:o,done:!0}}return g.prototype=y,c(x,"constructor",y),c(y,"constructor",g),g.displayName=c(y,s,"GeneratorFunction"),t.isGeneratorFunction=function(t){var o="function"==typeof t&&t.constructor;return!!o&&(o===g||"GeneratorFunction"===(o.displayName||o.name))},t.mark=function(t){return Object.setPrototypeOf?Object.setPrototypeOf(t,y):(t.__proto__=y,c(t,s,"GeneratorFunction")),t.prototype=Object.create(x),t},t.awrap=function(t){return{__await:t}},L(k.prototype),c(k.prototype,i,(function(){return this})),t.AsyncIterator=k,t.async=function(o,n,e,r,a){void 0===a&&(a=Promise);var i=new k(u(o,n,e,r),a);return t.isGeneratorFunction(n)?i:i.next().then((function(t){return t.done?t.value:i.next()}))},L(x),c(x,s,"Generator"),c(x,a,(function(){return this})),c(x,"toString",(function(){return"[object Generator]"})),t.keys=function(t){var o=[];for(var n in t)o.push(n);return o.reverse(),function n(){for(;o.length;){var e=o.pop();if(e in t)return n.value=e,n.done=!1,n}return n.done=!0,n}},t.values=_,O.prototype={constructor:O,reset:function(t){if(this.prev=0,this.next=0,this.sent=this._sent=o,this.done=!1,this.delegate=null,this.method="next",this.arg=o,this.tryEntries.forEach(F),!t)for(var n in this)"t"===n.charAt(0)&&e.call(this,n)&&!isNaN(+n.slice(1))&&(this[n]=o)},stop:function(){this.done=!0;var t=this.tryEntries[0].completion;if("throw"===t.type)throw t.arg;return this.rval},dispatchException:function(t){if(this.done)throw t;var n=this;function r(e,r){return s.type="throw",s.arg=t,n.next=e,r&&(n.method="next",n.arg=o),!!r}for(var a=this.tryEntries.length-1;a>=0;--a){var i=this.tryEntries[a],s=i.completion;if("root"===i.tryLoc)return r("end");if(i.tryLoc<=this.prev){var c=e.call(i,"catchLoc"),u=e.call(i,"finallyLoc");if(c&&u){if(this.prev<i.catchLoc)return r(i.catchLoc,!0);if(this.prev<i.finallyLoc)return r(i.finallyLoc)}else if(c){if(this.prev<i.catchLoc)return r(i.catchLoc,!0)}else{if(!u)throw new Error("try statement without catch or finally");if(this.prev<i.finallyLoc)return r(i.finallyLoc)}}}},abrupt:function(t,o){for(var n=this.tryEntries.length-1;n>=0;--n){var r=this.tryEntries[n];if(r.tryLoc<=this.prev&&e.call(r,"finallyLoc")&&this.prev<r.finallyLoc){var a=r;break}}a&&("break"===t||"continue"===t)&&a.tryLoc<=o&&o<=a.finallyLoc&&(a=null);var i=a?a.completion:{};return i.type=t,i.arg=o,a?(this.method="next",this.next=a.finallyLoc,v):this.complete(i)},complete:function(t,o){if("throw"===t.type)throw t.arg;return"break"===t.type||"continue"===t.type?this.next=t.arg:"return"===t.type?(this.rval=this.arg=t.arg,this.method="return",this.next="end"):"normal"===t.type&&o&&(this.next=o),v},finish:function(t){for(var o=this.tryEntries.length-1;o>=0;--o){var n=this.tryEntries[o];if(n.finallyLoc===t)return this.complete(n.completion,n.afterLoc),F(n),v}},catch:function(t){for(var o=this.tryEntries.length-1;o>=0;--o){var n=this.tryEntries[o];if(n.tryLoc===t){var e=n.completion;if("throw"===e.type){var r=e.arg;F(n)}return r}}throw new Error("illegal catch attempt")},delegateYield:function(t,n,e){return this.delegate={iterator:_(t),resultName:n,nextLoc:e},"next"===this.method&&(this.arg=o),v}},t}(t.exports);try{regeneratorRuntime=o}catch(t){"object"==typeof globalThis?globalThis.regeneratorRuntime=o:Function("r","regeneratorRuntime = r")(o)}}},o={};function n(e){var r=o[e];if(void 0!==r)return r.exports;var a=o[e]={exports:{}};return t[e](a,a.exports,n),a.exports}n.n=t=>{var o=t&&t.__esModule?()=>t.default:()=>t;return n.d(o,{a:o}),o},n.d=(t,o)=>{for(var e in o)n.o(o,e)&&!n.o(t,e)&&Object.defineProperty(t,e,{enumerable:!0,get:o[e]})},n.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(t){if("object"==typeof window)return window}}(),n.o=(t,o)=>Object.prototype.hasOwnProperty.call(t,o),n.r=t=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(t,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(t,"__esModule",{value:!0})};var e={};(()=>{"use strict";function t(o,n){return t=Object.setPrototypeOf||function(t,o){return t.__proto__=o,t},t(o,n)}function o(o,n){o.prototype=Object.create(n.prototype),o.prototype.constructor=o,t(o,n)}n.r(e),n.d(e,{components:()=>Gt,helpers:()=>Rt,models:()=>c});const r=flarum.core.compat["common/Model"];var a=n.n(r);const i=flarum.core.compat["common/utils/mixin"];var s=function(t){function n(){return t.apply(this,arguments)||this}return o(n,t),n}(n.n(i)()(a(),{points:a().attribute("points"),name:a().attribute("name"),color:a().attribute("color")})),c={Rank:s};const u=flarum.core.compat["forum/app"];var l=n.n(u);const f=flarum.core.compat["common/models/Discussion"];var p=n.n(f);const d=flarum.core.compat["common/models/Post"];var v=n.n(d);const h=flarum.core.compat["common/models/User"];var g=n.n(h);const y=flarum.core.compat["common/helpers/avatar"];var b=n.n(y);const w=flarum.core.compat["common/components/Page"];var N=n.n(w);const x=flarum.core.compat["forum/components/IndexPage"];var L=n.n(x);const k=flarum.core.compat["common/components/Button"];var P=n.n(k);const V=flarum.core.compat["common/components/LoadingIndicator"];var F=n.n(V);const O=flarum.core.compat["common/helpers/listItems"];var _=n.n(O);const j=flarum.core.compat["common/helpers/username"];var I=n.n(j);const E=flarum.core.compat["common/helpers/icon"];var G=n.n(E);const S=function(t,o){void 0===o&&(o=!1);var n=l().data["fof-gamification."+t];return o?!!parseInt(n):n},R=flarum.core.compat["common/components/Link"];var B=n.n(R),D=function(t){function n(){return t.apply(this,arguments)||this}o(n,t);var e=n.prototype;return e.oninit=function(o){t.prototype.oninit.call(this,o),l().forum.attribute("canViewRankingPage")||m.route.set("/"),this.loading=!0,this.users=[],this.refresh()},e.view=function(){var t,o=this;return t=this.loading?F().component():P().component({className:"Button",onclick:this.loadMore.bind(this)},l().translator.trans("core.forum.discussion_list.load_more_button")),m("div",{className:"IndexPage"},L().prototype.hero(),m("div",{className:"container"},m("div",{className:"sideNavContainer"},m("nav",{className:"IndexPage-nav sideNav"},m("ul",null,_()(L().prototype.sidebarItems().toArray()))),m("div",{className:"IndexPage-results sideNavOffset"},m("table",{class:"rankings"},m("tr",null,m("th",{className:"rankings-mobile"},l().translator.trans("fof-gamification.forum.ranking.rank")),m("th",null,l().translator.trans("fof-gamification.forum.ranking.name")),m("th",null,l().translator.trans("fof-gamification.forum.ranking.amount"))),this.users.map((function(t,n){return++n,[m("tr",{className:"ranking-"+n},n<4?S("customRankingImages",!0)?m("img",{className:"rankings-mobile rankings-image",src:l().forum.attribute("baseUrl")+l().forum.attribute("fof-gamification.topimage"+n+"Url")}):m("td",{className:"rankings-mobile rankings-"+n},G()("fas fa-trophy")):m("td",{className:"rankings-4 rankings-mobile"},o.addOrdinalSuffix(n)),m("td",null,m("div",{className:"PostUser"},m("h3",{className:"rankings-info"},m(B(),{href:l().route.user(t),force:!0},n<4?b()(t,{className:"info-avatar rankings-"+n+"-avatar"}):""," ",I()(t))))),n<4?m("td",{className:"rankings-"+n},t.points()):m("td",{className:"rankings-4"},t.points()))]}))),m("div",{className:"rankings-loadmore"}," ",t)))))},e.refresh=function(t){var o=this;return void 0===t&&(t=!0),t&&(this.loading=!0,this.users=[]),this.loadResults().then((function(t){o.users=[],o.parseResults(t)}),(function(){o.loading=!1,m.redraw()}))},e.addOrdinalSuffix=function(t){if("en"===l().data.locale){var o=t%10,n=t%100;return 1===o&&11!==n?t+"st":2===o&&12!==n?t+"nd":3===o&&13!==n?t+"rd":t+"th"}return t},e.loadResults=function(t){var o={};return o.page={offset:t,limit:"10"},l().store.find("rankings",o)},e.loadMore=function(){this.loading=!0,this.loadResults(this.users.length).then(this.parseResults.bind(this))},e.parseResults=function(t){return[].push.apply(this.users,t),this.loading=!1,this.users.sort((function(t,o){return parseFloat(o.points())-parseFloat(t.points())})),m.redraw(),t},n}(N());const U=flarum.core.compat["common/extend"],M=flarum.core.compat["forum/states/DiscussionListState"];var T=n.n(M);const A=flarum.core.compat["common/components/LinkButton"];var C=n.n(A);const $=flarum.core.compat["forum/components/CommentPost"];var z=n.n($);const H=flarum.core.compat["common/utils/classList"];var W=n.n(H);const Y=flarum.core.compat["forum/utils/PostControls"];var q=n.n(Y);const J=flarum.core.compat["common/components/Modal"];var K=function(t){function n(){return t.apply(this,arguments)||this}o(n,t);var e=n.prototype;return e.className=function(){return"VotesModal Modal--small"},e.title=function(){return l().translator.trans("fof-gamification.forum.modal.title")},e.oninit=function(o){t.prototype.oninit.call(this,o),this.loading=!this.attrs.post.upvotes()||!this.attrs.post.downvotes(),this.loading&&this.load()},e.content=function(){var t=this;return this.loading?m("div",{className:"Modal-body"},m(F(),null)):m("div",{className:"Modal-body"},m("ul",{className:"VotesModal-list"},["upvotes","downvotes"].map((function(o){var n=t.attrs.post[o]();if(n&&n.length)return m("div",null,m("legend",null,l().translator.trans("fof-gamification.forum.modal."+o+"_label")),n.map((function(t){return m("li",null,m(B(),{href:l().route.user(t)},b()(t)," ",I()(t)))})))}))))},e.load=function(){return l().store.find("posts",this.attrs.post.id(),{include:"upvotes,downvotes"}).then(this.loaded.bind(this))},n}(n.n(J)());const Q=flarum.core.compat["forum/utils/DiscussionControls"];var X=n.n(Q);const Z=function(t,o,n,e,r){if(void 0===r&&(r=t.discussion()),l().session.user){if(!r||r.canVote()||t.canVote())return o&&n&&(o=!1,n=!1),e&&e(!0),m.redraw(),t.save([o,n,"vote"]).then((function(){return null}),(function(){return null})).then((function(){e&&e(!1),r&&r.pushAttributes({votes:t.votes()}),m.redraw()}))}else X().replyAction.call(r,!0)},tt=flarum.core.compat["forum/components/DiscussionListItem"];var ot=n.n(tt);const nt=flarum.core.compat["common/utils/abbreviateNumber"];var et=n.n(nt);const rt=flarum.core.compat["forum/components/PostUser"];var at=n.n(rt);const it=flarum.core.compat["forum/components/UserCard"];var st=n.n(it);function ct(t,o){void 0===o&&(o={}),o.style=o.style||{},o.className="rankLabel "+(o.className||"");var n=t.color();return o.style.backgroundColor=o.style.color=n,o.className+=" colored",m("span",o,m("span",{className:"rankLabel-text"},t.name()))}function ut(){var t=function(t){return function(o){return o&&o.attrs&&o.attrs.className&&String(o.attrs.className).split(" ").includes(t)}},o=function o(n,e){var r=[];if(n&&n.children&&Array.isArray(n.children)){var a=n.children.find(t(e));a&&r.push(a),n.children.forEach((function(t){r.push.apply(r,o(t,e))}))}return r};(0,U.extend)(st().prototype,"infoItems",(function(t){var o=this.attrs.user;t.add("points",m("div",null,G()("fas fa-medal"),l().translator.trans("fof-gamification.forum.user.card.points",{count:o.points()})))})),(0,U.extend)(st().prototype,"view",(function(n){var e=this.attrs.user,r=o(n,"UserCard-profile")[0],a=Number(S("rankAmt"));if(r){var i=r.children.find(t("UserCard-badges"));return e.ranks()&&(i?e.ranks().reverse().map((function(t,o){if(!a||o<a)return m("li",{className:"User-Rank"},ct(t))})).forEach((function(t){t&&i.children.push(t)})):r.children.splice(1,0,m("ul",{className:"UserCard-badges badges"},e.ranks().reverse().map((function(t,o){if(!a||o<a)return m("li",{className:"User-Rank"},ct(t))}))))),n}})),(0,U.extend)(at().prototype,"view",(function(t){var o,n=this.attrs.post.user();if(!n)return t;var e=t.children.find(("h3",function(t){return t&&t.tag&&"h3"===t.tag})),r=null!=(o=Number(S("rankAmt")))?o:n.ranks().length;e.children=e.children.concat(n.ranks().reverse().splice(0,r).map((function(t){return m("span",{className:"Post-Rank"},ct(t))}))).filter((function(t){return void 0!==t.tag}))}))}const lt=flarum.core.compat["forum/components/DiscussionPage"];var ft=n.n(lt),mt=n(987),pt=n.n(mt),dt=function(t){return l().store.find("posts",t).then((function(){return m.redraw()}))},vt=[];var ht=function(t,o){var n=t.firstPost();return n&&void 0!==n[o]()?n[o]():t[o]()};const gt=flarum.core.compat["common/states/DiscussionListState"];var yt=n.n(gt);const bt=flarum.core.compat["forum/components/Notification"];var wt=function(t){function n(){return t.apply(this,arguments)||this}o(n,t);var e=n.prototype;return e.icon=function(){var t=S("iconName")||"thumbs";return this.attrs.notification.content()>0?"fas fa-"+t+"-up":"fas fa-"+t+"-down"},e.href=function(){return l().route.post(this.attrs.notification.subject())},e.content=function(){var t=this.attrs.notification.fromUser();return parseInt(this.attrs.notification.content())>0?l().translator.trans("fof-gamification.forum.notification.upvote",{user:t}):l().translator.trans("fof-gamification.forum.notification.downvote",{user:t})},e.excerpt=function(){return this.attrs.notification.subject().contentPlain()},n}(n.n(bt)());const Nt=flarum.core.compat["forum/components/NotificationGrid"];var xt=n.n(Nt);function Lt(t,o,n,e,r,a,i){try{var s=t[a](i),c=s.value}catch(t){return void n(t)}s.done?o(c):Promise.resolve(c).then(e,r)}var kt=n(195),Pt=n.n(kt);const Vt=flarum.core.compat["common/Component"];var Ft=n.n(Vt);const Ot=flarum.core.compat["common/components/Tooltip"];var _t=n.n(Ot);const jt=flarum.core.compat["common/utils/SubtreeRetainer"];var It=n.n(jt),Et=function(t){function n(){for(var o,n=arguments.length,e=new Array(n),r=0;r<n;r++)e[r]=arguments[r];return(o=t.call.apply(t,[this].concat(e))||this).subtreeRetainer=void 0,o.lastRenderVotes=-1,o.loading=!1,o}o(n,t);var e=n.prototype;return e.oninit=function(o){var n=this;t.prototype.oninit.call(this,o),this.loading=!this.attrs.post.upvotes(),this.loading&&this.load(),this.subtreeRetainer=new(It())((function(){return n.loading}),(function(){return n.attrs.post.votes()}),(function(){var t,o;return null==(t=n.attrs.post)||null==t.upvotes||null==(o=t.upvotes())?void 0:o.length}))},e.onbeforeupdate=function(o){return t.prototype.onbeforeupdate.call(this,o),this.subtreeRetainer.needsRebuild()},e.onupdate=function(t){this.lastRenderVotes!==this.attrs.post.votes()&&(this.loading=!0,setTimeout((function(){return m.redraw()}),0),this.lastRenderVotes=this.attrs.post.votes(),this.load())},e.view=function(){if(!1===this.attrs.post.votes()||!1===this.attrs.post.upvotes())return m("div",{className:"VotingContainer"},m("div",{className:"FoFGamification-voters"},m("div",{className:"FoFGamification-voters-title"},m("span",{className:"FoFGamification-voters-title-icon"},G()("fas fa-users"),m("span",{className:"FoFGamification-voters-title-label"},l().translator.trans("fof-gamification.forum.voters.label")),m("span",{className:"FoFGamification-voters-title-label FoFGamification-voters-title-label--mobile"},l().translator.trans("fof-gamification.forum.voters.label")))),m(F(),{display:"inline"})));var t=this.attrs.post.upvotes();return m("div",{className:"VotingContainer"},m("div",{className:"FoFGamification-voters"},m("div",{className:"FoFGamification-voters-title"},m("span",{className:"FoFGamification-voters-title-icon"},G()("fas fa-users"),m("span",{className:"FoFGamification-voters-title-label"},l().translator.trans("fof-gamification.forum.voters.label")),m("span",{className:"FoFGamification-voters-title-label FoFGamification-voters-title-label--mobile"},0===t.length?l().translator.trans("fof-gamification.forum.voters.label_none"):l().translator.trans("fof-gamification.forum.voters.label")))),m("div",{className:"FoFGamification-voters-message"},0===t.length?l().translator.trans("fof-gamification.forum.voters.none"):null),m("div",{className:"FoFGamification-voters-list"},t.slice(0,15).map((function(t){return m(B(),{href:l().route("user",{username:t.slug()}),className:"FoFGamification-voters-item"},m(_t(),{text:t.displayName()},b()(t)))})),t.length>15?m("span",{className:"FoFGamification-voters-item FoFGamification-voters-item--plus"},m("span",{className:"Avatar"},"+"+(t.length-15))):null)))},e.load=function(){var t,o=(t=Pt().mark((function t(){return Pt().wrap((function(t){for(;;)switch(t.prev=t.next){case 0:return t.next=2,l().store.find("posts",this.attrs.post.id(),{include:"upvotes"});case 2:this.loading=!1,m.redraw();case 4:case"end":return t.stop()}}),t,this)})),function(){var o=this,n=arguments;return new Promise((function(e,r){var a=t.apply(o,n);function i(t){Lt(a,e,r,i,s,"next",t)}function s(t){Lt(a,e,r,i,s,"throw",t)}i(void 0)}))});return function(){return o.apply(this,arguments)}}(),n}(Ft()),Gt={RankingsPage:D,VoteNotification:wt,VotesModal:K,Voters:Et};function St(){return St=Object.assign||function(t){for(var o=1;o<arguments.length;o++){var n=arguments[o];for(var e in n)Object.prototype.hasOwnProperty.call(n,e)&&(t[e]=n[e])}return t},St.apply(this,arguments)}var Rt=St({saveVote:Z,setting:S},{rankLabel:ct});l().initializers.add("fof-gamification",(function(t){p().prototype.votes=a().attribute("votes"),p().prototype.hasUpvoted=a().attribute("hasUpvoted"),p().prototype.hasDownvoted=a().attribute("hasDownvoted"),p().prototype.canVote=a().attribute("canVote"),p().prototype.seeVotes=a().attribute("seeVotes"),g().prototype.points=a().attribute("points"),g().prototype.ranks=a().hasMany("ranks"),v().prototype.upvotes=a().hasMany("upvotes"),v().prototype.downvotes=a().hasMany("downvotes"),v().prototype.votes=a().attribute("votes"),v().prototype.canVote=a().attribute("canVote"),v().prototype.canSeeVotes=a().attribute("canSeeVotes"),v().prototype.hasUpvoted=a().attribute("hasUpvoted"),v().prototype.hasDownvoted=a().attribute("hasDownvoted"),v().prototype.seeVoters=a().attribute("seeVoters"),t.store.models.ranks=s,t.routes.rankings={path:"/rankings",component:D},(0,U.extend)(q(),"moderationControls",(function(t,o){o.seeVoters()&&t.add("viewVotes",[m(P(),{icon:"fas fa-thumbs-up",onclick:function(){l().modal.show(K,{post:o})}},l().translator.trans("fof-gamification.forum.mod_item"))])})),(0,U.extend)(z().prototype,"actionItems",(function(t){var o=this,n=this.attrs.post,e=n.hasDownvoted(),r=n.hasUpvoted(),a=S("iconName")||"thumbs",i=S("upVotesOnly",!0),s=n.canSeeVotes(),c=!l().session.user||n.canVote(),u=function(t,e){return Z(n,t,e,(function(t){return o.voteLoading=t}))};t.add("votes",m("div",{className:W()("CommentPost-votes",S("useAlternateLayout",!0)&&"alternateLayout")},P().component({icon:this.voteLoading?void 0:"fas fa-fw fa-"+a+"-up",className:W()("Post-vote Post-upvote",r&&"Post-vote--active"),loading:this.voteLoading,disabled:this.voteLoading||!c||!s,onclick:function(){return u(!r,!1)},"aria-label":l().translator.trans("fof-gamification.forum.post.upvote_button")}),m("label",{className:"Post-points"},n.votes()),!i&&P().component({icon:this.voteLoading?void 0:"fas fa-fw fa-"+a+"-down",className:W()("Post-vote Post-downvote",e&&"Post-vote--active"),loading:this.voteLoading,disabled:!c||!s,onclick:function(){return u(!1,!e)},"aria-label":l().translator.trans("fof-gamification.forum.post.downvote_button")})),10)})),(0,U.extend)(L().prototype,"navItems",(function(t){l().forum.attribute("canViewRankingPage")&&t.add("rankings",C().component({href:l().route("rankings"),icon:"fas fa-trophy"},l().translator.trans("fof-gamification.forum.nav.name")),80)})),(0,U.extend)(T().prototype,"sortMap",(function(t){t.hot="-hotness"})),(0,U.extend)(yt().prototype,"sortMap",(function(t){t.votes="-votes"})),ut(),S("showVotesOnDiscussionPage",!0)&&!S("useAlternateLayout",!0)&&((0,U.extend)(ot().prototype,"elementAttrs",(function(t){this.attrs.discussion.seeVotes()&&(t.className+=" DiscussionListItem--withVotes")})),(0,U.extend)(ot().prototype,"infoItems",(function(t){this.attrs.discussion.seeVotes()&&t.add("discussion-votes",m("span",{className:"DiscussionListItem-votes",title:l().translator.trans("fof-gamification.forum.votes")},G()("far fa-thumbs-up"),et()(this.attrs.discussion.votes())),20)}))),(0,U.extend)(ft().prototype,"oncreate",(function(){l().pusher&&l().pusher.then((function(t){t.main.bind("newVote",(function(t){var o,n,e=l().store.getById("posts",t.post_id),r=t.user_id;e&&e.votes()!==t.votes&&r!=l().session.user.id()&&(o=e.id(),(n=vt[o])?n(o):(n=vt[o]=pt()(dt,1500))(o))}))}))})),(0,U.extend)(ft().prototype,"onremove",(function(){l().pusher&&l().pusher.then((function(t){t.main.unbind("newVote")}))})),l().notificationComponents.vote=wt,(0,U.extend)(xt().prototype,"notificationTypes",(function(t){t.add("vote",{name:"vote",icon:"fas fa-thumbs-up",label:l().translator.trans("fof-gamification.forum.notification.prefrences.vote")})})),(0,U.extend)(ft().prototype,"sidebarItems",(function(t){var o=this.discussion.posts()[0];null!=o&&null!=o.canSeeVotes&&o.canSeeVotes()&&l().forum.attribute("fof-gamification-op-votes-only")&&t.add("op-voters",m(Et,{post:o}),90)})),S("useAlternateLayout",!0)&&((0,U.extend)(ot().prototype,"oninit",(function(){var t=this;this.attrs.discussion.seeVotes()&&this.subtree.check((function(){return t.voteLoading}))})),(0,U.extend)(ot().prototype,"view",(function(t){var o=this,n=this.attrs.discussion;if(n.seeVotes()&&t&&t.children){var e=t.children.find((function(t){return t&&t.attrs&&t.attrs.className&&t.attrs.className.includes("DiscussionListItem-content")})),r=n.firstPost(),a=ht(n,"hasUpvoted"),i=ht(n,"hasDownvoted"),s=!l().session.user||ht(n,"canVote"),c=S("upVotesOnly",!0),u=S("iconNameAlt")||"arrow",f=function(t,n){return Z(r,t,n,(function(t){return o.voteLoading=t}))};e.children.unshift(m("div",{className:"DiscussionListItem-votes alternateLayout","data-upvotes-only":c},m(P(),{className:"DiscussionListItem-voteButton DiscussionListItem-voteButton--up Button Button--icon Button--text",icon:"fas fa-fw fa-"+u+"-up","data-active":a,disabled:!s||this.voteLoading,onclick:function(){return f(!a,!1)},"aria-label":l().translator.trans("fof-gamification.forum.post.upvote_button")}),m("span",{class:"DiscussionListItem-voteCount"},et()(ht(n,"votes")||0)),!c&&m(P(),{className:"DiscussionListItem-voteButton DiscussionListItem-voteButton--down Button Button--icon Button--text",icon:"fas fa-fw fa-"+u+"-down","data-active":i,disabled:!s||this.voteLoading,onclick:function(){return f(!1,!i)},"aria-label":l().translator.trans("fof-gamification.forum.post.downvote_button")}),this.voteLoading&&m(F(),{display:"inline",size:"small"})))}}))),S("altPostVotingUi",!0)&&((0,U.extend)(z().prototype,"actionItems",(function(t){this.attrs.post.isHidden()||t.remove("votes")})),(0,U.extend)(z().prototype,"classes",(function(t){if(!this.attrs.post.isHidden()){var o=S("upVotesOnly",!0);t.push("votesAlternativeLayout"),o&&t.push("votesUpvotesOnly")}})),(0,U.extend)(z().prototype,"headerItems",(function(t){var o=this,n=this.attrs.post;if(!n.isHidden()&&n.canSeeVotes()){var e=n.hasDownvoted(),r=n.hasUpvoted(),a=S("iconName")||"thumbs",i=S("upVotesOnly",!0),s=n.canSeeVotes(),c=!l().session.user||n.canVote(),u=function(t,e){return Z(n,t,e,(function(t){o.voteLoading=t}))};t.add("votes",m("div",{className:"Post-votes alternateLayout","data-upvotes-only":i},m(P(),{className:"Post-voteButton Post-voteButton--up Button Button--icon Button--text",icon:"fas fa-fw fa-"+a+"-up","data-active":r,disabled:!c||this.voteLoading||!s,onclick:function(){return u(!r,!1)},"aria-label":l().translator.trans("fof-gamification.forum.post.upvote_button")}),m("span",{class:"Post-voteCount"},et()(n.votes()||0)),!i&&m(P(),{className:"Post-voteButton Post-voteButton--down Button Button--icon Button--text",icon:"fas fa-fw fa-"+a+"-down","data-active":e,disabled:!c||this.voteLoading,onclick:function(){return u(!1,!e)},"aria-label":l().translator.trans("fof-gamification.forum.post.downvote_button")}),this.voteLoading&&m(F(),{display:"inline",size:"small"})),1e4)}})))}))})(),module.exports=e})();
//# sourceMappingURL=forum.js.map