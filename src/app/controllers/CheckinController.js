import { subDays, parseISO } from 'date-fns';
import { Op } from 'sequelize';

import Checkin from '../models/Checkin';

class CheckinController {
  async index(req, res) {
    const checkins = await Checkin.findAll({
      where: { student_id: req.params.studentId },
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const { studentId: student_id } = req.params;

    const datePast = subDays(new Date(), 7);

    const { count } = await Checkin.findAndCountAll({
      where: {
        student_id,
        created_at: {
          [Op.gte]: datePast,
        },
      },
    });

    if (count >= 5) {
      return res
        .status(401)
        .json({ error: 'Student has come five days in the last seven days' });
    }

    const checkin = await Checkin.create({ student_id });

    return res.json(checkin);
  }
}

export default new CheckinController();
