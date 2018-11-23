export const getItem = async name => window.sessionStorage.getItem(name);
export const setItem = async (name, value) => window.sessionStorage.setItem(name, value);
export const removeItem = async name => window.sessionStorage.removeItem(name);
