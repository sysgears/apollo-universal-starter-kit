import { SecureStore } from 'expo';

export const getItem = async name => SecureStore.getItemAsync(name);
export const setItem = async (name, value) => SecureStore.setItemAsync(name, value);
export const removeItem = async name => SecureStore.deleteItemAsync(name);
