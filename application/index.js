const express = require("express");
const cors = require('cors')
const app = express();
const port = 4000;
const faqRouter = require("./routes/faq");
const os = require("os");
var hostname = os.hostname();

app.use(express.json());

app.use(cors({
  origin: '*',
  methods: ['GET','HEAD','PUT','PATCH','POST','DELETE'],
  allowedHeaders: ['Content-type'],
  maxAge: 600
}));

// top-level route
app.get("/", (req, res) => {
  res.json({ message: "ok" });
});

// sub-level route
app.use("/faqs", faqRouter);
/* Error handler middleware */
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  console.error(err.message, err.stack);
  res.status(statusCode).json({ message: err.message });
  return;
});

app.listen(port, () => {
  console.log(`Express Backend App listening at http://${hostname}:${port}`);
});
