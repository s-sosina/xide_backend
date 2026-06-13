import moment from 'moment-timezone';

export function getNigerianTime() {
  return moment().tz('Africa/Lagos').toDate();
}
