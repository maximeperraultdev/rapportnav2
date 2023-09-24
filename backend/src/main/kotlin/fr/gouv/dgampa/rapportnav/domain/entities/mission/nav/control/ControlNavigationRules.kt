package fr.gouv.dgampa.rapportnav.domain.entities.mission.nav.control

import java.util.*

data class ControlNavigationRules(
    val id: UUID,
    val missionId: Int,
    val actionControlId: UUID,
    val confirmed: Boolean?,
    val observations: String?
)
