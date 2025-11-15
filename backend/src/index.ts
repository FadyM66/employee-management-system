import express from 'express';
import cors from 'cors';

const port = parseInt(process.env.PORT!) || 3000;
const app = express();

app.use(
  cors({
    origin: true,
  }),
);

app.use('/test', (req, res) => {
  res.send({ message: "I'm alive!" });
});

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});
