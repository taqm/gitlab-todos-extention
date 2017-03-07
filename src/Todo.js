/* global $ */
/* eslint no-undef: 0*/

Todo = {
  load() {
    const { url, token } = localStorage;
    return this.loadBy(url, token);
  },
  loadBy(url, token) {
    return $.ajax({
      type: 'get',
      url: `${url}/api/v3/todos`,
      headers: {
        'PRIVATE-TOKEN': token
      }
    });
  }
};