export default function paging(queryBuilder, args) {
  const { offset, limit, page } = args;

  if (page) {
    queryBuilder.offset((page - 1) * limit);
  } else if (offset) {
    queryBuilder.offset(offset);
  }

  if (limit) {
    queryBuilder.limit(limit);
  }

  return queryBuilder;
}
