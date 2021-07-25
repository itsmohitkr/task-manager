let username;

// do {
//     username=prompt("Enter your name")
// } while (!username);

let dropdown = document.getElementById('dropdown')
let add_sign = document.getElementById('add_sign')
let text_data = document.getElementById("textarea_data");
const new_task = document.querySelector('.new_task')
const main_progress = document.querySelector('.main_progress')
const main_completed = document.querySelector('.main_completed')
const task_added = document.getElementsByClassName('task_added')
const inprogress = document.getElementsByClassName('inprogress')

function addItem() {
    dropdown.style.display = "block";
}

function cancel() {
    dropdown.style.display = "none";
}

function addtask() {
    console.log(text_data.value);
    // append to dom
    appendtodom(text_data.value);
    
    let data = {
        task: text_data.value
            // username: username
    }
        
    text_data.value = "";
    // emittosocket(text_data.value);
    // sync to db
    syncWithDb(data);
}

function appendtodom(data) {
    let divelement = document.createElement('div');
    divelement.classList.add("task_added");
    
    let x = `onclick = "progress(this)"`
    let y = `onclick = "done(this)"`
    let markup = `
                    <div class="icon">
                    <i class="far fa-caret-square-down"></i>
                    <i class="fas fa-trash-alt"></i>
                    </div>
                    <p class="task_text" style="overflow-wrap: break-word;">${data}</p>
                    <div class="line"></div>
                    <div class="moveto">
                        <span class="moveto_progress" ${x}>Move to Progress</span>
                        <span class="moveto_done" ${y}>Move to Completed</span>
                    </div>
    `
    divelement.innerHTML = markup
    new_task.prepend(divelement)
    cancel();
}

// function progress(evnt) {
//     let task_text = evnt.parentNode.parentNode.children[1].innerText;
//     socket.emit("newTask", task_text);
// }

// socket.on('newTask', (data) => {
//     appendtoinprogressdom(data)
// })

function appendtoinprogressdom(data) {
    let divelement = document.createElement('div');
    divelement.classList.add("inprogress");

    // let x = `onclick = "progress(this)"`
    let y = `onclick = "done(this)"`
    let markup = `
                    <div class="icon">
                    <i class="far fa-caret-square-down"></i>
                    <i class="fas fa-trash-alt"></i>
                    </div>
                    <p class="task_text" style="overflow-wrap: break-word;">${data}</p>
                    <div class="line"></div>
                    <div class="moveto">
                    <span class="moveto_done" ${y}>Move to Completed</span>
                    </div>
                    `
                    // <span class="moveto_progress" ${x}>Move to Progress</span>
    divelement.innerHTML = markup
    main_progress.prepend(divelement)
    
}


function progress(evnt) {
    let task_text = evnt.parentNode.parentNode.children[1].innerText;
    evnt.parentNode.parentNode.remove();
    deletenewtaskfromDb(task_text);
     let divelement = document.createElement('div');
    divelement.classList.add("inprogress");
    let z = `onclick = "done(this)"`

        let progressmarkup = `
                    <div class="icon">
                    <i class="far fa-caret-square-down"></i>
                    <i class="fas fa-trash-alt"></i>
                    </div>
                    <p class="task_text" style="overflow-wrap: break-word;">${task_text}</p>
                    <div class="line"></div>
                    <div class="moveto">
                    <span class="moveto_done" ${z}>Move to Completed</span>
                    </div>
                    `
                    // <span class="moveto_progress">Move to Progress</span>
     divelement.innerHTML = progressmarkup
     main_progress.prepend(divelement)
    let text_in_progress={
        task_text: task_text
    }
    synctoprogressdiv(text_in_progress);
}

function synctoprogressdiv(text_in_progress) {
        const headers = {
            'Content-Type': 'application/json'
        }
        fetch('/api/progress', {
                method: 'Post',
                body: JSON.stringify(text_in_progress),
                headers
            })
            .then(response => response.json())
            .then(result => {
                console.log(result)
            })
}

