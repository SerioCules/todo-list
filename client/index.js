const addTaskForm = document.querySelector('#addTaskForm')
const addTaskTitle = document.querySelector('#addTaskForm #title')
const addTaskDescription = document.querySelector('#description')
const addTaskBtn = document.querySelector('#addTaskBtn')
const addTaskMsg = document.querySelector('#addTaskMsg')

const tasksList = document.querySelector('#tasksList')
const tasksListMsg = document.querySelector('#tasksListMsg')

const addTask = async () => {
  const data = new FormData(addTaskForm)

  const headers = new Headers({
    'Content-Type': 'application/json; charset=utf-8'
  })

  if (data.get('title') == "") {
    addTaskMsg.textContent = 'Twój tytuł jest pusty, wypełnij go aby wysłać zadanie.'
    addTaskMsg.classList.add('is-danger')
    throw Error('Twój tytuł jest pusty, wypełnij go aby wysłać zadanie.')
  }

  const body = JSON.stringify({
    title: data.get('title'),
    description: data.get('description')
  })

  return await fetch('/api/tasks', { method: 'POST', headers, body })
}

const listTasks = async () => {
  tasksList.innerHTML = ''
  tasksListMsg.classList.remove('is-danger')
  tasksListMsg.classList.add('is-hidden')
  
  fetch('/api/tasks')
  .then((response) => {
    if (!response.ok) {
      throw Error(response.statusText)
    }
    
    return response.json()
  })
  .then((response) => {
    response.forEach((task) => {
      const actions = document.createElement('td')
      const description = document.createElement('td')
      const time = document.createElement('td')
      const title = document.createElement('td')

      title.innerHTML = `<p>${task.title}</p>`

      if (task.description == null) {
        description.innerHTML = `<p>Brak opisu</p>`
      }
      else {
        description.innerHTML = `<p>${task.description}</p>`
      }

      time.innerHTML = `<p>${task.time}</p>`

      actions.classList.add('has-text-right')
      actions.innerHTML = `<button class="button is-small is-primary" id="deleteTask${task.id}" onclick="completeTask('${task.id}');"><span class="icon is-small"><i class="fas fa-check"></i></span></button>`
      
      const row = document.createElement('tr')
      row.appendChild(title)
      row.appendChild(description)
      row.appendChild(time)
      row.appendChild(actions)
      
      tasksList.appendChild(row)
    })
  })
  .catch(() => {
    tasksListMsg.textContent = 'Wystąpił błąd podczas pobierania listy zadań. Spróbuj ponownie później.'
    tasksListMsg.classList.add('is-danger')
  })
}

const completeTask = (id) => {
  tasksListMsg.classList.remove('is-danger')
  tasksListMsg.classList.add('is-hidden')

  const button = document.querySelector(`#deleteTask${id}`)
  button.classList.add('is-loading')

  setTimeout(() => {
    fetch(`/api/tasks?id=${id}`, { method: 'DELETE' })
      .then((response) => {
        if (!response.ok) {
          throw Error(response.statusText)
        }

        tasksListMsg.textContent = 'Pomyślnie usunięto zadanie.'
        tasksListMsg.classList.add('is-success')

        listTasks()
      })
      .catch(() => {
        button.classList.remove('is-loading')
        tasksListMsg.textContent = 'Wystąpił błąd podczas usuwania zadania. Spróbuj ponownie później.'
        tasksListMsg.classList.add('is-danger')
      })
      .finally(() => {
        tasksListMsg.classList.remove('is-hidden')
      })
  }, 1000)
}

listTasks()

addTaskForm.addEventListener('submit', (event) => {
  event.preventDefault()

  addTaskBtn.classList.add('is-loading', 'is-disabled')
  addTaskMsg.classList.remove('is-danger', 'is-success')
  addTaskMsg.classList.add('is-hidden')

  setTimeout(() => {
    addTask()
      .then((response) => {
        if (!response.ok) {
          throw Error('Wystąpił błąd podczas dodawania zadania. Spróbuj ponownie później.')
        }

        addTaskMsg.textContent = 'Pomyślnie dodano zadanie.'
        addTaskMsg.classList.add('is-success')
        addTaskTitle.value = ''
        addTaskDescription.value = ''

        listTasks()
      })
      .catch((error) => {
        addTaskMsg.textContent = error.message
        addTaskMsg.classList.add('is-danger')
      })
      .finally(() => {
        addTaskBtn.classList.remove('is-loading', 'is-disabled')
        addTaskMsg.classList.remove('is-hidden')
      })
  }, 1000)    
})