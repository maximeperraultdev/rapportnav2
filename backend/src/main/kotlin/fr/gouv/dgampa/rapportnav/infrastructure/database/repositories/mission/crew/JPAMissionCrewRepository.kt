package fr.gouv.dgampa.rapportnav.infrastructure.database.repositories.mission.crew

import fr.gouv.dgampa.rapportnav.domain.entities.mission.nav.crew.MissionCrewEntity
import fr.gouv.dgampa.rapportnav.domain.repositories.mission.crew.IMissionCrewRepository
import fr.gouv.dgampa.rapportnav.infrastructure.database.model.mission.crew.MissionCrewModel
import fr.gouv.dgampa.rapportnav.infrastructure.database.repositories.interfaces.mission.crew.IDBAgentRepository
import fr.gouv.dgampa.rapportnav.infrastructure.database.repositories.interfaces.mission.crew.IDBAgentRoleRepository
import fr.gouv.dgampa.rapportnav.infrastructure.database.repositories.interfaces.mission.crew.IDBMissionCrewRepository
import jakarta.transaction.Transactional
import org.springframework.dao.InvalidDataAccessApiUsageException
import org.springframework.stereotype.Repository

@Repository
class JPAMissionCrewRepository(
  private val dbCrewRepository: IDBMissionCrewRepository,
  private val dbAgentRepository: IDBAgentRepository,
  private val dbAgentRoleRepository: IDBAgentRoleRepository,
) : IMissionCrewRepository {
  override fun findByMissionId(missionId: Int): List<MissionCrewModel> {
    return dbCrewRepository.findByMissionId(missionId)
  }

  @Transactional
  override fun save(crew: MissionCrewEntity): MissionCrewModel {
    return try {
      val agent = dbAgentRepository.findById(crew.agent.id!!).orElseThrow()
      val role = dbAgentRoleRepository.findById(crew.role.id!!).orElseThrow()

      val crewModel = MissionCrewModel.fromMissionCrewEntity(crew)
      crewModel.agent = agent
      crewModel.role = role
      dbCrewRepository.save(crewModel)
    } catch (e: InvalidDataAccessApiUsageException) {
      throw Exception("[JPA] Error saving or updating MissionCrew", e)
    }
  }
}
