import multer from 'multer'; // multer para importar arquivos sem ser o formato json
import crypto from 'crypto'; // gerar caracteres randomicos
import { extname, resolve } from 'path'; // extenção do arquivo e o caminho

export default {
  // metodo storage
  storage: multer.diskStorage({
    destination: resolve(__dirname, '..', '..', 'tmp', 'uploads'), // destino dos arquivos upados
    // função que gera os 16 caracteres aleatorios
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, res) => {
        if (err) return cb(err);

        return cb(null, res.toString('hex') + extname(file.originalname)); // transforma em hexadecimal e reporta no .extenção
      });
    },
  }),
};
