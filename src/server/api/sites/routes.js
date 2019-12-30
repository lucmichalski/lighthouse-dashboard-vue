import joi from '@hapi/joi';
import { addSiteHandler, deleteSiteHandler, getFavSitesHandler, getSitesHandler } from './controller';

export default [
    {
        method: 'GET',
        path: '/api/sites',
        handler: getSitesHandler,
        options: {
            description: 'Get all configured sites',
            tags: ['api', 'sites'],
        },
    },
    {
        method: 'GET',
        path: '/api/sites/fav',
        handler: getFavSitesHandler,
        options: {
            description: 'Get favorited sites',
            tags: ['api', 'sites'],
        },
    },
    {
        method: 'DELETE',
        path: '/api/sites/{id}',
        handler: deleteSiteHandler,
        options: {
            description: 'Delete site',
            tags: ['api', 'sites'],
        },
    },

    {
        method: 'POST',
        path: '/api/sites',
        handler: addSiteHandler,
        options: {
            description: 'Add new site configuration',
            tags: ['api', 'sites'],
            validate: {
                payload: joi.object({
                    url: joi
                        .string()
                        .required(),
                    id: joi
                        .string()
                        .required(),
                    device: joi
                        .string()
                        .allow('desktop', 'mobile')
                        .required(),
                }),
            },
        },
    },
];
