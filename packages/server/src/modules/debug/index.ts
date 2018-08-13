import now from 'performance-now';
import settings from '../../../../../settings';

import knex from '../../sql/connector';
import log from '../../../../common/log';

// The map used to store the query times, where the query unique
// identifier is the key.
const times = {};
// Used for keeping track of the order queries are executed.
let count = 0;

const printQueryWithTime = uid => {
  const { startTime, endTime, query } = times[uid];
  const elapsedTime = endTime - startTime;

  // I print the sql generated for a given query, as well as
  // the bindings for the queries.
  log.info(query.sql, ',', `[${query.bindings ? query.bindings.join(',') : ''}]`);
  log.info(`Time: ${elapsedTime.toFixed(3)} ms\n`);

  // After I print out the query, I have no more use to it,
  // so I delete it from my map so it doesn't grow out of control.
  delete times[uid];
};

const printIfPossible = uid => {
  const { position } = times[uid];

  // Look of a query with a position one less than the current query
  const previousTimeUid = Object.keys(times).find(key => times[key].position === position - 1);

  // If we didn't find it, it must have been printed already and we can safely print ourselves.
  if (!previousTimeUid) {
    printQueryWithTime(uid);
  }
};

const printQueriesAfterGivenPosition = position => {
  // Look for the next query in the queue
  const nextTimeUid = Object.keys(times).find(key => times[key].position === position + 1);

  // If we find one and it is marked as finished, we can go ahead and print it
  if (nextTimeUid && times[nextTimeUid].finished) {
    const nextPosition = times[nextTimeUid].position;
    printQueryWithTime(nextTimeUid);

    // There might be more queries that need to printed, so we should keep looking...
    printQueriesAfterGivenPosition(nextPosition);
  }
};

if (__DEV__ && settings.app.logging.debugSQL) {
  knex
    .on('query', query => {
      const uid = query.__knexQueryUid;
      times[uid] = {
        position: count,
        query,
        startTime: now(),
        // I keep track of when a query is finished with a boolean instead of
        // presence of an end time. It makes the logic easier to read.
        finished: false
      };
      count = count + 1;
    })
    .on('query-response', (response, query) => {
      const uid = query.__knexQueryUid;
      times[uid].endTime = now();
      times[uid].finished = true;
      const position = times[uid].position;

      // Print the current query, if I'm able
      printIfPossible(uid);

      // Check to see if queries further down the queue can be executed,
      //in case they weren't able to be printed when they first responded.
      printQueriesAfterGivenPosition(position);
    });
}
