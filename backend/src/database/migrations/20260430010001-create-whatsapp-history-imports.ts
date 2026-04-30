import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("whatsapp_history_imports", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      whatsappId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "Whatsapps", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending"
      },
      days: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      startedAt: {
        type: DataTypes.DATE(6)
      },
      finishedAt: {
        type: DataTypes.DATE(6)
      },
      importedChatsCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      importedMessagesCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      skippedMessagesCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      error: {
        type: DataTypes.TEXT
      },
      createdAt: {
        type: DataTypes.DATE(6),
        allowNull: false
      },
      updatedAt: {
        type: DataTypes.DATE(6),
        allowNull: false
      }
    });
  },

  down: (queryInterface: QueryInterface) => {
    return queryInterface.dropTable("whatsapp_history_imports");
  }
};
