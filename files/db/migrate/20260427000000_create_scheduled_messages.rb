class CreateScheduledMessages < ActiveRecord::Migration[7.1]
  def change
    create_table :scheduled_messages do |t|
      t.references :account, null: false, foreign_key: true
      t.references :inbox, null: false, foreign_key: true
      t.references :conversation, null: false, foreign_key: true
      t.references :sender, null: false, foreign_key: { to_table: :users }
      t.references :sent_message, foreign_key: { to_table: :messages }
      t.text :content, null: false
      t.jsonb :message_params, null: false, default: {}
      t.datetime :scheduled_at, null: false
      t.datetime :sent_at
      t.integer :status, null: false, default: 0
      t.text :error_message

      t.timestamps
    end

    add_index :scheduled_messages, [:status, :scheduled_at]
    add_index :scheduled_messages, [:conversation_id, :status]
  end
end
