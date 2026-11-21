import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserEventsService } from './userEventsService';
import { UserEventsListener } from './listeners/userEventsListener';
import { CarEventsService } from './carEventsService';
import { CarEventsListener } from './listeners/carEventsListener';
@Module({
   imports: [
      EventEmitterModule.forRoot({
         global: true,
         maxListeners: 50,
         wildcard: true,
         verboseMemoryLeak: true
      })
   ],
   providers: [UserEventsService, UserEventsListener,CarEventsService,CarEventsListener],
   exports: [UserEventsService,CarEventsService]

})
export class EventsModule {}
