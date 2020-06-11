CREATE TABLE links (
 id INTEGER PRIMARY KEY,
 url TEXT NOT NULL UNIQUE,
 url_id TEXT NOT NULL UNIQUE
);

INSERT INTO links (url, url_id)
VALUES (
  'https://www.google.com', '256DP'
);