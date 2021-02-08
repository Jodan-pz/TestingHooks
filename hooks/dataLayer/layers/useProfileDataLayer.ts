import Colors from "../../../constants/Colors"
import { StateManagerDataOptions } from "../../context/stateManagerDataContext";
import { useStateManager } from "../../useStateManager"

const getProfile = (args?: { name: string }) => {
    return new Promise<{ colors: typeof Colors }>((res) => {
        setTimeout(() => {
            res({ colors: Colors })
        }, 2000);
    })
}

export const useProfileDataLayer = (dataPolicy: StateManagerDataOptions) => {
    const profileSM = useStateManager('profile', { ...dataPolicy, scope: 'application' }, getProfile)

    return (
        {
            profile: profileSM.retrieve(),
            getProfile: profileSM.fetch
        }
    )
}