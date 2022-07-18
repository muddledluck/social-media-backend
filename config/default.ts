export default {
  PORT: null,
  saltWorkFactor: 10,
  accessTokenTTL: "15m",
  refreshTokenTTL: "1y",
  publicKey: `-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHZr2HT+pPs569o1GAjN4Ezc7oVH
aNPO5gklz9f28FejWFi1nZKdkZhgNlrAfpBIjFHSzE25Kvh3MJTJN8Nbx40I9iiW
R71P9e5kvNKJH7334ewPUV4+gPPZf3NCThxslWrap+UoZAKfK18amwABs5bV470h
TGXjju3VcsqPy7l/AgMBAAE=
-----END PUBLIC KEY-----`,
  privateKey: ``,
  emailVerificationTokenExpiry: 900000, // 15 minutes in milliseconds
  db: {
    uri: "mongodb://localhost:27017/?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false",
  },
};
