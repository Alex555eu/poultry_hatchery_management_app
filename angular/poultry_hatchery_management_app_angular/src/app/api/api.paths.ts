
export namespace ApiPaths {
    export enum AuthenticatePaths {
        POST_AUTHENTICATE =  '/api/v1/auth/authenticate',
        POST_REGISTER = '/api/v1/auth/register',
        POST_REFRESH = '/api/v1/auth/refresh',
        POST_LOGOUT = '/api/v1/auth/logout',

    }

    export enum UserDataPaths {
        GET_USER_SELF = '/api/v1/user',
        GET_OTHER_USERS = '/api/v1/user/admin/others',
        POST_USER = '/api/v1/user/admin',
        PUT_USER = '/api/v1/user',
        PATCH_USER = '/api/v1/user/admin',

        POST_NEW_PASSWORD = '/api/v1/user/password',

        PUT_ORGANISATION = '/api/v1/user/admin/organisation'
    }

    export enum NestingPaths {
        GET_ALL_UNFINISHED_NESTINGS = '/api/v1/nesting/admin/unfinished',
        GET_ALL_NESTINGS = '/api/v1/nesting/admin',
        GET_NESTING_BY_ID = '/api/v1/nesting/by-id?nestingId=',
        POST_NEW_NESTING = '/api/v1/nesting/admin',
        PUT_NESTING = '/api/v1/nesting/admin',
    }

    export enum NestingIncubatorPaths {
        GET_ALL_NESTING_INCUBATORS = '/api/v1/nesting-incubator/all',
        GET_NESTING_INCUBATOR = '/api/v1/nesting-incubator?incubatorId=',
        POST_NESTING_INCUBATOR = '/api/v1/nesting-incubator/admin',
        PUT_NESTING_INCUBATOR = '/api/v1/nesting-incubator/admin',
        DELETE_NESTING_INCUBATOR = '/api/v1/nesting-incubator/admin',

        GET_ALL_NESTING_INCUBATOR_SPACES = '/api/v1/nesting-incubator/space?incubatorId=',

        GET_NESTING_TROLLEY_CURR_IN_INCUBATOR_BY_INCUBATOR_ID = '/api/v1/nesting-incubator/occupation?incubatorId=',
        POST_NESTING_TROLLEY_TO_INCUBATOR_SPACE = '/api/v1/nesting-incubator/occupation',
        PUT_NESTING_TROLLEY_TO_INCUBATOR_SPACE = '/api/v1/nesting-incubator/occupation?assignmentId=',
        DELETE_NESTING_TROLLEY_FROM_INCUBATOR_SPACE = '/api/v1/nesting-incubator/occupation?assignmentId='
    }

    export enum HatchingPaths {
        GET_HATCHING_BY_TASK_ID = '/api/v1/hatching/by-task?taskId=',
        GET_ALL_HATCHINGS = '/api/v1/hatching/admin/all',
        GET_HATCHING_BY_ID = '/api/v1/hatching/by-id?hatchingId=',
        POST_HATCHING = '/api/v1/hatching/admin',

        GET_HATCHING_LOADED_DELIVERY = '/api/v1/hatching/loaded-deliveries',
        GET_HATCHING_LOADED_DELIVERIES_BY_HATCHING_ID = '/api/v1/hatching/loaded-deliveries?hatchingId=',

        GET_ALL_HATCHING_RESULTS = '/api/v1/hatching/result?hatchingId=',

        GET_ALL_EMERGENCES = '/api/v1/hatching/admin/emergence',
        GET_EMERGENCE_BY_TASK_ID = '/api/v1/hatching/emergence/by-task?taskId=',
        GET_EMERGENCE_BY_ID = '/api/v1/hatching/emergence/by-id?emergenceId=',
        POST_EMERGENCE = '/api/v1/hatching/admin/emergence',
    }

    export enum HatchingIncubatorPaths {
        GET_HATCHING_INCUBATOR = '/api/v1/hatching-incubator/',
        GET_HATCHING_INCUBATOR_BY_ID = '/api/v1/hatching-incubator/by-id?incubatorId=',
        POST_HATCHING_INCUBATOR = '/api/v1/hatching-incubator/admin',
        PUT_HATCHING_INCUBATOR = '/api/v1/hatching-incubator/admin',
        DELETE_HATCHING_INCUBATOR = '/api/v1/hatching-incubator/admin',


