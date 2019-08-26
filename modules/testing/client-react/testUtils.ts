import { JSDOM } from 'jsdom';

const dom = new JSDOM('<!doctype html><html><body><div id="root"><div></body></html>');
(global as any).document = dom.window.document;
(global as any).window = dom.window;
(global as any).window.Date = Date;
// Needed by Formik >= 1.x
(global as any).HTMLButtonElement = dom.window.HTMLButtonElement;
(global as any).navigator = dom.window.navigator;

/* tslint:disable no-var-requires */
const { prettyDOM } = require('@testing-library/dom');
const { render, renderIntoDocument, wait, waitForElement, fireEvent, cleanup } = require('@testing-library/react');

const find = (container: any, selector: any) => {
  return container.querySelector(selector);
};

const findAll = (container: any, selector: any) => {
  return container.querySelectorAll(selector);
};

const isElementExist = (container: any, selector: any) => {
  const element = find(container, selector);
  if (!element) {
    throw new Error(`Unable to find element by selector: ${selector}. Container: \n${prettyDOM(container)}`);
  }
  return element;
};

const waitForElementRender = async (container: any, selector: any): Promise<any> => {
  let element = null;
  await wait(() => {
    element = isElementExist(container, selector);
  });
  return element;
};

const click = (element: any) => {
  fireEvent.click(element, { button: 0 });
};

const change = (element: any, value: any) => {
  fireEvent.change(element, value);
};

const submit = (element: any) => {
  fireEvent.submit(element);
};

const blur = (element: any) => {
  fireEvent.blur(element);
};

const updateContent = (container: any) => {
  return find(container, '#content');
};

export {
  prettyDOM,
  render,
  renderIntoDocument,
  wait,
  waitForElement,
  waitForElementRender,
  fireEvent,
  cleanup,
  find,
  isElementExist,
  findAll,
  updateContent,
  click,
  change,
  submit,
  blur
};
