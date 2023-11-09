import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import routes from './src/routes';
import './src/config/db';
import config from './config';

const app = express();
app.use(cookieParser());

app.use(
	cors({
		origin: config?.reactAppBaseUrl,
		methods: ['POST', 'PUT', 'GET', 'DELETE', 'OPTIONS', 'HEAD'],
		credentials: true,
	})
);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

/**
 * routes
 */
app.use('/mini-project', routes);

const PORT = config.port || 8080;

app.listen(PORT, () => {
	console.log('Server is listening on port ', PORT);
});

