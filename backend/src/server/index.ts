import { HttpServer } from './HttpServer';
import { RequestHandler, Server as RestifyServer } from 'restify';
import * as restify from 'restify';
import swaggerUi from 'swagger-ui-restify2';
import corsMiddleware from 'restify-cors-middleware2';

import swaggerJsdoc from 'swagger-jsdoc';
import { CONTROLLERS } from '../controllers';

import { config } from '../config/AppConfig';
import { DatabaseProvider } from '../database/index';

// central server instnce that merges all other functionalities of the backend 
export class Server implements HttpServer {
    private restify: RestifyServer;

    public get(url: string, requestHandler: RequestHandler, roles?: []): void {
        this.addRoute('get', url, requestHandler, roles);

    }
    public post(url: string, requestHandler: RequestHandler, roles?: []): void {
        this.addRoute('post', url, requestHandler, roles);
    }

    public put(url: string, requestHandler: RequestHandler, roles?: []): void {
        this.addRoute('put', url, requestHandler, roles);
    }

    public del(url: string, requestHandler: RequestHandler, roles?: []): void {
        this.addRoute('del', url, requestHandler, roles);
    }

    private addRouteAuthenticated(method: 'get' | 'post' | 'put' | 'del' | 'patch',
        url: string,
        requestHandler: RequestHandler): void {
        this.restify[method](
            url,
            // passport.authenticate('oauth-bearer', { session: false }),
            async (req, res, next) => {
                await requestHandler(req, res, next);
                return next();
            }
        );
    }


    private addRoute(
        method: 'get' | 'post' | 'put' | 'del' | 'patch',
        url: string,
        requestHandler: RequestHandler,
        roles?: []
    ): void {
        if (roles && roles.length > 0) {
            this.addRouteAuthenticated(method, url, requestHandler);
        } else {
            this.restify[method](url, async (req, res, next) => {
                await requestHandler(req, res, next);
                return next();
            });
        }

        console.log(`Added route ${method.toUpperCase()} ${url}`);
    }

    // starting method for the server
    public start(port: number): void {
        DatabaseProvider.getConnection();

        this.restify = restify.createServer();
        this.restify.use(restify.plugins.authorizationParser());
        this.restify.use(restify.plugins.queryParser());
        this.restify.use(restify.plugins.bodyParser());

        const cors = corsMiddleware({
            origins: ['*'],
            allowHeaders: ['*'],
            exposeHeaders: ['*']
        });
        this.restify.pre(cors.preflight);
        this.restify.use(cors.actual);

        // at this point the controllers are reqistered
        CONTROLLERS.forEach(controller => controller.initialize(this));

        // here the routes are added to the swagger-ui
        if (config.swagger.enabled) {
            const options = {
                definition: {
                    openapi: '3.0.1',
                    info: {
                        version: '1.0.0',
                        title: 'SOAR Platform',
                        description: 'API for accessing the database of the SOAR Platform',
                        termsOfServices: ''
                    }
                },
                apis: ['./dist/**/*.js', './src/**/*.ts'], // files containing annotations as above
            };

            const openapiSpecification = swaggerJsdoc(options);

            this.addRoute(
                'get',
                config.swagger.url,
                swaggerUi.setup(
                    openapiSpecification,
                    {
                        explorer: true,
                        baseURL: config.swagger.url,
                        swaggerOptions: {
                            oauth2RedirectUrl: config.swagger.oauth2RedirectUrl
                        }
                    },
                    []
                )
            );

            this.restify.get(config.swagger.url + '/*', ...swaggerUi.serve);
        }

        this.restify.listen(port, () => console.log(`Server is started on Port ${port}`));
    }

    // method that stops the server
    public stop(): void {
        DatabaseProvider.disconnectDB();
        this.restify.close();
    }

    public getRestify(): RestifyServer {
        return this.restify;
    }
}
