import { createRoutes } from "../tools/routeFactory.js";
import * as linkModel from '../models/Link.js';

const router = createRoutes(linkModel, 'Link');
export default router;
