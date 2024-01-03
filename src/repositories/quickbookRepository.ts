import { prisma } from "../client/prisma";
import { CompanyInfo } from "../interfaces";
import { ERROR_MESSAGE } from "../constants/messages";
import { LogData } from "../interfaces/logsData";

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
      throw new Error(ERROR_MESSAGE.FAILED_TO_FETCH_COMPANY_DETAILS);
    }
  }

  async updateCompany(companyId: string, data: CompanyInfo) {
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

  async checkCustomerExists(customerId: string): Promise<boolean> {
    try {
      const customer = await prisma.customer.findUnique({
        where: { qboCustomerId: customerId },
      });

      return !!customer;
    } catch (error) {
      return false;
    }
  }

  async createOrUpdateLog(logData: LogData) {
    if (logData.id) {
      const existingLog = await prisma.syncLogs.findUnique({
        where: { id: logData.id },
      });

      if (existingLog) {
        const updatedLog = await prisma.syncLogs.update({
          where: { id: logData.id },
          data: logData,
        });

        return updatedLog;
      }
    }

    const existingLogWithQboId = await prisma.syncLogs.findUnique({
      where: { qboId: logData.qboId },
    });

    if (existingLogWithQboId) {
      const updatedLog = await prisma.syncLogs.update({
        where: { qboId: logData.qboId },
        data: logData,
      });

      return updatedLog;
    }

    const newLog = await prisma.syncLogs.create({
      data: logData,
    });

    return newLog;
  }
}

export default new QuickBookRepository();
