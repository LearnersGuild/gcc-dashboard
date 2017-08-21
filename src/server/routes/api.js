'use strict';
const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const XLSX = require('xlsx');


router.post('/uploads', upload.single('workbook'), (req, res) => {
  let workbook = XLSX.readFile(req.file.path);
  console.log(workbook.SheetNames);


  res.status(201).send({ data: 'Posted!' });
});

module.exports = router;
