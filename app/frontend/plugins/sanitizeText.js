import sanitizeHtml from 'sanitize-html';

export const sanitizeText = (html) => {
  return sanitizeHtml(html, {
    allowedTags: ["p", "strong", "em", "u",
                  "h1", "h2", "h3", "h4", "h5", "h6",
                  "ol", "ul", "li",
                  "sub", "sup", "span", "br"
                  ],
    allowedAttributes: {
      span: [ "style" ]
    }
  });
};

export const sanitizePreviewText = (html) => {
  return sanitizeHtml(html, {
    allowedTags: ["p",
                  "h1", "h2", "h3", "h4", "h5", "h6",
                  "li"
                  ]
  });
};

export const removeHtml = (html) => {
  return sanitizeHtml(html, {
    allowedTags: []
  });
};
