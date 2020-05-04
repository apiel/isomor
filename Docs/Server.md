### server

To run the server do `npx isomor-server` or `yarn isomor:serv` if you added the `scripts` like described in the "getting started" section.

You can run the server in watch mode to reload automatically when change as been detected. For this use the `--watch` parameter or the environment variable `ISOMOR_WATCH=true`.

The server is able to serve static files, this can be useful in production if you need to serve some bundle (even if I would recommend to use a CDN for that). To do this run the server with the environment variable `ISOMOR_STATIC_FOLDER=./the_folder_with_static_files`.

#### API documentation with Swagger

The server generate automatically the API documentation and make it available using swagger UI at http://localhost:3005/api-docs/

#### API validation

Isomor validate each incoming request to the server base on the types of the parameters of the function call.

> **Note:** Generating the validation schema can take some time. You can deactivate it by setting the environment variable `ISOMOR_NO_VALIDATION=true`.

#### Startup script

The server can call a script when it is starting. Just create a file in `api/startup/index.ts` exporting a default function to call. The server will call this function at startup, passing as parameter the express server. This can be useful to setup some custom middleware or to simply initialise some library, like an ORM.

*api/startup/index.ts*
```ts
export default function(app: express.Express) {
    // your code...
}
```
