import { addSite, getSites } from '../../database/sites';

/**
 *
 * @param {hapi.Request} request
 * @return {Promise<void>}
 */
export async function addSiteHandler(request, h) {
    const { url, id, device } = request.payload;
    await addSite({ url, id, device });

    return h.response().code(201);
}

/**
 *
 * @param {hapi.Request} request
 * @return {Promise<SiteConfig[]>}
 */
export const getSitesHandler = () => getSites();

