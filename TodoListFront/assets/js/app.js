let app = {
    //===================================================================================================
    // PROPRIETE DE L'APP
    // apiURL ==> à modifier en cas de changement d'api 
    // taskStatusCodes ==> permet de gérer les different status de la task en css 
    //===================================================================================================
    apiURL: 'http://127.0.0.1:8000/api/',
     taskStatusCodes:
      {
        1:
        {
          name: 'TODO',
          class: 'task--todo'
        },
        2:
        {
          name: 'Terminée',
          class: 'task--complete'
        },
        3:
        {
          name: 'En cours d\'édition',
          class: 'task--edit'
        },
        4:
        {
          name: 'Archivé',
          class: 'task--archive'
        },
      },
    //===================================================================================================
    //INITIALISATION DE L'APP
    //===================================================================================================
                init: function() {
    
                  // Initialisation et chargement de l'API
                  app.loadCategories();
                  app.loadTask();
    
                // Initialisaiton des buttons
                  app.initArchiveLink();
                  // Initialisation du formulaire 
                  app.initAddForm();
                },
    //===========================================================================================================================================
    //CHARGEMENT DU CONTENU DIRECTEMENT DE L'API
    //===========================================================================================================================================
                //===================================================================================================
                // Function permettant de consommer l'api ==> task
                //===================================================================================================
                loadTask: function() {
                  let fetchOption = {
                    method: 'GET',
                    cache: 'no-cache'
                  };
    
                  fetch(app.apiURL + 'tasks/', fetchOption)
                    .then(function(response) {
                      if (response.ok)
                        return response.json();
                      else
                        alert('Une erreur est survenue lors de l\'initialisation des taches : ' + response.status + ' ' + response.statusText);
                    })
                    .then(app.initTask)
                    .catch(function(error) {
                      console.log(error);
                    });
    
                },
                //===================================================================================================
                // Function permettant de consommer l'api ==> category
                //===================================================================================================
                loadCategories: function() {
                  let fetchOption = {
                    method: 'GET',
                    cache: 'no-cache'
                  };
    
                  fetch(app.apiURL + 'categories/', fetchOption)
                    .then(function(response) {
                      if (response.ok)
                        return response.json();
                      else
                        alert('Une erreur est survenue lors de l\'initialisation des catégories : ' + response.status + ' ' + response.statusText);
                    })
                    .then(app.initCategory)
                    .catch(function(error) {
                      console.log(error);
                    });
                },
    
    //===========================================================================================================================================
    //INITIALISATION DU CONTENU CHARGER
    //===========================================================================================================================================
                //===================================================================================================
                // Function d'initialisation des task 
                //===================================================================================================
                initTask: function(task) {
                  app.tasks = task;

                  for (let taskIndex = 0; taskIndex < app.tasks.tasks.length; taskIndex++) {
                    app.createTaskElement(app.tasks.tasks[taskIndex]);

                  }
                },
                //===================================================================================================
                // function d'initialisation des catégories 
                //===================================================================================================
                initCategory: function(categories) {
                  app.categoriesListing = categories.categories;

                                     
                  app.selectCategoryFilter = document.querySelectorAll('.select');
                  app.selectCategory = document.createElement('select');
                               
                  let optionCategory = document.createElement('option');
                  optionCategory.textContent = 'Toutes les catégories';
                  optionCategory.value = '-1';
                  app.selectCategory.appendChild(optionCategory);
         
                  for (let categoryIndex = 0; categoryIndex < app.categoriesListing.length; categoryIndex++) {
                    let optionCategory = document.createElement('option');
                    optionCategory.textContent = app.categoriesListing[categoryIndex].name;
                    optionCategory.value = app.categoriesListing[categoryIndex].id;
                    app.selectCategory.appendChild(optionCategory);
                  }
                  for (let index = 0; index < app.selectCategoryFilter.length; index++) {
                    app.selectCategoryFilter[index].appendChild(app.selectCategory.cloneNode(true));
                  }
                  app.selectForm = app.selectCategoryFilter[1].querySelector('select');
                // ajout d'une nouvelle entrée dans le select du formulaire 
                  let addCategory = document.createElement('option');
                  addCategory.textContent = 'Ajouter une catégorie';
                  addCategory.value = 0;
                  app.selectForm.appendChild(addCategory);
                  app.selectForm.addEventListener('click', app.handleSelectForm);
                },
    
    //===========================================================================================================================================
    //GESTION DES ARCHIVES  
    //===========================================================================================================================================
                //===================================================================================================
                // Fonction d'init de lien pour l'affichage des archives
                //===================================================================================================
                initArchiveLink: function() {
                  app.listTaskArchived = document.querySelector('.view-archives > a:not(.hidden)');
                  app.listTasks = document.querySelector('.view-archives > a:not(.visible)');
                  app.listTaskArchived.addEventListener('click', app.displayArchivedTasks);
                  app.listTasks.addEventListener('click', app.displayTasks);
                },
                //===================================================================================================
                // Fonction pour l'affichage des tasks archivées
                //==================================================================================================
                displayArchivedTasks: function(event) {
                
                  app.listTaskArchived.classList.replace('visible', 'hidden');
                  app.listTasks.classList.replace('hidden', 'visible');
                  //on selectionne les tasks '--archive'
                  app.allTasks = document.querySelectorAll('.task:not(.task--add');
                  //console.log('liste des task : ', app.allTasks);
    
                  for (let taskIndex = 0; taskIndex < app.allTasks.length; taskIndex++) {
                    //on passe en display 'none' les tasks
                    app.allTasks[taskIndex].setAttribute('style', 'display:none;');
                    //on fait passer en 'block' les task '--archive'
                    if (app.allTasks[taskIndex].classList.contains('task--archive') === true)
                      app.allTasks[taskIndex].setAttribute('style', 'display:block;');
                  }
                },
                //===================================================================================================
                // Fonction pour l'affichage des tasks non archivées 
                //==================================================================================================
                displayTasks: function(event) {
                  app.listTaskArchived.classList.replace('hidden', 'visible');
                  app.listTasks.classList.replace('visible', 'hidden');
                  //on selectionne les tasks '--archive'
                  app.allTasks = document.querySelectorAll('.task:not(.task--add');
                  for (let taskIndex = 0; taskIndex < app.allTasks.length; taskIndex++) {
                    //on passe en display 'none' les tasks
                    app.allTasks[taskIndex].setAttribute('style', 'display:;');
                    //on fait passer en 'block' les task '--archive'
                    if (app.allTasks[taskIndex].classList.contains('task--archive') === true)
                      app.allTasks[taskIndex].setAttribute('style', 'display:;');
                  }
                },
    
    //===========================================================================================================================================
    //INITIALISATION DU FORMULAIRE
    //===========================================================================================================================================  
                //===================================================================================================
                // Fonction d'init pour le formulaire d'ajout
                //===================================================================================================
                initAddForm: function() {
                  app.taskAddForm = document.querySelector('form.task--add');
                  app.taskAddForm.addEventListener('submit', app.addTask);
                  app.taskAddFormNameInput = app.taskAddForm.querySelector('.input');
    
                  app.templateTask = document.getElementById('templateTask');
                  app.taskList = document.getElementById('tasks');
    
                  app.submitButtonTask = document.querySelector('.task__content__button__add');
                          
                  app.catAddForm = document.querySelector('form.cat--add');
                  app.catAddForm.addEventListener('submit', app.addCat);
                  app.catAddFormNameInput = app.catAddForm.querySelector('.input');
    
                },
                //===================================================================================================
                // Funciton pour l'ajout d'une task via le formulaire
                //===================================================================================================
                addTask: function(event) {
                  event.preventDefault();
                       
                  let task = {
                    'title': app.taskAddFormNameInput.value,
                    'completion' : 0,
                    'status' : 1,
                    'category': Number(app.selectForm.value),
                  };
                  
 
                  let fetchOption = {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(task)
                  };
    
                  fetch(app.apiURL + 'tasks/', fetchOption)
                    .then(function(response) {
                      return response.json();   
                    })
                    .then(function(json) {
                      //console.log(json.task.id);
                      // si json id existe c'est que l'on crée une tache 
                      if ( typeof json.task.id !== 'undefined')
                      {
                        app.createTaskElement(json.task);
                        app.taskAddFormNameInput.value = '';
                        app.selectForm.value = 0;
                      }
                      //sinon c'est une erreur de validation 
                      else if (typeof json.task.title !== 'undefined' || typeof json.task.category !== 'undefined')
                      {
                        if(typeof json.task.title !== 'undefined')
                          for(let errorIndex = 0 ; errorIndex < json.task.title.length; errorIndex ++)
                          alert(json.task.title[errorIndex]);
                        
                        if(typeof json.task.category !== 'undefined')
                          for(let errorIndex = 0 ; errorIndex < json.task.category.length; errorIndex ++)
                          alert(json.task.category[errorIndex]); 
                      }
                      else 
                      {
                        return alert('Une erreur est survenur lors de l\'ajout de la tache : '+response.status+' '+response.statusText);
                      }
                    });
    
                },
                //===================================================================================================
                // Funciton pour l'affichage du formulaire d'ajout d'une catégorie 
                //===================================================================================================
                handleSelectForm: function(event) {
                 // console.log(event.currentTarget.value);
                  if(event.currentTarget.value == 0)
                  {
                    app.catAddForm.setAttribute('style', 'display:block;');
                    app.submitButtonTask.disabled = true;
                  }
                  else
                  {
                    app.catAddForm.setAttribute('style', 'display:none;');
                    app.submitButtonTask.disabled = false;
                  }
                },
                //===================================================================================================
                // Funciton pour l'ajout d'une catégorie
                //===================================================================================================
                addCat: function(event) {
                  event.preventDefault();
                 // console.log(app.catAddFormNameInput.value);
    
                  let category = {
                    'name': app.catAddFormNameInput.value,
                    'status' : 1
                  };
                  let fetchOption = {
                    method: 'POST',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(category)
                  };
    
                  fetch(app.apiURL + 'categories/', fetchOption)
                    .then(function(response) {
                      return response.json();   
                    })
                    .then(function(json) {
                       console.log(json);
                      // si json id existe c'est que l'on crée une tache 
                      if ( typeof json.categories.id !== 'undefined')
                      {
                        console.log(json);
                        app.catAddForm.setAttribute('style', 'display:none;');
                        app.submitButtonTask.disabled = false;
                        document.location.reload(true);
                      }
                      else 
                      {
                        return alert('Une erreur est survenur lors de l\'ajout de la catégorie : '+response.status+' '+response.statusText);
                      }
                    });
    
                },
    //===========================================================================================================================================
    //GESTION DE LA CREATION D'UNE TASK AVEC LE TEMPLATE ET LES ECOUTEURS 
    //===========================================================================================================================================  
                //===================================================================================================
                // Function de génération du template des task
                //===================================================================================================
                createTaskElement: function(task) {
                  //console.log(task.id);
    
                  // Gestion d'erreur : Si on renseigne un ID de catégorie invalide (exemple : "Choisissez une tâche")
                  if (task.category_id < 1)
                    return alert('Sélectionnez une catégorie exisante : ', task.category_id);
    
                  // on clone
                  let newTaskTemplate = app.templateTask.content.cloneNode(true);
                  // on récupere en DOM
                  let newTaskElement = newTaskTemplate.querySelector('.task');
    
                  // Title task
                  let taskTitleElement = newTaskElement.querySelector('.task__content__name > p');
                  taskTitleElement.textContent = task.title;
    
                  // Input value name
                  let taskTitleInputElement = newTaskElement.querySelector('.task__content__name > input');
                  taskTitleInputElement.value = task.title;
   
                  // categoryName
                  
                  let category = app.getCategoryById(task.category);

               
    
                  let taskCategory = newTaskElement.querySelector('.task__content__category > p');
                  taskCategory.textContent = category.name;
    
               
                  // let selectedOption = app.taskAddFormCategorySelect.querySelector('option:checked');
                  // taskCategory.textContent = selectedOption.textContent;
    
                
                  // Dataset
                  newTaskElement.dataset.category = task.category.id;
                  newTaskElement.dataset.id = task.id;
                  newTaskElement.dataset.title = task.title;
                  newTaskElement.dataset.completion = task.completion;
    
    
                  // Barre de progression
                  let progressBar = newTaskElement.querySelector('.progress-bar__level');
                  progressBar.style.width = task.completion + '%';

                  // Gestion des status des taches 
                  newTaskElement.classList.replace('task--todo', app.taskStatusCodes[task.status].class);
    

                  let newTaskElementCompleteButton = newTaskElement.querySelector('.task__content__button__validate');
                  newTaskElementCompleteButton.addEventListener('click', app.handleValidateButtonClick);
    
                  let newTaskElementIncompleteButton = newTaskElement.querySelector('.task__content__button__incomplete');
                  newTaskElementIncompleteButton.addEventListener('click', app.handleIncompleteButtonClick);
    
                  let newTaskElementModifyButton = newTaskElement.querySelector('.task__content__button__modify');
                  newTaskElementModifyButton.addEventListener('click', app.handleShowTaskInput);
    
                  let newTaskElementArchiveButton = newTaskElement.querySelector('.task__content__button__archive');
                  newTaskElementArchiveButton.addEventListener('click', app.handleArchiveButtonClick);
    
                  let newTaskElementDeleteButton = newTaskElement.querySelector('.task__content__button__delete');
                  newTaskElementDeleteButton.addEventListener('click', app.handleDeleteButtonClick);
    
                  let newTaskElementDesarchiveButton = newTaskElement.querySelector('.task__content__button__desarchive');
                  newTaskElementDesarchiveButton.addEventListener('click', app.handleDesarchiveButtonClick);
    
    
                  let newTaskElementTitle = newTaskElement.querySelector('.task__content__name > p');
                  newTaskElementTitle.addEventListener('dblclick', app.handleShowTaskInput);
    
                  let newTaskElementTitleInput = newTaskElement.querySelector('.task__content__name > input');
                  newTaskElementTitleInput.addEventListener('blur', app.changeTaskTitle);
                  newTaskElementTitleInput.addEventListener('keypress', app.changeTaskTitle);
    
                  app.taskList.appendChild(newTaskElement);
    
                },
                //===================================================================================================
                // Function pour récupere la category en fonction de l'id
                //===================================================================================================
                getCategoryById: function(categoryId) {

               
                  for (let categoryIndex = 0; categoryIndex < app.categoriesListing.length; categoryIndex++) {
                      if (categoryId.id === app.categoriesListing[categoryIndex].id) {
                      return app.categoriesListing[categoryIndex];
                    }
    
                  }
    
                  let defaultCategory = {
                    'id': 0,
                    'name': 'Non Spécifiée',
                    'status': 1
                  };
                  return defaultCategory;
    
                },
    
    //===========================================================================================================================================
    //GESTION DES ECOUTEURS 
    //=========================================================================================================================================== 
                //===================================================================================================
                // Function pour faire passer la balise du titre de la tâche en input
                //===================================================================================================
                handleShowTaskInput: function(event) {
                  let taskElement = event.currentTarget.closest('.task--todo');
                  if (typeof taskElement !== null)
                    taskElement.classList.replace('task--todo', 'task--edit');
                  taskElement.querySelector('.task .task__content .task__content__name > input').focus();
                },
                //===================================================================================================
                // Function pour faire passer la balise de l'input en balise p 
                //apres la modification du titre de la tâche
                //===================================================================================================
                changeTaskTitle: function(event) {
                  if (event.type === 'keypress' && event.code !== 'Enter')
                    return;
                  if (event.type === 'keypress' && event.code === 'Enter') {
                    event.target.blur();
                    return;
                  }
    
                  let taskElement = event.currentTarget.closest('.task--edit');
    
                  let newTitle = event.currentTarget.value;
                  let taskId = taskElement.dataset.id;
                  
                  let task = {
                    title: newTitle,
                    completion: taskElement.dataset.completion,
                    status: 1,
                    category: taskElement.dataset.category
                  };
    
                let fetchOption = {
                    method: 'PUT',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(task)
                  };
    
                  fetch(app.apiURL + 'tasks/' + taskId, fetchOption)
                    .then(function(response) {
                    if (!response.ok) 
                        return alert('Une erreur est survenue lors de la mise à jour du titre de la tache : ' + response.status + '' + response.statusText);
    
                      taskElement.dataset.title = newTitle;
                      event.target.nextElementSibling.textContent = newTitle;
                      taskElement.classList.replace('task--edit', 'task--todo');
                    });
                },
                //===================================================================================================
                // Revenir a l'étape d'édition
                //===================================================================================================
                handleIncompleteButtonClick: function(event) {
                  let taskElement = event.currentTarget.closest('.task--complete');
    
                  if (taskElement === null)
                    return;
    
                  let taskId = taskElement.dataset.id;
                  let taskTitle = taskElement.dataset.title;
    
                  let task = {
                    title: taskTitle,
                    completion: 0,
                    status: 1,
                    category: taskElement.dataset.category
                  };
    
                  let fetchOption = {
                    method: 'PUT',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(task)
                  };
    
                  fetch(app.apiURL + 'tasks/' + taskId, fetchOption)
                    .then(function(response) {
                      if (!response.ok)
                        return alert('Une erreur est survenue lors de la mise à jour de la tache : ' + response.status + '' + response.statusText);
    
                      taskElement.classList.replace('task--complete', 'task--todo');
                      let progressBar = taskElement.querySelector('.progress-bar__level');
                      progressBar.style.width = task.completion + '%';
                    });
                },
                //===================================================================================================
                // Function pour noter une tache comme 'complete'
                //===================================================================================================
                handleValidateButtonClick: function(event) {
    
                  let taskElement = event.currentTarget.closest('.task--todo');
    
                  if (taskElement === null)
                    taskElement = event.currentTarget.closest('.task--edit');
    
                  if (taskElement === null)
                    return;
    
                  let taskId = taskElement.dataset.id;
                  let taskTitle = taskElement.dataset.title;
    
                  let task = {
                    title: taskTitle,
                    completion: 100,
                    status: 2,
                    category: taskElement.dataset.category
                  };
    
                  let fetchOption = {
                    method: 'PUT',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(task)
                  };
    
                  fetch(app.apiURL + 'tasks/' + taskId, fetchOption)
                    .then(function(response) {
                      if (!response.ok)
                        return alert('Une erreur est survenue lors de la mise à jour de la tache : ' + response.status + '' + response.statusText);
    
                      taskElement.classList.replace('task--todo', 'task--complete');
                      taskElement.classList.replace('task--edit', 'task--complete');
                      let progressBar = taskElement.querySelector('.progress-bar__level');
                      progressBar.style.width = task.completion + '%';
                    });
                },
                //===================================================================================================
                // Function pour noter une tache comme 'archiver'
                //===================================================================================================
                handleArchiveButtonClick: function(event) {
                  let taskElement = event.currentTarget.closest('.task--complete');
    
                  if (taskElement === null)
                    taskElement = event.currentTarget.closest('.task--todo');
    
                  if (taskElement === null)
                    taskElement = event.currentTarget.closest('.task--edit');
    
                  if (taskElement === null)
                    return;
    
                  let taskId = taskElement.dataset.id;
                  let taskTitle = taskElement.dataset.title;
    
                  let task = {
                    title: taskTitle,
                    completion: 100,
                    status: 4,
                    category: taskElement.dataset.category
                  };
    
                  let fetchOption = {
                    method: 'PUT',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(task)
                  };
    
                  fetch(app.apiURL + 'tasks/' + taskId, fetchOption)
                    .then(function(response) {
                      if (!response.ok)
                        return alert('Une erreur est survenue lors de la mise à jour de la tache : ' + response.status + '' + response.statusText);
    
                      taskElement.classList.replace('task--complete', 'task--archive');
                      taskElement.classList.replace('task--todo', 'task--archive');
                      taskElement.classList.replace('task--edit', 'task--archive');
                      let progressBar = taskElement.querySelector('.progress-bar__level');
                      progressBar.style.width = task.completion + '%';
                    });
                },
                //===================================================================================================
                // Function pour 'delete' une tache
                //===================================================================================================
                handleDeleteButtonClick: function(event) {
                  let taskElement = event.currentTarget.closest('.task--archive');
    
                  if (taskElement === null)
                    return;
    
                  let taskId = taskElement.dataset.id;
                  let taskTitle = taskElement.dataset.title;
    
                  let task = {
                    title: taskTitle,
                    completion: 100,
                    status: 4,
                    category: taskElement.dataset.category
                  };

                let fetchOption = {
                    method: 'DELETE',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(task)
                  };
    
                  fetch(app.apiURL + 'tasks/' + taskId, fetchOption)
                    .then(function(response) {
                      if (!response.ok)
                        return alert('Une erreur est survenue lors de la suppression de la tache : ' + response.status + '' + response.statusText);
    
                      taskElement.setAttribute('style', 'display:none;');
                    });
                },
                //===================================================================================================
                // Function pour noter une tache comme 'Desarchiver'
                //===================================================================================================
                handleDesarchiveButtonClick: function(event) {
                  let taskElement = event.currentTarget.closest('.task--archive');
    
                  if (taskElement === null)
                    return;
    
                  let taskId = taskElement.dataset.id;
                  let taskTitle = taskElement.dataset.title;
                  
                  let task = {
                    title: taskTitle,
                    completion: 100,
                    status: 2,
                    category: taskElement.dataset.category
                  };
    
                  let fetchOption = {
                    method: 'PUT',
                    headers: { 'content-type': 'application/json' },
                    body: JSON.stringify(task)
                  };
    
                  fetch(app.apiURL + 'tasks/' + taskId, fetchOption)
                    .then(function(response) {
                      if (!response.ok)
                        return alert('Une erreur est survenue lors de la mise à jour de la tache : ' + response.status + '' + response.statusText);
    
                      taskElement.classList.replace('task--archive', 'task--complete');
                      let progressBar = taskElement.querySelector('.progress-bar__level');
                      progressBar.style.width = task.completion + '%';
                    });
                },
    
    };
    
    
    
    //========== Lancement de l'app ==========//
    app.init();
