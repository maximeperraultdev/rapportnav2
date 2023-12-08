import {vesselTypeToHumanString} from '../pam/mission/controls/utils'
import {
    ControlAdministrative,
    ControlGensDeMer,
    ControlMethod,
    ControlNavigation,
    ControlSecurity
} from './control-types'
import {ControlUnit} from './control-unit-types'
import {
    ActionTypeEnum,
    EnvAction,
    FormalNoticeEnum,
    Infraction as EnvInfraction,
    MissionSourceEnum,
    MissionTypeEnum,
    SeaFrontEnum,
    InfractionTypeEnum,
    VesselTypeEnum,
    VesselSizeEnum
} from './env-mission-types'
import {FishAction} from './fish-mission-types'
import {VesselSizeEnum, VesselTypeEnum} from './mission-types'

export type Action = {
    id?: any
    missionId: number
    type: ActionTypeEnum
    source: MissionSourceEnum
    status: ActionStatusType
    startDateTimeUtc?: string
    endDateTimeUtc?: string
    data: [EnvAction | FishAction | ActionStatus | ActionControl]
}

export type ActionStatus = {
    id: string
    status: ActionStatusType
    startDateTimeUtc: string
    isStart: boolean
    reason?: ActionStatusReason
    observations?: string
}

export type ActionControl = {
    latitude: number
    longitude: number
    controlMethod?: ControlMethod
    vesselIdentifier?: string
    vesselType?: VesselTypeEnum
    vesselSize?: VesselSizeEnum
    observations?: string
    identityControlledPerson?: string
    controlAdministrative?: ControlAdministrative
    controlGensDeMer?: ControlGensDeMer
    controlNavigation?: ControlNavigation
    controlSecurity?: ControlSecurity
}

export enum ActionSource {
    'EnvAction' = 'EnvAction',
    'FishAction' = 'FishAction',
    'NavAction' = 'NavAction'
}

export enum ActionStatusType {
    'NAVIGATING' = 'NAVIGATING',
    'DOCKED' = 'DOCKED',
    'ANCHORED' = 'ANCHORED',
    'UNAVAILABLE' = 'UNAVAILABLE',
    'UNKNOWN' = 'UNKNOWN'
}

export enum ActionStatusReason {
    'MAINTENANCE' = 'MAINTENANCE',
    'WEATHER' = 'WEATHER',
    'REPRESENTATION' = 'REPRESENTATION',
    'ADMINISTRATION' = 'ADMINISTRATION',
    'HARBOUR_CONTROL' = 'HARBOUR_CONTROL',
    'TECHNICAL' = 'TECHNICAL',
    'PERSONNEL' = 'PERSONNEL',
    'OTHER' = 'OTHER'
}


