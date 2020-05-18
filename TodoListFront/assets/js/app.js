const app = {
    apiBaseURL: 'http://localhost/s07/TodoListBackApi/public',


    init: function() {


        console.log('coucou');

        /**
         * Liste des taches dans le dom 
         */
        let taskList = document.querySelectorAll('.task.task--todo, .task.task--complete');


        // boucle sur les element de task List 
        for (let taskIndex = 0; taskIndex < taskList.length; taskIndex++) {

            /**
             * recuperattion de  l'élément du tableau a traiter
             */
            let task = taskList[taskIndex];

            /**
             * ecoute des eventments dans la boucle
             */
            app.addTaskEventListeners(task);
        }

    }
};
document.addEventListener('DOMContentLoaded', app.init);
