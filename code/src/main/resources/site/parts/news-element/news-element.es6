import * as portal from '/lib/xp/portal';
import * as thymeleaf from '/lib/xp/thymeleaf';

exports.get = () => {
  const view = resolve('news-element.html');

  const content = portal.getContent();

  const name = content.displayName;
  const { data: { tags, caption, preface } } = content;
  const body = portal.processHtml({
    value: content.data.body,
  });
  const image = portal.imageUrl({
    id: content.data.image,
    scale: 'block(250, 250)',
  });

  const model = {
    name,
    tags,
    caption,
    preface,
    body,
    image,
  };

  return {
    body: thymeleaf.render(view, model),
  };
};
