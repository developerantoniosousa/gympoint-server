import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';

class HelpOrderController {
  async index(req, res) {
    const { studentId: student_id } = req.params;

    const helpOrders = await HelpOrder.findAll({
      where: { student_id },
      order: [['created_at', 'DESC']],
    });

    return res.json(helpOrders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { studentId: student_id } = req.params;

    const helpOrder = await HelpOrder.create({ ...req.body, student_id });

    return res.json(helpOrder);
  }
}

export default new HelpOrderController();
