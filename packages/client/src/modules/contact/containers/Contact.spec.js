import { expect } from 'chai';
import { step } from 'mocha-steps';

import Renderer from '../../../../src/testHelpers/Renderer';
import { blur, find, change, updateContent } from '../../../testHelpers/testUtils';

describe('Contact UI works', () => {
  const renderer = new Renderer({});
  let app;
  let container;
  let content;

  step('Contact page renders on mount', () => {
    app = renderer.mount();
    container = app.container;
    renderer.history.push('/contact');
    content = updateContent(app.container);
    expect(content).to.not.be.empty;
  });

  step('Name validation works', () => {
    const contactForm = find(container, 'form[name="contact"]');
    const nameInput = find(contactForm, '[name="name"]');

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
    const contactForm = find(container, 'form[name="contact"]');
    const emailInput = find(contactForm, '[name="email"]');

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
    const contactForm = find(container, 'form[name="contact"]');
    const contentInput = find(contactForm, '[name="content"]');

    blur(contentInput);
    expect(content.textContent).to.include('Required');

    change(contentInput, { target: { name: 'content', value: 'Text' } });
    blur(contentInput);
    expect(content.textContent).to.include('Must be 10 characters or more');

    change(contentInput, { target: { name: 'content', value: 'Some text for test' } });
    expect(content.textContent).to.not.include('Must be 10 characters or more');
    expect(content.textContent).to.not.include('Required');
  });
});
