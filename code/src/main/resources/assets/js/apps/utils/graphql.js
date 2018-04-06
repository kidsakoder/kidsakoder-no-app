export default class Graphql {
  constructor(url) {
    const { origin, pathname } = window.location;
    this.url = url
      || `${origin + pathname}/_/service/no.kidsakoder.app/graphql`;
  }

  query(object, callback) {
    let query = object;

    if (typeof query === 'object') {
      if ('contentType' in query && 'query' in query) {
        query = `{
  guillotine {
    query(contentTypes: "no.kidsakoder.app:${query.contentType}") {
      ${query.query}
    }
  }
}`;
      }
    }

    const requst = fetch(this.url, {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query }),
      credentials: 'include',
    })
      .then(result => result.json());

    if (callback) {
      requst.then(callback);
    }

    return requst;
  }
}
