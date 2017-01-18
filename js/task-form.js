import * as database from './database';
import $ from 'jquery';
import Task from './Task';
import page from 'page';
import {displayError} from './ui';
import taskFormTemplate from '../templates/task-form.hbs'

let $content, $taskName, $taskRemainingDays, $taskWorkload, $taskLecture;

export default function taskForm(context) {
    let task;

    $content = $('.content');

    database.getLectures().then(lectures => {
        $content.html(taskFormTemplate({lectures: lectures}));

        $taskName = $('#task-form__name');
        $taskRemainingDays = $('#task-form__remaining-days');
        $taskWorkload = $('#task-form__workload');
        $taskLecture = $('#task-form__lecture');

        let $taskWorkloadNumbers = $('.task-form__workload__number');

        $taskWorkloadNumbers.on('click tap', function () {
            $taskWorkloadNumbers.removeClass('selected');

            $(this).addClass('selected');
        });

        $('.task-form').submit(e => {
            e.preventDefault();

            let name = $taskName.val();
            let days = $taskRemainingDays.val();
            let workload = parseInt($taskWorkload.find('.selected').html());
            let randomFactor = Math.floor(Math.random() * 50 + 1); // unused atm
            let lectureId = $taskLecture.find('option:selected').attr('data-id');

            let due = new Date(Date.now() + days * 24 * 60 * 60 * 1000).getTime();

            if (task === undefined) {
                task = new Task({due, name, workload, randomFactor, lectureId});
            } else {
                task.due = due;
                task.name = name;
                task.workload = workload;
                task.randomFactor = randomFactor;
                task.lectureId = lectureId;
            }

            database.addTask(task).then(page('/')).catch(displayError);
        });


        let id = context.params.id;

        if (id !== undefined) {
            database.getTask(id).then(result => {
                task = result;

                $taskName.val(task.name);
                $taskRemainingDays.val(task.remainingDays);
                $taskWorkload.find('.selected').removeClass('selected');
                $taskWorkloadNumbers.filter(function () {
                    return this.innerHTML == task.workload;
                }).addClass('selected');
                $taskLecture.find(`option[data-id=${task.lectureId}]`).attr('selected', 'selected');
            }).catch(displayError);
        }
    }).catch(displayError);
}