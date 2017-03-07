const todos = JSON.parse(localStorage.todos);

const list = document.getElementById('todo-list');
todos.forEach((todo) => {
  const li = document.createElement('li');
  li.classList.add('todo');
  li.innerHTML = row(todo);
  list.appendChild(li);
});

function row(todo) {
  const created = dateFormat(new Date(todo.created_at));
  return `
    <div class="panel-heading">
      ${todo.project.name_with_namespace}
    </div>
    <div class="panel-body">
      <img class="avatar" src="${todo.author.avatar_url}"></img>
      <div class="todo-box">
        <div class="title">
          ${todo.target_type} / ${todo.action_name}
          <span class="author-name">${todo.author.name}</span>
          ${created}
        </div>
        <div class="body">${todo.body}</div>
      </div>
    </div>
    <a class="surface" target="_blank" href="${todo.target_url}">
    </a>
  `;
}

function dateFormat(date) {
  const year = date.getFullYear();
  const month =date.getMonth() + 1;
  const day = date.getDate();
  const hour = date.getHours();
  const min = `00${date.getMinutes()}`.slice(-2);

  return `${year}/${month}/${day} ${hour}:${min}`;
}