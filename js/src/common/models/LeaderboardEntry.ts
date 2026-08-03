import Model from 'flarum/common/Model';
import type User from 'flarum/common/models/User';

/**
 * One place on the leaderboard.
 *
 * Entries are computed per request rather than stored, so the position and the
 * score belong to this ranking rather than to the user: the same person has a
 * different entry under a different metric or period.
 */
export default class LeaderboardEntry extends Model {
  position() {
    return Model.attribute<number>('position').call(this);
  }

  score() {
    return Model.attribute<number>('score').call(this);
  }

  /**
   * Places gained since the previous window, "new" for somebody who was not
   * ranked in it, or null when there is no previous window at all.
   */
  movement() {
    return Model.attribute<string | null>('movement').call(this);
  }

  user() {
    return Model.hasOne<User>('user').call(this);
  }
}
