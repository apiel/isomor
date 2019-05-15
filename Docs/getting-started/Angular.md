## Getting started with Angular and NestJs

Angular and NestJs are two complementary framerwork to build a web application. Therefor, I decided to bring them together with isomor. `isomor-ng-nest` is a tool to setup this working environment.

Run the following command:

```bash
npx isomor-ng-nest my-app
cd my-app
yarn dev
```

Finish, you are ready to code :-)

> **Note: `src-isomor` folder is where you will be coding** instead of `src`.

`isomor-ng-nest` provide as well an example. Open the file `src-isomor/server/api.service.ts`. This file is an example of service to exchange data between the server and the frontend. This file will be called by the component of Angular and will execute some function on the server using NestJs.

```ts
import { Injectable } from '@nestjs/common'; // > import { Injectable } from '@angular/core';
import { isomor } from 'isomor';
import { UptimeService } from './data/uptime/uptime.service';

@Injectable()
@isomor
export class ApiService {
  constructor(
    private readonly uptimeService: UptimeService,
  ) {}

  async uptime() {
    return this.uptimeService.uptime();
  }
}
```

The method `uptime` is calling the NestJs uptime service, returning the server uptime.

To inform the transpiler that this class is used on the frontend and the backend to exchange data, you need to set the decorator `@isomor` to the class. This decorator will tell to the transpiler to build a communication interface between the browser and the client.

> **Note:** The sub-folder of `./server` folder will not be transpiled.

> **Note:** it is also possible to use isomor without decorator with the environment variable `NO_DECORATOR=true`. Then all the class defined in the root of `./server` folder will be transpiled.

As you can see on the top there is the import of the `Injectable` decorator. This decorator is necessary for NestJs and Angular. Since the `Injectable` come from different library depending if the code is executed on the server or on the client, we need to inform the transpiler about it. To do this, we use the imported comment `// > import...`. Doing this, isomor will know that it has to execute `import { Injectable } from '@nestjs/common';` on the server and `import { Injectable } from '@angular/core';` on the client.

> **Note:** don't forget the space after the `>` else the import will just be deleted on the client.

Open the file `src-isomor/app/uptime/uptime.component.ts`. As you can see, the component consume the service as any other Angular services.

```ts
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../server/api.service';

@Component({
  selector: 'app-uptime',
  templateUrl: './uptime.component.html',
})
export class UptimeComponent implements OnInit {
  uptime: number;

  constructor(
    private apiService: ApiService,
  ) { }

  async ngOnInit() {
    this.uptime = await this.apiService.uptime();
  }
}
```
> **Note:** the communication between the frontend and the backend is done with promises `async` and `await`. Right now observable are not supported but I am working on it to make it possible.