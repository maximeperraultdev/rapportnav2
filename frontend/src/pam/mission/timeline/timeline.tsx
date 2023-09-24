import React from 'react'
import { FlexboxGrid, Stack } from 'rsuite'
import { Accent, Icon, IconButton, Size, THEME } from '@mtes-mct/monitor-ui'
import MissionTimelineItemContainer from './timeline-item-container'
import MissionTimelineItem from './timeline-item'
import { Mission, Action, getActionData, getActionStartTime, ActionStatusType } from '../../mission-types'
import { formatShortDate, formatTime } from '../../../dates'
import Title from '../../../ui/title'
import { getColorForStatus } from '../status/utils'
import { ActionTypeEnum } from '../../env-mission-types'

interface MissionTimelineProps {
  mission: Mission
  onSelectAction: (action: Action) => void
}

const MissionTimeline: React.FC<MissionTimelineProps> = ({ mission, onSelectAction }) => {
  return (
    <div>
      <FlexboxGrid justify="space-between" align="middle" style={{ height: '100%' }}>
        <FlexboxGrid.Item style={{ width: '100%' }}>
          <Stack direction="column">
            {mission.actions.map((action: Action) => {
              console.log('TINELINE action', action)
              if (!action.data) {
                return <></>
              }
              return (
                <Stack.Item
                  key={`${action.source}-${action.type}-${action.id}-${Math.random()}`}
                  style={{ width: '100%', padding: '1rem 0' }}
                >
                  <Stack direction="row">
                    <Stack.Item style={{ minWidth: '50px' }}>
                      <Stack direction="column">
                        <Stack.Item>
                          <Title as="h3" color={THEME.color.slateGray} weight="bold">
                            {formatShortDate(action.startDateTimeUtc)}
                          </Title>
                        </Stack.Item>
                        <Stack.Item>
                          <Title as="h3" color={THEME.color.slateGray}>
                            {formatTime(action.startDateTimeUtc)}
                          </Title>
                        </Stack.Item>
                      </Stack>
                    </Stack.Item>
                    <Stack.Item style={{ width: '100%' }}>
                      <MissionTimelineItemContainer actionSource={action.source} actionType={action.type as any}>
                        <MissionTimelineItem action={action} onClick={() => onSelectAction(action)} />
                      </MissionTimelineItemContainer>
                    </Stack.Item>
                    {action.type !== ActionTypeEnum.STATUS && (
                      <Stack.Item style={{ width: '10px' }}>
                        <div style={{ backgroundColor: getColorForStatus(action.status) }}>&nbsp;</div>
                      </Stack.Item>
                    )}
                  </Stack>
                </Stack.Item>
              )
            })}
          </Stack>
        </FlexboxGrid.Item>
      </FlexboxGrid>
    </div>
  )
}

export default MissionTimeline
