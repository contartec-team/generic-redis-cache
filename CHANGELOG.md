## 1.8.0 (2021-10-23)


### Features

* [`GenericRedisCache`] Refatorar `.setvalue` para retornar o antigo valor do cache

## 1.7.0 (2021-07-22)


### Features

* [`GenericRedisCache`] Add `.getLast`

## 1.6.1 (2021-07-07)


### Bug Fixes

* [`GenericRedisCache`] Corrigir `.get`

## 1.6.0 (2021-06-25)


### Features

* [`GenericJSONArrayCache`] Add `.removeItem`

## 1.5.0 (2021-06-10)


### Features

* [`GenericJSONArrayCache`] Add classe base para `JSON array`

## 1.5.0 (2021-06-10)


### Features

* [`GenericJSONArrayCache`] Add classe base para `JSON array`

## 1.4.1 (2021-06-09)


### Bug Fixes

* [`GenericRedisCache`] `.delete` não remove valores `null`

## 1.4.0 (2021-05-07)


### Features

* [`GenericRedisCache`] Refatorar `.getKeyName` para receber uma `function` no objeto `KeyId`

## 1.3.1 (2021-04-27)


### Bug Fixes

* [`GenericRedisCache`] `.delete` não remove chave caso valor `0`

## 1.3.0 (2021-04-22)


### Features

* [`GenericRedisCache`] Add `.onGetCache`

## 1.2.5 (2021-01-29)


### Code Refactoring

* [`GenericRedisCache`] Refatorar `.get` para tratar chaves nulas

## 1.2.3 (2021-01-10)


### Bug Fixes

* Corrigindo `.setValue` não salvando valores `false`

## 1.2.2 (2021-01-10)


### Bug Fixes

* Corrigindo `.set` não salvando valores `false`

## 1.2.1 (2020-12-09)


### Bug Fixes

* Fixing `.set` not saving `false/null` values

## 1.2.0 (2020-11-19)


### Features

* Alterando configuração da chave para `object`
