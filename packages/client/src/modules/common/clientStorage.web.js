export const getItem = async name => window.localStorage.getItem(name);
export const setItem = async (name, value) => window.localStorage.setItem(name, value);
export const removeItem = async name => window.localStorage.removeItem(name);
