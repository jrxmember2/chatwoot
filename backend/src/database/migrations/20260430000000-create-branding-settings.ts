import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: (queryInterface: QueryInterface) => {
    return queryInterface.createTable("branding_settings", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      loginLogoUrl: {
        type: DataTypes.STRING
      },
      internalLogoUrl: {
        type: DataTypes.STRING
      },
      faviconUrl: {
        type: DataTypes.STRING
      },
      systemName: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "WhaTicket"
      },
      pageTitle: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "WhaTicket"
      },
      primaryColor: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "#2576d2"
      },
      secondaryColor: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "#f50057"
      },
      loginFooterText: {
        type: DataTypes.TEXT
      },
      showLoginLogo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
      },
      showInternalLogo: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: true
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
    return queryInterface.dropTable("branding_settings");
  }
};
