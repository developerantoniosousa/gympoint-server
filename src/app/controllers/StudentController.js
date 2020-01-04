import * as Yup from 'yup';
import { Op } from 'sequelize';

import Student from '../models/Student';

const studentSchema = Yup.object().shape({
  name: Yup.string().required(),
  email: Yup.string()
    .email()
    .required(),
  age: Yup.number().required(),
  weight: Yup.number().required(),
  height: Yup.number().required(),
});

class StudentController {
  async index(req, res) {
    let where = {};

    const name = req.query.q;
    if (name) {
      where = {
        name: {
          [Op.iLike]: `%${name}%`,
        },
      };
    }

    const students = await Student.findAll({
      where,
    });

    return res.json(students);
  }

  async show(req, res) {
    const student = await Student.findByPk(req.params.id);

    return res.json(student);
  }

  async store(req, res) {
    if (!(await studentSchema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const studentExists = await Student.findOne({
      where: { email: req.body.email },
    });
    if (studentExists) {
      return res.status(400).json({ error: 'Student already exists.' });
    }

    const student = await Student.create(req.body);

    return res.json(student);
  }

  async update(req, res) {
    if (!(await studentSchema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const studant = await Student.findByPk(req.params.id);

    const { email } = req.body;

    if (email && studant.email !== email) {
      const studentExists = await Student.findOne({
        where: { email },
      });
      if (studentExists) {
        return res.status(400).json({ error: 'Student already exists.' });
      }
    }

    const student = await studant.update(req.body);

    return res.json(student);
  }
}

export default new StudentController();
