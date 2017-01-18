'use strict';

var _Task = require('./Task');

var _Task2 = _interopRequireDefault(_Task);

var _Rank = require('./Rank');

var _Rank2 = _interopRequireDefault(_Rank);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

describe('task-test', function () {
    var task = new _Task2.default();
    var rank1 = new _Rank2.default();

    it('time between same day', function () {
        task.getTimeSpan().should.eql(0);
    });

    var rank2 = new _Rank2.default();
    rank1.level = 2;
    rank2.xp = 200;

    it('test Rank-Singleton on level', function () {
        return rank1.level === rank2.level;
    });

    it('test Rank-Singleton on time', function () {
        return rank1.time === rank2.time;
    });

    it('test Rank-Singleton on xp', function () {
        return rank1.xp === rank2.xp;
    });
});

//# sourceMappingURL=test-compiled.js.map