const path = require('node:path')
const bodyParser = require('body-parser');
const express = require('express');
const cookieParser = require('cookie-parser')
const crypto = require("node:crypto");
const { jwtVerify} = require("jose");
const pino = require('pino-http')
const httpProxy = require('http-proxy')

const app = express();
const proxy = httpProxy.createProxyServer({
  target: process.env.ASTRO_ENDPOINT.replace('http', 'ws'),
  ws: true
});

var server = require('http').createServer(app);
server.on('upgrade', function (req, socket, head) {
  proxy.ws(req, socket, head);
});


const UNAUTHORIZED = 'You are not authorized to visit this site.'

app.use(cookieParser())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(pino())
app.use(async (req, res, next) => {
  // necessary for iframing
  res.setHeader('X-Frame-Options', 'ALLOWALL')
  res.setHeader('Content-Security-Policy', `frame-ancestors ${process.env.EDITOR_APP_URL}`)
  next()
})

app.use(async (req, res, next) => {
    // auth logic from editor app
    // https://github.com/WilsonLe/payload-oauth2/blob/main/src/auth-strategy.ts
    const token = req.cookies['payload-token'];
    const uauth = () => res.status(403).send({ message: UNAUTHORIZED });
    if (!token) return uauth();

      let jwtUser = null;
      try {
        const secret = crypto
          .createHash("sha256")
          .update(process.env.PAYLOAD_SECRET)
          .digest("hex")
          .slice(0, 32);

        const { payload: verifiedPayload } = await jwtVerify(
          token,
          new TextEncoder().encode(secret),
          { algorithms: ["HS256"] },
        );
        jwtUser = verifiedPayload;
      } catch (e) {
        // Handle token expiration
        if (e.code === "ERR_JWT_EXPIRED" || e.code === "ERR_JWS_SIGNATURE_VERIFICATION_FAILED") {
          console.log(e.code)
          return uauth();
        }
        console.error(e)
        return uauth();
      }
      if (!jwtUser) return uauth();

      // check site access
      if (jwtUser.sites.find(s => s.site?.name === process.env.SITE)) {
        return next()
      } else {
        console.log('wrong site')
        return uauth();
      }
})

app.use(async function(req, res) {
  const data = await fetch(path.join(process.env.ASTRO_ENDPOINT, req.path))
  text = await data.text()
  for (const header of data.headers.entries()) {
      res.setHeader(...header)
  }

  res.send(text);
});

server.listen(process.env.PORT);
