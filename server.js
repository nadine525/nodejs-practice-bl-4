const app = require('./app')
const mongoConnect = require("./db/connection");

const { PORT = 8000 } = process.env;

const startServer = async (dbConnect) => {
  try {
    await dbConnect();
    app.listen(PORT, (error) => {
      if (error) {
        console.log("Connection to server failed");
      }
      console.log(`Server running. Use our API on port: ${PORT}`);
});
  } catch (error) {
    console.log(error);
  }
}
startServer(mongoConnect)

