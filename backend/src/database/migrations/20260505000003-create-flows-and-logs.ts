import { QueryInterface, DataTypes } from "sequelize";

module.exports = {
  up: async (queryInterface: QueryInterface) => {
    await queryInterface.createTable("flows", {
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
      description: {
        type: DataTypes.TEXT
      },
      isActive: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      triggerType: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "keyword"
      },
      triggerConfig: {
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

    await queryInterface.createTable("flow_nodes", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      flowId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "flows", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      nodeType: {
        type: DataTypes.STRING,
        allowNull: false
      },
      label: {
        type: DataTypes.STRING,
        allowNull: false
      },
      positionX: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      positionY: {
        type: DataTypes.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      config: {
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

    await queryInterface.createTable("flow_edges", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      flowId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "flows", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      sourceNodeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "flow_nodes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      targetNodeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "flow_nodes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      conditionValue: {
        type: DataTypes.STRING
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

    await queryInterface.createTable("flow_execution_logs", {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
      },
      flowId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: "flows", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "CASCADE"
      },
      ticketId: {
        type: DataTypes.INTEGER,
        references: { model: "Tickets", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      contactId: {
        type: DataTypes.INTEGER,
        references: { model: "Contacts", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
      },
      triggerMessageId: {
        type: DataTypes.STRING
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending"
      },
      currentNodeId: {
        type: DataTypes.INTEGER,
        references: { model: "flow_nodes", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL"
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
    await queryInterface.dropTable("flow_execution_logs");
    await queryInterface.dropTable("flow_edges");
    await queryInterface.dropTable("flow_nodes");
    await queryInterface.dropTable("flows");
  }
};
