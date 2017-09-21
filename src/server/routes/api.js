'use strict'
const fs = require('fs')
const express = require('express')
const multer = require('multer')
const controllers = require('../../controllers')

const router = express.Router()
const upload = multer({dest: 'uploads/'})

router.post('/uploads', upload.single('workbook'), (req, res) => {
  controllers.updateHubspot.readWorkbook(req.file.path, error => {
    if (error) {
      console.log('uploads router error')
      res.status(501).json(error.response.data)
    } else {
      res.status(201).send({data: 'Posted!'})
    }
  })
})

router.get('/reports', (req, res) => {
  controllers.createLearnerDataFile.file(req.query, data => {
    res.status(201).send(data)
  })
})

module.exports = router
