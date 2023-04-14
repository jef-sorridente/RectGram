const Photo = require("../models/Photo");

const mongoose = require("mongoose");

// Inserir uma foto com um usuário relacioando a ela
const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  console.log(req.body);
  console.log(res.body);

  res.send("Foto Enviada");
};

module.exports = {
  insertPhoto,
};
