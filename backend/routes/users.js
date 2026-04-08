import { createRoutes } from "../tools/routeFactory.js";
import * as userModel from '../models/Users.js';

const router = createRoutes(userModel, 'Usuário', { protected: false});
export default router;
