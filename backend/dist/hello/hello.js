module.exports.handler = async (event) => {
  const responseMessage = "Hello, World!" + "\n";

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
