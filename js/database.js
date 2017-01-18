import PouchDB from "pouchdb-browser";
import Rank from "./Rank";
import Task from "./Task";
import Lecture from "./Lecture";

let database = new PouchDB("doobe");

// RANK

const RANK = "rank";

export function getRank() {
    return new Promise((resolve, reject) => {
        database.get(RANK).then(result => {
            let rank = new Rank(result);
            resolve(rank);
        }).catch(error => {
            if (error.name === "not_found") {
                let rank = new Rank();

                database.put(rank.toDocument()).then(result => {
                    rank._rev = result.rev;
                    resolve(rank);
                }).catch(reject);

                return;
            }

            reject(error);
        });
    });
}

export function updateRank(rank) {
    return database.put(rank.toDocument());
}

// TASKS

export function getTasks() {
    return new Promise((resolve, reject) => {
        // First get all tasks...
        database.query(doc => {
            if (doc.type === "task") {
                emit(doc)
            }
        }, {include_docs: true}).then(result => {
            //...then get all lectures...
            getLectureNames().then(lectures => {
                let tasks = [];

                result.rows.forEach(row => {
                    let lectureId = row.doc.lectureId;

                    if (lectureId !== "general") {
                        row.doc.lectureName = lectures.get(lectureId);
                    }

                    tasks.push(new Task(row.doc));
                });

                tasks.sort((a, b) => a.remainingDays - b.remainingDays);

                resolve(tasks);
            }).catch(reject);

        }).catch(reject);
    });
}

export function getTask(id) {
    return new Promise((resolve, reject) => {
        database.get(id).then(doc => resolve(new Task(doc))).catch(reject);
    });
}

export function addTask(task) {
    // Promise
    return database.put(task.toDocument());
}

export function removeTask(id) {
    return new Promise((resolve, reject) => {
        database.get(id).then(function (doc) {
            database.remove(doc).then(resolve).catch(reject);
        }).catch(resolve);
    });
}

// LECTURES

export function getLectures() {
    return new Promise((resolve, reject) => {
        database.query(doc => {
            if ('lecture' == doc.type) {
                emit(doc)
            }
        }, {include_docs: true}).then(result => {
            let lectures = [];

            result.rows.forEach(row => {
                lectures.push(new Lecture(row.doc));
            });

            lectures.sort((a, b) => a._id - b._id);

            resolve(lectures);
        }).catch(reject);
    });
}

export function getLectureNames() {
    return new Promise((resolve, reject) => {
        database.query(doc => {
            if ('lecture' == doc.type) {
                emit(doc)
            }
        }, {include_docs: true}).then(result => {
            let lectures = new Map();

            result.rows.forEach(row => {
                let lecture = new Lecture(row.doc);
                lectures.set(lecture._id, lecture.name);
            });

            resolve(lectures);
        }).catch(reject);
    });
}

export function addLecture(lecture) {
    return database.put(lecture.toDocument());
}

export function removeLecture(id) {
    return new Promise(function (resolve, reject) {
        // First get the lecture...
        database.get(id).then(function (doc) {
            database.query(doc => {
                if (doc.type === "task") {
                    emit(doc)
                }
            }, {include_docs: true}).then(result => {
                let tasks = [];

                result.rows.forEach(row => {
                    if (row.doc.lectureId === id) {
                        row.doc.lectureId = "general";
                        tasks.push(new Task(row.doc).toDocument());
                    }
                });

                database.bulkDocs(tasks).then(() => {
                    database.remove(doc).then(resolve).catch(reject);
                }).catch(reject);
            }).catch(reject);
        }).catch(reject);
    });
}