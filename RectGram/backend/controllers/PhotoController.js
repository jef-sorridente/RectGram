const Photo = require("../models/Photo");
const User = require("../models/User");
const { Types} = require("mongoose");

// Inserir uma foto com um usuário relacioando a ela
const insertPhoto = async (req, res) => {
  const { title } = req.body;
  const image = req.file.filename;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  //Criar a Foto
  const newPhoto = await Photo.create({
    image,
    title,
    userId: user._id,
    userName: user.name,
  });

  //Verifica se a foto foi criada com sucesso
  if (!newPhoto) {
    res.status(422).json({
      errors: ["Houve um problema, por favor tente novamente mais tarde."],
    });
    return;
  }

  res.status(201).json(newPhoto);
};

//Remover a foto do BD

const deletePhoto = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  try {
    const photo = await Photo.findById(new Types.ObjectId(id));

    //Verifica se a foto existe
    if (!photo) {
      res.status(404).json({
        errosr: ["Foto não encontrada"],
      });
      return;
    }

    //Verificar se a foto pertence ao usuário
    if (!photo.userId.equals(reqUser._id)) {
      res.status(422).json({
        errors: ["Ocorreu um erro, por favor tente novamente mais tarde."],
      });
      return;
    }

    await Photo.findByIdAndDelete(photo._id);

    res
      .status(200)
      .json({ id: photo._id, message: "Foto excluída com sucesso." });
  } catch (error) {
    res.status(404).json({
      errosr: ["Foto não encontrada"],
    });
    return;
  }
};

//Pegar todas as fotos do sistema
const getAllPhotos = async (req, res) => {
  const photos = await Photo.find({})
    .sort([["createdAt", -1]])
    .exec();
  res.status(200).json(photos);
};

// Pegar as fotos do usuário
const getUserPhotos = async (req, res) => {
  const { id } = req.params;

  const photos = await Photo.find({ userId: id })
    .sort([["createdAt", -1]])
    .exec();

  return res.status(200).json(photos);
};

//Pegar foto por id

const getPhotoById = async (req, res) => {
  const { id } = req.params;

  const photo = await Photo.findById(new Types.ObjectId(id));

  //Verifica se a foto existe
  if (!photo) {
    res.status(404).json({ errors: ["Foto não encontradad."] });
    return;
  }

  res.status(200).json(photos);
};

//Updade da foto
const updatePhoto = async (req, res) => {
  const { id } = req.params;
  const { title } = req.body;

  const reqUser = req.user;

  const photo = await Photo.findById(id);

  //Verifica se a foto existe
  if (!photo) {
    res.status(404).json({ errors: ["Foto não encontradad."] });
    return;
  }

  //Verificar se a foto pertense ao usuáio
  if (!photo.userId.equals(reqUser._id)) {
    res
      .status(422)
      .json({ errors: ["Ocorreu um erro tente novamente mais tardef."] });
    return;
  }

  if (title) {
    photo.title = title;
  }

  await photo.save();

  res.status(200).json({ photo, message: "Foto atualizada com sucesso!" });
};

//Fincionalidade de Likes
const likePhoto = async (req, res) => {
  const { id } = req.params;

  const reqUser = req.user;

  const photo = await Photo.findById(id);

  //Verifica se a foto existe
  if (!photo) {
    res.status(404).json({ errors: ["Foto não encontradad."] });
    return;
  }

  //Checar se o usuário já deu Like
  if (photo.likes.includes(reqUser._id)) {
    res.status(422).json({ errors: ["Você já curtiu a foto"] });
    return;
  }

  //Coloca o id do usuário no Array do usuário
  photo.likes.push(reqUser._id);

  photo.save();

  res
    .status(200)
    .json({ photoId: id, userId: reqUser, message: "A foto foi curtida" });
};

// Funcionalidade de Comentário
const commentPhoto = async (req, res) => {
  const { id } = req.params;
  const { comment } = req.body;

  const reqUser = req.user;

  const user = await User.findById(reqUser._id);

  const photo = await Photo.findById(id);

  //Verifica se a foto existe
  if (!photo) {
    res.status(404).json({ errors: ["Foto não encontrada."] });
    return;
  }

  //Coloca comentário
  const userComment = {
    comment,
    userName: user.name,
    userImage: user.profileImage,
    userId: user._id,
  };

  photo.comments.push(userComment);

  await photo.save();

  res.status(200).json({
    comment: userComment,
    message: "Comentário foi adicionado com sucesso!",
  });
};

//Busca de Imagens pelo título
const searchPhotos = async (req, res) => {
  const { q } = req.query;

  const photos = await Photo.find({ title: new RegExp(q, "i") }).exec();

  res.status(200).json(photos);
};

module.exports = {
  insertPhoto,
  deletePhoto,
  getAllPhotos,
  getUserPhotos,
  getUserPhotos,
  updatePhoto,
  likePhoto,
  commentPhoto,
  searchPhotos,
};
