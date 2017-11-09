import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs/Subscription';

import CounterService from '../containers/Counter';
import { CounterIncrement } from '../reducers/index';

@Component({
  selector: 'counter-view',
  template: `
    <div *ngIf="loading" class="text-center">Loading...</div>
    <div *ngIf="!loading" id="content" class="container">
      <div class="text-center mt-4 mb-4">
        <section>
          <p>Current counter, is {{counter.amount}}. This is being stored server-side in the database and using Apollo subscription for real-time updates.</p>
          <label id="graphql-button" class="btn-primary" (click)="addCount()" ngbButtonLabel>Click to increase counter</label>
        </section>
        <section>
          <p>Current reduxCount, is {{reduxCount}}. This is being stored client-side with Redux.</p>
          <label id="redux-button" class="btn-primary" (click)="onReduxIncrement()" ngbButtonLabel>Click to increase reduxCount</label>
        </section>
      </div>
    </div>`,
  styles: ['section { margin-bottom: 30px; }'],
  providers: [CounterService]
})
export default class CounterView implements OnInit, OnDestroy {
  public loading: boolean = true;
  public counter: any;
  public reduxCount: number;
  private subsOnUpdate: Subscription;
  private subsOnLoad: Subscription;
  private subsOnAdd: Subscription;
  private subsOnStore: Subscription;

  constructor(private counterService: CounterService, private store: Store<any>, private ngZone: NgZone) {}

  public ngOnInit(): void {
    this.subsOnUpdate = this.counterService.subscribeToCount().subscribe(({ counterUpdated }: any) => {
      this.ngZone.run(() => {
        this.counter = counterUpdated;
      });
    });

    this.subsOnLoad = this.counterService.getCounter().subscribe(({ data: { counter }, loading }: any) => {
      this.ngZone.run(() => {
        this.counter = counter;
        this.loading = loading || false;
      });
    });

    this.subsOnStore = this.store.select('counter').subscribe(({ reduxCount }: any) => {
      this.reduxCount = reduxCount;
    });
  }

  public ngOnDestroy(): void {
    this.unsubscribe(this.subsOnUpdate, this.subsOnLoad, this.subsOnAdd, this.subsOnStore);
  }

  public addCount() {
    if (this.subsOnAdd) {
      this.subsOnAdd.unsubscribe();
    }
    this.subsOnAdd = this.counterService.addCounter(1, this.counter.amount).subscribe();
  }

  public onReduxIncrement() {
    this.store.dispatch(new CounterIncrement());
  }

  private unsubscribe = (...subscriptions: Subscription[]) => {
    subscriptions.forEach((subscription: Subscription) => {
      if (subscription) {
        subscription.unsubscribe();
      }
    });
  };
}

// import React from "react";
// import PropTypes from "prop-types";
// import Helmet from "react-helmet";
// import { Button } from "reactstrap";
// import styled from "styled-components";
// import PageLayout from "../../../app/PageLayout";
//
// const Section = styled.section`margin-bottom: 30px;`;
//
// const CounterView = ({
//   loading,
//   count,
//   addCount,
//   reduxCount,
//   onReduxIncrement
// }) => {
//   const renderMetaData = () => (
//     <Helmet
//       title="Apollo Starter Kit - Counter"
//       meta={[
//         {
//           name: "description",
//           content: "Apollo Fullstack Starter Kit - Counter example page"
//         }
//       ]}
//     />
//   );
//
//   if (loading) {
//     return (
//       <PageLayout>
//         {renderMetaData()}
//         <div className="text-center">Loading...</div>
//       </PageLayout>
//     );
//   } else {
//     return (
//       <PageLayout>
//         {renderMetaData()}
//         <div className="text-center mt-4 mb-4">
//           <Section>
//             <p>
//               Current count, is {count.amount}. This is being stored server-side
//               in the database and using Apollo subscription for real-time
//               updates.
//             </p>
//             <Button id="graphql-button" color="primary" onClick={addCount(1)}>
//               Click to increase count
//             </Button>
//           </Section>
//           <Section>
//             <p>
//               Current reduxCount, is {reduxCount}. This is being stored
//               client-side with Redux.
//             </p>
//             <Button
//               id="redux-button"
//               color="primary"
//               onClick={onReduxIncrement(1)}
//             >
//               Click to increase reduxCount
//             </Button>
//           </Section>
//         </div>
//       </PageLayout>
//     );
//   }
// };
//
// CounterView.propTypes = {
//   loading: PropTypes.bool.isRequired,
//   count: PropTypes.object,
//   addCount: PropTypes.func.isRequired,
//   reduxCount: PropTypes.number.isRequired,
//   onReduxIncrement: PropTypes.func.isRequired
// };
//
// export default CounterView;
