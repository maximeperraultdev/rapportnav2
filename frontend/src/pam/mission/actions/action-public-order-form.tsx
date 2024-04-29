import React, { useEffect, useState } from 'react'
import {
  Accent,
  Button,
  DateRangePicker,
  Icon,
  Size,
  Textarea,
} from '@mtes-mct/monitor-ui'
import { Action, ActionPublicOrder } from '../../../types/action-types'
import { Stack } from 'rsuite'
import Text from '../../../ui/text'
import { formatDateTimeForFrenchHumans } from '../../../utils/dates.ts'
import { useNavigate, useParams } from 'react-router-dom'
import omit from 'lodash/omit'
import useActionById from "./use-action-by-id.tsx";
import useAddOrUpdatePublicOrder from '../others/public-order/use-add-public-order.tsx'
import useDeletePublicOrder from '../others/public-order/use-delete-public-order.tsx'

interface ActionPublicOrderFormProps {
  action: Action
}

const ActionPublicOrderForm: React.FC<ActionPublicOrderFormProps> = ({action}) => {
  const navigate = useNavigate()
  const {missionId, actionId} = useParams()

  const {data: navAction, loading, error} = useActionById(actionId, missionId, action.source, action.type)
  const [mutatePublicOrder] = useAddOrUpdatePublicOrder()
  const [deletePublicOrder] = useDeletePublicOrder()

  const [observationsValue, setObservationsValue] = useState<string | undefined>(undefined)

  useEffect(() => {
    setObservationsValue(navAction?.data?.observations)
  }, [navAction])

  if (loading) {
    return (
      <div>Chargement...</div>
    )
  }
  if (error) {
    return (
      <div>error</div>
    )
  }
  if (navAction) {
    const actionData = navAction?.data as unknown as ActionPublicOrder

    const handleObservationsChange = (nextValue?: string) => {
      setObservationsValue(nextValue)
    }


    const handleObservationsBlur = async () => {
      await onChange('observations', observationsValue)
    }

    const onChange = async (field: string, value: any) => {
      let updatedField: {}
      if (field === 'dates') {
        const startDateTimeUtc = value[0].toISOString()
        const endDateTimeUtc = value[1].toISOString()
        updatedField = {
          startDateTimeUtc,
          endDateTimeUtc
        }
      } else {
        updatedField = {
          [field]: value
        }
      }

      const updatedData = {
        missionId: missionId,
        ...omit(actionData, [
          '__typename',
        ]),
        startDateTimeUtc: navAction.startDateTimeUtc,
        endDateTimeUtc: navAction.endDateTimeUtc,
        ...updatedField
      }

      await mutatePublicOrder({ variables: { publicOrderAction: updatedData } })
    }

    const deleteAction = async () => {
      await deletePublicOrder({
        variables: {
          id: action.id!
        }
      })
      navigate(`/pam/missions/${missionId}`)
    }

    return (
      <form style={{width: '100%'}} data-testid={"action-nautical-event-form"}>
        <Stack direction="column" spacing="2rem" alignItems="flex-start" style={{width: '100%'}}>
          {/* TITLE AND BUTTONS */}
          <Stack.Item style={{width: '100%'}}>
            <Stack direction="row" spacing="0.5rem" style={{width: '100%'}}>
              <Stack.Item grow={2}>
                <Stack direction="column" alignItems="flex-start">
                  <Stack.Item>
                    <Text as="h2" weight="bold">
                      Maintien de l'odre public {actionData.startDateTimeUtc && `(${formatDateTimeForFrenchHumans(actionData.startDateTimeUtc)})`}
                    </Text>
                  </Stack.Item>
                </Stack>
              </Stack.Item>
              <Stack.Item>
                <Stack direction="row" spacing="0.5rem">
                  <Stack.Item>
                    <Button accent={Accent.SECONDARY} size={Size.SMALL} Icon={Icon.Duplicate}
                            disabled>
                      Dupliquer
                    </Button>
                  </Stack.Item>
                  <Stack.Item>
                    <Button
                      accent={Accent.PRIMARY}
                      size={Size.SMALL}
                      Icon={Icon.Delete}
                      onClick={deleteAction}
                      data-testid={'deleteButton'}
                    >
                      Supprimer
                    </Button>
                  </Stack.Item>
                </Stack>
              </Stack.Item>
            </Stack>
          </Stack.Item>

          <Stack.Item style={{width: '100%'}}>
            <Stack direction="row" spacing="0.5rem" style={{width: '100%'}}>
              <Stack.Item grow={1}>
                <DateRangePicker
                  name="dates"
                  // defaultValue={[navAction.startDateTimeUtc ?? formatDateForServers(toLocalISOString()), navAction.endDateTimeUtc ?? formatDateForServers(new Date() as any)]}
                  defaultValue={navAction.startDateTimeUtc && navAction.endDateTimeUtc ? [navAction.startDateTimeUtc, navAction.endDateTimeUtc] : undefined}
                  label="Date et heure de début et de fin"
                  withTime={true}
                  isCompact={true}
                  isLight={true}
                  onChange={async (nextValue?: [Date, Date] | [string, string]) => {
                    await onChange('dates', nextValue)
                  }}
                />
              </Stack.Item>
            </Stack>
          </Stack.Item>

          <Stack.Item style={{width: '100%'}}>
            <Textarea
              label="Observations"
              value={observationsValue}
              isLight={true}
              name="observations"
              data-testid="observations"
              onChange={handleObservationsChange}
              onBlur={handleObservationsBlur}
            />
          </Stack.Item>
        </Stack>
      </form>
    )
  }
  return null
}

export default ActionPublicOrderForm
