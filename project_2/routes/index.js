const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res, next) => {
  res.render('index', { title: 'Home' }); // render 'index.jade' with title: 'Home'
});

module.exports = router;
