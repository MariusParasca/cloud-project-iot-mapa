'use strict';

module.exports = (sequelize, DataTypes) => {
    let User = sequelize.define("User", {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        },
        email: {
            type: DataTypes.STRING,
            allowNull: false
        },
        password: {
            type: DataTypes.STRING,
            allowNull: false
        },
        keyid: {
            type: DataTypes.INTEGER,
        }
    });
    return User;
}