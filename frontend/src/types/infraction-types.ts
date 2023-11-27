import { FormalNoticeEnum, InfractionTypeEnum, VesselSizeEnum, VesselTypeEnum } from './env-mission-types'
import { ControlType, VesselSizeEnum, VesselTypeEnum } from './mission-types'

export type Infraction = {
  id: string
  controlType: ControlType
  formalNotice?: FormalNoticeEnum
  infractions: Natinf[]
  observations?: string
  target?: InfractionTarget
}

export type InfractionTarget = {
  id: string
  natinfs?: Natinf[]
  observations?: string
  companyName?: string
  relevantCourt?: string
  infractionType?: InfractionTypeEnum
  formalNotice?: FormalNoticeEnum
  toProcess?: Boolean
  vesselType?: VesselTypeEnum
  vesselSize?: VesselSizeEnum
  vesselIdentifier?: string
  identityControlledPerson?: string
}

export type InfractionByTarget = {
  vesselIdentifier: string
  vesselType: VesselTypeEnum
  infractions: Infraction[]
}

export type InfractionEnvNewTarget = Infraction & {
  controlType: ControlType
  identityControlledPerson: string
  vesselType: VesselTypeEnum
  vesselSize: VesselSizeEnum
  vesselIdentifier: string
}

export type Natinf = {
  infraction: string
  // infractionCategory: string
  natinfCode: number
  // regulation: string
}
