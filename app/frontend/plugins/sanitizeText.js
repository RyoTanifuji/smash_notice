import sanitizeHtml from 'sanitize-html';

const sanitizeText = (html) => {
  return sanitizeHtml(html, {
    allowedTags: ["p", "strong", "em", "u",
                  "h1", "h2", "h3", "h4", "h5", "h6",
                  "ol", "ul", "li",
                  "sub", "sup", "span"
                  ],
    allowedAttributes: {
      span: [ "style" ]
    }
  });
};

export default sanitizeText;