import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHello(): string {
    return 'Hello World!';
  }

  async getLazyHello(): Promise<string> {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const random = Math.random();
        if (random > 0.5) {
          reject(new HttpException({ message: 'Lazy Error: ' + random }, 500));
        }

        resolve('Hello Lazy World: ' + random);
      }, Math.random() * 1000);
    });
  }
}
