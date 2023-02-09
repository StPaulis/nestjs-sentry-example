import { Controller, Get, HttpException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello() {
    return this.appService.getHello();
  }

  @Get('throw')
  throwError() {
    throw new HttpException({ message: 'Sample Error' }, 500);
  }

  @Get('lazy')
  async getLazy() {
    return this.appService.getLazyHello();
  }
}
