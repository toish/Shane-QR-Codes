const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

module.exports = (app, pool) => {
  app.post('/login', async (req, res) => {
    if (!req.body.password) {
      res.status(400).json({ message: 'no password' });
      return 0;
    }
    if (!req.body.username) {
      res.status(400).json({ message: 'no username' });
      return 0;
    }
    try {
      await pool.query(
        `
          SELECT "id", "username", "password" FROM "users"
          WHERE ("username" = $1)
        `, [
          req.body.username
        ]
      ).then((response) => {
        if (response.rows.length < 1) throw { detail: 'password wrong' };
        else return response;
      }).then(async ({ rows }) => {
        bcrypt.compare(req.body.password, rows[0].password, function (err, validPassword) {
          if (err) throw err;
          if (validPassword) {
            const token = jwt.sign({ id: rows[0].id, username: rows[0].username }, 'ailurus');
            res.json({ token });
          }
        });
      });
    } catch (e) {
      console.error(e);
      res.status(500).json({ message: (
        e.detail || 'Something wen\'t horribly wrong.'
       ) })
    }
  })
}