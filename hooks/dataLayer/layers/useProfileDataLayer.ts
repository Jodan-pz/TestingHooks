import Colors from "../../../constants/Colors"
import { DataPolicy } from "../../context/dataContext"
import { useStateManager } from "../../useStateManager"

const getProfile = (args?: { name: string }) => {
    return new Promise<{colors: typeof Colors}>( (res)=>{
        setTimeout(() => {
            res({colors:Colors})
        }, 2000);
    })
}

export const useProfileDataLayer = (dataPolicy: DataPolicy) => {
    const profileSM = useStateManager('profile', {scope:'application'}, getProfile)

    return (
        {
            profile: profileSM.retrieve(),
            getProfile: profileSM.fetch
        }
    )
}