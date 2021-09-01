const express = require("express");
const jogoSchema = require("./models/Jogos");
const mongoose = require("./database");

const app = express();
const port = 3000;
app.use(express.json());

app.get("/", (req, res) => {
  res.send({ info: "Hello MongoDB" });
});

app.get("/jogos", async (req, res) => {
  const jogos = await jogoSchema.find();
  res.json({ jogos });
});

app.get("/jogos/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(422).send({ ERROR: "Id invalido." });
    return;
  }
  const jogo = await jogoSchema.findById(id);
  if (!jogo) {
    res.status(404).send({ ERROR: "Jogo não encontrado." });
    return;
  }
  res.json({ jogo });
});

app.post("/jogos", async (req, res) => {
  const jogo = req.body;
  if (!jogo || !jogo.nome || !jogo.urlImagem) {
    res.status(400).send({ ERROR: "Jogo invalido." });
    return;
  }
  const novoJogo = await new jogoSchema(jogo).save();
  res.status(201).json({ novoJogo });
});

app.put("/jogos/:id", async (req, res) => {
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(422).send({ ERROR: "Id invalido." });
    return;
  }
  const jogo = await jogoSchema.findById(id)
  if (!jogo) {
    res.status(404).send({ ERROR: "Jogo não encontrado." });
    return;
  }
  const novoJogo = req.body;
  if (!novoJogo || !novoJogo.nome || !novoJogo.urlImagem) {
    res.status(400).send({ ERROR: "Jogo invalido." });
    return;
  }
  await jogoSchema.findOneAndUpdate({_id:id},novoJogo)
  const jogoAtualizado = await jogoSchema.findById(id)
  res.json({jogoAtualizado})
});

app.delete('/jogos/:id', async (req,res) =>{
  const id = req.params.id;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(422).send({ ERROR: "Id invalido." });
    return;
  }
  const jogo = await jogoSchema.findById(id)
  if (!jogo) {
    res.status(404).send({ ERROR: "Jogo não encontrado." });
    return;
  }
  await jogoSchema.findByIdAndDelete(id)
  res.send({MENSAGEM :'Jogo removido com sucesso.'})

})

app.listen(port, () =>
  console.log(`Servidor rodando em http://localhost:${port}`)
);
