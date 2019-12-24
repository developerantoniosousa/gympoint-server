import * as Yup from 'yup';

import HelpOrder from '../models/HelpOrder';
import Student from '../models/Student';

import Queue from '../../lib/Queue';
import HelpOrderMail from '../jobs/HelpOrderMail';

class SupportHelpOrderController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const helpOrders = await HelpOrder.findAll({
      where: { answer_at: null },
      order: [['created_at', 'DESC']],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(helpOrders);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { id: questionId } = req.params;

    const question = await HelpOrder.findByPk(questionId, {
      include: [
        { model: Student, as: 'student', attributes: ['id', 'name', 'email'] },
      ],
    });

    if (!question) {
      return res.status(400).json({ error: 'Question not exists.' });
    }

    const { answer } = req.body;

    const helpOrder = await question.update({ answer, answer_at: Date.now() });

    await Queue.addJob(HelpOrderMail.key, {
      helpOrder,
    });

    return res.json(helpOrder);
  }
}

export default new SupportHelpOrderController();
