const Ad = require('../models/Ad');
const User = require('../models/User');
const Purchase = require('../models/Purchase');
const PurchaseMail = require('../jobs/PurchaseMail');
const Queue = require('../services/Queue');

class PurchaseController {
  async store(req, res) {
    const { ad, content } = req.body;

    // check if that ad exists
    const purchasedAd = await Ad.findById(ad).populate('author');
    const user = await User.findById(req.userId);

    Queue.create(PurchaseMail.key, {
      ad: purchasedAd,
      user,
      content,
    }).save();

    console.log(purchasedAd);

    // ad, purchaseBy
    const purchaseOffer = await Purchase.create({
      ad: purchasedAd._id,
      user: req.userId,
    });
    console.log(purchaseOffer, 'Purchased route');

    return res.json({ purchase_sent: 'Solicitacao enviada ok' });
    // return res.send();
  }

  async acceptOrder(req, res) {
    // !todo change Purchase.active to false,
    // change Ad.purchasedBy to user.id
    // change Ad.sold to true

    // const finishedPurchase = await Purchase.findOneAndUpdate(
    //   { ad: req.params.id }, // the ad id
    //   { active: false },
    //   {
    //     new: true,
    //   }
    // );

    // needs to pass the ad id in the body but call the purchase id in the route
    const finishedAd = await Ad.findByIdAndUpdate(
      req.body.id, // the ad id
      { purchasedBy: req.userId, sold: true },
      {
        new: true,
      }
    );

    return res.json({ purchase_completed: 'Solicitacao enviada ok' });
  }
}

module.exports = new PurchaseController();
