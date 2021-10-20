import axios from "axios";
import { sign } from "jsonwebtoken";
import { prismaClient } from "../prisma";
/**
 * Receber code(string)
 * Recuperar access_token do github
 * Recuperar infos do User do github
 * Verificar se o usuario existe no DB
 * True:
 * Gera um token
 * False:
 * Cria no DB, gera um token
 * Retornar o token com as informacoes do User
 */

interface IAccessTokenResponse {
  access_token: string;
}

interface IUserResponse {
  avatar_url: string;
  login: string;
  id: number;
  name: string;
}

export class AuthenticateUserService {
  async execute(code: string) {
    const url = "https://github.com/login/oauth/access_token";

    const { data: accessTokenResponse } =
      await axios.post<IAccessTokenResponse>(url, null, {
        params: {
          client_id: process.env.GITHUB_CLIENT_ID,
          client_secret: process.env.GITHUB_CLIENT_SECRET,
          code,
        },
        headers: {
          Accept: "application/json",
        },
      });

    const response = await axios.get<IUserResponse>(
      "https://api.github.com/user",
      {
        headers: {
          authorization: `Bearer ${accessTokenResponse.access_token}`,
        },
      }
    );

    const { name, id, login, avatar_url } = response.data;

    let user = await prismaClient.user.findFirst({
      where: {
        github_id: id,
      },
    });

    if (!user) {
      user = await prismaClient.user.create({
        data: {
          github_id: id,
          name,
          avatar_url,
          login,
        },
      });
    }

    const token = sign(
      {
        user: {
          name: user.name,
          avatar_url: user.avatar_url,
          id: user.id,
        },
      },
      process.env.JWT_SECRET_KEY,
      {
        subject: user.id,
        expiresIn: "1d",
      }
    );

    return { token , user };
  }
}

// export const execute = async (code: string) => {
//   const url = "https://github.com/login/oauth/access_token";

//   const response = await axios.post(url, null, {
//     params: {
//       client_id: process.env.GITHUB_CLIENT_ID,
//       client_secret: process.env.GITHUB_CLIENT_SECRET,
//       code,
//     },
//     headers: {
// 			"Accept": "application/json",
//     },
//   });

//   // console.log(response.data);
//   return response.data;
// };
