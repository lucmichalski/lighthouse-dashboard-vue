import {ServerRoute} from "hapi";

const joi = require('joi');

import login from'./handlers/login';
import artifactProxyHandler from'./handlers/artifactProxyHandler';
import getAllProjects from'./handlers/getAllProjects';
import invalidateProjects from'./handlers/invalidateProjects';
import getBranchBuilds from'./handlers/getBranchBuilds';
import getBranchBuildTrend from'./handlers/getBranchBuildTrend';
import getBranchLatestBuildInfo from './handlers/getBranchLatestBuildInfo';
import getBranchRunningBuild from'./handlers/getBranchRunningBuild';
import getProjectHistoryChartData from'./handlers/getProjectHistoryChartData';
import getBuildInfo from'./handlers/getBuildInfo';
import getArtifacts from'./handlers/getArtifacts';
import getBuildChartData from'./handlers/getBuildChartData';
import getVersion from './handlers/getVersion';

const MINUTE = 60 * 1000;
const HOUR = 60 * MINUTE;
const MONTH = 30 * 24 * HOUR;

const ROUTES: ServerRoute[] = [
    {
        method: 'POST',
        path: '/auth/login',
        handler: login,
        options: {
            auth: false,
            validate: {
                payload: {
                    password: joi.string().min(6)
                        .max(32)
                        .required()
                        .description('Password'),
                },
            },
        },
    },

    {
        method: 'GET',
        path: '/api/artifact',
        handler: artifactProxyHandler,
        options: {
            cache: {
                expiresIn: MONTH,
                privacy: 'public',
            },
            tags: ['api'],
            description: 'Load content of artifact. This is used due ti CORS on circle ci side',
            validate: {
                query: {
                    url: joi.string()
                        .required()
                        .description('Url of the artifact'),
                    access_token: joi.string()
                        .description('API Secret. Can also be passed as Bearer token'),
                },
            },
        },
    },
    {
        method: 'GET',
        path: '/api/version',
        handler: getVersion,
        options: {
            cache: {
                expiresIn: HOUR,
                privacy: 'public',
            },
            tags: ['api'],
            description: 'Get the current api version',
            validate: {
                query: {


                    access_token: joi.string()
                        .description('API Secret. Can also be passed as Bearer token'),
                },
            },
        },
    },

    {
        method: 'GET',
        path: '/api/projects/{branch}',
        handler: getAllProjects,
        options: {
            cache: {
                expiresIn: MINUTE,
                privacy: 'public',
            },
            tags: ['api'],
            description: 'Get list of valid projects for a given branch',
            validate: {
                query: {
                    access_token: joi.string()
                        .description('API Secret. Can also be passed as Bearer token'),
                },
                params: {
                    branch: joi.string()
                        .required()
                        .description('Branch of the project'),
                },
            },
        },
    },

    {
        method: 'DELETE',
        path: '/api/projects/{branch}',
        handler: invalidateProjects,
        options: {
            tags: ['api'],
            description: 'Invalidate cache of fetched projects',
            validate: {
                query: {
                    access_token: joi.string()
                        .description('API Secret. Can also be passed as Bearer token'),
                },
                params: {
                    branch: joi.string()
                        .required()
                        .description('Branch of the project'),
                },
            },
        },
    },

    {
        method: 'GET',
        path: '/api/projects/{vcs}/{username}/{project}/branch/{branch}',
        handler: getBranchBuilds,
        options: {
            cache: {
                expiresIn: MINUTE,
                privacy: 'public',
            },
            tags: ['api'],
            description: 'Get all builds for project on specific branch',
            validate: {
                query: {
                    access_token: joi.string()
                        .description('API Secret. Can also be passed as Bearer token'),
                },
                params: {
                    vcs: joi.string()
                        .required()
                        .description('VCS Type'),
                    username: joi.string()
                        .required()
                        .description('Username used to fetch CircleCI projects'),
                    project: joi.string()
                        .required()
                        .description('Specific CI project'),
                    branch: joi.string()
                        .required()
                        .description('Branch of the project'),
                },
            },
        },
    },

    {
        method: 'GET',
        path: '/api/projects/{vcs}/{username}/{project}/branch/{branch}/trending',
        handler: getBranchBuildTrend,
        options: {
            cache: {
                expiresIn: 15 * MINUTE,
                privacy: 'public',
            },
            tags: ['api'],
            description: 'Get all builds for project on specific branch',
            validate: {
                query: {
                    access_token: joi.string()
                        .description('API Secret. Can also be passed as Bearer token'),
                },
                params: {
                    vcs: joi.string()
                        .required()
                        .description('VCS Type'),
                    username: joi.string()
                        .required()
                        .description('Username used to fetch CircleCI projects'),
                    project: joi.string()
                        .required()
                        .description('Specific CI project'),
                    branch: joi.string()
                        .required()
                        .description('Branch of the project'),
                },
            },
        },
    },

    {
        method: 'GET',
        path: '/api/projects/{vcs}/{username}/{project}/branch/{branch}/latest',
        handler: getBranchLatestBuildInfo,
        options: {
            cache: {
                expiresIn: MINUTE,
                privacy: 'public',
            },
            tags: ['api'],
            description: 'Get latest build',
            validate: {
                query: {
                    access_token: joi.string()
                        .description('API Secret. Can also be passed as Bearer token'),
                },
                params: {
                    vcs: joi.string()
                        .required()
                        .description('VCS Type'),
                    username: joi.string()
                        .required()
                        .description('Username used to fetch CircleCI projects'),
                    project: joi.string()
                        .required()
                        .description('Specific CI project'),
                    branch: joi.string()
                        .required()
                        .description('Branch of the project'),
                },
            },
        },
    },

    {
        method: 'GET',
        path: '/api/projects/{vcs}/{username}/{project}/branch/{branch}/running',
        handler: getBranchRunningBuild,
        options: {
            cache: {
                expiresIn: MINUTE,
                privacy: 'public'
            },
            tags: ['api'],
            description: 'Get current running build',
            validate: {
                query: {
                    access_token: joi.string()
                        .description('API Secret. Can also be passed as Bearer token'),
                },
                params: {
                    vcs: joi.string()
                        .required()
                        .description('VCS Type'),
                    username: joi.string()
                        .required()
                        .description('Username used to fetch CircleCI projects'),
                    project: joi.string()
                        .required()
                        .description('Specific CI project'),
                    branch: joi.string()
                        .required()
                        .description('Branch of the project'),
                },
            },
        },
    },

    {
        method: 'GET',
        path: '/api/projects/{vcs}/{username}/{project}/branch/{branch}/history',
        handler: getProjectHistoryChartData,
        options: {
            cache: {
                expiresIn: 15 * MINUTE,
                privacy: 'public',
            },
            tags: ['api'],
            description: 'Get all builds with dashboard artifacts',
            validate: {
                query: {
                    access_token: joi.string()
                        .description('API Secret. Can also be passed as Bearer token'),
                },
                params: {
                    vcs: joi.string()
                        .required()
                        .description('VCS Type'),
                    username: joi.string()
                        .required()
                        .description('Username used to fetch CircleCI projects'),
                    project: joi.string()
                        .required()
                        .description('Specific CI project'),
                    branch: joi.string()
                        .required()
                        .description('Branch name'),
                },
            },
        },
    },

    {
        method: 'GET',
        path: '/api/projects/{vcs}/{username}/{project}/build/{build}',
        handler: getBuildInfo,
        options: {
            cache: {
                expiresIn: MONTH,
                privacy: 'public',
            },
            tags: ['api'],
            description: 'Get current running build',
            validate: {
                query: {
                    access_token: joi.string()
                        .description('API Secret. Can also be passed as Bearer token'),
                },
                params: {
                    vcs: joi.string()
                        .required()
                        .description('VCS Type'),
                    username: joi.string()
                        .required()
                        .description('Username used to fetch CircleCI projects'),
                    project: joi.string()
                        .required()
                        .description('Specific CI project'),
                    build: joi.alternatives()
                        .try(joi.string(), joi.number())
                        .required()
                        .description('Build number'),
                },
            },
        },
    },

    {
        method: 'GET',
        path: '/api/projects/{vcs}/{username}/{project}/build/latest/artifacts',
        handler: getArtifacts,
        options: {
            tags: ['api'],
            description: 'Get all artifacts for build',
            validate: {
                query: {
                    access_token: joi.string()
                        .description('API Secret. Can also be passed as Bearer token'),
                },
                params: {
                    vcs: joi.string()
                        .required()
                        .description('VCS Type'),
                    username: joi.string()
                        .required()
                        .description('Username used to fetch CircleCI projects'),
                    project: joi.string()
                        .required()
                        .description('Specific CI project'),
                },
            },
        },
    },

    {
        method: 'GET',
        path: '/api/projects/{vcs}/{username}/{project}/build/{build}/artifacts',
        handler: getArtifacts,
        options: {
            cache: {
                expiresIn: MONTH,
                privacy: 'public',
            },
            tags: ['api'],
            description: 'Get all artifacts for build',
            validate: {
                query: {
                    access_token: joi.string()
                        .description('API Secret. Can also be passed as Bearer token'),
                },
                params: {
                    vcs: joi.string()
                        .required()
                        .description('VCS Type'),
                    username: joi.string()
                        .required()
                        .description('Username used to fetch CircleCI projects'),
                    project: joi.string()
                        .required()
                        .description('Specific CI project'),
                    build: joi.alternatives()
                        .try(joi.string(), joi.number())
                        .required()
                        .description('Build number'),
                },
            },
        },
    },

    {
        method: 'GET',
        path: '/api/projects/{vcs}/{username}/{project}/build/{build}/chartdata',
        handler: getBuildChartData,
        options: {
            cache: {
                expiresIn: MONTH,
                privacy: 'public',
            },
            tags: ['api'],
            description: 'Get all chart data for build',
            validate: {
                query: {
                    access_token: joi.string()
                        .description('API Secret. Can also be passed as Bearer token'),
                },
                params: {
                    vcs: joi.string()
                        .required()
                        .description('VCS Type'),
                    username: joi.string()
                        .required()
                        .description('Username used to fetch CircleCI projects'),
                    project: joi.string()
                        .required()
                        .description('Specific CI project'),
                    build: joi.alternatives()
                        .try(joi.string(), joi.number())
                        .required()
                        .description('Build number'),
                },
            },
        },
    },

    {
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: '../dist/app',
                index: ['index.html'],
            },
        },
        options: {
            auth: false,
        },
    },
];

export default ROUTES;