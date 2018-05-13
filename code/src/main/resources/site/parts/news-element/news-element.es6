import * as portal from '/lib/xp/portal';
import * as thymeleaf from '/lib/xp/thymeleaf';

exports.get = () => {
  const view = resolve('news-element.html');

  const {
    data: {
      tags,
      caption,
      preface,
      body: bodyStr,
      image: imageId,
      hasCommentSection,
    },
    displayName: title,
  } = portal.getContent();

  const body = portal.processHtml({
    value: bodyStr,
  });

  const image = portal.imageUrl({
    id: imageId,
    scale: 'block(768, 360)',
  });

  const model = {
    title,
    tags,
    caption,
    preface,
    body,
    image,
    hasCommentSection,
  };

  return {
    body: thymeleaf.render(view, model),
  };
};
