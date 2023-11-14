import React, { useState } from 'react'
import { CoordinatesFormat, CoordinatesInput, DateRangePicker, Icon, Label, THEME } from '@mtes-mct/monitor-ui'
import Divider from 'rsuite/Divider'
import { Stack } from 'rsuite'
import Text from '../../../ui/text'
import { formatDateTimeForFrenchHumans } from '../../../dates'
import { FishAction } from '../../fish-mission-types'
import ControlsToCompleteTag from '../controls/controls-to-complete-tag'
import EnvControlForm from '../controls/env-control-form'
import { Action, ControlType } from '../../mission-types'
import { EnvActionControl, actionTargetTypeLabels, vehicleTypeLabels } from '../../env-mission-types'
import { GET_MISSION_BY_ID, MUTATION_ADD_OR_UPDATE_INFRACTION_ENV } from '../queries'
import { useMutation } from '@apollo/client'
import { useParams } from 'react-router-dom'
import EnvInfractionNewTarget from '../infractions/env-infraction-new-target'
import EnvInfractionExistingTarget from '../infractions/env-infraction-existing-target'

interface ActionControlPropsEnv {
  action: Action
}

const ActionControlEnv: React.FC<ActionControlPropsEnv> = ({ action }) => {
  const { missionId, actionId } = useParams()

  return (
    <Stack direction="column" spacing={'2rem'} style={{ width: '100%' }}>
      <Stack.Item style={{ width: '100%' }}>
        <Stack direction="row" spacing={'0.5rem'} style={{ width: '100%' }}>
          <Stack.Item alignSelf="baseline">
            <Icon.ControlUnit color={THEME.color.charcoal} size={20} />
          </Stack.Item>
          <Stack.Item grow={2}>
            <Text as="h2" weight="bold">
              Contrôles {action.startDateTimeUtc && `(${formatDateTimeForFrenchHumans(action.startDateTimeUtc)})`}
            </Text>
          </Stack.Item>
        </Stack>
      </Stack.Item>
      <Stack.Item style={{ width: '100%' }}>
        <Label>Thématique de contrôle</Label>
        <Text as="h3" weight="medium" color={THEME.color.gunMetal}>
          {(action.data as any as EnvActionControl)?.themes[0].theme ?? 'inconnue'}
        </Text>
      </Stack.Item>
      <Stack.Item style={{ width: '100%' }}>
        <Label>Sous-thématiques de contrôle</Label>
        <Text as="h3" weight="medium" color={THEME.color.gunMetal}>
          {(action.data as any as EnvActionControl)?.themes[0].subThemes?.length
            ? (action.data as any as EnvActionControl)?.themes[0].subThemes?.join(', ')
            : 'inconnues'}
        </Text>
      </Stack.Item>
      <Stack.Item style={{ width: '100%' }}>
        <DateRangePicker
          defaultValue={[action.startDateTimeUtc || new Date(), action.endDateTimeUtc || new Date()]}
          label="Date et heure de début et de fin"
          withTime={true}
          isCompact={true}
          isLight={true}
          // disabled={true}
        />
      </Stack.Item>
      <Stack.Item style={{ width: '100%' }}>
        <CoordinatesInput
          defaultValue={[
            (action.data as unknown as FishAction).latitude as any,
            (action.data as unknown as FishAction).longitude as any
          ]}
          coordinatesFormat={CoordinatesFormat.DECIMAL_DEGREES}
          label="Lieu du contrôle"
          isLight={true}
          // disabled={true}
        />
      </Stack.Item>
      <Stack.Item style={{ width: '100%' }}>
        <Divider style={{ backgroundColor: THEME.color.charcoal }} />
      </Stack.Item>
      <Stack.Item style={{ width: '100%' }}>
        <Stack direction="column" alignItems="flex-start" spacing={'2rem'} style={{ width: '100%' }}>
          <Stack.Item style={{ width: '100%' }}>
            <Stack direction="row" alignItems="flex-start" spacing={'2rem'} style={{ width: '100%' }}>
              <Stack.Item style={{ width: '33%' }}>
                <Stack direction="column" spacing={'1rem'} alignItems="flex-start">
                  <Stack.Item>
                    <Label>Nbre total de contrôles</Label>
                    <Text as="h3" weight="medium" color={THEME.color.gunMetal}>
                      {action.data?.actionNumberOfControls ?? 'inconnu'}
                    </Text>
                  </Stack.Item>
                  <Stack.Item>
                    <Label>Type de cible</Label>
                    <Text as="h3" weight="medium" color={THEME.color.gunMetal}>
                      {!!action.data?.actionTargetType
                        ? actionTargetTypeLabels[action.data?.actionTargetType].libelle
                        : 'inconnu'}
                    </Text>
                  </Stack.Item>
                  <Stack.Item>
                    <Label>Type de véhicule</Label>
                    <Text as="h3" weight="medium" color={THEME.color.gunMetal}>
                      {!!action.data?.vehicleType ? vehicleTypeLabels[action.data?.vehicleType].libelle : 'inconnu'}
                    </Text>
                  </Stack.Item>
                  <Stack.Item>
                    <Label>Observations</Label>
                    <Text as="h3" weight="medium" color={THEME.color.gunMetal}>
                      {action.data?.observations ?? 'aucunes'}
                    </Text>
                  </Stack.Item>
                </Stack>
              </Stack.Item>

              <Stack.Item style={{ width: '67%' }}>
                <Stack direction="column" alignItems="flex-start" spacing={'1.5rem'} style={{ width: '100%' }}>
                  {((action.data as any as EnvActionControl)?.controlsToComplete?.length || 0) > 0 && (
                    <Stack.Item alignSelf="flex-end">
                      <ControlsToCompleteTag
                        amountOfControlsToComplete={
                          (action.data as any as EnvActionControl)?.controlsToComplete?.length
                        }
                        isLight={true}
                      />
                    </Stack.Item>
                  )}

                  <Stack.Item>
                    <Text as="h3" weight="bold" color={THEME.color.gunMetal}>
                      dont...
                    </Text>
                  </Stack.Item>
                  <Stack.Item style={{ width: '100%' }}>
                    <EnvControlForm
                      controlType={ControlType.ADMINISTRATIVE}
                      data={(action.data as any as EnvActionControl)?.controlAdministrative}
                      maxAmountOfControls={(action.data as any as EnvActionControl)?.actionNumberOfControls}
                      shouldCompleteControl={
                        !!(action.data as any as EnvActionControl)?.controlsToComplete?.includes(
                          ControlType.ADMINISTRATIVE
                        )
                      }
                    />
                  </Stack.Item>
                  <Stack.Item style={{ width: '100%' }}>
                    <EnvControlForm
                      controlType={ControlType.NAVIGATION}
                      data={(action.data as any as EnvActionControl)?.controlNavigation}
                      maxAmountOfControls={(action.data as any as EnvActionControl)?.actionNumberOfControls}
                      shouldCompleteControl={
                        !!(action.data as any as EnvActionControl)?.controlsToComplete?.includes(ControlType.NAVIGATION)
                      }
                    />
                  </Stack.Item>
                  <Stack.Item style={{ width: '100%' }}>
                    <EnvControlForm
                      controlType={ControlType.GENS_DE_MER}
                      data={(action.data as any as EnvActionControl)?.controlGensDeMer}
                      maxAmountOfControls={(action.data as any as EnvActionControl)?.actionNumberOfControls}
                      shouldCompleteControl={
                        !!(action.data as any as EnvActionControl)?.controlsToComplete?.includes(
                          ControlType.GENS_DE_MER
                        )
                      }
                    />
                  </Stack.Item>
                  <Stack.Item style={{ width: '100%' }}>
                    <EnvControlForm
                      controlType={ControlType.SECURITY}
                      data={(action.data as any as EnvActionControl)?.controlSecurity}
                      maxAmountOfControls={(action.data as any as EnvActionControl)?.actionNumberOfControls}
                      shouldCompleteControl={
                        !!(action.data as any as EnvActionControl)?.controlsToComplete?.includes(ControlType.SECURITY)
                      }
                    />
                  </Stack.Item>
                </Stack>
              </Stack.Item>
            </Stack>
          </Stack.Item>
          <Stack.Item style={{ width: '100%' }}>
            <EnvInfractionNewTarget
              availableControlTypes={(action.data as any as EnvActionControl)?.availableControlTypes}
            />
          </Stack.Item>
          <Stack.Item style={{ width: '100%' }}>
            <EnvInfractionExistingTarget
              infractionsByTarget={(action.data as any as EnvActionControl)?.infractions}
              availableControlTypes={(action.data as any as EnvActionControl)?.availableControlTypes}
            />
          </Stack.Item>
        </Stack>
      </Stack.Item>
    </Stack>
  )
}

export default ActionControlEnv
