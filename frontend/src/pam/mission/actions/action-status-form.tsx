import React, { useEffect, useState } from 'react'
import { DatePicker, Icon, Tag, Textarea } from '@mtes-mct/monitor-ui'
import { ActionStatus, ActionStatusType } from '../../../types/action-types'
import { Stack } from 'rsuite'
import { getColorForStatus, mapStatusToText } from '../status/utils'
import { useNavigate, useParams } from 'react-router-dom'
import omit from 'lodash/omit'
import StatusReasonDropdown from '../status/status-reason-dropdown.tsx'
import useActionById from './use-action-by-id.tsx'
import useAddOrUpdateStatus from '../status/use-add-update-status.tsx'
import useDeleteStatus from '../status/use-delete-status.tsx'
import { ActionDetailsProps } from './action-mapping.ts'
import ActionHeader from './action-header.tsx'
import useIsMissionFinished from '../use-is-mission-finished.tsx'

type ActionStatusFormProps = ActionDetailsProps

const ActionStatusForm: React.FC<ActionStatusFormProps> = ({ action }) => {
  const navigate = useNavigate()
  const { missionId, actionId } = useParams()
  const isMissionFinished = useIsMissionFinished(missionId)

  const { data: navAction, loading, error } = useActionById(actionId, missionId, action.source, action.type)
  const [mutateStatus] = useAddOrUpdateStatus()
  const [deleteStatus] = useDeleteStatus()

  const [observationsValue, setObservationsValue] = useState<string | undefined>(undefined)

  useEffect(() => {
    setObservationsValue(navAction?.data?.observations)
  }, [navAction])

  if (loading) {
    return <div>Chargement...</div>
  }
  if (error) {
    return <div>error</div>
  }
  if (navAction) {
    const status = navAction?.data as ActionStatus

    const handleObservationsChange = (nextValue?: string) => {
      setObservationsValue(nextValue)
    }

    const handleObservationsBlur = async () => {
      await onChange('observations', observationsValue)
    }

    const onChange = async (field: string, value: any) => {
      const updatedData = {
        missionId: missionId,
        ...omit(status, '__typename'),
        [field]: value
      }
      await mutateStatus({ variables: { statusAction: updatedData } })
    }

    const deleteAction = async () => {
      await deleteStatus({
        variables: {
          id: action.id
        }
      })
      navigate(`/pam/missions/${missionId}`)
    }

    return (
      <form style={{ width: '100%' }} data-testid={'action-status-form'}>
        <Stack direction="column" spacing="2rem" alignItems="flex-start" style={{ width: '100%' }}>
          {/* TITLE AND BUTTONS */}
          <Stack.Item style={{ width: '100%' }}>
            <ActionHeader
              icon={Icon.FleetSegment}
              title={'Statut du navire'}
              date={status.startDateTimeUtc}
              onDelete={deleteAction}
              showButtons={true}
              showStatus={true}
              isMissionFinished={isMissionFinished}
              completenessForStats={navAction.completenessForStats}
            />
          </Stack.Item>
          {/* STATUS FIELDS */}
          <Stack.Item style={{ width: '100%' }}>
            <Tag
              Icon={Icon.CircleFilled}
              iconColor={getColorForStatus(ActionStatusType[action.status])}
              isLight
              withCircleIcon={true}
            >
              {mapStatusToText(ActionStatusType[action.status])}
            </Tag>
          </Stack.Item>
          {/* DATE & REASON FIELDS */}
          <Stack.Item style={{ width: '100%' }}>
            <Stack direction="row" spacing="0.5rem" style={{ width: '100%' }}>
              <Stack.Item grow={1}>
                <DatePicker
                  isRequired={true}
                  defaultValue={status.startDateTimeUtc}
                  label="Date et heure"
                  withTime={true}
                  isCompact={false}
                  isLight={true}
                  name="startDateTimeUtc"
                  onChange={async (nextUtcDate: Date) => {
                    const date = new Date(nextUtcDate)
                    await onChange('startDateTimeUtc', date.toISOString())
                  }}
                />
              </Stack.Item>
              <Stack.Item grow={3}>
                <StatusReasonDropdown
                  actionType={status.status}
                  value={status.reason}
                  onSelect={onChange}
                  isRequired={true}
                  error={
                    isMissionFinished &&
                    !status.reason &&
                    [ActionStatusType.DOCKED, ActionStatusType.UNAVAILABLE].indexOf(status.status) !== -1
                  }
                />
              </Stack.Item>
            </Stack>
          </Stack.Item>
          <Stack.Item style={{ width: '100%' }}>
            <Textarea
              label="Observations"
              value={observationsValue}
              isLight={true}
              name="observations"
              data-testid="observations"
              onChange={handleObservationsChange}
              onBlur={handleObservationsBlur}
              style={{ minWidth: '100%' }}
            />
          </Stack.Item>
        </Stack>
      </form>
    )
  }
  return null
}

export default ActionStatusForm
