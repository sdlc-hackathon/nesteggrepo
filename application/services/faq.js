const db = require('./db');
const helper = require('../helper');
const config = require('../config');

async function get(id){
  const rows = await db.query(
    `SELECT id, question, answer, date_added, last_updated
    FROM faq where id = ${id}`
  );
  const data = helper.emptyOrRows(rows);

  return {
    data
  }
}

async function getMultiple(page = 1){
  const offset = helper.getOffset(page, config.listPerPage);
  const rows = await db.query(
    `SELECT id, question, answer, date_added, last_updated
    FROM faq LIMIT ${offset},${config.rowsPerPage}`
  );
  const data = helper.emptyOrRows(rows);
  const meta = {page};

  return {
    data,
    meta
  }
}

async function create(faq){
  const result = await db.query(
    `INSERT INTO faq 
    (question, answer) 
    VALUES 
    ("${faq.question}", "${faq.answer}")`
  );

  let message = 'Error creating FAQ';

  if (result.affectedRows) {
    message = 'FAQ created successfully';
  }

  return {message};
}

async function update(id, faq){
  const result = await db.query(
    `UPDATE faq 
    SET question="${faq.question}", answer="${faq.answer}"
    WHERE id=${id}` 
  );

  let message = 'Error updating FAQ';

  if (result.affectedRows) {
    message = 'FAQ updated successfully';
  }

  return {message};
}

async function remove(id){
  const result = await db.query(
    `DELETE FROM faq WHERE id=${id}`
  );

  let message = 'Error deleting FAQ';

  if (result.affectedRows) {
    message = 'FAQ deleted successfully';
  }

  return {message};
}

module.exports = {
  get,
  getMultiple,
  create,
  update,
  remove
}
