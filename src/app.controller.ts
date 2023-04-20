import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { AppService } from './app.service';
import { InterviewBriefRequestDto } from './InterviewBriefRequestDto';
import { createMachine, interpret } from 'xstate';


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('brief-sync')
  async getScrape(@Body() dto: InterviewBriefRequestDto): Promise<any> {
    return await this.appService.generatePreInterviewBriefSync(dto);
  }

  @Post('brief-async')
  async getScrapeAsync(@Body() dto: InterviewBriefRequestDto): Promise<any> {
    const machine = createMachine({
      id: 'taskMachine',
      initial: 'pending',
      states: {
        pending: {
          on: {
            START: 'processing'
          },
        },
        processing: {
          on: {
            COMPLETE: 'completed',
          }
        },
        completed: {
          type: 'final'
        },
        failed: {
          type: 'final'
        }
      }
    });

    const service = interpret(machine)
                      .onTransition(state => console.log(state.value))
                      .start();

    const job = await this.appService.generatePreInterviewBriefAsync(dto, service);
    // const service = machine
    //   .withContext({
    //     job: job,
    //     taskResult: null
    //   });
  }
  
}
