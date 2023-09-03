import { APIException } from "../exception/APIException.js";
import * as httpStatus from "../config/constants/httpStatus.js";
import FuncionariosEstabelecimento from "../models/FuncionariosEstabelecimento.js";
import { Op } from "sequelize";
import Usuario from "../models/Usuario.js";
import Estabelecimento from "../models/Estabelecimento.js";

class FuncionariosEstabelecimentoRepository {
  async criarVinculo(dados) {
    try {
      const { usuario_id, estabelecimento_id } = dados;
      const data = {
        usuario_id,
        estabelecimento_id,
      };
      const estabelecimento = await FuncionariosEstabelecimento.create(data);
      return estabelecimento.dataValues;
    } catch (err) {
      throw new APIException(httpStatus.BAD_REQUEST, err.message);
    }
  }

  async buscarFuncionarioEstabelecimento(id) {
    try {
      const estabelecimentos = await FuncionariosEstabelecimento.findAll({
        attributes: ["estabelecimento_id", "usuario_id"],
        include: [
          {
            model: Estabelecimento,
            attributes: ["cidade", "lat", "lon", "nome_estabelecimento"],
            where: { usuario_id: id },
          },
          {
            model: Usuario,
            where: { responsavel: id },
          },
        ],
        distinct: true,
      });
      const resultadoAgrupado = {};

      for (const item of estabelecimentos) {
        const estabelecimentoId = item.estabelecimento_id;
        if (!resultadoAgrupado[estabelecimentoId]) {
          resultadoAgrupado[estabelecimentoId] = {
            estabelecimento_id: estabelecimentoId,
            estabelecimento: item.estabelecimento,
            usuarios: [],
          };
        }
        resultadoAgrupado[estabelecimentoId].usuarios.push({
          usuario_id: item.usuario_id,
          nome: item.usuario.nome,
          email: item.usuario.email,
          matricula: item.usuario.matricula,
          admin: item.usuario.admin,
        });
      }

      const resultadoFinal = Object.values(resultadoAgrupado);
      return resultadoFinal;
    } catch (err) {
      throw new APIException(httpStatus.BAD_REQUEST, err.message);
    }
  }

  async excluirVinculo(id) {
    try {
      await FuncionariosEstabelecimento.destroy({ where: { id } });
      return "Vínculo Funcionário Estabelecimento excluído com sucesso!";
    } catch (err) {
      throw new APIException(httpStatus.BAD_REQUEST, err.message);
    }
  }
}

export default new FuncionariosEstabelecimentoRepository();