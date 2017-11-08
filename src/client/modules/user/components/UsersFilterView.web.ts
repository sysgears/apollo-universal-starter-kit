import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import 'rxjs/add/operator/debounceTime';
import 'rxjs/add/operator/distinctUntilChanged';
import { Subject } from 'rxjs/Subject';
import { Subscription } from 'rxjs/Subscription';

import { UserFilterIsActive, UserFilterRole, UserFilterSearchText } from '../reducers';

@Component({
  selector: 'users-filter-view',
  template: `
      <form class="form-inline">
          <div class="form-group">
              <label class="col-form-label-md form-control-label">Filter:&nbsp;</label>
              <input #searchInput
                     (keyup)="onSearchTextChange(searchInput.value)"
                     type="text"
                     placeholder="Search ..."
                     class="form-control">
          </div>&nbsp;
          <div class="form-group">
              <label class="col-form-label-md form-control-label">Role:&nbsp;</label>
              <select #roleInput
                      class="form-control"
                      (change)="onRoleChange(roleInput.value)">
                  <option selected value="">Select ...</option>
                  <option *ngFor="let roleOption of roleOptions" [value]="roleOption.value">{{ roleOption.name }}</option>
              </select>
          </div>&nbsp;
          <div class="form-group">
              <label class=" form-control-label">
                <input #isActiveInput
                       type="checkbox"
                       class="form-check-input"
                       (change)="onIsActiveChange(isActiveInput.checked)">
                  Is Active
              </label>
          </div>
      </form>
  `
})
export default class UsersFilterView implements OnInit, OnDestroy {
  public subscription: Subscription;
  public roleOptions: any;
  private searchTextChanged = new Subject<string>();

  constructor(private store: Store<any>) {
    this.roleOptions = this.getRoleOptions();
  }

  public ngOnInit(): void {
    this.subscription = this.searchTextChanged
      .debounceTime(300)
      .distinctUntilChanged()
      .subscribe((searchText: string) => {
        this.store.dispatch(new UserFilterSearchText(searchText));
      });
  }

  public ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  public onSearchTextChange(searchText: string) {
    this.searchTextChanged.next(searchText);
  }

  public onRoleChange(role: string) {
    return this.store.dispatch(new UserFilterRole(role));
  }

  public onIsActiveChange(isActive: boolean) {
    return this.store.dispatch(new UserFilterIsActive(isActive));
  }

  private getRoleOptions() {
    return [{ name: 'admin', value: 'admin' }, { name: 'user', value: 'user' }];
  }
}

// import React from 'react';
// import PropTypes from 'prop-types';
// import { DebounceInput } from 'react-debounce-input';
// import { Form, FormItem, Select, Option, Label, Input } from '../../common/components/web';
//
// class UsersFilterView extends React.PureComponent {
//   handleSearch = e => {
//     const { onSearchTextChange } = this.props;
//     onSearchTextChange(e.target.value);
//   };
//
//   handleRole = e => {
//     const { onRoleChange } = this.props;
//     onRoleChange(e.target.value);
//   };
//
//   handleIsActive = () => {
//     const { onIsActiveChange, isActive } = this.props;
//     onIsActiveChange(!isActive);
//   };
//
//   render() {
//     const { role, isActive } = this.props;
//     return (
//       <Form layout="inline">
//       <FormItem label="Filter">
//       <DebounceInput
//         minLength={2}
//     debounceTimeout={300}
//     placeholder="Search ..."
//     element={Input}
//     onChange={this.handleSearch}
//     />
//     </FormItem>
//     &nbsp;
//     <FormItem label="Role">
//     <Select name="role" defaultValue={role} onChange={this.handleRole}>
//     <Option key={1} value="">
//       Select ...
//     </Option>
//     <Option key={2} value="user">
//       user
//       </Option>
//       <Option key={3} value="admin">
//       admin
//       </Option>
//       </Select>
//       </FormItem>
//       &nbsp;
//     <FormItem>
//       <Label>
//         <Input type="checkbox" defaultChecked={isActive} onChange={this.handleIsActive} /> Is Active
//     </Label>
//     </FormItem>
//     </Form>
//   );
//   }
// }
//
// UsersFilterView.propTypes = {
//   searchText: PropTypes.string,
//   role: PropTypes.string,
//   isActive: PropTypes.bool,
//   onSearchTextChange: PropTypes.func.isRequired,
//   onRoleChange: PropTypes.func.isRequired,
//   onIsActiveChange: PropTypes.func.isRequired
// };
//
// export default UsersFilterView;
