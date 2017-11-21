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
      <menu-item>
        <nav-link [name]="'Posts'" [to]="'/posts'" [type]="'router'"></nav-link>
      </menu-item>
    `
  ],
  reducer: { post: reducer }
});
