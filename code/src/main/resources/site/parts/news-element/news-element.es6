import * as portal from '/lib/xp/portal';
import * as thymeleaf from '/lib/xp/thymeleaf';
import * as content from '/lib/xp/content';

exports.get = () => {
  const view = resolve('news-element.html');

  const component = portal.getComponent();
  const newsElement = component.config['news-element'];

  const newsElementContent = content.get({ key: newsElement });
  // Her hentes ting ut
  const newsElementName = newsElementContent.displayName;
  const newsElementTags = newsElementContent.data.tags;
  const newsElementCaption = newsElementContent.data.caption;
  const newsElementPreface = newsElementContent.data.preface;
  const newsElementBody = portal.processHtml({
    value: newsElementContent.data.body,
  });

  const model = {
    name: newsElementName,
    tags: newsElementTags,
    caption: newsElementCaption,
    preface: newsElementPreface,
    body: newsElementBody,
  };

  return {
    body: thymeleaf.render(view, model),
  };
};
