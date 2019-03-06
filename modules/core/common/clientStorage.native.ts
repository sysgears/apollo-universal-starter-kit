import { SecureStore } from 'expo';

export const getItem = async (name: string) => SecureStore.getItemAsync(name);
export const setItem = async (name: string, value: string) => SecureStore.setItemAsync(name, value);
export const removeItem = async (name: string) => SecureStore.deleteItemAsync(name);
