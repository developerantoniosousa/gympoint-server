import * as Yup from 'yup';

import Plan from '../models/Plan';

const schema = Yup.object().shape({
  title: Yup.string().required(),
  duration: Yup.number().required(),
  price: Yup.number().required(),
});

class PlanController {
  async index(req, res) {
    const plans = await Plan.findAll();

    return res.json(plans);
  }

  async store(req, res) {
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const plan = await Plan.create(req.body);

    return res.json(plan);
  }

  async update(req, res) {
    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan not exists.' });
    }

    const data = await plan.update(req.body);

    return res.json(data);
  }

  async delete(req, res) {
    await Plan.destroy({ where: { id: req.params.id } });

    return res.send();
  }
}

export default new PlanController();
