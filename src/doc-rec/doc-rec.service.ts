import { Injectable } from '@nestjs/common';

import { createWorker, Worker } from 'tesseract.js';

interface Data {
  img: any;
  lang: string;
}

@Injectable()
export class DocumentRecognitionService {
  private readonly worker: Worker;

  constructor() {
    this.worker = createWorker({
      logger: (data) => console.log('Worker: ', data),
    });
  }

  async run(data: Data) {
    console.log('Start proccess recognition...');
    let ret: any = { message: 'Error' };
    try {
      const buffer = Buffer.from(data.img, 'base64');
      
      await this.worker.load();
      await this.worker.loadLanguage(data.lang);
      await this.worker.initialize(data.lang);
      ret = await this.worker.recognize(buffer);

      console.log('Result: ', ret);
    }
    catch (e) {
      console.log(e);
    }
    return ret;
  }
}
