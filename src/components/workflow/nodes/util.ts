import { ALL_CHAT_BLOCKS, ALL_COMPLETION_BLOCKS } from "../constants"
import { BlockEnum } from "../types"

export const commonPrevNodes = (chatMode:boolean,inIteration:boolean) => {
    let nodes = chatMode ? ALL_CHAT_BLOCKS : ALL_COMPLETION_BLOCKS
    nodes = nodes.filter(type => type !== BlockEnum.End)
    if (inIteration) {
        nodes = nodes.filter(type => type !== BlockEnum.Start && type !== BlockEnum.Iteration)
    } else {
        nodes = nodes.filter(type => type !== BlockEnum.IterationStart)
    }
    return nodes
}


export const commonNextNodes = (chatMode: boolean, inIteration: boolean) => {
    let nodes = chatMode ? ALL_CHAT_BLOCKS : ALL_COMPLETION_BLOCKS
    nodes = nodes.filter(type => type !== BlockEnum.Start && type !== BlockEnum.IterationStart)
    if (inIteration) {
        nodes = nodes.filter(type => type !== BlockEnum.Iteration && type !== BlockEnum.End)
    }
    return nodes
}