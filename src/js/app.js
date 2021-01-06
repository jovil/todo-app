/*
1. # Tasks
2. Completed/Incomplete filter
3. filter list
4. search
*/

const Todo = (function () {
  const form = document.querySelector('form');
  const inputTodo = document.querySelector('.todo-input__todo');
  const inputTags = document.querySelector('.todo-input__tags');
  const list = document.querySelector('.todos');
  const numberOfTodos = document.querySelector('#todos-left');
  const filter = document.getElementById('todo-filter');
  const todosArray = [];

  let todos = document.querySelectorAll('.todos li');
  let filteredTagsArray = [];
  let i = 0;

  const getNumberOfTodos = function () {
    todos = document.querySelectorAll('.todos li');
    numberOfTodos.textContent = `Items left: ${todos.length}`;
  };

  const handleTodoEdit = function (el) {
    el.addEventListener('keydown', (e) => {
      const keyName = e.key;
      const inputElement = e.target;
      const p = document.createElement('p');

      p.classList.add('title');

      if (keyName === 'Enter') {
        p.textContent = e.target.value;
        e.target.parentNode.append(p);
        inputElement.remove();
      }
    });
  };

  const handleKeyEvent = function (el) {
    switch (el.classList.value) {
      case 'todo-input__todo-edit':
        handleTodoEdit(el);
        break;
      default:
    }
  };

  const handleEditTodo = function (el) {
    el.addEventListener('click', (e) => {
      e.preventDefault();

      if (!e.target.closest('li').querySelector('.title')) return;

      const createInput = document.createElement('input');
      const text = e.target.closest('li').querySelector('.title');

      createInput.setAttribute('type', 'text');
      createInput.classList.add('todo-input__todo-edit');

      text.remove();
      createInput.value = text.textContent;
      e.target.closest('li').querySelector('.content').append(createInput);

      handleKeyEvent(createInput);
    });
  };

  const handleRemoveTodo = function (el) {
    el.addEventListener('click', (e) => {
      const index = e.target.closest('li').getAttribute('data-index');
      const todoItem = todosArray.findIndex(item => item.id == index);

      todosArray.splice(todoItem, 1);
      e.target.closest('li').remove();
      getNumberOfTodos();
    });
  };

  const handleFiltering = function () {
    filter.addEventListener('change', () => {
      list.innerHTML = '';

      todosArray.reverse().forEach((item) => {
        list.innerHTML += item.el.outerHTML;
        list.querySelectorAll('.delete').forEach((el) => {
          handleRemoveTodo(el);
        });

        list.querySelectorAll('.edit').forEach((el) => {
          handleEditTodo(el);
        });
      });
    });
  };

  const handleInput = function () {
    inputTodo.addEventListener('keyup', () => {
      if (form.classList.contains('error')) {
        form.classList.remove('error');
      }
    });
  };

  const handleTagsInput = function () {
    handleKeyEvent(inputTags);
  };

  const createTags = function (el) {
    if (inputTags.value === '') return;
    const tagsArray = [];
    const createElementTagWrapper = document.createElement('div');
    const splits = inputTags.value.split(',').map((item) => {
      return item.trim();
    });

    createElementTagWrapper.classList.add('tags');

    for (i = 0; i < splits.length; i++) {
      tagsArray.push(splits[i]);
    }

    function handleEmptyStringArray(array) {
      return array.filter(Boolean);
    }

    filteredTagsArray = handleEmptyStringArray(tagsArray);

    filteredTagsArray.forEach((item, index) => {
      const createTag = document.createElement('span');
      createTag.classList.add('tag');
      createTag.setAttribute('data-index', index);

      createTag.textContent = item;
      createElementTagWrapper.append(createTag);
    });

    el.append(createElementTagWrapper);
  };

  const getDate = function () {
    const date = new Date();
    const ye = new Intl.DateTimeFormat('en', { year: '2-digit' }).format(date);
    const mo = new Intl.DateTimeFormat('en', { month: 'short' }).format(date);
    const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(date);
    const p = document.createElement('small');
    p.classList.add('date');

    p.textContent = `${da}/${mo}/${ye}`;

    return p;
  };

  const createTodo = function () {
    const li = document.createElement('li');
    const p = document.createElement('p');
    const delBtn = document.createElement('button');
    const editBtn = document.createElement('button');
    const d = document.createElement('div');
    const d1 = document.createElement('div');
    const d2 = document.createElement('div');
    const currentDate = getDate();

    if (form.classList.contains('error')) {
      form.classList.remove('error');
    }

    p.textContent = inputTodo.value;
    editBtn.textContent = 'Edit';
    editBtn.setAttribute('type', 'button');
    editBtn.classList.add('edit');

    delBtn.textContent = 'Delete';
    delBtn.setAttribute('type', 'button');
    delBtn.classList.add('delete');

    p.classList.add('title');
    d.classList.add('content');
    d1.classList.add('metadata');
    d2.classList.add('actions');


    d.append(p);
    d2.append(editBtn);
    d2.append(delBtn);
    li.append(d);
    li.append(d1);

    d1.append(currentDate);
    createTags(d1);
    d1.append(d2);

    const item = {
      el: li,
      id: i + 1
    };

    i += 1;
    li.setAttribute('data-index', i);

    if (filter.value === 'descend') {
      list.prepend(li);
      todosArray.unshift(item);
    } else {
      list.append(li);
      todosArray.push(item);
    }

    inputTodo.value = '';
    inputTags.value = '';

    handleEditTodo(editBtn);
    handleRemoveTodo(delBtn);
    getNumberOfTodos();
  };

  const handleSubmit = function () {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      if (inputTodo.value !== '' && inputTodo.value.replace(/\s/g, '').length) {
        createTodo();
      } else {
        form.classList.add('error');
      }
    });
  };

  return {
    init: () => {
      handleSubmit();
      handleInput();
      handleTagsInput();
      handleFiltering();
      getNumberOfTodos();
    }
  };
}());

document.addEventListener('DOMContentLoaded', () => {
  Todo.init();
});
