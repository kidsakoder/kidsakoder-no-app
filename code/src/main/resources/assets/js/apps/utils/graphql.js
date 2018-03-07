export default class Graphql {
    constructor(url) {
        this.url = url || location.origin + location.pathname + '/_/service/no.kidsakoder.app/graphql';
    }

    query(query, callback) {
        let requst = fetch(this.url, {
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
