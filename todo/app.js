/**
 * @file The main logic for the Todo List App.
 * @author Matt West <matt.west@kojilabs.com>
 * @license MIT {@link http://opensource.org/licenses/MIT}.
 */


window.onload = function() {
  
  // Display the todo items.
  // Get references to the form elements.
  doingDB.open(refreshDoing);
  todoDB.open(refreshTodos);
  doneDB.open(refreshDone);
  
  var newTodoForm = document.getElementById('toDoForm');
  var newTodoInput = document.getElementById('toDoInput');
  
  
  var newDoingForm = document.getElementById('doingForm');
  var newDoingInput = document.getElementById('doingInput');
  
  var newDoneForm = document.getElementById('doneForm');
  var newDoneInput = document.getElementById('doneInput');
  
  // ------------------------------------- TO DO
  newTodoForm.onsubmit = function() {
    // Get the todo text.
    var text = newTodoInput.value;
    
    // Check to make sure the text is not blank (or just spaces).
    if (text.replace(/ /g,'') != '') {
      // Create the todo item.
      todoDB.createTodo(text, function(todo) {
        refreshTodos();
      });
    }
    
    // Reset the input field.
    newTodoInput.value = '';
    
    // Don't send the form.
    return false;
  };

  // ------------------------------------- DOING
  newDoingForm.onsubmit = function() {
    // Get the doing text.
    var text = newDoingInput.value;
    
    // Check to make sure the text is not blank (or just spaces).
    if (text.replace(/ /g,'') != '') {
      // Create the doing item.
      doingDB.createDoing(text, function(doing) {
        refreshDoing();
      });
    }
    
    // Reset the input field.
    newDoingInput.value = '';
    
    // Don't send the form.
    return false;
  };
  

  // ------------------------------------- DONE
  newDoneForm.onsubmit = function() {
    // Get the doing text.
    var text = newDoneInput.value;
    
    // Check to make sure the text is not blank (or just spaces).
    if (text.replace(/ /g,'') != '') {
      // Create the doing item.
      doneDB.createDone(text, function(done) {
        refreshDone();
      });
    }
    
    
    // Reset the input field.
    newDoneInput.value = '';
    
    // Don't send the form.
    return false;
  };
}


// ---------------------------------------- TO DO REFRESH
function refreshTodos() {  
  todoDB.fetchTodos(function(todos) {
    var todoList = document.getElementById('todo-items');
    todoList.innerHTML = '';
    
    for(var i = 0; i < todos.length; i++) {
      // Read the todo items backwards (most recent first).
      var todo = todos[(todos.length - 1 - i)];

      var li = document.createElement('li');
      var checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.className = "todo-checkbox";
      checkbox.setAttribute("data-id", todo.timestamp);
      
      li.appendChild(checkbox);
      
      var span = document.createElement('span');
      span.innerHTML = todo.text;
      
      li.appendChild(span);
      
      todoList.appendChild(li);
      
      // Setup an event listener for the checkbox.
      checkbox.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));

        todoDB.deleteTodo(id, refreshTodos);
      });
    }

  });
}

// ---------------------------------------- DOING REFRESH

function refreshDoing() {  
  doingDB.fetchDoing(function(doings) {
    var doingList = document.getElementById('doing-items');
    doingList.innerHTML = '';
    
    for(var i = 0; i < doings.length; i++) {
      // Read the doing items backwards (most recent first).
      var doing = doings[(doings.length - 1 - i)];

      var li = document.createElement('li');
      var checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.className = "doing-checkbox";
      checkbox.setAttribute("data-id", doing.timestamp);
      
      li.appendChild(checkbox);
      
      var span = document.createElement('span');
      span.innerHTML = doing.text;
      
      li.appendChild(span);
      
      doingList.appendChild(li);
      
      // Setup an event listener for the checkbox.
      checkbox.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));


        doingDB.deleteDoing(id, refreshDoing);
      });
    }

  });
}

// ---------------------------------------- DONE REFRESH

function refreshDone() {  
  doneDB.fetchDone(function(dones) {
    var doneList = document.getElementById('done-items');
    doneList.innerHTML = '';
    
    for(var i = 0; i < dones.length; i++) {
      // Read the done items backwards (most recent first).
      var done = dones[(dones.length - 1 - i)];

      var li = document.createElement('li');
      var checkbox = document.createElement('input');
      checkbox.type = "checkbox";
      checkbox.className = "done-checkbox";
      checkbox.setAttribute("data-id", done.timestamp);
      
      li.appendChild(checkbox);
      
      var span = document.createElement('span');
      span.innerHTML = done.text;
      
      li.appendChild(span);
      
      doneList.appendChild(li);
      
      // Setup an event listener for the checkbox.
      checkbox.addEventListener('click', function(e) {
        var id = parseInt(e.target.getAttribute('data-id'));

        doneDB.deleteDone(id, refreshDone);
      });
    }

  });
}

