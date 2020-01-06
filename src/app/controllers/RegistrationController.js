import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';

import Registration from '../models/Registration';
import Plan from '../models/Plan';
import Student from '../models/Student';

import Queue from '../../lib/Queue';
import RegistrationMail from '../jobs/RegistrationMail';

class RegistrationController {
  async index(req, res) {
    const registrations = await Registration.findAll({
      include: [
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title'],
        },
      ],
    });

    return res.json(registrations);
  }

  async show(req, res) {
    const registration = await Registration.findByPk(req.params.id, {
      include: [
        {
          model: Plan,
          as: 'plan',
          attributes: ['id', 'title'],
        },
        {
          model: Student,
          as: 'student',
          attributes: ['id', 'name'],
        },
      ],
    });

    return res.json(registration);
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

    await Queue.addJob(RegistrationMail.key, {
      student,
      start_date,
      plan,
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

    const { student_id, plan_id, start_date } = req.body;

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

    if (student_id !== registration.student_id) {
      registration.student_id = student_id;
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
