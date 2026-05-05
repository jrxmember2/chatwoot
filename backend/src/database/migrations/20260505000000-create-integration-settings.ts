import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("integration_settings", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      n8nActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      n8nBaseUrl: {
        type: DataTypes.STRING
      },
      n8nWebhookUrl: {
        type: DataTypes.STRING
      },
      n8nSecret: {
        type: DataTypes.TEXT
      },
      chatgptActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      chatgptApiKey: {
        type: DataTypes.TEXT
      },
      chatgptModel: {
        type: DataTypes.STRING,
        defaultValue: "gpt-4.1-mini"
      },
      chatgptBasePrompt: {
        type: DataTypes.TEXT
      },
      chatgptTemperature: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0.7
      },
      chatgptMaxTokens: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 500
      },
      chatgptQueueIds: {
        type: DataTypes.TEXT
      },
      evolutionActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      evolutionBaseUrl: {
        type: DataTypes.STRING
      },
      evolutionApiKey: {
        type: DataTypes.TEXT
      },
      evolutionDefaultInstance: {
        type: DataTypes.STRING
      },
      evolutionUseAsDefault: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
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
    return queryInterface.dropTable("integration_settings");
  }
};
