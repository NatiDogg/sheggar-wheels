import { Module } from '@nestjs/common';
import { EventEmitterModule } from '@nestjs/event-emitter';
@Module({
   imports: [
      EventEmitterModule.forRoot({
         global: true,
         maxListeners: 50,
         wildcard: true,
         verboseMemoryLeak: true
      })
   ]

})
export class EventsModule {}
