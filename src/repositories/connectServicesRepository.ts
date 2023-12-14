import { prisma } from "../client/prisma";

class ConnectServiceRepository {
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


  async deleteConnection(id: number, companyId: string) {
    return await prisma.connections.delete({
      where: {
        id,
        organizationId: companyId
      }
    })
  }
}

export default new ConnectServiceRepository();
