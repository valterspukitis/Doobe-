export default class Lecture {
    constructor({_id = Date.now().toString(), _rev, name} = {}) {
        this._id = _id;
        this._rev = _rev;
        this.name = name;
    }

    toDocument() {
        return {
            _id: this._id,
            _rev: this._rev,
            name: this.name,
            type: "lecture"
        }
    }
};