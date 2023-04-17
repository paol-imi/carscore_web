// const { v4 } = require("uuid");

module.exports.handler = async (event) => {
  const responseMessage = "Hello, World!";

  return {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      message: responseMessage,
    }),
  };
};
