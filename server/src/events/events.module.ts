import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserEventsService } from './userEventsService';
import { UserEventsListener } from './listeners/userEventsListener';
@Module({
   imports: [
      EventEmitterModule.forRoot({
         global: true,
         maxListeners: 50,
         wildcard: true,
         verboseMemoryLeak: true
      })
   ],
   providers: [UserEventsService, UserEventsListener],
   exports: [UserEventsService]

})
export class EventsModule {}
