import { Injectable } from '@nestjs/common';

import { createWorker, Worker } from 'tesseract.js';

export interface DocumentRecognitionRectangle {
  id: string;
  left: number;
  top: number;
  width: number;
  height: number;
}

export interface DocumentRecognitionOptions {
  rectangles: DocumentRecognitionRectangle[];
}

interface Data {
  img: any;
  lang: string;
  options: DocumentRecognitionOptions;
}

@Injectable()
export class DocumentRecognitionService {
  private readonly worker: Worker;

  constructor() {
    this.worker = createWorker({
      logger: (data) => console.log('Worker: ', data),
      errorHandler: (err) => console.log('Error: ', err),
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
      if (data.options?.rectangles?.length) {
        ret = [];
        for (const rectangle of data.options.rectangles) {
          const rectRet = await this.worker.recognize(buffer, { rectangle });
          ret = [ ...ret, {
            id: rectangle.id,
            data: rectRet.data,
          }];
        }
      }
      else {
        ret = [ await this.worker.recognize(buffer) ];
      }

      console.log('Result: ', ret);
    }
    catch (e) {
      console.log(e);
    }
    return ret;
  }
}
