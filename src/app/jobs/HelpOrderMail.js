import Mail from '../../lib/Mail';

class HelpOrderMail {
  get key() {
    return 'HelpOrderMail';
  }

  async handle(job, done) {
    const { helpOrder } = job.data;

    await Mail.sendMail({
      to: `${helpOrder.student.name} <${helpOrder.student.email}>`,
      subject: 'Sua pergunta foi respondida',
      template: 'help_order',
      context: {
        helpOrder,
      },
    });

    return done();
  }
}

export default new HelpOrderMail();
