import { createRoutes } from "../tools/routeFactory.js";
import * as userModel from '../models/Users.js';

const router = createRoutes(userModel, 'Usuário');
export default router;