        GET_HATCHING_INCUBATOR_SPACES = '/api/v1/hatching-incubator/space?hatchingIncubatorId=',

        GET_HATCHING_TROLLEY_INCUBATOR_SPACE_ASSIGNMENT = '/api/v1/hatching-incubator/occupation?hatchingIncubatorId=',
        DELETE_HATCHING_TROLLEY_FROM_INCUBATOR_SPACE = '/api/v1/hatching-incubator/occupation?hatchingTrolleyIncubatorSpaceAssignmentId=',
        POST_HATCHING_TROLLEY_TO_INCUBATOR_SPACE = '/api/v1/hatching-incubator/occupation'

    }

    export enum NestingTrolleyPaths {
        GET_NESTING_TROLLEY = '/api/v1/nesting-trolley/',
        GET_ALL_NESTING_TROLLEYS_FROM_OUTSIDE_OF_INCUBATORS = '/api/v1/nesting-trolley/from-outside',
        GET_ALL_UNUSED_NESTING_TROLLEYS = '/api/v1/nesting-trolley/unused',
        POST_NESTING_TROLLEY = '/api/v1/nesting-trolley/admin',
        PUT_NESTING_TROLLEY = '/api/v1/nesting-trolley/admin',
        DELETE_NESTING_TROLLEY = '/api/v1/nesting-trolley/admin',

        GET_NESTING_TROLLEY_CONTENT = '/api/v1/nesting-trolley/content?trolleyId=',
        GET_NESTING_TROLLEY_CONTENT_BY_NESTING_ID = '/api/v1/nesting-trolley/content/by-nesting-id?nestingId=',
        POST_NESTING_TROLLEY_CONTENT = '/api/v1/nesting-trolley/content',
        PUT_NESTING_TROLLEY_CONTENT = '/api/v1/nesting-trolley/content',
        DELETE_NESTING_TROLLEY_CONTENT = '/api/v1/nesting-trolley/content?trolleyContentId=',
        POST_NESTING_TROLLEY_CONTENT_TRANSFER = '/api/v1/nesting-trolley/content/transfer',
    }

    export enum HatchingTrolleyPaths {
        GET_HATCHING_TROLLEY = '/api/v1/hatching-trolley',
        GET_UNUSED_HATCHING_TROLLEYS = '/api/v1/hatching-trolley/unused',
        POST_HATCHING_TROLLEY = '/api/v1/hatching-trolley/admin',
        PUT_HATCHING_TROLLEY = '/api/v1/hatching-trolley/admin',
        DELETE_HATCHING_TROLLEY = '/api/v1/hatching-trolley/admin',

        GET_HATCHING_CONTENT_BY_HATCHING_ID = '/api/v1/hatching-trolley/content/by-hatching?hatchingId=',
        POST_HATCHING_TROLLEY_CONTENT = '/api/v1/hatching-trolley/content',
        PUT_HATCHING_TROLLEY_CONTENT = '/api/v1/hatching-trolley/content',
        DELETE_HATCHING_TROLLEY_CONTENT = '/api/v1/hatching-trolley/content',

        GET_HATCHING_TROLLEY_CONTENT_BY_TROLLEY_ID = '/api/v1/hatching-trolley/content?hatchingTrolleyId=',


        GET_ALL_HATCHING_TROLLEYS_FROM_OUTSIDE_OF_INCUBATORS = '/api/v1/hatching-trolley/outside'
    }

    export enum DeliveryPaths {
        GET_ALL_DELIVERIES = '/api/v1/deliveries/admin',
        GET_ALL_LEFT_OVER_DELIVERIES = '/api/v1/deliveries/left-over',
        GET_DELIVERIES_BY_ID = '/api/v1/deliveries/by-id',
        GET_DELIVERIES_BY_SUPPLIER_ID = '/api/v1/deliveries/by-supplier',
        GET_ALL_PRODUCT_TYPES = '/api/v1/deliveries/product-types-all',
        POST_DELIVERY = '/api/v1/deliveries/admin',
        PUT_DELIVERY = '/api/v1/deliveries/admin',
        DELETE_DELIVERY = '/api/v1/deliveries/admin',
        
        GET_ALL_SUPPLIERS = '/api/v1/deliveries/admin/supplier',
        POST_SUPPLIER = '/api/v1/deliveries/admin/supplier',
    }

