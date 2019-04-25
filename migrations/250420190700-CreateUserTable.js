'user-strict';

module.exports = {
    up: (queryInterface, DataTypes) => {
        return queryInterface.createTable('Users', {
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
                type: DataTypes.UUID,
                allowNull: false
            },
            createdAt: {
                type: DataTypes.DATE,
                allowNull: false
            },
            updatedAt: {
                type: DataTypes.DATE,
                allowNull: false
            }
        });
    },
    down: (queryInterface, DataTypes) => { return queryInterface.dropTable('Users'); }
}