function deletenewtaskfromDb(delete_task) {
    let tobedeleted = {
        delete_task: delete_task
    }
    const headers = {
        'Content-Type': 'application/json'
    }
    fetch('/api/tasks', {
            method: 'Delete',
            body: JSON.stringify(tobedeleted),
            headers
        })
        .then(response => response.json())
        .then(result => {
            console.log("deleted form task ")
        })
}


function done(evnt) {
    let task_text = evnt.parentNode.parentNode.children[1].innerText;
    evnt.parentNode.parentNode.remove();
    deleteNewTaskfromProgressDb(task_text);

    let divelement = document.createElement('div');
    divelement.classList.add("completed");
    let completedmarkup = `
                    <div class="icon">
                    <i class="far fa-caret-square-down"></i>
                    <i class="fas fa-trash-alt"></i>
                    </div>
                    <p class="task_text" style="overflow-wrap: break-word;">${task_text}</p>
                    <div class="line"></div>
                    `
                    // <div class="moveto">
                    //     <span class="moveto_progress">Move to Progress</span>
                    //     <span class="moveto_done">Move to Completed</span>
                    // </div>
    divelement.innerHTML = completedmarkup
    main_completed.prepend(divelement)

     let text_in_completed = {
         task_text: task_text
     }
     synctocompleteddiv(text_in_completed);

}

function appendtoCompleteddom(data) {
    let divelement = document.createElement('div');
    divelement.classList.add("completed");
    let completedmarkup = `
                    <div class="icon">
                    <i class="far fa-caret-square-down"></i>
                    <i class="fas fa-trash-alt"></i>
                    </div>
                    <p class="task_text" style="overflow-wrap: break-word;">${data}</p>
                    <div class="line"></div>
                    `
                    // <div class="moveto">
                    //     <span class="moveto_progress">Move to Progress</span>
                    //     <span class="moveto_done">Move to Completed</span>
                    // </div>
    divelement.innerHTML = completedmarkup
    main_completed.prepend(divelement)
}

function deleteNewTaskfromProgressDb(delete_task_from_progress) {
    let tobedeletedInProgress = {
        delete_task_from_progress: delete_task_from_progress
    }
    const headers = {
        'Content-Type': 'application/json'
    }
    fetch('/api/progress', {
            method: 'Delete',
            body: JSON.stringify(tobedeletedInProgress),
            headers
        })
        .then(response => response.json())
        .then(result => {
            console.log("deleted form progress ")
        })
}

function synctocompleteddiv(text_in_completed) {
    const headers = {
        'Content-Type': 'application/json'
    }
    fetch('/api/completed', {
            method: 'Post',
            body: JSON.stringify(text_in_completed),
            headers
        })
        .then(response => response.json())
        .then(result => {
            console.log(result)
        })
}

function syncWithDb(data) {
    console.log(typeof data);

    const headers = {
        'Content-Type': 'application/json'
    }
    fetch('/api/tasks', {
            method: 'Post',
            body: JSON.stringify(data),
            headers
        })
        .then(response => response.json())
        .then(result => {
            console.log(result)
        })
}

function fetchComments() {
    fetch('/api/tasks')
        .then(res => res.json())
        .then(result => {
            result.forEach((comingdata) => {
                console.log(comingdata);
                appendtodom(comingdata.newtask)
            })
        })
}

function fetchprogresstask() {
    fetch('/api/progress')
        .then(res => res.json())
        .then(result => {
            result.forEach((comingdata) => {
                console.log(comingdata);
                appendtoinprogressdom(comingdata.new_progress_task)
            })
        })
}

function fetchcompletedstask() {
    fetch('/api/completed')
        .then(res => res.json())
        .then(result => {
            result.forEach((comingdata) => {
                console.log(comingdata);
                appendtoCompleteddom(comingdata.new_completed_task)
            })
        })
}

// window.onload = fetchComments
// window.onload = fetchprogresstask

var addFunctionOnWindowLoad = function (callback) {
    if (window.addEventListener) {
        window.addEventListener('load', callback, false);
    } else {
        window.attachEvent('onload', callback);
    }
}

addFunctionOnWindowLoad(fetchComments);
addFunctionOnWindowLoad(fetchprogresstask);
addFunctionOnWindowLoad(fetchcompletedstask);