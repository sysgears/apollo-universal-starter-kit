import { act, fireEvent, waitForElement, wait, RenderResult } from '@testing-library/react';

import { Renderer } from '@gqlapp/testing-client-react';

describe('Contact UI works', () => {
  const renderer = new Renderer({});

  let dom: RenderResult;

  let nameInput: any;
  let emailInput: any;
  let contentInput: any;
  let submitButton: any;

  beforeAll(async () => {
    act(() => {
      dom = renderer.mount();
      renderer.history.push('/contact');
    });

    await waitForElement(() => dom.getAllByText('Contact Us'));
  });

  beforeEach(() => {
    if (dom) {
      nameInput = dom.getByLabelText('Name');
      emailInput = dom.getByLabelText('Email');
      contentInput = dom.getByLabelText('Message');
      submitButton = dom.getByText('Send');
    }
  });

  it('Contact page renders on mount', async () => {
    expect(dom.getAllByText('Contact Us')).toBeDefined();
  });

  it('Name validation works', async () => {
    act(() => {
      fireEvent.blur(nameInput);
    });
    await waitForElement(() => dom.getByText('Required'));

    act(() => {
      fireEvent.change(nameInput, { target: { value: 'na' } });
      fireEvent.blur(nameInput);
    });
    await waitForElement(() => dom.getByText('Must be 3 or more characters'));

    act(() => {
      fireEvent.change(nameInput, { target: { value: 'name' } });
    });
    await wait(() => {
      expect(dom.queryByText('Must be 3 or more characters')).toBeNull();
      expect(dom.queryByText('Required')).toBeNull();
    });
  });

  it('Email validation works', async () => {
    act(() => {
      fireEvent.blur(emailInput);
    });
    await waitForElement(() => dom.getByText('Required'));

    act(() => {
      fireEvent.change(emailInput, { target: { value: 'admin' } });
      fireEvent.blur(emailInput);
    });
    await waitForElement(() => dom.getByText('Invalid email address'));

    act(() => {
      fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    });
    await wait(() => {
      expect(dom.queryByText('Invalid email address')).toBeNull();
      expect(dom.queryByText('Required')).toBeNull();
    });
  });

  it('Content validation works', async () => {
    act(() => {
      fireEvent.blur(contentInput);
    });
    await waitForElement(() => dom.getByText('Required'));

    act(() => {
      fireEvent.change(contentInput, { target: { value: 'Text' } });
      fireEvent.blur(contentInput);
    });
    await waitForElement(() => dom.getByText('Must be 10 or more characters'));

    fireEvent.change(contentInput, { target: { value: 'Some text for test' } });
    await wait(() => {
      expect(dom.queryByText('Must be 10 or more characters')).toBeNull();
      expect(dom.queryByText('Required')).toBeNull();
    });
  });

  it('Form is not submitted with not valid data', async () => {
    fireEvent.change(nameInput, { target: { value: '' } });
    fireEvent.change(emailInput, { target: { value: 'admin' } });
    fireEvent.change(contentInput, { target: { value: 'test' } });
    act(() => {
      fireEvent.click(submitButton);
    });
    await waitForElement(() => dom.getByText('Invalid email address'));
  });

  it('Form is submitted with valid data', async () => {
    fireEvent.change(nameInput, { target: { value: 'admin' } });
    fireEvent.change(emailInput, { target: { value: 'admin@example.com' } });
    fireEvent.change(contentInput, { target: { value: 'Some text for test' } });
    act(() => {
      fireEvent.click(submitButton);
    });
    await waitForElement(() => dom.getByText('Thank you for contacting us!'));
  });
});
