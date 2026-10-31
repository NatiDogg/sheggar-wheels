import { ExecutionContext, ForbiddenException, Injectable, UnauthorizedException } from "@nestjs/common";
import { CanActivate } from "@nestjs/common";
import { Reflector } from "@nestjs/core";
import { Role } from "prisma/generated/prisma/enums";

import { ROLES_KEY } from "../decorators/rolesDecorator";

@Injectable()
export class RolesGuard implements CanActivate{

        constructor(private readonly reflector:Reflector){}
 
      canActivate(context: ExecutionContext): boolean{
          const requiredRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [context.getHandler(), context.getClass()])

          if(!requiredRoles){
            return true
          }

          const {user} = context.switchToHttp().getRequest()
             if(!user){
             throw new UnauthorizedException("User is not authenticated");
           }

           const hasRequiredRole = requiredRoles.includes(user.role)

           if(!hasRequiredRole){
            throw new ForbiddenException('Access denied. You do not have the required permissions.');
           }

           return true

      }
}