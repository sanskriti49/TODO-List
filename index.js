document.addEventListener("DOMContentLoaded", function() {
    let input = document.querySelector(".task-input");
    let date = document.querySelector(".task-date");
    let todoList = [];
    let savedTasks = localStorage.getItem("todoList");

    if (savedTasks) {
        todoList = JSON.parse(savedTasks);
        displayTasks();
    }

    // to display tasks
    function displayTasks() {
        let displayElement = document.querySelector(".list-items");
        displayElement.innerHTML = '';
        let newHtml = '';

        for (let i = 0; i < todoList.length; i++) {
            let { text, dueDate, deleted } = todoList[i];
            let textDecoration = (deleted) ? 'line-through' : 'none';
            let checkmark = (deleted) ? '✔' : '';
            let deleteButtonStyle = deleted ? 'display: none;' : ''; // Hide delete button if deleted

            newHtml += `
            <li class="item">
                <div class="task-info">
                    <span class="task-text" style="text-decoration: ${textDecoration};">
                        ${text}
                    </span>
                </div>
                <span class="task-date">
                    ${dueDate || ''}
                </span>
                <span class="checkmark">${checkmark}</span>
                
                
                <button id="btn" style="${deleteButtonStyle}" onclick="event.stopPropagation(); editTask(${i});" >
                    <img class="edit" src="pen1.png" alt="Edit" style="width: 52px; height: 52px; padding: 4px;">
                </button>
                <button id="btn"  style="${deleteButtonStyle}" onclick="event.stopPropagation(); deleteTask(${i});">
                    <img class="delete" src="delete.png" alt="Delete" style="width: 25px; height: 28px;">
                </button>
            </li>
            `;
        }
        displayElement.innerHTML = newHtml;
       
    }

    //to create tasks
    function createTasks() {
        let taskText = input.value.trim();
        let taskDate = date.value;
        if (taskText === '') {
            setAlert("Please enter your task!");
            return;
        }

        if (todoList.some(task => task.text === taskText)) {
            setAlert("Task is already present in your list!");
            return;
        }

        todoList.push({ text: taskText, dueDate: taskDate, deleted:false });
        input.value = ''; // Clear input
        date.value = ''; // Clear date
        setAlert("Task added successfully!");
        displayTasks();
        localStorage.setItem("todoList", JSON.stringify(todoList));
    }

    // to show alert messages
    function setAlert(msg) {
        let noInput = document.querySelector(".no-input");
        let repeatedTask = document.querySelector(".repeated");
        let success = document.querySelector(".success");
        let del=document.querySelector(".delete");
        noInput.classList.remove('show');
        repeatedTask.classList.remove('show');
        success.classList.remove('show');
        del.classList.remove('show');
        if (msg === "Please enter your task!") {
            noInput.classList.add('show');
        } else if (msg === "Task is already present in your list!") {
            repeatedTask.classList.add('show');
        } else if (msg === "Task added successfully!") {
            success.classList.add('show');
        }
        else if (msg === "Task is completed!") {
            success.classList.add('show');
        }
        setTimeout(() => {
            noInput.classList.remove('show');
            repeatedTask.classList.remove('show');
            success.classList.remove('show');
        }, 3000);
    }

    window.deleteTask = function(index) {
        todoList[index].deleted = true;
    
        localStorage.setItem("todoList", JSON.stringify(todoList));
        setAlert("Task is completed!");
        displayTasks(); // Re-render the task list with updated status
    };
    

    // to edit a task
    window.editTask = function(index) {
        let task = todoList[index];
        
        // Prevent editing if the task is deleted
        if (task.deleted) {
            return;
        }

        let listItem = document.querySelectorAll(".item")[index];

        listItem.innerHTML = `
            <input type="text" class="updated" value="${task.text}" style="width: 30%; max-width: 200px;">
            <input type="date" class="newdate" value="${task.dueDate}">
            <button class="done" style="font-size: 26px; padding: 3px;">
                ✔
            </button>
        `;

        let doneButton = listItem.querySelector(".done");
        let updatedInput = listItem.querySelector(".updated");
        let updatedDate = listItem.querySelector(".newdate");

        doneButton.addEventListener("click", function() {
            let updatedText = updatedInput.value.trim();
            if (updatedText === '') {
                alert("Task cannot be empty!");
                return;
            }

            todoList[index].text = updatedText;
            todoList[index].dueDate = updatedDate.value;
            displayTasks();
            localStorage.setItem("todoList", JSON.stringify(todoList));
            setAlert("Task updated successfully!");
        });

        updatedInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                doneButton.click();
            }
        });
    };

    let clearBtn = document.querySelector(".clear");
    clearBtn.addEventListener("click", function() {
        todoList = []; 
        localStorage.removeItem("todoList"); 
        displayTasks(); 
    });

    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            createTasks();
        }
    });

    // Event for the plus button to create tasks
    document.querySelector(".plus").addEventListener("click", createTasks);

    document.querySelector("form").addEventListener("submit", function(event) {
        event.preventDefault();
    });

    displayTasks();
});
