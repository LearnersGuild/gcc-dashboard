'use strict';
const express = require('express');
const router = express.Router();
const fs = require('fs');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const controllers = require('../../controllers');


router.post('/uploads', upload.single('workbook'), (req, res) => {
  controllers.update_hubspot.readWorkbook(req.file.path, (error, response) => {
    if (error) {
      console.log('uploads router error');
      res.status(501).json(error.response.data);
      
    } else {
      res.status(201).send({data: 'Posted!'})
    }
  });
});

router.get('/reports', (req, res) => {
  controllers.createLearnerDataFile.file(req.query, data => {
      res.status(201).send(data);
    }
  );
});

module.exports = router;
