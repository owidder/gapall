'use strict';

function _if(boolean, trueBody) {
    if (boolean) {
        trueBody();
    }

    function _else(falseBody) {
        if (!boolean) {
            falseBody();
        }
    }

    return {
        else: _else
    }
}

function forEachKeyAndVal(v, fkt) {
    var key, ret;
    for (key in v) {
        if (v.hasOwnProperty(key)) {
            ret = fkt(key, v[key]);
            if (typeof(ret) == 'boolean' && !ret) {
                break;
            }
        }
    }
}

function forEachKeyAndValWithIndex(v, fkt) {
    var key;
    var j = 0;
    for (key in v) {
        if (v.hasOwnProperty(key)) {
            fkt(key, v[key], j++);
        }
    }
}

function forEachKey(v, fkt) {
    forEachKeyAndVal(v, function (key, val) {
        fkt(key);
    });
}

function forEachVal(v, fkt) {
    forEachKeyAndVal(v, function (key, val) {
        fkt(val);
    });
}

function syncFor(ctr, end, asyncBody) {
    if (ctr == end) {
        return;
    }
    asyncBody().then(function () {
        syncFor(ctr + 1, end, asyncBody);
    });
}

function makeAccessorFunction(accessor) {
    if (typeof(accessor) == 'function') {
        return accessor;
    }

    return function (obj) {
        return obj[accessor];
    }
}

function addObjectToArray(array, objToAdd, idAttr) {
    var found = false;
    var accessor = makeAccessorFunction(idAttr);
    array.forEach(function (obj) {
        if (accessor(obj) == accessor(objToAdd)) {
            forEachKeyAndVal(objToAdd, function (key, val) {
                obj[key] = val;
            });
            obj.___added = true;
            found = true;
            return false;
        }
    });

    if (!found) {
        objToAdd.___added = true;
        array.push(objToAdd);
    }
}

function clearAllNotAdded(array) {
    var added, i;
    for (i = array.length - 1; i >= 0; i--) {
        added = array[i].___added;
        delete(array[i].___added);
        if (added != true) {
            array.splice(i, 1);
        }
    }
}

function searchObjectInArray(array, valueToSearchFor, valueAttr) {
    var foundObj;
    var accessor = makeAccessorFunction(valueAttr);
    array.forEach(function (obj) {
        if (accessor(obj) == valueToSearchFor) {
            foundObj = obj;
            return false;
        }
    });

    return foundObj;
}

function identity(o) {
    return o;
}

function isString(s) {
    return typeof(s) == 'string';
}

function isDefined(v) {
    if (typeof(v) === 'undefined') {
        return false;
    }

    return true;
}

function isSet(v) {
    return (isDefined(v) && v != null);
}

function isEmpty(v) {
    return !isSet(v) || v.length == 0;
}

function isArray(obj) {
    return isDefined(obj) && obj.constructor.name == 'Array';
}

function isInArray(a, o) {
    return (a.indexOf(o) > -1);
}

function removeElementFromArray(arr, el) {
    var index = arr.indexOf(el);
    if(index > -1) {
        arr.splice(index, 1);
    }
}

function getWithDefault(obj, attributeName, defaultValue) {
    let value = obj[attributeName];
    if(!isDefined(value)) {
       value = defaultValue;
        obj[attributeName] = value;
    }

    return value;
}

module.exports = {
    if: _if,
    isDefined: isDefined,
    isEmpty: isEmpty,
    isSet: isSet,
    isString: isString,
    isArray: isArray,
    isInArray: isInArray,
    forEachKeyAndVal: forEachKeyAndVal,
    forEachKeyAndValWithIndex: forEachKeyAndValWithIndex,
    forEachKey: forEachKey,
    forEachVal: forEachVal,
    addObjectToArray: addObjectToArray,
    removeElementFromArray: removeElementFromArray,
    clearAllNotAdded: clearAllNotAdded,
    searchObjectInArray: searchObjectInArray,
    identity: identity,
    getWithDefault: getWithDefault
};
