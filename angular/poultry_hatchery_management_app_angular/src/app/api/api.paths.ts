
export namespace ApiPaths {
    export enum AuthenticatePaths {
        POST_AUTHENTICATE =  '/api/v1/auth/authenticate',
        POST_REGISTER = '/api/v1/auth/register',
        POST_REFRESH = '/api/v1/auth/refresh',
        POST_LOGOUT = '/api/v1/auth/logout'
    }

    export enum UserDataPaths {
        GET_USER_SELF = '/api/v1/user/',
        GET_OTHER_USERS = '/api/v1/user/admin/others',
        POST_USER = 'api/v1/user/admin',
        PUT_USER = 'api/v1/user/admin',
        DELETE_USER = 'api/v1/user/admin'
    }
}