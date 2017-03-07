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
  const wk = localStorage.knownTodo;
  const known = wk ? JSON.parse(wk) : [];
  const newTodos = data.filter((it) => !known.includes(it.id));
  // 今回はじめて取得したものは通知する
  newTodos.forEach((todo) => {
    chrome.notifications.create(''+todo.id, {
      type: 'basic',
      iconUrl: '/icon.png',
      title: 'GitLab Notification',
      message: todo.body
    });
  });
  localStorage.setItem('knownTodo', JSON.stringify(data.map((it) => it.id)));
}

function polling() {
  const { rate } = localStorage;
  console.log(`start inteval: rate=${rate}`);
  timer = setInterval(() =>
    Todo.load()
      .then(setBadgeText)
      .then(notification)
      .fail((e) => {
        console.error(e);
        clearInterval(timer);
      }), rate);
}

