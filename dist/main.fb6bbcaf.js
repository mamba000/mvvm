// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles

// eslint-disable-next-line no-global-assign
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  for (var i = 0; i < entry.length; i++) {
    newRequire(entry[i]);
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  return newRequire;
})({"js/dep.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var id = 0;

var Dep =
/*#__PURE__*/
function () {
  function Dep() {
    _classCallCheck(this, Dep);

    this.subs = [];
    this.uid = id++;
  }

  _createClass(Dep, [{
    key: "depend",
    value: function depend() {
      Dep.target.addDep(this);
    }
  }, {
    key: "addSub",
    value: function addSub(watcher) {
      this.subs.push(watcher);
    }
  }, {
    key: "notify",
    value: function notify() {
      this.subs.forEach(function (sub) {
        sub.update && sub.update();
      });
    }
  }]);

  return Dep;
}();

exports.default = Dep;
Dep.prototype.target = null;
},{}],"js/observer.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dep = _interopRequireDefault(require("./dep"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Observer =
/*#__PURE__*/
function () {
  function Observer(data) {
    _classCallCheck(this, Observer);

    this.data = data;
    this.observe();
  }

  _createClass(Observer, [{
    key: "observe",
    value: function observe() {
      var _this = this;

      var self = this;
      var data = this.data;
      Object.keys(data).forEach(function (key) {
        var val = data[key];
        var dep = new _dep.default();

        _this.observeInner(data[key]);

        Object.defineProperty(data, key, {
          configurable: true,
          enumerable: true,
          get: function get() {
            if (_dep.default.target) {
              dep.depend();
            }

            return val;
          },
          set: function set(newVal) {
            if (val === newVal) {
              return;
            }

            val = newVal;
            self.observe(newVal);
            dep.notify();
          }
        });
      });
    } // 如果属性值为对象，继续劫持该值

  }, {
    key: "observeInner",
    value: function observeInner(val) {
      if (!val || _typeof(val) !== 'object') {
        return;
      }

      return new Observer(val);
    }
  }]);

  return Observer;
}();

exports.default = Observer;
},{"./dep":"js/dep.js"}],"js/watcher.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _dep = _interopRequireDefault(require("./dep"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var Watcher =
/*#__PURE__*/
function () {
  function Watcher(vm, key, node) {
    _classCallCheck(this, Watcher);

    this.vm = vm;
    this.key = key;
    this.node = node;
    this.depsId = {};
    this.value = this.get();
  }

  _createClass(Watcher, [{
    key: "get",
    value: function get() {
      _dep.default.target = this;
      var val = this.vm.data[this.key]; // 获取当前watcher对应的属性的值

      _dep.default.target = null;
      return val;
    }
  }, {
    key: "update",
    value: function update() {
      var newVal = this.get();
      var oldVal = this.value;

      if (newVal !== oldVal) {
        this.node.nodeValue = this.vm.data[this.key];
      }
    }
  }, {
    key: "addDep",
    value: function addDep(dep) {
      if (!this.depsId.hasOwnProperty(dep.uid)) {
        this.depsId[dep.uid] = dep;
        dep.addSub(this);
      }
    }
  }]);

  return Watcher;
}();

exports.default = Watcher;
},{"./dep":"js/dep.js"}],"js/compile.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _watcher = _interopRequireDefault(require("./watcher"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var REG = /\{\{(.*)\}\}/;

var Compiler =
/*#__PURE__*/
function () {
  function Compiler(el, vm) {
    _classCallCheck(this, Compiler);

    this.vm = vm;
    this.$el = _typeof(el) === 'object' ? el : document.querySelector(el);
    this.compiler(this.$el);
  }

  _createClass(Compiler, [{
    key: "compiler",
    value: function compiler(parentNode) {
      var _this = this;

      var frag = document.createDocumentFragment();
      var $el = parentNode;
      var node = null;

      while (node = $el.firstChild) {
        if (node.nodeType === 1) {
          (function () {
            // 元素节点
            // 获取元素的标签名
            var tagName = node.tagName; // 编译含有v-model的input或者textarea

            Array.from(node.attributes).forEach(function (attr) {
              if ((tagName === 'INPUT' || tagName === 'TEXTAREA') && attr.name === 'v-model') {
                var key = attr.value;
                node.value = _this.vm.data[key];
                node.removeAttribute(attr.name); // 将表达式或指令与watcher一一对应

                new _watcher.default(_this.vm, key, node);
                node.addEventListener('input', function (e) {
                  _this.vm.data[key] = e.target.value;
                }, false);
              }
            });

            if (node.childNodes.length) {
              _this.compiler(node);
            }
          })();
        } else if (node.nodeType === 3) {
          // 文本节点
          if (REG.test(node.nodeValue)) {
            var key = RegExp.$1.trim();
            this.parseKey(key);
            node.nodeValue = this.vm.data[key]; // 将表达式或指令与watcher一一对应

            new _watcher.default(this.vm, key, node);
          }
        }

        frag.appendChild(node);
      }

      $el.appendChild(frag);
    }
  }, {
    key: "parseKey",
    value: function parseKey(key) {
      var res = key.split('.');
    }
  }]);

  return Compiler;
}();

