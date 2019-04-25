'use strict';

module.exports = (sequelize, DataTypes) => {
    let User = sequelize.define("User", {
        id: {
            type: DataTypes.INTEGER,
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