"use strict";
/**
 Author: Thiago Cortez
 */
function slice_array(base, max) {
    let res = [];
    for (let i = 0; i < base.length; i = i + (max - 1)) {
        const array = base.slice(i, (i + max));
        res.push(array);
    }
    return res;
}
module.exports = slice_array;
