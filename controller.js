// I'll add the db funtions here then try to seperate out to model maybe if I can
const dns = require('dns');
const sqlite3 = require('sqlite3').verbose();
const shortid = require('shortid');

const dbFile = './.data/sqlite.db';
const db = new sqlite3.Database(dbFile);
const protocol = process.argv[2] || 'http';
const port = protocol === 'http' ? ':3000' : '';

module.exports = {
  redirect: (req, res, next) => {
    if (shortid.isValid(req.params.id)) {
      db.get(
        'SELECT * FROM links WHERE url_id = ?',
        req.params.id,
        (err, row) => {
          if (err) {
            throw err;
          }
          if (row) {
            res.redirect(row.url);
          }
          if (row === undefined) {
            res.send('Not in db.');
          }
        }
      );
    } else {
      next();
    }
  },

  preview: (req, res, next) => {
    if (shortid.isValid(req.params.id)) {
      db.get(
        'SELECT * FROM links WHERE url_id = ?',
        req.params.id,
        (err, row) => {
          if (err) {
            throw err;
          }
          if (row) {
            res.render('preview', {
              original_url: row.url,
              short_url: `${protocol}://${req.hostname}${port}/${row.url_id}`,
            });
          }
          if (row === undefined) {
            res.send('Not in db.');
          }
        }
      );
    } else {
      next();
    }
  },

  makeShortURL: (req, res) => {
    const url = new URL(req.body.url || req.body.urlnojs);
    const shortURL = `${protocol}://${req.hostname}${port}/`;

    if (url.host === req.hostname || url.origin === 'null') {
      res.send('Not gonna happen.');
      return;
    }

    // Checking if url is valid
    dns.lookup(url.host, (err, address, family) => {
      if (err) {
        console.log(err);
        res.json({ error: "It's down or doesn't exist, or invalid URL" });
      } else {
        // Prob not good to log here in production
        // console.log(`address: ${address} family: IPv${family}s`);
        db.serialize(() => {
          db.get('SELECT * FROM links WHERE url = ?', url.href, (err, row) => {
            if (err) {
              console.log(err);
            } else if (row) {
              if (req.body.urlnojs) {
                res.render('preview', {
                  original_url: url.href,
                  short_url: shortURL + row.url_id,
                });
              } else {
                res.json({
                  original_url: url.href,
                  short_url: shortURL + row.url_id,
                });
              }
            } else {
              const randomId = shortid.generate();
              db.run(
                'INSERT INTO links (url, url_id) VALUES (?, ?)',
                [url.href, randomId],
                err => {
                  if (err) {
                    throw err;
                  }
                  if (req.body.urlnojs) {
                    res.render('preview', {
                      original_url: url.href,
                      short_url: shortURL + randomId,
                    });
                  } else {
                    res.json({
                      original_url: url.href,
                      short_url: shortURL + randomId,
                    });
                  }
                }
              );
            }
          });
        });
      }
    });
  },
};
