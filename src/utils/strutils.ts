import _ from 'lodash';

export function isBlank(str: string) {
    return _.isNil(str) || _.trim(str) === ''
}
  

export function isNotBlank(str: string) {
    return !isBlank(str)
}