/**
 Author: Thiago Cortez
 */

function slice_array(base, max) {
    if (max === undefined || max === null || max === '')
        max = 15;
    var res = [];

    for (var i = 0; i < base.length; i = i + (max - 1)) {
        const array = base.slice(i, (i + max));
        if (array instanceof Array && array[0] !== undefined && array[0] !== null)
            res.push(array);
    }

    return res;
}

module.exports = slice_array;
