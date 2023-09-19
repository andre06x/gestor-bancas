import bcrypt from "bcrypt";
import Usuario from "../../models/Usuario.js";
import Estabelecimento from "../../models/Estabelecimento.js";
import FuncionariosEstabelecimento from "../../models/FuncionariosEstabelecimento.js";
import Categorias from "../../models/Categorias.js";
import TiposPagamento from "../../models/TiposPagamento.js";
import Taxa from "../../models/Taxa.js";

const senha = await bcrypt.hash("123456", 10);

const usuarios = [
  {
    nome: "Bruno Correia",
    matricula: "20230828",
    email: "bruno@gmail.com",
    senha,
    ativo: true,
    admin: true,
  },
];

const tipos = [
  { tipo: "Crédito" },
  { tipo: "Débito" },
  { tipo: "Dinheiro" },
  { tipo: "Pix" },
];

export async function createInitialData() {
  try {
    await Taxa.sync({ alter: true });
    await Usuario.sync({ alter: true });
    await Estabelecimento.sync({ alter: true });
    await FuncionariosEstabelecimento.sync({ alter: true });
    await Categorias.sync({ alter: true });
    await TiposPagamento.sync({ alter: true });
    await Usuario.bulkCreate(usuarios, { ignoreDuplicates: true });
    await TiposPagamento.bulkCreate(tipos, { ignoreDuplicates: true });
  } catch (err) {
    console.log("Err" + err.message);
  }
}
