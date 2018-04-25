import Overview from './pages/Secure/Dashboard/Index.vue';
import MainSecure from './pages/Secure/Index.vue';

import ProjectOverview from './pages/Secure/Project/Overview.vue';
import ProjectHistory from './pages/Secure/Project/History.vue';
import ProjectBuild from './pages/Secure/Project/Builds.vue';
import Project from './pages/Secure/Project/Index.vue';

import Login from './pages/Login/Login.vue';
import Help from './pages/Help/Index.vue';
import Kiosk from './pages/Secure/Kiosk/Index.vue';

export default [
    { path: '/login', name: 'login', component: Login, meta: { requiresAuth: false } },
    { path: '/kiosk', name: 'kiosk', component: Kiosk },
    {
        path: '/', name: 'index', component: MainSecure,
        children: [
            { path: '', name: 'dashboard', component: Overview },
            { path: '/help', name: 'help', component: Help },

            {
                path: ':vcs/:username/:project',
                component: Project,
                props: true,
                children: [
                    { path: '', name: 'overview', component: ProjectOverview, props: true },
                    { path: 'builds', name: 'builds', component: ProjectBuild, props: true },
                    { path: 'history', name: 'history', component: ProjectHistory, props: true },
                ]
            },
        ]
    }
]