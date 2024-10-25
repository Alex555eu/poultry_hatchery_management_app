
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
        POST_USER = '/api/v1/user/admin',
        PUT_USER = '/api/v1/user/admin',
        DELETE_USER = '/api/v1/user/admin'
    }

    export enum NestingIncubatorPaths {
        GET_NESTING_INCUBATOR = '/api/v1/nesting-incubator/',
        POST_NESTING_INCUBATOR = '/api/v1/nesting-incubator/',
        PUT_NESTING_INCUBATOR = '/api/v1/nesting-incubator/',
        DELETE_NESTING_INCUBATOR = '/api/v1/nesting-incubator/',
    }

    export enum HatchingIncubatorPaths {
        GET_HATCHING_INCUBATOR = '/api/v1/hatching-incubator/',
        POST_HATCHING_INCUBATOR = '/api/v1/hatching-incubator/',
        PUT_HATCHING_INCUBATOR = '/api/v1/hatching-incubator/',
        DELETE_HATCHING_INCUBATOR = '/api/v1/hatching-incubator/',
    }

    export enum NestingTrolleyPaths {
        GET_NESTING_TROLLEY = '/api/v1/nesting-trolley/',
        POST_NESTING_TROLLEY = '/api/v1/nesting-trolley/',
        PUT_NESTING_TROLLEY = '/api/v1/nesting-trolley/',
        DELETE_NESTING_TROLLEY = '/api/v1/nesting-trolley/',
    }

    export enum HatchingTrolleyPaths {
        GET_HATCHING_TROLLEY = '/api/v1/hatching-trolley/',
        POST_HATCHING_TROLLEY = '/api/v1/hatching-trolley/',
        PUT_HATCHING_TROLLEY = '/api/v1/hatching-trolley/',
        DELETE_HATCHING_TROLLEY = '/api/v1/hatching-trolley/',
    }

}