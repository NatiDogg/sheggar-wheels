import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";
import { User } from "prisma/generated/prisma/client";


export interface UserRegisteredEvent{
      user: {
          id: string,
          email: string,
          
      },
      registeredAt: Date
}
@Injectable()

export class UserEventsService{

     constructor(private readonly eventEmitter:EventEmitter2){}

     emitUserRegistered(user:Omit<User, 'password'>){

          const userRegisteredEventData:UserRegisteredEvent = {
              user: {
                 id: user.id,
                 email: user.email
              },
              registeredAt: user.createdAt
          }

          this.eventEmitter.emit('user.registered', userRegisteredEventData)
         
     }

}