const express = require('express');
const cors = require('cors');
const multer = require('multer');
const storage = multer.memoryStorage();
const upload = multer({ storage });

const app = express();

app.use(cors());

const delay = async (ms) => new Promise((resolve) => setTimeout(() => resolve(), ms));

app.post('/single', upload.single('document'), async (req, res, next) => {
  if (req.body.simulateDelay) {
    await delay(+req.body.simulateDelay);
  }
  res.json({
    success: true,
    fileCount: 1,
    fileSize: req.file && req.file.size,
    originalname: req.file && req.file.originalname,
  });
});

app.post('/multiple', upload.array('documents', 20), async (req, res, next) => {
  if (req.body.simulateDelay) {
    await delay(+req.body.simulateDelay);
  }
  res.json({
    success: true,
    fileCount: req.files.length,
    fileInfo: (req.files ?? []).map((file) => ({
      size: file.size,
      originalname: file.originalname,
    })),
  });
});

app.get('/demo.html', (_, res) => {
  const markup = `<body><form action="/single" method="post" enctype="multipart/form-data">
  <div><label for="single_document">Single Document</label></div>
  <input type="file" name="document" id="single_document" />
  <input type="number" name="simulateDelay" />
  <div><input type="submit" /></div>
</form>

<form action="/multiple" method="post" enctype="multipart/form-data">
  <div><label for="multiple_documents">Multiple Documents</label></div>
  <input type="file" name="documents" id="multiple_documents" multiple />
  <input type="number" name="simulateDelay" />
  <div><input type="submit" /></div>
</form></body>`;
  res.end(markup);
})

const listener = app.listen(process.env.PORT ?? 3000, () => {
  const port = listener.address().port;
  console.log(`uptest started successfully. listening on ${port}`);
});
