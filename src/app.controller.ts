import { Controller, Get, HttpException } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get('api/mobile')
  getHello() {
    return this.appService.getHello();
  }

  @Get('/throw')
  throwError() {
    throw new HttpException({ message: 'Sample Error' }, 500);
  }

  @Get('api/back-office')
  async getLazy() {
    return this.appService.getLazyHello();
  }
}
