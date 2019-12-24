import { parseISO, format } from 'date-fns';
import ptLang from 'date-fns/locale/pt';

import Mail from '../../lib/Mail';

class RegistrationMail {
  get key() {
    return 'RegistrationMail';
  }

  async handle(job, done) {
    const { student, plan, start_date } = job.data;

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
    return done;
  }
}

export default new RegistrationMail();
