import express from 'express';
import { authController } from '../controllers';
import { forgotPasswordValidationRules } from '../helpers/validators';
import { isAuthenticated } from '../middleware/authMiddleware';

const router = express.Router();



/**
 * register user
 */
router.post('/register', authController.register);

/**
 * login
 */
router.post('/login', authController.login);

/**
 * forget password
 */
router.post(
	'/forgot-password',
	forgotPasswordValidationRules,
	authController.forgotPassword
);

/**
 * change password
 */
router.post(
	'/change-password/:token',
	authController.changePassword
);

/**
 * reset password
 */
router.post(
	'/setpassword/:token',
	authController.SetPassword
);

/**
 * fetch profile
 */
router.get('/fetch-profile', isAuthenticated, authController.fetchProfile);

export default router;
