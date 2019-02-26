const Ad = require('../models/Ad');

class AdController {
  async index(req, res) {
    // set filters.sold to false to show the active ads
    const filters = { sold: false };

    if (req.query.price_min || req.query.price_max) {
      filters.price = {};

      if (req.query.price_min) {
        filters.price.$gte = req.query.price_min;
      }

      if (req.query.price_max) {
        filters.price.$lte = req.query.price_max;
      }
    }

    if (req.query.title) {
      // case insensitive, anywhere in the title regex
      filters.title = new RegExp(req.query.title, 'i');
    }

    const ads = await Ad.paginate(filters, {
      page: req.query.page || 1,
      limit: 20,
      populate: ['author'],
      sort: '-createdAt',
    });
    console.log(ads, 'Index route');
    return res.json(ads);
  }

  async show(req, res) {
    const ad = await Ad.findById(req.params.id);
    console.log(ad, ' Show route');
    return res.json(ad);
  }

  async store(req, res) {
    // throw new Error();
    const ad = await Ad.create({ ...req.body, author: req.userId });
    console.log(ad, 'Store route');
    return res.json(ad);
  }
  async update(req, res) {
    const ad = await Ad.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    console.log(ad, ' Update route');
    return res.json(ad);
  }

  async destroy(req, res) {
    await Ad.findByIdAndDelete(req.params.id);

    return res.json({ removed: 'Deleted ok' });
  }
}

module.exports = new AdController();
