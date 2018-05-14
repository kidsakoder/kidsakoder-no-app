import * as portal from '/lib/xp/portal';
import * as thymeleaf from '/lib/xp/thymeleaf';

exports.get = () => {
  const view = resolve('event.html');

  const content = portal.getContent();

  const {
    displayName: title,
    data: {
      tags,
      caption,
      body: bodyStr,
      image: imageStr,
      contactInfo,
    },
  } = content;

  const body = portal.processHtml({
    value: bodyStr,
  });

  const image = portal.imageUrl({
    id: imageStr,
    scale: 'block(768, 360)',
  });

  const model = {
    title,
    tags,
    caption,
    body,
    image,
    contactInfo,
  };

  return {
    body: thymeleaf.render(view, model),
  };
};
