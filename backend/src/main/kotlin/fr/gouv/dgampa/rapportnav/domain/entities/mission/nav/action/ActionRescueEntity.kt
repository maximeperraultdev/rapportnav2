package fr.gouv.dgampa.rapportnav.domain.entities.mission.nav.action

import fr.gouv.dgampa.rapportnav.config.DependentFieldValue
import fr.gouv.dgampa.rapportnav.config.MandatoryForStats
import fr.gouv.dgampa.rapportnav.domain.utils.EntityCompletenessValidator
import fr.gouv.dgampa.rapportnav.infrastructure.bff.model.action.NavActionRescue
import java.time.ZonedDateTime
import java.util.*

data class ActionRescueEntity(
    @MandatoryForStats
    val id: UUID,

    @MandatoryForStats
    val missionId: Int,

    var isCompleteForStats: Boolean? = null,

    @MandatoryForStats
    val startDateTimeUtc: ZonedDateTime,
    val endDateTimeUtc: ZonedDateTime? = null,

    @MandatoryForStats
    val latitude: Float? = null,
    @MandatoryForStats
    val longitude: Float? = null,

    val isVesselRescue: Boolean? = false,
    val isPersonRescue: Boolean? = false,


    val isVesselNoticed: Boolean? = false,
    val isVesselTowed: Boolean? = false,
    val isInSRRorFollowedByCROSSMRCC: Boolean? = false,

    @MandatoryForStats(
        enableIf = [
            DependentFieldValue(
                field = "isPersonRescue",
                value = arrayOf("true")
            ),
        ]
    )
    val numberPersonsRescued: Int?,

    @MandatoryForStats(
        enableIf = [
            DependentFieldValue(
                field = "isPersonRescue",
                value = arrayOf("true")
            ),
        ]
    )
    val numberOfDeaths: Int?,


    val operationFollowsDEFREP: Boolean? = false,
    val observations: String?,
    val locationDescription: String? = null,
    val isMigrationRescue: Boolean? = false,
    val nbAssistedVesselsReturningToShore: Int? = null,
    val nbOfVesselsTrackedWithoutIntervention: Int? = null,
) {

    constructor(
        id: UUID,
        missionId: Int,
        startDateTimeUtc: ZonedDateTime,
        endDateTimeUtc: ZonedDateTime,
        observations: String?,
        latitude: Float? = null,
        longitude: Float? = null,
        isVesselRescue: Boolean? = false,
        isPersonRescue: Boolean? = false,
        isVesselNoticed: Boolean? = false,
        isVesselTowed: Boolean? = false,
        isInSRRorFollowedByCROSSMRCC: Boolean? = false,
        numberPersonsRescued: Int?,
        numberOfDeaths: Int?,
        operationFollowsDEFREP: Boolean? = false,
        locationDescription: String? = null,
        isMigrationRescue: Boolean? = false,
        nbAssistedVesselsReturningToShore: Int? = null,
        nbOfVesselsTrackedWithoutIntervention: Int? = null,

        ) : this(
        id = id,
        missionId = missionId,
        isCompleteForStats = null,
        startDateTimeUtc = startDateTimeUtc,
        endDateTimeUtc = endDateTimeUtc,
        observations = observations,
        latitude = latitude,
        longitude = longitude,
        isVesselRescue = isVesselRescue,
        isPersonRescue = isPersonRescue,
        isVesselNoticed = isVesselNoticed,
        isVesselTowed = isVesselTowed,
        isInSRRorFollowedByCROSSMRCC = isInSRRorFollowedByCROSSMRCC,
        numberPersonsRescued = numberPersonsRescued,
        numberOfDeaths = numberOfDeaths,
        operationFollowsDEFREP = operationFollowsDEFREP,
        locationDescription = locationDescription,
        isMigrationRescue = isMigrationRescue,
        nbAssistedVesselsReturningToShore = nbAssistedVesselsReturningToShore,
        nbOfVesselsTrackedWithoutIntervention = nbOfVesselsTrackedWithoutIntervention,
    ) {
        // completeness for stats being computed at class instantiation in constructor
        this.isCompleteForStats = EntityCompletenessValidator.isCompleteForStats(this)
    }


    fun toNavActionEntity(): NavActionEntity {
        return NavActionEntity(
            id = id,
            missionId = missionId,
            isCompleteForStats = isCompleteForStats,
            startDateTimeUtc = startDateTimeUtc,
            endDateTimeUtc = endDateTimeUtc,
            actionType = ActionType.RESCUE,
            rescueAction = this
        )
    }

    fun toNavActionRescue(): NavActionRescue {
        return NavActionRescue(
            id = id,
            missionId = missionId,
            startDateTimeUtc = startDateTimeUtc,
            endDateTimeUtc = endDateTimeUtc,
            isVesselTowed = isVesselTowed,
            isVesselNoticed = isVesselNoticed,
            isVesselRescue = isVesselRescue,
            isPersonRescue = isPersonRescue,
            observations = observations,
            numberOfDeaths = numberOfDeaths,
            operationFollowsDEFREP = operationFollowsDEFREP,
            latitude = latitude,
            longitude = longitude,
            isInSRRorFollowedByCROSSMRCC = isInSRRorFollowedByCROSSMRCC,
            numberPersonsRescued = numberPersonsRescued,
            locationDescription = locationDescription,
            isMigrationRescue = isMigrationRescue,
            nbAssistedVesselsReturningToShore = nbAssistedVesselsReturningToShore,
            nbOfVesselsTrackedWithoutIntervention = nbOfVesselsTrackedWithoutIntervention
        )
    }
}
