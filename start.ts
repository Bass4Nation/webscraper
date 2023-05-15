// start.ts
import app from './server'; // replace with the path to server.ts

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
