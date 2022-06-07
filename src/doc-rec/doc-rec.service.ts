import { Injectable } from '@nestjs/common';

import { createWorker, Worker } from 'tesseract.js';

const parse = require('mrz').parse;

interface DocumentRecognitionRectangle {
  id: string;
  page: number;
  isMRZ: boolean;
  left: number;
  top: number;
  width: number;
  height: number;
}

interface DocumentRecognitionOptions {
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
  private readonly workerMRZ: Worker;

  constructor() {
    this.worker = createWorker({
      logger: (data) => console.log('Worker: ', data),
      errorHandler: (err) => console.log('Error: ', err),
    });
    this.workerMRZ = createWorker({
      logger: (data) => console.log('Worker mrz: ', data),
      errorHandler: (err) => console.log('Error mrz: ', err),
    });
  }

  async run(data: Data) {
    console.log('Start proccess recognition...');
    try {
      let ret: any[] = [];
      const buffer = Buffer.from(data.img, 'base64');
      
      await this.worker.load();
      await this.worker.loadLanguage(data.lang);
      await this.worker.initialize(data.lang);

      await this.workerMRZ.load();
      await this.workerMRZ.loadLanguage('mrz');
      await this.workerMRZ.initialize('mrz');

      if (data.options?.rectangles?.filter(r => !r.isMRZ).length) {
        for (const rectangle of data.options.rectangles.filter(r => !r.isMRZ)) {
          const rectRet = await this.worker.recognize(buffer, { rectangle });
          ret = [ ...ret, {
            id: rectangle.id,
            page: rectangle.page,
            data: rectRet.data,
          }];
        }
      }
      if (data.options?.rectangles?.filter(r => r.isMRZ).length) {
        for (const rectangle of data.options.rectangles.filter(r => r.isMRZ)) {
          const retRec = await this.workerMRZ.recognize(buffer, { rectangle });
          let retData: any = {
            id: rectangle.id,
            page: rectangle.page,
            data: retRec.data,
          };

          const mrzForParse = retRec?.data?.text?.split('\n').filter(s => !!s);
          let mrz: any = {};
          if ([2, 3].includes(mrzForParse.length)) {
            try {
              mrz = parse(mrzForParse);
              console.log('MRZ: ', JSON.stringify(mrz));

              retData = {
                ...retData,
                mrz,
              }
            }
            catch (e) {
              console.log('MRZ: ', e);
            }
          }

          ret = [ ...ret, retData];
        }
      }
      if (!data.options?.rectangles?.length) {
        ret = [ await this.worker.recognize(buffer) ];
      }

      console.log('Result: ', ret);
      return ret;
    }
    catch (e) {
      console.log(e);
      return { message: 'Error' };
    }
  }
}
