// Reexport for backward-compatibility purposes
import { clientStorage } from '@gqlapp/core-common';
const { getItem, setItem, removeItem } = clientStorage;
export { getItem, setItem, removeItem };
