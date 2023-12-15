package fr.gouv.dgampa.rapportnav.domain.entities.mission.env.controlResources

data class LegacyControlUnitResourceEntity(
    val id: Int,
    val controlUnitId: Int,
    val name: String,
) {
    override fun equals(other: Any?): Boolean {
        if (this === other) return true
        if (javaClass != other?.javaClass) return false

        other as LegacyControlUnitResourceEntity

        return id == other.id
    }

    override fun hashCode(): Int {
        return id
    }
}