const pool = require('./dbConnection');

exports.getCategories = async () => {
  const select = 'SELECT * FROM EventCategories ORDER BY category';
  const query = {
    text: select,
    values: [],
  };

  const {rows} = await pool.query(query);
  return rows;
};

exports.checkCategoryExists = async (category) => {
  const select = 'SELECT * FROM EventCategories WHERE category = $1';
  const query = {
    text: select,
    values: [category],
  };

  const {rows} = await pool.query(query);
  return (rows.length > 0 ? rows[0] : undefined);
};