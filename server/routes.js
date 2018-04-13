const joi = require('joi');

const HOUR = 60 * 60 * 1000;
const MONTH = 30 * 24 * HOUR;

module.exports = [
    {
        method: 'POST',
        path: '/auth/login',
        handler: require('./handlers/login'),
        options: {
            auth: false,
            validate: {
                payload: {
                    password: joi.string().min(6).max(32).required().description('Password')
                }
            },
        }
    },

    {
        method: 'GET',
        path: '/api/artifact',
        handler: require('./handlers/artifactProxyHandler'),
        options: {
            cache: {
                expiresIn: MONTH,
                privacy: 'public'
            },
            tags: ['api'],
            description: "Load content of artifact. This is used due ti CORS on circle ci side",
            validate: {
                query: {
                    url: joi.string().required().description('Url of the artifact'),
                    access_token: joi.string().description('API Secret. Can also be passed as Bearer token'),
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/api/projects/{branch}',
        handler: require('./handlers/getAllProjects'),
        options: {
            tags: ['api'],
            description: "Get list of valid projects for a given branch",
            validate: {
                query: {
                    access_token: joi.string().description('API Secret. Can also be passed as Bearer token'),
                },
                params: {
                    branch: joi.string().required().description('Branch of the project'),
                }
            }
        }
    },
    {
        method: 'DELETE',
        path: '/api/projects/{branch}',
        handler: require('./handlers/invalidateProjects'),
        options: {
            tags: ['api'],
            description: "Invalidate cache of fetched projects",
            validate: {
                query: {
                    access_token: joi.string().description('API Secret. Can also be passed as Bearer token'),
                },
                params: {
                    branch: joi.string().required().description('Branch of the project'),
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/api/projects/{vcs}/{username}/{project}/branch/{branch}',
        handler: require('./handlers/getBranchBuilds'),
        options: {
            tags: ['api'],
            description: "Get builds",
            validate: {
                query: {
                    access_token: joi.string().description('API Secret. Can also be passed as Bearer token'),
                },
                params: {
                    vcs: joi.string().required().description('VCS Type'),
                    username: joi.string().required().description('Username used to fetch CircleCI projects'),
                    project: joi.string().required().description('Specific CI project'),
                    branch: joi.string().required().description('Branch of the project'),
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/api/projects/{vcs}/{username}/{project}/branch/{branch}/latest',
        handler: require('./handlers/getBranchLatestBuildInfo'),
        options: {
            tags: ['api'],
            description: "Get latest build",
            validate: {
                query: {
                    access_token: joi.string().description('API Secret. Can also be passed as Bearer token'),
                },
                params: {
                    vcs: joi.string().required().description('VCS Type'),
                    username: joi.string().required().description('Username used to fetch CircleCI projects'),
                    project: joi.string().required().description('Specific CI project'),
                    branch: joi.string().required().description('Branch of the project'),
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/api/projects/{vcs}/{username}/{project}/branch/{branch}/running',
        handler: require('./handlers/getBranchRunningBuild'),
        options: {
            tags: ['api'],
            description: "Get current running build",
            validate: {
                query: {
                    access_token: joi.string().description('API Secret. Can also be passed as Bearer token'),
                },
                params: {
                    vcs: joi.string().required().description('VCS Type'),
                    username: joi.string().required().description('Username used to fetch CircleCI projects'),
                    project: joi.string().required().description('Specific CI project'),
                    branch: joi.string().required().description('Branch of the project'),
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/api/projects/{vcs}/{username}/{project}/branch/{branch}/dashboardartifacts',
        handler: require('./handlers/getBuildsWithDashboardArtifacts'),
        options: {
            tags: ['api'],
            description: "Get all builds with dashboard artifacts",
            validate: {
                query: {
                    access_token: joi.string().description('API Secret. Can also be passed as Bearer token'),
                },
                params: {
                    vcs: joi.string().required().description('VCS Type'),
                    username: joi.string().required().description('Username used to fetch CircleCI projects'),
                    project: joi.string().required().description('Specific CI project'),
                    branch: joi.string().required().description('Branch name'),
                }
            }
        }
    },

    {
        method: 'GET',
        path: '/api/projects/{vcs}/{username}/{project}/build/{build}',
        handler: require('./handlers/getBuildInfo'),
        options: {
            cache: {
                expiresIn: MONTH,
                privacy: 'public'
            },
            tags: ['api'],
            description: "Get current running build",
            validate: {
                query: {
                    access_token: joi.string().description('API Secret. Can also be passed as Bearer token'),
                },
                params: {
                    vcs: joi.string().required().description('VCS Type'),
                    username: joi.string().required().description('Username used to fetch CircleCI projects'),
                    project: joi.string().required().description('Specific CI project'),
                    build: joi.alternatives().try(joi.string(), joi.number()).required().description('Build number'),
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/api/projects/{vcs}/{username}/{project}/build/latest/artifacts',
        handler: require('./handlers/getArtifacts'),
        options: {
            tags: ['api'],
            description: "Get all artifacts for build",
            validate: {
                query: {
                    access_token: joi.string().description('API Secret. Can also be passed as Bearer token'),
                },
                params: {
                    vcs: joi.string().required().description('VCS Type'),
                    username: joi.string().required().description('Username used to fetch CircleCI projects'),
                    project: joi.string().required().description('Specific CI project'),
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/api/projects/{vcs}/{username}/{project}/build/{build}/artifacts',
        handler: require('./handlers/getArtifacts'),
        options: {
            cache: {
                expiresIn: MONTH,
                privacy: 'public'
            },
            tags: ['api'],
            description: "Get all artifacts for build",
            validate: {
                query: {
                    access_token: joi.string().description('API Secret. Can also be passed as Bearer token'),
                },
                params: {
                    vcs: joi.string().required().description('VCS Type'),
                    username: joi.string().required().description('Username used to fetch CircleCI projects'),
                    project: joi.string().required().description('Specific CI project'),
                    build: joi.alternatives().try(joi.string(), joi.number()).required().description('Build number'),
                }
            }
        }
    },
    {
        method: 'GET',
        path: '/{param*}',
        handler: {
            directory: {
                path: 'dist',
                index: ['index.html']
            }
        },
        options: {
            auth: false
        }
    },
];
