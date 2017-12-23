# SQL helpers

Files can be found in [src/server/sql](/src/server/sql).

These are functions useful in ETL and reshaping operations
for database -> resolver data shapes.

### orderedFor

In `helpers.js`

```
orderedFor( rows, collection, field, singleObject )
```

__rows__ is the rows returned from the database,
there are multiple rows for each element of the collection.

__collection__ is the set of items you are getting multiple rows for from the database.

__field__ is the object filed in the rows to group the results by
and then associate the elements of the collection.

__singleObject__ is a boolean which determines if each collection 
entry is a single object (1-1 relationship) or not (1-N) relationship.

It returns an array of objects in the first case, and
an array of arrays of objects in the second case.

---

The adapters are a work in progress and 
require some changes to how arguments
to the graphql query are passed around in the server.
The query also has more parameters, though maybe they should
be combined into a single object with subfields
for the different capabilities...?

###  paging

In `paging.js`, adds limit and offset

```
paging(queryBuilder, args)
```

__queryBuilder__ is a knex instance.

__args__ is an object with fields `{limit, offset}`

The function returns the queryBuilder object after checking for and adding
limit and/or offset knex calls.

### cursor

TBD... cursor based paging


### currentOrdering

In `ordering.js`
uses the current code an orderBy argument


### ordering

In `ordering.js`, looks for an array of OrderBy GraphQL type

An orderby object looks like `{column, table, order}`, only column is required.


```
ordering(queryBuilder, args)
```

__queryBuilder__ is a knex instance.

__args__ is an array named `orderBys` containing objects with the fields above.

The function returns the queryBuilder object after checking for
and adding `orderBy` knex calls.

### currentFilter

In `filters.js`
uses the current code and filter argument


### filterBuilder

uses a more advanced filtering input and processing.

See https://github.com/sysgears/apollo-universal-starter-kit/issues/569