exports.default = Compiler;
},{"./watcher":"js/watcher.js"}],"js/mvvm.js":[function(require,module,exports) {
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _observer = _interopRequireDefault(require("./observer"));

var _compile = _interopRequireDefault(require("./compile"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Vue = function Vue(options) {
  _classCallCheck(this, Vue);

  this.data = options.data;
  this.el = options.el; // 数据劫持

  new _observer.default(this.data); // 模板编译

  new _compile.default(this.el, this);
};

exports.default = Vue;
},{"./observer":"js/observer.js","./compile":"js/compile.js"}],"js/main.js":[function(require,module,exports) {
"use strict";

var _mvvm = _interopRequireDefault(require("./mvvm"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var vm = new _mvvm.default({
  el: '#app',
  data: {
    name: 'abcsdf',
    names: {
      a: '哈哈',
      b: '苦苦'
    },
    icon: '小妮啊'
  }
});
},{"./mvvm":"js/mvvm.js"}],"../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js":[function(require,module,exports) {
var global = arguments[3];
var OVERLAY_ID = '__parcel__error__overlay__';
var OldModule = module.bundle.Module;

function Module(moduleName) {
  OldModule.call(this, moduleName);
  this.hot = {
    data: module.bundle.hotData,
    _acceptCallbacks: [],
    _disposeCallbacks: [],
    accept: function (fn) {
      this._acceptCallbacks.push(fn || function () {});
    },
    dispose: function (fn) {
      this._disposeCallbacks.push(fn);
    }
  };
  module.bundle.hotData = null;
}

module.bundle.Module = Module;
var parent = module.bundle.parent;

if ((!parent || !parent.isParcelRequire) && typeof WebSocket !== 'undefined') {
  var hostname = "" || location.hostname;
  var protocol = location.protocol === 'https:' ? 'wss' : 'ws';
  var ws = new WebSocket(protocol + '://' + hostname + ':' + "60926" + '/');

  ws.onmessage = function (event) {
    var data = JSON.parse(event.data);

    if (data.type === 'update') {
      console.clear();
      data.assets.forEach(function (asset) {
        hmrApply(global.parcelRequire, asset);
      });
      data.assets.forEach(function (asset) {
        if (!asset.isNew) {
          hmrAccept(global.parcelRequire, asset.id);
        }
      });
    }

    if (data.type === 'reload') {
      ws.close();

      ws.onclose = function () {
        location.reload();
      };
    }

    if (data.type === 'error-resolved') {
      console.log('[parcel] ✨ Error resolved');
      removeErrorOverlay();
    }

    if (data.type === 'error') {
      console.error('[parcel] 🚨  ' + data.error.message + '\n' + data.error.stack);
      removeErrorOverlay();
      var overlay = createErrorOverlay(data);
      document.body.appendChild(overlay);
    }
  };
}

function removeErrorOverlay() {
  var overlay = document.getElementById(OVERLAY_ID);

  if (overlay) {
    overlay.remove();
  }
}

function createErrorOverlay(data) {
  var overlay = document.createElement('div');
  overlay.id = OVERLAY_ID; // html encode message and stack trace

  var message = document.createElement('div');
  var stackTrace = document.createElement('pre');
  message.innerText = data.error.message;
  stackTrace.innerText = data.error.stack;
  overlay.innerHTML = '<div style="background: black; font-size: 16px; color: white; position: fixed; height: 100%; width: 100%; top: 0px; left: 0px; padding: 30px; opacity: 0.85; font-family: Menlo, Consolas, monospace; z-index: 9999;">' + '<span style="background: red; padding: 2px 4px; border-radius: 2px;">ERROR</span>' + '<span style="top: 2px; margin-left: 5px; position: relative;">🚨</span>' + '<div style="font-size: 18px; font-weight: bold; margin-top: 20px;">' + message.innerHTML + '</div>' + '<pre>' + stackTrace.innerHTML + '</pre>' + '</div>';
  return overlay;
}

function getParents(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return [];
  }

  var parents = [];
  var k, d, dep;

  for (k in modules) {
    for (d in modules[k][1]) {
      dep = modules[k][1][d];

      if (dep === id || Array.isArray(dep) && dep[dep.length - 1] === id) {
        parents.push(k);
      }
    }
  }

  if (bundle.parent) {
    parents = parents.concat(getParents(bundle.parent, id));
  }

  return parents;
}

function hmrApply(bundle, asset) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (modules[asset.id] || !bundle.parent) {
    var fn = new Function('require', 'module', 'exports', asset.generated.js);
    asset.isNew = !modules[asset.id];
    modules[asset.id] = [fn, asset.deps];
  } else if (bundle.parent) {
    hmrApply(bundle.parent, asset);
  }
}

function hmrAccept(bundle, id) {
  var modules = bundle.modules;

  if (!modules) {
    return;
  }

  if (!modules[id] && bundle.parent) {
    return hmrAccept(bundle.parent, id);
  }

  var cached = bundle.cache[id];
  bundle.hotData = {};

  if (cached) {
    cached.hot.data = bundle.hotData;
  }

  if (cached && cached.hot && cached.hot._disposeCallbacks.length) {
    cached.hot._disposeCallbacks.forEach(function (cb) {
      cb(bundle.hotData);
    });
  }

  delete bundle.cache[id];
  bundle(id);
  cached = bundle.cache[id];

  if (cached && cached.hot && cached.hot._acceptCallbacks.length) {
    cached.hot._acceptCallbacks.forEach(function (cb) {
      cb();
    });

    return true;
  }

  return getParents(global.parcelRequire, id).some(function (id) {
    return hmrAccept(global.parcelRequire, id);
  });
}
},{}]},{},["../../../usr/local/lib/node_modules/parcel-bundler/src/builtins/hmr-runtime.js","js/main.js"], null)
//# sourceMappingURL=/main.fb6bbcaf.map