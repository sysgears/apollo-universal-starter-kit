export enum AlertType {
  SUCCESS,
  INFO,
  WARNING,
  ERROR
}

export interface AlertItem {
  message: string;
  type: AlertType;
  alertId?: string;
}

const createAlert = (message: string, type: AlertType, id?: string) => {
  return {
    message,
    type,
    alertId: id || null
  };
};

export const createSuccessAlert = (message: string, id?: string): AlertItem => {
  return createAlert(message, AlertType.SUCCESS, id);
};

export const createInfoAlert = (message: string, id?: string): AlertItem => {
  return createAlert(message, AlertType.INFO, id);
};

export const createWarningAlert = (message: string, id?: string): AlertItem => {
  return createAlert(message, AlertType.WARNING, id);
};

export const createErrorAlert = (message: string, id?: string): AlertItem => {
  return createAlert(message, AlertType.ERROR, id);
};
