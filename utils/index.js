// from http://stackoverflow.com/questions/13483430/how-to-make-rounded-percentages-add-up-to-100
import _ from 'underscore';

export function ensureEven100(l, target) {
    var off =
        target -
        _.reduce(
            l,
            function (acc, x) {
                return acc + Math.round(x);
            },
            0
        );
    return _.chain(l)
        .sortBy(function (x) {
            return Math.round(x) - x;
        })
        .map(function (x, i) {
            return Math.round(x) + (off > i) - (i >= l.length + off);
        })
        .value();
}
