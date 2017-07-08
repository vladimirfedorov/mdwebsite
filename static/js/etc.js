/*
etc.js library — small yet effective way to manipulate DOM

_e element (html nodes) manipulation
_t templates
_c control
*/
(function() {
    'use strict';
    window.ETCVERSION = 1.0
    // Elements
    window._e = function(q, context) {
        var nodes = []
        nodes.even = function() {
            for(var i = 0; i < nodes.length; i++) {
                Array.prototype.splice.call(nodes, i, 1)
            }
            return nodes
        }
        nodes.odd = function() {
            for(var i = 1; i < nodes.length; i++) {
                Array.prototype.splice.call(nodes, i, 1)
            }
            return nodes
        }
        nodes.first = function(n) {
            Array.prototype.splice.call(nodes, Math.abs(n || 1))
            return nodes
        }
        nodes.last = function(n) {
            Array.prototype.splice.call(nodes, 0, nodes.length - Math.abs(n || 1))
            return nodes
        }
        nodes.attr = function(n) {
            var node = nodes[0],
                attrs = node.attributes,
                result = {},
                i = 0
            for (; i < attrs.length; i++) {
                result[attrs[i].name] = attrs[i].value
            }
            if (n === undefined) {
                return result
            } else {
                return result[n]
            }
        }
        nodes.css = function(v) {
            var node = nodes[0] || {},
                classes = []
            classes.add = function(c) {
                if (classes.indexOf(c) === -1) classes.push(c)
                node.className = classes.join(' ')
                return classes
            }
            classes.remove = function(c) {
                var i = classes.indexOf(c)
                if (i !== -1) classes.splice(i, 1)
                node.className = classes.join(' ')
                return classes
            }
            classes.has = function(c) {
                return (classes.indexOf(c) !== -1)
            }
            classes.toggle = function(c) {
                if (classes.has(c)) {
                    classes.remove(c)
                } else {
                    classes.add(c)
                }
                node.className = classes.join(' ')
                return classes
            }
            if (v === undefined) {
                var a = nodes[0].className.trim().split(' ')
                Array.prototype.push.apply(classes, Array.prototype.slice.call(a))
                return classes
            } else {
                nodes.forEach(function(node) {
                    node.className = v
                })
            }
        }
        nodes.val = function(v) {
            var n = nodes[0]
            if (v === undefined) {
                if (n.type === 'checkbox') {
                    return n.checked ? true : false
                } else if (n.type === 'radio') {
                    return n.checked ? n.value : undefined
                } else if (n.tagName === 'INPUT') {
                    return n.value
                } else if (n.tagName === 'SELECT') {
                    return n.value
                } else if (n.tagName === 'TEXTAREA') {
                    return n.value
                } else {
                    return n.innerHTML
                }
            } else {
                if (n.type === 'checkbox') {
                    n.checked = Boolean(v)
                } else if (n.type === 'radio') {
                    n.checked = (n.value == v)
                } else if (n.tagName === 'INPUT') {
                    n.value = v
                } else if (n.tagName === 'SELECT') {
                    n.value = v
                } else if (n.tagName === 'TEXTAREA') {
                    n.value = v
                } else {
                    n.innerHTML = v
                }
            }
        }
        // Querying
        if (context === undefined) {
            context = document
        }
        if (typeof q === "string") {
            return new _e(context.querySelectorAll(q), context)
        } else if ((q instanceof NodeList) || (q instanceof HTMLCollection)) {
            Array.prototype.push.apply(nodes, Array.prototype.slice.call(q))
            return nodes
        } else if (q instanceof Node) {
            Array.prototype.push.call(nodes, q)
            return nodes
        }
        return nodes
    }
    // Templates
    window._t = function(t, q, v) {
        var result = '',
            o = {}
        if (isString(t) && isObject(q)) {
            result = t
            for (var k in q) {
                var regex = new RegExp('{' + k + '}', 'g')
                result = result.replace(regex, q[k])
            }
            return result
        } else if (isString(t) && isString(q) && isObject(v)) {
            _e('[' + q + ']', _e(t)[0]).forEach(function(n) {
                var name = _e(n).attr(q)
                if (v[name] !== undefined) _e(n).val(v[name])
            })
        } else if (isString(t) && isString(q) && v === undefined) {
            _e('[' + q + ']', _e(t)[0]).forEach(function(n) {
                var name = _e(n).attr(q)
                o[name] = _e(n).val()
            })
            return o
        }
    }
    // Control
    window._c = {
        cookie: function cookie(name, value, attributes) {
            var store = {}
            document.cookie.split(';').forEach(function(i) {
                var v = i.trim().split('=')
                if (v.length === 2) store[v[0]] = v[1]
            })
            if (name === undefined) {
                return store
            } else if (value === undefined) {
                return store[name]
            } else {
                document.cookie = name + '=' + value + (attributes === undefined ? '' : ';' + attributes)
            }
        },
        merge: function(o1, o2, op) {
            if (isObject(o1) && isObject(o2)) {
                return mergeObjects(o1, o2, op)
            } else if (isArray(o1) && isArray(o2)) {
                return mergeArrays(o1, o2, op)
            }
        },
        get: function(link, params, cb) {
            ajax('GET', link, params, cb)
        },
        post: function(link, params, cb) {
            ajax('POST', link, params, cb)
        },
        put: function(link, params, cb) {
            ajax('PUT', link, params, cb)
        },
        del: function(link, params, cb) {
            ajax('DELETE', link, params, cb)
        },
        bindValue: function(o, property, node, cb) {
            var n = _e(node)[0], val
            if (n === undefined) return;
            Object.defineProperty(o, property, {
                enumerable: true,
                set: function(v) {
                    var changed = (val !== v)
                    val = v
                    _e(n).val(v)
                    if (cb !== undefined && changed) cb(v)
                },
                get: function() {
                    return val
                }
            })
            n.oninput = function() {
                o[property] = _e(n).val()
                if (cb !== undefined) cb(o[property])
            }
        },
        isNumber: isNumber,
        isString: isString,
        isArray:  isArray,
        isObject: isObject,
        keys:     compareKeys,
        owns:     owns,
        clone:    clone
    }
    // Perform an ajax request
    function ajax(method, link, params, cb) {
        var req = new ajaxRequest(),
            str = (typeof params == 'object' ? paramString(params) : typeof params == 'string' ? params : '')
        req.onreadystatechange = function() {
            var s = req.responseText,
                o = {}
            if (cb !== undefined && req.readyState === 4) {
                try { o = JSON.parse(s); } catch(e) { }
                cb(o, s, req)
            }
        }
        if (method.uppercase === 'GET') {
            req.open(method, link + '?' + str, true)
            req.send(null)
        } else {
            req.open(method, link, true)
            req.setRequestHeader("Content-type", "application/x-www-form-urlencoded")
            req.send(str)
        }
    }
    // Makes query parameter string from object
    function paramString(o) {
        var result = '',
            v
        for (var k in o) {
            v = (o[k] === true ? 1 : (o[k] === false ? 0 : encodeURIComponent(o[k])))
            result += (result.length === 0 ? "" : "&") + k + "=" +  v
        }
        return result
    }
    // Multi-browser ajax request
    function ajaxRequest() {
        var activexmodes=["Msxml2.XMLHTTP", "Microsoft.XMLHTTP"]
        if (window.ActiveXObject){
            for (var i=0; i<activexmodes.length; i++){
                try {
                    return new ActiveXObject(activexmodes[i])
                } catch(e) { }
            }
        } else if (window.XMLHttpRequest) {
            return new XMLHttpRequest()
        }
        return false
    }
    // Compare keyboard event with a human readable keyboard combination
    function compareKeys(e, keys) {
        var event = e || window.event,
            charCodes = {"§":192, "0":48, "1":49, "2":50, "3":51, "4":52, "5":53, "6":54, "7":55, "8":56, "9":57, "-":189, "=":187,
                         "a":65, "b":66, "c":67, "d":68, "e":69, "f":70, "g":71, "h":72, "i":73, "j":74,
                         "k":75, "l":76, "m":77, "n":78, "o":79, "p":80, "q":81, "r":82, "s":83, "t":84,
                         "u":85, "v":86, "w":87, "x":88, "y":89, "z":90,
                         "`":192, "[":219, "]":221, ";":186, "'":222, "\\":220, ",":188, ".":190, "/":191,
                         "backspace":8, "delete":46, "enter":13, "space":32,
                         "up":38, "down":40, "left":37, "right":39,
                         "!alt":18, "!meta":93, "!cmd":93, "!win":93, "!ctrl":17, "!shift":16
                        },
            commandKeys = {"shift":"shiftKey", "ctrl": "ctrlKey", "alt": "altKey", "altgr": "altGrapKey", "cmd": "metaKey", "win": "metaKey", "meta": "metaKey"},
            result = true,
            items = keys.split("+"),
            i = 0,
            key = ""
        for (; i < items.length; i++) {
            key = items[i].trim().toLowerCase()
            if ((charCodes[key] && event.keyCode !== charCodes[key]) || (commandKeys[key] && event[commandKeys[key]] === false)) {
                result = false
                break
            }
        }
        return result
    }
    // Check if object is an object, true for {}, false for []
    function isObject(o) {
        return ((typeof o === 'object') && (typeof o.pop === 'undefined'))
    }
    // Check if object is an array
    function isArray(o) {
        return ((typeof o === 'object') && (typeof o.pop === 'function'))
    }
    // Check if value is a number or can be parsed as a number
    function isNumber(o) {
        return ((parseFloat(o) == o) || (parseInt(o) == o))
    }
    // Chack if value is a string
    function isString(o) {
        return (typeof o === 'string')
    }
    // hasOwnProperty alias
    function owns(o, p) {
        return Object.prototype.hasOwnProperty.call(o, p)
    }
    // Make a deep copy of an object (array or object)
    function clone(o) {
        if(!o || 'object' !== typeof o)  {
            return o
        }
        var c = 'function' === typeof o.pop ? [] : {},
            p,
            v
        for(p in o) {
            if(owns(o, p)) {
                v = o[p]
                if(v && 'object' === typeof v) {
                    c[p] = clone(v)
                } else {
                    c[p] = v
                }
            }
        }
        return c
    }
    // Merge objects
    // o1, o2 - objects to merge
    // replace - true to replace values in o1 with values from o2
    function mergeObjects(o1, o2, replace) {
        var result = clone(o1)
        for (var k in o2) {
            if (owns(o2, k)) {
                if (!owns(o1, k) || replace) result[k] = o2[k]
            }
        }
        return result
    }
    // Merge arrays
    // a1, a2 — arrays to merge
    // op - merge operation,
    //      undefined: append elements from a2 that are not in a1
    //      false: remove a2 elements from a1
    //      true: toggle a2 elements in a1
    function mergeArrays(a1, a2, op) {
        var result = a1.slice()
        a2.forEach(function(item) {
            var index = result.indexOf(item)
            if (op === undefined) {
                if (-1 === index) result.push(item)
            } else if (op) {
                if (-1 === index) {
                    result.push(item)
                } else {
                    result.splice(index, 1)
                }
            } else {
                if (-1 !== index) result.splice(index, 1)
            }
        })
        return result
    }
})();
