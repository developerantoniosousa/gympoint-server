import * as Yup from 'yup';
import { addMonths, parseISO, format } from 'date-fns';
import ptLang from 'date-fns/locale/pt';

import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';

import Mail from '../../lib/Mail';

class RegistrationController {
  async index(req, res) {
    const registrations = await Registration.findAll();

    return res.json(registrations);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const registrationExists = await Registration.findOne({
      where: { student_id },
    });
    if (registrationExists) {
      return res.status(401).json({ error: 'Student already registered' });
    }

    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan not exists' });
    }

    const price = plan.duration * plan.price;
    const end_date = addMonths(parseISO(start_date), plan.duration);

    const registration = await Registration.create({
      ...req.body,
      end_date,
      price,
    });

    const student = await Student.findByPk(student_id);

    Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Seja bem vindo',
      template: 'registration',
      context: {
        student,
        plan,
        date_registration: format(Date.now(), "dd 'de' MMMM", {
          locale: ptLang,
        }),
        start_date: format(parseISO(start_date), "dd 'de' MMMM", {
          locale: ptLang,
        }),
      },
    });

    return res.json(registration);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      plan_id: Yup.number().required(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const registration = await Registration.findByPk(req.params.id);
    if (!registration) {
      return res.status(401).json({ error: 'Registration not exists' });
    }

    const { plan_id, start_date } = req.body;

    const plan = await Plan.findByPk(plan_id);
    if (!plan) {
      return res.status(400).json({ error: 'Plan not exists' });
    }

    if (start_date) {
      registration.start_date = parseISO(start_date);
      registration.end_date = addMonths(parseISO(start_date), plan.duration);
    }

    if (plan_id !== registration.plan_id) {
      registration.plan_id = plan_id;
      registration.price = plan.duration * plan.price;
    }

    await registration.save();

    return res.json(registration);
  }

  async delete(req, res) {
    await Registration.destroy({
      where: { id: req.params.id },
    });

    return res.send();
  }
}

export default new RegistrationController();
