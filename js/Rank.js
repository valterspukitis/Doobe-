export default class Rank {
    constructor({_rev, xp = 0, level = 1} = {}) {
        this._rev = _rev;
        this.xp = xp;
        this.level = level;
    }

    toDocument() {
        return {
            _id: "rank",
            _rev: this._rev,
            xp: this.xp,
            level: this.level
        }
    }

    addXp(value) {
        let maxXpForLevel = Rank.getMaxXpForLevel(this.level);
        let maxXpDiff = 0;

        if (value + this.xp >= maxXpForLevel) {
            while (value + this.xp >= maxXpForLevel) {
                this.level += 1;
                this.maxProgress = Rank.getMaxXpForLevel(this.level - 1);
                maxXpDiff += this.maxProgress;
                maxXpForLevel = Rank.getMaxXpForLevel(this.level);
            }
            this.xp = Math.abs((this.xp + value) - maxXpDiff);
        } else {
            this.xp += value
        }
    }

    xpInPercentage() {
        return (this.xp / Rank.getMaxXpForLevel(this.level)) * 100;
    }

    static getMaxXpForLevel(level) {
        if (level == 0) return 0;
        return level * 100 + Rank.getMaxXpForLevel(level - 1);
    }
}