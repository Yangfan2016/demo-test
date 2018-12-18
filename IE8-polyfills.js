
// 参考: http://es5.github.com/#x15.4.4.19
; (function (window, $, undefined) {
    // helpers
    var isIE = !!window.ActiveXObject || "ActiveXObject" in window;
    var UA = navigator.userAgent.toLocaleLowerCase();
    var testIE = UA.match(/msie ([\d\.]+)/);
    var isIE8 = false;
    testIE && (isIE8 = +testIE[1] === 8);
    // Function#bind
    if (!Function.prototype.bind) {
        Function.prototype.bind = function (oThis) {
            if (typeof this !== 'function') {
                // closest thing possible to the ECMAScript 5
                // internal IsCallable function
                throw new TypeError('Function.prototype.bind - what is trying to be bound is not callable');
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function () { },
                fBound = function () {
                    // this instanceof fNOP === true时,说明返回的fBound被当做new的构造函数调用
                    return fToBind.apply(this instanceof fNOP
                        ? this
                        : oThis,
                        // 获取调用时(fBound)的传参.bind 返回的函数入参往往是这么传递的
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            // 维护原型关系
            if (this.prototype) {
                // Function.prototype doesn't have a prototype property
                fNOP.prototype = this.prototype;
            }
            // 下行的代码使fBound.prototype是fNOP的实例,因此
            // 返回的fBound若作为new的构造函数,new生成的新对象作为this传入fBound,新对象的__proto__就是fNOP的实例
            fBound.prototype = new fNOP();

            return fBound;
        };
    }
    // Array#map
    if (!Array.prototype.map) {
        Array.prototype.map = function (callback, thisArg) {

            var T, A, k;

            if (this == null) {
                throw new TypeError(" this is null or not defined");
            }

            // 1. 将O赋值为调用map方法的数组.
            var O = Object(this);

            // 2.将len赋值为数组O的长度.
            var len = O.length >>> 0;

            // 3.如果callback不是函数,则抛出TypeError异常.
            if (Object.prototype.toString.call(callback) != "[object Function]") {
                throw new TypeError(callback + " is not a function");
            }

            // 4. 如果参数thisArg有值,则将T赋值为thisArg;否则T为undefined.
            if (thisArg) {
                T = thisArg;
            }

            // 5. 创建新数组A,长度为原数组O长度len
            A = new Array(len);

            // 6. 将k赋值为0
            k = 0;

            // 7. 当 k < len 时,执行循环.
            while (k < len) {

                var kValue, mappedValue;

                //遍历O,k为原数组索引
                if (k in O) {

                    //kValue为索引k对应的值.
                    kValue = O[k];

                    // 执行callback,this指向T,参数有三个.分别是kValue:值,k:索引,O:原数组.
                    mappedValue = callback.call(T, kValue, k, O);

                    // 返回值添加到新数组A中.
                    A[k] = mappedValue;
                }
                // k自增1
                k++;
            }

            // 8. 返回新数组A
            return A;
        };
    }
    // Array#forEach
    if (!Array.prototype.forEach) {

        Array.prototype.forEach = function (callback, thisArg) {

            var T, k;

            if (this == null) {
                throw new TypeError(' this is null or not defined');
            }

            // 1. Let O be the result of calling toObject() passing the
            // |this| value as the argument.
            var O = Object(this);

            // 2. Let lenValue be the result of calling the Get() internal
            // method of O with the argument "length".
            // 3. Let len be toUint32(lenValue).
            var len = O.length >>> 0;

            // 4. If isCallable(callback) is false, throw a TypeError exception. 
            // See: http://es5.github.com/#x9.11
            if (typeof callback !== "function") {
                throw new TypeError(callback + ' is not a function');
            }

            // 5. If thisArg was supplied, let T be thisArg; else let
            // T be undefined.
            if (arguments.length > 1) {
                T = thisArg;
            }

            // 6. Let k be 0
            k = 0;

            // 7. Repeat, while k < len
            while (k < len) {

                var kValue;

                // a. Let Pk be ToString(k).
                //    This is implicit for LHS operands of the in operator
                // b. Let kPresent be the result of calling the HasProperty
                //    internal method of O with argument Pk.
                //    This step can be combined with c
                // c. If kPresent is true, then
                if (k in O) {

                    // i. Let kValue be the result of calling the Get internal
                    // method of O with argument Pk.
                    kValue = O[k];

                    // ii. Call the Call internal method of callback with T as
                    // the this value and argument list containing kValue, k, and O.
                    callback.call(T, kValue, k, O);
                }
                // d. Increase k by 1.
                k++;
            }
            // 8. return undefined
        };
    }
    // Object.keys
    if (!Object.keys) {
        Object.keys = (function () {
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !({ toString: null }).propertyIsEnumerable('toString'),
                dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ],
                dontEnumsLength = dontEnums.length;

            return function (obj) {
                if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) throw new TypeError('Object.keys called on non-object');

                var result = [];

                for (var prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) result.push(prop);
                }

                if (hasDontEnumBug) {
                    for (var i = 0; i < dontEnumsLength; i++) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) result.push(dontEnums[i]);
                    }
                }
                return result;
            }
        })()
    };
    // Object.assign
    if (typeof Object.assign != 'function') {
        // for IE 8
        if (isIE8) {
            Object.assign = $.extend;
            return;
        }
        // Must be writable: true, enumerable: false, configurable: true
        Object.defineProperty(Object, "assign", {
            value: function assign(target, varArgs) { // .length of function is 2
                'use strict';
                if (target == null) { // TypeError if undefined or null
                    throw new TypeError('Cannot convert undefined or null to object');
                }

                var to = Object(target);

                for (var index = 1; index < arguments.length; index++) {
                    var nextSource = arguments[index];

                    if (nextSource != null) { // Skip over if undefined or null
                        for (var nextKey in nextSource) {
                            // Avoid bugs when hasOwnProperty is shadowed
                            if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
                                to[nextKey] = nextSource[nextKey];
                            }
                        }
                    }
                }
                return to;
            },
            writable: true,
            configurable: true
        });
    }
}(window, jQuery));
