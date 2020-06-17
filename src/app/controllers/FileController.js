import File from '../models/File'; // importando o models de file

// criando a class
class FileController {
  async store(req, res) {
    const { originalname: name, filename: path } = req.file; // desestruturando o corpo da requisição
    // create com name e path;
    const file = await File.create({
      name,
      path,
    });

    return res.json(file);
  }
}

export default new FileController();
