/* global $ */
/* eslint no-undef: 0*/

Todo = {
  load() {
    const { url, token, version } = localStorage;
    return this.loadBy(url, token, version || 'v4');
  },
  loadBy(url, token, version = 'v4') {
    return $.ajax({
      type: 'get',
      url: `${url}/api/${version}/todos`,
      headers: {
        'PRIVATE-TOKEN': token
      }
    });
  }
};
