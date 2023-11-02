import React from 'react'
import { Stack } from 'rsuite'
import { Accent, Icon, Size, THEME, IconButton, Tag } from '@mtes-mct/monitor-ui'
import Title from '../../../ui/title'
import { ControlType, Infraction } from '../../mission-types'
import { infractionTitleForControlType } from './utils'

interface InfractionSummaryProps {
  controlType: ControlType
  infraction?: Infraction
  onEdit?: (infraction: any) => void
  onDelete?: () => void
}

const InfractionSummary: React.FC<InfractionSummaryProps> = ({ infraction, controlType, onEdit, onDelete }) => {
  return (
    <Stack direction="column" spacing={'0.5rem'} style={{ width: '100%' }}>
      <Stack.Item style={{ width: '100%' }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between" spacing={'0.5rem'}>
          <Stack.Item>
            <Title as="h3" weight="bold" color={THEME.color.gunMetal}>
              {infractionTitleForControlType(controlType)}
            </Title>
          </Stack.Item>
          <Stack.Item>
            <Stack direction="row" alignItems="baseline" spacing={'0.5rem'}>
              <Stack.Item>
                <IconButton Icon={Icon.EditUnbordered} accent={Accent.SECONDARY} size={Size.NORMAL} />
              </Stack.Item>
              <Stack.Item>
                <IconButton Icon={Icon.Delete} accent={Accent.SECONDARY} size={Size.NORMAL} />
              </Stack.Item>
            </Stack>
          </Stack.Item>
        </Stack>
      </Stack.Item>
      <Stack.Item style={{ width: '100%' }}>
        <Tag accent={Accent.PRIMARY}>
          <b>Avec PV</b>
        </Tag>
      </Stack.Item>
      <Stack.Item style={{ width: '100%' }}>
        <Title as="h3">{infraction?.observations ? infraction?.observations : 'Aucune observation'}</Title>
      </Stack.Item>
    </Stack>
  )
}

export default InfractionSummary
