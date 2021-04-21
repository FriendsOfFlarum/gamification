# Gamification by FriendsOfFlarum

![License](https://img.shields.io/badge/license-MIT-blue.svg) [![Latest Stable Version](https://img.shields.io/packagist/v/fof/gamification.svg)](https://packagist.org/packages/fof/gamification) [![OpenCollective](https://img.shields.io/badge/opencollective-fof-blue.svg)](https://opencollective.com/fof/donate)  

A [Flarum](http://flarum.org) extension. Add upvotes, downvotes, and ranks to your Flarum Community!

Upvote and downvote posts anonymously, and reward active users with ranks, and sort posts by hotness/popularity.

**Note:** This extension is meant as a replacement for the Flarum Likes extension. Therefore, they are not compatible and it's recommended to disable the Likes extension.

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
```

### Links

[<img src="https://opencollective.com/fof/donate/button@2x.png?color=blue" height="25" />](https://opencollective.com/fof/donate)

- [Packagist](https://packagist.org/packages/fof/gamification)
- [GitHub](https://github.com/FriendsOfFlarum/gamification)

An extension by [FriendsOfFlarum](https://github.com/FriendsOfFlarum).
