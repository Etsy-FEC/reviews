const mysql = require("mysql");
const { db_password } = require("../config.js");

const db = mysql.createConnection({
  host: "database-1.cuyvfkjn1z4t.us-east-1.rds.amazonaws.com",
  user: "root",
  password: `${db_password}`,
  database: "etsy_reviews",
  charset: "utf8mb4"
});

db.connect();

function getReviewsForListing(listing_id, order, callback) {
  let qryStr = `SELECT 
  b.*, 
  a.reviews_count,
  a.reviews_for_item,
  c.image_url,
  a.listing_id,
  a.title
FROM listings a 
LEFT JOIN feedback b 
  ON a.user_id = b.user_id
LEFT JOIN (SELECT * FROM images WHERE listing_id = '${listing_id}' LIMIT 1) as c
  ON a.listing_id = c.listing_id
WHERE a.listing_id = '${listing_id}'
ORDER BY b.reviewDate ${order}
LIMIT 4
;`;

  db.query(qryStr, (err, data) => {
    err ? callback(err, null) : callback(null, data);
  });
}

function getMoreReviews(listing_id, order, callback) {
  let qryStr = `SELECT 
  b.*, 
  a.reviews_count,
  a.reviews_for_item,
  c.image_url,
  a.listing_id,
  a.title
FROM listings a 
LEFT JOIN feedback b 
  ON a.user_id = b.user_id
LEFT JOIN (SELECT * FROM images WHERE listing_id = '${listing_id}' LIMIT 1) as c
  ON a.listing_id = c.listing_id
WHERE a.listing_id = '${listing_id}'
ORDER BY b.reviewDate ${order}
LIMIT 4, 16;`;

  db.query(qryStr, (err, data) => {
    err ? callback(err, null) : callback(null, data);
  });
}

function getListingPictures(listing_id, callback) {
  let qryStr = `SELECT 
	a.title,
    b.image_url,
    a.user_id
FROM listings a INNER JOIN images b
	ON a.user_id = b.user_id
WHERE a.user_id = (SELECT DISTINCT user_id FROM listings WHERE listing_id = '${listing_id}')
  AND a.listing_id = '${listing_id}'
;`;
  db.query(qryStr, (err, data) => {
    err ? callback(err, null) : callback(null, data);
  });
}

function getReviewsForSeller(listing_id, callback) {
  let qryStr = `SELECT 
  b.*, 
  a.reviews_count,
  a.reviews_for_item,
  c.image_url,
  a.listing_id,
  a.title
FROM listings a 
LEFT JOIN feedback b 
  ON a.user_id = b.user_id
LEFT JOIN (SELECT * FROM images WHERE listing_id = '${listing_id}' LIMIT 1) as c
  ON a.listing_id = c.listing_id
WHERE a.listing_id = '${listing_id}'
ORDER BY b.reviewDate ASC
LIMIT 4
;`;

  db.query(qryStr, (err, data) => {
    err ? callback(err, null) : callback(null, data);
  });
}

module.exports = {
  db,
  getReviewsForListing,
  getMoreReviews,
  getListingPictures,
  getReviewsForSeller
};
