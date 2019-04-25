'use strict';

module.exports = (sequelize, DataTypes) => {
    let Key = sequelize.define("Key", {
        key: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            allowNull: false,
            primaryKey: true
        }
    });
    return Key;
}