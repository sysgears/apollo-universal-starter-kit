export default function counting(queryBuilder, args) {
  const { count } = args;

  if (count.field) {
    queryBuilder.count(count.field);
  }

  return queryBuilder;
}
