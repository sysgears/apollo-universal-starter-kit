import { constructUploadOptions } from 'apollo-fetch-upload';
import Feature from '../connector';
import UploadView from './components/UploadView.web';
import * as reducers from './reducers';

export default new Feature({
  route: [{ path: 'upload', component: UploadView, data: { title: 'Upload' } }],
  navItem: [
    `
      <li class="nav-item">
        <a class="nav-link" [routerLinkActive]="['active']" aria-current="true" routerLink="/upload">Upload</a>
      </li>
    `
  ],
  reducer: { upload: reducers },
  createFetchOptions: constructUploadOptions
});
