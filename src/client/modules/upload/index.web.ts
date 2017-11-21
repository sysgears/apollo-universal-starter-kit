import { constructUploadOptions } from 'apollo-fetch-upload';
import Feature from '../connector';
import UploadView from './components/UploadView.web';
import reducer from './reducers';

export default new Feature({
  route: [{ path: 'upload', component: UploadView, data: { title: 'Upload' } }],
  reducer: { upload: reducer },
  navItem: [
    `
      <menu-item>
        <nav-link [name]="'Upload'" [to]="'/upload'" [type]="'router'"></nav-link>
      </menu-item>
    `
  ],
  createFetchOptions: constructUploadOptions
});
