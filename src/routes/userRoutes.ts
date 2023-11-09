import express from 'express';
import { userController } from '../controllers';
import {
	deleteUserFromCompanyRules,
	inviteUserValidationRules,
	updateUserByAdminValidation,
} from '../helpers/validators';
import { isAuthenticated } from '../middleware/authMiddleware';
// import { isAdminUser } from '../middlewares/adminMiddleware';
const router = express.Router();

// Get All Users
//router.get('/', isAuthenticated, userController.getAllUsers);

// Get User Details By Email
// router.get('/get-email', userController.getUserDetailsByEmail);

// Get User Details By Id   {Change the route of this id as if we use the same get method it will be called as it takes thing as argument Id.}
//router.get('/:id', isAuthenticated, userController.getUserDetails);



// Create New User (Temporary Api)
router.post('/', isAuthenticated, userController.createUser);

// // Update User by Id
// router.put('/', isAuthenticated, updateUserByAdminValidation, userController.updateUser);


// // Delete User From Particular Company
// router.delete('/', isAuthenticated, deleteUserFromCompanyRules, userController.deleteUser);


export default router;
