import { Accent, Icon, Dialog, IconButton, Size, THEME } from '@mtes-mct/monitor-ui'
import { Divider, FlexboxGrid, Stack } from 'rsuite'
import { useNavigate, useParams } from 'react-router-dom'
import MissionGeneralInfoPanel from './panel-general-info'
import MissionOperationalSummaryPanel from './panel-operational-summary'
import MissionActivityPanel from './panel-activity'
import MissionTimeline from './timeline/timeline'
import { useState } from 'react'
import { getComponentForAction } from './actions/action-mapping'
import Title from '../../ui/title'
import { ControlTarget, Action, ActionStatusType } from '../mission-types'
import ActionSelectionDropdown from './actions/action-selection-dropdown'
import { ActionTypeEnum } from '../env-mission-types'
import ControlSelection from './controls/control-selection'
import { useQuery } from '@apollo/client'
import { GET_MISSION_BY_ID } from './queries'
import StatusSelectionDropdown from './status/status-selection-dropdown'

export default function Mission() {
  const { missionId } = useParams()

  let navigate = useNavigate()
  const [selectedAction, setSelectedAction] = useState<Action | undefined>(undefined)
  const [showControlTypesModal, setShowControlTypesModal] = useState<boolean>(false)

  const { loading, error, data } = useQuery(GET_MISSION_BY_ID, { variables: { missionId } })

  const selectMissionAction = (action: Action) => {
    setSelectedAction(action)
  }

  const addNewAction = (key: ActionTypeEnum) => {
    if (key === ActionTypeEnum.CONTROL) {
      setShowControlTypesModal(true)
    }
  }

  const addNewStatus = (key: ActionStatusType) => {}

  const addNewControl = (controlType: string, targetType: ControlTarget) => {
    setShowControlTypesModal(false)
  }

  const mutationSuccessCallback = () => {
    console.log('mutation success')
    // navigate("/");
  }
  const mutationErrorCallback = () => {
    console.log('mutation failed')
    alert('error')
  }

  // const updateQuery = useMutateMission(missionId, mutationSuccessCallback, mutationErrorCallback)

  const handleSubmit = async (event: any) => {
    event.preventDefault()
    const { text, status } = data as any
    // const mission = { text, status, id: missionId }
    // const fakeMission: MissionModel = {
    //   id: 1,
    //   text: mission!.text + Math.floor(Math.random() * 101),
    //   status: mission!.status
    // }
    // updateQuery.mutate(fakeMission, { onSuccess: () => navigate('/') })
  }
  if (loading) {
    return <div>Loading...</div>
  }

  if (data) {
    const mission = data.missionById
    const MissionActionComponent = getComponentForAction(selectedAction)

    return (
      <>
        <FlexboxGrid justify="space-between" style={{ display: 'flex', flex: 1 }}>
          <FlexboxGrid.Item colspan={8} style={{ height: '100%' }}>
            <Stack direction="column">
              <Stack.Item style={{ width: '100%', padding: '1rem' }}>
                <MissionGeneralInfoPanel startDate={mission.startDateTimeUtc} endDate={mission.endDateTimeUtc} />
              </Stack.Item>
              <Stack.Item style={{ width: '100%', padding: '1rem' }}>
                <MissionActivityPanel />
              </Stack.Item>
              <Stack.Item style={{ width: '100%', padding: '1rem' }}>
                <MissionOperationalSummaryPanel />
              </Stack.Item>
            </Stack>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item
            colspan={8}
            style={{ backgroundColor: THEME.color.cultured, height: '100%', padding: '2rem 1rem' }}
          >
            <FlexboxGrid>
              <FlexboxGrid.Item style={{ width: '100%' }}>
                <FlexboxGrid justify="space-between">
                  <FlexboxGrid.Item>
                    <Stack alignItems="center">
                      <Stack.Item>
                        <Title as="h2">Actions réalisées en mission</Title>
                      </Stack.Item>
                      <Stack.Item style={{ paddingLeft: '0.5rem' }}>
                        <ActionSelectionDropdown onSelect={addNewAction} />
                      </Stack.Item>
                    </Stack>
                  </FlexboxGrid.Item>
                  <FlexboxGrid.Item>
                    <Stack>
                      <Stack.Item>
                        <IconButton
                          Icon={Icon.Phone}
                          accent={Accent.PRIMARY}
                          size={Size.NORMAL}
                          color={THEME.color.gainsboro}
                        />
                      </Stack.Item>
                      <Stack.Item style={{ paddingLeft: '0.5rem' }}>
                        <StatusSelectionDropdown onSelect={addNewStatus} />
                      </Stack.Item>
                    </Stack>
                  </FlexboxGrid.Item>
                </FlexboxGrid>
              </FlexboxGrid.Item>
              <FlexboxGrid.Item style={{ width: '100%' }}>
                <Divider />
              </FlexboxGrid.Item>
              <FlexboxGrid.Item style={{ width: '100%' }}>
                <MissionTimeline mission={mission} onSelectAction={selectMissionAction} />
              </FlexboxGrid.Item>
            </FlexboxGrid>
          </FlexboxGrid.Item>
          <FlexboxGrid.Item colspan={8} style={{ backgroundColor: THEME.color.gainsboro, height: '100%' }}>
            <FlexboxGrid justify="start" align="middle" style={{ padding: '2rem' }}>
              {selectedAction && MissionActionComponent && <MissionActionComponent action={selectedAction} />}
            </FlexboxGrid>
          </FlexboxGrid.Item>
        </FlexboxGrid>
        <>
          {showControlTypesModal && (
            <Dialog>
              <Dialog.Body>
                <ControlSelection onSelect={addNewControl} />
              </Dialog.Body>
            </Dialog>
          )}
        </>
      </>
    )
  }
}
