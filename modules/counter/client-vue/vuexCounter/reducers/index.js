export const INCREMENT = 'INCREMENT';

export const state = {
  count: 5
};

/* eslint no-param-reassign: ['error', { 'props': false }] */
export const mutations = {
  [INCREMENT](state) {
    state.count++;
  }
};

export default {
  state,
  mutations
};
