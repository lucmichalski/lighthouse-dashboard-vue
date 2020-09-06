import { register } from './lib/reporter';
import * as lighthouseDashboard from './lib/reporter/integrations/lighthouse-dashboard';
import * as qm from './lib/reporter/integrations/quickmetrics';

if (process.env.QUICK_METRICS_KEY) {
    register(qm);
}


register(lighthouseDashboard);
