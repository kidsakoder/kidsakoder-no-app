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
      checkOptionSet: {
        _selected = 'showLatest',
        newsElementsChecked: {
          newsElements = [],
        },
        showLatest: {
          newsCount = 100,
        },
      },
    },
  } = component;

  const newsElementList = [];

  if (_selected === 'showLatest') {

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
      const newsElement = {};
      newsElement.name = hits[i].displayName;
      newsElementList.push(newsElement);
    }
  } else if (_selected === 'newsElementsChecked') {
    let newsElementContentKeys = newsElements || [];
    if (!(newsElementContentKeys instanceof Array)) {
      newsElementContentKeys = [newsElementContentKeys];
    }

    newsElementContentKeys.forEach(newsElementKey => {
      const { displayName, _id, _path } = content.get({ key: newsElementKey });
      newsElementList.push({ displayName, _id, _path });
    });
  }

  const model = {
    title: title || 'Add a title',
    subtitle,
    newsElementList,
    len: JSON.stringify(component.config),
  };

  return {
    body: thymeleaf.render(view, model),
  };
};
