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
- Uses Parcel to do a few things

