# URL Shortener Project for Free Code Camp

Tried to do a MVC project patter.
Maybe I did? The model is done manually since it's so simple:

```sql
CREATE TABLE links (
 id INTEGER PRIMARY KEY,
 url TEXT NOT NULL UNIQUE,
 url_id TEXT NOT NULL UNIQUE
);

INSERT INTO links (url, url_id)
VALUES (
  'https://www.google.com', '256DP'
);
```

- Uses SQLite for db.
- Uses Parcel to do js polyfills, autoprefixers for css, minification

---

To run

1. Create db table by running script hopefully
2. Run developement with `npm start` and production with `npm run prod`

Todo:

- Currently trying to make the url actually as short as possbile right now
- Take care of some cases where bad input causes a hangup where no response is sent
