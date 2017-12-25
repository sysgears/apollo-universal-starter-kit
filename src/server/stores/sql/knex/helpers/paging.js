export default function paging(queryBuilder, args) {
  const { offset, limit } = args;

  if (offset) {
    queryBuilder.offset(offset);
  }

  if (limit) {
    queryBuilder.limit(limit);
  }

  return queryBuilder;
}
