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
