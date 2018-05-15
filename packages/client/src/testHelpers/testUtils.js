import { render, renderIntoDocument, Simulate, wait, waitForElement, fireEvent, cleanup } from 'react-testing-library';

const find = (container, selector) => {
  return container.querySelector(selector);
};

const findAll = (container, selector) => {
  return container.querySelectorAll(selector);
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

const updateContent = container => {
  return find(container, '#content');
};

export {
  render,
  renderIntoDocument,
  wait,
  waitForElement,
  fireEvent,
  cleanup,
  find,
  findAll,
  updateContent,
  click,
  change,
  submit
};
