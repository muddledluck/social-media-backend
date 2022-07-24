export default {
  saltWorkFactor: 10,
  accessTokenTTL: "15m",
  refreshTokenTTL: "1y",
  publicKey: `-----BEGIN PUBLIC KEY-----
MIGeMA0GCSqGSIb3DQEBAQUAA4GMADCBiAKBgHqfIupxnGUE1wRanOUsaQbagZuh
zpSweN64WAzcqe40SSgBIygAhApJW9fHOf6ljtEa/FP3rWA4JeF0KArkoM8oqEf4
ozCJ1mBN0He9pJ3DwljPb1o/IjdYSyh439YxiR6nUU1W4VBcrmsURxQ0jfm3AnIZ
ZLgD73Fy51XqhEJbAgMBAAE=
-----END PUBLIC KEY-----`,
  privateKey: ``,
  emailVerificationTokenExpiry: 900000, // 15 minutes in milliseconds
  db: {
    uri: "mongodb://localhost:27017/e-com?readPreference=primary&appname=MongoDB%20Compass&directConnection=true&ssl=false",
  },
};
