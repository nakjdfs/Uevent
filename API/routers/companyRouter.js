import express from 'express';
import AccessMiddleware from '../middleware/AccessMiddleware.js';
import { errorHandler } from '../services/ErrorHandlerService.js';
import CompanyRouterHandler from '../routersHandlers/CompanyRouterHandler.js'

const router = express.Router();

router.get('/',                    AccessMiddleware(),                  errorHandler(async (req, res) => {return await CompanyRouterHandler.getCompanies(req, res)}));
router.get('/:companyId',          AccessMiddleware(),                  errorHandler(async (req, res) => {return await CompanyRouterHandler.getCompany(req, res)}));
router.post('/',                   AccessMiddleware(["User", "Admin"]), errorHandler(async (req, res) => {return await CompanyRouterHandler.createCompany(req, res)}));
router.patch('/:companyId',        AccessMiddleware(["User", "Admin"]), errorHandler(async (req, res) => {return await CompanyRouterHandler.updateCompany(req, res)}));
router.delete('/:companyId',       AccessMiddleware(["User", "Admin"]), errorHandler(async (req, res) => {return await CompanyRouterHandler.deleteCompany(req, res)}));

router.get('/:companyId/events',   AccessMiddleware(),                  errorHandler(async (req, res) => {return await CompanyRouterHandler.getCompanyEvents(req, res)}));

router.get('/:companyId/users',    AccessMiddleware(),                  errorHandler(async (req, res) => {return await CompanyRouterHandler.getUsers(req, res)}));
router.post('/:companyId/users',   AccessMiddleware(["User", "Admin"]), errorHandler(async (req, res) => {return await CompanyRouterHandler.addUserToCompany(req, res)}));
router.delete('/:companyId/users', AccessMiddleware(["User", "Admin"]), errorHandler(async (req, res) => {return await CompanyRouterHandler.deleteUserFromCompany(req, res)}));

router.get('/:companyId/logo',                                          errorHandler(async (req, res) => {return await CompanyRouterHandler.getCompanyLogo(req, res)}));
router.post('/:companyId/logo',    AccessMiddleware(["User", "Admin"]), errorHandler(async (req, res) => {return await CompanyRouterHandler.setCompanyAvatar(req, res)}));

export default router;
