import * as moment from 'moment';

export function getHolderSince(item, user, defaultReturn = '') {
  if (!item.holder) {
    return '';
  }

  const username = user && user.uid === item.holder.id ? 'me' : item.holder.username;
  if (item.holder && item.holder.username) {
    const now = new (moment as any)();
    const created = new (moment as any)(item.holder.created);
    const duration = moment.duration(now.diff(created));
    const days = duration.days();
    const hours = duration.hours();
    const minutes = duration.minutes();

    let ret = username;

    if (days > 0 || hours > 0 || minutes > 0) {
      ret = ret + ' (' + (days ? days + 'd ' : '') + (hours ? hours + 'h ' : '') + (minutes ? minutes + 'm' : '') + ')';
    }

    return ret;
  }

  return defaultReturn;
}
