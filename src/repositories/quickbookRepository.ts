import { prisma } from "../client/prisma";
import { CompanyInfo } from '../interfaces';

class QuickBookRepository {

    /**
     * create company 
     * @param data 
     * @returns 
     */
    async create(data: CompanyInfo) {
        try {
            const company = await prisma.company.create({
                data: data,
            });
            return company;
        } catch (err) {
            throw err;
        }
    }
    
    /**
     * find comapny details by id 
     * @param id 
     * @returns 
     */
    async getDetails(id: string) {
        try {
            const company = await prisma.company.findUnique({
                where: {
                    id: id,
                },
            });

            return company;
        } catch (err) {
            console.error(err);
            throw new Error('Failed to fetch company details');
        }
    }

    /**
     * update company
     * @param companyId 
     * @param data 
     * @returns 
     */
    async updateCompany(companyId: string, data: any) {
        try {
            const updatedCompany = await prisma.company.update({
                where: {
                    id: companyId,
                },
                data: data,
            });
            return updatedCompany;
        } catch (err) {
            console.log('Err: ', err);
            throw err;
        }
    }

    async getAllActive(companyId: any) {
        const Activeconnections: any = await prisma.connections.findMany({
          where: {
            isActiveConnection: true,
            organizationId: companyId,
          },
          select: {
            companyId: true,
            companyName: true,
            channelName: true,
            tokenDetails: true,
            id:true
          }
        });
    
       const ActiveconnectionsList= await Activeconnections.map((item:any) => {
          if (item.channelName === 'Business Central') {
            const tokenDetails = JSON.parse(item.tokenDetails);
            const selectedEnvironment = tokenDetails.selectedEnvironment;
            delete item.tokenDetails;
            return { ...item, selectedEnvironment };
          } else {
            delete item.tokenDetails;
            return item;
          }
        });
    
        return ActiveconnectionsList
    
      }
}

export default new QuickBookRepository();