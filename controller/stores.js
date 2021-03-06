const db = require('../db/db');
const asyncHandler = require('../middleware/async');
const ErrorResponse = require('../utils/errorResponse');

// @desc    Get all stores
// @route   GET /api/stores
// @access  Private
exports.getStores = asyncHandler(async (req, res, next) => {
  const stores = await db.select().from('stores');
  res.status(200).json({
    success: true,
    count: stores.length,
    data: stores,
    msg: null
  });
});

// @desc    Get store by id
// @route   GET /api/stores/:storeId
// @access  Private
exports.getStore = asyncHandler(async (req, res, next) => {
  const storeId = req.params.storeId;

  const store = await db.select().from('stores').where('store_id', storeId);

  if (store.length == 0) {
    return next(new ErrorResponse(`NO user with this id of ${storeId}`, 404));
  }

  res.status(200).json({
    success: true,
    count: store.length,
    data: store,
    msg: null
  });
});

// @desc    Create store
// @route   POST /api/stores
// @access  Private
exports.createStore = asyncHandler(async (req, res, next) => {
  const { name, description, logo } = req.body;

  const file = logo[0].thumbUrl ? logo[0].thumbUrl : '';

  const store = await db('stores')
    .insert({
      name: name,
      logo: file,
      description: description
    })
    .catch((err) => {
      return next(err);
    })
    .then((row) => {
      return db.select().from('stores').where({ store_id: row[0] });
    })
    .catch((err) => {
      return next(err);
    });

  res.status(201).json({
    success: true,
    count: store.length,
    data: store[0],
    msg: 'Store has been created'
  });
});

// @desc    Update store
// @route   PUT /api/stores/:storeId
// @access  Private
exports.updateStore = asyncHandler(async (req, res, next) => {
  const storeId = req.params.storeId;

  const { name, description, logo } = req.body;

  const store = await db('stores')
    .where('store_id', storeId)
    .update({ name: name, description: description })
    .catch((err) => {
      return next(err);
    });

  if (store == []) {
    return next(new ErrorResponse(`No store found with id of ${storeId}`, 404));
  }

  res.status(201).json({
    success: true,
    count: store.length,
    data: store[0],
    msg: 'Store has been updated'
  });
});

// @desc    Delete store
// @route   DELETE /api/stores/:storeId
// @access  Private
exports.deleteStore = asyncHandler(async (req, res, next) => {
  const storeId = req.params.storeId;

  const store = await db('stores')
    .where('store_id', storeId)
    .del()
    .catch(function (err) {
      return next(err);
    });

  if (store == []) {
    return next(new ErrorResponse(`No store found with id of ${storeId}`, 404));
  }

  await db('categories').where({ store_id: storeId }).del();

  await db('products').where({ store_id: storeId }).del();

  res.status(201).json({
    success: true,
    count: store.length,
    data: store,
    msg: 'Store has been Deleted'
  });
});
