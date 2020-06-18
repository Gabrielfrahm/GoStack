import mongoose from 'mongoose'; // importanto o orm do mongo

// criando tabela no banco OBS: o banco foi criado com o docker
const NotificationSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: true,
    },
    user: {
      type: Number,
      required: true,
    },
    read: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model('Notification', NotificationSchema); // exporta o banco e com o seu nome
