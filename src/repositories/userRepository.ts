import { prisma } from "../client/prisma";
import { UserInfo } from "../interfaces";

class UserRepository {

    /**
     * register user
     * @param data 
     * @returns 
     */
    async register(data: UserInfo) {

        try {
            const user = await prisma.user.create({
                data: {
                  email: data.email,
                  firstName: data.firstName,
                  lastName: data.lastName,
                  password: data.password,
                  phone: data.phone,
                },
              });
            return user;
        } catch (err) {
            throw err;
        }
    }
    

  /**
   * get by id
   * @param id 
   * @returns 
   */
    async getById(id: string) {
        try {
          const user = await prisma.user.findMany({
            where: {
              id: id,
            },
            select: {
              accessToken: true,
              id: true,
              email: true,
              isVerified: true,
              password: true,
              lastName: true,
              firstName: true,
              createdAt: true,
              updatedAt: true,
              phone: true,
              forgotPasswordToken: true,
            },
          });
          return user[0];
        } catch (err) {
          throw err;
        }
      }
      


      
      /**
       * get by email
       * @param email 
       * @returns 
       */
    async getByEmail(email: string) {
        console.log('email: ', email);
        const user = await prisma.user.findUnique({
            where: {
                email: email,
            },
            select: {
                accessToken: true,
                id: true,
                email: true,
                isVerified: true,
                password: true,
                lastName: true,
                firstName: true,
                createdAt: true,
                updatedAt: true,
                phone: true,
                forgotPasswordToken: true,
            },
        });
        return user;
    }


    //  Create a new user
    async create(userData: UserInfo) {
        try {
            const user = await prisma.user.create({
                data: userData,
            });
            return user;
        } catch (err) {
            throw err;
        }
    }

    // Update user
    async update(id: string, data: any) {
        try {
            const user = await prisma.user.update({
                where: { id: id },
                data: data,
            });
            return user;
        } catch (err) {
            throw err;
        }
    }

}

export default new UserRepository();
