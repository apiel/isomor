import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';

import { ApplicationModule } from './app.module';

let nest: INestApplicationContext;

export default async function() {
    nest = await NestFactory.createApplicationContext(ApplicationModule);
}

export function getInstance(classname: string) {
    return nest.get(classname);
}
