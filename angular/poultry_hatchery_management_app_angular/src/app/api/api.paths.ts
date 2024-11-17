
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
        GET_ALL_NESTING_INCUBATORS = '/api/v1/nesting-incubator/all',
        GET_NESTING_INCUBATOR = '/api/v1/nesting-incubator?incubatorId=',
        POST_NESTING_INCUBATOR = '/api/v1/nesting-incubator',
        PUT_NESTING_INCUBATOR = '/api/v1/nesting-incubator',
        DELETE_NESTING_INCUBATOR = '/api/v1/nesting-incubator',

        GET_ALL_NESTING_INCUBATOR_SPACES = '/api/v1/nesting-incubator/space?incubatorId=',

        GET_NESTING_TROLLEY_CURR_IN_INCUBATOR_BY_INCUBATOR_ID = '/api/v1/nesting-incubator/occupation?incubatorId=',
        POST_NESTING_TROLLEY_TO_INCUBATOR_SPACE = '/api/v1/nesting-incubator/occupation',
        PUT_NESTING_TROLLEY_TO_INCUBATOR_SPACE = '/api/v1/nesting-incubator/occupation?assignmentId=',
        DELETE_NESTING_TROLLEY_FROM_INCUBATOR_SPACE = '/api/v1/nesting-incubator/occupation?assignmentId='
    }

    export enum HatchingIncubatorPaths {
        GET_HATCHING_INCUBATOR = '/api/v1/hatching-incubator/',
        POST_HATCHING_INCUBATOR = '/api/v1/hatching-incubator/',
        PUT_HATCHING_INCUBATOR = '/api/v1/hatching-incubator/',
        DELETE_HATCHING_INCUBATOR = '/api/v1/hatching-incubator/',
    }

    export enum NestingTrolleyPaths {
        GET_NESTING_TROLLEY = '/api/v1/nesting-trolley/',
        GET_ALL_NESTING_TROLLEYS_FROM_OUTSIDE_OF_INCUBATORS = '/api/v1/nesting-trolley/from-outside',
        POST_NESTING_TROLLEY = '/api/v1/nesting-trolley/',
        PUT_NESTING_TROLLEY = '/api/v1/nesting-trolley/',
        DELETE_NESTING_TROLLEY = '/api/v1/nesting-trolley/',

        GET_NESTING_TROLLEY_CONTENT = '/api/v1/nesting-trolley/content?trolleyId=',
    }

    export enum HatchingTrolleyPaths {
        GET_HATCHING_TROLLEY = '/api/v1/hatching-trolley/',
        POST_HATCHING_TROLLEY = '/api/v1/hatching-trolley/',
        PUT_HATCHING_TROLLEY = '/api/v1/hatching-trolley/',
        DELETE_HATCHING_TROLLEY = '/api/v1/hatching-trolley/',
    }

    export enum DeliveryPaths {
        GET_ALL_DELIVERIES = '/api/v1/deliveries/',
        GET_DELIVERIES_BY_ID = '/api/v1/deliveries/by-id',
        GET_DELIVERIES_BY_SUPPLIER_ID = '/api/v1/deliveries/by-supplier',
        GET_ALL_PRODUCT_TYPES = '/api/v1/deliveries/product-types-all',
        POST_DELIVERY = '/api/v1/deliveries',
        PUT_DELIVERY = '/api/v1/deliveries',
        DELETE_DELIVERY = '/api/v1/deliveries',
        
        GET_ALL_SUPPLIERS = '/api/v1/deliveries/supplier',
        POST_SUPPLIER = '/api/v1/deliveries/supplier',
    }

    export enum TaskPaths {
        GET_ALL_TASKS = '/api/v1/task/all',
        GET_ALL_ACTIVE_TASKS_BY_INCUBATOR_ID = '/api/v1/task/all/active?incubatorId=',
        GET_ALL_ACTIVE_TASKS_BY_TASK_TYPE_ID = '/api/v1/task/all/active/task-type?taskTypeId=',
        GET_ALL_ACTIVE_TASKS_BY_TROLLEY_ID = '/api/v1/task/all/active/trolley?trolleyId=',
        GET_ALL_TASK_ASSIGNED_TROLLEYS_BY_TASK_ID = '/api/v1/task/trolley-assignments?taskId=',
        GET_ALL_TASKS_BY_NESTING_ID = '/api/v1/task?nestingId=',
        POST_TASK = '/api/v1/task',
        PUT_TASK = '/api/v1/task',
        DELETE_TASK = '/api/v1/task',
        PATCH_TASK_STATUS = '/api/v1/task',

        GET_ALL_TASK_TYPES = '/api/v1/task/task-type'
    }

}