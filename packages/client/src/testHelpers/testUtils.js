import { prettyDOM } from 'dom-testing-library';
import { render, renderIntoDocument, Simulate, wait, waitForElement, fireEvent, cleanup } from 'react-testing-library';

const find = (container, selector) => {
  return container.querySelector(selector);
};

const findAll = (container, selector) => {
  return container.querySelectorAll(selector);
};

const isElementExist = (container, selector) => {
  const element = find(container, selector);
  if (!element) {
    throw new Error(`Unable to find element by selector: ${selector}. Container: \n${prettyDOM(container)}`);
  }
  return element;
};

const waitForElementRender = async (container, selector) => {
  let element = null;
  await wait(() => {
    element = isElementExist(container, selector);
  });
  return element;
};

const click = element => {
  Simulate.click(element, { button: 0 });
};

const change = (element, value) => {
  Simulate.change(element, value);
};

const submit = element => {
  Simulate.submit(element);
};

const blur = element => {
  Simulate.blur(element);
};

const updateContent = container => {
  return find(container, '#content');
};

export {
  render,
  renderIntoDocument,
  prettyDOM,
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
