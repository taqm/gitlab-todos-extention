/* global Todo */
/* global chrome */

const indicatorElem = document.getElementById('indicator');
const indicator = {
  start() {
    indicatorElem.classList.add('is-active');
  },
  stop() {
    indicatorElem.classList.remove('is-active');
  }
};

const options = document.getElementById('options');

// 初期値入力
{
  const { url, token, rate} = localStorage;
  options.url.value = url || '';
  options.token.value = token || '';
  options.rate.value = rate || 10000;
}
options.addEventListener('submit', (ev) => {
  ev.preventDefault();
  const url = ev.target.url.value;
  const token = ev.target.token.value;
  const rate = ev.target.rate.value;
  indicator.start();

  Todo.loadBy(url, token).done(() => {
    localStorage.setItem('url', url);
    localStorage.setItem('token', token);
    localStorage.setItem('rate', rate);
    alert('save successed');
    chrome.runtime.sendMessage({ action: 'updated'});

  }).fail(() => {
    alert('invalid url or token');

  })
  .always(() => {
    indicator.stop();
  });
});
