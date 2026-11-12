import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import type { UserRegisteredEvent,UserForgetPasswordEvent } from "../interfaces/userInterfaces";


@Injectable()
export class UserEventsListener{



    @OnEvent('user.registered')
    handleUserRegisteredEvent(event:UserRegisteredEvent){
        
    }

    @OnEvent('user.forgetPassword')
     handleUserForgetPasswordEvent(event: UserForgetPasswordEvent){
        
    }


      
}