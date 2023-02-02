export * from './authenticationController.service';
import { AuthenticationControllerService } from './authenticationController.service';
export * from './cardRestController.service';
import { CardRestControllerService } from './cardRestController.service';
export * from './categoryRestController.service';
import { CategoryRestControllerService } from './categoryRestController.service';
export * from './healthCheckController.service';
import { HealthCheckControllerService } from './healthCheckController.service';
export * from './learnRestController.service';
import { LearnRestControllerService } from './learnRestController.service';
export * from './userRestController.service';
import { UserRestControllerService } from './userRestController.service';
export const APIS = [AuthenticationControllerService, CardRestControllerService, CategoryRestControllerService, HealthCheckControllerService, LearnRestControllerService, UserRestControllerService];