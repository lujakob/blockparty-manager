import * as moment from 'moment';

export function getHolderSince(item, user, defaultReturn = '') {
  const username = user && user.uid === item.holder.id ? 'me' : item.holder.username;
  if (item.holder && item.holder.username) {
    const now = new (moment as any)();
    const created = new (moment as any)(item.holder.created);
    const duration = Math.ceil(moment.duration(now.diff(created)).asMinutes());

    return username + ` (${duration} mins)`;
  }

  return defaultReturn;
}
