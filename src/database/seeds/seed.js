const initialAmount = 5;

export function seed(knex, Promise) { // eslint-disable-line import/prefer-default-export
  return Promise.all([
    knex('count').truncate(),
    knex('post').truncate(),
    knex('comment').truncate(),
  ])
    .then(() => {
      return Promise.all(
        knex('count').insert({ amount: initialAmount })
      ).then(() => {

        let posts = [];

        for (let ii = 0; ii < 20; ++ii) {
          posts.push(knex('post').insert({
            title: `Post title ${ii + 1}`,
            content: `Post content ${ii + 1}`
          }).then((post) => {

            let comments = [];

            for (let jj = 0; jj < 2; ++jj) {
              comments.push(knex('comment').insert({
                post_id: post[ 0 ],
                content: `Comment title ${jj + 1} for post ${post[ 0 ]}`
              }));
            }

            return Promise.all(comments);
          }));
        }

        return Promise.all(posts);
      });
    });
}
