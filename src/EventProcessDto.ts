import { Interpreter } from "xstate";
import { InterviewBriefRequestDto } from "./InterviewBriefRequestDto";

export class EventProcessDto {
  
  readonly data: InterviewBriefRequestDto;
  readonly service: Interpreter<any>;
}