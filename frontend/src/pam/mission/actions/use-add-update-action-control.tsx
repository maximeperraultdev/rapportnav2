import { gql, MutationTuple, useMutation } from '@apollo/client'
import { GET_MISSION_TIMELINE } from "../timeline/use-mission-timeline.tsx";
import { GET_ACTION_BY_ID } from "./use-action-by-id.tsx";
import { ActionControl } from "../../../types/action-types.ts";
import { useParams } from "react-router-dom";

export const MUTATION_ADD_OR_UPDATE_ACTION_CONTROL = gql`
  mutation AddOrUpdateControl($controlAction: ActionControlInput!) {
    addOrUpdateControl(controlAction: $controlAction) {
      id
      startDateTimeUtc
      endDateTimeUtc
      latitude
      longitude
      controlMethod
      observations
      vesselIdentifier
      vesselType
      vesselSize
      identityControlledPerson
    }
  }
`


const useAddOrUpdateControl = (): MutationTuple<ActionControl, Record<string, any>> => {
  const {missionId} = useParams()
  const mutation = useMutation(
    MUTATION_ADD_OR_UPDATE_ACTION_CONTROL,
    {
      refetchQueries: [
        {query: GET_MISSION_TIMELINE, variables: {missionId}},
        GET_ACTION_BY_ID
      ]
    }
  )

  return mutation
}

export default useAddOrUpdateControl
