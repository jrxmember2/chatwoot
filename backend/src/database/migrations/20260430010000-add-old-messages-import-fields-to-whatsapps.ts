import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.addColumn("Whatsapps", "importOldMessages", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    });

    await queryInterface.addColumn("Whatsapps", "importOldMessagesDays", {
      type: DataTypes.INTEGER
    });

    await queryInterface.addColumn("Whatsapps", "lastOldMessagesImportAt", {
      type: DataTypes.DATE(6)
    });

    await queryInterface.addColumn("Whatsapps", "oldMessagesImportStatus", {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "idle"
    });

    await queryInterface.addColumn("Whatsapps", "oldMessagesImportError", {
      type: DataTypes.TEXT
    });
  },

  down: async (queryInterface: QueryInterface) => {
    await queryInterface.removeColumn("Whatsapps", "oldMessagesImportError");
    await queryInterface.removeColumn("Whatsapps", "oldMessagesImportStatus");
    await queryInterface.removeColumn("Whatsapps", "lastOldMessagesImportAt");
    await queryInterface.removeColumn("Whatsapps", "importOldMessagesDays");
    await queryInterface.removeColumn("Whatsapps", "importOldMessages");
  }
};
