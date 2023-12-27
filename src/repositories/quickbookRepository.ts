import { prisma } from "../client/prisma";
import { CompanyInfo } from "../interfaces";

class QuickBookRepository {

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

  async getDetails(id: string) {
    try {
      const company = await prisma.company.findUnique({
        where: {
          id: id,
        },
      });

      return company;
    } catch (err) {
      throw new Error("Failed to fetch company details");
    }
  }

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
      throw err;
    }
  }

  async getCompanyByTenantId(tenantId: string) {
    try {
      const companyDetails = await prisma.company.findFirst({
        where: {
          tenantID: tenantId,
        },
      });
      return companyDetails;
    } catch (err) {
      throw err;
    }
  }
}

export default new QuickBookRepository();
