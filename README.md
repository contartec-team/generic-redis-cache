# Generic service for operations on redis cache

[![CircleCI](https://dl.circleci.com/status-badge/img/gh/kajoo-team/generic-redis-cache/tree/master.svg?style=svg)](https://dl.circleci.com/status-badge/redirect/gh/kajoo-team/generic-redis-cache/tree/master)
[![Maintainability](https://api.codeclimate.com/v1/badges/73ad71c4dce850d6f9d4/maintainability)](https://codeclimate.com/github/kajoo-team/generic-redis-cache/maintainability)
[![Test Coverage](https://codecov.io/gh/kajoo-team/generic-redis-cache/branch/master/graph/badge.svg)](https://codecov.io/gh/kajoo-team/generic-redis-cache)

A set of generic model methods to inherit

## Install

`npm i @kajoo-team/generic-redis-cache`

## Quick-start

```js
app/
  caches/
  models/
  index.js
```

```js
// index.js (aka bootstrap/init file)
// Pass the `redis` instance
require('@kajoo-team/generic-redis-cache/lib/configs/redisInstanceService')(redis)
```

```js
// caches/DogCache.js
const Dog = require('../models/Dog')
const GenericRedisCache = require('@kajoo-team/generic-redis-cache')
const RedisKeyTypeEnum = require('@kajoo-team/generic-redis-cache/lib/enums/RedisKeyTypeEnum')

const GENERIC_REDIS_ATTRS = {
  keyName     : 'people:{?}:dogs:{?}',
  type        : RedisKeyTypeEnum.JSON,
  ids         : [
    { id: 'peopleId' },
    { id: 'name' }
  ],
  idNull      : 'null',
  idUndefined : 'undefined'
}

class DogCache extends GenericRedisCache {
  static getDB (key) {
    // Used to fetch the model from `db`
    // key = { peopleId: ?, name: ? }
    const dog = await Dog.findById(key)

    return dog
  }

  static getListDB (keys) {
    // Used to fetch the model's list from `db`
    // key = [ { peopleId: ?, name: ? }, ... ]
  }
}

// Dogs in `db`
const randomDogs = [
  {
    id        : 1,
    guardianId: 10,
    name      : 'Hun',
    weight    : 10
  },
  {
    id        : 2,
    guardianId: 10,
    name      : 'Kora',
    weight    : 13
  },
  {
    id        : 3,
    guardianId: 30,
    name      : 'Molo',
    weight    : 42
  },
  {
    id        : 4,
    guardianId: 40,
    name      : 'Quaza',
    weight    : 23
  },
  {
    id        : 5,
    guardianId: 50,
    name      : 'Kora',
    weight    : 5
  },
]

Dog
  .get({ name: 'Kora', guardianId: 50 })
// Calls Dog.getDB
// JSON.SET guardian:50:dogs:Kora
// { id: 5, guardianId: 50, name: 'Kora', weight: 5 }

Dog
  .getCache({ name: 'Molo', guardianId: 30 })
// JSON.GET guardian:30:dogs:Molo NOESCAPE .
// null

Dog
  .setList(randomDogs)
// JSON.SET guardian:10:dogs:Hun ; JSON.SET guardian:20:dogs:Kora ; ...
// [ { id: 1, name: 'Hun', ... }, { id: 2, name: 'Kora', ... }, ... ]

Dog
  .getCache({ name: 'Kora', guardianId: 10 })
// JSON.GET guardian:10:dogs:Kora NOESCAPE .
// { id: 1, guardianId: 10, name: 'Kora', weight: 13 }

```

## Docs

https://kajoo-team.github.io/generic-redis-cache/index.html