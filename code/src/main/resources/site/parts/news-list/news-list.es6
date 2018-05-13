import * as portal from '/lib/xp/portal';
import * as thymeleaf from '/lib/xp/thymeleaf';
import * as content from '/lib/xp/content';

exports.get = () => {
  const view = resolve('news-list.html');
  const site = portal.getSite();

  const component = portal.getComponent();
  const {
    config: {
      title,
      subtitle,
      articleListOptions = {},
    },
  } = component;

  const {
    _selected = '',
    newsElementsChecked = {},
    showLatest = {},
  } = articleListOptions;

  const { newsElements = [] } = newsElementsChecked;
  const { newsCount = 100 } = showLatest;

  const newsElementList = [];

  const isPublished = (publish) => {
    let published = false;

    if ('from' in publish) {
      if (new Date() > new Date(publish.from)) {
        published = true;
      }
    }

    if ('to' in publish) {
      if (new Date() < new Date(publish.to)) {
        published = true;
      }
    }

    return published;
  }

  if (_selected === 'newsElementsChecked') {
    let newsElementContentKeys = newsElements || [];
    if (!(newsElementContentKeys instanceof Array)) {
      newsElementContentKeys = [newsElementContentKeys];
    }

    newsElementContentKeys.forEach(newsElementKey => {
      const {
        displayName,
        _id,
        _path,
        publish,
      } = content.get({ key: newsElementKey });

      if (isPublished(publish)) {
        newsElementList.push({ displayName, _id, _path });
      }
    });
  } else {
    // Get all the country contents (in the current site)
    const result = content.query({
      start: 0,
      count: newsCount,
      contentTypes: [`${app.name}:news-element`],
      query: `_path LIKE '/content${site._path}/*'`,
    });

    const { hits } = result;

    // Loop through the contents and extract the needed data
    for (let i = 0; i < hits.length; i++) {
      const { displayName, _id, _path, publish } = hits[i];
      if (isPublished(publish)) {
        newsElementList.push({ displayName, _id, _path });
      }
    }
  }

  const model = {
    title: title || 'Siste nyheter',
    subtitle,
    newsElementList,
  };

  return {
    body: thymeleaf.render(view, model),
  };
};
