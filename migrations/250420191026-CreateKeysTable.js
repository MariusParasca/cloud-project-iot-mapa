'user-strict';

module.exports = {
    up: (queryInterface, DataTypes) => {
        return queryInterface.createTable('Keys', {
            key: {
                type: DataTypes.UUID,
                defaultValue: DataTypes.UUIDV4,
                allowNull: false,
                primaryKey: true
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
    down: (queryInterface, DataTypes) => { return queryInterface.dropTable('Keys'); }
}