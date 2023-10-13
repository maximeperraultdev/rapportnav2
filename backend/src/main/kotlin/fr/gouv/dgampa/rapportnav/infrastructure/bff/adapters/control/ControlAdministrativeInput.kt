package fr.gouv.dgampa.rapportnav.infrastructure.bff.adapters.control

import fr.gouv.dgampa.rapportnav.domain.entities.mission.nav.control.ControlAdministrative
import java.util.*

data class ControlAdministrativeInput(
    val id: UUID,
    val missionId: Int,
    val actionControlId: UUID,
    val confirmed: Boolean?,
    val compliantOperatingPermit: Boolean?,
    val upToDateNavigationPermit: Boolean?,
    val compliantSecurityDocuments: Boolean?,
    val observations: String?
) {
    fun toControlAdministrative(): ControlAdministrative {
        return ControlAdministrative(
            id = id,
            missionId = missionId,
            actionControlId = actionControlId,
            confirmed = confirmed,
            compliantOperatingPermit = compliantOperatingPermit,
            upToDateNavigationPermit = upToDateNavigationPermit,
            compliantSecurityDocuments = compliantSecurityDocuments,
            observations = observations
        )
    }
}
