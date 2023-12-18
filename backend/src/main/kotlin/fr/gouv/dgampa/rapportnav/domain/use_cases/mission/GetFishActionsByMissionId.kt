package fr.gouv.dgampa.rapportnav.domain.use_cases.mission

import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.ObjectMapper
import fr.gouv.dgampa.rapportnav.config.UseCase
import fr.gouv.dgampa.rapportnav.domain.entities.mission.fish.fishActions.*
import fr.gouv.dgampa.rapportnav.domain.entities.mission.nav.action.ExtendedFishActionEntity
import fr.gouv.dgampa.rapportnav.domain.repositories.mission.IFishActionRepository
import fr.gouv.dgampa.rapportnav.domain.use_cases.mission.action.AttachControlsToActionControl
import io.sentry.Sentry
import org.n52.jackson.datatype.jts.JtsModule
import org.slf4j.LoggerFactory
import java.net.URI
import java.net.http.HttpClient
import java.net.http.HttpRequest
import java.net.http.HttpResponse
import java.time.ZonedDateTime


@UseCase
class GetFishActionsByMissionId(
    private val attachControlsToActionControl: AttachControlsToActionControl,
    private val fishActionRepo: IFishActionRepository,
) {

    private val logger = LoggerFactory.getLogger(GetFishActionsByMissionId::class.java)
    fun execute(missionId: Int): List<ExtendedFishActionEntity> {
        try {
            val fishActions = fishActionRepo.findFishActions(missionId = missionId)
            val actions = fishActions.map {
                var action = ExtendedFishActionEntity.fromMissionAction(it)
                action = attachControlsToActionControl.toFishAction(
                    actionId = it.id?.toString(),
                    action = action
                )
                action
            }
            return actions
        } catch (e: Exception) {
            logger.error("GetFishActionsByMissionId failed loading Actions", e)
            Sentry.captureMessage("GetFishActionsByMissionId failed loading Actions")

            Sentry.captureException(e)

            val gearControlInstance = GearControl()
            gearControlInstance.gearCode = "ABC123"
            gearControlInstance.gearName = "Example Gear"
            gearControlInstance.declaredMesh = 10.5
            gearControlInstance.controlledMesh = 9.0
            gearControlInstance.hasUncontrolledMesh = true
            gearControlInstance.gearWasControlled = false
            gearControlInstance.comments = "Some comments"

            val species1 = SpeciesControl()
            species1.underSized = true
            species1.speciesCode = "RJN – Raie fleurie"
            species1.controlledWeight = 329.2
            species1.declaredWeight = 244.0
            val species2 = SpeciesControl()
            species2.underSized = true
            species2.speciesCode = "HKE – Merlu européen"
            species2.declaredWeight = 2964.0

            val missionAction1 = MissionAction(
                id = 10,
                missionId = 10,
                vesselId = 5232556,
                vesselName = "Le ZORBA",
                latitude = 48.389999,
                longitude = -4.490000,
                facade = "Outre-Mer",
                actionType = MissionActionType.SEA_CONTROL,
                actionDatetimeUtc = ZonedDateTime.parse("2022-02-17T18:50:09Z"),
                flightGoals = listOf(),
                logbookInfractions = listOf(),
                gearInfractions = listOf(),
                speciesInfractions = listOf(
                    SpeciesInfraction(),
                    SpeciesInfraction()
                ),
                otherInfractions = listOf(
                    OtherInfraction()
                ),
                controlUnits = listOf(),
                isDeleted = false,
                isAdministrativeControl = true,
                isSafetyEquipmentAndStandardsComplianceControl = true,
                emitsVms = ControlCheck.YES,
                emitsAis = ControlCheck.NO,
                logbookMatchesActivity = ControlCheck.NOT_APPLICABLE,
                licencesMatchActivity = ControlCheck.NO,
                licencesAndLogbookObservations = "Lorem ipsum bla bla",
                gearOnboard = listOf(gearControlInstance),
                speciesObservations = "Lorem ipsum blablabla ",
                speciesSizeControlled = true,
                speciesWeightControlled = false,
                separateStowageOfPreservedSpecies = ControlCheck.NOT_APPLICABLE,
                speciesOnboard = listOf(species1, species2),
                seizureAndDiversion = true,
                seizureAndDiversionComments = "navire dérouté",
                hasSomeGearsSeized = true,
                hasSomeSpeciesSeized = false,
                otherComments = "Exiting from \"ASYNC\" dispatch, status 200 - Exiting from \"ASYNC\" dispatch, status 200 - Exiting from \"ASYNC\" dispatch, status 200",
                vesselTargeted = ControlCheck.YES,
                unitWithoutOmegaGauge = true,
                controlQualityComments = "Lorem ipsum bla bla Lorem ipsum bla blaLorem ipsum bla blaLorem ipsum bla bla Lorem ipsum bla bla",
                feedbackSheetRequired = false,
                userTrigram = "LKH",
                faoAreas = listOf("38.1", "38.2", "38.3", "38.4", "38.5"),
                segments = listOf(
                    FleetSegment("MED01", "Chaluts de fond"),
                    FleetSegment("MED02", "Chaluts pélagique"),
                    FleetSegment("MED03", "Chaluts de bord")
                )

            )
            val missionAction2 = MissionAction(
                id = 11,
                missionId = 10,
                vesselId = 5232556,
                vesselName = "Le POILLET",
                latitude = 48.389999,
                longitude = -4.490000,
                facade = "Outre-Mer",
                actionType = MissionActionType.SEA_CONTROL,
                actionDatetimeUtc = ZonedDateTime.parse("2022-02-18T18:50:09Z"),
                flightGoals = listOf(),
                logbookInfractions = listOf(
                    LogbookInfraction(infractionType = InfractionType.WITHOUT_RECORD),
                    LogbookInfraction(infractionType = InfractionType.WITH_RECORD)
                ),
                gearInfractions = listOf(
                    GearInfraction(infractionType = InfractionType.WITH_RECORD)
                ),
                speciesInfractions = listOf(),
                otherInfractions = listOf(),
                controlUnits = listOf(),
                isDeleted = false,
                isAdministrativeControl = true,
                isSafetyEquipmentAndStandardsComplianceControl = true,
                emitsVms = ControlCheck.YES,
                emitsAis = ControlCheck.NO,
                logbookMatchesActivity = ControlCheck.NOT_APPLICABLE,
                licencesMatchActivity = ControlCheck.NO,
                licencesAndLogbookObservations = null,
                gearOnboard = listOf(GearControl()),
                speciesObservations = null,
                speciesSizeControlled = false,
                speciesWeightControlled = false,
                separateStowageOfPreservedSpecies = ControlCheck.NOT_APPLICABLE,
                speciesOnboard = listOf(),
                seizureAndDiversion = false,
                seizureAndDiversionComments = null,
                hasSomeGearsSeized = false,
                hasSomeSpeciesSeized = false,
                otherComments = null,
                vesselTargeted = ControlCheck.NOT_APPLICABLE,
                unitWithoutOmegaGauge = false,
                controlQualityComments = null,
                feedbackSheetRequired = false,
                userTrigram = null,
                faoAreas = listOf("38.1"),
                segments = listOf(FleetSegment("MED01", "Chaluts de fond"))

            )

            val actions = listOf(missionAction1, missionAction2).map {
                var action = ExtendedFishActionEntity.fromMissionAction(it)
                action = attachControlsToActionControl.toFishAction(
                    actionId = it.id?.toString(),
                    action = action
                )
                action
            }



            return actions
        }


    }
}
