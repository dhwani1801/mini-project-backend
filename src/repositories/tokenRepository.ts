import { prisma } from "../client/prisma";

class TokenRepository {
  // async create(accessToken: string) {
  // 	try {
  // 		const token = await prisma.user.create({
  // 			data: {
  // 				accessToken
  // 			},
  // 		});
  // 		return token;
  // 	} catch (err) {
  // 		throw err;
  // 	}
  // }

  async deleteToken(email: string) {
    try {
      const token = await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          accessToken: null,
        },
      });
      return token;
    } catch (err) {
      throw err;
    }
  }

  async updateToken(email: string, accessToken: string) {
    try {
      const token = await prisma.user.update({
        where: {
          email: email,
        },
        data: {
          accessToken: accessToken,
        },
      });
      return token;
    } catch (err) {
      throw err;
    }
  }

  async TokenStatus(email: string) {
    try {
      const token = await prisma.user.findMany({
        where: {
          email: email,
        },
      });
      if (token) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      throw err;
    }
  }

  async SavedToken(email: string) {
    try {
      const token = await prisma.user.findMany({
        where: {
          email: email,
        },
      });
      return token;
    } catch (err) {
      throw err;
    }
  }
}

export default new TokenRepository();
