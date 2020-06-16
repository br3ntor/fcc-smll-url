# URL Shortener V2

Make long URLs short.

Short links can be previewed by appending a /p to the link.

e.g. https://brent-dev.com/z82NzS6Gd/p

### Steps to run after cloning repository:

1. Create sqldatabase and run table creation script

   `mkdir .data`

   `sqlite3 .data/sqlite.db < create.sql`

2. Install packages:

   `npm install`

3. Build static files:

   `npm run build`

4. Start with `npm start` for dev or `npm run prod` to set to https and `NODE_ENV=production`

### About

- Uses SQLite for db.
- Uses Parcel for js polyfills, css prefixes, and minification.
- Works with Internet Explorer, Edge, Firefox, and Chrome.
- Usable on any screen size
