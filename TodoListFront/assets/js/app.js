const app = {
    apiBaseURL: 'https://127.0.0.1:8001/',


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

        let addTaskForm = document.querySelector('.task.task--add');
        addTaskForm.addEventListener('submit', app.handleAddTaskFormSubmit);

          /**
         * Je charge les catégories provenant de l'API
         */
        app.loadCategoryList();
        app.loadTaskList();

    },

     /**
     * Add task's event listeners
     *
     * @param {Element} task A task DOM Element
     */
    addTaskEventListeners: function(task) {
        /**
         * Je récupère l'enfant de mon élément task qui a pour classe task__content__name
         */
        let taskName = task.querySelector('.task__content__name');
        /**
         * J'ajoute un écouteur d'événement au clic sur le titre la tâche en cours de traitement
         */
        taskName.addEventListener('click', app.displayEditForm);

        /**
         * Je récupère le bouton d'édition de la tâche en cours de traitement
         */
        let editButton = task.querySelector('.task__content__button__modify');
        /**
         * J'ajoute un écouteur d'événement au clic sur le bouton d'édition la tâche en cours de traitement
         */
        editButton.addEventListener('click', app.displayEditForm);

        /**
         * Je récupère l'input d'édition de la tâche en cours de traitement
         */
        let editInput = task.querySelector('input[name="name"]');
        editInput.addEventListener('blur', app.editTask);
        editInput.addEventListener('keydown', app.editTask);


        /**
         * Je récupère l'élément dans le DOM et je lui ajoute un écouteur d'événement
         */
        let completeButton = task.querySelector('.task__content__button__validate');
        completeButton.addEventListener('click', app.completeTask);

        /**
         * Je récupère l'élément dans le DOM du bouton qui permet de passer une tâche de complétée à incomplète
         */
        let incompleteButton = task.querySelector('.task__content__button__incomplete');
        /**
         * J'ajoute un écouter d'événement au clic sur le bouton récupéré précedemment
         */
        incompleteButton.addEventListener('click', app.undoTask);


         /**
         * Je récupère l'élément dans le DOM du bouton qui permet de supprimer
         */
        let deleteButton = task.querySelector('.task__content__button__delete');
         /**
         * J'ajoute un écouter d'événement au clic sur le bouton récupéré précedemment
         */
        deleteButton.addEventListener('click', app.deleteTask);

    },

    /**
     * Display edit form
     *
     * @param {Event} event Event object representation
     */
    displayEditForm: function(event) {
        /**
         * Je récupère l'ancêtre qui a pour classe task
         *
         * event.currentTarget est soit le nom de la tâche, soit le bouton d'édition
         *
         * @link https://developer.mozilla.org/fr/docs/Web/API/Element/closest
         */
        let task = event.currentTarget.closest('.task');
        // let task = taskName.parentNode.parentNode;

        /**
         * J'ajoute la classe task--edit sur mon élément de tâche
         *
         * @link https://developer.mozilla.org/fr/docs/Web/API/Element/classList
         */
        task.classList.add('task--edit');
    },

    /**
     * Edit task validation
     *
     * @param {Event} event
     */
    editTask: function (event) {
        /**
         * Si mon événement de type keydown ne concerne pas la touche Entrée...
         */
        if (event.type === 'keydown' && event.keyCode !== 13) {
            // ... j'arrête le traitement
            return;
        }

        /**
         * Je récupère l'élément inpacté par l'événement
         */
        let editInput = event.currentTarget;

        /**
         * Je récupère la valeur renseigné dans l'input
         */
        let modifiedTaskName = editInput.value;

        /**
         * Je récupère l'élément DOM suivant
         *
         * @link https://developer.mozilla.org/fr/docs/Web/API/NonDocumentTypeChildNode/nextElementSibling
         */
        let taskName = editInput.nextElementSibling;

        /**
         * Je modifie le nom de ma tâche
         */
        taskName.textContent = modifiedTaskName;

        /**
         * Je récupère l'ancêtre qui a pour classe task
         */
        let task = editInput.closest('.task');

        /**
         * Je supprime la classe task--edit afin de cacher le formulaire d'édition de la tâche
         */
        task.classList.remove('task--edit');



        
    },

    /**
     * Complete task
     *
     * @param {Event} event Event object representation
     */
    completeTask: function (event) {
        /**
         * Je récupère l'élément sur lequel était défini l'écouteur d'événement
         */
        let completeButton = event.currentTarget;

        /**
         * Je récupère l'élément que je veux modifier grâce à la cible
         */
        let task = completeButton.closest('.task');

        let taskId = task.dataset.id;

        let taskObject = {
            title: task.dataset.title,
            categoryId: task.dataset.categoryId,
            completion: task.dataset.completion,
            status: 2
        };

        let iconElement = completeButton.querySelector('.fa');
        iconElement.classList.remove('fa-step-backward');
        iconElement.classList.add('fa-spinner', 'fa-spin');

        fetch(
            app.apiBaseURL + '/tasks/' + taskId,
            {
                method: 'PUT',
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(taskObject)
            }
        )
        .then(function () {
            iconElement.classList.remove('fa-spinner', 'fa-spin');
            iconElement.classList.add('fa-step-backward');
            /**
             * Je modifie les informations de l'élément que je veux modifier : ici les classes
             */
            task.classList.remove('task--todo');
            task.classList.add('task--complete');

            task.dataset.status = 2;
        })
        .catch(function () {
            console.log('error');
        });
    },

    /**
     * Set a task to todo status
     */
    undoTask: function (event) {
        /**
         * Je récupère l'élément DOM correspondant à la tâche que je veux modifier
         */
        let taskElement = event.currentTarget.closest('.task');

        /**
         * Je modifie l'icône pour informer l'utilisateur que sa demande est en cours de traitement
         */
        let iconElement = event.currentTarget.querySelector('.fa');
        iconElement.classList.remove('fa-step-backward');
        iconElement.classList.add('fa-spinner', 'fa-spin');

        /**
         * Je récupère les données associées à ma tâche et je les mets dans un objet que je vais envoyer au serveur avec fetch
         */
        let taskId = taskElement.dataset.id;

        let task = {
            title: taskElement.dataset.title,
            categoryId: taskElement.dataset.categoryId,
            completion: taskElement.dataset.completion,
            status: 1
        };

        /**
         * Envoyer la demande de modification au serveur :
         */
        fetch(
            app.apiBaseURL + '/tasks/' + taskId,
            {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(task)
            }
        )
        /**
         * Si tout est ok, modifier le DOM :
         *  - passer la tâche en imcomplète au niveau du rendu
         *  - modifier le(s) dataset(s)
         */
        .then(function (response) {
            /**
            * Je modifie l'icône pour informer l'utilisateur que sa demande a été traitée (à voir si elle est ok ou non)
            */
            iconElement.classList.remove('fa-spinner', 'fa-spin');
            iconElement.classList.add('fa-step-backward');

            if (response.ok) { // Si réponse 2**
                taskElement.dataset.status = 1;

                taskElement.classList.remove('task--complete');
                taskElement.classList.add('task--todo');
            } else { // Si réponse 4** ou 5**
                throw new Error('Task update error');
            }
        })
        .catch(function (error) {
            /**
             * Créer l'élément DOM de notification
             */
            let notificationElement = document.createElement('div');
            /**
             * Modifier son contenu
             */
            notificationElement.textContent = 'Nous avons rencontré un problème. Merci de réessayer plus tard. Si le problème persiste, merci de contacter le service technique.';
            notificationElement.classList.add('notification', 'is-danger');

            /**
             * J'ajoute le bouton de fermeture de la notification
             */
            let closeButtonElement = document.createElement('button');
            closeButtonElement.classList.add('delete');

            // Je factorise la fonction anonyme dans une variable ...
            let deleteNotification = function () {
                notificationElement.remove();
            };

            closeButtonElement.addEventListener(
                'click',
                // que j'utilise pour mon addEventListener ...
                deleteNotification
            );

            setTimeout(
                // ... et mon setTimeout
                deleteNotification,
                5000 // ms
            );

            notificationElement.prepend(closeButtonElement);
            /**
             * Récupérer son futur parent
             */
            let notificationListElement = document.querySelector('#notification-list');
            /**
             * L'ajouter à son parent
             */
            notificationListElement.appendChild(notificationElement);
        });
    },

    /**
     * Handle add task form submit
     *
     * @param {Event} event Event object representation
     */
    handleAddTaskFormSubmit: function (event) {
        /**
         * J'annule le comportement par défaut du navigateur. Dans le cas d'un submit, on désactive l'envoi automatique des données au serveur.
         */
        event.preventDefault();

        let addTaskForm = event.currentTarget;

        /**
         * Je crée une instance de FormData qui permet de faciliter la récupération des données provenants d'un formulaire. Le constructeur peut prendre en argument un élément DOM correpondant à un formulaire.
         *
         * @link https://developer.mozilla.org/fr/docs/Web/API/FormData
         * @link https://developer.mozilla.org/fr/docs/Web/Guide/Using_FormData_Objects
         */
        let addTaskFormData = new FormData(addTaskForm);

        /**
         * La méthode get de FormData me permet de récupérer la valeur associée à un champ du formulaire
         */
        let newTaskTitle = addTaskFormData.get('title');
        let newTaskCategoryId = addTaskFormData.get('categoryId');

        // Valider les données du formulaire : Nom non vide, category sélectionnée, ...

        // Je construis l'objet que je vais envoyer au serveur au format JSON (text au format JSON)
        let newTask = {
            title: newTaskTitle,
            categoryId: newTaskCategoryId
        };
        console.log('ICI', newTask)

        // J'envoie les données de la nouvelle tâche à créer au serveur en faisant un appel HTTP à l'API
        fetch(
            app.apiBaseURL + 'api/tasks/',
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newTask)
            },
        )
        .then(function (response) {
            console.log('laaa', response)
            if (response.ok) { // Tout est OK (2**)
                return response.json();
            } else { // Erreur côté serveur 4** ou 5**
                throw new Error('La tâche n\'a pas été crée');
            }
        })
        .then(function (task) {
            app.addTaskElement(
                task.id,
                task.title,
                task.category.id,
                task.category.name,
                task.status,
                task.completion
            );
        })
        .catch(function () {
            console.log('error');
        });
    },



    loadCategoryList: function () {

        fetch(app.apiBaseURL + 'api/categories/',{
            method: 'GET',
        })  
        .then((response) => {
            return response.json();
        })
        .then((data) => {
            return data['categories'];
        })

        /**
         * J'exécute un traitement qui va me permettre de stocker les informations des catégories liées à leur ID dans un tableau stocké au niveau de mon objet app
         */
        .then(function (categoryList) {
            let selectElement = document.createElement('select');

            /**
             * J'ajoute un placeholder au select
             *
             * Une balise option qui doit être selected, disabled et en display:none (sans oublier le texte)
             */
            let selectPlaceholderElement = document.createElement('option');
            selectPlaceholderElement.selected = true;
            selectPlaceholderElement.disabled = true;
            selectPlaceholderElement.style.display = 'none';
            selectPlaceholderElement.textContent = 'Sélectionner une catégorie';

            selectElement.appendChild(selectPlaceholderElement);

            /**
             * Je boucle sur la liste des catégories
             */
            for (
                let categoryIndex = 0;
                categoryIndex < categoryList.length;
                categoryIndex++
            ) {
                /**
                 * Je récupère la catégorie en cours de traitement dans ma boucle
                 */
                let category = categoryList[categoryIndex];

                /**
                 * Je crée l'élément DOM de ma catégorie
                 */
                let optionElement = document.createElement('option');
                /**
                 * Je complète l'élément DOM option avec les informations de la catégorie récupée via Ajax
                 *
                 * <option value="1">Chemin vers O'clock</option>
                 */
                optionElement.textContent = category.name;
                optionElement.value = category.id;

                /**
                 * J'ajoute l'élément DOM dans son parent
                 */
                selectElement.appendChild(optionElement);
            }

            /**
             * Je récupère le futur parent du select
             */
            let filterBarElement = document.querySelector('.filters-bar__element.select');
            /**
             * J'ajoute le select dans son parent
             */
            filterBarElement.appendChild(selectElement);

            /**
             * Je clone le select que j'ai inséré précédemment car il y a quelques différences au niveau des attributs que je dois lui associer
             */
            let addTaskFormCategorySelectElement = selectElement.cloneNode(true);

            console.log(addTaskFormCategorySelectElement);

            /**
             * J'ajoute l'attribut name
             */
            addTaskFormCategorySelectElement.name = 'categoryId';

            /**
             * Je sélectionne son futur parent
             */
            let addTaskFormCategorySelectParent = document.querySelector('.task__content__category .select');
            /**
             * J'ajoute le select à son parent
             */
            addTaskFormCategorySelectParent.appendChild(
                addTaskFormCategorySelectElement
            );
        });
    },

    loadTaskList: function () {
        fetch(app.apiBaseURL + 'api/tasks/')        
        .then(function (response) {
            // On transforme le texte formatté en JSON en un objet JavaScript
            return response.json();
        }).then((data) => {
            console.log(data)
             return data['tasksList'];
            })
        .then(function (taskList) {
            for (
                taskIndex = 0;
                taskIndex < taskList.length;
                taskIndex++
            ) {
                let task = taskList[taskIndex];

                /**
                 * Je crée la tâche dans le DOM à partir des informations reçues de l'API
                 */
                app.addTaskElement(
                    task.id,
                    task.title,
                    task.category_id,
                    task.category.name,
                    task.status,
                    task.completion
                );
            }
        });
    },

    // fetch(app.apiBaseURL + 'api/categories/',{
    //     method: 'GET',
    // })  
    // .then((response) => {
    //     return response.json();
    // })
    // .then((data) => {
    //     return data['categories'];
    // })

    /**
     * Add a new task in DOM
     *
     * @param {string|int} id Task ID
     * @param {string}     title Task name
     * @param {string|int} categoryId Category ID
     * @param {string}     categoryName Category name
     * @param {strint|int} status Task status
     * @param {string|int} completion Task completion
     */
    addTaskElement: function (id, title, categoryId, categoryName, status =1, completion = 0) {
        /**
         * Je récupère l'élément dans le DOM correspondant à mon template qui a pour ID empty-task
         */
        let emptyTaskTemplate = document.getElementById('empty-task');

        /**
         * Je duplique / clone son contenu (dont ses enfants)
         */
        let newTask = emptyTaskTemplate
            .content // Je récupère le contenu du template (DocumentFragment)
            .querySelector('.task') // Dont je récupère l'élément enfant qui a pour classe task
            .cloneNode(true) // Que je clone
        ;

        /**
         * Je conserve les informations de ma tâche au niveau des dataset
         *
         * @link https://developer.mozilla.org/fr/docs/Web/API/HTMLElement/dataset
         */
        newTask.dataset.id         = id;
        newTask.dataset.title      = title;
        newTask.dataset.categoryId = categoryId;
        newTask.dataset.categoryName = categoryName;
        newTask.dataset.status     = status;
        newTask.dataset.completion = completion;

        /**
         * Je converti ma variable status en un entier
         */
        status = parseInt(status);

        if (status === 1) {
            newTask.classList.add('task--todo');
        } else if (status === 2) {
            newTask.classList.add('task--complete');
        }

        /**
         * Je récupère les éléments enfants que je veux compléter de l'élément cloné afin de...
         */
        /**
         * ... renseigner le titre de tâche
         */
        let newTaskNameElement = newTask.querySelector('.task__content__name p');
        newTaskNameElement.textContent = title;

        /**
         * ... renseigner le titre de la tâche dans le formulaire d'édition d'une tâche
         */
        let newTaskEditInputElement = newTask.querySelector('.task__content__name input[name="name"]');
        newTaskEditInputElement.value = title;

        /**
         * ... renseigner la categorie associée à la tâche
         */
        let newTaskCategoryElement = newTask.querySelector('.task__content__category p');
        newTaskCategoryElement.textContent = categoryName;

        /**
         * J'ajoute les écouteurs d'événements (interactions liées à la tâche) sur ma nouvelle tâche
         */
        app.addTaskEventListeners(newTask);


        /**
         * Je récupère l'élément qui contient toutes les tâches
         */
        let tasksContainer = document.getElementById('tasks-container');

        /**
         * J'insère la nouvelle tâche au début du conteneur
         */
        tasksContainer.prepend(newTask);
    },

    /**
     * Delete a task
     */
    deleteTask: function(event) {
        
        /**
         * Je récupère l'élément DOM correspondant à la tâche que je veux modifier
         */
        let taskElement = event.currentTarget.closest('.task');

        /**
         * Je modifie l'icône pour informer l'utilisateur que sa demande est en cours de traitement
         */
        let iconElement = event.currentTarget.querySelector('.fa');
        iconElement.classList.remove('fa-step-backward');
        iconElement.classList.add('fa-spinner', 'fa-spin');

        // au click sur le bouton 
        
        // => dire a l'api de supp en DELETE    
                // il te faut l'id 
                // tasks/id
                

       /**
         * Je récupère les données associées à ma tâche et je les mets dans un objet que je vais envoyer au serveur avec fetch
         */
        let taskId = taskElement.dataset.id;


        /**
         * Envoyer la demande de modification au serveur :
         */
        fetch(
            app.apiBaseURL + '/tasks/' + taskId,
            {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                
            }
        )
        /**
         * Si tout est ok, modifier le DOM :
         *  - passer la tâche en imcomplète au niveau du rendu
         *  - modifier le(s) dataset(s)
         */
        .then(function (response) {
            /**
            * Je modifie l'icône pour informer l'utilisateur que sa demande a été traitée (à voir si elle est ok ou non)
            */
            iconElement.classList.remove('fa-spinner', 'fa-spin');
            iconElement.classList.add('fa-step-backward');

            if (response.ok) { // Si réponse 2**
                taskElement.style.display = 'none';
                //taskElement.setAttribute('style', 'display:none');

              
            } else { // Si réponse 4** ou 5**
                throw new Error('Task delete error');
            }
        })


    }

};
document.addEventListener('DOMContentLoaded', app.init);
