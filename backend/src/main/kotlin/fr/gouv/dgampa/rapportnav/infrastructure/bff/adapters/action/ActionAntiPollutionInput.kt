package fr.gouv.dgampa.rapportnav.infrastructure.bff.adapters.action

import fr.gouv.dgampa.rapportnav.domain.entities.mission.nav.action.ActionAntiPollutionEntity
import java.time.ZonedDateTime
import java.util.*

class ActionAntiPollutionInput(
    var id: UUID? = null,
    var missionId: Int,
    var startDateTimeUtc: ZonedDateTime,
    var endDateTimeUtc: ZonedDateTime,
    var observations: String? = null
) {

    fun toActionAntiPollutionEntity(): ActionAntiPollutionEntity {
        return ActionAntiPollutionEntity(
            id = id?: UUID.randomUUID(),
            missionId = missionId,
            startDateTimeUtc = startDateTimeUtc,
            endDateTimeUtc = endDateTimeUtc,
            observations = observations
        )
    }
}
