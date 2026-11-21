import { Injectable } from "@nestjs/common";
import { EventEmitter2 } from "@nestjs/event-emitter";


export interface CarRegisteredEventPayload {
  carId: string;      
  make: string;         
  model: string;        
  year: number;        
  price:  number; 
   
  createdAt: Date;      
}
@Injectable()

export class CarEventsService{

       constructor(private readonly eventEmitter:EventEmitter2){}

       emitCarRegisteredEvent(carDetail: CarRegisteredEventPayload){
          
          this.eventEmitter.emit('car.registered', carDetail)
         
       }
}