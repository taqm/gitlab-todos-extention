/* global Todo */
/* global chrome */

let timer;

// メッセージ受付
chrome.runtime.onMessage.addListener(({ action }) => {
  if (action === 'updated') {
    console.log('stop interval');
    clearInterval(timer);
    polling();
  }
});

if (!localStorage.url || localStorage.token) {
  console.log('please initialization');
}

// 初回読み込みが成功したらインターバル開始
Todo.load().done(setBadgeText)
  .then(notification)
  .then(polling)
  .fail((data) => console.error(data));

function setBadgeText(data) {
  const text = data.length ? data.length.toString() : '';
  chrome.browserAction.setBadgeText({ text });
  return data;
}

function notification(data) {
  const todoJson = localStorage.todos;
  const pre = todoJson ? JSON.parse(todoJson) : [];
  const knownid = pre.map((todo) => todo.id);
  const newTodos = data.filter((it) => !knownid.includes(it.id));
  // 今回はじめて取得したものは通知する
  newTodos.forEach((todo) => {
    let message = `${todo.target_type} / ${todo.action_name}\n`;
    message += `from ${todo.author.name}\n`;
    message += todo.body;
    const id = chrome.notifications.create(''+todo.id, {
      type: 'basic',
      iconUrl: '/icons/icon.png',
      title: 'GitLab Notification',
      message,
      buttons: [{
        title: 'Open'
      }]
    });
    todo.notificationId = id;
  });
  return data;
}

chrome.notifications.onButtonClicked.addListener((id) => {
  const todos = JSON.parse(localStorage.todos);
  const target = todos.find((todo) => id == todo.id);
  if (!target) return;
  window.open(target.target_url, 'gitlab:todo');
});

function polling() {
  const { rate } = localStorage;
  console.log(`start inteval: rate=${rate}`);
  timer = setInterval(() =>
    Todo.load()
      .then(setBadgeText)
      .then(notification)
      .then((data) => {
        localStorage.todos = JSON.stringify(data);
      })
      .fail((e) => {
        console.error(e);
        clearInterval(timer);
      }), rate);
}

