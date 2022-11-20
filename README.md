# Gamification by FriendsOfFlarum

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/fof/gamification.svg)](https://packagist.org/packages/fof/gamification) [![OpenCollective](https://img.shields.io/badge/opencollective-fof-blue.svg)](https://opencollective.com/fof/donate)  

[![Extiverse](https://extiverse.com/extension/fof/gamification/open-graph-image)](https://extiverse.com/extension/fof/gamification)

A [Flarum](http://flarum.org) extension. Add upvotes, downvotes, and ranks to your Flarum Community!

Upvote and downvote posts anonymously, and reward active users with ranks, and sort posts by hotness/popularity.

- Q: How is hotness sorted ? 
- A: The total amount of hotness is got between the amount of votes on the discussion and the posts inside of it. Also, newer posts with the same amount of upvotes as another post will have more hotness, so time is also an influent factor.

### Installation

Install manually with composer:

```sh
composer require fof/gamification
```

You can optionally convert your likes into upvotes, as well as calculate the hotness of all previously existing discussions.

### Updating

```sh
composer update fof/gamification
php flarum migrate
php flarum cache:clear
```

### Commands

Gamification doesn't need any CRON job, every calculated value will update itself automatically as needed.

However, if the calculated values become out of date as a result of a database migration, due to the extension being temporarily disabled or to import existing data when first using the extension, you can use the following commands to fix the values.

The following commands can be run in the Flarum folder:

#### `php flarum fof:gamification:assign-groups`

Updates all users in the database to match the current "Automatically assigned groups" rules.

Even if a user was manually assigned to a group, the group will still be removed if it doesn't match the rules.

#### `php flarum fof:gamification:resync`

Updates all discussions with their total first post votes.

#### `php flarum fof:gamification:resyncUsers`

Updates all users with a forced recalculation of points.

### Links

[<img src="https://opencollective.com/fof/donate/button@2x.png?color=blue" height="25" />](https://opencollective.com/fof/donate)

- [Packagist](https://packagist.org/packages/fof/gamification)
- [GitHub](https://github.com/FriendsOfFlarum/gamification)

An extension by [FriendsOfFlarum](https://github.com/FriendsOfFlarum).
