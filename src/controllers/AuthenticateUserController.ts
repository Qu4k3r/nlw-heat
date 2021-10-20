import { Request, Response } from "express";
import {
  AuthenticateUserService,
  // execute,
} from "../services/AuthenticateUserService";


export class AuthenticateUserController {
  async handle(req: Request, res: Response) {
    const { code } = req.body;

    const service = new AuthenticateUserService();
		try {
			const result = await service.execute(code);
		
			return res.json(result);
		} catch (error) {
			console.error(error.message)
		}
  }
}

// export const handle = async (req: Request, res: Response) => {
//   // const service = execute()
//   const { code } = req.body;

//   const response = await execute(code);
// 	const { access_token } = response;
//   return res.json(response);
// };
