import App from '@/app';
import AuthRoute from '@routes/auth.route';
import validateEnv from '@utils/validateEnv';
import InterviewRoute from './routes/interview.route';

validateEnv();

const app = new App([new AuthRoute(), new InterviewRoute()]);

app.listen();
