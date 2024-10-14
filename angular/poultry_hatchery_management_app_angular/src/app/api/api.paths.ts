
export namespace ApiPaths {
    export enum AuthenticatePaths {
        POST_VALIDATE = '/api/v1/auth/validate',
        POST_REGISTER = '/api/v1/auth/register',
        POST_REFRESH = '/api/v1/auth/refresh'
    }

    export enum UserDataPaths {
        GET_USER_SELF = '/api/v1/data/user/self',
    }
}