export const INCREMENT = 'INCREMENT';

export const defaultState = {
  count: 1
};

export const mutations = {
  [INCREMENT](state: any) {
    state.count++;
  }
};

export default {
  state: defaultState,
  mutations
};
