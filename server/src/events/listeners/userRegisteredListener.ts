import { Injectable } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import type { UserRegisteredEvent } from "../userEventsService";

@Injectable()
export class UserRegisteredListener{



    @OnEvent('user.registered')
    handleUserRegisteredEvent(event:UserRegisteredEvent){
        
    }


      
}