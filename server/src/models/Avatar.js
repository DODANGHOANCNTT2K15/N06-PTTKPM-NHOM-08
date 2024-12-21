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
            id: {
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
                allowNull: false,
            },
            avatar_path: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            created_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
            updated_at: {
                type: DataTypes.DATE,
                allowNull: false,
                defaultValue: DataTypes.NOW,
            },
        },
        {
            sequelize,
            modelName: 'Avatar',
            tableName: 'avatars',
            time: true,
        }
    );

    return Avatar;
};
