const path = require('node:path')
const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser')
const { decodeJwt, createRemoteJWKSet, jwtVerify } = require("jose");

const app = express();

app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(async (req, res, next) => {
    const token = req.cookies['payload-token']
    // TODO: how do we remove this, local cannot do claim verification
    // check for non-expiration, make this better
    let user = {}
    if (!process.env.OAUTH_JWT_SET || (process.env.OAUTH_JWT_SET || '').includes('localhost')) {
        user = decodeJwt(token);
        if (user.email) {
            next()
        } else {
            throw new Error("not logged in");
        }
    } else {
        const JWKS = createRemoteJWKSet(new URL(process.env.OAUTH_JWT_SET || ''))
        const { payload } = await jwtVerify(token, JWKS)
        user = payload;
        if (user.sub) {
            next()
        } else {
            throw new Error("not logged in");
        }
    }

})

app.use(async function(req, res) {
  console.log(req.path)
  const data = await fetch(path.join(process.env.ASTRO_ENDPOINT, req.path))
  text = await data.text()
  res.set(Object.fromEntries(data.headers))
  res.send(text);
});

app.listen(process.env.PORT);
