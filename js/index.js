import * as database from "./database";
import tasksTemplate from '../templates/tasks.hbs'
import $ from 'jquery'
import page from "page";
import Hammer from 'hammerjs';

import * as ui from './ui';

let $content;
let $items;

export default function index() {
    $content = $('.content');

    database.getTasks().then(tasks => {
        database.getRank().then(ui.displayRank).catch(ui.displayError);

        $content.html(tasksTemplate({tasks: tasks}));
        $items = $(".items");

        $('.task').on('click', '.task__edit', function () {
            let id = $(this).parent().attr("data-id");
            page(`/task/${id}`);
        });

        let taskNodes = document.querySelectorAll('.task');
        for (let node of taskNodes) {
            createHammerForTaskNode(node);
        }

        ui.colorItems($items);
    }).catch(ui.displayError);
}

function createHammerForTaskNode(task) {
    let theTaskHammer = new Hammer(task);

    theTaskHammer.get('pan').set({
        threshold: 20
    });

    theTaskHammer.on('panend', event => {
        switch (event.direction) {
            case Hammer.DIRECTION_RIGHT:
                finishTask(task);
                break;
            case Hammer.DIRECTION_LEFT:
                removeTask(task);
                break;
        }
    });
}

function removeTask(task) {
    let $task = $(task);
    let id = $task.attr('data-id');

    database.removeTask(id).catch(ui.displayError);

    $task.slideUp(() => {
        $task.remove();
        ui.colorItems($items);
    });
}

function finishTask(task) {
    let $task = $(task);
    let id = $task.attr('data-id');

    database.getTask(id).then(task => {
        database.getRank().then(rank => {
            if (rank.addXp(task.xp)) {
                ui.displayLevelReward();
            }
            ui.displayRank(rank);
            ui.displayXpReward(task.xp);

            database.updateRank(rank).catch(ui.displayError);
        }).catch(ui.displayError);

        database.removeTask(id).catch(ui.displayError);
    }).catch(ui.displayError);

    $task.slideUp(() => {
        $task.remove();
        ui.colorItems($items);
    });
}