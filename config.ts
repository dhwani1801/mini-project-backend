import dotenv from 'dotenv';
dotenv.config({ path: '.env' });

function config(Env: any) {
	return {
		port: Env?.PORT,
        databaseHost: Env?.DATABASE_HOST,
		databaseUser: Env?.DATABASE_USER,
		databasePassword: Env?.DATABASE_PASSWORD,
		databaseName: Env?.DATABASE_NAME,
		databasePort: Env?.DATABASE_PORT,
		databaseUrl: Env?.DATABASE_URL,
		accessTokenSecretKey: Env?.ACCESS_TOKEN_SECRET_KEY,
		refreshTokenSecretKey: Env?.REFRESH_TOKEN_SECRET_KEY,
		forgotPasswordTokenSecretKey: Env?.FORGOT_PASSWORD_TOKEN_SECRET_KEY,
        smtpEmail: Env?.SMTP_EMAIL,
        forgotPasswordUrlExpireTime: 30 * 60 * 1000, 
        resetPasswordReactUrl: `${Env?.REACT_APP_BASE_URL}/reset-password`,
        verifyEmail: `${Env?.REACT_APP_BASE_URL}/login`,
        reactAppBaseUrl: Env?.REACT_APP_BASE_URL,
		// databaseHost: Env?.DATABASE_HOST,
		// databaseUser: Env?.DATABASE_USER,
		// databasePassword: Env?.DATABASE_PASSWORD,
		// databaseName: Env?.DATABASE_NAME,
		// databasePort: Env?.DATABASE_PORT,
		// databaseUrl: Env?.DATABASE_URL,
		// forgotPasswordTokenSecretKey: Env?.FORGOT_PASSWORD_TOKEN_SECRET_KEY,
	};
}

export default {
	...config(process.env),
};
