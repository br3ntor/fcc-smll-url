// I'll add the db funtions here then try to seperate out to model maybe if I can
const dns = require('dns');
const sqlite3 = require('sqlite3').verbose();
const dbFile = './.data/sqlite.db';
const db = new sqlite3.Database(dbFile);

// Could change to es6 export if I wanted I guess
module.exports = {
  // Gota do routers first
  redirect: (req, res) => {
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
      }
    );
  },

  preview: (req, res) => {
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
            short_url: `${req.protocol}://${req.headers.host}/api/shorturl/${
              row.url_id
            }`
          });
        }
      }
    );
  },

  makeShortURL: (req, res) => {
    const url = new URL(req.body.url || req.body.urlnojs);
    const shortURL = `${req.protocol}://${req.headers.host}/api/shorturl/`;


    if (url.host === req.headers.host || url.origin === 'null') {
      res.send('Not gonna happen.');
      return;
    }

    dns.lookup(url.host, (err, address, family) => {
      if (err) {
        console.log(err);
        res.json({ error: "It's down or doesn't exist, or invalid URL" });
      } else {
        console.log(`address: ${address} family: IPv${family}s`);
        db.serialize(() => {
          db.get('SELECT * FROM links WHERE url = ?', url.href, (err, row) => {
            if (err) {
              console.log(err);
            } else if (row) {
              if (req.body.urlnojs) {
                res.render('preview', {
                  original_url: url.href,
                  short_url: shortURL + row.url_id
                });
              } else {
                res.json({
                  original_url: url.href,
                  short_url: shortURL + row.url_id
                });
              }
            } else {
              const randomId = makeLinkId();
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
                      short_url:
                        shortURL + randomId
                    });
                  } else {
                    res.json({
                      original_url: url.href,
                      short_url:
                        shortURL + randomId
                    });
                  }
                }
              );
            }
          });
        });
      }
    });
  }
};

// My little helpers
function makeLinkId() {
  const possible = [
    'A',
    'B',
    'C',
    'D',
    'E',
    'F',
    'G',
    'H',
    'I',
    'J',
    'K',
    'L',
    'M',
    'N',
    'O',
    'P',
    'Q',
    'R',
    'S',
    'T',
    'U',
    'V',
    'W',
    'X',
    'Y',
    'Z',
    'a',
    'b',
    'c',
    'd',
    'e',
    'f',
    'g',
    'h',
    'i',
    'j',
    'k',
    'l',
    'm',
    'n',
    'o',
    'p',
    'q',
    'r',
    's',
    't',
    'u',
    'v',
    'w',
    'x',
    'y',
    'z',
    '0',
    '1',
    '2',
    '3',
    '4',
    '5',
    '6',
    '7',
    '8',
    '9'
  ];
  let randomString = [];

  for (let i = 0; i < 5; i++) {
    let random = Math.floor(Math.random() * possible.length);
    randomString.push(possible[random]);
  }

  return randomString.join('');
}
