export const getItem = async (name: string) => window.sessionStorage.getItem(name);
export const setItem = async (name: string, value: string) => window.sessionStorage.setItem(name, value);
export const removeItem = async (name: string) => window.sessionStorage.removeItem(name);
