const db = require('./db');
exports.register = (req, res) => {
  body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', async () => {
    body = JSON.parse(body);
    const { email, password } = body;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
      res.setHeader(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
      );


    try {
      let users = await db.query(`select * from users where email='${email}'`);

      if (users.rowCount !== 0) {
        res.statusCode = 401;
        res.end(
          JSON.stringify({
            authenticated: false,
            error: 'User already exists'
          })
        );
      } else if (email === '' || password === '') {
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            authenticated: false,
            error: 'Input field cannot be empty'
          })
        );
      } else {
        await db.query(
          `insert into users (email,password)
          values ('${email}',crypt('${password}',gen_salt('bf')))`
        );
        res.statusCode = 200;
        res.end(
          JSON.stringify({
            authenticated: true,
            message: 'Registration successful'
          })
        );
      }
    } catch (error) {
      res.statusCode = 400;
      res.end(JSON.stringify({ authenticated: false, error: error.message }));
    }
  });
};
exports.login = (req, res) => {
  body = '';
  req.on('data', chunk => {
    body += chunk;
  });

  req.on('end', async () => {
    body = JSON.parse(body);
    const { email, password } = body;
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept'
    );

    try {
      if (email === '' || password === '') {
        res.statusCode = 400;
        res.end(
          JSON.stringify({
            authenticated: false,
            error: 'Input field cannot be empty'
          })
        );
      }
      let user = await db.query(
        `select * from users where email='${email}' and password=crypt('${password}',password)`
      );

      if (user.rowCount === 0) {
        res.statusCode = 401;
        res.end(
          JSON.stringify({
            authenticated: false,
            error: 'Invalid credentials'
          })
        );
      }
      res.statusCode = 200;
      res.end(
        JSON.stringify({
          authenticated: true,
          user: {
            email
          }
        })
      );
    } catch (error) {
      res.statusCode = 400;
      res.end(JSON.stringify({ authenticated: false, error: error.message }));
    }
  });
};
