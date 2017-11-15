import { reducer } from './reducers';

import Feature from '../connector';
import PostEditView from './components/PostEditView.web';
import PostList from './components/PostList.web';

export default new Feature({
  route: [
    {
      path: 'posts',
      component: PostList,
      data: { title: 'Apollo Fullstack Starter Kit - List of all posts example page' }
    },
    { path: 'post/:id', component: PostEditView, data: { title: 'Apollo Starter Kit - Edit post' } }
  ],
  navItem: [
    `
      <li class="nav-item">
        <a class="nav-link" [routerLinkActive]="['active']" aria-current="true" routerLink="/posts">Posts</a>
      </li>
    `
  ],
  reducer: { post: reducer }
});
