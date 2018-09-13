import translate from '../modules/common/i18n';

export type TranslateFunction = (msg: string, ...params: any[]) => string;

export default translate;
