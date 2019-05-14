import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';

import { ApplicationModule } from './app.module';

let nest: INestApplicationContext;

export default async function() {
    nest = await NestFactory.createApplicationContext(ApplicationModule);
    const yo = nest.get('UptimeService');
    console.log('yo', yo);
    console.log('yo2', yo.uptime());
}

export function getInstance(classname: string) {
    return nest.get(classname);
}
