import * as portal from '/lib/xp/portal';
import * as thymeleaf from '/lib/xp/thymeleaf';
import * as content from '/lib/xp/content';

exports.get = () => {
  const model = {};

  const site = portal.getSite();

  // Get all the country contents (in the current site)
  const result = content.query({
    start: 0,
    count: 100,
    contentTypes: [
      `${app.name}:news-element`,
    ],
    'query': `_path LIKE '/content${site._path}/*'`,
  });

  const { hits } = result;
  const newsElements = [];

  // Loop through the contents and extract the needed data
  for (let i = 0; i < hits.length; i++) {

    const newsElement = {};
    newsElement.name = hits[i].displayName;
    newsElements.push(newsElement);
  }

  // Add the country data to the model
  model.newsElements = newsElements;

  // Specify the view file to use
  const view = resolve('news-list.html');

  // Return the merged view and model in the response object
  return {
    body: thymeleaf.render(view, model),
  }
};
