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
}

export default new QuickBookRepository();