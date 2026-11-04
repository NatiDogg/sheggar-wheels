import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { UserEventsService } from './userEventsService';
import { UserRegisteredListener } from './listeners/userRegisteredListener';
@Module({
   imports: [
      EventEmitterModule.forRoot({
         global: true,
         maxListeners: 50,
         wildcard: true,
         verboseMemoryLeak: true
      })
   ],
   providers: [UserEventsService, UserRegisteredListener],
   exports: [UserEventsService]

})
export class EventsModule {}
