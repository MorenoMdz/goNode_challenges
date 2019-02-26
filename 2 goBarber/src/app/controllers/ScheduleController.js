const { Appointment, User } = require('../models');
const { Op } = require('sequelize');
const moment = require('moment');

class ScheduleController {
  async index(req, res) {
    // Find all appointments that are set to the same day
    const appointments = await Appointment.findAll({
      // Using the model User with the alias user (?)
      include: [{ model: User, as: 'user' }],
      where: {
        // specify the id based in the user saved into the session
        provider_id: req.session.user.id,
        date: {
          [Op.between]: [
            moment()
              .startOf('day')
              .format(),
            moment()
              .endOf('day')
              .format(),
          ],
        },
      },
    });

    return res.render('schedule/index', { appointments });
  }
}

module.exports = new ScheduleController();
