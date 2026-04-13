const OpportunityCatalog = require('../models/OpportunityCatalog');
const { seedCatalog } = require('../services/opportunityFetcher');

// @desc  Get full opportunity catalog (public — no auth needed)
// @route GET /api/catalog
const getCatalog = async (req, res) => {
  try {
    const { type, category } = req.query;
    const filter = {};
    if (type)     filter.type     = type;
    if (category) filter.category = category;

    const items = await OpportunityCatalog.find(filter).sort({ createdAt: -1 });
    res.json({ success: true, count: items.length, catalog: items });
  } catch (err) {
    console.error('[Catalog] GET error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

// @desc  Trigger a re-seed of the catalog (admin only)
// @route POST /api/catalog/refresh
const refreshCatalog = async (req, res) => {
  try {
    await seedCatalog();
    const count = await OpportunityCatalog.countDocuments();
    res.json({ success: true, message: 'Catalog refreshed', total: count });
  } catch (err) {
    console.error('[Catalog] Refresh error:', err.message);
    res.status(500).json({ success: false, message: err.message });
  }
};

module.exports = { getCatalog, refreshCatalog };
