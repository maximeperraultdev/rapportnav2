package fr.gouv.dgampa.rapportnav.domain.use_cases.missions

import fr.gouv.dgampa.rapportnav.config.UseCase
import fr.gouv.dgampa.rapportnav.domain.entities.mission.nav.NavMissionEntity
import fr.gouv.dgampa.rapportnav.domain.repositories.mission.action.INavActionControlRepository
import fr.gouv.dgampa.rapportnav.domain.repositories.mission.action.INavActionStatusRepository
import fr.gouv.dgampa.rapportnav.domain.use_cases.missions.action.AttachControlsToActionControl
import fr.gouv.dgampa.rapportnav.domain.use_cases.missions.control.GetControlByActionId
import org.slf4j.LoggerFactory

@UseCase
class GetNavMissionById(
    private val navActionControlRepository: INavActionControlRepository,
    private val navStatusRepository: INavActionStatusRepository,
    private val attachControlsToActionControl: AttachControlsToActionControl,
) {
    private val logger = LoggerFactory.getLogger(GetNavMissionById::class.java)

    fun execute(missionId: Int): NavMissionEntity {
        val controls = navActionControlRepository
            .findAllByMissionId(missionId = missionId)
            .map { actionControl ->
                attachControlsToActionControl.toNavAction(
                    actionId = actionControl.id.toString(),
                    action = actionControl
                ).toNavAction()
            }


        val statuses = navStatusRepository.findAllByMissionId(missionId = missionId)
            .map { it.toActionStatusEntity() }
            .map { it.toNavAction() }
        val actions = controls + statuses
        val mission = NavMissionEntity(id = missionId, actions = actions)
        return mission
    }

}
