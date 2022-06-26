const jwt = require('jsonwebtoken');

exports.handler = async function (event, context) {
  const payload = {
    "https://hasura.io/jwt/claims": {
      "x-hasura-default-role": "user",
      "x-hasura-allowed-roles": [
        "user"
      ],
      "x-hasura-user-id": "77897153-89a1-40f8-82d8-8d12a1205bd9"
    },
    "sub": "1234567890",
    "name": "John Doe",
    "exp": Math.trunc(Date.now()/1000) + 10,
    "iat": Math.trunc(Date.now()/1000)
  }
  const key = 'hjkhsdkjdhfksdfjaskasjdjfhaskdfjaskdfasdfasdfasdf';
  const token = jwt.sign(payload, key, { algorithm: 'HS256' });
  console.log(token);
    return {
      statusCode: 200,
      body: JSON.stringify({ payload,token})
    };
  }
  