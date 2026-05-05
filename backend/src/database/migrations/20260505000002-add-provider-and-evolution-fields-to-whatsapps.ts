import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("Whatsapps", "provider", {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "wwebjs"
    });

    await queryInterface.addColumn("Whatsapps", "evolutionApiUrl", {
      type: DataTypes.STRING
    });

    await queryInterface.addColumn("Whatsapps", "evolutionApiKey", {
      type: DataTypes.TEXT
    });

    await queryInterface.addColumn("Whatsapps", "evolutionInstanceName", {
      type: DataTypes.STRING
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("Whatsapps", "evolutionInstanceName");
    await queryInterface.removeColumn("Whatsapps", "evolutionApiKey");
    await queryInterface.removeColumn("Whatsapps", "evolutionApiUrl");
    await queryInterface.removeColumn("Whatsapps", "provider");
  }
};
