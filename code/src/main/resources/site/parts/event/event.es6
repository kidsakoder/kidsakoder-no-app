import * as portal from '/lib/xp/portal';
import * as thymeleaf from '/lib/xp/thymeleaf';

exports.get = () => {
  const view = resolve('event.html');

  const content = portal.getContent();

  const title = content.displayName;
  const { data: { tags, caption } } = content;
  const body = portal.processHtml({
    value: content.data.body,
  });
  const image = portal.imageUrl({
    id: content.data.image,
    scale: 'block(768, 360)',
  });

  const model = {
    title,
    tags,
    caption,
    body,
    image,
  };

  return {
    body: thymeleaf.render(view, model),
  };
};
