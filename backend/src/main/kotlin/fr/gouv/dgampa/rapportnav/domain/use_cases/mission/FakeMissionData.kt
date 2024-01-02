package fr.gouv.dgampa.rapportnav.domain.use_cases.mission

import fr.gouv.dgampa.rapportnav.config.UseCase
import fr.gouv.dgampa.rapportnav.domain.entities.mission.MissionActionEntity
import fr.gouv.dgampa.rapportnav.domain.entities.mission.MissionEntity
import fr.gouv.dgampa.rapportnav.domain.entities.mission.env.MissionSourceEnum
import fr.gouv.dgampa.rapportnav.domain.entities.mission.env.MissionTypeEnum
import fr.gouv.dgampa.rapportnav.domain.entities.mission.env.envActions.*
import fr.gouv.dgampa.rapportnav.domain.entities.mission.nav.action.ExtendedEnvActionEntity
import fr.gouv.dgampa.rapportnav.domain.entities.user.User
import org.locationtech.jts.geom.Coordinate
import java.time.ZonedDateTime
import java.util.*

@UseCase
class FakeMissionData(
    private val getFishActionsByMissionId: GetFishActionsByMissionId,
) {

    fun getEmptyMissionIds(): List<Int> {
        return listOf(621, 311, 761)
    }

    fun getFullMissionIds(): List<Int> {
        return listOf(622, 312, 762)
    }

    fun getEnvActionIds(): List<String> {
        return getFullMissionIds().map { missionId ->
            "226d84bc-e6c5-4d29-8a5f-7db642f99$missionId"
        }
    }

    fun getFishActionIds(): List<String> {
        return getFullMissionIds().map { missionId ->
            (missionId + 1).toString()
        } + getFullMissionIds().map { missionId ->
            (missionId + 2).toString()
        }
    }

    fun envControls(missionId: Int): List<ExtendedEnvActionEntity> {
        val envActionControl1 = EnvActionControlEntity(
            id = UUID.fromString("226d84bc-e6c5-4d29-8a5f-7db642f99$missionId"),
            actionStartDateTimeUtc = ZonedDateTime.parse("2024-01-09T10:00:00Z"),
            actionEndDateTimeUtc = null,  // Set to null if not provided in your API response
            themes = listOf(
                ThemeEntity(
                    theme = "Rejets illicites",
                    subThemes = listOf("avitaillement", "soutage"),
                    protectedSpecies = listOf()
                )
            ),
            geom = createMockMultiPoint(listOf(Coordinate(-8.52318191, 48.30305604))),
            actionNumberOfControls = 2,
            actionTargetType = ActionTargetTypeEnum.VEHICLE,
            vehicleType = VehicleTypeEnum.VESSEL,
            observations = "Observation",
            isComplianceWithWaterRegulationsControl = true,
            isSafetyEquipmentAndStandardsComplianceControl = true,
            isSeafarersControl = false,
            isAdministrativeControl = false,
            infractions = listOf(
                InfractionEntity(
                    id = "91200795-2823-46b3-8814-a5b3bca29$missionId",
                    natinf = listOf("4210", "28732"),
                    registrationNumber = "123ABC57",
                    companyName = null,
                    relevantCourt = null,
                    infractionType = InfractionTypeEnum.WITHOUT_REPORT,
                    formalNotice = FormalNoticeEnum.NO,
                    toProcess = false,
                    controlledPersonIdentity = "M. Bernard",
                    vesselType = VesselTypeEnum.COMMERCIAL,
                    vesselSize = VesselSizeEnum.FROM_24_TO_46m
                )
            )
        )
        return listOf(ExtendedEnvActionEntity.fromEnvActionEntity(envActionControl1)!!)
    }

    fun fullMission(missionId: Int): MissionEntity {

        val envActions = envControls(missionId).map {
            MissionActionEntity.EnvAction(it)
        }
        val fishActions = getFishActionsByMissionId.getFakeActions(missionId).map {
            MissionActionEntity.FishAction(it)
        }

        return MissionEntity(
            id = missionId,
            missionTypes = listOf(MissionTypeEnum.SEA),
            missionSource = MissionSourceEnum.RAPPORTNAV,
            startDateTimeUtc = ZonedDateTime.parse("2024-01-08T08:00:00Z"),
            endDateTimeUtc = ZonedDateTime.parse("2024-01-22T20:00:00Z"),
            isClosed = false,
            isDeleted = false,
            isGeometryComputedFromControls = false,
            hasMissionOrder = false,
            isUnderJdp = false,
            openBy = "fake",
            actions = fishActions + envActions
        )
    }

    fun emptyMission(missionId: Int): MissionEntity {
        return MissionEntity(
            id = missionId,
            missionTypes = listOf(MissionTypeEnum.SEA),
            missionSource = MissionSourceEnum.RAPPORTNAV,
            startDateTimeUtc = ZonedDateTime.parse("2024-01-08T08:00:00Z"),
            endDateTimeUtc = ZonedDateTime.parse("2024-01-22T20:00:00Z"),
            isClosed = false,
            isDeleted = false,
            isGeometryComputedFromControls = false,
            hasMissionOrder = false,
            isUnderJdp = false,
            openBy = "fake",
            actions = listOf(),
        )
    }

    fun getFakeMissionsforUser(user: User?): List<MissionEntity> {
        return when (user?.serviceId) {
            // bouteillon
            7 -> {
                return listOf(fullMission(621), emptyMission(622))
            }
            // Ariane
            3 -> {
                return listOf(fullMission(311), emptyMission(312))
            }
            // d'Alba
            6 -> {
                return listOf(fullMission(761), emptyMission(762))
            }
            // else
            else -> {
                return listOf()
            }
        }
    }
}
