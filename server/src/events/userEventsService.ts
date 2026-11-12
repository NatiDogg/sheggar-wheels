import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { User } from "prisma/generated/prisma/client";
import { UserRegisteredEvent , UserForgetPasswordEvent} from "./interfaces/userInterfaces";



@Injectable()

export class UserEventsService{

     constructor(private readonly eventEmitter:EventEmitter2){}

     emitUserRegistered(user:Omit<User, 'password'>, verifyToken: string){

          const userRegisteredEventData:UserRegisteredEvent = {
              user: {
                 id: user.id,
                 email: user.email
              },
              verifyToken,
              registeredAt: user.createdAt
          }

          this.eventEmitter.emit('user.registered', userRegisteredEventData)
      
     }

     emitUserForgetPassword(userDetails:UserForgetPasswordEvent ){
         this.eventEmitter.emit('user.forgetPassword', userDetails)
     }

}