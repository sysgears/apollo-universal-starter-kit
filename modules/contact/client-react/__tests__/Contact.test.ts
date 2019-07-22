/* tslint:disable:no-unused-expression*/
import { expect } from 'chai';

import {
  Renderer,
  click,
  blur,
  find,
  change,
  updateContent,
  wait,
  waitForElementRender
} from '@gqlapp/testing-client-react';

/**
 * *NOTICE*
 * Formik uses the asynchronous validation fields. If you want to test form validation, you have to check the error
 * validation messages on the next tick of the JavaScript event loop. You can use the 'wait()' function to do that.
 */

describe('Contact UI works', async () => {
  const renderer = new Renderer({});
  renderer.history.push('/contact');
  let app: any;
  let content: any;
  let contactForm: any;
  let nameInput: any;
  let emailInput: any;
  let contentInput: any;
  let submitButton: any;

  beforeAll(async () => {
    app = renderer.mount();
    renderer.history.push('/contact');
    await waitForElementRender(app.container, 'form[name="contact"]');
  });

  beforeEach(() => {
    content = updateContent(app.container);
    contactForm = find(app.container, 'form[name="contact"]');
    nameInput = find(contactForm, '[name="name"]');
    emailInput = find(contactForm, '[name="email"]');
    contentInput = find(contactForm, '[name="content"]');
    submitButton = find(contactForm, 'button.btn-primary');
  });

  it('Contact page renders on mount', async () => {
    await waitForElementRender(app.container, 'h1');
    expect(content).to.not.be.empty;
  });

  it('Name validation works', async () => {
    blur(nameInput);
    await wait(() => expect(content.textContent).to.include('Required'));

    change(nameInput, { target: { name: 'name', value: 'na' } });
    blur(nameInput);
    await wait(() => expect(content.textContent).to.include('Must be 3 or more characters'));

    change(nameInput, { target: { name: 'name', value: 'name' } });
    await wait(() => {
      expect(content.textContent).to.not.include('Must be 3 or more characters');
      expect(content.textContent).to.not.include('Required');
    });
  });

  it('Email validation works', async () => {
    blur(emailInput);
    await wait(() => expect(content.textContent).to.include('Required'));

    change(emailInput, { target: { name: 'email', value: 'admin' } });
    blur(emailInput);
    await wait(() => expect(content.textContent).to.include('Invalid email address'));

    change(emailInput, { target: { name: 'email', value: 'admin@example.com' } });
    await wait(() => {
      expect(content.textContent).to.not.include('Invalid email address');
      expect(content.textContent).to.not.include('Required');
    });
  });

  it('Content validation works', async () => {
    blur(contentInput);
    await wait(() => expect(content.textContent).to.include('Required'));

    change(contentInput, { target: { name: 'content', value: 'Text' } });
    blur(contentInput);
    await wait(() => expect(content.textContent).to.include('Must be 10 or more characters'));

    change(contentInput, { target: { name: 'content', value: 'Some text for test' } });
    await wait(() => {
      expect(content.textContent).to.not.include('Must be 10 or more characters');
      expect(content.textContent).to.not.include('Required');
    });
  });

  it('Click on submit button works', () => {
    click(submitButton);
  });

  it('Form is not submitted with not valid data', async () => {
    change(nameInput, { target: { name: 'name', value: '' } });
    change(emailInput, { target: { name: 'email', value: 'admin' } });
    change(contentInput, { target: { name: 'content', value: 'test' } });
    click(submitButton);
    await wait(() => expect(content.textContent).to.not.include('Thank you for contacting us!'));
  });

  it('Form is submitted with valid data', async () => {
    change(nameInput, { target: { name: 'name', value: 'admin' } });
    change(emailInput, { target: { name: 'email', value: 'admin@example.com' } });
    change(contentInput, { target: { name: 'content', value: 'Some text for test' } });
    click(submitButton);
    await wait(() => {
      expect(content.textContent).to.not.include('Must be 3 or more characters');
      expect(content.textContent).to.not.include('Invalid email address');
      expect(content.textContent).to.not.include('Must be 10 or more characters');
      expect(content.textContent).to.not.include('Required');
    });
  });
});
