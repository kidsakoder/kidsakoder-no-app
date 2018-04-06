import * as portal from '/lib/xp/portal';
import * as thymeleaf from '/lib/xp/thymeleaf';
import * as content from '/lib/xp/content';

exports.get = () => {
  const view = resolve('news-list.html');

  const component = portal.getComponent();
  const { config: { title, subtitle } } = component;
  const newsElement = component.config['news-element'];

  const newsElements = [];

  let newsElementContentKeys = newsElement || [];
  if (!(newsElementContentKeys instanceof Array)) {
    newsElementContentKeys = [newsElementContentKeys];
  }

  newsElementContentKeys.forEach(newsElementKey => {
    const newsElementContent = content.get({ key: newsElementKey });
    // Her hentes ting ut
    const newsElementName = newsElementContent.displayName;

    newsElements.push({
      name: newsElementName,
    });
  });

  const model = {
    title: title || 'Add a title',
    subtitle,
    newsElements,
  };

  return {
    body: thymeleaf.render(view, model),
  };
};
