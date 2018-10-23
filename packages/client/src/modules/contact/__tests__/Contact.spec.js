import { expect } from 'chai';
import { step } from 'mocha-steps';

import Renderer from '../../../../src/testHelpers/Renderer';
import { click, blur, find, change, updateContent } from '../../../testHelpers/testUtils';

describe('Contact UI works', () => {
  const renderer = new Renderer({});
  const app = renderer.mount();
  const container = app.container;
  renderer.history.push('/contact');
  const content = updateContent(app.container);
  const contactForm = find(container, 'form[name="contact"]');
  const nameInput = find(contactForm, '[name="name"]');
  const emailInput = find(contactForm, '[name="email"]');
  const contentInput = find(contactForm, '[name="content"]');
  const submitButton = find(contactForm, 'button.btn-primary');

  step('Contact page renders on mount', () => {
    expect(content).to.not.be.empty;
  });

  step('Name validation works', () => {
    blur(nameInput);
    expect(content.textContent).to.include('Required');

    change(nameInput, { target: { name: 'name', value: 'na' } });
    blur(nameInput);
    expect(content.textContent).to.include('Must be 3 characters or more');

    change(nameInput, { target: { name: 'name', value: 'name' } });
    expect(content.textContent).to.not.include('Must be 3 characters or more');
    expect(content.textContent).to.not.include('Required');
  });

  step('Email validation works', () => {
    blur(emailInput);
    expect(content.textContent).to.include('Required');

    change(emailInput, { target: { name: 'email', value: 'admin' } });
    blur(emailInput);
    expect(content.textContent).to.include('Invalid email address');

    change(emailInput, { target: { name: 'email', value: 'admin@example.com' } });
    expect(content.textContent).to.not.include('Invalid email address');
    expect(content.textContent).to.not.include('Required');
  });

  step('Content validation works', () => {
    blur(contentInput);
    expect(content.textContent).to.include('Required');

    change(contentInput, { target: { name: 'content', value: 'Text' } });
    blur(contentInput);
    expect(content.textContent).to.include('Must be 10 characters or more');

    change(contentInput, { target: { name: 'content', value: 'Some text for test' } });
    expect(content.textContent).to.not.include('Must be 10 characters or more');
    expect(content.textContent).to.not.include('Required');
  });

  step('Click on submit button works', () => {
    click(submitButton);
  });

  step('Form is not submited with not valid data', () => {
    change(nameInput, { target: { name: 'name', value: '' } });
    change(emailInput, { target: { name: 'email', value: 'admin' } });
    change(contentInput, { target: { name: 'content', value: 'test' } });
    click(submitButton);
    expect(content.textContent).to.not.include('Thank you for contacting us!');
  });

  step('Form is submited with valid data', () => {
    change(nameInput, { target: { name: 'name', value: 'admin' } });
    change(emailInput, { target: { name: 'email', value: 'admin@example.com' } });
    change(contentInput, { target: { name: 'content', value: 'Some text for test' } });
    click(submitButton);
    expect(content.textContent).to.not.include('Must be 3 characters or more');
    expect(content.textContent).to.not.include('Invalid email address');
    expect(content.textContent).to.not.include('Must be 10 characters or more');
    expect(content.textContent).to.not.include('Required');
  });
});
