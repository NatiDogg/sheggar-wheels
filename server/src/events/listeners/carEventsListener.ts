import { Injectable, Logger } from "@nestjs/common";
import { OnEvent } from "@nestjs/event-emitter";
import { PrismaService } from "src/prisma/prisma.service";
import type { CarRegisteredEventPayload } from "../carEventsService";


@Injectable()
export class CarEventsListener{

    private readonly logger = new Logger(CarEventsListener.name);

       constructor(private prisma:PrismaService){}

       @OnEvent('car.registered',{async: true})
       async handleCarRegisteredEvent(event:CarRegisteredEventPayload){
          try {
             const admins = await this.prisma.user.findMany({where: {role: 'ADMIN'},select: {email: true}})
           const adminEmails = admins.map((admin) => admin.email).filter(Boolean);
           
            if (adminEmails.length === 0) {
              this.logger.warn(
               `Car ${event.carId} registered (${event.make} ${event.model}), but no ADMIN email addresses were found.`,
               );
               return;
            }

           //send the email to the adminEmail
          } catch (error) {
            this.logger.error(
             `Failed to process car.registered notification for car ${event.carId}`,
             error instanceof Error ? error.stack : String(error),
             );
          }



       }
}