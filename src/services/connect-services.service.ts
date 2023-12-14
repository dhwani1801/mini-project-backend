import connectServicesRepository from '../repositories/connectServicesRepository';

class ConnectServicesService {

    async deleteConnection(id: number, companyId: string) {
        return await connectServicesRepository.deleteConnection(id, companyId);
    }

}

export default new ConnectServicesService();