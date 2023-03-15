import { config as dotenv } from 'dotenv';
dotenv();

export const config = {
    port: Number(process.env.PORT),
    tenantId: process.env.TENANT_ID,
    applicationId: process.env.APPLICATION_ID,

    database: process.env.MONGO_DB_CONNECTION_STRING,
    app: {
        port: (process.env.PORT || 8081) as number
    },
    swagger: {
        enabled: process.env.SWAGGER_ENABLED,
        url: process.env.SWAGGER_URL,
        oauth2RedirectUrl: process.env.SWAGGER_OAUTH2_REDIRECT_URL
    },
    sources: {
        cisco_client_id: process.env.CISCO_CLIENT_ID,
        cisco_client_secret: process.env.CISCO_CLIENT_SECRET,
        nvd_api_key: process.env.NVD_API_KEY,
        ibm_xfe_key: process.env.IBM_XFE_KEY,
        ibm_xfe_pw: process.env.IBM_XFE_PW
    }
};
