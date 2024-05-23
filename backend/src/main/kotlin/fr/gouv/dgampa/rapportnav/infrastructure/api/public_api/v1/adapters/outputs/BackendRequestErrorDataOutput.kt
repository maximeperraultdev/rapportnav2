package fr.gouv.dgampa.rapportnav.infrastructure.api.public_api.v1.adapters.outputs

import fr.gouv.dgampa.rapportnav.infrastructure.exceptions.BackendRequestErrorCode


/**
 * Error output to use when the request is invalid.
 *
 * ## Examples
 * - The request has missing or wrongly-typed properties.
 * - The request has valid properties but is made of illogical data.
 *
 * ## Logging
 * The related exception is logged as a warning on the Backend side in order to track any unexpected behavior.
 * It should definitely be logged on the Frontend side as an error.
 */
data class BackendRequestErrorDataOutput(
    val code: BackendRequestErrorCode,
    val data: Any? = null,
    val message: String? = null,
)
