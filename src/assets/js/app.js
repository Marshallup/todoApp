class TodoApp {

  constructor(appSelector) {
    this.app = document.querySelector(appSelector);
    this.todos = [];
    this.createTodoField = null;
    this.init();
  }

  initElements(app) {
    this.createTodoField = new createTodoField(app);
    this.loadLocalTodos();
  }

  initCreateTodo() {
    const $this = this;
    const { submitElement } = this.createTodoField;

    submitElement.addEventListener('click', function() {
      const newTodoVal = $this.createTodoField.value;

      if (newTodoVal) {
        const newTodo = new newTodoField({ value: newTodoVal, status: 'active'});
        $this.addTodoInDOM(newTodo);
        $this.saveLocalTodos({value: newTodo.value, status: newTodo.status});
        console.log(newTodo, 'create Todo');
      } else {
        console.log('no');
      }

    });
  }

  addTodoInDOM(todo) {
    const childrenApp = this.app.children;
    const lastChildren = childrenApp[childrenApp.length - 1];
    lastChildren.parentNode.insertBefore(todo.htmlElement, lastChildren.nextSibling);

    this.todos.push(todo);
    this.clearInput(this.createTodoField);
    todo.deleteIcon.addEventListener('click', () => {
      this.deleteTodo(todo)
    }, true);
  }

  deleteTodo(todo) {
    this.todos.filter((item) => {
      item.value !== todo.value
    })
    todo.htmlElement.parentNode.removeChild(todo.htmlElement);
    this.deleteLocalTodo(todo.value)
  }

  clearInput(element) {
    element.htmlElement.value = '';
    element.value = '';
    element.htmlElement.parentNode.querySelector('label').classList.remove('active');
  }

  init() {
    this.initElements(this.app);
    this.initCreateTodo();
  }

  saveLocalTodos(todo) {
    let localTodos = localStorage.getItem('todos');

    if (localTodos) {
      localTodos = JSON.parse(localTodos);
      localTodos.push(todo);
    } else {
      localTodos = [todo];
    }

    localStorage.setItem('todos', JSON.stringify(localTodos));
  }

  loadLocalTodos() {
    let todos = localStorage.getItem('todos');

    if (todos) {
      JSON.parse(todos).forEach(todo => {
        const newTodo = new newTodoField({value: todo.value, status: todo.status });
        this.addTodoInDOM(newTodo);
      });
      // this.filterTodos('active');
    }
  }

  filterTodos(type) {

    let checkbox;

    document.querySelectorAll('.todo-app-checkbox').forEach(item => {
      const input = item.querySelector('input');
      input.checked = false;
      input.classList.remove('active');
    });

    switch(type) {
      case 'active':
        checkbox = document.querySelector('.todo-app-checkbox__active').querySelector('input');
      break;
      case 'completed':
        checkbox = document.querySelector('.todo-app-checkbox__completed').querySelector('input');
      break;
      default:
        checkbox = document.querySelector('.todo-app-checkbox__all').querySelector('input');
      break;
    }

    checkbox.checked = true;
    checkbox.classList.add('active');
  }

  addEventOnCheckboxes() {
    document.querySelectorAll('.todo-app-checkbox').onclick = () => {
      
    }
  }

  deleteLocalTodo(todo) {
    let todos = localStorage.getItem('todos');

    if (todos) {
      todos = JSON.parse(todos).filter(val => val !== todo );
      localStorage.setItem('todos', JSON.stringify(todos));
    }
  }
}

class createTodoField {

  constructor(app) {
    this.htmlElement = app.querySelector('#todo-create');
    this.value = this.htmlElement.value;
    this.submitElement = app.querySelector('#todo-create-icon');
    this.updateValue();
  }

  updateValue() {
    const $this = this;
    this.htmlElement.addEventListener('input', function () {
      $this.value = this.value;
    })
  }

}

class newTodoField {
  constructor(data) {
    this.htmlElement = this.createHtmlElement(data.value);
    this.value = data.value;
    this.status = data.status;
    this.deleteIcon = this.htmlElement.querySelector('.todo-app-item__delete');
  }

  createHtmlElement(text) {
    const li = document.createElement('li');
    const label = document.createElement('label');
    const input = document.createElement('input');
    const span = document.createElement('span');
    const div = document.createElement('div');
    const i = document.createElement('i');

    li.classList.add(...['collection-item', 'todo-app-item']);
    label.classList.add(...['todo-app-item__checkbox-label']);
    input.classList.add(...['todo-app-item__checkbox']);
    i.classList.add(...['material-icons', 'todo-app-item__delete']);

    input.type = 'checkbox';
    div.textContent = text;
    i.textContent = 'close';

    li.appendChild(label);
    li.appendChild(div);
    label.appendChild(input);
    label.appendChild(span);
    div.appendChild(i);

    return li;
  }

}

class filter {

  constructor() {

    const all = this.getChekbox('.todo-app-checkbox__all');
    const active = this.getChekbox('.todo-app-checkbox__active');
    const completed = this.getChekbox('.todo-app-checkbox__completed');

    this.checkboxes = {
      all: {...all},
      active: {...active},
      completed: {...completed},
    };
    this.active = this.checkboxes.all;
  }

  getChekbox(className) {
    const wrap = document.querySelector(className);
    return {
      wrap,
      input: wrap.querySelector('input')
    }
  }

  filterTodos(type) {

    const $this = this;

    Object.values(this.checkboxes).forEach(item => {
      item.input.addEventListener('click', function() {
        console.log('click')
        if(item.input.checked) {
          Object.values($this.checkboxes).forEach(item => {
            item.input.checked = false;
          });
          item.wrap.classList.add('active');
          item.input.checked = true;
          $this.active.wrap.classList.remove('active');
          $this.active = item;
        } else {
          item.input.checked = true;
          // item.wrap.classList.remove('active')
        }
      }, true)
    })

    // let checkbox;

    // document.querySelectorAll('.todo-app-checkbox').forEach(item => {
    //   const input = item.querySelector('input');
    //   input.checked = false;
    //   input.classList.remove('active');
    // });

    // switch(type) {
    //   case 'active':
    //     checkbox = document.querySelector('.todo-app-checkbox__active').querySelector('input');
    //   break;
    //   case 'completed':
    //     checkbox = document.querySelector('.todo-app-checkbox__completed').querySelector('input');
    //   break;
    //   default:
    //     checkbox = document.querySelector('.todo-app-checkbox__all').querySelector('input');
    //   break;
    // }

    // checkbox.checked = true;
    // checkbox.classList.add('active');
  }
}

const filter1 = new filter;
filter1.filterTodos()


const todoApp = new TodoApp('#todo-app');

console.log(todoApp, 'todo app constructor');