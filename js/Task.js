export default class Task {
    constructor({_id = Date.now().toString(), _rev, name, created = Date.now(), due, workload, randomFactor, lectureId = "general", lectureName = "General"} = {}) {
        this._id = _id;
        this._rev = _rev;
        this.name = name;
        this.created = created;
        this.due = due;
        this.workload = workload;
        this.randomFactor = randomFactor;
        this.lectureId = lectureId;

        this.lectureName = lectureName;
        this.xp = Math.max(this.getXp(), 0);
        this.remainingDays = this.getRemainingDays();
    }

    toDocument() {
        return {
            _id: this._id,
            _rev: this._rev,
            name: this.name,
            created: this.created,
            due: this.due,
            workload: this.workload,
            randomFactor: this.randomFactor,
            lectureId: this.lectureId,
            type: "task"
        }
    }

    getRemainingDays() {
        let day = 24 * 60 * 60 * 1000; // hrs, minutes, secs, milisecs
        return Math.round(this.getTimeSpan() / day);
    }

    getTimeSpan(due = this.due) {
        return due - this.created;
    }

    getXp() {
        return Math.ceil(this.getRemainingDays() * this.workload); // this.randomFactor
    }
};