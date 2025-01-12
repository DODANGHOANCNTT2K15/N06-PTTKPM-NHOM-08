const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
    class Avatar extends Model {
        static associate(models) {
            Avatar.belongsTo(models.User, {
                foreignKey: 'user_id',
                as: 'avatar',
            });
        }
    }

    Avatar.init(
        {
            avatar_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
            },
            user_id: {
                type: DataTypes.BIGINT,
                allowNull: false,
            },
            avatar_public_id: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            avatar_path: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: 'Avatar',
            tableName: 'avatars',
            timestamps: true,
        }
    );

    return Avatar;
};
