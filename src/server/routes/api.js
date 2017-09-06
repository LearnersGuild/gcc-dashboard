'use strict';
const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const controllers = require('../../controllers');


router.post('/uploads', upload.single('workbook'), (req, res) => {
  controllers.update_hubspot.readWorkbook(req.file.path);


  res.status(201).send({ data: 'Posted!' });
});

module.exports = router;
