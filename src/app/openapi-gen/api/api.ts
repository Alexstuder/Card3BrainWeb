export * from './cardRestController.service';
import { CardRestControllerService } from './cardRestController.service';
export * from './categoryRestController.service';
import { CategoryRestControllerService } from './categoryRestController.service';
export * from './healthCheck.service';
import { HealthCheckService } from './healthCheck.service';
export * from './userRestController.service';
import { UserRestControllerService } from './userRestController.service';
export const APIS = [CardRestControllerService, CategoryRestControllerService, HealthCheckService, UserRestControllerService];
