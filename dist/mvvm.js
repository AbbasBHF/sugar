/*!
 * mvvm.js v1.0.4
 * (c) 2016 TANG
 * https://github.com/tangbc/sugar
 * released under the MIT license.
 */
(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["MVVM"] = factory();
	else
		root["MVVM"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 简单的数据绑定视图层库
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(1),
		__webpack_require__(2)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(util, Compiler) {

		/**
		 * MVVM 构造函数，封装 Complier
		 * @param  {DOMElement}  element  [视图的挂载原生 DOM]
		 * @param  {Object}      model    [数据模型对象]
		 * @param  {Function}    context  [事件及 watch 的回调上下文]
		 */
		function MVVM(element, model, context) {
			this.context = context;

			// 将函数 this 指向调用者
			util.each(model, function(value, key) {
				if (util.isFunc(value)) {
					model[key] = value.bind(context);
				}
			});

			// 初始数据备份
			this.backup = util.copy(model);

			// ViewModel 实例
			this.vm = new Compiler(element, model);

			// 数据模型
			this.$ = this.vm.$data;
		}

		var mvp = MVVM.prototype;

		/**
		 * 获取指定数据模型
		 * @param   {String}  key  [数据模型字段]
		 * @return  {Mix}
		 */
		mvp.get = function(key) {
			return util.isString(key) ? this.$[key] : this.$;
		}

		/**
		 * 设置数据模型的值，key 为 json 时则批量设置
		 * @param  {String}  key    [数据模型字段]
		 * @param  {Mix}     value  [值]
		 */
		mvp.set = function(key, value) {
			var vm = this.$;
			// 批量设置
			if (util.isObject(key)) {
				util.each(key, function(v, k) {
					vm[k] = v;
				});
			}
			else if (util.isString(key)) {
				vm[key] = value;
			}
		}

		/**
		 * 重置数据模型至初始状态
		 * @param   {Array|String}  key  [数据模型字段，或字段数组，空则重置所有]
		 */
		mvp.reset = function(key) {
			var vm = this.$;
			var backup = this.backup;

			// 重置单个
			if (util.isString(key)) {
				vm[key] = backup[key];
			}
			// 重置多个
			else if (util.isArray(key)) {
				util.each(key, function(v, k) {
					vm[k] = backup[k];
				});
			}
			// 重置所有
			else {
				util.each(vm, function(v, k) {
					vm[k] = backup[k];
				});
			}
		}

		/**
		 * 对数据模型的字段添加监测
		 * @param   {String}    model     [数据模型字段]
		 * @param   {Function}  callback  [触发回调，参数为 model, last, old]
		 */
		mvp.watch = function(model, callback) {
			this.vm.watcher.add({
				'dep': [model],
				'acc': [undefined]
			}, function(path, last, old) {
				callback.call(this, path, last, old);
			}, this.context);
		}

		return MVVM;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * 通用函数库
	 */
	!(__WEBPACK_AMD_DEFINE_RESULT__ = function() {
		var WIN = window;
		var DOC = WIN.document;
		var OP = Object.prototype;
		var AP = Array.prototype;
		var hasOwn = OP.hasOwnProperty;

		/**
		 * 是否是对象自面量, {} 或 new Object()
		 */
		function isObject(obj) {
			return OP.toString.call(obj) === '[object Object]';
		}

		/**
		 * 是否是真数组, [] 或 new Array()
		 */
		function isArray(obj) {
			return OP.toString.call(obj) === '[object Array]';
		}

		/**
		 * 是否是函数
		 */
		function isFunc(fn) {
			return fn instanceof Function;
		}

		/**
		 * 是否是字符串
		 */
		function isString(str) {
			return typeof str === 'string';
		}

		/**
		 * 是否是布尔值
		 */
		function isBool(bool) {
			return typeof bool === 'boolean';
		}

		/**
		 * 是否是数字
		 */
		function isNumber(num) {
			return typeof num === 'number' && !isNaN(num);
		}

		/**
		 * 是否是纯粹对象
		 */
		function isPlainObject(obj) {
			if (!obj || !isObject(obj) || obj.nodeType || obj === obj.window) {
				return false;
			}
			if (obj.constructor && !hasOwn.call(obj.constructor.prototype, "isPrototypeOf")) {
				return false;
			}
			return true;
		}

		/**
		 * 是否是空对象
		 * @param   {Object}   target
		 * @return  {Boolean}
		 */
		function isEmpty(target) {
			for (var i in target) {
				if (hasOwn.call(target, i)) {
					return false;
				}
			}

			return true;
		}


		/**
		 * Util 构造函数
		 */
		function Util() {
			this.OP = OP;
			this.AP = AP;
			this.WIN = WIN;
			this.DOC = DOC;

			this.isBool = isBool;
			this.isFunc = isFunc;
			this.isArray = isArray;
			this.isEmpty = isEmpty;
			this.isNumber = isNumber;
			this.isObject = isObject;
			this.isString = isString;
		}

		var up = Util.prototype;
		var cons = WIN.console;

		/**
		 * 打印错误
		 */
		up.error = function() {
			cons.error.apply(cons, arguments);
		}

		/**
		 * 打印警告信息
		 */
		up.warn = function() {
			cons.warn.apply(cons, arguments);
		}

		/*
		 * 对象自有属性检测
		 */
		up.hasOwn = function(obj, key) {
			return obj && hasOwn.call(obj, key);
		}

		/**
		 * object 定义或修改属性
		 * @param   {Object|Array}  object        [数组或对象]
		 * @param   {String}        property      [属性或数组下标]
		 * @param   {Mix}           value         [属性的修改值/新值]
		 * @param   {Boolean}       writable      [该属性是否能被赋值运算符改变]
		 * @param   {Boolean}       enumerable    [该属性是否出现在枚举中]
		 * @param   {Boolean}       configurable  [该属性是否能够被改变或删除]
		 */
		up.def = function(object, property, value, writable, enumerable, configurable) {
			return Object.defineProperty(object, property, {
				'value'       : value,
				'writable'    : !!writable,
				'enumerable'  : !!enumerable,
				'configurable': !!configurable
			});
		}

		/**
		 * 遍历数组或对象
		 * @param  {Array|Object}  items     [数组或对象]
		 * @param  {Fuction}       callback  [回调函数]
		 * @param  {Object}        context   [作用域]
		 */
		up.each = function(items, callback, context) {
			var ret, i;

			if (!items) {
				return;
			}

			if (!context) {
				context = WIN;
			}

			if (isString(callback)) {
				callback = context[callback];
			}

			// 数组
			if (isArray(items)) {
				for (i = 0; i < items.length; i++) {
					ret = callback.call(context, items[i], i);

					// 回调返回 false 退出循环
					if (ret === false) {
						break;
					}

					// 回调返回 null 从原数组删除当前选项
					if (ret === null) {
						items.splice(i, 1);
						i--;
					}
				}
			}
			// 对象
			else if (isObject(items)) {
				for (i in items) {
					if (!this.hasOwn(items, i)) {
						continue;
					}

					ret = callback.call(context, items[i], i);

					// 回调返回 false 退出循环
					if (ret === false) {
						break;
					}

					// 回调返回 null 从原对象删除当前选项
					if (ret === null) {
						delete items[i];
					}
				}
			}
		}

		/**
		 * 扩展合并对象，摘自 jQuery
		 */
		up.extend = function() {
			var options, name, src, copy, copyIsArray, clone;
			var target = arguments[0] || {}, i = 1, length = arguments.length, deep = false;

			// Handle a deep copy situation
			if (isBool(target)) {
				deep = target;
				target = arguments[i] || {};
				i++;
			}

			// Handle case when target is a string or something (possible in deep copy)
			if (typeof target !== "object" && !isFunc(target)) {
				target = {};
			}

			// Extend Util itself if only one argument is passed
			if (i === length) {
				target = this;
				i--;
			}

			for (; i < length; i++) {
				// Only deal with non-null/undefined values
				if ((options = arguments[i]) != null) {
					// Extend the base object
					for (name in options) {
						src = target[name];
						copy = options[name];

						// Prevent never-ending loop
						if (target === copy) {
							continue;
						}

						// Recurse if we're merging plain objects or arrays
						if (deep && copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
							if (copyIsArray) {
								copyIsArray = false;
								clone = src && isArray(src) ? src : [];

							}
							else {
								clone = src && isPlainObject(src) ? src : {};
							}

							// Never move original objects, clone them
							target[name] = this.extend(deep, clone, copy);
						}
						// Don't bring in undefined values
						else if (copy !== undefined) {
							target[name] = copy;
						}
					}
				}
			}

			// Return the modified object
			return target;
		}

		/**
		 * 复制对象或数组
		 * @param   {Object|Array}  target
		 * @return  {Mix}
		 */
		up.copy = function(target) {
			var ret;

			if (isArray(target)) {
				ret = target.slice(0);
			}
			else if (isObject(target)) {
				ret = this.extend(true, {}, target);
			}
			else {
				ret = target;
			}

			return ret;
		}

		/**
		 * 去掉字符串中所有空格
		 * @param   {String}  string
		 * @return  {String}
		 */
		up.removeSpace = function(string) {
			return string.replace(/\s/g, '');
		}

		/**
		 * 拆解字符键值对，返回键和值
		 * @param   {String}        expression
		 * @param   {Boolean}       both         [是否返回键和值]
		 * @return  {String|Array}
		 */
		up.getKeyValue = function(expression, both) {
			var array = expression.split(':');
			return both ? array : array.pop();
		}

		/**
		 * 分解字符串函数参数
		 * @param   {String}  expression
		 * @return  {Array}
		 */
		up.stringToParams = function(expression) {
			var ret, params, func;
			var exp = this.removeSpace(expression);
			var matches = exp.match(/(\(.*\))/);
			var result = matches && matches[0];

			// 有函数名和参数
			if (result) {
				params = result.substr(1, result.length - 2).split(',');
				func = exp.substr(0, exp.indexOf(result));
				ret = [func, params];
			}
			// 只有函数名
			else {
				ret = [exp, params];
			}

			return ret;
		}

		/**
		 * 字符 json 结构转为可取值的对象
		 * @param   {String}  jsonString
		 * @return  {Object}
		 */
		up.convertJson = function(jsonString) {
			var info, props;
			var string = jsonString.trim(), i = string.length;

			if (/^\{.*\}$/.test(string)) {
				info = {};
				string = string.substr(1, i - 2).replace(/\s|'|"/g, '');
				props = string.match(/[^,]+:[^:]+((?=,[\w_-]+:)|$)/g);

				this.each(props, function(prop) {
					var vals = this.getKeyValue(prop, true);
					var name = vals[0], value = vals[1];
					if (name && value) {
						info[name] = value;
					}
				}, this);
			}

			return info;
		}

		/**
		 * 创建一个空的 dom 元素
		 * @param   {String}     tag  [元素标签名称]
		 * @return  {DOMElemnt}
		 */
		up.createElement = function(tag) {
			return DOC.createElement(tag);
		}

		/**
		 * 返回一个空文档碎片
		 * @return  {Fragment}
		 */
		up.createFragment = function() {
			return DOC.createDocumentFragment();
		}

		/**
		 * DOMElement 的子节点转换成文档片段
		 * @param   {DOMElement}  element
		 */
		up.nodeToFragment = function(element) {
			var child;
			var fragment = this.createFragment();
			var cloneNode = element.cloneNode(true);

			while (child = cloneNode.firstChild) {
				fragment.appendChild(child);
			}

			return fragment;
		}

		/**
		 * 字符串 html 转文档碎片
		 * @param   {String}    html
		 * @return  {Fragment}
		 */
		up.stringToFragment = function(html) {
			var div, fragment;

			// 存在标签
			if (/<[^>]+>/g.test(html)) {
				div = this.createElement('div');
				div.innerHTML = html;
				fragment = this.nodeToFragment(div);
			}
			// 纯文本节点
			else {
				fragment = this.createFragment();
				fragment.appendChild(DOC.createTextNode(html));
			}

			return fragment;
		}

		/**
		 * 获取指令表达式的别名/模型字段
		 * eg. item.text -> item, items.length -> items
		 * @param   {String}  expression
		 * @return  {String}
		 */
		up.getExpAlias = function(expression) {
			var pos = expression.indexOf('.');
			return pos === -1 ? expression : expression.substr(0, pos);
		}

		/**
		 * 获取指令表达式的取值字段，无返回空
		 * eg. item.text -> text,
		 * @param   {String}  expression
		 * @return  {String}
		 */
		up.getExpKey = function(expression) {
			var pos = expression.lastIndexOf('.');
			return pos === -1 ? '' : expression.substr(pos + 1);
		}

		return new Util();
	}.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * compiler 元素编译/指令提取模块
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(5),
		__webpack_require__(1),
		__webpack_require__(6),
		__webpack_require__(7),
		// parse directive modules
		__webpack_require__(9),
		__webpack_require__(10),
		__webpack_require__(11),
		__webpack_require__(3),
		__webpack_require__(12),
		__webpack_require__(13),
		__webpack_require__(14),
		__webpack_require__(15),
		__webpack_require__(16)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(dom, util, Updater, Watcher, Von, Vel, Vif, Vfor, Vtext, Vhtml, Vshow, Vbind,  Vmodel) {

		/**
		 * 编译模块
		 * @param  {DOMElement}  element  [视图的挂载原生 DOM]
		 * @param  {Object}      model    [数据模型对象]
		 */
		function Compiler(element, model) {
			if (!this.isElementNode(element)) {
				util.error('element must be a type of DOMElement: ', element);
				return;
			}

			if (!util.isObject(model)) {
				util.error('model must be a type of Object: ', model);
				return;
			}

			// 缓存根节点
			this.$element = element;
			// 元素转为文档碎片
			this.$fragment = util.nodeToFragment(this.$element);

			// VM 数据模型
			this.$data = model;
			// DOM 对象注册索引
			this.$data.$els = {};

			// 未编译节点缓存队列
			this.$unCompileNodes = [];
			// 根节点是否已完成编译
			this.$rootComplied = false;

			// 视图刷新模块
			this.updater = new Updater(this);
			// 数据订阅模块
			this.watcher = new Watcher(this.$data);
			// 指令解析模块
			this.von = new Von(this);
			this.vel = new Vel(this);
			this.vif = new Vif(this);
			this.vfor = new Vfor(this);
			this.vtext = new Vtext(this);
			this.vhtml = new Vhtml(this);
			this.vshow = new Vshow(this);
			this.vbind = new Vbind(this);
			this.vmodel = new Vmodel(this);

			// v-model 限制使用的表单元素
			this.$inputs = 'input|select|textarea'.split('|');

			this.init();
		}

		var vp = Compiler.prototype;

		vp.init = function() {
			this.complieElement(this.$fragment, true);
		}

		/**
		 * 编译文档碎片/节点
		 * @param   {Fragment|DOMElement}  element   [文档碎片/节点]
		 * @param   {Boolean}              root      [是否是编译根节点]
		 * @param   {Object}               fors      [vfor 数据]
		 */
		vp.complieElement = function(element, root, fors) {
			var node, childNodes = element.childNodes;

			if (root && this.hasDirective(element)) {
				this.$unCompileNodes.push([element, fors]);
			}

			for (var i = 0; i < childNodes.length; i++) {
				node = childNodes[i];

				if (this.hasDirective(node)) {
					this.$unCompileNodes.push([node, fors]);
				}

				if (node.childNodes.length && !this.isLateCompile(node)) {
					this.complieElement(node, false, fors);
				}
			}

			if (root) {
				this.compileAll();
			}
		}

		/**
		 * 节点是否含有合法指令
		 * @param   {DOMElement}  node
		 * @return  {Number}
		 */
		vp.hasDirective = function(node) {
			var result, nodeAttrs;
			var text = node.textContent;
			var reg = /(\{\{.*\}\})|(\{\{\{.*\}\}\})/;

			if (this.isElementNode(node)) {
				nodeAttrs = node.attributes;
				for (var i = 0; i < nodeAttrs.length; i++) {
					if (this.isDirective(nodeAttrs[i].name)) {
						result = true;
						break;
					}
				}
			}
			else if (this.isTextNode(node) && reg.test(text)) {
				result = true;
			}
			return result;
		}

		/**
		 * 编译节点缓存队列
		 */
		vp.compileAll = function() {
			util.each(this.$unCompileNodes, function(info) {
				this.complieDirectives(info);
				return null;
			}, this);

			this.checkCompleted();
		}

		/**
		 * 收集并编译节点指令
		 * @param   {Array}  info   [node, fors]
		 */
		vp.complieDirectives = function(info) {
			var node = info[0], fors = info[1];
			var atr, name, _vfor, attrs = [], nodeAttrs;

			if (this.isElementNode(node)) {
				// node 节点集合转为数组
				nodeAttrs = node.attributes

				for (var i = 0; i < nodeAttrs.length; i++) {
					atr = nodeAttrs[i];
					name = atr.name;
					if (this.isDirective(name)) {
						if (name === 'v-for') {
							_vfor = atr;
						}
						attrs.push(atr);
					}
				}

				// vfor 编译时标记节点的指令数
				if (_vfor) {
					util.def(node, '_vfor_directives', attrs.length);
					attrs = [_vfor];
					_vfor = null;
				}

				// 编译节点指令
				util.each(attrs, function(attr) {
					this.compile(node, attr, fors);
				}, this);
			}
			else if (this.isTextNode(node)) {
				this.compileText(node, fors);
			}
		}

		/**
		 * 编译元素节点指令
		 * @param   {DOMElement}   node
		 * @param   {Object}       attr
		 * @param   {Array}        fors
		 */
		vp.compile = function(node, attr, fors) {
			var dir = attr.name;
			var exp = attr.value;
			var args = [fors, node, exp, dir];

			// 移除指令标记
			dom.removeAttr(node, dir);

			if (!exp && dir !== 'v-else') {
				util.warn('The directive value of ' + dir + ' is empty!');
				return;
			}

			// 动态指令：v-bind:xxx
			if (dir.indexOf('v-bind') === 0) {
				this.vbind.parse.apply(this.vbind, args);
			}
			// 动态指令：v-on:xxx
			else if (dir.indexOf('v-on') === 0) {
				this.von.parse.apply(this.von, args);
			}
			// 静态指令
			else {
				switch (dir) {
					case 'v-el':
						this.vel.parse.apply(this.vel, args);
						break;
					case 'v-text':
						this.vtext.parse.apply(this.vtext, args);
						break;
					case 'v-html':
						this.vhtml.parse.apply(this.vhtml, args);
						break;
					case 'v-show':
						this.vshow.parse.apply(this.vshow, args);
						break;
					case 'v-if':
						this.vif.parse.apply(this.vif, args);
						break;
					case 'v-else':
						util.def(node, '_directive', 'v-else');
						break;
					case 'v-model':
						this.vmodel.parse.apply(this.vmodel, args);
						break;
					case 'v-for':
						this.vfor.parse.apply(this.vfor, args);
						break;
					default: util.warn(dir + ' is an unknown directive!');
				}
			}
		}

		/**
		 * 编译文本节点
		 * @param   {DOMElement}   node
		 * @param   {Object}       fors
		 */
		vp.compileText = function(node, fors) {
			var text = node.textContent;
			var regtext = new RegExp('{{(.+?)}}', 'g');
			var regHtml = new RegExp('{{{(.+?)}}}', 'g');
			var matches = text.match(regHtml);
			var match, splits, prefix, suffix, field, htmlCompile;

			// html match
			if (matches) {
				match = matches[0];
				htmlCompile = true;
				field = match.replace(/\s\{|\{|\{|\}|\}|\}/g, '');
			}
			// text match
			else {
				matches = text.match(regtext);
				match = matches[0];
				field = match.replace(/\s|\{|\{|\}|\}/g, '');
			}

			splits = text.split(match);
			prefix = splits[0];
			suffix = splits[splits.length - 1];

			if (htmlCompile) {
				if (prefix || suffix) {
					util.warn('{{{html}}} can not have a prefix or suffix textNode!');
					return;
				}
				this.vhtml.parse.call(this.vhtml, fors, node, field);
			}
			else {
				node._vm_text_prefix = prefix;
				node._vm_text_suffix = suffix;
				this.vtext.parse.call(this.vtext, fors, node, field);
			}
		}

		/**
		 * 停止编译节点的剩余指令，如 vfor 的根节点
		 * @param   {DOMElement}  node
		 */
		vp.blockCompile = function(node) {
			util.each(this.$unCompileNodes, function(info) {
				if (node === info[0]) {
					return null;
				}
			});
		}

		/**
		 * 是否是元素节点
		 * @param   {DOMElement}   element
		 * @return  {Boolean}
		 */
		vp.isElementNode = function(element) {
			return element.nodeType === 1;
		}

		/**
		 * 是否是文本节点
		 * @param   {DOMElement}   element
		 * @return  {Boolean}
		 */
		vp.isTextNode = function(element) {
			return element.nodeType === 3;
		}

		/**
		 * 是否是合法指令
		 * @param   {String}   directive
		 * @return  {Boolean}
		 */
		vp.isDirective = function(directive) {
			return directive.indexOf('v-') === 0;
		}

		/**
		 * 节点的子节点是否延迟编译
		 * vif, vfor 的子节点为处理指令时单独编译
		 * @param   {DOMElement}   node
		 * @return  {Boolean}
		 */
		vp.isLateCompile = function(node) {
			return dom.hasAttr(node, 'v-if') || dom.hasAttr(node, 'v-for');
		}

		/**
		 * 检查根节点是否编译完成
		 */
		vp.checkCompleted = function() {
			if (this.$unCompileNodes.length === 0 && !this.$rootComplied) {
				this.rootCompleted();
			}
		}

		/**
		 * 根节点编译完成，更新视图
		 */
		vp.rootCompleted = function() {
			var element = this.$element;
			dom.empty(element);
			this.$rootComplied = true;
			element.appendChild(this.$fragment);
		}

		return Compiler;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(4),
		__webpack_require__(1)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(Parser, util) {

		function Vfor(vm) {
			this.vm = vm;
			Parser.call(this);
		}
		var vfor = Vfor.prototype = Object.create(Parser.prototype);

		/**
		 * 解析 v-for 指令
		 * @param   {Object}      fors        [vfor 数据]
		 * @param   {DOMElement}  node        [指令节点]
		 * @param   {String}      expression  [指令表达式]
		 */
		vfor.parse = function(fors, node, expression) {
			var vm = this.vm;
			var match = expression.match(/(.*) in (.*)/);
			var alias = match[1];
			var iterator = match[2];

			var watcher = vm.watcher;
			var parent = node.parentNode;
			var isOption = node.tagName === 'OPTION' && parent.tagName === 'SELECT';

			// 取值信息
			var scope = this.getScope(fors, iterator);
			var getter = this.getEval(fors, iterator);
			var array = getter.call(scope, scope);

			// 循环数组的访问路径
			var loopAccess = iterator;
			var listArgs, template, updates;
			var key = util.getExpKey(iterator);

			// 循环层级
			var level = -1;
			// 取值域集合
			var scopes = {};
			// 别名集合
			var aliases = [];
			// 取值域路径集合
			var accesses = [];

			// 嵌套 vfor
			if (fors) {
				level = fors.level;
				// 取值域集合一定是引用而不是拷贝
				scopes = fors.scopes;
				aliases = fors.aliases.slice(0);
				accesses = fors.accesses.slice(0);
				loopAccess = fors.access + '*' + key;
			}

			if (!util.isArray(array)) {
				parent.removeChild(node);
				return;
			}

			listArgs = [node, array, 0, loopAccess, alias, aliases, accesses, scopes, ++level];
			template = this.buildList.apply(this, listArgs);

			node.parentNode.replaceChild(template, node);

			if (isOption) {
				this.updateOption(parent, fors);
			}

			// 数组更新信息
			updates = {
				'alias'   : alias,
				'aliases' : aliases,
				'access'  : loopAccess,
				'accesses': accesses,
				'scopes'  : scopes,
				'level'   : level
			}

			// 监测根数组的数组操作
			if (!fors) {
				watcher.watchModel(loopAccess, function(path, last, method, args) {
					this.update(parent, node, last, method, updates, args);
				}, this);
			}
			// 监测嵌套数组的数组操作
			else {
				watcher.watchAccess(loopAccess, function(path, last, method, args) {
					this.update(parent, node, last, method, updates, args);
				}, this);
			}
		}

		/**
		 * 更新 select/option 在 vfor 中的值
		 * @param   {Select}  select
		 * @param   {Object}  fors
		 */
		vfor.updateOption = function(select, fors) {
			var model = select._vmodel;
			var getter = this.getEval(fors, model);
			var scope = this.getScope(fors, model);
			var value = getter.call(scope, scope);
			this.vm.updater.updateSelectChecked(select, value);
		}

		/**
		 * 根据源数组构建循环板块集合
		 * @param   {DOMElement}  node      [循环模板]
		 * @param   {Array}       array     [取值数组]
		 * @param   {Number}      start     [开始的下标计数]
		 * @param   {String}      paths     [取值数组访问路径]
		 * @param   {String}      alias     [当前取值域别名]
		 * @param   {Array}       aliases   [取值域别名数组]
		 * @param   {Array}       accesses  [取值域访问路径数组]
		 * @param   {Object}      scopes    [取值域集合]
		 * @param   {Number}      level     [当前循环层级]
		 * @return  {Fragment}              [板块文档碎片集合]
		 */
		vfor.buildList = function(node, array, start, paths, alias, aliases, accesses, scopes, level) {
			var vm = this.vm;
			var fragments = util.createFragment();

			util.each(array, function(scope, i) {
				var index = start + i;
				var cloneNode = node.cloneNode(true);
				var fors, access = paths + '*' + index;

				scopes[alias] = scope;
				aliases[level] = alias;
				accesses[level] = access;

				fors = {
					// 别名
					'alias'   : alias,
					// 别名集合
					'aliases' : aliases,
					// 取值域访问路径
					'access'  : access,
					// 取值域访问路径集合
					'accesses': accesses,
					// 当前取值域
					'scope'   : scope,
					// 取值域集合
					'scopes'  : scopes,
					// 当前循环层级
					'level'   : level,
					// 当前取值域下标
					'index'   : index
				}

				// 阻止重复编译除 vfor 以外的指令
				if (node._vfor_directives > 1) {
					vm.blockCompile(node);
				}

				this.signAlias(cloneNode, alias);

				// 传入 vfor 数据编译板块
				vm.complieElement(cloneNode, true, fors);

				fragments.appendChild(cloneNode);
			}, this);

			return fragments;
		}

		/**
		 * 标记节点的 vfor 别名
		 * @param   {DOMElement}  node
		 * @param   {String}      alias
		 */
		vfor.signAlias = function(node, alias) {
			util.def(node, '_vfor_alias', alias);
		}

		/**
		 * 数组操作更新 vfor 循环列表
		 * @param   {DOMElement}  parent    [父节点]
		 * @param   {DOMElement}  node      [初始模板片段]
		 * @param   {Array}       newArray  [新的数据重复列表]
		 * @param   {String}      method    [数组操作]
		 * @param   {Array}       updates   [更新信息]
		 * @param   {Array}       args      [数组操作参数]
		 */
		vfor.update = function(parent, node, newArray, method, updates, args) {
			switch (method) {
				case 'push':
					this.push.apply(this, arguments);
					break;
				case 'pop':
					this.pop.apply(this, arguments);
					break;
				case 'unshift':
					this.unshift.apply(this, arguments);
					break;
				case 'shift':
					this.shift.apply(this, arguments);
					break;
				case 'splice':
					this.splice.apply(this, arguments);
					break;
				// sort、reverse 操作或直接赋值都重新编译
				default: this.recompileArray.apply(this, arguments);
			}
		}

		/**
		 * 获取 shift 或 unshift 操作对应列表下标变化的关系
		 * @param   {String}  method  [数组操作]
		 * @param   {Number}  length  [新数组长度]
		 * @return  {Object}          [新数组下标的变化映射]
		 */
		vfor.getChanges = function(method, length) {
			var i, udf, map = {};

			switch (method) {
				case 'unshift':
					map[0] = udf;
					for (i = 1; i < length; i++) {
						map[i] = i - 1;
					}
					break;
				case 'shift':
					for (i = 0; i < length + 1; i++) {
						map[i] = i + 1;
					}
					map[length] = udf;
					break;
			}

			return map;
		}

		/**
		 * 在循环体的最后追加一条数据 array.push
		 */
		vfor.push = function(parent, node, newArray, method, updates) {
			var fragment = util.createFragment();
			var cloneNode = node.cloneNode(true);
			var lastChild, last = newArray.length - 1;

			var alias = updates.alias;
			var level = updates.level;
			var fors, access = updates.access + '*' + last;

			updates.scopes[alias] = newArray[last];
			updates.accesses[level] = access;

			fors = {
				'alias'   : updates.alias,
				'aliases' : updates.aliases,
				'access'  : access,
				'accesses': updates.accesses,
				'scope'   : newArray[last],
				'scopes'  : updates.scopes,
				'level'   : updates.level,
				'index'   : last
			}

			this.signAlias(cloneNode, alias);

			// 解析节点
			this.vm.complieElement(cloneNode, true, fors);
			fragment.appendChild(cloneNode);

			lastChild = this.getLast(parent, alias);

			// empty list
			if (!lastChild) {
				parent.appendChild(fragment);
			}
			else {
				parent.insertBefore(fragment, lastChild.nextSibling);
			}
		}

		/**
		 * 移除循环体的最后一条数据 array.pop
		 */
		vfor.pop = function(parent, node, newArray, method, updates) {
			var lastChild = this.getLast(parent, updates.alias);
			if (lastChild) {
				parent.removeChild(lastChild)
			}
		}

		/**
		 * 在循环体最前面追加一条数据 array.unshift
		 */
		vfor.unshift = function(parent, node, newArray, method, updates) {
			var vm = this.vm, firstChild, map;
			var fragment = util.createFragment();
			var cloneNode = node.cloneNode(true);

			var alias = updates.alias;
			var level = updates.level;
			var fors, access = updates.access + '*' + 0;

			// 移位相关的订阅回调
			map = this.getChanges(method, newArray.length);
			vm.watcher.moveSubs(updates.access, map);

			updates.scopes[alias] = newArray[0];
			updates.accesses[level] = access;

			fors = {
				'alias'   : updates.alias,
				'aliases' : updates.aliases,
				'access'  : access,
				'accesses': updates.accesses,
				'scope'   : newArray[0],
				'scopes'  : updates.scopes,
				'level'   : updates.level,
				'index'   : 0
			}

			this.signAlias(cloneNode, alias);

			// 解析节点
			vm.complieElement(cloneNode, true, fors);
			fragment.appendChild(cloneNode);

			firstChild = this.getFirst(parent, alias);

			// 当 firstChild 为 null 时也会添加到父节点
			parent.insertBefore(fragment, firstChild);
		}

		/**
		 * 移除循环体的第一条数据 array.shift
		 */
		vfor.shift = function(parent, node, newArray, method, updates) {
			var map = this.getChanges(method, newArray.length);
			var firstChild = this.getFirst(parent, updates.alias);
			if (firstChild) {
				parent.removeChild(firstChild);
				// 移位相关的订阅回调
				this.vm.watcher.moveSubs(updates.access, map);
			}
		}

		/**
		 * 删除/替换循环体的指定数据 array.splice
		 */
		vfor.splice = function(parent, node, newArray, method, up, args) {
			// 从数组的哪一位开始修改内容。如果超出了数组的长度，则从数组末尾开始添加内容；如果是负值，则表示从数组末位开始的第几位。
			var start = args.shift();
			// 整数，表示要移除的数组元素的个数。
			// 如果 deleteCount 是 0，则不移除元素。这种情况下，至少应添加一个新元素。
			// 如果 deleteCount 大于 start 之后的元素的总数，则从 start 后面的元素都将被删除（含第 start 位）。
			var deleteCont = args.shift();
			// 要添加进数组的元素。如果不指定，则 splice() 只删除数组元素。
			var insertItems = args, insertLength = args.length;

			// 不删除也不添加
			if (deleteCont === 0 && !insertLength) {
				return;
			}

			var i, template, startChild, listArgs, udf;
			var map = {}, alias = up.alias, length = newArray.length;

			// 只删除 splice(2, 1);
			var deleteOnly = deleteCont && !insertLength;
			// 只插入 splice(2, 0, 'xxx')
			var insertOnly = !deleteCont && insertLength;
			// 删除并插入 splice(2, 1, 'xxx')
			var deleAndIns = deleteCont && insertLength;

			// 只删除
			if (deleteOnly) {
				for (i = 0; i < length; i++) {
					map[i] = i >= start ? i + deleteCont : i;
				}

				if (util.isEmpty(map)) {
					this.recompileArray.apply(this, arguments);
					return;
				}
				else {
					this.vm.watcher.moveSubs(up.access, map);
					this.removeEl(parent, alias, start, deleteCont);
				}
			}
			// 只插入 或 删除并插入
			else if (insertOnly || deleAndIns) {
				for (i = 0; i < length; i++) {
					if (insertOnly) {
						map[i] = i < start ? i : (i >= start && i < start + insertLength ? udf : i - insertLength);
					}
					else if (deleAndIns) {
						map[i] = i < start ? i : (i >= start && i < start + insertLength ? udf : i - (insertLength - deleteCont));
					}
				}

				if (util.isEmpty(map) || start === 0 && deleteCont > length) {
					this.recompileArray.apply(this, arguments);
					return;
				}
				else {
					this.vm.watcher.moveSubs(up.access, map);
				}

				// 先删除选项
				if (deleAndIns) {
					this.removeEl(parent, alias, start, deleteCont);
				}

				// 开始的元素
				startChild = this.getChild(parent, alias, start);
				// 编译新添加的列表
				listArgs = [node, insertItems, start, up.access, alias, up.aliases, up.accesses, up.scopes, up.level];
				// 新增列表模板
				template = this.buildList.apply(this, listArgs);

				// 更新变化部分
				parent.insertBefore(template, startChild);
			}
		}

		/**
		 * 获取 vfor 循环体的第一个子节点
		 * @param   {DOMElement}  parent  [父节点]
		 * @param   {String}      alias   [循环体对象别名]
		 * @return  {FirstChild}
		 */
		vfor.getFirst = function(parent, alias) {
			var i, firstChild = null, child;
			var childNodes = parent.childNodes;

			for (i = 0; i < childNodes.length; i++) {
				child = childNodes[i];
				if (child._vfor_alias === alias) {
					firstChild = child;
					break;
				}
			}

			return firstChild;
		}

		/**
		 * 获取 vfor 循环体的最后一个子节点
		 * @param   {DOMElement}  parent   [父节点]
		 * @param   {String}      alias    [循环体对象别名]
		 * @return  {LastChild}
		 */
		vfor.getLast = function(parent, alias) {
			var i, lastChild = null, child;
			var childNodes = parent.childNodes;

			for (i = childNodes.length - 1; i > -1 ; i--) {
				child = childNodes[i];
				if (child._vfor_alias === alias) {
					lastChild = child;
					break;
				}
			}

			return lastChild;
		}

		/**
		 * 获取 vfor 循环体指定下标的子节点
		 * @param   {DOMElement}  parent  [父节点]
		 * @param   {String}      alias   [循环体对象别名]
		 * @param   {Number}      index   [子节点下标]
		 * @return  {DOMElement}
		 */
		vfor.getChild = function(parent, alias, index) {
			var i, e = 0, target = null, child;
			var childNodes = parent.childNodes;

			for (i = 0; i < childNodes.length; i++) {
				child = childNodes[i];
				if (child._vfor_alias === alias) {
					if (e === index) {
						target = child;
						break;
					}
					e++;
				}
			}

			return target;
		}

		/**
		 * 删除 vfor 循环体指定的数据
		 * @param   {DOMElement}  parent      [父节点]
		 * @param   {String}      alias       [循环体对象别名]
		 * @param   {Number}      start       [删除的下标起点]
		 * @param   {Number}      deleteCont  [删除个数]
		 */
		vfor.removeEl = function(parent, alias, start, deleteCont) {
			var childNodes = parent.childNodes;
			var i, e = -1, child, scapegoats = [];

			for (i = 0; i < childNodes.length; i++) {
				child = childNodes[i];
				if (child._vfor_alias === alias) {
					e++;
				}
				// 删除的范围内
				if (e >= start && e < start + deleteCont) {
					scapegoats.push(child);
				}
			}

			util.each(scapegoats, function(scapegoat) {
				parent.removeChild(scapegoat);
				return null;
			});
		}

		/**
		 * 重新编译循环体
		 */
		vfor.recompileArray = function(parent, node, newArray, method, up) {
			var child, scapegoat;
			var template, alias = up.alias;
			var childNodes = parent.childNodes;
			var listArgs = [node, newArray, 0, up.access, alias, up.aliases, up.accesses, up.scopes, up.level];

			// 移除旧的监测
			this.vm.watcher.removeSubs(up.access);

			// 重新构建循环板块
			template = this.buildList.apply(this, listArgs);

			// 移除旧板块
			for (var i = 0; i < childNodes.length; i++) {
				child = childNodes[i];
				if (child._vfor_alias === alias) {
					if (!scapegoat) {
						scapegoat = child;
					}
					else {
						i--;
						parent.removeChild(child);
					}
				}
			}

			if (scapegoat) {
				parent.replaceChild(template, scapegoat);
			}
			else {
				parent.appendChild(template);
			}
		}

		return Vfor;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * parser 指令解析模块（部分正则借鉴于 vue）
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(1)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(util) {

		// 表达式中允许的关键字
		var allowKeywords = 'Math.parseInt.parseFloat.Date.this.true.false.null.undefined.Infinity.NaN.isNaN.isFinite.decodeURI.decodeURIComponent.encodeURI.encodeURIComponent';
		var regAllowKeyword = new RegExp('^(' + allowKeywords.replace(/\./g, '\\b|') + '\\b)');

		// 表达式中禁止的关键字
		var avoidKeywords = 'var.const.let.if.else.for.in.continue.switch.case.break.default.function.return.do.while.delete.try.catch.throw.finally.with.import.export.instanceof.yield.await';
		var regAviodKeyword = new RegExp('^(' + avoidKeywords.replace(/\./g, '\\b|') + '\\b)');

		// 匹配常量缓存序号 "1"
		var regSaveConst = /"(\d+)"/g;
		// 只含有 true 或 false
		var regBool = /^(true|false)$/;
		// 匹配循环下标
		var regIndex = /^\$index|\W\$\bindex\b/;
		// 匹配表达式中的常量
		var regReplaceConst = /[\{,]\s*[\w\$_]+\s*:|('[^']*'|"[^"]*")|typeof /g;
		// 匹配表达式中的取值域
		var regReplaceScope = /[^\w$\.]([A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\])*)/g;
		// 匹配常规取值: item or item['x'] or item["y"] or item[0]
		var regNormal = /^[A-Za-z_$][\w$]*(\.[A-Za-z_$][\w$]*|\['.*?'\]|\[".*?"\]|\[\d+\]|\[[A-Za-z_$][\w$]*\])*$/;

		/**
		 * 是否是常规指令表达式
		 * @param   {String}   expression
		 * @return  {Boolean}
		 */
		function isNormal(expression) {
			return regNormal.test(expression) && !regBool.test(expression) && expression.indexOf('Math.') !== 0;
		}

		// 保存常量，返回序号 "i"
		var consts = [];
		function saveConst(string) {
			var i = consts.length;
			consts[i] = string;
			return '"' + i + '"';
		}

		/**
		 * 返回替换之前的常量
		 * @param   {Strinf}  string
		 * @param   {Number}  i
		 * @return  {String}
		 */
		function returnConst(string, i) {
			return consts[i];
		}

		/**
		 * 返回表达式的 scope 替换
		 * @param   {String}  string
		 * @return  {String}
		 */
		function replaceScope(string) {
			var pad = string.charAt(0);
			var path = string.slice(1);

			if (regAllowKeyword.test(path)) {
				return string;
			}
			else {
				path = path.indexOf('"') !== -1 ? path.replace(regSaveConst, returnConst) : path;
				return pad + 'scope.' + path;
			}
		}

		/**
		 * 获取取值表达式的 vfor 取值域别名
		 * @param   {Object}  fors         <必选>
		 * @param   {String}  expression   <必选>
		 * @return  {String}
		 */
		function getAlias(fors, expression) {
			var alias, exp = expression.replace(/(\(.*\))/g, '');

			// $index or item in items {{item}}
			if (exp === fors.alias || regIndex.test(exp)) {
				return fors.alias;
			}

			// 在表达式中匹配 alias.xxx
			util.each(fors.aliases, function(al) {
				var reg = new RegExp('\\b' + al + '\\b|\\b'+ al +'\\.');
				if (reg.test(exp)) {
					alias = al;
					return false;
				}
			});

			return alias;
		}


		/**
		 * Parser 基础解析器模块，指令解析模块都继承于 Parser
		 */
		function Parser() {}
		var p = Parser.prototype;

		/**
		 * 绑定监测 & 初始化视图
		 * @param   {Object}      fors
		 * @param   {DOMElement}  node
		 * @param   {String}      expression
		 */
		p.bind = function(fors, node, expression) {
			var vm = this.vm;

			// 提取依赖
			var deps = this.getDeps(fors, expression);
			// 获取取值域
			var scope = this.getScope(fors, expression);
			// 生成取值函数
			var getter = this.getEval(fors, expression);

			// 监测所有依赖变化
			vm.watcher.watch(deps, function(path, last) {
				var nScope = this.updateScope(scope, expression, path, last);
				this.update(node, getter.call(nScope, nScope));
			}, this);

			// 调用更新方法
			this.update(node, getter.call(scope, scope));
		}

		/**
		 * 生成表达式取值函数
		 * @param   {String}    expression
		 * @return  {Function}
		 */
		p.createGetter = function(expression) {
			try {
				return new Function('scope', 'return ' + expression + ';');
			}
			catch (e) {
				util.error('Invalid generated expression: ' + expression);
			}
		}

		/**
		 * 获取表达式的取值函数
		 */
		p.getEval = function(fors, expression) {
			var alias, regScope;
			var exp = this.replaceScope(expression);

			if (fors) {
				alias = getAlias(fors, expression);
				regScope = new RegExp('scope.' + alias, 'g');
				exp = exp.replace(regScope, 'scope');
			}

			return this.createGetter(exp);
		}

		/**
		 * 替换表达式的 scope 取值域
		 * @return  {String}
		 */
		p.replaceScope = function(expression) {
			var exp = expression;

			// 常规指令
			if (isNormal(exp)) {
				return 'scope.' + exp;
			}

			if (regAviodKeyword.test(exp)) {
				util.warn('Avoid using unallow keyword in expression: ' + exp);
				return;
			}

			exp = (' ' + exp).replace(regReplaceConst, saveConst);
			exp = exp.replace(regReplaceScope, replaceScope);
			exp = exp.replace(regSaveConst, returnConst);

			return exp;
		}

		/**
		 * 获取表达式的取值域
		 * @param   {Object}  fors
		 * @param   {String}  expression
		 * @return  {Object}
		 */
		p.getScope = function(fors, expression) {
			var alias, scope, index;
			var model = this.vm.$data;

			// 顶层数据模型
			if (!fors) {
				return model;
			}
			else {
				alias = getAlias(fors, expression);
			}

			// 无别名(vfor 中取顶层值)
			if (!alias) {
				return model;
			}

			// 当前域取值
			if (alias === fors.alias) {
				scope = fors.scope;

				// 取 vfor 循环下标
				if (regIndex.test(expression)) {
					index = fors.index;

					if (util.isObject(scope)) {
						scope.$index = index;
					}
					else {
						scope = {'$index': index};
					}
				}
			}
			// 跨循环层级取值
			else {
				scope = fors.scopes[alias];
			}

			return scope;
		}

		/**
		 * 更新取值域
		 * @param   {Mix}     scope       [旧取值域]
		 * @param   {String}  expression  [取值表达式]
		 * @param   {String}  path        [更新路径]
		 * @param   {Mix}     last        [新值]
		 * @return  {Mix}
		 */
		p.updateScope = function(scope, expression, path, last) {
			var nScope = scope, key, field;

			// scope === alias
			if (typeof scope !== 'object') {
				nScope = last;
			}

			// 下标
			if (expression === '$index') {
				nScope.$index = last;
			}
			else {
				key = util.getExpKey(expression);
				field = key && path !== expression && path.lastIndexOf(key) === (path.length - key.length) ? key : path;
				nScope[field] = last;
			}

			return nScope;
		}

		/**
		 * 获取表达式的所有依赖（取值模型+访问路径）
		 * @param   {Object}  fors        [vfor 数据]
		 * @param   {String}  expression
		 * @return  {Object}
		 */
		p.getDeps = function(fors, expression) {
			var deps = [], paths = [];
			var exp = ' ' + expression.replace(regReplaceConst, saveConst);

			exp.replace(regReplaceScope, function(dep) {
				var model = dep.substr(1);
				var alias, access, valAccess;

				// 取值域别名或 items.length -> items
				if (fors) {
					alias = getAlias(fors, expression);
					// 取值域路径
					if (model.indexOf(alias) !== -1 || model === '$index') {
						access = fors.accesses[fors.aliases.indexOf(alias)];
					}
				}
				else {
					alias = util.getExpAlias(model);
				}

				// 取值字段访问路径，输出别名和下标
				if (model === '$index' || model === alias) {
					valAccess = access || fors && fors.access;
				}
				else {
					if (access && model !== '$event') {
						valAccess = access + '*' + util.getExpKey(model);
					}
				}

				deps.push(model);
				paths.push(valAccess);
			});

			return {
				'dep': deps,
				'acc': paths
			}
		}

		return Parser;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * dom 操作模块
	 */
	!(module.exports = {
		/**
		 * 清空 element 的所有子节点
		 * @param   {DOMElement}  element
		 */
		empty: function(element) {
			while (element.firstChild) {
				element.removeChild(element.firstChild);
			}
		},

		/**
		 * 设置节点属性
		 * @param   {DOMElement}  node
		 * @param   {String}      name
		 * @param   {String}      value
		 */
		setAttr: function(node, name, value) {
			node.setAttribute(name, value);
		},

		/**
		 * 获取节点属性值
		 * @param   {DOMElement}  node
		 * @param   {String}      name
		 * @return  {String}
		 */
		getAttr: function(node, name) {
			return node.getAttribute(name) || '';
		},

		/**
		 * 判断节点是否存在属性
		 * @param   {DOMElement}  node
		 * @param   {String}      name
		 * @return  {Boolean}
		 */
		hasAttr: function(node, name) {
			return node.hasAttribute(name);
		},

		/**
		 * 移除节点属性
		 * @param   {DOMElement}  node
		 * @param   {String}      name
		 */
		removeAttr: function(node, name) {
			node.removeAttribute(name);
		},

		/**
		 * 节点添加 classname
		 * @param  {DOMElement}  node
		 * @param  {String}      classname
		 */
		addClass: function(node, classname) {
			var current, list = node.classList;
			if (list) {
				list.add(classname);
			}
			else {
				current = ' ' + this.getAttr(node, 'class') + ' ';
				if (current.indexOf(' ' + classname + ' ') === -1) {
					this.setAttr(node, 'class', (current + classname).trim());
				}
			}
		},

		/**
		 * 节点删除 classname
		 * @param  {DOMElement}  node
		 * @param  {String}      classname
		 */
		removeClass: function(node, classname) {
			var current, target, list = node.classList;
			if (list) {
				list.remove(classname);
			}
			else {
				target = ' ' + classname + ' ';
				current = ' ' + this.getAttr(node, 'class') + ' ';
				while (current.indexOf(target) !== -1) {
					current = current.replace(target, ' ');
				}
				this.setAttr(node, 'class', current.trim());
			}

			if (!node.className) {
				this.removeAttr(node, 'class');
			}
		},

		/**
		 * 节点事件绑定
		 * @param   {DOMElement}   node
		 * @param   {String}       evt
		 * @param   {Function}     callback
		 * @param   {Boolean}      capture
		 */
		addEvent: function(node, evt, callback, capture) {
			node.addEventListener(evt, callback, capture);
		},

		/**
		 * 解除节点事件绑定
		 * @param   {DOMElement}   node
		 * @param   {String}       evt
		 * @param   {Function}     callback
		 * @param   {Boolean}      capture
		 */
		removeEvent: function(node, evt, callback, capture) {
			node.removeEventListener(evt, callback, capture);
		}
	});

/***/ },
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * updater 视图刷新模块
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(5),
		__webpack_require__(1)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(dom, util) {

		function Updater(vm) {
			this.vm = vm;
			// 事件绑定回调集合
			this.$listeners = {};
		}

		var up = Updater.prototype;

		/**
		 * 更新节点的文本内容 realize v-text
		 * @param   {DOMElement}  node
		 * @param   {String}      text
		 */
		up.updateTextContent = function(node, text) {
			node.textContent = (node._vm_text_prefix || '') + String(text) + (node._vm_text_suffix || '');
		}

		/**
		 * 更新节点的 html 内容 realize v-html
		 * @param   {DOMElement}  node
		 * @param   {String}      html
		 * @param   {Boolean}     isPlain    [是否是纯文本节点]
		 */
		up.updateHtmlContent = function(node, html) {
			var vm = this.vm;
			html = String(html);

			if (vm.isElementNode(node)) {
				dom.empty(node);
				node.appendChild(util.stringToFragment(html));
			}
			else if (vm.isTextNode(node)) {
				node.parentNode.replaceChild(util.stringToFragment(html), node);
			}
		}

		/**
		 * 更新节点的显示隐藏 realize v-show/v-else
		 * @param   {DOMElement}  node
		 * @param   {Boolean}     show    [是否显示]
		 */
		up.updateDisplay = function(node, show) {
			var siblingNode = this.getSibling(node);

			this.setVisible(node);
			this.updateStyle(node, 'display', show ? node._visible_display : 'none');

			// v-else
			if (siblingNode && (dom.hasAttr(siblingNode, 'v-else') || siblingNode._directive === 'v-else')) {
				this.setVisible(siblingNode);
				this.updateStyle(siblingNode, 'display', show ? 'none' : siblingNode._visible_display);
			}
		}

		/**
		 * 缓存节点行内样式值
		 * 行内样式 display='' 不会影响由 classname 中的定义
		 * _visible_display 用于缓存节点行内样式的 display 显示值
		 * @param  {DOMElement}  node
		 */
		up.setVisible = function(node) {
			var inlineStyle, styles, display;

			if (!node._visible_display) {
				inlineStyle = util.removeSpace(dom.getAttr(node, 'style'));

				if (inlineStyle && inlineStyle.indexOf('display') !== -1) {
					styles = inlineStyle.split(';');

					util.each(styles, function(style) {
						if (style.indexOf('display') !== -1) {
							display = util.getKeyValue(style);
						}
					});
				}

				if (display !== 'none') {
					node._visible_display = display || '';
				}
			}
		}

		/**
		 * 更新节点内容的渲染 realize v-if/v-else
		 * @param   {DOMElement}  node
		 * @param   {Boolean}     isRender  [是否渲染]
		 */
		up.updateRenderContent = function(node, isRender) {
			var siblingNode = this.getSibling(node);

			this.setRender(node);
			this.toggleRender.apply(this, arguments);

			// v-else
			if (siblingNode && (dom.hasAttr(siblingNode, 'v-else') || siblingNode._directive === 'v-else')) {
				this.setRender(siblingNode);
				this.toggleRender(siblingNode, !isRender);
			}
		}

		/**
		 * 缓存节点渲染内容并清空
		 */
		up.setRender = function(node) {
			if (!node._render_content) {
				node._render_content = node.innerHTML;
			}
			dom.empty(node);
		}

		/**
		 * 切换节点内容渲染
		 */
		up.toggleRender = function(node, isRender) {
			var fragment;
			// 渲染
			if (isRender) {
				fragment = util.stringToFragment(node._render_content);
				this.vm.complieElement(fragment, true);
				node.appendChild(fragment);
			}
		}

		/**
		 * 获取节点的下一个兄弟元素节点
		 */
		up.getSibling = function(node) {
			var el = node.nextSibling;
			var isElementNode = this.vm.isElementNode;

			if (el && isElementNode(el)) {
				return el;
			}

			while (el) {
				el = el.nextSibling;

				if (el && isElementNode(el)) {
					return el;
				}
			}

			return null;
		}

		/**
		 * 更新节点的 attribute realize v-bind
		 * @param   {DOMElement}  node
		 * @param   {String}      attribute
		 * @param   {String}      value
		 */
		up.updateAttribute = function(node, attribute, value) {
			if (value === null) {
				dom.removeAttr.apply(this, arguments);
			}
			else {
				// setAttribute 不适合用于表单元素的 value
				// https://developer.mozilla.org/en-US/docs/Web/API/Element/setAttribute
				if (attribute === 'value' && (this.vm.$inputs.indexOf(node.tagName.toLowerCase()) !== -1)) {
					node.value = value;
				}
				else {
					dom.setAttr.apply(this, arguments);
				}
			}
		}

		/**
		 * 更新节点的 classname realize v-bind:class
		 * @param   {DOMElement}          node
		 * @param   {String|Boolean}      newcls
		 * @param   {String|Boolean}      oldcls
		 * @param   {String}              classname
		 */
		up.updateClassName = function(node, newcls, oldcls, classname) {
			// 指定 classname 变化值由 newcls 布尔值决定
			if (classname) {
				if (newcls === true) {
					dom.addClass(node, classname);
				}
				else if (newcls === false) {
					dom.removeClass(node, classname);
				}
			}
			// 未指定 classname 变化值由 newcls 的值决定
			else {
				if (newcls) {
					dom.addClass(node, newcls);
				}

				if (oldcls) {
					dom.removeClass(node, oldcls);
				}
			}
		}

		/**
		 * 更新节点的 style realize v-bind:style
		 * @param   {DOMElement}  node
		 * @param   {String}      propperty  [属性名称]
		 * @param   {String}      value      [样式值]
		 */
		up.updateStyle = function(node, propperty, value) {
			node.style[propperty] = value;
		}

		/**
		 * 更新节点绑定事件的回调函数 realize v-on
		 * @param   {DOMElement}  node
		 * @param   {String}      evt          [事件名称]
		 * @param   {Function}    func         [回调函数]
		 * @param   {Function}    oldfunc      [旧回调函数，会被移除]
		 * @param   {Array}       params       [参数]
		 * @param   {String}      identifier   [对应监测字段/路径]
		 */
		up.updateEvent = function(node, evt, func, oldfunc, params, identifier) {
			var listeners = this.$listeners;
			var modals, self, stop, prevent, capture = false;

			// 支持 4 种事件修饰符 .self .stop .prevent .capture
			if (evt.indexOf('.') !== -1) {
				modals = evt.split('.');
				evt = modals.shift();
				self = modals && modals.indexOf('self') !== -1;
				stop = modals && modals.indexOf('stop') !== -1;
				prevent = modals && modals.indexOf('prevent') !== -1;
				capture = modals && modals.indexOf('capture') !== -1;
			}

			if (oldfunc) {
				dom.removeEvent(node, evt, listeners[identifier], capture);
			}

			if (util.isFunc(func)) {
				// 缓存事件回调
				listeners[identifier] = function _listener(e) {
					var args = [];

					// 是否限定只能在当前节点触发事件
					if (self && e.target !== node) {
						return;
					}

					// 组合事件参数
					util.each(params, function(param) {
						args.push(param === '$event' ? e : param);
					});

					// 未指定参数，则原生事件对象作为唯一参数
					if (!args.length) {
						args.push(e);
					}

					func.apply(this, args);

					// 是否阻止冒泡
					if (stop) {
						e.stopPropagation();
					}
					// 是否阻止默认事件
					if (prevent) {
						e.preventDefault();
					}
				}

				dom.addEvent(node, evt, listeners[identifier], capture);
			}
			else {
				util.warn('The model: ' + identifier + '\'s value for using v-on must be a type of Function!');
			}
		}

		/**
		 * 更新 text 或 textarea 的 value realize v-model
		 * @param   {Input}  text
		 * @param   {String} value
		 */
		up.updateTextValue = function(text, value) {
			if (text.value !== value) {
				text.value = value;
			}
		}

		/**
		 * 更新 radio 的激活状态 realize v-model
		 * @param   {Input}  radio
		 * @param   {String} value
		 */
		up.updateRadioChecked = function(radio, value) {
			radio.checked = radio.value === (util.isNumber(value) ? String(value) : value);
		}

		/**
		 * 更新 checkbox 的激活状态 realize v-model
		 * @param   {Input}          checkbox
		 * @param   {Array|Boolean}  values      [激活数组或状态]
		 */
		up.updateCheckboxChecked = function(checkbox, values) {
			if (!util.isArray(values) && !util.isBool(values)) {
				util.warn('checkbox v-model value must be a type of Boolean or Array!');
				return;
			}
			checkbox.checked = util.isBool(values) ? values : (values.indexOf(checkbox.value) !== -1);
		}

		/**
		 * 更新 select 的激活状态 realize v-model
		 * @param   {Select}         select
		 * @param   {Array|String}   selected  [选中值]
		 * @param   {Boolean}        multi
		 */
		up.updateSelectChecked = function(select, selected, multi) {
			var i, option, value;
			var options = select.options, leng = options.length;
			var multiple = multi || dom.hasAttr(select, 'multiple');

			for (i = 0; i < leng; i++) {
				option = options[i];
				value = option.value;
				option.selected = multiple ? selected.indexOf(value) !== -1 : selected === value;
			}
		}

		return Updater;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 7 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * watcher 数据订阅模块
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(1),
		__webpack_require__(8)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(util, Observer) {

		function Watcher(model) {
			this.$model = model;

			// 数据模型订阅集合
			this.$modelSubs = {};

			// 访问路径订阅集合
			this.$accessSubs = {};

			// 数组下标订阅集合
			this.$indexSubs = {};

			this.observer = new Observer(model, ['$els'], 'change', this);
		}

		var wp = Watcher.prototype;

		/**
		 * 变化触发回调
		 * @param   {String}  path
		 * @param   {Mix}     last
		 * @param   {Mix}     old
		 * @param   {Array}   args
		 */
		wp.change = function(path, last, old, args) {
			var isAccess = path.indexOf('*') !== -1;
			var subs = isAccess ? this.$accessSubs[path] : this.$modelSubs[path];
			this.trigger(subs, path, last, old, args);
		}

		/**
		 * 触发订阅的所有回调
		 * @param   {Array}   subs
		 * @param   {String}  path
		 * @param   {Mix}     last
		 * @param   {Mix}     old
		 * @param   {Array}   args
		 */
		wp.trigger = function(subs, path, last, old, args) {
			util.each(subs, function(sub) {
				sub.cb.call(sub.ct, path, last, old, args || sub.arg);
			});
		}

		/**
		 * 订阅一个依赖集合的变化回调 (顶层模型 access 为 undefined)
		 * @param   {Object}    depends
		 * @param   {Function}  callback
		 * @param   {Object}    context
		 * @param   {Array}     args
		 */
		wp.watch = function(depends, callback, context, args) {
			// 依赖的数据模型
			var depModels = depends.dep;
			// 依赖的访问路径
			var depAccess = depends.acc;

			util.each(depModels, function(model, index) {
				var access = depAccess[index];

				// 暂时只有这一个需要忽略的关键字
				if (model === '$event') {
					return;
				}

				// 下标取值
				if (model === '$index') {
					this.watchIndex(access, callback, context, args);
					return;
				}

				// 嵌套数组/对象
				if (access) {
					this.watchAccess(access, callback, context, args);
					return;
				}

				// 顶层数据模型
				this.watchModel(util.getExpAlias(model), callback, context, args);

			}, this);
		}

		/**
		 * 订阅一个数据模型字段的变化回调
		 * @param  {String}    field
		 * @param  {Function}  callback
		 * @param  {Object}    context
		 * @param  {Array}     args
		 */
		wp.watchModel = function(field, callback, context, args) {
			if (!util.hasOwn(this.$model, field)) {
				util.warn('The field: "' + field + '" does not exist in model!');
				return;
			}

			if (field.indexOf('*') !== -1) {
				util.warn('Model key cannot contain the character "*"!');
				return;
			}

			this.addSubs(this.$modelSubs, field, callback, context, args);
		}

		/**
		 * 订阅多层访问路径变化回调
		 * @param  {String}    access
		 * @param  {Function}  callback
		 * @param  {Object}    context
		 * @param  {Array}     args
		 */
		wp.watchAccess = function(access, callback, context, args) {
			this.addSubs(this.$accessSubs, access, callback, context, args);
		}

		/**
		 * 订阅 vfor 数组下标变化回调
		 * @param  {String}    access
		 * @param  {Function}  callback
		 * @param  {Object}    context
		 * @param  {Array}     args
		 */
		wp.watchIndex = function(access, callback, context, args) {
			this.addSubs(this.$indexSubs, access, callback, context, args);
		}

		/**
		 * 缓存订阅回调
		 */
		wp.addSubs = function(subs, identifier, callback, context, args) {
			// 缓存回调函数
			if (!subs[identifier]) {
				subs[identifier] = [];
			}

			subs[identifier].push({
				'cb' : callback,
				'ct' : context,
				'arg': args
			});
		}

		/**
		 * 移除指定的访问路径/下标订阅(重新编译 vfor)
		 */
		wp.removeSubs = function(field) {
			// 下标
			util.each(this.$indexSubs, function(sub, index) {
				if (index.indexOf(field) === 0) {
					return null;
				}
			});
			// 访问路径
			util.each(this.$accessSubs, function(sub, access) {
				if (access.indexOf(field) === 0) {
					return null;
				}
			});
		}

		/**
		 * 发生数组操作时处理订阅的移位
		 * @param   {String}  field     [数组字段]
		 * @param   {String}  moveMap   [移位的映射关系]
		 */
		wp.moveSubs = function(field, moveMap, method) {
			// 数组字段标识
			var prefix = field + '*';
			// 移位下标
			this.moveIndex(prefix, moveMap);
			// 移位访问路径
			this.moveAccess(prefix, moveMap);
		}

		/**
		 * 移位下标订阅集合
		 * 移位的过程需要触发所有回调以更改每一个 $index
		 */
		wp.moveIndex = function(prefix, moveMap) {
			var dest = {};
			var subs = this.$indexSubs;
			var caches = util.copy(subs);

			// 根据结果映射 移位下标
			util.each(moveMap, function(move, index) {
				var udf;
				var nowIndex = prefix + index;
				var moveIndex = prefix + move;

				dest[nowIndex] = caches[moveIndex];

				// 被挤掉的设为 undefined
				if (move === udf) {
					subs[nowIndex] = udf;
				}
			});

			// 触发 $index 变更
			util.each(dest, function(subs, index) {
				var i = +index.substr(prefix.length);
				util.each(subs, function(sub) {
					sub.cb.call(sub.ct, index, i, sub.arg);
				});
			});

			// 合并移位结果
			util.extend(subs, dest);

			dest = caches = null;
		}

		/**
		 * 移位访问路径订阅集合
		 * 移位的过程不需要触发回调
		 */
		wp.moveAccess = function(prefix, moveMap) {
			var dest = {};
			var subs = this.$accessSubs;
			var caches = util.copy(subs);

			// 根据结果映射 移位访问路径
			util.each(moveMap, function(move, index) {
				var udf;
				var befores = [], afters = [];
				var nowIndex = prefix + index;
				var moveIndex = prefix + move;

				// 提取出替换前后的访问路径集合
				util.each(subs, function(sub, access) {
					if (move === udf && access.indexOf(nowIndex) === 0) {
						afters.push(udf);
						befores.push(access);
					}
					else if (access.indexOf(moveIndex) === 0) {
						afters.push(access);
						befores.push(access.replace(moveIndex, nowIndex));
					}
				});

				// 进行替换
				util.each(befores, function(before, index) {
					var after = afters[index];

					// 被挤掉的设为 undefined
					if (after === udf) {
						subs[before] = udf;
					}
					else {
						dest[before] = caches[after];
					}
				});
			});

			// 合并移位结果
			util.extend(subs, dest);

			dest = caches = null;
		}

		return Watcher;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;/**
	 * observer 数据变化监测模块
	 */
	!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(1)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(util) {

		/**
		 * @param  {Object}     object    [VM 数据模型]
		 * @param  {Array}      ignores   [忽略监测的字段]
		 * @param  {Function}   callback  [变化回调函数]
		 * @param  {Object}     context   [执行上下文]
		 * @param  {Object}     args      [<可选>回调额外参数]
		 */
		function Observer(object, ignores, callback, context, args) {
			if (util.isString(callback)) {
				callback = context[callback];
			}

			this.$ignores = ignores;
			this.$callback = callback;
			this.$context = context;
			this.$args = args;

			// 监测的对象集合，包括一级和嵌套对象
			this.$observers = [object];

			// 监测的数据副本，存储旧值
			this.$valuesMap = {'0': util.copy(object)};

			// 记录当前数组操作
			this.$action = 921;
			// 重写的 Array 方法
			this.$methods = 'push|pop|shift|unshift|splice|sort|reverse'.split('|');

			this.observe(object);
		}

		var op = Observer.prototype;

		/**
		 * 监测数据模型
		 * @param   {Object}  object  [监测的对象]
		 * @param   {Array}   paths   [访问路径数组]
		 */
		op.observe = function(object, paths) {
			if (util.isArray(object)) {
				this.rewriteMethods(object, paths);
			}

			util.each(object, function(value, property) {
				var copies = paths && paths.slice(0);
				if (copies) {
					copies.push(property);
				}
				else {
					copies = [property];
				}

				if (!this.isIgnore(copies)) {
					this.setCache(object, value, property).bindWatch(object, copies);
				}

			}, this);

			return this;
		}

		/**
		 * 检查 paths 是否在排除范围内
		 * @param   {Array}    paths  [访问路径数组]
		 * @return  {Boolean}
		 */
		op.isIgnore = function(paths) {
			var ret, path = paths.join('*');

			util.each(this.$ignores, function(ignore) {
				if (ignore.indexOf(path) === 0) {
					ret = true;
					return false;
				}
			}, this);

			return ret;
		}

		/**
		 * 获取指定对象的属性缓存值
		 * @param   {Object}  object    [指定对象]
		 * @param   {String}  property  [属性名称]
		 * @return  {Object}
		 */
		op.getCache = function(object, property) {
			var index = this.$observers.indexOf(object);
			var value = (index === -1) ? null : this.$valuesMap[index];
			return value ? value[property] : value;
		}

		/**
		 * 设置指定对象的属性与值的缓存映射
		 * @param  {Object}  object    [指定对象]
		 * @param  {Mix}     value     [值]
		 * @param  {String}  property  [属性名称]
		 */
		op.setCache = function(object, value, property) {
			var observers = this.$observers;
			var valuesMap = this.$valuesMap;
			var oleng = observers.length;
			var index = observers.indexOf(object);

			// 不存在，建立记录
			if (index === -1) {
				observers.push(object);
				valuesMap[oleng] = util.copy(object);
			}
			// 记录存在，重新赋值
			else {
				valuesMap[index][property] = value;
			}

			return this;
		}

		/**
		 * 拦截对象属性存取描述符（绑定监测）
		 * @param   {Object|Array}  object  [对象或数组]
		 * @param   {Array}         paths   [访问路径数组]
		 */
		op.bindWatch = function(object, paths) {
			var prop = paths[paths.length - 1];

			// 定义 object 的 getter 和 setter
			Object.defineProperty(object, prop, {
				get: (function getter() {
					return this.getCache(object, prop);
				}).bind(this),

				set: (function setter() {
					var newValue = arguments[0];
					var oldValue = this.getCache(object, prop);

					if (newValue !== oldValue) {
						if (util.isObject(newValue) || util.isArray(newValue)) {
							this.observe(newValue, paths);
						}

						this.setCache(object, newValue, prop);

						if (this.$methods.indexOf(this.$action) === -1) {
							this.trigger(paths.join('*'), newValue, oldValue);
						}
					}
				}).bind(this)
			});

			var value = object[prop];

			// 嵌套数组或对象
			if (util.isArray(value) || util.isObject(value)) {
				this.observe(value, paths);
			}
		}

		/**
		 * 重写指定的 Array 方法
		 * @param   {Array}  array  [目标数组]
		 * @param   {Array}  paths  [访问路径数组]
		 */
		op.rewriteMethods = function(array, paths) {
			var arrayProto = util.AP;
			var arrayMethods = Object.create(arrayProto);
			var path = paths && paths.join('*');

			util.each(this.$methods, function(method) {
				var self = this, original = arrayProto[method];
				util.def(arrayMethods, method, function _redefineArrayMethod() {
					var i = arguments.length, result;
					var args = new Array(i);

					while (i--) {
						args[i] = arguments[i];
					}

					self.$action = method;

					result = original.apply(this, args);

					self.$action = 921;

					// 重新监测
					self.observe(this, paths);

					// 触发回调
					self.trigger(path, this, method, args);

					return result;
				}, true, false, true);
			}, this);

			array.__proto__ = arrayMethods;
		}

		/**
		 * 触发 object 变化回调
		 * @param   {String}       path      [变更路径]
		 * @param   {Mix}          last      [新值]
		 * @param   {Mix|String}   old       [旧值，数组操作时为操作名称]
		 * @param   {Array}        args      [数组操作时的参数]
		 */
		op.trigger = function(path, last, old, args) {
			this.$callback.apply(this.$context, [path, last, old, args || this.$args]);
		}

		return Observer;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(4),
		__webpack_require__(1)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(Parser, util) {

		function Von(vm) {
			this.vm = vm;
			Parser.call(this);
		}
		var von = Von.prototype = Object.create(Parser.prototype);

		/**
		 * 解析 v-on 指令
		 * @param   {Object}      fors        [vfor 数据]
		 * @param   {DOMElement}  node        [指令节点]
		 * @param   {String}      expression  [指令表达式]
		 * @param   {String}      directive   [指令名称]
		 */
		von.parse = function(fors, node, expression, directive) {
			var deps = this.getDeps(fors, expression);
			var dir = util.removeSpace(directive);

			// 单个事件 v-on:click
			if (dir.indexOf(':') !== -1) {
				this.parseSingle(node, expression, dir, fors, deps);
			}
			// 多个事件 v-on="{click: xxx, mouseenter: yyy, mouseleave: zzz}"
			else {
				this.parseMulti(node, expression, fors, deps);
			}
		}

		/**
		 * 解析单个 v-on:type
		 * @param   {DOMElement}  node
		 * @param   {String}      expression
		 * @param   {String}      directive
		 * @param   {Object}      fors
		 * @param   {Array}       deps
		 */
		von.parseSingle = function(node, expression, directive, fors, deps) {
			var vm = this.vm;
			// 取值域
			var scope = this.getScope(fors, expression);
			// 事件类型
			var type = util.getKeyValue(directive);
			// 事件信息
			var info = util.stringToParams(expression);
			// 事件取值字段名称
			var field = info[0];
			// 事件参数
			var params = this.evalParams(fors, info[1]);

			this.bindEvent(node, fors, scope, type, field, params, deps);

			// 监测依赖变化，绑定新回调，旧回调将被移除
			vm.watcher.watch(deps, function(path, last, old) {
				this.update(node, type, last, old, params, path);
			}, this);
		}

		/**
		 * 解析多个 v-on=eventJson
		 * @param   {DOMElement}  node
		 * @param   {String}      expression
		 * @param   {Object}      fors
		 * @param   {Array}       deps
		 */
		von.parseMulti = function(node, expression, fors, deps) {
			var vm = this.vm;
			var cache = {}, jsonDeps = [], jsonAccess = [];
			var events = util.convertJson(expression);

			util.each(events, function(fn, ev) {
				// 事件信息
				var info = util.stringToParams(fn);
				// 事件取值字段名称
				var field = info[0] || fn;
				// 事件参数
				var params = this.evalParams(fors, info[1]);
				// 访问路径
				var access = deps.acc[deps.dep.indexOf(field)];
				// 取值域
				var scope = this.getScope(fors, field);

				jsonDeps.push(field);
				jsonAccess.push(access);
				cache[access] = {
					'type'  : ev,
					'params': params,
				}

				this.bindEvent(node, fors, scope, ev, field, params, deps);
			}, this);

			// 监测依赖变化，绑定新回调，旧回调将被移除
			vm.watcher.watch({
				'dep': jsonDeps,
				'acc': jsonAccess
			}, function(path, last, old) {
				var ev = cache[path];
				this.update(node, ev.type, last, old, ev.params, path);
			}, this);
		}

		/**
		 * 绑定一个事件
		 * @param   {DOMElement}  node
		 * @param   {Object}      fors
		 * @param   {Object}      scope
		 * @param   {String}      type
		 * @param   {String}      field
		 * @param   {Array}       params
		 * @param   {Array}       deps
		 */
		von.bindEvent = function(node, fors, scope, type, field, params, deps) {
			// 取值函数
			var getter = this.getEval(fors, field);
			// 事件函数
			var func = getter.call(scope, scope);
			// 访问路径，用于解绑
			var access = deps.acc[deps.dep.indexOf(field)] || field;

			this.update(node, type, func, null, params, access);
		}

		/**
		 * 对函数参数求值
		 * @param   {Object}  fors
		 * @param   {Object}  scope
		 * @param   {Array}   params
		 * @return  {Array}
		 */
		von.evalParams = function(fors, params) {
			var _params = [];

			util.each(params, function(param) {
				var p = param, exp, getter, scope;

				if (util.isString(p) && p !== '$event') {
					exp = this.replaceScope(p);

					if (exp.indexOf('scope.') !== -1) {
						scope = this.getScope(fors, p);
						getter = this.createGetter(exp);
						p = getter.call(scope, scope);
					}
				}

				_params.push(p);
			}, this);

			return _params;
		}

		/**
		 * 更新绑定事件
		 */
		von.update = function() {
			var updater = this.vm.updater;
			updater.updateEvent.apply(updater, arguments);
		}

		return Von;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(4),
		__webpack_require__(1)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(Parser, util) {

		function Vel(vm) {
			this.vm = vm;
			Parser.call(this);
		}
		var vel = Vel.prototype = Object.create(Parser.prototype);

		/**
		 * 解析 v-el 指令 (不需要在 model 中声明)
		 * @param   {Object}      fors    [vfor 数据]
		 * @param   {DOMElement}  node    [注册节点]
		 * @param   {String}      value   [注册字段]
		 */
		vel.parse = function(fors, node, value) {
			var key, alias, scope;

			if (fors) {
				alias = util.getExpAlias(value);

				// vel 在 vfor 循环中只能在当前循环体中赋值
				if (alias !== fors.alias) {
					util.warn('when v-el use in v-for must be defined inside current loop body!');
					return;
				}

				scope = fors.scope;

				if (util.isObject(scope)) {
					key = util.getExpKey(value);
					scope[key] = node;
				}
			}
			else {
				this.vm.$data.$els[value] = node;
			}
		}

		return Vel;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(4),
		__webpack_require__(1)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(Parser, util) {

		function Vif(vm) {
			this.vm = vm;
			Parser.call(this);
		}
		var vif = Vif.prototype = Object.create(Parser.prototype);

		/**
		 * 解析 v-if 指令
		 * @param   {Object}      fors        [vfor 数据]
		 * @param   {DOMElement}  node        [指令节点]
		 * @param   {String}      expression  [指令表达式]
		 */
		vif.parse = function() {
			this.bind.apply(this, arguments);
		}

		/**
		 * 更新视图
		 * @param   {DOMElement}   node
		 * @param   {Boolean}      isRender
		 */
		vif.update = function() {
			var updater = this.vm.updater;
			updater.updateRenderContent.apply(updater, arguments);
		}

		return Vif;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(4),
		__webpack_require__(1)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(Parser, util) {

		function Vtext(vm) {
			this.vm = vm;
			Parser.call(this);
		}
		var vtext = Vtext.prototype = Object.create(Parser.prototype);

		/**
		 * 解析 v-text, {{text}} 指令
		 * @param   {Object}      fors        [vfor 数据]
		 * @param   {DOMElement}  node        [指令节点]
		 * @param   {String}      expression  [指令表达式]
		 */
		vtext.parse = function() {
			this.bind.apply(this, arguments);
		}

		/**
		 * 更新视图
		 * @param   {DOMElement}  node
		 * @param   {String}      text
		 */
		vtext.update = function() {
			var updater = this.vm.updater;
			updater.updateTextContent.apply(updater, arguments);
		}

		return Vtext;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(4),
		__webpack_require__(1)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(Parser, util) {

		function Vhtml(vm) {
			this.vm = vm;
			Parser.call(this);
		}
		var vhtml = Vhtml.prototype = Object.create(Parser.prototype);

		/**
		 * 解析 v-html, {{{html}}} 指令
		 * @param   {Object}      fors        [vfor 数据]
		 * @param   {DOMElement}  node        [指令节点]
		 * @param   {String}      expression  [指令表达式]
		 */
		vhtml.parse = function() {
			this.bind.apply(this, arguments);
		}

		/**
		 * 更新视图
		 * @param   {DOMElement}  node
		 * @param   {String}      html
		 */
		vhtml.update = function() {
			var updater = this.vm.updater;
			updater.updateHtmlContent.apply(updater, arguments);
		}

		return Vhtml;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(4),
		__webpack_require__(1)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(Parser, util) {

		function Vshow(vm) {
			this.vm = vm;
			Parser.call(this);
		}
		var vshow = Vshow.prototype = Object.create(Parser.prototype);

		/**
		 * 解析 v-show 指令
		 * @param   {Object}      fors        [vfor 数据]
		 * @param   {DOMElement}  node        [指令节点]
		 * @param   {String}      expression  [指令表达式]
		 */
		vshow.parse = function() {
			this.bind.apply(this, arguments);
		}

		/**
		 * 更新视图
		 * @param   {DOMElement}   node
		 * @param   {Boolean}      isShow
		 */
		vshow.update = function() {
			var updater = this.vm.updater;
			updater.updateDisplay.apply(updater, arguments);
		}

		return Vshow;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(4),
		__webpack_require__(1)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(Parser, util) {

		// 匹配 {'class': xxx} 形式
		var regJson = /^\{.*\}$/;
		// 获取访问路径的最后一值
		function getLastValue(access) {
			return access.substr(access.lastIndexOf('*') + 1, access.length);
		}

		function Vbind(vm) {
			this.vm = vm;
			Parser.call(this);
		}
		var vbind = Vbind.prototype = Object.create(Parser.prototype);

		/**
		 * 解析 v-bind 指令
		 * @param   {Object}      fors        [vfor 数据]
		 * @param   {DOMElement}  node        [指令节点]
		 * @param   {String}      expression  [指令表达式]
		 * @param   {String}      directive   [指令名称]
		 */
		vbind.parse = function(fors, node, expression, directive) {
			var deps = this.getDeps(fors, expression);
			var type, attrs, dir = util.removeSpace(directive);

			// 单个 attribute: v-bind:class="xxx"
			if (dir.indexOf(':') !== -1) {
				// 属性类型
				type = util.getKeyValue(dir);

				switch (type) {
					case 'class':
						this.parseClass(node, fors, deps, expression);
						break;
					case 'style':
						this.parseStyle(node, fors, deps, expression);
						break;
					default:
						this.parseAttr(node, fors, type, deps, expression);
				}
			}
			// 多个 attributes: "v-bind={id:xxxx, name: yyy, data-id: zzz}"
			else {
				attrs = util.convertJson(expression);

				util.each(attrs, function(exp, attr) {
					var model = exp;
					var newDeps = this.getDeps(fors, model);

					switch (attr) {
						case 'class':
							this.parseClass(node, fors, newDeps, model);
							break;
						case 'style':
							this.parseStyle(node, fors, newDeps, model);
							break;
						default:
							this.parseAttr(node, fors, attr, newDeps, model);
					}
				}, this);
			}
		}

		/**
		 * 绑定/更新节点 classname
		 * @param   {DOMElement}   node
		 * @param   {Object}       fors
		 * @param   {Array}        deps
		 * @param   {String}       expression
		 */
		vbind.parseClass = function(node, fors, deps, expression) {
			var vm = this.vm;
			var watcher = vm.watcher;
			var exp = expression.trim();
			var isJson = regJson.test(exp);

			var map, scope, getter, value;
			var cache = {}, jsonDeps = [], jsonAccess = [];

			// 不是 classJson
			if (!isJson) {
				scope = this.getScope(fors, exp);
				getter = this.getEval(fors, exp);
				value = getter.call(scope, scope);

				// 单个变化的字段 cls
				if (util.isString(value)) {
					this.updateClass(node, value);
				}
				// 数组形式 ['cls-a', 'cls-b']
				else if (util.isArray(value)) {
					util.each(value, function(cls) {
						this.updateClass(node, cls);
					}, this);
				}
				// 对象形式 classObject
				else if (util.isObject(value)) {
					this.parseClassObject(node, value, deps, exp);

					// 监测整个 classObject 被替换
					watcher.watch(deps, function(path, newObject, oldObject) {
						// 移除旧的 class
						util.each(oldObject, function(b, cls) {
							this.updateClass(node, false, false, cls);
						}, this);

						// 重新绑定
						this.parseClassObject(node, newObject, deps, exp);
					}, this);

					// 已在 parseClassObject 做监测
					return;
				}
			}
			// classJson
			else {
				// classname 与取值字段的映射
				map = util.convertJson(exp);

				util.each(map, function(field, cls) {
					var isAdd, model = map[cls];
					var access = deps.acc[deps.dep.indexOf(model)];

					scope = this.getScope(fors, field);
					getter = this.getEval(fors, field);
					isAdd = getter.call(scope, scope);

					jsonDeps.push(model);
					jsonAccess.push(access);
					cache[util.getExpKey(model) || model] = cls;

					this.updateClass(node, isAdd, false, cls);

					scope = getter = null;
				}, this);
			}


			// cls 和 [clsa, clsb] 的依赖监测
			if (!isJson) {
				watcher.watch(deps, function(path, last, old) {
					this.updateClass(node, last, old);
				}, this);
			}
			// classJson 的依赖监测
			else {
				this.watchClassObject(node, {
					'dep': jsonDeps,
					'acc': jsonAccess
				}, cache);
			}
		}

		/**
		 * 绑定 classObject
		 * @param   {DOMElement}   node
		 * @param   {Object}       obj
		 * @param   {Object}       deps
		 * @param   {String}       exp
		 */
		vbind.parseClassObject = function(node, obj, deps, exp) {
			var jsonDeps = [], jsonAccess = [];

			util.each(obj, function(isAdd, cls) {
				var model = exp;
				var access = deps.acc[deps.dep.indexOf(model)];
				var valAccess = access ? (access + '*' + cls) : (model + '*' + cls);

				jsonDeps.push(model);
				jsonAccess.push(valAccess);

				this.updateClass(node, isAdd, false, cls);
			}, this);

			// 监测依赖变化
			this.watchClassObject(node, {
				'dep': jsonDeps,
				'acc': jsonAccess
			});
		}

		/**
		 * 监测 classObject 或 classJson 的依赖
		 * @param   {DOMElement}   node
		 * @param   {Object}       deps
		 * @param   {Object}       cache
		 */
		vbind.watchClassObject = function(node, deps, cache) {
			this.vm.watcher.watch(deps, function(path, last, old) {
				var lasValue =  getLastValue(path);
				var classname = cache ? cache[lasValue] : lasValue;
				this.updateClass(node, last, old, classname);
			}, this);
		}

		/**
		 * 刷新节点 classname
		 */
		vbind.updateClass = function() {
			var updater = this.vm.updater;
			updater.updateClassName.apply(updater, arguments);
		}

		/**
		 * 绑定/更新节点 inlineStyle
		 * 与 v-bind:style 只能为 styleObject 或 styleJson
		 * @param   {DOMElement}   node
		 * @param   {Object}       fors
		 * @param   {Array}        deps
		 * @param   {String}       expression
		 */
		vbind.parseStyle = function(node, fors, deps, expression) {
			var vm = this.vm;
			var watcher = vm.watcher;
			var exp = expression.trim();
			var isJson = regJson.test(exp);

			var map, scope, getter, styles

			// styleObject
			if (!isJson) {
				scope = this.getScope(fors, exp);
				getter = this.getEval(fors, exp);
				styles = getter.call(scope, scope);

				this.parseStyleObject(node, styles, deps);

				// 监测整个 styleObject 被替换
				watcher.watch(deps, function(path, newObject, oldObject) {
					// 移除旧的 style
					util.each(oldObject, function(property, style) {
						this.updateStyle(node, style, null);
					}, this);

					// 重新绑定
					this.parseStyleObject(node, newObject, deps);
				}, this);
			}
			// styleJson
			else {
				// style 与取值字段的映射
				map = util.convertJson(exp);

				util.each(map, function(field, style) {
					var model = field, property;

					scope = this.getScope(fors, model);
					getter = this.getEval(fors, model);
					property = getter.call(scope, scope);

					this.updateStyle(node, style, property);

					scope = getter = null;
				}, this);

				// styleJson 依赖监测
				watcher.watch(deps, function(path, last, old) {
					this.updateStyle(node, getLastValue(path), last);
				}, this);
			}
		}

		/**
		 * 绑定 styleObject
		 * @param   {DOMElement}  node
		 * @param   {Object}      styles
		 * @param   {Object}      deps
		 */
		vbind.parseStyleObject = function(node, styles, deps) {
			var jsonDeps = [], jsonAccess = [];

			util.each(styles, function(property, style) {
				var model = deps.dep[0];
				var access = deps.acc[0] || model;
				var valAccess = access + '*' + style;

				jsonDeps.push(model);
				jsonAccess.push(valAccess);

				this.updateStyle(node, style, property);
			}, this);

			// styleObject 依赖监测
			this.vm.watcher.watch({
				'dep': jsonDeps,
				'acc': jsonAccess
			}, function(path, last, old) {
				this.updateStyle(node, getLastValue(path), last);
			}, this);
		}

		/**
		 * 刷新节点行内样式 inlineStyle
		 */
		vbind.updateStyle = function() {
			var updater = this.vm.updater;
			updater.updateStyle.apply(updater, arguments);
		}

		/**
		 * 绑定/更新节点的普通 attribute
		 * @param   {DOMElement}   node
		 * @param   {Object}       fors
		 * @param   {String}       attr
		 * @param   {Array}        deps
		 * @param   {String}       expression
		 */
		vbind.parseAttr = function(node, fors, attr, deps, expression) {
			var vm = this.vm;
			var scope = this.getScope(fors, expression);
			var getter = this.getEval(fors, expression);
			var value = getter.call(scope, scope);

			this.updateAttr(node, attr, value);

			// 监测依赖
			vm.watcher.watch(deps, function(path, last, old) {
				this.updateAttr(node, attr, last);
			}, this);
		}

		/**
		 * 刷新节点的属性 attribute
		 */
		vbind.updateAttr = function() {
			var updater = this.vm.updater;
			updater.updateAttribute.apply(updater, arguments);
		}

		return Vbind;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	var __WEBPACK_AMD_DEFINE_ARRAY__, __WEBPACK_AMD_DEFINE_RESULT__;!(__WEBPACK_AMD_DEFINE_ARRAY__ = [
		__webpack_require__(4),
		__webpack_require__(5),
		__webpack_require__(1)
	], __WEBPACK_AMD_DEFINE_RESULT__ = function(Parser, dom, util) {

		function Vmodel(vm) {
			this.vm = vm;
			Parser.call(this);
		}
		var vmodel = Vmodel.prototype = Object.create(Parser.prototype);

		/**
		 * 解析 v-model 指令
		 * @param   {Object}      fors    [vfor 数据]
		 * @param   {DOMElement}  node    [指令节点]
		 * @param   {String}      field   [双向绑定的字段]
		 */
		vmodel.parse = function(fors, node, field) {
			var vm = this.vm;
			var inputs = vm.$inputs;
			var tagName = node.tagName.toLowerCase();
			var type = tagName === 'input' ? dom.getAttr(node, 'type') : tagName;

			if (inputs.indexOf(tagName) === -1) {
				util.warn('v-model only for using in ' + inputs.join(', '));
				return;
			}

			util.def(node, '_vmodel', field);

			var deps = this.getDeps(fors, field);
			var scope = this.getScope(fors, field);
			var getter = this.getEval(fors, field);

			var value = getter.call(scope, scope);
			var bind = util.getExpKey(field) || field;
			var args = [node, value, deps, scope, bind];

			// 根据不同表单类型绑定数据监测方法
			switch (type) {
				case 'text'    :
				case 'textarea': this.parseText.apply(this, args); break;
				case 'radio'   : this.parseRadio.apply(this, args); break;
				case 'checkbox': this.parseCheckbox.apply(this, args); break;
				case 'select'  : this.parseSelect.apply(this, args); break;
			}
		}

		/**
		 * v-model for text, textarea
		 */
		vmodel.parseText = function(node, value, deps, scope, field) {
			var vm = this.vm;
			var updater = vm.updater;

			// 更新视图
			updater.updateTextValue(node, value);

			// 订阅依赖监听
			vm.watcher.watch(deps, function(path, last) {
				updater.updateTextValue(node, last);
			}, this);

			// 绑定事件
			this.bindTextEvent(node, scope, field);
		}

		/**
		 * text, textarea 绑定数据监测
		 * @param   {Input}    node
		 * @param   {Object}   scope
		 * @param   {String}   field
		 */
		vmodel.bindTextEvent = function(node, scope, field) {
			var composeLock;

			// 解决中文输入时 input 事件在未选择词组时的触发问题
			// https://developer.mozilla.org/zh-CN/docs/Web/Events/compositionstart
			dom.addEvent(node, 'compositionstart', function() {
				composeLock = true;
			});
			dom.addEvent(node, 'compositionend', function() {
				composeLock = false;
			});

			// input 事件(实时触发)
			dom.addEvent(node, 'input', function() {
				if (!composeLock) {
					scope[field] = this.value;
				}
			});

			// change 事件(失去焦点触发)
			dom.addEvent(node, 'change', function() {
				scope[field] = this.value;
			});
		}

		/**
		 * v-model for radio
		 */
		vmodel.parseRadio = function(node, value, deps, scope, field) {
			var vm = this.vm;
			var updater = vm.updater;

			// 更新视图
			updater.updateRadioChecked(node, value);

			// 订阅依赖监听
			vm.watcher.watch(deps, function(path, last) {
				updater.updateRadioChecked(node, last);
			}, this);

			// 绑定事件
			this.bindRadioEvent(node, scope, field);
		}

		/**
		 * radio 绑定数据监测
		 * @param   {Input}    node
		 * @param   {Object}   scope
		 * @param   {String}   field
		 */
		vmodel.bindRadioEvent = function(node, scope, field) {
			dom.addEvent(node, 'change', function() {
				scope[field] = this.value;
			});
		}

		/**
		 * v-model for checkbox
		 */
		vmodel.parseCheckbox = function(node, value, deps, scope, field) {
			var vm = this.vm;
			var updater = vm.updater;

			// 更新视图
			updater.updateCheckboxChecked(node, value);

			// 订阅依赖监听
			vm.watcher.watch(deps, function(path, last) {
				updater.updateCheckboxChecked(node, last);
			}, this);

			// 绑定事件
			this.bindCheckboxEvent(node, scope, field, value);
		}

		/**
		 * checkbox 绑定数据监测
		 * @param   {Input}           node
		 * @param   {Object}          scope
		 * @param   {String}          field
		 * @param   {Array|Boolean}   value
		 */
		vmodel.bindCheckboxEvent = function(node, scope, field, value) {
			dom.addEvent(node, 'change', function() {
				var index, checked = this.checked, val = this.value;

				if (util.isBool(value)) {
					scope[field] = checked;
				}
				else if (util.isArray(value)) {
					index = value.indexOf(val);
					// hook
					if (checked) {
						if (index === -1) {
							value.push(val);
						}
					}
					// unhook
					else {
						if (index !== -1) {
							value.splice(index, 1);
						}
					}
				}
			});
		}

		/**
		 * v-model for select
		 */
		vmodel.parseSelect = function(node, value, deps, scope, field) {
			var updater = this.vm.updater;
			var options = node.options;
			var multi = dom.hasAttr(node, 'multiple');
			var option, i, leng = options.length, selects = [], isDefined;

			// 数据模型定义为单选
			if (util.isString(value)) {
				if (multi) {
					util.warn('<select> cannot be multiple when the model set \'' + field + '\' as not Array!');
					return;
				}
				isDefined = Boolean(value);
			}
			// 数据模型定义为多选
			else if (util.isArray(value)) {
				if (!multi) {
					util.warn('the model \'' + field + '\' cannot set as Array when <select> has no multiple propperty!');
					return;
				}
				isDefined = value.length > 0;
			}
			else {
				util.warn('the model ' + field + ' use in <select> must be a type of String or Array!');
				return;
			}

			// 数据模型中定义初始的选中状态
			if (isDefined) {
				updater.updateSelectChecked(node, value, multi);
			}
			// 模板中定义初始状态
			else {
				// 获取选中状态
				for (i = 0; i < leng; i++) {
					option = options[i];
					if (option.selected) {
						selects.push(option.value);
					}
				}
				scope[field] = multi ? selects : selects[0];
			}

			// 订阅依赖监测
			this.vm.watcher.watch(deps, function(path, last) {
				updater.updateSelectChecked(node, last, multi);
			});

			// 绑定事件
			this.bindSelectEvent(node, scope, field, multi);
		}

		/**
		 * select 绑定数据监测
		 * @param   {Input}     node
		 * @param   {Object}    scope
		 * @param   {String}    field
		 * @param   {Boolean}   multi
		 */
		vmodel.bindSelectEvent = function(node, scope, field, multi) {
			var self = this;
			dom.addEvent(node, 'change', function() {
				var selects = self.getSelected(this);
				scope[field] = multi ? selects : selects[0];
			});
		}

		/**
		 * 获取 select 的选中值
		 * @param   {Select}  select
		 * @return  {Array}
		 */
		vmodel.getSelected = function(select) {
			var options = select.options;
			var i, option, leng = options.length, sels = [];

			for (i = 0; i < leng; i++) {
				option = options[i];
				if (option.selected) {
					sels.push(option.value);
				}
			}

			return sels;
		}

		return Vmodel;
	}.apply(exports, __WEBPACK_AMD_DEFINE_ARRAY__), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));

/***/ }
/******/ ])
});
;