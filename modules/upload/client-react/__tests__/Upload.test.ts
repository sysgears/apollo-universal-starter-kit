import { Renderer } from '@gqlapp/testing-client-react';

import { act, waitForElement, RenderResult } from '@testing-library/react';

describe('Upload UI works', () => {
  const renderer = new Renderer({});

  let dom: RenderResult;

  beforeAll(async () => {
    dom = renderer.mount();

    act(() => {
      renderer.history.push('/upload');
    });

    await waitForElement(() => dom.getByText('File name'));
  });

  it('Should render on mount', async () => {
    await waitForElement(() => dom.getByText(RegExp('select files for upload')));
  });
});