    export enum TaskPaths {
        GET_ALL_TASKS = '/api/v1/task/admin/all',
        GET_ALL_ACTIVE_TASKS_BY_INCUBATOR_ID = '/api/v1/task/all/active?incubatorId=',
        GET_ALL_ACTIVE_TASKS_BY_TASK_TYPE_NAME = '/api/v1/task/all/active/task-type?taskTypeName=',
        GET_ALL_ACTIVE_TASKS_BY_TROLLEY_ID = '/api/v1/task/all/active/trolley?trolleyId=',
        GET_ALL_TASK_ASSIGNED_TROLLEYS_BY_TASK_ID = '/api/v1/task/trolley-assignments?taskId=',
        GET_ALL_TASKS_BY_NESTING_ID = '/api/v1/task?nestingId=',
        POST_TASK = '/api/v1/task/admin',
        PUT_TASK = '/api/v1/task/trolley-progress',
        DELETE_TASK = '/api/v1/task/admin',
        PATCH_TASK_STATUS = '/api/v1/task',

        GET_ALL_TASK_TYPES = '/api/v1/task/task-type'
    }

    export enum CandlingPaths {
        GET_CANDLING_BY_TASK_ID = '/api/v1/candling/by-task?taskId=',
        GET_ALL_CANDLINGS = '/api/v1/candling/admin/all',
        GET_CANDLING_BY_ID = '/api/v1/candling?candlingId=',
        POST_CANDLING = '/api/v1/candling/admin',
        PUT_CANDLING = '/api/v1/candling/admin',
        DELETE_CANDLING = '/api/v1/candling/admin',

        GET_ALL_CANDLING_TROLLEY_ASSIGNMENTS = '/api/v1/candling/trolley?candlingId=',
        POST_CANDLING_TROLLEY_ASSIGNMENT = '/api/v1/candling/trolley',
        DELETE_CANDLING_TROLLEY_ASSIGNMENT = '/api/v1/candling/trolley?candledNestingTrolleyAssignmentId='
    }

    export enum RejectionPaths {
        ALL_REJECTION_CAUSES = '/api/v1/rejection/causes/all',
        REJECTION_CAUSES_ONE = '/api/v1/rejection/causes/one',
        REJECTION_CAUSES_TWO = '/api/v1/rejection/causes/two',
        REJECTION_CAUSES_THREE = '/api/v1/rejection/causes/three',
        REJECTION_CAUSES_FOUR = '/api/v1/rejection/causes/four',

        GET_ALL_REJECTION_ONE_BY_NESTING_ID = '/api/v1/rejection/one?nestingId=',
        POST_REJECTION_ONE = '/api/v1/rejection/one',
        DELETE_REJECTION_ONE = '/api/v1/rejection/one?rejectionId=',

        GET_ALL_REJECTION_TWO_BY_CANDLING_ID = '/api/v1/rejection/two/candling?candlingId=',
        POST_REJECTION_TWO = '/api/v1/rejection/two',
        DELETE_REJECTION_TWO = '/api/v1/rejection/two?rejectionId=',

        GET_ALL_REJECTION_THREE_BY_NESTING_ID = '/api/v1/rejection/three/by-nesting?nestingId=',
        GET_ALL_REJECTION_THREE_BY_HATCHING_ID = '/api/v1/rejection/three/by-hatching?hatchingId=',
        POST_REJECTION_THREE = '/api/v1/rejection/three',
        DELETE_REJECTION_THREE = '/api/v1/rejection/three?rejectionId=',

        GET_ALL_REJECTION_FOUR_BY_NESTING_ID = '/api/v1/rejection/four?nestingId=',
        POST_REJECTION_FOUR = '/api/v1/rejection/four', 
        DELETE_REJECTION_FOUR = '/api/v1/rejection/four?rejectionId=', 

        POST_REJECTION_UNEXPECTED = '/api/v1/rejection/unexpected'

    }

    export enum NestingLoadedDeliveries {
        GET_ALL_NESTING_LOADED_DELIVERIES = '/api/v1/nesting-loaded-deliveries',
        GET_ALL_NESTING_LOADED_DELIVERIES_BY_NESTING_ID = '/api/v1/nesting-loaded-deliveries/nesting?nestingId=',
        POST_NESTING_LOADED_DELIVERY = '/api/v1/nesting-loaded-deliveries/admin'
    }

    export enum RaportPaths {
        GET = '/api/v1/raport/admin?nestingId='
    }

}