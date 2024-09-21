document.addEventListener("DOMContentLoaded", function() {
    let input = document.querySelector(".task-input");
    let date=document.querySelector(".task-date");
    let todoList = []; // Initialize the task list

    // Function to display tasks
    function displayTasks() {
        let displayElement = document.querySelector(".list-items");
        displayElement.innerHTML = '';
        let newHtml = '';

        for (let i = 0; i < todoList.length; i++) {
            let { text, dueDate, completed } = todoList[i];
            let textDecoration = completed ? 'line-through' : 'none';
            let checkmark = completed ? '✔' : ''; // Add checkmark if completed
            newHtml += `
            <li class="item">
                <div style="display: flex; align-items: center;">
                    <span style="text-decoration: ${textDecoration};">
                        ${text}
                    </span>
                    <span style="margin-left: 10px;">
                        (${dueDate || 'No date'})
                    </span>  <!-- Display the task date -->
                    <span style="margin-left: 8px;">${checkmark}</span>
                </div>

                <button onclick="event.stopPropagation(); editTask(${i});">
                    <img class="edit"
                        src="pen1.png" 
                        alt="Edit" 
                        style="width: 52px; height: 52px; padding: 4px;" 
                    >
                </button>
                <button onclick="event.stopPropagation(); deleteTask(${i});">
                    <img 
                        src="delete.png" 
                        alt="Delete" 
                        style="width: 25px; height: 28px;" 
                    >
                </button>
            </li>
        `;

        }
        displayElement.innerHTML = newHtml;
    }

    // Function to create tasks
    function createTasks() {
        
        let taskText = input.value.trim(); 
        let taskDate=date.value;
        
        if (taskText === '') {
            // alert('Task cannot be empty!'); // Alert if input is empty
            setAlert("Please enter your task!")
            return; // Stop further execution if the input is empty
        }

        // Check if the task already exists
        else if (todoList.some(task => task.text === taskText)) {
            setAlert("Task is already present in your list!");
            return;
        }
        else{
            todoList.push({ text: taskText, dueDate:taskDate, completed: false }); // Add task to the list
            input.value = ''; // Clear the input field
            date.value='';
            setAlert("Task added successfully!"); // Call alert with matching message
            displayTasks(); // Update the displayed list

        }
        // repeatedTask.style.display="block";
       
    }

    function setAlert(msg){
       
        let noInput = document.querySelector(".no-input");
        let repeatedTask = document.querySelector(".repeated");
        let success=document.querySelector(".success");

         // Hide all alerts first
        noInput.classList.remove('show');
        repeatedTask.classList.remove('show');
        success.classList.remove('show');

        if (msg === "Please enter your task!") {
            noInput.classList.add('show');
        } else if (msg === "Task is already present in your list!") {
            repeatedTask.classList.add('show');
        } else if (msg === "Task added successfully!") {
            success.classList.add('show');
        }

        setTimeout(() => {
            noInput.classList.remove('show');
            repeatedTask.classList.remove('show');
            success.classList.remove('show');
        }, 3000);
        
        let close=document.querySelectorAll(".closebtn");
        close.forEach(btn=>{
            btn.onclick=function(){
                let div=this.parentElement;
                div.style.opacity="0";
                setTimeout(function(){
                    div.style.display="none";
                },600);
            }
        });
            
    }
    window.deleteTask = function(index) {
        // Toggle the completed status
        todoList[index].completed = !todoList[index].completed;

        displayTasks(); 
    };

    //Edit task
    window.editTask = function(index) {
        let task = todoList[index]; // Get the task to edit
        let listItem = document.querySelectorAll(".item")[index]; 
    
        // Replace the content with an input field to edit
        listItem.innerHTML = `
            <input type="text" class="updated" value="${task.text}" style="width: 30%; max-width: 200px;">
            <input type="date" class="newdate" value="${task.dueDate}">
            <button class="done" style="font-size: 26px;  padding:3px;">
            ✔   
            </button>
        `;
    
        // Attach event listener to the "Done" button
        let doneButton = listItem.querySelector(".done");
        let updatedInput = listItem.querySelector(".updated");
        let updatedDate=listItem.querySelector(".newdate");
        doneButton.addEventListener("click", function() {
            let updatedText = updatedInput.value.trim();
    
            if (updatedText === '') {
                alert("Task cannot be empty!"); // Ensure the updated task isn't empty
                return;
            }
    
            // Update the task text
            todoList[index].text = updatedText;
            todoList[index].dueDate=updatedDate.value;
            // Re-display the updated list
            displayTasks();
            setAlert("Task is successfully added!");
        });
    
        // Optional: You can also add Enter key support for editing
        updatedInput.addEventListener("keypress", function(event) {
            if (event.key === "Enter") {
                doneButton.click(); // Trigger the Done button on Enter key
            }
        });
    };
    
   

    // event to trigger task addition when pressing Enter
    input.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent form submission
            createTasks(); 
        }
    });

    // Event for clicking the plus button
    document.querySelector(".plus").addEventListener("click", createTasks);

    // Prevent default form submission
    document.querySelector("form").addEventListener("submit", function(event) {
        event.preventDefault(); // Prevent form submission
    });

    // Initial call to display tasks (in case of any pre-existing tasks)
    displayTasks();
});


