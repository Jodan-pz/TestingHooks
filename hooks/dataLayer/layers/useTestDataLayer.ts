import { DataPolicy } from "../../context/dataContext"
import { useStateManager } from "../../useStateManager"

const testAPI = (args: { name: string }) => Promise.resolve(args.name + args.name)


export const useTestDataLayer = (dataPolicy: DataPolicy) => {
    const test = useStateManager('test', dataPolicy, testAPI)

    return (
        {
            testData: test.retrieve(),
            getTestData: test.fetch
        }
    )
}