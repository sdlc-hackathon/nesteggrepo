const express = require('express');
const router = express.Router();
const faqs = require('../services/faq');

// sub-routes for /faq/

/* GET single faq */
router.get('/:id', async function(req, res, next) {
  try {
    res.json(await faqs.get(req.params.id));
  } catch (err) {
    console.error(`Error while fetching FAQ`, err.message);
    next(err);
  }
});

/* GET FAQs. */
router.get('/', async function(req, res, next) {
  try {
    let response = await faqs.getMultiple(req.query.page)
    console.log(response)
    res.json(response);
  } catch (err) {
    console.error(`Error while fetching FAQS`, err.message);
    next(err);
  }
});

/* POST FAQ */
router.post('/', async function(req, res, next) {
  try {
    res.json(await faqs.create(req.body));
  } catch (err) {
    console.error(`Error while creating FAQ`, err.message);
    next(err);
  }
});

/* PUT FAQ */
router.put('/:id', async function(req, res, next) {
  try {
    res.json(await faqs.update(req.params.id, req.body));
  } catch (err) {
    console.error(`Error while updating FAQ`, err.message);
    next(err);
  }
});

/* DELETE FAQ */
router.delete('/:id', async function(req, res, next) {
  try {
    res.json(await faqs.remove(req.params.id));
  } catch (err) {
    console.error(`Error while deleting FAQ`, err.message);
    next(err);
  }
});

module.exports = router;
