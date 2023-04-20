import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { HttpModule } from '@nestjs/axios';
import { BullModule } from '@nestjs/bull';
import { TRANSCODE_QUEUE } from './constants';
import { TranscodeConsumer } from './transcode.consumer';


@Module({
  imports: [HttpModule, BullModule.forRoot({
    redis: {
      host: 'localhost',
      port: 6379
    }
  }), BullModule.registerQueue({
    name: TRANSCODE_QUEUE
  })],
  controllers: [AppController],
  providers: [AppService, TranscodeConsumer],
})
export class AppModule {}
