/*[global-shim-start]*/
(function(exports, global, doEval){ // jshint ignore:line
	var origDefine = global.define;

	var get = function(name){
		var parts = name.split("."),
			cur = global,
			i;
		for(i = 0 ; i < parts.length; i++){
			if(!cur) {
				break;
			}
			cur = cur[parts[i]];
		}
		return cur;
	};
	var set = function(name, val){
		var parts = name.split("."),
			cur = global,
			i, part, next;
		for(i = 0; i < parts.length - 1; i++) {
			part = parts[i];
			next = cur[part];
			if(!next) {
				next = cur[part] = {};
			}
			cur = next;
		}
		part = parts[parts.length - 1];
		cur[part] = val;
	};
	var modules = (global.define && global.define.modules) ||
		(global._define && global._define.modules) || {};
	var ourDefine = global.define = function(moduleName, deps, callback){
		var module;
		if(typeof deps === "function") {
			callback = deps;
			deps = [];
		}
		var args = [],
			i;
		for(i =0; i < deps.length; i++) {
			args.push( exports[deps[i]] ? get(exports[deps[i]]) : ( modules[deps[i]] || get(deps[i]) )  );
		}
		// CJS has no dependencies but 3 callback arguments
		if(!deps.length && callback.length) {
			module = { exports: {} };
			var require = function(name) {
				return exports[name] ? get(exports[name]) : modules[name];
			};
			args.push(require, module.exports, module);
		}
		// Babel uses the exports and module object.
		else if(!args[0] && deps[0] === "exports") {
			module = { exports: {} };
			args[0] = module.exports;
			if(deps[1] === "module") {
				args[1] = module;
			}
		} else if(!args[0] && deps[0] === "module") {
			args[0] = { id: moduleName };
		}

		global.define = origDefine;
		var result = callback ? callback.apply(null, args) : undefined;
		global.define = ourDefine;

		// Favor CJS module.exports over the return value
		result = module && module.exports ? module.exports : result;
		modules[moduleName] = result;

		// Set global exports
		var globalExport = exports[moduleName];
		if(globalExport && !get(globalExport)) {
			set(globalExport, result);
		}
	};
	global.define.orig = origDefine;
	global.define.modules = modules;
	global.define.amd = true;
	ourDefine("@loader", [], function(){
		// shim for @@global-helpers
		var noop = function(){};
		return {
			get: function(){
				return { prepareGlobal: noop, retrieveGlobal: noop };
			},
			global: global,
			__exec: function(__load){
				doEval(__load.source, global);
			}
		};
	});
}
)({"can-util/namespace":"can"},window,function(__$source__, __$global__) { // jshint ignore:line
	eval("(function() { " + __$source__ + " \n }).call(__$global__);");
}
)
/*can-util@3.0.0-pre.28#dom/events/events*/
define('can-util/dom/events/events', function (require, exports, module) {
    module.exports = {
        addEventListener: function () {
            this.addEventListener.apply(this, arguments);
        },
        removeEventListener: function () {
            this.removeEventListener.apply(this, arguments);
        },
        canAddEventListener: function () {
            return this.nodeName && (this.nodeType === 1 || this.nodeType === 9) || this === window;
        }
    };
});
/*can-util@3.0.0-pre.28#js/cid/cid*/
define('can-util/js/cid/cid', function (require, exports, module) {
    var cid = 0;
    module.exports = function (object, name) {
        if (!object._cid) {
            cid++;
            object._cid = (name || '') + cid;
        }
        return object._cid;
    };
});
/*can-util@3.0.0-pre.28#js/is-empty-object/is-empty-object*/
define('can-util/js/is-empty-object/is-empty-object', function (require, exports, module) {
    module.exports = function (obj) {
        for (var prop in obj) {
            return false;
        }
        return true;
    };
});
/*can-util@3.0.0-pre.28#js/assign/assign*/
define('can-util/js/assign/assign', function (require, exports, module) {
    module.exports = function (d, s) {
        for (var prop in s) {
            d[prop] = s[prop];
        }
        return d;
    };
});
/*can-util@3.0.0-pre.28#js/global/global*/
define('can-util/js/global/global', function (require, exports, module) {
    (function (global) {
        module.exports = function () {
            return typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope ? self : typeof process === 'object' && {}.toString.call(process) === '[object process]' ? global : window;
        };
    }(function () {
        return this;
    }()));
});
/*can-util@3.0.0-pre.28#dom/document/document*/
define('can-util/dom/document/document', function (require, exports, module) {
    (function (global) {
        var global = require('can-util/js/global/global');
        var setDocument;
        module.exports = function (setDoc) {
            if (setDoc) {
                setDocument = setDoc;
            }
            return setDocument || global().document;
        };
    }(function () {
        return this;
    }()));
});
/*can-util@3.0.0-pre.28#dom/dispatch/dispatch*/
define('can-util/dom/dispatch/dispatch', function (require, exports, module) {
    var assign = require('can-util/js/assign/assign');
    var _document = require('can-util/dom/document/document');
    module.exports = function (event, args, bubbles) {
        var doc = _document();
        var ev = doc.createEvent('HTMLEvents');
        var isString = typeof event === 'string';
        ev.initEvent(isString ? event : event.type, bubbles === undefined ? true : bubbles, false);
        if (!isString) {
            assign(ev, event);
        }
        ev.args = args;
        return this.dispatchEvent(ev);
    };
});
/*can-util@3.0.0-pre.28#namespace*/
define('can-util/namespace', function (require, exports, module) {
    module.exports = {};
});
/*can-util@3.0.0-pre.28#dom/data/data*/
define('can-util/dom/data/data', function (require, exports, module) {
    var isEmptyObject = require('can-util/js/is-empty-object/is-empty-object');
    var data = {};
    var expando = 'can' + new Date();
    var uuid = 0;
    var setData = function (name, value) {
        var id = this[expando] || (this[expando] = ++uuid), store = data[id] || (data[id] = {});
        if (name !== undefined) {
            store[name] = value;
        }
        return store;
    };
    module.exports = {
        getCid: function () {
            return this[expando];
        },
        cid: function () {
            return this[expando] || (this[expando] = ++uuid);
        },
        expando: expando,
        clean: function (prop) {
            var id = this[expando];
            delete data[id][prop];
            if (isEmptyObject(data[id])) {
                delete data[id];
            }
        },
        get: function (key) {
            var id = this[expando], store = id && data[id];
            return key === undefined ? store || setData(this) : store && store[key];
        },
        set: setData
    };
});
/*can-util@3.0.0-pre.28#dom/matches/matches*/
define('can-util/dom/matches/matches', function (require, exports, module) {
    var matchesMethod = function (element) {
        return element.matches || element.webkitMatchesSelector || element.webkitMatchesSelector || element.mozMatchesSelector || element.msMatchesSelector || element.oMatchesSelector;
    };
    module.exports = function () {
        var method = matchesMethod(this);
        return method ? method.apply(this, arguments) : false;
    };
});
/*can-util@3.0.0-pre.28#js/is-array-like/is-array-like*/
define('can-util/js/is-array-like/is-array-like', function (require, exports, module) {
    function isArrayLike(obj) {
        var type = typeof obj;
        if (type === 'string') {
            return true;
        }
        var length = obj && type !== 'boolean' && typeof obj !== 'number' && 'length' in obj && obj.length;
        return typeof arr !== 'function' && (length === 0 || typeof length === 'number' && length > 0 && length - 1 in obj);
    }
    module.exports = isArrayLike;
});
/*can-util@3.0.0-pre.28#js/each/each*/
define('can-util/js/each/each', function (require, exports, module) {
    var isArrayLike = require('can-util/js/is-array-like/is-array-like');
    var has = Object.prototype.hasOwnProperty;
    function each(elements, callback, context) {
        var i = 0, key, len, item;
        if (elements) {
            if (isArrayLike(elements)) {
                for (len = elements.length; i < len; i++) {
                    item = elements[i];
                    if (callback.call(context || item, item, i, elements) === false) {
                        break;
                    }
                }
            } else if (typeof elements === 'object') {
                for (key in elements) {
                    if (has.call(elements, key) && callback.call(context || elements[key], elements[key], key, elements) === false) {
                        break;
                    }
                }
            }
        }
        return elements;
    }
    module.exports = each;
});
/*can-util@3.0.0-pre.28#dom/events/delegate/delegate*/
define('can-util/dom/events/delegate/delegate', function (require, exports, module) {
    var domEvents = require('can-util/dom/events/events');
    var domData = require('can-util/dom/data/data');
    var domMatches = require('can-util/dom/matches/matches');
    var each = require('can-util/js/each/each');
    var isEmptyObject = require('can-util/js/is-empty-object/is-empty-object');
    var dataName = 'delegateEvents';
    var handleEvent = function (ev) {
        var events = domData.get.call(this, dataName);
        var eventTypeEvents = events[ev.type];
        var matches = [];
        if (eventTypeEvents) {
            var selectorDelegates = [];
            each(eventTypeEvents, function (delegates) {
                selectorDelegates.push(delegates);
            });
            var cur = ev.target;
            do {
                selectorDelegates.forEach(function (delegates) {
                    if (domMatches.call(cur, delegates[0].selector)) {
                        matches.push({
                            target: cur,
                            delegates: delegates
                        });
                    }
                });
                cur = cur.parentNode;
            } while (cur && cur !== ev.currentTarget);
        }
        var oldStopProp = ev.stopPropagation;
        ev.stopPropagation = function () {
            oldStopProp.apply(this, arguments);
            this.cancelBubble = true;
        };
        for (var i = 0; i < matches.length; i++) {
            var match = matches[i];
            var delegates = match.delegates;
            for (var d = 0, dLen = delegates.length; d < dLen; d++) {
                if (delegates[d].handler.call(match.target, ev) === false) {
                    return false;
                }
                if (ev.cancelBubble) {
                    return;
                }
            }
        }
    };
    domEvents.addDelegateListener = function (eventType, selector, handler) {
        var events = domData.get.call(this, dataName), eventTypeEvents;
        if (!events) {
            domData.set.call(this, dataName, events = {});
        }
        if (!(eventTypeEvents = events[eventType])) {
            eventTypeEvents = events[eventType] = {};
            domEvents.addEventListener.call(this, eventType, handleEvent, false);
        }
        if (!eventTypeEvents[selector]) {
            eventTypeEvents[selector] = [];
        }
        eventTypeEvents[selector].push({
            handler: handler,
            selector: selector
        });
    };
    domEvents.removeDelegateListener = function (eventType, selector, handler) {
        var events = domData.get.call(this, dataName);
        if (events[eventType] && events[eventType][selector]) {
            var eventTypeEvents = events[eventType], delegates = eventTypeEvents[selector], i = 0;
            while (i < delegates.length) {
                if (delegates[i].handler === handler) {
                    delegates.splice(i, 1);
                } else {
                    i++;
                }
            }
            if (delegates.length === 0) {
                delete eventTypeEvents[selector];
                if (isEmptyObject(eventTypeEvents)) {
                    domEvents.removeEventListener.call(this, eventType, handleEvent, false);
                    delete events[eventType];
                    if (isEmptyObject(events)) {
                        domData.clean.call(this, dataName);
                    }
                }
            }
        }
    };
});
/*can-event@3.0.0-pre.4#can-event*/
define('can-event', function (require, exports, module) {
    var domEvents = require('can-util/dom/events/events');
    var CID = require('can-util/js/cid/cid');
    var isEmptyObject = require('can-util/js/is-empty-object/is-empty-object');
    var domDispatch = require('can-util/dom/dispatch/dispatch');
    var namespace = require('can-util/namespace');
    require('can-util/dom/events/delegate/delegate');
    var canEvent = {
        addEventListener: function (event, handler) {
            var allEvents = this.__bindEvents || (this.__bindEvents = {}), eventList = allEvents[event] || (allEvents[event] = []);
            eventList.push({
                handler: handler,
                name: event
            });
            return this;
        },
        removeEventListener: function (event, fn, __validate) {
            if (!this.__bindEvents) {
                return this;
            }
            var events = this.__bindEvents[event] || [], i = 0, ev, isFunction = typeof fn === 'function';
            while (i < events.length) {
                ev = events[i];
                if (__validate ? __validate(ev, event, fn) : isFunction && ev.handler === fn || !isFunction && (ev.cid === fn || !fn)) {
                    events.splice(i, 1);
                } else {
                    i++;
                }
            }
            return this;
        },
        dispatch: function (event, args) {
            var events = this.__bindEvents;
            if (!events) {
                return;
            }
            var eventName;
            if (typeof event === 'string') {
                eventName = event;
                event = { type: event };
            } else {
                eventName = event.type;
            }
            var handlers = events[eventName];
            if (!handlers) {
                return;
            } else {
                handlers = handlers.slice(0);
            }
            var passed = [event];
            if (args) {
                passed.push.apply(passed, args);
            }
            for (var i = 0, len = handlers.length; i < len; i++) {
                handlers[i].handler.apply(this, passed);
            }
            return event;
        },
        on: function (eventName, selector, handler) {
            var method = typeof selector === 'string' ? 'addDelegateListener' : 'addEventListener';
            var listenWithDOM = domEvents.canAddEventListener.call(this);
            var eventBinder = listenWithDOM ? domEvents[method] : this[method] || canEvent[method];
            return eventBinder.apply(this, arguments);
        },
        off: function (eventName, selector, handler) {
            var method = typeof selector === 'string' ? 'removeDelegateListener' : 'removeEventListener';
            var listenWithDOM = domEvents.canAddEventListener.call(this);
            var eventBinder = listenWithDOM ? domEvents[method] : this[method] || canEvent[method];
            return eventBinder.apply(this, arguments);
        },
        trigger: function () {
            var listenWithDOM = domEvents.canAddEventListener.call(this);
            var dispatch = listenWithDOM ? domDispatch : canEvent.dispatch;
            return dispatch.apply(this, arguments);
        },
        one: function (event, handler) {
            var one = function () {
                canEvent.off.call(this, event, one);
                return handler.apply(this, arguments);
            };
            canEvent.on.call(this, event, one);
            return this;
        },
        listenTo: function (other, event, handler) {
            var idedEvents = this.__listenToEvents;
            if (!idedEvents) {
                idedEvents = this.__listenToEvents = {};
            }
            var otherId = CID(other);
            var othersEvents = idedEvents[otherId];
            if (!othersEvents) {
                othersEvents = idedEvents[otherId] = {
                    obj: other,
                    events: {}
                };
            }
            var eventsEvents = othersEvents.events[event];
            if (!eventsEvents) {
                eventsEvents = othersEvents.events[event] = [];
            }
            eventsEvents.push(handler);
            canEvent.on.call(other, event, handler);
        },
        stopListening: function (other, event, handler) {
            var idedEvents = this.__listenToEvents, iterIdedEvents = idedEvents, i = 0;
            if (!idedEvents) {
                return this;
            }
            if (other) {
                var othercid = CID(other);
                (iterIdedEvents = {})[othercid] = idedEvents[othercid];
                if (!idedEvents[othercid]) {
                    return this;
                }
            }
            for (var cid in iterIdedEvents) {
                var othersEvents = iterIdedEvents[cid], eventsEvents;
                other = idedEvents[cid].obj;
                if (!event) {
                    eventsEvents = othersEvents.events;
                } else {
                    (eventsEvents = {})[event] = othersEvents.events[event];
                }
                for (var eventName in eventsEvents) {
                    var handlers = eventsEvents[eventName] || [];
                    i = 0;
                    while (i < handlers.length) {
                        if (handler && handler === handlers[i] || !handler) {
                            canEvent.off.call(other, eventName, handlers[i]);
                            handlers.splice(i, 1);
                        } else {
                            i++;
                        }
                    }
                    if (!handlers.length) {
                        delete othersEvents.events[eventName];
                    }
                }
                if (isEmptyObject(othersEvents.events)) {
                    delete idedEvents[cid];
                }
            }
            return this;
        }
    };
    canEvent.bind = canEvent.addEventListener;
    canEvent.addEvent = canEvent.addEventListener;
    canEvent.unbind = canEvent.removeEventListener;
    canEvent.removeEvent = canEvent.removeEventListener;
    canEvent.delegate = canEvent.on;
    canEvent.undelegate = canEvent.off;
    module.exports = namespace.event = canEvent;
});
/*can-util@3.0.0-pre.28#js/last/last*/
define('can-util/js/last/last', function (require, exports, module) {
    module.exports = function (arr) {
        return arr && arr[arr.length - 1];
    };
});
/*can-event@3.0.0-pre.4#batch/batch*/
define('can-event/batch/batch', function (require, exports, module) {
    var canEvent = require('can-event');
    var last = require('can-util/js/last/last');
    var namespace = require('can-util/namespace');
    var batchNum = 1, transactions = 0, dispatchingBatch = null, collectingBatch = null, batches = [], dispatchingBatches = false;
    var canBatch = {
        start: function (batchStopHandler) {
            transactions++;
            if (transactions === 1) {
                var batch = {
                    events: [],
                    callbacks: [],
                    number: batchNum++
                };
                batches.push(batch);
                if (batchStopHandler) {
                    batch.callbacks.push(batchStopHandler);
                }
                collectingBatch = batch;
            }
        },
        stop: function (force, callStart) {
            if (force) {
                transactions = 0;
            } else {
                transactions--;
            }
            if (transactions === 0) {
                collectingBatch = null;
                var batch;
                if (dispatchingBatches === false) {
                    dispatchingBatches = true;
                    while (batch = batches.shift()) {
                        var events = batch.events;
                        var callbacks = batch.callbacks;
                        dispatchingBatch = batch;
                        canBatch.batchNum = batch.number;
                        var i, len;
                        if (callStart) {
                            canBatch.start();
                        }
                        for (i = 0, len = events.length; i < len; i++) {
                            canEvent.dispatch.apply(events[i][0], events[i][1]);
                        }
                        canBatch._onDispatchedEvents(batch.number);
                        for (i = 0; i < callbacks.length; i++) {
                            callbacks[i]();
                        }
                        dispatchingBatch = null;
                        canBatch.batchNum = undefined;
                    }
                    dispatchingBatches = false;
                }
            }
        },
        _onDispatchedEvents: function () {
        },
        trigger: function (event, args) {
            var item = this;
            if (!item.__inSetup) {
                event = typeof event === 'string' ? { type: event } : event;
                if (collectingBatch) {
                    event.batchNum = collectingBatch.number;
                    collectingBatch.events.push([
                        item,
                        [
                            event,
                            args
                        ]
                    ]);
                } else if (event.batchNum) {
                    canEvent.dispatch.call(item, event, args);
                } else if (batches.length) {
                    canBatch.start();
                    event.batchNum = collectingBatch.number;
                    collectingBatch.events.push([
                        item,
                        [
                            event,
                            args
                        ]
                    ]);
                    canBatch.stop();
                } else {
                    canEvent.dispatch.call(item, event, args);
                }
            }
        },
        afterPreviousEvents: function (handler) {
            var batch = last(batches);
            if (batch) {
                var obj = {};
                canEvent.addEvent.call(obj, 'ready', handler);
                batch.events.push([
                    obj,
                    [
                        { type: 'ready' },
                        []
                    ]
                ]);
            } else {
                handler({});
            }
        },
        after: function (handler) {
            var batch = collectingBatch || dispatchingBatch;
            if (batch) {
                batch.callbacks.push(handler);
            } else {
                handler({});
            }
        }
    };
    module.exports = namespace.batch = canBatch;
});
/*can-observation@3.0.0-pre.0#can-observation*/
define('can-observation', function (require, exports, module) {
    require('can-event');
    var canBatch = require('can-event/batch/batch');
    var assign = require('can-util/js/assign/assign');
    var namespace = require('can-util/namespace');
    function Observation(func, context, compute) {
        this.newObserved = {};
        this.oldObserved = null;
        this.func = func;
        this.context = context;
        this.compute = compute.updater ? compute : { updater: compute };
        this.onDependencyChange = this.onDependencyChange.bind(this);
        this.depth = null;
        this.childDepths = {};
        this.ignore = 0;
        this.inBatch = false;
        this.ready = false;
        compute.observedInfo = this;
        this.setReady = this._setReady.bind(this);
    }
    var observationStack = [];
    assign(Observation.prototype, {
        getPrimaryDepth: function () {
            return this.compute._primaryDepth || 0;
        },
        _setReady: function () {
            this.ready = true;
        },
        getDepth: function () {
            if (this.depth !== null) {
                return this.depth;
            } else {
                return this.depth = this._getDepth();
            }
        },
        _getDepth: function () {
            var max = 0, childDepths = this.childDepths;
            for (var cid in childDepths) {
                if (childDepths[cid] > max) {
                    max = childDepths[cid];
                }
            }
            return max + 1;
        },
        addEdge: function (objEv) {
            objEv.obj.addEventListener(objEv.event, this.onDependencyChange);
            if (objEv.obj.observedInfo) {
                this.childDepths[objEv.obj._cid] = objEv.obj.observedInfo.getDepth();
                this.depth = null;
            }
        },
        removeEdge: function (objEv) {
            objEv.obj.removeEventListener(objEv.event, this.onDependencyChange);
            if (objEv.obj.observedInfo) {
                delete this.childDepths[objEv.obj._cid];
                this.depth = null;
            }
        },
        dependencyChange: function (ev) {
            if (this.bound && this.ready) {
                if (ev.batchNum !== undefined) {
                    if (ev.batchNum !== this.batchNum) {
                        Observation.registerUpdate(this);
                        this.batchNum = ev.batchNum;
                    }
                } else {
                    this.updateCompute(ev.batchNum);
                }
            }
        },
        onDependencyChange: function (ev, newVal, oldVal) {
            this.dependencyChange(ev, newVal, oldVal);
        },
        updateCompute: function (batchNum) {
            if (this.bound) {
                var oldValue = this.value;
                this.getValueAndBind();
                this.compute.updater(this.value, oldValue, batchNum);
            }
        },
        getValueAndBind: function () {
            this.bound = true;
            this.oldObserved = this.newObserved || {};
            this.ignore = 0;
            this.newObserved = {};
            this.ready = false;
            observationStack.push(this);
            this.value = this.func.call(this.context);
            observationStack.pop();
            this.updateBindings();
            canBatch.afterPreviousEvents(this.setReady);
        },
        updateBindings: function () {
            var newObserved = this.newObserved, oldObserved = this.oldObserved, name, obEv;
            for (name in newObserved) {
                obEv = newObserved[name];
                if (!oldObserved[name]) {
                    this.addEdge(obEv);
                } else {
                    oldObserved[name] = null;
                }
            }
            for (name in oldObserved) {
                obEv = oldObserved[name];
                if (obEv) {
                    this.removeEdge(obEv);
                }
            }
        },
        teardown: function () {
            this.bound = false;
            for (var name in this.newObserved) {
                var ob = this.newObserved[name];
                this.removeEdge(ob);
            }
            this.newObserved = {};
        }
    });
    var updateOrder = [], curPrimaryDepth = Infinity, maxPrimaryDepth = 0;
    Observation.registerUpdate = function (observeInfo, batchNum) {
        var depth = observeInfo.getDepth() - 1;
        var primaryDepth = observeInfo.getPrimaryDepth();
        curPrimaryDepth = Math.min(primaryDepth, curPrimaryDepth);
        maxPrimaryDepth = Math.max(primaryDepth, maxPrimaryDepth);
        var primary = updateOrder[primaryDepth] || (updateOrder[primaryDepth] = {
            observeInfos: [],
            current: Infinity,
            max: 0
        });
        var objs = primary.observeInfos[depth] || (primary.observeInfos[depth] = []);
        objs.push(observeInfo);
        primary.current = Math.min(depth, primary.current);
        primary.max = Math.max(depth, primary.max);
    };
    Observation.batchEnd = function (batchNum) {
        var cur;
        while (true) {
            if (curPrimaryDepth <= maxPrimaryDepth) {
                var primary = updateOrder[curPrimaryDepth];
                if (primary && primary.current <= primary.max) {
                    var last = primary.observeInfos[primary.current];
                    if (last && (cur = last.pop())) {
                        cur.updateCompute(batchNum);
                    } else {
                        primary.current++;
                    }
                } else {
                    curPrimaryDepth++;
                }
            } else {
                updateOrder = [];
                curPrimaryDepth = Infinity;
                maxPrimaryDepth = 0;
                return;
            }
        }
    };
    Observation.add = function (obj, event) {
        var top = observationStack[observationStack.length - 1];
        if (top && !top.ignore) {
            var evStr = event + '', name = obj._cid + '|' + evStr;
            if (top.traps) {
                top.traps.push({
                    obj: obj,
                    event: evStr,
                    name: name
                });
            } else if (!top.newObserved[name]) {
                top.newObserved[name] = {
                    obj: obj,
                    event: evStr
                };
            }
        }
    };
    Observation.addAll = function (observes) {
        var top = observationStack[observationStack.length - 1];
        if (top) {
            if (top.traps) {
                top.traps.push.apply(top.traps, observes);
            } else {
                for (var i = 0, len = observes.length; i < len; i++) {
                    var trap = observes[i], name = trap.name;
                    if (!top.newObserved[name]) {
                        top.newObserved[name] = trap;
                    }
                }
            }
        }
    };
    Observation.ignore = function (fn) {
        return function () {
            if (observationStack.length) {
                var top = observationStack[observationStack.length - 1];
                top.ignore++;
                var res = fn.apply(this, arguments);
                top.ignore--;
                return res;
            } else {
                return fn.apply(this, arguments);
            }
        };
    };
    Observation.trap = function () {
        if (observationStack.length) {
            var top = observationStack[observationStack.length - 1];
            var oldTraps = top.traps;
            var traps = top.traps = [];
            return function () {
                top.traps = oldTraps;
                return traps;
            };
        } else {
            return function () {
                return [];
            };
        }
    };
    Observation.trapsCount = function () {
        if (observationStack.length) {
            var top = observationStack[observationStack.length - 1];
            return top.traps.length;
        } else {
            return 0;
        }
    };
    Observation.isRecording = function () {
        var len = observationStack.length;
        return len && observationStack[len - 1].ignore === 0;
    };
    canBatch._onDispatchedEvents = Observation.batchEnd;
    module.exports = namespace.Observation = Observation;
});
/*can-event@3.0.0-pre.4#lifecycle/lifecycle*/
define('can-event/lifecycle/lifecycle', function (require, exports, module) {
    var canEvent = require('can-event');
    module.exports = {
        addAndSetup: function () {
            canEvent.addEventListener.apply(this, arguments);
            if (!this.__inSetup) {
                if (!this._bindings) {
                    this._bindings = 1;
                    if (this._eventSetup) {
                        this._eventSetup();
                    }
                } else {
                    this._bindings++;
                }
            }
            return this;
        },
        removeAndTeardown: function (event, handler) {
            if (!this.__bindEvents) {
                return this;
            }
            var handlers = this.__bindEvents[event] || [];
            var handlerCount = handlers.length;
            canEvent.removeEventListener.apply(this, arguments);
            if (this._bindings === null) {
                this._bindings = 0;
            } else {
                this._bindings = this._bindings - (handlerCount - handlers.length);
            }
            if (!this._bindings && this._eventTeardown) {
                this._eventTeardown();
            }
            return this;
        }
    };
});
/*can-util@3.0.0-pre.28#js/is-promise/is-promise*/
define('can-util/js/is-promise/is-promise', function (require, exports, module) {
    module.exports = function (obj) {
        return !!obj && (typeof obj === 'object' || typeof obj === 'function') && typeof obj.then === 'function';
    };
});
/*can-util@3.0.0-pre.28#js/types/types*/
define('can-util/js/types/types', function (require, exports, module) {
    var isPromise = require('can-util/js/is-promise/is-promise');
    var types = {
        isMapLike: function () {
            return false;
        },
        isListLike: function () {
            return false;
        },
        isPromise: function (obj) {
            return isPromise(obj);
        },
        isConstructor: function (func) {
            if (typeof func !== 'function') {
                return false;
            }
            for (var prop in func.prototype) {
                return true;
            }
            return false;
        },
        isCallableForValue: function (obj) {
            return typeof obj === 'function' && !types.isConstructor(obj);
        },
        isCompute: function (obj) {
            return obj && obj.isComputed;
        },
        DefaultMap: null,
        DefaultList: null
    };
    module.exports = types;
});
/*can-util@3.0.0-pre.28#js/is-array/is-array*/
define('can-util/js/is-array/is-array', function (require, exports, module) {
    module.exports = function (arr) {
        return Array.isArray(arr);
    };
});
/*can-util@3.0.0-pre.28#js/string/string*/
define('can-util/js/string/string', function (require, exports, module) {
    var isArray = require('can-util/js/is-array/is-array');
    var strUndHash = /_|-/, strColons = /\=\=/, strWords = /([A-Z]+)([A-Z][a-z])/g, strLowUp = /([a-z\d])([A-Z])/g, strDash = /([a-z\d])([A-Z])/g, strReplacer = /\{([^\}]+)\}/g, strQuote = /"/g, strSingleQuote = /'/g, strHyphenMatch = /-+(.)?/g, strCamelMatch = /[a-z][A-Z]/g, getNext = function (obj, prop, add) {
            var result = obj[prop];
            if (result === undefined && add === true) {
                result = obj[prop] = {};
            }
            return result;
        }, isContainer = function (current) {
            return /^f|^o/.test(typeof current);
        }, convertBadValues = function (content) {
            var isInvalid = content === null || content === undefined || isNaN(content) && '' + content === 'NaN';
            return '' + (isInvalid ? '' : content);
        };
    var string = {
        esc: function (content) {
            return convertBadValues(content).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(strQuote, '&#34;').replace(strSingleQuote, '&#39;');
        },
        getObject: function (name, roots, add) {
            var parts = name ? name.split('.') : [], length = parts.length, current, r = 0, i, container, rootsLength;
            roots = isArray(roots) ? roots : [roots || window];
            rootsLength = roots.length;
            if (!length) {
                return roots[0];
            }
            for (r; r < rootsLength; r++) {
                current = roots[r];
                container = undefined;
                for (i = 0; i < length && isContainer(current); i++) {
                    container = current;
                    current = getNext(container, parts[i]);
                }
                if (container !== undefined && current !== undefined) {
                    break;
                }
            }
            if (add === false && current !== undefined) {
                delete container[parts[i - 1]];
            }
            if (add === true && current === undefined) {
                current = roots[0];
                for (i = 0; i < length && isContainer(current); i++) {
                    current = getNext(current, parts[i], true);
                }
            }
            return current;
        },
        capitalize: function (s, cache) {
            return s.charAt(0).toUpperCase() + s.slice(1);
        },
        camelize: function (str) {
            return convertBadValues(str).replace(strHyphenMatch, function (match, chr) {
                return chr ? chr.toUpperCase() : '';
            });
        },
        hyphenate: function (str) {
            return convertBadValues(str).replace(strCamelMatch, function (str, offset) {
                return str.charAt(0) + '-' + str.charAt(1).toLowerCase();
            });
        },
        underscore: function (s) {
            return s.replace(strColons, '/').replace(strWords, '$1_$2').replace(strLowUp, '$1_$2').replace(strDash, '_').toLowerCase();
        },
        sub: function (str, data, remove) {
            var obs = [];
            str = str || '';
            obs.push(str.replace(strReplacer, function (whole, inside) {
                var ob = string.getObject(inside, data, remove === true ? false : undefined);
                if (ob === undefined || ob === null) {
                    obs = null;
                    return '';
                }
                if (isContainer(ob) && obs) {
                    obs.push(ob);
                    return '';
                }
                return '' + ob;
            }));
            return obs === null ? obs : obs.length <= 1 ? obs[0] : obs;
        },
        replacer: strReplacer,
        undHash: strUndHash
    };
    module.exports = string;
});
/*can-compute@3.0.0-pre.5#proto-compute*/
define('can-compute/proto-compute', function (require, exports, module) {
    var Observation = require('can-observation');
    var canEvent = require('can-event');
    var eventLifecycle = require('can-event/lifecycle/lifecycle');
    var canBatch = require('can-event/batch/batch');
    var CID = require('can-util/js/cid/cid');
    var assign = require('can-util/js/assign/assign');
    var types = require('can-util/js/types/types');
    var string = require('can-util/js/string/string');
    var isEmptyObject = require('can-util/js/is-empty-object/is-empty-object');
    var Compute = function (getterSetter, context, eventName, bindOnce) {
        CID(this, 'compute');
        var args = [];
        for (var i = 0, arglen = arguments.length; i < arglen; i++) {
            args[i] = arguments[i];
        }
        var contextType = typeof args[1];
        if (typeof args[0] === 'function') {
            this._setupGetterSetterFn(args[0], args[1], args[2], args[3]);
        } else if (args[1]) {
            if (contextType === 'string') {
                this._setupProperty(args[0], args[1], args[2]);
            } else if (contextType === 'function') {
                this._setupSetter(args[0], args[1], args[2]);
            } else {
                if (args[1] && args[1].fn) {
                    this._setupAsyncCompute(args[0], args[1]);
                } else {
                    this._setupSettings(args[0], args[1]);
                }
            }
        } else {
            this._setupSimpleValue(args[0]);
        }
        this._args = args;
        this._primaryDepth = 0;
        this.isComputed = true;
    };
    var updateOnChange = function (compute, newValue, oldValue, batchNum) {
        var valueChanged = newValue !== oldValue && !(newValue !== newValue && oldValue !== oldValue);
        if (valueChanged) {
            canBatch.trigger.call(compute, {
                type: 'change',
                batchNum: batchNum
            }, [
                newValue,
                oldValue
            ]);
        }
    };
    var setupComputeHandlers = function (compute, func, context) {
        var readInfo = new Observation(func, context, compute);
        return {
            _on: function () {
                readInfo.getValueAndBind();
                compute.value = readInfo.value;
                compute.hasDependencies = !isEmptyObject(readInfo.newObserved);
            },
            _off: function () {
                readInfo.teardown();
            },
            getDepth: function () {
                return readInfo.getDepth();
            }
        };
    };
    assign(Compute.prototype, {
        setPrimaryDepth: function (depth) {
            this._primaryDepth = depth;
        },
        _setupGetterSetterFn: function (getterSetter, context, eventName) {
            this._set = context ? getterSetter.bind(context) : getterSetter;
            this._get = context ? getterSetter.bind(context) : getterSetter;
            this._canObserve = eventName === false ? false : true;
            var handlers = setupComputeHandlers(this, getterSetter, context || this);
            assign(this, handlers);
        },
        _setupProperty: function (target, propertyName, eventName) {
            var isObserve = types.isMapLike(target), self = this, handler;
            if (isObserve) {
                handler = function (ev, newVal, oldVal) {
                    self.updater(newVal, oldVal, ev.batchNum);
                };
                this.hasDependencies = true;
                this._get = function () {
                    return target.attr(propertyName);
                };
                this._set = function (val) {
                    target.attr(propertyName, val);
                };
            } else {
                handler = function () {
                    self.updater(self._get(), self.value);
                };
                this._get = function () {
                    return string.getObject(propertyName, [target]);
                };
                this._set = function (value) {
                    var properties = propertyName.split('.'), leafPropertyName = properties.pop(), targetProperty = string.getObject(properties.join('.'), [target]);
                    targetProperty[leafPropertyName] = value;
                };
            }
            this._on = function (update) {
                canEvent.addEventListener.call(target, eventName || propertyName, handler);
                this.value = this._get();
            };
            this._off = function () {
                return canEvent.removeEventListener.call(target, eventName || propertyName, handler);
            };
        },
        _setupSetter: function (initialValue, setter, eventName) {
            this.value = initialValue;
            this._set = setter;
            assign(this, eventName);
        },
        _setupSettings: function (initialValue, settings) {
            this.value = initialValue;
            this._set = settings.set || this._set;
            this._get = settings.get || this._get;
            if (!settings.__selfUpdater) {
                var self = this, oldUpdater = this.updater;
                this.updater = function () {
                    oldUpdater.call(self, self._get(), self.value);
                };
            }
            this._on = settings.on ? settings.on : this._on;
            this._off = settings.off ? settings.off : this._off;
        },
        _setupAsyncCompute: function (initialValue, settings) {
            var self = this;
            var getter = settings.fn;
            var bindings;
            this.value = initialValue;
            this._setUpdates = true;
            this.lastSetValue = new Compute(initialValue);
            this._set = function (newVal) {
                if (newVal === self.lastSetValue.get()) {
                    return this.value;
                }
                return self.lastSetValue.set(newVal);
            };
            this._get = function () {
                return getter.call(settings.context, self.lastSetValue.get());
            };
            if (getter.length === 0) {
                bindings = setupComputeHandlers(this, getter, settings.context);
            } else if (getter.length === 1) {
                bindings = setupComputeHandlers(this, function () {
                    return getter.call(settings.context, self.lastSetValue.get());
                }, settings);
            } else {
                var oldUpdater = this.updater, setValue = function (newVal) {
                        oldUpdater.call(self, newVal, self.value);
                    };
                this.updater = function (newVal) {
                    oldUpdater.call(self, newVal, self.value);
                };
                bindings = setupComputeHandlers(this, function () {
                    var res = getter.call(settings.context, self.lastSetValue.get(), setValue);
                    return res !== undefined ? res : this.value;
                }, this);
            }
            assign(this, bindings);
        },
        _setupSimpleValue: function (initialValue) {
            this.value = initialValue;
        },
        _eventSetup: Observation.ignore(function () {
            this.bound = true;
            this._on(this.updater);
        }),
        _eventTeardown: function () {
            this._off(this.updater);
            this.bound = false;
        },
        addEventListener: eventLifecycle.addAndSetup,
        removeEventListener: eventLifecycle.removeAndTeardown,
        clone: function (context) {
            if (context && typeof this._args[0] === 'function') {
                this._args[1] = context;
            } else if (context) {
                this._args[2] = context;
            }
            return new Compute(this._args[0], this._args[1], this._args[2], this._args[3]);
        },
        _on: function () {
        },
        _off: function () {
        },
        get: function () {
            if (Observation.isRecording() && this._canObserve !== false) {
                Observation.add(this, 'change');
                if (!this.bound) {
                    Compute.temporarilyBind(this);
                }
            }
            if (this.bound) {
                return this.value;
            } else {
                return this._get();
            }
        },
        _get: function () {
            return this.value;
        },
        set: function (newVal) {
            var old = this.value;
            var setVal = this._set(newVal, old);
            if (this._setUpdates) {
                return this.value;
            }
            if (this.hasDependencies) {
                return this._get();
            }
            if (setVal === undefined) {
                this.value = this._get();
            } else {
                this.value = setVal;
            }
            updateOnChange(this, this.value, old);
            return this.value;
        },
        _set: function (newVal) {
            return this.value = newVal;
        },
        updater: function (newVal, oldVal, batchNum) {
            this.value = newVal;
            updateOnChange(this, newVal, oldVal, batchNum);
        },
        toFunction: function () {
            return this._computeFn.bind(this);
        },
        _computeFn: function (newVal) {
            if (arguments.length) {
                return this.set(newVal);
            }
            return this.get();
        }
    });
    Compute.prototype.on = Compute.prototype.bind = Compute.prototype.addEventListener;
    Compute.prototype.off = Compute.prototype.unbind = Compute.prototype.removeEventListener;
    var k = function () {
    };
    var computes;
    var unbindComputes = function () {
        for (var i = 0, len = computes.length; i < len; i++) {
            computes[i].removeEventListener('change', k);
        }
        computes = null;
    };
    Compute.temporarilyBind = function (compute) {
        var computeInstance = compute.computeInstance || compute;
        computeInstance.addEventListener('change', k);
        if (!computes) {
            computes = [];
            setTimeout(unbindComputes, 10);
        }
        computes.push(computeInstance);
    };
    Compute.async = function (initialValue, asyncComputer, context) {
        return new Compute(initialValue, {
            fn: asyncComputer,
            context: context
        });
    };
    Compute.truthy = function (compute) {
        return new Compute(function () {
            var res = compute.get();
            if (typeof res === 'function') {
                res = res.get();
            }
            return !!res;
        });
    };
    module.exports = exports = Compute;
});
/*can-compute@3.0.0-pre.5#can-compute*/
define('can-compute', function (require, exports, module) {
    require('can-event');
    require('can-event/batch/batch');
    var Compute = require('can-compute/proto-compute');
    var CID = require('can-util/js/cid/cid');
    var namespace = require('can-util/namespace');
    var COMPUTE = function (getterSetter, context, eventName, bindOnce) {
        var internalCompute = new Compute(getterSetter, context, eventName, bindOnce);
        var addEventListener = internalCompute.addEventListener;
        var removeEventListener = internalCompute.removeEventListener;
        var compute = function (val) {
            if (arguments.length) {
                return internalCompute.set(val);
            }
            return internalCompute.get();
        };
        var cid = CID(compute, 'compute');
        var handlerKey = '__handler' + cid;
        compute.bind = compute.addEventListener = function (ev, handler) {
            var computeHandler = handler && handler[handlerKey];
            if (handler && !computeHandler) {
                computeHandler = handler[handlerKey] = function () {
                    handler.apply(compute, arguments);
                };
            }
            return addEventListener.call(internalCompute, ev, computeHandler);
        };
        compute.unbind = compute.removeEventListener = function (ev, handler) {
            var computeHandler = handler && handler[handlerKey];
            if (computeHandler) {
                delete handler[handlerKey];
                return internalCompute.removeEventListener(ev, computeHandler);
            }
            return removeEventListener.apply(internalCompute, arguments);
        };
        compute.isComputed = internalCompute.isComputed;
        compute.clone = function (ctx) {
            if (typeof getterSetter === 'function') {
                context = ctx;
            }
            return COMPUTE(getterSetter, context, ctx, bindOnce);
        };
        compute.computeInstance = internalCompute;
        return compute;
    };
    COMPUTE.truthy = function (compute) {
        return COMPUTE(function () {
            var res = compute();
            if (typeof res === 'function') {
                res = res();
            }
            return !!res;
        });
    };
    COMPUTE.async = function (initialValue, asyncComputer, context) {
        return COMPUTE(initialValue, {
            fn: asyncComputer,
            context: context
        });
    };
    COMPUTE.temporarilyBind = Compute.temporarilyBind;
    module.exports = namespace.compute = COMPUTE;
});
/*can-util@3.0.0-pre.28#js/deparam/deparam*/
define('can-util/js/deparam/deparam', function (require, exports, module) {
    var each = require('can-util/js/each/each');
    var digitTest = /^\d+$/, keyBreaker = /([^\[\]]+)|(\[\])/g, paramTest = /([^?#]*)(#.*)?$/, prep = function (str) {
            return decodeURIComponent(str.replace(/\+/g, ' '));
        };
    module.exports = function (params) {
        var data = {}, pairs, lastPart;
        if (params && paramTest.test(params)) {
            pairs = params.split('&');
            each(pairs, function (pair) {
                var parts = pair.split('='), key = prep(parts.shift()), value = prep(parts.join('=')), current = data;
                if (key) {
                    parts = key.match(keyBreaker);
                    for (var j = 0, l = parts.length - 1; j < l; j++) {
                        if (!current[parts[j]]) {
                            current[parts[j]] = digitTest.test(parts[j + 1]) || parts[j + 1] === '[]' ? [] : {};
                        }
                        current = current[parts[j]];
                    }
                    lastPart = parts.pop();
                    if (lastPart === '[]') {
                        current.push(value);
                    } else {
                        current[lastPart] = value;
                    }
                }
            });
        }
        return data;
    };
});
/*can-util@3.0.0-pre.28#js/is-function/is-function*/
define('can-util/js/is-function/is-function', function (require, exports, module) {
    var isFunction = function () {
        if (typeof document !== 'undefined' && typeof document.getElementsByTagName('body') === 'function') {
            return function (value) {
                return Object.prototype.toString.call(value) === '[object Function]';
            };
        }
        return function (value) {
            return typeof value === 'function';
        };
    }();
    module.exports = isFunction;
});
/*can-util@3.0.0-pre.28#js/param/param*/
define('can-util/js/param/param', function (require, exports, module) {
    var isArray = require('can-util/js/is-array/is-array');
    function buildParam(prefix, obj, add) {
        if (isArray(obj)) {
            for (var i = 0, l = obj.length; i < l; ++i) {
                add(prefix + '[]', obj[i]);
            }
        } else if (obj && typeof obj === 'object') {
            for (var name in obj) {
                buildParam(prefix + '[' + name + ']', obj[name], add);
            }
        } else {
            add(prefix, obj);
        }
    }
    module.exports = function param(object) {
        var pairs = [], add = function (key, value) {
                pairs.push(encodeURIComponent(key) + '=' + encodeURIComponent(value));
            };
        for (var name in object) {
            buildParam(name, object[name], add);
        }
        return pairs.join('&').replace(/%20/g, '+');
    };
});
/*can-util@3.0.0-pre.28#js/is-plain-object/is-plain-object*/
define('can-util/js/is-plain-object/is-plain-object', function (require, exports, module) {
    var core_hasOwn = Object.prototype.hasOwnProperty;
    function isWindow(obj) {
        return obj !== null && obj == obj.window;
    }
    function isPlainObject(obj) {
        if (!obj || typeof obj !== 'object' || obj.nodeType || isWindow(obj)) {
            return false;
        }
        try {
            if (obj.constructor && !core_hasOwn.call(obj, 'constructor') && !core_hasOwn.call(obj.constructor.prototype, 'isPrototypeOf')) {
                return false;
            }
        } catch (e) {
            return false;
        }
        var key;
        for (key in obj) {
        }
        return key === undefined || core_hasOwn.call(obj, key);
    }
    module.exports = isPlainObject;
});
/*can-util@3.0.0-pre.28#js/deep-assign/deep-assign*/
define('can-util/js/deep-assign/deep-assign', function (require, exports, module) {
    var isArray = require('can-util/js/is-array/is-array');
    var isFunction = require('can-util/js/is-function/is-function');
    var isPlainObject = require('can-util/js/is-plain-object/is-plain-object');
    function deepAssign() {
        var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {}, i = 1, length = arguments.length;
        if (typeof target !== 'object' && !isFunction(target)) {
            target = {};
        }
        if (length === i) {
            target = this;
            --i;
        }
        for (; i < length; i++) {
            if ((options = arguments[i]) != null) {
                for (name in options) {
                    src = target[name];
                    copy = options[name];
                    if (target === copy) {
                        continue;
                    }
                    if (copy && (isPlainObject(copy) || (copyIsArray = isArray(copy)))) {
                        if (copyIsArray) {
                            copyIsArray = false;
                            clone = src && isArray(src) ? src : [];
                        } else {
                            clone = src && isPlainObject(src) ? src : {};
                        }
                        target[name] = deepAssign(clone, copy);
                    } else if (copy !== undefined) {
                        target[name] = copy;
                    }
                }
            }
        }
        return target;
    }
    module.exports = deepAssign;
});
/*can-util@3.0.0-pre.28#js/is-web-worker/is-web-worker*/
define('can-util/js/is-web-worker/is-web-worker', function (require, exports, module) {
    (function (global) {
        module.exports = function () {
            return typeof WorkerGlobalScope !== 'undefined' && this instanceof WorkerGlobalScope;
        };
    }(function () {
        return this;
    }()));
});
/*can-util@3.0.0-pre.28#js/is-browser-window/is-browser-window*/
define('can-util/js/is-browser-window/is-browser-window', function (require, exports, module) {
    (function (global) {
        module.exports = function () {
            return typeof window !== 'undefined' && typeof document !== 'undefined' && typeof SimpleDOM === 'undefined';
        };
    }(function () {
        return this;
    }()));
});
/*can-util@3.0.0-pre.28#js/make-array/make-array*/
define('can-util/js/make-array/make-array', function (require, exports, module) {
    var each = require('can-util/js/each/each');
    function makeArray(arr) {
        var ret = [];
        each(arr, function (a, i) {
            ret[i] = a;
        });
        return ret;
    }
    module.exports = makeArray;
});
/*can-route@3.0.0-pre.10#can-route*/
define('can-route', function (require, exports, module) {
    var canBatch = require('can-event/batch/batch');
    var canEvent = require('can-event');
    var Observation = require('can-observation');
    var compute = require('can-compute');
    var namespace = require('can-util/namespace');
    var deparam = require('can-util/js/deparam/deparam');
    var each = require('can-util/js/each/each');
    var string = require('can-util/js/string/string');
    var isFunction = require('can-util/js/is-function/is-function');
    var param = require('can-util/js/param/param');
    var isEmptyObject = require('can-util/js/is-empty-object/is-empty-object');
    var deepAssign = require('can-util/js/deep-assign/deep-assign');
    var isWebWorker = require('can-util/js/is-web-worker/is-web-worker');
    var isBrowserWindow = require('can-util/js/is-browser-window/is-browser-window');
    var makeArray = require('can-util/js/make-array/make-array');
    var assign = require('can-util/js/assign/assign');
    var types = require('can-util/js/types/types');
    var matcher = /\:([\w\.]+)/g;
    var paramsMatcher = /^(?:&[^=]+=[^&]*)+/;
    var makeProps = function (props) {
        var tags = [];
        each(props, function (val, name) {
            tags.push((name === 'className' ? 'class' : name) + '="' + (name === 'href' ? val : string.esc(val)) + '"');
        });
        return tags.join(' ');
    };
    var matchesData = function (route, data) {
        var count = 0, i = 0, defaults = {};
        for (var name in route.defaults) {
            if (route.defaults[name] === data[name]) {
                defaults[name] = 1;
                count++;
            }
        }
        for (; i < route.names.length; i++) {
            if (!data.hasOwnProperty(route.names[i])) {
                return -1;
            }
            if (!defaults[route.names[i]]) {
                count++;
            }
        }
        return count;
    };
    var location = typeof window !== 'undefined' ? window.location : {};
    var wrapQuote = function (str) {
        return (str + '').replace(/([.?*+\^$\[\]\\(){}|\-])/g, '\\$1');
    };
    var attrHelper = function (prop, value) {
        if ('attr' in this) {
            return this.attr.apply(this, arguments);
        } else {
            if (arguments.length > 1) {
                this.set(prop, value);
                return this;
            } else if (typeof prop === 'object') {
                this.set(prop);
                return this;
            } else if (arguments.length === 1) {
                return this.get(prop);
            } else {
                return this.toObject();
            }
        }
    };
    var stringify = function (obj) {
        if (obj && typeof obj === 'object') {
            if (obj && typeof obj === 'object' && 'serialize' in obj) {
                obj = obj.serialize();
            } else {
                obj = isFunction(obj.slice) ? obj.slice() : assign({}, obj);
            }
            each(obj, function (val, prop) {
                obj[prop] = stringify(val);
            });
        } else if (obj !== undefined && obj !== null && isFunction(obj.toString)) {
            obj = obj.toString();
        }
        return obj;
    };
    var removeBackslash = function (str) {
        return str.replace(/\\/g, '');
    };
    var timer;
    var curParams;
    var lastHash;
    var changingData;
    var changedAttrs = [];
    var eventsObject = assign({}, canEvent);
    var canRoute = function (url, defaults) {
        var root = canRoute._call('root');
        if (root.lastIndexOf('/') === root.length - 1 && url.indexOf('/') === 0) {
            url = url.substr(1);
        }
        defaults = defaults || {};
        var names = [], res, test = '', lastIndex = matcher.lastIndex = 0, next, querySeparator = canRoute._call('querySeparator'), matchSlashes = canRoute._call('matchSlashes');
        while (res = matcher.exec(url)) {
            names.push(res[1]);
            test += removeBackslash(url.substring(lastIndex, matcher.lastIndex - res[0].length));
            next = '\\' + (removeBackslash(url.substr(matcher.lastIndex, 1)) || querySeparator + (matchSlashes ? '' : '|/'));
            test += '([^' + next + ']' + (defaults[res[1]] ? '*' : '+') + ')';
            lastIndex = matcher.lastIndex;
        }
        test += url.substr(lastIndex).replace('\\', '');
        canRoute.routes[url] = {
            test: new RegExp('^' + test + '($|' + wrapQuote(querySeparator) + ')'),
            route: url,
            names: names,
            defaults: defaults,
            length: url.split('/').length
        };
        return canRoute;
    };
    var oldProperties = null;
    var onRouteDataChange = function (ev, newProps, oldProps) {
        changingData = 1;
        if (!oldProperties) {
            oldProperties = oldProps;
        }
        clearTimeout(timer);
        timer = setTimeout(function () {
            var old = oldProperties;
            oldProperties = null;
            changingData = 0;
            var serialized = canRoute.data.serialize(), path = canRoute.param(serialized, true);
            canRoute._call('setURL', path, newProps, old);
            canBatch.trigger(eventsObject, '__url', [
                path,
                lastHash
            ]);
            lastHash = path;
            changedAttrs = [];
        }, 10);
    };
    var stringCoercingMapDecorator = function (map) {
        var attrSuper = map.attr;
        map.attr = function (prop, val) {
            var serializable = this.define === undefined || this.define[prop] === undefined || !!this.define[prop].serialize, args;
            if (serializable) {
                args = stringify(Array.apply(null, arguments));
            } else {
                args = arguments;
            }
            return attrSuper.apply(this, args);
        };
        return map;
    };
    var recursiveClean = function (old, cur, data) {
        for (var attr in old) {
            if (cur[attr] === undefined) {
                if ('removeAttr' in data) {
                    data.removeAttr(attr);
                } else {
                    cur[attr] = undefined;
                }
            } else if (Object.prototype.toString.call(old[attr]) === '[object Object]') {
                recursiveClean(old[attr], cur[attr], attrHelper.call(data, attr));
            }
        }
    };
    var setState = canRoute.setState = function () {
        var hash = canRoute._call('matchingPartOfURL');
        var oldParams = curParams;
        curParams = canRoute.deparam(hash);
        if (!changingData || hash !== lastHash) {
            canRoute.batch.start();
            recursiveClean(oldParams, curParams, canRoute.data);
            canRoute.attr(curParams);
            canRoute.batch.trigger.call(eventsObject, '__url', [
                hash,
                lastHash
            ]);
            canRoute.batch.stop();
        }
    };
    assign(canRoute, {
        param: function (data, _setRoute) {
            var route, matches = 0, matchCount, routeName = data.route, propCount = 0;
            delete data.route;
            each(data, function () {
                propCount++;
            });
            each(canRoute.routes, function (temp, name) {
                matchCount = matchesData(temp, data);
                if (matchCount > matches) {
                    route = temp;
                    matches = matchCount;
                }
                if (matchCount >= propCount) {
                    return false;
                }
            });
            if (canRoute.routes[routeName] && matchesData(canRoute.routes[routeName], data) === matches) {
                route = canRoute.routes[routeName];
            }
            if (route) {
                var cpy = assign({}, data), res = route.route.replace(matcher, function (whole, name) {
                        delete cpy[name];
                        return data[name] === route.defaults[name] ? '' : encodeURIComponent(data[name]);
                    }).replace('\\', ''), after;
                each(route.defaults, function (val, name) {
                    if (cpy[name] === val) {
                        delete cpy[name];
                    }
                });
                after = param(cpy);
                if (_setRoute) {
                    canRoute.attr('route', route.route);
                }
                return res + (after ? canRoute._call('querySeparator') + after : '');
            }
            return isEmptyObject(data) ? '' : canRoute._call('querySeparator') + param(data);
        },
        deparam: function (url) {
            var root = canRoute._call('root');
            if (root.lastIndexOf('/') === root.length - 1 && url.indexOf('/') === 0) {
                url = url.substr(1);
            }
            var route = { length: -1 }, querySeparator = canRoute._call('querySeparator'), paramsMatcher = canRoute._call('paramsMatcher');
            each(canRoute.routes, function (temp, name) {
                if (temp.test.test(url) && temp.length > route.length) {
                    route = temp;
                }
            });
            if (route.length > -1) {
                var parts = url.match(route.test), start = parts.shift(), remainder = url.substr(start.length - (parts[parts.length - 1] === querySeparator ? 1 : 0)), obj = remainder && paramsMatcher.test(remainder) ? deparam(remainder.slice(1)) : {};
                obj = deepAssign(true, {}, route.defaults, obj);
                each(parts, function (part, i) {
                    if (part && part !== querySeparator) {
                        obj[route.names[i]] = decodeURIComponent(part);
                    }
                });
                obj.route = route.route;
                return obj;
            }
            if (url.charAt(0) !== querySeparator) {
                url = querySeparator + url;
            }
            return paramsMatcher.test(url) ? deparam(url.slice(1)) : {};
        },
        map: function (data) {
            canRoute.data = data;
        },
        routes: {},
        ready: function (val) {
            if (val !== true) {
                canRoute._setup();
                if (isBrowserWindow() || isWebWorker()) {
                    canRoute.setState();
                }
            }
            return canRoute;
        },
        url: function (options, merge) {
            if (merge) {
                Observation.add(eventsObject, '__url');
                options = assign({}, canRoute.deparam(canRoute._call('matchingPartOfURL')), options);
            }
            return canRoute._call('root') + canRoute.param(options);
        },
        link: function (name, options, props, merge) {
            return '<a ' + makeProps(assign({ href: canRoute.url(options, merge) }, props)) + '>' + name + '</a>';
        },
        current: function (options) {
            Observation.add(eventsObject, '__url');
            return this._call('matchingPartOfURL') === canRoute.param(options);
        },
        bindings: {
            hashchange: {
                paramsMatcher: paramsMatcher,
                querySeparator: '&',
                matchSlashes: false,
                bind: function () {
                    canEvent.on.call(window, 'hashchange', setState);
                },
                unbind: function () {
                    canEvent.on.call(window, 'hashchange', setState);
                },
                matchingPartOfURL: function () {
                    var loc = canRoute.location || location;
                    return loc.href.split(/#!?/)[1] || '';
                },
                setURL: function (path) {
                    if (location.hash !== '#' + path) {
                        location.hash = '!' + path;
                    }
                    return path;
                },
                root: '#!'
            }
        },
        defaultBinding: 'hashchange',
        currentBinding: null,
        _setup: function () {
            if (!canRoute.currentBinding) {
                canRoute._call('bind');
                canRoute.serializedCompute.addEventListener('change', onRouteDataChange);
                canRoute.currentBinding = canRoute.defaultBinding;
            }
        },
        _teardown: function () {
            if (canRoute.currentBinding) {
                canRoute._call('unbind');
                canRoute.serializedCompute.removeEventListener('change', onRouteDataChange);
                canRoute.currentBinding = null;
            }
            clearTimeout(timer);
            changingData = 0;
        },
        _call: function () {
            var args = makeArray(arguments), prop = args.shift(), binding = canRoute.bindings[canRoute.currentBinding || canRoute.defaultBinding], method = binding[prop];
            if (method.apply) {
                return method.apply(binding, args);
            } else {
                return method;
            }
        }
    });
    each([
        'addEventListener',
        'removeEventListener',
        'bind',
        'unbind',
        'on',
        'off',
        'delegate',
        'undelegate',
        'removeAttr',
        'compute',
        '_get',
        '___get',
        'each'
    ], function (name) {
        canRoute[name] = function () {
            if (!canRoute.data[name]) {
                return;
            }
            return canRoute.data[name].apply(canRoute.data, arguments);
        };
    });
    var routeData;
    var setRouteData = function (data) {
        routeData = data;
        return routeData;
    };
    var serializedCompute;
    Object.defineProperty(canRoute, 'serializedCompute', {
        get: function () {
            if (!serializedCompute) {
                serializedCompute = compute(function () {
                    return canRoute.data.serialize();
                });
            }
            return serializedCompute;
        }
    });
    Object.defineProperty(canRoute, 'data', {
        get: function () {
            if (routeData) {
                return routeData;
            } else if (types.DefaultMap) {
                if (types.DefaultMap.prototype.toObject) {
                    var DefaultRouteMap = types.DefaultMap.extend({ seal: false }, { '*': 'stringOrObservable' });
                    return setRouteData(new DefaultRouteMap());
                } else {
                    return setRouteData(stringCoercingMapDecorator(new types.DefaultMap()));
                }
            } else {
                throw new Error('can.route.data accessed without being set');
            }
        },
        set: function (data) {
            if (types.isConstructor(data)) {
                data = new data();
            }
            if ('attr' in data) {
                setRouteData(stringCoercingMapDecorator(data));
            } else {
                setRouteData(data);
            }
        }
    });
    canRoute.attr = function () {
        return attrHelper.apply(canRoute.data, arguments);
    };
    canRoute.batch = canBatch;
    var oldIsCallableForValue = types.isCallableForValue;
    types.isCallableForValue = function (obj) {
        if (obj === canRoute) {
            return false;
        } else {
            return oldIsCallableForValue.call(this, obj);
        }
    };
    module.exports = namespace.route = canRoute;
});
/*can-util@3.0.0-pre.28#js/dev/dev*/
define('can-util/js/dev/dev', function (require, exports, module) {
});
/*can-construct@3.0.0-pre.6#can-construct*/
define('can-construct', function (require, exports, module) {
    (function (global) {
        'use strict';
        var assign = require('can-util/js/assign/assign');
        var deepAssign = require('can-util/js/deep-assign/deep-assign');
        var dev = require('can-util/js/dev/dev');
        var makeArray = require('can-util/js/make-array/make-array');
        var types = require('can-util/js/types/types');
        var namespace = require('can-util/namespace');
        var initializing = 0;
        var Construct = function () {
            if (arguments.length) {
                return Construct.extend.apply(Construct, arguments);
            }
        };
        var canGetDescriptor;
        try {
            Object.getOwnPropertyDescriptor({});
            canGetDescriptor = true;
        } catch (e) {
            canGetDescriptor = false;
        }
        var getDescriptor = function (newProps, name) {
                var descriptor = Object.getOwnPropertyDescriptor(newProps, name);
                if (descriptor && (descriptor.get || descriptor.set)) {
                    return descriptor;
                }
                return null;
            }, inheritGetterSetter = function (newProps, oldProps, addTo) {
                addTo = addTo || newProps;
                var descriptor;
                for (var name in newProps) {
                    if (descriptor = getDescriptor(newProps, name)) {
                        this._defineProperty(addTo, oldProps, name, descriptor);
                    } else {
                        Construct._overwrite(addTo, oldProps, name, newProps[name]);
                    }
                }
            }, simpleInherit = function (newProps, oldProps, addTo) {
                addTo = addTo || newProps;
                for (var name in newProps) {
                    Construct._overwrite(addTo, oldProps, name, newProps[name]);
                }
            };
        assign(Construct, {
            constructorExtends: true,
            newInstance: function () {
                var inst = this.instance(), args;
                if (inst.setup) {
                    Object.defineProperty(inst, '__inSetup', {
                        configurable: true,
                        enumerable: false,
                        value: true,
                        writable: true
                    });
                    args = inst.setup.apply(inst, arguments);
                    inst.__inSetup = false;
                }
                if (inst.init) {
                    inst.init.apply(inst, args || arguments);
                }
                return inst;
            },
            _inherit: canGetDescriptor ? inheritGetterSetter : simpleInherit,
            _defineProperty: function (what, oldProps, propName, descriptor) {
                Object.defineProperty(what, propName, descriptor);
            },
            _overwrite: function (what, oldProps, propName, val) {
                what[propName] = val;
            },
            setup: function (base) {
                this.defaults = deepAssign(true, {}, base.defaults, this.defaults);
            },
            instance: function () {
                initializing = 1;
                var inst = new this();
                initializing = 0;
                return inst;
            },
            extend: function (name, staticProperties, instanceProperties) {
                var shortName = name, klass = staticProperties, proto = instanceProperties;
                if (typeof shortName !== 'string') {
                    proto = klass;
                    klass = shortName;
                    shortName = null;
                }
                if (!proto) {
                    proto = klass;
                    klass = null;
                }
                proto = proto || {};
                var _super_class = this, _super = this.prototype, Constructor, namespace, prototype;
                prototype = this.instance();
                Construct._inherit(proto, _super, prototype);
                if (shortName) {
                } else if (klass && klass.shortName) {
                    shortName = klass.shortName;
                } else if (this.shortName) {
                    shortName = this.shortName;
                }
                function init() {
                    if (!initializing) {
                        return (!this || this.constructor !== Constructor) && arguments.length && Constructor.constructorExtends ? Constructor.extend.apply(Constructor, arguments) : Constructor.newInstance.apply(Constructor, arguments);
                    }
                }
                if (typeof constructorName === 'undefined') {
                    Constructor = function () {
                        return init.apply(this, arguments);
                    };
                }
                for (var propName in _super_class) {
                    if (_super_class.hasOwnProperty(propName)) {
                        Constructor[propName] = _super_class[propName];
                    }
                }
                Construct._inherit(klass, _super_class, Constructor);
                assign(Constructor, {
                    constructor: Constructor,
                    prototype: prototype,
                    namespace: namespace
                });
                if (shortName !== undefined) {
                    Constructor.shortName = shortName;
                }
                Constructor.prototype.constructor = Constructor;
                var t = [_super_class].concat(makeArray(arguments)), args = Constructor.setup.apply(Constructor, t);
                if (Constructor.init) {
                    Constructor.init.apply(Constructor, args || t);
                }
                return Constructor;
            }
        });
        Construct.prototype.setup = function () {
        };
        Construct.prototype.init = function () {
        };
        var oldIsConstructor = types.isConstructor;
        types.isConstructor = function (obj) {
            return obj.prototype instanceof Construct || oldIsConstructor.call(null, obj);
        };
        module.exports = namespace.Construct = Construct;
    }(function () {
        return this;
    }()));
});
/*can-define@0.7.7#can-define*/
define('can-define', function (require, exports, module) {
    'use strict';
    'format cjs';
    var event = require('can-event');
    var eventLifecycle = require('can-event/lifecycle/lifecycle');
    var canBatch = require('can-event/batch/batch');
    var compute = require('can-compute');
    var Observation = require('can-observation');
    var canEach = require('can-util/js/each/each');
    var isEmptyObject = require('can-util/js/is-empty-object/is-empty-object');
    var assign = require('can-util/js/assign/assign');
    var dev = require('can-util/js/dev/dev');
    var CID = require('can-util/js/cid/cid');
    var isPlainObject = require('can-util/js/is-plain-object/is-plain-object');
    var isArray = require('can-util/js/is-array/is-array');
    var types = require('can-util/js/types/types');
    var behaviors, eventsProto, getPropDefineBehavior, define, make, makeDefinition, replaceWith, getDefinitionsAndMethods, isDefineType, getDefinitionOrMethod;
    module.exports = define = function (objPrototype, defines) {
        var dataInitializers = {}, computedInitializers = {};
        var result = getDefinitionsAndMethods(defines);
        canEach(result.definitions, function (definition, property) {
            define.property(objPrototype, property, definition, dataInitializers, computedInitializers);
        });
        replaceWith(objPrototype, '_data', function () {
            var map = this;
            var data = {};
            for (var prop in dataInitializers) {
                replaceWith(data, prop, dataInitializers[prop].bind(map), true);
            }
            return data;
        });
        replaceWith(objPrototype, '_computed', function () {
            var map = this;
            var data = {};
            for (var prop in computedInitializers) {
                replaceWith(data, prop, computedInitializers[prop].bind(map));
            }
            return data;
        });
        for (var prop in eventsProto) {
            Object.defineProperty(objPrototype, prop, {
                enumerable: false,
                value: eventsProto[prop],
                configurable: true,
                writable: true
            });
        }
        return result;
    };
    define.property = function (objPrototype, prop, definition, dataInitializers, computedInitializers) {
        var type = definition.type;
        delete definition.type;
        if (type && isEmptyObject(definition) && type === define.types['*']) {
            definition.type = type;
            Object.defineProperty(objPrototype, prop, {
                get: make.get.data(prop),
                set: make.set.events(prop, make.get.data(prop), make.set.data(prop), make.eventType.data(prop)),
                enumerable: true
            });
            return;
        }
        definition.type = type;
        var dataProperty = definition.get ? 'computed' : 'data', reader = make.read[dataProperty](prop), getter = make.get[dataProperty](prop), setter = make.set[dataProperty](prop), getInitialValue;
        var typeConvert = function (val) {
            return val;
        };
        if (definition.Type) {
            typeConvert = make.set.Type(prop, definition.Type, typeConvert);
        }
        if (type) {
            typeConvert = make.set.type(prop, type, typeConvert);
        }
        if (definition.value !== undefined || definition.Value !== undefined) {
            getInitialValue = make.get.defaultValue(prop, definition, typeConvert);
        }
        if (definition.get) {
            computedInitializers[prop] = make.compute(prop, definition.get, getInitialValue);
        } else if (getInitialValue) {
            dataInitializers[prop] = getInitialValue;
        }
        if (definition.get && definition.set) {
            setter = make.set.setter(prop, definition.set, make.read.lastSet(prop), setter, true);
        } else if (definition.set) {
            setter = make.set.events(prop, reader, setter, make.eventType[dataProperty](prop));
            setter = make.set.setter(prop, definition.set, reader, setter, false);
        } else if (!definition.get) {
            setter = make.set.events(prop, reader, setter, make.eventType[dataProperty](prop));
        }
        if (definition.Type) {
            setter = make.set.Type(prop, definition.Type, setter);
        }
        if (type) {
            setter = make.set.type(prop, type, setter);
        }
        Object.defineProperty(objPrototype, prop, {
            get: getter,
            set: setter,
            enumerable: 'serialize' in definition ? !!definition.serialize : !definition.get
        });
    };
    define.Constructor = function (defines) {
        var constructor = function (props) {
            define.setup.call(this, props);
        };
        define(constructor.prototype, defines);
        return constructor;
    };
    make = {
        compute: function (prop, get, defaultValue) {
            return function () {
                var map = this;
                return {
                    compute: compute.async(defaultValue && defaultValue(), get, map),
                    count: 0,
                    handler: function (ev, newVal, oldVal) {
                        canBatch.trigger.call(map, {
                            type: prop,
                            target: map
                        }, [
                            newVal,
                            oldVal
                        ]);
                    }
                };
            };
        },
        set: {
            data: function (prop) {
                return function (newVal) {
                    this._data[prop] = newVal;
                };
            },
            computed: function (prop) {
                return function (val) {
                    this._computed[prop].compute(val);
                };
            },
            events: function (prop, getCurrent, setData, eventType) {
                return function (newVal) {
                    var current = getCurrent.call(this);
                    if (newVal !== current) {
                        setData.call(this, newVal);
                        canBatch.trigger.call(this, {
                            type: prop,
                            target: this
                        }, [
                            newVal,
                            current
                        ]);
                    }
                };
            },
            setter: function (prop, setter, getCurrent, setEvents, hasGetter) {
                return function (value) {
                    var self = this;
                    canBatch.start();
                    var setterCalled = false, current = getCurrent.call(this), setValue = setter.call(this, value, function (value) {
                            setEvents.call(self, value);
                            setterCalled = true;
                        }, current);
                    if (setterCalled) {
                        canBatch.stop();
                    } else {
                        if (hasGetter) {
                            if (setValue !== undefined) {
                                if (current !== setValue) {
                                    setEvents.call(this, setValue);
                                }
                                canBatch.stop();
                            } else if (setter.length === 0) {
                                setEvents.call(this, value);
                                canBatch.stop();
                                return;
                            } else if (setter.length === 1) {
                                canBatch.stop();
                            } else {
                                canBatch.stop();
                                return;
                            }
                        } else {
                            if (setValue !== undefined) {
                                setEvents.call(this, setValue);
                                canBatch.stop();
                            } else if (setter.length === 0) {
                                setEvents.call(this, value);
                                canBatch.stop();
                                return;
                            } else if (setter.length === 1) {
                                setEvents.call(this, undefined);
                                canBatch.stop();
                            } else {
                                canBatch.stop();
                                return;
                            }
                        }
                    }
                };
            },
            type: function (prop, type, set) {
                if (typeof type === 'object') {
                    var SubType = define.Constructor(type);
                    return function (newValue) {
                        if (newValue instanceof SubType) {
                            return set.call(this, newValue);
                        } else {
                            return set.call(this, new SubType(newValue));
                        }
                    };
                } else {
                    return function (newValue) {
                        return set.call(this, type.call(this, newValue, prop));
                    };
                }
            },
            Type: function (prop, Type, set) {
                if (typeof Type === 'object') {
                    Type = define.constructor(Type);
                }
                return function (newValue) {
                    if (newValue instanceof Type) {
                        return set.call(this, newValue);
                    } else {
                        return set.call(this, new Type(newValue));
                    }
                };
            }
        },
        eventType: {
            data: function (prop) {
                return function (newVal, oldVal) {
                    return oldVal !== undefined || this._data.hasOwnProperty(prop) ? 'set' : 'add';
                };
            },
            computed: function () {
                return function () {
                    return 'set';
                };
            }
        },
        read: {
            data: function (prop) {
                return function () {
                    return this._data[prop];
                };
            },
            computed: function (prop) {
                return function () {
                    return this._computed[prop].compute();
                };
            },
            lastSet: function (prop) {
                return function () {
                    return this._computed[prop].compute.computeInstance.lastSetValue.get();
                };
            }
        },
        get: {
            defaultValue: function (prop, definition, typeConvert) {
                return function () {
                    var value = definition.value;
                    if (value !== undefined) {
                        if (typeof value === 'function') {
                            value = value.call(this);
                        }
                        return typeConvert(value);
                    }
                    var Value = definition.Value;
                    if (Value) {
                        return typeConvert(new Value());
                    }
                };
            },
            data: function (prop) {
                return function () {
                    Observation.add(this, prop);
                    return this._data[prop];
                };
            },
            computed: function (prop) {
                return function () {
                    return this._computed[prop].compute();
                };
            }
        }
    };
    behaviors = [
        'get',
        'set',
        'value',
        'Value',
        'type',
        'Type',
        'serialize'
    ];
    getPropDefineBehavior = function (behaviorName, prop, def, defaultDefinition) {
        if (behaviorName in def) {
            return def[behaviorName];
        } else {
            return defaultDefinition[behaviorName];
        }
    };
    makeDefinition = function (prop, def, defaultDefinition) {
        var definition = {};
        behaviors.forEach(function (behavior) {
            var behaviorDef = getPropDefineBehavior(behavior, prop, def, defaultDefinition);
            if (behaviorDef !== undefined) {
                if (behavior === 'type' && typeof behaviorDef === 'string') {
                    behaviorDef = define.types[behaviorDef];
                }
                definition[behavior] = behaviorDef;
            }
        });
        if (isEmptyObject(definition)) {
            definition.type = define.types['*'];
        }
        return definition;
    };
    getDefinitionOrMethod = function (prop, value, defaultDefinition) {
        var definition;
        if (typeof value === 'string') {
            definition = { type: value };
        } else if (typeof value === 'function') {
            if (types.isConstructor(value)) {
                definition = { Type: value };
            } else if (isDefineType(value)) {
                definition = { type: value };
            }
        } else if (isPlainObject(value)) {
            definition = value;
        }
        if (definition) {
            return makeDefinition(prop, definition, defaultDefinition);
        } else {
            return value;
        }
    };
    getDefinitionsAndMethods = function (defines) {
        var definitions = {};
        var methods = {};
        var defaults = defines['*'], defaultDefinition;
        if (defaults) {
            delete defines['*'];
            defaultDefinition = getDefinitionOrMethod('*', defaults, {});
        } else {
            defaultDefinition = {};
        }
        canEach(defines, function (value, prop) {
            if (prop === 'constructor') {
                methods[prop] = value;
                return;
            } else {
                var result = getDefinitionOrMethod(prop, value, defaultDefinition);
                if (result && typeof result === 'object') {
                    definitions[prop] = result;
                } else {
                    methods[prop] = result;
                }
            }
        });
        if (defaults) {
            defines['*'] = defaults;
        }
        return {
            definitions: definitions,
            methods: methods,
            defaultDefinition: defaultDefinition
        };
    };
    replaceWith = function (obj, prop, cb, writable) {
        Object.defineProperty(obj, prop, {
            configurable: true,
            get: function () {
                var value = cb.call(this, obj, prop);
                Object.defineProperty(this, prop, {
                    value: value,
                    writable: !!writable
                });
                return value;
            }
        });
    };
    eventsProto = assign({}, event);
    assign(eventsProto, {
        _eventSetup: function () {
        },
        _eventTeardown: function () {
        },
        addEventListener: function (eventName, handler) {
            var computedBinding = this._computed && this._computed[eventName];
            if (computedBinding && computedBinding.compute) {
                if (!computedBinding.count) {
                    computedBinding.count = 1;
                    computedBinding.compute.addEventListener('change', computedBinding.handler);
                } else {
                    computedBinding.count++;
                }
            }
            return eventLifecycle.addAndSetup.apply(this, arguments);
        },
        removeEventListener: function (eventName, handler) {
            var computedBinding = this._computed && this._computed[eventName];
            if (computedBinding) {
                if (computedBinding.count === 1) {
                    computedBinding.count = 0;
                    computedBinding.compute.removeEventListener('change', computedBinding.handler);
                } else {
                    computedBinding.count--;
                }
            }
            return eventLifecycle.removeAndTeardown.apply(this, arguments);
        },
        props: function () {
            var obj = {};
            for (var prop in this) {
                obj[prop] = this[prop];
            }
            return obj;
        }
    });
    eventsProto.on = eventsProto.bind = eventsProto.addEventListener;
    eventsProto.off = eventsProto.unbind = eventsProto.removeEventListener;
    delete eventsProto.one;
    var defineConfigurableAndNotEnumerable = function (obj, prop, value) {
        Object.defineProperty(obj, prop, {
            configurable: true,
            enumerable: false,
            writable: true,
            value: value
        });
    };
    define.setup = function (props, sealed) {
        defineConfigurableAndNotEnumerable(this, '_cid');
        defineConfigurableAndNotEnumerable(this, '__bindEvents', {});
        defineConfigurableAndNotEnumerable(this, '_bindings', 0);
        CID(this);
        assign(this, props);
    };
    define.replaceWith = replaceWith;
    define.eventsProto = eventsProto;
    define.defineConfigurableAndNotEnumerable = defineConfigurableAndNotEnumerable;
    define.make = make;
    define.getDefinitionOrMethod = getDefinitionOrMethod;
    isDefineType = function (func) {
        return func && func.canDefineType === true;
    };
    define.types = {
        'date': function (str) {
            var type = typeof str;
            if (type === 'string') {
                str = Date.parse(str);
                return isNaN(str) ? null : new Date(str);
            } else if (type === 'number') {
                return new Date(str);
            } else {
                return str;
            }
        },
        'number': function (val) {
            if (val == null) {
                return val;
            }
            return +val;
        },
        'boolean': function (val) {
            if (val === 'false' || val === '0' || !val) {
                return false;
            }
            return true;
        },
        'stringOrObservable': function (newVal) {
            if (isArray(newVal)) {
                return new types.DefaultList(newVal);
            } else if (isPlainObject(newVal)) {
                return new types.DefaultMap(newVal);
            } else {
                return define.types.string(newVal);
            }
        },
        'htmlbool': function (val) {
            return typeof val === 'string' || !!val;
        },
        '*': function (val) {
            return val;
        },
        'any': function (val) {
            return val;
        },
        'string': function (val) {
            if (val == null) {
                return val;
            }
            return '' + val;
        },
        'compute': {
            set: function (newValue, setVal, setErr, oldValue) {
                if (newValue.isComputed) {
                    return newValue;
                }
                if (oldValue && oldValue.isComputed) {
                    oldValue(newValue);
                    return oldValue;
                }
                return newValue;
            },
            get: function (value) {
                return value && value.isComputed ? value() : value;
            }
        }
    };
});
/*can-define@0.7.7#define-helpers/define-helpers*/
define('can-define/define-helpers/define-helpers', function (require, exports, module) {
    var simpleGetterSetters = {};
    var make = require('can-define').make;
    var isArray = require('can-util/js/is-array/is-array');
    var isPlainObject = require('can-util/js/is-plain-object/is-plain-object');
    var CID = require('can-util/js/cid/cid');
    var each = require('can-util/js/each/each');
    var hasMethod = function (obj, method) {
        return obj && typeof obj == 'object' && method in obj;
    };
    var defineHelpers = {
        extendedSetup: function (props) {
            assign(this, props);
        },
        simpleTypeConvert: function (newVal) {
            if (isArray(newVal)) {
                newVal = new defineHelpers.DefineList(newVal);
            } else if (isPlainObject(newVal)) {
                newVal = new defineHelpers.DefineMap(newVal);
            }
            return newVal;
        },
        makeSimpleGetterSetter: function (prop) {
            if (!simpleGetterSetters[prop]) {
                var setter = make.set.events(prop, make.get.data(prop), make.set.data(prop), make.eventType.data(prop));
                simpleGetterSetters[prop] = {
                    get: make.get.data(prop),
                    set: function (newVal) {
                        return setter.call(this, defineHelpers.simpleTypeConvert(newVal));
                    },
                    enumerable: true
                };
            }
            return simpleGetterSetters[prop];
        },
        getValue: function (map, name, val, how) {
            if (hasMethod(val, how)) {
                return val[how]();
            } else {
                return val;
            }
        },
        serialize: function () {
            var serializeMap = null;
            return function (map, how, where) {
                var cid = CID(map), firstSerialize = false;
                if (!serializeMap) {
                    firstSerialize = true;
                    serializeMap = {
                        toObject: {},
                        serialize: {}
                    };
                }
                serializeMap[how][cid] = where;
                map.each(function (val, name) {
                    var result, isObservable = hasMethod(val, how), serialized = isObservable && serializeMap[how][CID(val)];
                    if (serialized) {
                        result = serialized;
                    } else {
                        result = defineHelpers.getValue(map, name, val, how);
                    }
                    if (result !== undefined) {
                        where[name] = result;
                    }
                });
                if (firstSerialize) {
                    serializeMap = null;
                }
                return where;
            };
        }()
    };
    module.exports = defineHelpers;
});
/*can-define@0.7.7#map/map*/
define('can-define/map/map', function (require, exports, module) {
    var Construct = require('can-construct');
    var define = require('can-define');
    var assign = require('can-util/js/assign/assign');
    var each = require('can-util/js/each/each');
    var isArray = require('can-util/js/is-array/is-array');
    var isPlainObject = require('can-util/js/is-plain-object/is-plain-object');
    var defineHelpers = require('can-define/define-helpers/define-helpers');
    var Observation = require('can-observation');
    var CID = require('can-util/js/cid/cid');
    var types = require('can-util/js/types/types');
    var canBatch = require('can-event/batch/batch');
    var make = define.make;
    var defineExpando = function (map, prop, value) {
        var constructorDefines = map.constructor.definitions;
        if (constructorDefines && constructorDefines[prop]) {
            return;
        }
        var instanceDefines = map._definitions;
        if (!instanceDefines) {
            instanceDefines = map._definitions = {};
        }
        if (!instanceDefines[prop]) {
            var defaultDefinition = map.constructor.defaultDefinition || { type: defineHelpers.simpleTypeConvert };
            define.property(map, prop, defaultDefinition, {}, {});
            map._data[prop] = defaultDefinition.type ? defaultDefinition.type(value) : defineHelpers.simpleTypeConvert(value);
            instanceDefines[prop] = {};
            canBatch.start();
            canBatch.trigger.call(map, {
                type: '__keys',
                target: map
            });
            if (map._data[prop] !== undefined) {
                canBatch.trigger.call(map, {
                    type: prop,
                    target: map
                }, [
                    map._data[prop],
                    undefined
                ]);
            }
            canBatch.stop();
            return true;
        }
    };
    var readWithoutObserve = Observation.ignore(function (map, prop) {
        return map[prop];
    });
    var eachDefinition = function (map, cb, thisarg, definitions, observe) {
        for (var prop in definitions) {
            var definition = definitions[prop];
            if (typeof definition !== 'object' || ('serialize' in definition ? !!definition.serialize : !definition.get)) {
                var item = observe === false ? readWithoutObserve(map, prop) : map[prop];
                if (cb.call(thisarg || item, item, prop, map) === false) {
                    return false;
                }
            }
        }
    };
    var setProps = function (props, remove) {
        props = assign({}, props);
        var prop, self = this, newVal;
        canBatch.start();
        this.each(function (curVal, prop) {
            if (prop === '_cid') {
                return;
            }
            newVal = props[prop];
            if (newVal === undefined) {
                if (remove) {
                    self[prop] = undefined;
                }
                return;
            }
            if (typeof curVal !== 'object') {
                self.set(prop, newVal);
            } else if ('set' in curVal && isPlainObject(newVal)) {
                curVal.set(newVal, remove);
            } else if ('attr' in curVal && (isPlainObject(newVal) || isArray(newVal))) {
                curVal.attr(newVal, remove);
            } else if ('replace' in curVal && isArray(newVal)) {
                curVal.replace(newVal);
            } else if (curVal !== newVal) {
                self.set(prop, newVal);
            }
            delete props[prop];
        }, this, false);
        for (prop in props) {
            if (prop !== '_cid') {
                newVal = props[prop];
                this.set(prop, newVal);
            }
        }
        canBatch.stop();
        return this;
    };
    var DefineMap = Construct.extend('DefineMap', {
        setup: function () {
            if (DefineMap) {
                var prototype = this.prototype;
                var result = define(prototype, prototype);
                this.definitions = result.definitions;
                this.defaultDefinition = result.defaultDefinition;
                this.prototype.setup = function (props) {
                    if (this.constructor.seal === false) {
                        var self = this;
                        each(props, function (value, prop) {
                            defineExpando(self, prop);
                        });
                    }
                    define.setup.call(this, props, this.constructor.seal);
                };
            }
        }
    }, {
        setup: function (props, sealed) {
            CID(this);
            var data = this._data = {};
            var map = this;
            this._definitions = {};
            each(props, function (value, prop) {
                Object.defineProperty(map, prop, defineHelpers.makeSimpleGetterSetter(prop));
                data[prop] = defineHelpers.simpleTypeConvert(value);
                map._definitions[prop] = {};
            });
        },
        get: function (prop) {
            defineExpando(this, prop);
            return this[prop];
        },
        set: function (prop, value) {
            if (typeof prop === 'object') {
                return setProps.call(this, prop, value);
            }
            var defined = defineExpando(this, prop, value);
            if (!defined) {
                this[prop] = value;
            }
            return this;
        },
        serialize: function () {
            return defineHelpers.serialize(this, 'serialize', {});
        },
        toObject: function () {
            return defineHelpers.serialize(this, 'toObject', {});
        },
        each: function (cb, thisarg, observe) {
            if (observe !== false) {
                Observation.add(this, '__keys');
            }
            var res;
            var constructorDefinitions = this.constructor.definitions;
            if (constructorDefinitions) {
                res = eachDefinition(this, cb, thisarg, constructorDefinitions, observe);
            }
            if (res === false) {
                return this;
            }
            if (this._definitions) {
                eachDefinition(this, cb, thisarg, this._definitions, observe);
            }
            return this;
        },
        '*': { type: defineHelpers.simpleTypeConvert }
    });
    for (var prop in define.eventsProto) {
        Object.defineProperty(DefineMap.prototype, prop, {
            enumerable: false,
            value: define.eventsProto[prop]
        });
    }
    defineHelpers.DefineMap = DefineMap;
    types.DefaultMap = DefineMap;
    module.exports = DefineMap;
});
/*[global-shim-end]*/
(function(){ // jshint ignore:line
	window._define = window.define;
	window.define = window.define.orig;
}
)();