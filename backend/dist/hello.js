const { v4 } = require("uuid");

module.exports.handler = async (event) => {
  console.log("Event: ", event);
  const id = v4();
  const responseMessage = "Hello, World!\nid: " + id + "\n";

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
