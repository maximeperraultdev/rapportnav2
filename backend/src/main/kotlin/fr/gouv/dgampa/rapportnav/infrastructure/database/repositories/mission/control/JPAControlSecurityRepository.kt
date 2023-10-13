package fr.gouv.dgampa.rapportnav.infrastructure.database.repositories.mission.control

import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.dgampa.rapportnav.domain.entities.mission.nav.control.ControlSecurity
import fr.gouv.dgampa.rapportnav.domain.repositories.mission.control.IControlSecurityRepository
import fr.gouv.dgampa.rapportnav.infrastructure.database.model.mission.control.ControlSecurityModel
import fr.gouv.dgampa.rapportnav.infrastructure.database.repositories.interfaces.mission.control.IDBControlSecurityRepository
import org.springframework.dao.InvalidDataAccessApiUsageException
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional


@Repository
class JPAControlSecurityRepository(
    private val dbControlSecurityRepository: IDBControlSecurityRepository,
    private val mapper: ObjectMapper,
) : IControlSecurityRepository {

        override fun findAllByMissionId(missionId: Int): List<ControlSecurity> {
        // TODO call correct function filtering by mission id
            TODO("Not yet implemented")
//        return dbControlEquipmentAndSecurityRepository.findAll().map { it.toControlEquipmentAndSecurity() }

    }

    @Transactional
    override fun save(control: ControlSecurity): ControlSecurity {
        return try {
            val controlModel = ControlSecurityModel.fromControlSecurity(control, mapper)
            dbControlSecurityRepository.save(controlModel).toControlSecurity()
        } catch (e: InvalidDataAccessApiUsageException) {
            throw Exception("Error saving or updating Security Control", e)
        }
    }


}
