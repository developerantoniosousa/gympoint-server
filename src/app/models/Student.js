import Sequelize, { Model } from 'sequelize';

class Student extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        age: Sequelize.INTEGER,
        weight: Sequelize.DECIMAL(5, 3),
        height: Sequelize.DECIMAL(3, 2),
      },
      { sequelize }
    );
  }
}

export default Student;
