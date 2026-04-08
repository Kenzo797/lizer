import { createRoutes } from "../tools/routeFactory.js";
import * as categoryModel from '../models/Category.js';

const router = createRoutes(categoryModel, 'Categoria', { protected: true});
export default router;
