import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("webhooks", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false
      },
      url: {
        type: DataTypes.STRING,
        allowNull: false
      },
      secret: {
        type: DataTypes.TEXT
      },
      events: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      lastStatus: {
        type: DataTypes.INTEGER
      },
      lastError: {
        type: DataTypes.TEXT
      },
      lastSentAt: {
        type: DataTypes.DATE(6)
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

    await queryInterface.createTable("webhook_logs", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      webhookId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "webhooks", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      event: {
        type: DataTypes.STRING,
        allowNull: false
      },
      payload: {
        type: DataTypes.TEXT
      },
      statusCode: {
        type: DataTypes.INTEGER
      },
      responseBody: {
        type: DataTypes.TEXT
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

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.dropTable("webhook_logs");
    await queryInterface.dropTable("webhooks");
  }
};
