// import { prisma } from "../client/prisma";

// class XeroRepository {
//     async saveXeroConnection(XeroData: any) {
//         try {
//             // Use Prisma to create a new Xero connection record in the database
//             const saveData = await prisma.connections.create({
//                 data: XeroData
//             });

//             // Return the saved data (if needed)
//             return saveData;
//         } catch (error) {
//             // Handle any errors that occur during the database operation
//             console.error('Error in saveXeroConnection:', error);
//             throw error; // Re-throw the error for the calling code to handle
//         }
//     }
// }

// export default new XeroRepository();
