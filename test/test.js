import Task from '../js/Task'
import Rank from '../js/Rank'

describe('task-test', () => {
    let task = new Task();
    let rank1 = new Rank();

    it('time between same day', () => {
        task.getTimeSpan().should.eql(0);
    });

    let rank2 = new Rank();
    rank1.level = 2;
    rank2.xp = 200;

    it('test Rank-Singleton on level', () => {
        return rank1.level === rank2.level
    });

    it('test Rank-Singleton on time', () => {
        return rank1.time === rank2.time
    });

    it('test Rank-Singleton on xp', () => {
        return rank1.xp === rank2.xp
    });
});

describe('Test Progress-Indicator', () =>{
    let myRank = new Rank();
    myRank.xp = 0;
    myRank.level = 0; // maxProgress = 100
    myRank.addXp(30); // +30xp => 30% progress

    it('test Progress-Bar-MaxProgress', () => {
        return myRank.maxProgress = 100;
    });

    it('test Progress-Bar-Percentage', () => {
        return myRank.xpToPercentage() === 30;
    });
});