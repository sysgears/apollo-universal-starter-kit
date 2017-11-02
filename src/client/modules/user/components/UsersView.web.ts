import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import UsersService from '../containers/Users';

@Component({
  selector: 'users-view',
  template: `
      <div id="content" *ngIf="!loading; else showLoading" class="container">
         <h2>Users</h2>
					<h1></h1>
					<ul class="list-group">
							<li class="justify-content-between list-group-item">
									<span>Username:</span>
									<span>Email:</span>
									<span>Is Admin:</span>
							</li>
							<li class="justify-content-between list-group-item" *ngFor="let user of renderUsers()">
									<span>{{ user.username }}</span>
									<span>{{ user.email }}</span>
									<span>{{ user.isAdmin }}</span>
							</li>
					</ul>
			</div>
      <ng-template #showLoading>
          <div class="text-center">Loading...</div>
      </ng-template>
  `
})
export default class UsersView implements OnInit, OnDestroy {
  public loading: boolean = true;
  public users: any;
  private subsOnLoadUsers: Subscription;

  constructor(private usersService: UsersService, private ngZone: NgZone) {}

  public ngOnInit(): void {
    this.subsOnLoadUsers = this.usersService.getUsers().subscribe(({ data: { users }, loading }: any) => {
      this.ngZone.run(() => {
        this.users = users;
        this.loading = loading;
      });
    });
  }

  public ngOnDestroy(): void {
    this.subsOnLoadUsers.unsubscribe();
  }

  public renderUsers() {
    return this.users.map(({ id, username, email, isAdmin }: any): any => {
      return {
        id,
        username,
        email,
        isAdmin
      };
    });
  }
}

// // Web only component
// // React
// import React from "react";
// import PropTypes from "prop-types";
// import Helmet from "react-helmet";
// import { ListGroup, ListGroupItem } from "reactstrap";
//
// import PageLayout from "../../../app/PageLayout";
//
// function renderUsers(users) {
// 	return users.map(({ id, username, email, isAdmin }) => {
// 		return (
// 			<ListGroupItem className="justify-content-between" key={id}>
// 			<span>{username}</span>
// 			<span>{email}</span>
// 			<span>{isAdmin.toString()}</span>
// 		</ListGroupItem>
// 	);
// 	});
// }
//
// const UsersView = ({ loading, users, errors }) => {
// 	const renderMetaData = () => (
// 		<Helmet
// 			title="User"
// 	meta={[
// 		{
// 			name: "description",
// 			content: "User page"
// 		}
// 		]}
// 	/>
// );
//
// 	if (loading) {
// 		return (
// 			<PageLayout>
// 				{renderMetaData()}
// 			<div className="text-center">Loading...</div>
// 		</PageLayout>
// 	);
// 	} else if (errors) {
// 		return (
// 			<PageLayout>
// 				{renderMetaData()}
// 			<h2>Users</h2>
// 			<h1 />
// 			{errors.map(error => <li key={error.path[0]}>{error.message}</li>)}
// 		</PageLayout>
// 	);
// 	} else {
// 			return (
// 				<PageLayout>
// 					{renderMetaData()}
// 				<h2>Users</h2>
// 				<h1 />
// 				<ListGroup>
// 					<ListGroupItem className="justify-content-between">
// 					<span>Username:</span>
// 			<span>Email:</span>
// 			<span>Is Admin:</span>
// 			</ListGroupItem>
// 			{renderUsers(users)}
// 			</ListGroup>
// 			</PageLayout>
// 		);
// 		}
// 	};
//
// 	UsersView.propTypes = {
// 		loading: PropTypes.bool.isRequired,
// 		users: PropTypes.array,
// 		errors: PropTypes.array
// 	};
//
// 	export default UsersView;
