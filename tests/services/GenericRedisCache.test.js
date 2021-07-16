'use strict'

const faker = require('faker')

const GenericRedisCache = rewire('../lib/services/GenericRedisCache')

const GenericRedisCacheMock = require('../mocks/GenericRedisCacheMock')

const GenericJSONCache = require('../../lib/services/types/GenericJSONCache')
const GenericJSONCacheMock = require('../mocks/GenericJSONCacheMock')
const GenericHASHCache = require('../../lib/services/types/GenericHASHCache')
const GenericSTRINGCache = require('../../lib/services/types/GenericSTRINGCache')
const GenericJSONArrayCache = require('../../lib/services/types/GenericJSONArrayCache')

const JSONKeySingleID = require('../cache/JSON/JSONKeySingleID')
const JSONKeySingleIDWithUndefined = require('../cache/JSON/JSONKeySingleIDWithUndefined')
const JSONKeySingleIDWithNull = require('../cache/JSON/JSONKeySingleIDWithNull')
const JSONKeyNoID = require('../cache/JSON/JSONKeyNoID')

const JSONKeyMultiID = require('../cache/JSON/JSONKeyMultiID')
const JSONKeyMultiIDWithUndefined = require('../cache/JSON/JSONKeyMultiIDWithUndefined')
const JSONKeyMultiIDWithNull = require('../cache/JSON/JSONKeyMultiIDWithNull')

const JSONArrayKeyMultiID = require('../cache/JSON_ARRAY/JSONArrayKeyMultiID')
const JSONArrayKeySingleID = require('../cache/JSON_ARRAY/JSONArrayKeySingleID')

const HASHKeySingleID = require('../cache/HASH/HASHKeySingleID')

const STRINGKeySingleID = require('../cache/STRING/STRINGKeySingleID')

const SpyMock = require('@contartec-team/spy-mock/lib/SpyMock')
const { expect } = require('chai')

describe('GenericRedisCache', () => {
  before(function*() {
    yield clear_database()
  })

  describe('.getKeyName', () => {
    context('when the `key` is passed', () => {
      context('when the `KEY_NAME` has one id', () => {
        context('and the `key` is a `string`', () => {
          it('should return the key name', () => {
            const key = 'value'
            const compareKeyName = JSONKeySingleID.GENERIC_REDIS_ATTRS.keyName.replace('{?}', key)
            const keyName = JSONKeySingleID.getKeyName(key)

            expect(keyName).to.eql(compareKeyName)
          })

          context('and the `key` contains `:` symbols', () => {
            it('should return the key name', () => {
              const key = 'aa:bb:cc'
              const compareKeyName = JSONKeySingleID.GENERIC_REDIS_ATTRS.keyName.replace('{?}', key.replace(/:/g, ''))
              const keyName = JSONKeySingleID.getKeyName(key)

              expect(keyName).to.eql(compareKeyName)
            })
          })
        })

        context('and the `key` is a `Number`', () => {
          it('should return the key name', () => {
            const key = Math.floor(Math.random() * 100) + 1
            const compareKeyName = JSONKeySingleID.GENERIC_REDIS_ATTRS.keyName.replace('{?}', key)
            const keyName = JSONKeySingleID.getKeyName(key)

            expect(keyName).to.eql(compareKeyName)
          })
        })

        context('and the `key` is an `Object`', () => {
          context('and `key` has one attr', () => {
            context('and the `attr` is a `string`', () => {
              it('should return the key name', () => {
                const objectKey = { id: 'id' }
                const compareKeyName = JSONKeySingleID.GENERIC_REDIS_ATTRS.keyName.replace('{?}', objectKey.id)
                const keyName = JSONKeySingleID.getKeyName(objectKey)

                expect(keyName).to.eql(compareKeyName)
              })
            })

            context('and the `attr` is a Number', () => {
              it('should return the key name', () => {
                const objectKey = { id: Math.floor(Math.random() * 100) + 1}
                const compareKeyName = JSONKeySingleID.GENERIC_REDIS_ATTRS.keyName.replace('{?}', objectKey.id)
                const keyName = JSONKeySingleID.getKeyName(objectKey)

                expect(keyName).to.eql(compareKeyName)
              })
            })

            context('and the `attr` is `undefined`', () => {
              context('and the `ID` has no `idUndefined` defined', () => {
                it('should return the key name with the default `DEFAULT_UNDEFINED_ID` value', () => {
                  const objectKey = { id: undefined }
                  const compareKeyName = JSONKeySingleID.GENERIC_REDIS_ATTRS.keyName.replace('{?}', GenericRedisCache.DEFAULT_GENERIC_REDIS_ATTRS.idUndefined)
                  const keyName = JSONKeySingleID.getKeyName(objectKey)

                  expect(keyName).to.eql(compareKeyName)
                })
              })

              context('and the `ID` has an `idUndefined` defined', () => {
                it('should return the key name with the `idUndefined` attr', () => {
                  const objectKey = { id: undefined }
                  const compareKeyName = JSONKeySingleIDWithUndefined.GENERIC_REDIS_ATTRS.keyName.replace('{?}', JSONKeySingleIDWithUndefined.GENERIC_REDIS_ATTRS.ids[0].idUndefined)
                  const keyName = JSONKeySingleIDWithUndefined.getKeyName(objectKey)

                  expect(keyName).to.eql(compareKeyName)
                })
              })
            })

            context('and the `attr` is `null`', () => {
              context('and the `ID` has no `idNull` defined', () => {
                it('should return the key name with the default `DEFAULT_NULL_ID` value', () => {
                  const objectKey = { id: null }
                  const compareKeyName = JSONKeySingleID.GENERIC_REDIS_ATTRS.keyName.replace('{?}', GenericRedisCache.DEFAULT_GENERIC_REDIS_ATTRS.idNull)
                  const keyName = JSONKeySingleID.getKeyName(objectKey)

                  expect(keyName).to.eql(compareKeyName)
                })
              })

              context('and the `ID` has an `idNull` defined', () => {
                it('should return the key name with the `idNull` attr', () => {
                  const objectKey = { id: null }
                  const compareKeyName = JSONKeySingleIDWithNull.GENERIC_REDIS_ATTRS.keyName.replace('{?}', JSONKeySingleIDWithNull.GENERIC_REDIS_ATTRS.ids[0].idNull)
                  const keyName = JSONKeySingleIDWithNull.getKeyName(objectKey)

                  expect(keyName).to.eql(compareKeyName)
                })
              })
            })
          })

          context('and `key` has none attr', () => {
            it('should return the key name with `DEFAULT_UNDEFINED_ID`', () => {
              const objectKey = {}
              let compareKeyName = JSONKeySingleID.GENERIC_REDIS_ATTRS.keyName.replace('?', GenericRedisCache.DEFAULT_GENERIC_REDIS_ATTRS.idUndefined)
              compareKeyName = compareKeyName.replace(/{/g, '')
              compareKeyName = compareKeyName.replace(/}/g, '')
              const keyName = JSONKeySingleID.getKeyName(objectKey)

              expect(keyName).to.eql(compareKeyName)
            })
          })

          context('and `key` has more than one attr', () => {
            it('should return the `keyName`', () => {
              const objectKey = { id: 'teste', id2: 'teste2' }
              const keyName = JSONKeySingleID.getKeyName(objectKey)
              const compareKeyName = JSONKeySingleID.GENERIC_REDIS_ATTRS.keyName.replace('{?}', objectKey.id)

              expect(keyName).to.eql(compareKeyName)
            })
          })
        })
      })

      context('when the `KEY_NAME` has more than one id', () => {
        context ('and the `ids` have no idUndefined or idNull options', () => {
          context('and the `key` is an `object`', () => {
            context('and all the attrs have values', () => {
              it('should return the key name', () => {
                const objectKey = {
                  id  : 'aa:bb:cc',
                  id2 : Math.floor(Math.random() * 100) + 1,
                  id3 : Math.floor(Math.random() * 100) + 1
                }

                const idsIndexes = JSONKeyMultiID.getIdIndexes(JSONKeyMultiID.GENERIC_REDIS_ATTRS.keyName)

                const chars = JSONKeyMultiID.GENERIC_REDIS_ATTRS.keyName.split('')

                Object.keys(objectKey).forEach((key, index) => {
                  chars[idsIndexes[index]] = typeof(objectKey[key]) == 'string' ? objectKey[key].replace(/:/g, '') : objectKey[key]
                })

                let compareKeyName = chars.join('')

                compareKeyName = compareKeyName.replace(/{/g, '')
                compareKeyName = compareKeyName.replace(/}/g, '')

                const keyName = JSONKeyMultiID.getKeyName(objectKey)

                expect(keyName).to.eql(compareKeyName)
              })
            })

            context('and the attrs have `undefined` values', () => {
              it('should return the key name`', () => {
                const objectKey = {
                  id  : 'aa:bb:cc',
                  id2 : undefined,
                  id3 : undefined
                }

                let compareKeyName = JSONKeyMultiID.GENERIC_REDIS_ATTRS.keyName.replace('{?}', objectKey.id.replace(/:/g, ''))
                JSONKeyMultiID.GENERIC_REDIS_ATTRS.ids.forEach((objectId, index) => {
                  if (index > 0) {
                    compareKeyName = compareKeyName
                      .replace('{?}', JSONKeyMultiID.DEFAULT_UNDEFINED_ID)
                  }
                })
                const keyName = JSONKeyMultiID.getKeyName(objectKey)

                expect(keyName).to.eql(compareKeyName)
              })
            })

            context('and the attrs have null values', () => {
              it('should return the key name', () => {
                const objectKey = {
                  id  : 'aa:bb:cc',
                  id2 : null,
                  id3 : null
                }

                let compareKeyName = JSONKeyMultiID.GENERIC_REDIS_ATTRS.keyName.replace('{?}', objectKey.id.replace(/:/g, ''))
                JSONKeyMultiID.GENERIC_REDIS_ATTRS.ids.forEach((objectId, index) => {
                  if (index > 0) {
                    compareKeyName = compareKeyName
                      .replace('{?}', GenericRedisCache.DEFAULT_GENERIC_REDIS_ATTRS.idNull)
                  }
                })
                const keyName = JSONKeyMultiID.getKeyName(objectKey)

                expect(keyName).to.eql(compareKeyName)
              })
            })

            context('and the `key` has less attrs than the `ID` size', () => {
              it('should set the unpresents `ids` to the defaut `undefined` value', () => {
                const objectKey = {
                  id  : 'aa:bb:cc',
                  id2 : 'teste'
                }

                const chars = JSONKeyMultiID.GENERIC_REDIS_ATTRS.keyName.split('')
                const idsIndexes = JSONKeyMultiID.getIdIndexes(JSONKeyMultiID.GENERIC_REDIS_ATTRS.keyName)

                idsIndexes.forEach((indexKeyName, index) =>  {
                  const paramKey = Object.keys(objectKey)[index]

                  if (paramKey)
                    chars[indexKeyName] = objectKey[paramKey].replace(/:/g, '')
                  else {
                    chars[indexKeyName] = JSONKeyMultiID.GENERIC_REDIS_ATTRS.ids[index].idUndefined ?
                      JSONKeyMultiID.GENERIC_REDIS_ATTRS.ids[index].idUndefined :
                      GenericRedisCache.DEFAULT_GENERIC_REDIS_ATTRS.idUndefined
                  }
                })

                let compareKeyName = chars.join('')
                compareKeyName = compareKeyName.replace(/{/g, '')
                compareKeyName = compareKeyName.replace(/}/g, '')

                const keyName = JSONKeyMultiID.getKeyName(objectKey)

                expect(keyName).to.eql(compareKeyName)
              })
            })
          })

          context('and the `key` is a `string`', () => {
            it('should return the key name', () => {
              const key = 'value'
              let compareKeyName = JSONKeyMultiID.GENERIC_REDIS_ATTRS.keyName.replace('{?}', key)
              JSONKeyMultiID.GENERIC_REDIS_ATTRS.ids.forEach((objectId, index) => {
                if (index > 0) {
                  compareKeyName = compareKeyName
                    .replace('{?}', JSONKeyMultiID.DEFAULT_UNDEFINED_ID)
                }
              })
              const keyName = JSONKeyMultiID.getKeyName(key)

              expect(keyName).to.eql(compareKeyName)
            })
          })

          context('and the `key` is a `Number`', () => {
            it('should return the key name', () => {
              const key = Math.floor(Math.random() * 100) + 1
              let compareKeyName = JSONKeyMultiID.GENERIC_REDIS_ATTRS.keyName.replace('{?}', key)
              JSONKeyMultiID.GENERIC_REDIS_ATTRS.ids.forEach((objectId, index) => {
                if (index > 0) {
                  compareKeyName = compareKeyName
                    .replace('{?}', JSONKeyMultiID.DEFAULT_UNDEFINED_ID)
                }
              })
              const keyName = JSONKeyMultiID.getKeyName(key)

              expect(keyName).to.eql(compareKeyName)
            })
          })
        })

        context('and the `ids` have `undefined` options', () => {
          context('and the `key` is an `object` with undefined `attrs`', () => {
            it('should return the key name', () => {
              const objectKey = {
                id  : 'aa:bb:cc',
                id2 : undefined
              }

              const idsIndexes = GenericRedisCache.getIdIndexes(JSONKeyMultiIDWithUndefined.GENERIC_REDIS_ATTRS.keyName)

              const chars = JSONKeyMultiIDWithUndefined.GENERIC_REDIS_ATTRS.keyName.split('')

              Object.keys(objectKey).forEach((key, index) => {
                chars[idsIndexes[index]] = typeof(objectKey[key]) == 'string' ? objectKey[key].replace(/:/g, '') : JSONKeyMultiIDWithUndefined.GENERIC_REDIS_ATTRS.ids[index].idUndefined
              })

              let compareKeyName = chars.join('')

              compareKeyName = compareKeyName.replace(/{/g, '')
              compareKeyName = compareKeyName.replace(/}/g, '')

              const keyName = JSONKeyMultiIDWithUndefined.getKeyName(objectKey)

              expect(keyName).to.eql(compareKeyName)
            })
          })

          context('and the `key` has less attrs than the `ID` size', () => {
            it('should set the unpresents `ID` values to the `idUndefined`', () => {
              const objectKey = {
                id: 'aa:bb:cc'
              }

              const chars = JSONKeyMultiIDWithUndefined.GENERIC_REDIS_ATTRS.keyName.split('')
              const idsIndexes = GenericRedisCache.getIdIndexes(JSONKeyMultiIDWithUndefined.GENERIC_REDIS_ATTRS.keyName)

              idsIndexes.forEach((indexKeyName, index) =>  {
                const paramKey = Object.keys(objectKey)[index]

                if (paramKey)
                  chars[indexKeyName] = objectKey[paramKey].replace(/:/g, '')
                else
                  chars[indexKeyName] =  JSONKeyMultiIDWithUndefined.GENERIC_REDIS_ATTRS.ids[index].idUndefined
              })

              let compareKeyName = chars.join('')
              compareKeyName = compareKeyName.replace(/{/g, '')
              compareKeyName = compareKeyName.replace(/}/g, '')

              const keyName = JSONKeyMultiIDWithUndefined.getKeyName(objectKey)

              expect(keyName).to.eql(compareKeyName)
            })
          })

          context('and the `key` is an `string`', () => {
            it('should return the key name', () => {
              const key = 'value'
              let compareKeyName = JSONKeyMultiIDWithUndefined.GENERIC_REDIS_ATTRS.keyName.replace('{?}', key)
              JSONKeyMultiIDWithUndefined.GENERIC_REDIS_ATTRS.ids.forEach((objectId, index) => {
                if (index > 0) {
                  compareKeyName = compareKeyName
                    .replace('{?}', objectId.idUndefined)
                }
              })
              const keyName = JSONKeyMultiIDWithUndefined.getKeyName(key)

              expect(keyName).to.eql(compareKeyName)
            })
          })

          context('and the `key` is an `Number`', () => {
            it('should return the key name', () => {
              const key = Math.floor(Math.random() * 100) + 1
              let compareKeyName = JSONKeyMultiIDWithUndefined.GENERIC_REDIS_ATTRS.keyName.replace('{?}', key)
              JSONKeyMultiIDWithUndefined.GENERIC_REDIS_ATTRS.ids.forEach((objectId, index) => {
                if (index > 0) {
                  compareKeyName = compareKeyName
                    .replace('{?}',  objectId.idUndefined)
                }
              })
              const keyName = JSONKeyMultiIDWithUndefined.getKeyName(key)

              expect(keyName).to.eql(compareKeyName)
            })
          })
        })

        context('and the `ids` have `null` options', () => {
          context('and the `key` is an `object` with null `attrs`', () => {
            it('should return the key name', () => {
              const objectKey = {
                id: 'aa:bb:cc',
                id2: null
              }

              const idsIndexes = GenericRedisCache.getIdIndexes(JSONKeyMultiIDWithNull.GENERIC_REDIS_ATTRS.keyName)

              const chars = JSONKeyMultiIDWithNull.GENERIC_REDIS_ATTRS.keyName.split('')

              Object.keys(objectKey).forEach((key, index) => {
                chars[idsIndexes[index]] = typeof(objectKey[key]) == 'string' ? objectKey[key].replace(/:/g, '') : JSONKeyMultiIDWithNull.GENERIC_REDIS_ATTRS.ids[index].idNull
              })

              let compareKeyName = chars.join('')

              compareKeyName = compareKeyName.replace(/{/g, '')
              compareKeyName = compareKeyName.replace(/}/g, '')

              const keyName = JSONKeyMultiIDWithNull.getKeyName(objectKey)

              expect(keyName).to.eql(compareKeyName)
            })
          })

          context('and the `key` has less attrs than the `ID` size', () => {
            it('should set the unpresents `ID` values to the `idUndefined`', () => {
              const objectKey = {
                id: 'aa:bb:cc'
              }

              const chars = JSONKeyMultiIDWithNull.GENERIC_REDIS_ATTRS.keyName.split('')
              const idsIndexes = GenericRedisCache.getIdIndexes(JSONKeyMultiIDWithNull.GENERIC_REDIS_ATTRS.keyName)

              idsIndexes.forEach((indexKeyName, index) =>  {
                const paramKey = Object.keys(objectKey)[index]

                if (paramKey)
                  chars[indexKeyName] = objectKey[paramKey].replace(/:/g, '')
                else
                  chars[indexKeyName] =  GenericRedisCache.DEFAULT_GENERIC_REDIS_ATTRS.idUndefined
              })

              let compareKeyName = chars.join('')
              compareKeyName = compareKeyName.replace(/{/g, '')
              compareKeyName = compareKeyName.replace(/}/g, '')

              const keyName = JSONKeyMultiIDWithNull.getKeyName(objectKey)

              expect(keyName).to.eql(compareKeyName)
            })
          })

          context('and the `key` is an `string`', () => {
            it('should return the key name', () => {
              const key = 'value'
              let compareKeyName = JSONKeyMultiIDWithNull.GENERIC_REDIS_ATTRS.keyName.replace('{?}', key)
              JSONKeyMultiIDWithNull.GENERIC_REDIS_ATTRS.ids.forEach((objectId, index) => {
                if (index > 0) {
                  compareKeyName = compareKeyName
                    .replace('{?}', GenericRedisCache.DEFAULT_GENERIC_REDIS_ATTRS.idUndefined)
                }
              })
              const keyName = JSONKeyMultiIDWithNull.getKeyName(key)

              expect(keyName).to.eql(compareKeyName)
            })
          })

          context('and the `key` is an `Number`', () => {
            it('should return the key name', () => {
              const key = Math.floor(Math.random() * 100) + 1
              let compareKeyName = JSONKeyMultiIDWithNull.GENERIC_REDIS_ATTRS.keyName.replace('{?}', key)
              JSONKeyMultiIDWithNull.GENERIC_REDIS_ATTRS.ids.forEach((objectId, index) => {
                if (index > 0) {
                  compareKeyName = compareKeyName
                    .replace('{?}', GenericRedisCache.DEFAULT_GENERIC_REDIS_ATTRS.idUndefined)
                }
              })
              const keyName = JSONKeyMultiIDWithNull.getKeyName(key)

              expect(keyName).to.eql(compareKeyName)
            })
          })
        })
      })
    })

    context('when the `key` is not passed', () => {
      context('when the cache have `ID` elements', () => {
        context ('and the `ids` have no `idUndefined`  options', () => {
          it('should replace all the `ids` with the `DEFAULT_UNDEFINED_ID` value', () => {
            const idsIndexes = GenericRedisCache.getIdIndexes(JSONKeyMultiID.GENERIC_REDIS_ATTRS.keyName)
            const chars = JSONKeyMultiID.GENERIC_REDIS_ATTRS.keyName.split('')

            idsIndexes.forEach((indexKeyName) =>  {
              chars[indexKeyName] =  GenericRedisCache.DEFAULT_GENERIC_REDIS_ATTRS.idUndefined
            })

            let compareKeyName = chars.join('')

            compareKeyName = compareKeyName.replace(/{/g, '')
            compareKeyName = compareKeyName.replace(/}/g, '')

            const keyName = JSONKeyMultiID.getKeyName()

            expect(keyName).to.eql(compareKeyName)
          })
        })

        context ('and the `ids` have `idUndefined`  options', () => {
          it('should replace all the `ids` with the `idUndefined` values', () => {
            const idsIndexes = GenericRedisCache.getIdIndexes(JSONKeyMultiIDWithUndefined.GENERIC_REDIS_ATTRS.keyName)
            const chars = JSONKeyMultiIDWithUndefined.GENERIC_REDIS_ATTRS.keyName.split('')

            idsIndexes.forEach((indexKeyName, index) =>  {
              chars[indexKeyName] =  JSONKeyMultiIDWithUndefined.GENERIC_REDIS_ATTRS.ids[index].idUndefined ?
                JSONKeyMultiIDWithUndefined.GENERIC_REDIS_ATTRS.ids[index].idUndefined :
                GenericRedisCache.DEFAULT_GENERIC_REDIS_ATTRS.idUndefined
            })

            let compareKeyName = chars.join('')

            compareKeyName = compareKeyName.replace(/{/g, '')
            compareKeyName = compareKeyName.replace(/}/g, '')

            const keyName = JSONKeyMultiIDWithUndefined.getKeyName()

            expect(keyName).to.eql(compareKeyName)
          })
        })
      })

      context('when the cache have no `ID` elements', () => {
        it('should return the `KEY_NAME` itself', () => {
          const keyName = JSONKeyNoID.getKeyName()

          expect(keyName).to.eql(JSONKeyNoID.GENERIC_REDIS_ATTRS.keyName)
        })
      })
    })
  })

  describe('.getKeyNames', () => {
    context('when `keys` is passed', () => {
      context('and it is an `Object`', () => {
        context('and `keys` has the same size of attrs than the key `ID`', () => {
          it('should return an `Array` with the key names', async () => {
            const KEY_NAME_SIZES = Array.from({length: Object.keys(JSONKeyMultiID.GENERIC_REDIS_ATTRS.ids).length}, () => Math.floor((Math.random() * 50) + 1))
            const keys = {
              primaries: Array.from({length: KEY_NAME_SIZES[0]}, () => Math.floor(Math.random() * 99)),
              secondaries: Array.from({length: KEY_NAME_SIZES[1]}, () => Math.floor(Math.random() * 99)),
              thirds: Array.from({length: KEY_NAME_SIZES[2]}, () => Math.floor(Math.random() * 99))
            }

            const result = await JSONKeyMultiID.getKeyNames(keys)

            expect(result.length).to.eql(KEY_NAME_SIZES.reduce( (a,b) => a * b ))
            expect(result[0][JSONKeyMultiID.GENERIC_REDIS_ATTRS.ids[0].id]).not.to.be.null
          })
        })

        context('and `keys` has a lower size of attrs than the key `ID`', () => {
          it('should return an `Array` with the key names', async () => {
            const KEY_NAME_SIZES = Array.from({length: Object.keys(JSONKeyMultiID.GENERIC_REDIS_ATTRS.ids).length}, () => Math.floor((Math.random() * 50) + 1))
            const keys = {
              primaries: Array.from({length: KEY_NAME_SIZES[0]}, () => Math.floor(Math.random() * 99))
            }

            const result = await JSONKeyMultiID.getKeyNames(keys)

            expect(result.length).to.eql(KEY_NAME_SIZES[0])
            expect(result[0][JSONKeyMultiID.GENERIC_REDIS_ATTRS.ids[0].id]).not.to.be.null
            expect(result[0][JSONKeyMultiID.GENERIC_REDIS_ATTRS.ids[1].id]).to.be.undefined
          })
        })

        context('and `keys` has a greather size of attrs than the key `ID`', async() => {
          it('should return an empty `Array`', async () => {
            const KEY_NAME_SIZES = Array.from({length: 4}, () => Math.floor((Math.random() * 50) + 1))
            const keys = {
              primaries: Array.from({length: KEY_NAME_SIZES[0]}, () => Math.floor(Math.random() * 99)),
              secondaries: Array.from({length: KEY_NAME_SIZES[1]}, () => Math.floor(Math.random() * 99)),
              thirds: Array.from({length: KEY_NAME_SIZES[2]}, () => Math.floor(Math.random() * 99)),
              extra: Array.from({length: KEY_NAME_SIZES[3]}, () => Math.floor(Math.random() * 99))
            }

            const result = await JSONKeyMultiID.getKeyNames(keys)

            expect(result.length).to.eql(0)
          })
        })
      })

      context('and it is an `Array`', () => {
        context('and cache `ID` has one attr', () => {
          it('should return an `Array` with the key names', async () => {
            const KEY_NAME_SIZE = 5
            const keys = Array.from({length: KEY_NAME_SIZE}, () => Math.floor(Math.random() * 99))

            const result = await JSONKeySingleID.getKeyNames(keys)

            expect(result.length).to.eql(KEY_NAME_SIZE)
          })
        })

        context('and cache `ID` has more than one attr', () => {
          it('should return an `Array` with the key names', async() => {
            const KEY_NAME_SIZE = 5
            const keys = Array.from({length: KEY_NAME_SIZE}, () => Math.floor(Math.random() * 99))

            const result = await JSONKeyMultiID.getKeyNames(keys)

            expect(result.length).to.eql(KEY_NAME_SIZE)
            expect(result[0][JSONKeyMultiID.GENERIC_REDIS_ATTRS.ids[1].id]).to.be.undefined
          })
        })
      })
    })

    context('when `keys` is not passed', () => {
      context('and `IDS` have one attr', () => {
        context('and it has an `idUndefined`', () => {
          context('and there are keys on cache', () => {
            const KEYS_SIZE = 3
            let keyNames

            before(async () => {
              const values = Array.from({length: KEYS_SIZE}, () => Math.floor(Math.random() * 999))
              const objectValues = values.map((value) => {
                const object = {}
                object[JSONKeySingleIDWithUndefined.GENERIC_REDIS_ATTRS.ids[0].id] = value
                return object
              })

              keyNames = await JSONKeySingleIDWithUndefined.getKeyNames(values)

              await GenericJSONCacheMock.addList(keyNames, objectValues)
            })

            after(async () => {
              await GenericJSONCacheMock.delete(keyNames)
            })

            it ('should return all the keys', async() => {
              const result = await JSONKeySingleIDWithUndefined.getKeyNames()

              expect(result.length).to.eql(KEYS_SIZE)
            })
          })

          context('and there are no keys on cache', () => {
            it ('should return an empty array', async() => {
              const result = await JSONKeySingleIDWithUndefined.getKeyNames()

              expect(result.length).to.eql(0)
            })
          })
        })
      })
    })
  })

  describe('.getKeyNamesObjects', () => {
    context('when `object` is passed', () => {
      context('and `object` is an `Object`', () => {
        context('and `ids` is passed', () => {
          context('and `ids` is an array of `Objects`', () => {
            context('and `ids` has one item', () => {
              it('should return an `array` with the objects', () => {
                const KEY_NAMES_SIZE = 5
                const IDS = [ { id: 'key_name_id' } ]
                const object = {
                  key_name_ids: Array.from({length: KEY_NAMES_SIZE}, () => Math.floor(Math.random() * KEY_NAMES_SIZE))
                }

                const result = GenericRedisCache.getKeyNamesObjects(object, IDS)

                expect(result.length).to.eql(KEY_NAMES_SIZE)
              })
            })

            context('and `ids` has more than one item', () => {
              it('should return an `array` with the objects', () => {
                const IDS = [
                  { id: 'key_name_id' },
                  { id: 'key_name_id2' },
                  { id: 'key_name_id3' }
                ]

                const KEY_NAME_SIZES = Array.from({length: Object.keys(IDS).length}, () => Math.floor((Math.random() * 50) + 1))

                const object = {
                  key_name_ids: Array.from({length: KEY_NAME_SIZES[0]}, () => Math.floor(Math.random() * 99)),
                  key_name_ids2: Array.from({length: KEY_NAME_SIZES[1]}, () => Math.floor(Math.random() * 99)),
                  key_name_ids3: Array.from({length: KEY_NAME_SIZES[2]}, () => Math.floor(Math.random() * 99)),
                }

                const result = GenericRedisCache.getKeyNamesObjects(object, IDS)

                expect(result.length).to.eql(KEY_NAME_SIZES.reduce( (a,b) => a * b ))
              })
            })
          })

          context('and `ids` is not an array', () => {
            it('should return an empty `array`', () => {
              const result = GenericRedisCache.getKeyNamesObjects('test', 'ids')

              expect(result).to.eql([])
            })
          })
        })

        context('and `ids` is not passed', () => {
          it('should return an empty `array`', () => {
            const result = GenericRedisCache.getKeyNamesObjects('test')

            expect(result).to.eql([])
          })
        })
      })

      context('and `object` is not an `Object`', () => {
        it('should return an empty `array`', () => {
          const result = GenericRedisCache.getKeyNamesObjects('test', [])

          expect(result).to.eql([])
        })
      })
    })

    context('when `object` is not passed', () => {
      it('should return an empty `array`', () => {
        const result = GenericRedisCache.getKeyNamesObjects(null, [])

        expect(result).to.eql([])
      })
    })
  })

  describe('.getCache', () => {
    context('when the key is `JSON`', () => {
      context('and the key has one `ID`', () => {
        const VALUE = 2
        const CACHE_VALUE = { test: VALUE }

        context('when there is value cached', () => {
          before(async () => {
            await GenericJSONCacheMock.add(JSONKeySingleID.getKeyName(VALUE), CACHE_VALUE)
          })

          after(async () => {
            await GenericJSONCacheMock.delete(JSONKeySingleID.getKeyName(VALUE))
          })

          context('and a `key` is passed', () => {
            it('should return the cached object', async () => {
              const result = await JSONKeySingleID.getCache(VALUE)

              expect(result).to.eql(CACHE_VALUE)
            })
          })

          context('and a `key` is not passed', () => {
            it('should not return the cached object', async () => {
              const result = await JSONKeySingleID.getCache()

              expect(result).to.be.null
            })
          })
        })

        context('when there is no value cached', () => {
          it('should return null', async () => {
            const result = await JSONKeySingleID.getCache(VALUE)

            expect(result).to.be.null
          })
        })
      })

      context('and the key has more than one `ID`', () => {
        const VALUES = {
          object_id: Math.floor((Math.random() * 50) + 1),
          second_id: Math.floor((Math.random() * 50) + 1),
          third_id: Math.floor((Math.random() * 50) + 1)
        }

        const CACHE_VALUE = { x: 1 }

        context('when there value cached', () => {
          before(async () => {
            await GenericJSONCacheMock.add(JSONKeyMultiID.getKeyName(VALUES), CACHE_VALUE)
          })

          after(async () => {
            await GenericJSONCacheMock.delete(JSONKeyMultiID.getKeyName(VALUES))
          })

          it('should return the cached object', async () => {
            const result = await JSONKeyMultiID.getCache(VALUES)

            expect(result).to.eql(CACHE_VALUE)
          })
        })

        context('when there is no value cached', () => {
          it('should return null', async () => {
            const result = await JSONKeyMultiID.getCache(VALUES)

            expect(result).to.be.null
          })
        })
      })
    })

    context('when the key is `HASH`', () => {
      const VALUE = 1

      context('and there is value cached', () => {
        before(async () => {
          await GenericHASHCache.setCache(HASHKeySingleID.getKeyName(VALUE), VALUE, VALUE)
        })

        after(async () => {
          await GenericHASHCache.delete(HASHKeySingleID.getKeyName(VALUE), VALUE)
        })

        it('should return the cached object', async () => {
          const result = await HASHKeySingleID.getCache(VALUE)

          expect(result).to.eql(VALUE)
        })
      })

      context('and there is no value cached', () => {
        it('should return null', async () => {
          const result = await HASHKeySingleID.getCache(VALUE)

          expect(result).to.be.null
        })
      })
    })

    context('when the key is `STRING`', () => {
      const VALUE = 'string_value'

      context('and there is value cached', () => {
        before(async () => {
          await GenericSTRINGCache.setCache(STRINGKeySingleID.getKeyName(VALUE), VALUE)
        })

        after(async () => {
          await GenericSTRINGCache.delete(STRINGKeySingleID.getKeyName(VALUE))
        })

        it('should return the cached object', async () => {
          const result = await STRINGKeySingleID.getCache(VALUE)

          expect(result).to.eql([VALUE])
        })
      })

      context('and there is no value cached', () => {
        it('should return null', async () => {
          const result = await STRINGKeySingleID.getCache(VALUE)

          expect(result).to.eql([])
        })
      })
    })

    context('when the key is `JSON_ARRAY`', () => {
      context('and the key has one `ID`', () => {
        const VALUE = 3
        const CACHE_VALUE = { teste: VALUE }

        context('when there is value cached', () => {
          before(async () => {
            await GenericJSONArrayCache
              .initArrayCache(JSONArrayKeySingleID.getKeyName(VALUE), CACHE_VALUE)
          })

          after(async () => {
            await GenericJSONCacheMock
              .delete(JSONArrayKeySingleID.getKeyName(VALUE))
          })

          context('and a `key` is passed', () => {
            it('should return the cached array', async () => {
              const result = await JSONArrayKeySingleID
                .getCache(VALUE)

              expect(result).to.eql([CACHE_VALUE])
            })
          })

          context('and a `key` is not passed', () => {
            it('should not return the cached array', async () => {
              const result = await JSONArrayKeySingleID
                .getCache()

              expect(result).to.be.null
            })
          })
        })

        context('when there is no value cached', () => {
          it('should return null', async () => {
            const result = await JSONArrayKeySingleID
              .getCache(VALUE)

            expect(result).to.be.null
          })
        })
      })

      context('and the key has more than one `ID`', () => {
        const VALUES = {
          object_id: Math.floor(faker.datatype.number(50) + 1),
          second_id: Math.floor(faker.datatype.number(50) + 1),
          third_id: Math.floor(faker.datatype.number(50) + 1)
        }

        const CACHE_VALUE = { x: 1 }

        context('when there value cached', () => {
          before(async () => {
            await GenericJSONArrayCache
              .initArrayCache(JSONArrayKeyMultiID.getKeyName(VALUES), CACHE_VALUE)
          })

          after(async () => {
            await GenericJSONCacheMock
              .delete(JSONArrayKeyMultiID.getKeyName(VALUES))
          })

          it('should return the cached object', async () => {
            const result = await JSONArrayKeyMultiID
              .getCache(VALUES)

            expect(result).to.eql([CACHE_VALUE])
          })
        })

        context('when there is no value cached', () => {
          it('should return null', async () => {
            const result = await JSONArrayKeyMultiID
              .getCache(VALUES)

            expect(result).to.be.null
          })
        })
      })
    })
  })

  describe('.getLast', () => {
    context('when the key is `JSON_ARRAY`', () => {
      context('and the key has one `ID`', () => {
        const VALUE = 1

        context('when there is value cached', () => {
          context('and a `key` is passed', () => {
            context('and the value is not an empty list', () => {
              let cacheValue
              let response

              before(async () => {
                cacheValue = [
                  { teste: faker.datatype.number(100) },
                  { teste: faker.datatype.number(100) },
                  { teste: faker.datatype.number(100) }
                ]

                await GenericJSONArrayCache
                  .initArrayCache(JSONArrayKeySingleID.getKeyName(VALUE), cacheValue)
                
                response = await JSONArrayKeySingleID
                  .getLast(VALUE)
              })
    
              after(async () => {
                await GenericJSONCacheMock
                  .delete(JSONArrayKeySingleID.getKeyName(VALUE))
              })

              it('should return the last object in the cache array', async () => {
                const lastObject = cacheValue.pop()
  
                expect(response).to.eql(lastObject)
              })
            })

            context('and the value is an empty list', () => {
              let cacheValue
              let response

              before(async () => {
                cacheValue = []

                await GenericJSONArrayCache
                  .initArrayCache(JSONArrayKeySingleID.getKeyName(VALUE), cacheValue)

                response = await JSONArrayKeySingleID
                  .getLast(VALUE)
              })
    
              after(async () => {
                await GenericJSONCacheMock
                  .delete(JSONArrayKeySingleID.getKeyName(VALUE))
              })

              it('should return `null`', async () => {
                expect(response).to.be.null
              })
            })
          })

          context('and a `key` is not passed', () => {
            let response

            before(async () => {
              response = await JSONArrayKeySingleID
                .getLast()
            })

            it('should return `null`', async () => {
              expect(response).to.be.null
            })
          })
        })

        context('when there are no value cached', () => {
          let response

          before(async () => {
            response = await JSONArrayKeySingleID
              .getLast(VALUE)
          })

          it('should return `null`', async () => {
            expect(response).to.be.null
          })
        })
      })

      context('and the key has more than one `ID`', () => {
        const VALUES = {
          object_id: Math.floor(faker.datatype.number(50) + 1),
          second_id: Math.floor(faker.datatype.number(50) + 1),
          third_id: Math.floor(faker.datatype.number(50) + 1)
        }

        context('when there are value cached', () => {
          context('and a `key` is passed', () => {
            context('and the value is not an empty list', () => {
              let cacheValue
              let response

              before(async () => {
                cacheValue = [
                  { teste: faker.datatype.number(100) },
                  { teste: faker.datatype.number(100) },
                  { teste: faker.datatype.number(100) }
                ]

                await GenericJSONArrayCache
                  .initArrayCache(JSONArrayKeyMultiID.getKeyName(VALUES), cacheValue)
                
                response = await JSONArrayKeyMultiID
                  .getLast(VALUES)
              })
    
              after(async () => {
                await GenericJSONCacheMock
                  .delete(JSONArrayKeyMultiID.getKeyName(VALUES))
              })

              it('should return the last object in the cache array', async () => {
                const lastObject = cacheValue.pop()
  
                expect(response).to.eql(lastObject)
              })
            })

            context('and the value is an empty list', () => {
              let cacheValue
              let response

              before(async () => {
                cacheValue = []

                await GenericJSONArrayCache
                  .initArrayCache(JSONArrayKeyMultiID.getKeyName(VALUES), cacheValue)

                response = await JSONArrayKeyMultiID
                  .getLast(VALUES)
              })
    
              after(async () => {
                await GenericJSONCacheMock
                  .delete(JSONArrayKeyMultiID.getKeyName(VALUES))
              })

              it('should return `null`', async () => {
                expect(response).to.be.null
              })
            })
          })

          context('and a `key` is not passed', () => {
            let response

            before(async () => {
              response = await JSONArrayKeyMultiID
                .getLast()
            })

            it('should return `null`', async () => {
              expect(response).to.be.null
            })
          })
        })

        context('when there are no value cached', () => {
          let response

          before(async () => {
            response = await JSONArrayKeyMultiID
              .getLast(VALUES)
          })

          it('should return `null`', async () => {
            expect(response).to.be.null
          })
        })
      })
    })

    context('when the key is not `JSON_ARRAY`', () => {
      const VALUE = 1

      let cacheValue
      let response

      before(async () => {
        cacheValue = [
          { teste: faker.datatype.number(100) },
          { teste: faker.datatype.number(100) },
          { teste: faker.datatype.number(100) }
        ]

        await GenericJSONArrayCache
          .initArrayCache(JSONKeySingleID.getKeyName(VALUE), cacheValue)
        
        response = await JSONKeySingleID
          .getLast(VALUE)
      })

      after(async () => {
        await GenericJSONCacheMock
          .delete(JSONKeySingleID.getKeyName(VALUE))
      })

      it('should return `null`', () => {
        expect(response).to.be.null
      })
    })
  })

  describe('.get', () => {
    context('when there is cached value', () => {
      context('and `getCache` returns an object', () => {
        const VALUE = 1
        const CACHE_VALUE = {
          id: VALUE
        }
  
        let response
  
        before(async () => {
          SpyMock.addReturnSpy(JSONKeySingleID, 'getCache', CACHE_VALUE)
  
          response = await JSONKeySingleID.get(VALUE)
        })
  
        after(() => SpyMock.restoreAll())
  
        it('should return the cached object', () => {
          expect(response).to.eql(CACHE_VALUE)
        })
      })

      context('and `getCache` returns an empty list', () => {
        context('and the key is `JSON_ARRAY`', () => {
          let spies, response
  
          const VALUE = 1
          const OBJECT = {
            id  : VALUE,
            name: `Name: ${VALUE}`
          }
          const KEY_NAME = JSONArrayKeySingleID.getKeyName(VALUE)
  
          context('and `getDB` returns an object', () => {
            before(async () => {
              spies = {
                getCache  :  SpyMock
                  .addReturnSpy(JSONArrayKeySingleID, 'getCache', []),
  
                getDB     : SpyMock
                  .addReturnSpy(JSONArrayKeySingleID, 'getDB', OBJECT)
              }
  
              response = await JSONArrayKeySingleID.get(VALUE)
            })
  
            after(async () => {
              await GenericJSONCacheMock.delete(KEY_NAME)
  
              SpyMock.restoreAll()
            })
  
            it('should call `getDB`', () => {
              expect(spies.getDB).have.been.calledOnce
            })
  
            it('should return the object', () => {
              expect(response).to.eql(OBJECT)
            })
  
            it('should save the object on cache', async () => {
              const cachedObject = await redis
                .json_getAsync(JSONArrayKeySingleID.getKeyName(VALUE))
              
              expect(cachedObject).to.eql(JSON.stringify([OBJECT]))
            })
          })

          context('and `getDB` returns null', () => {
            before(async () => {
              spies = {
                getCache  : SpyMock
                  .addReturnSpy(JSONArrayKeySingleID, 'getCache', []),
  
                getDB     : SpyMock
                  .addReturnSpy(JSONArrayKeySingleID, 'getDB', null),
  
                add       : SpyMock
                  .addReturnSpy(JSONArrayKeySingleID, 'add'),
              }
  
              response = await JSONArrayKeySingleID
                .get(VALUE)
            })
  
            after(() => SpyMock.restoreAll())
  
            it('should call `getDB`', () => {
              expect(spies.getDB).have.been.calledOnce
            })
  
            it('should not call `add`', () => {
              expect(spies.add).to.not.have.been.called
            })
  
            it('should return an empty list', () => {
              expect(response).to.eql([])
            })
          })
        })
      })
    })

    context('when there is no cached value', () => {
      context('and the key is `JSON_ARRAY`', () => {
        let spies, response

        const VALUE = 1
        const OBJECT = {
          id  : VALUE,
          name: `Name: ${VALUE}`
        }
        const KEY_NAME = JSONArrayKeySingleID.getKeyName(VALUE)

        context('and `getDB` returns an object', () => {
          before(async () => {
            spies = {
              getCache  :  SpyMock
                .addReturnSpy(JSONArrayKeySingleID, 'getCache', null),

              getDB     : SpyMock
                .addReturnSpy(JSONArrayKeySingleID, 'getDB', OBJECT)
            }

            response = await JSONArrayKeySingleID.get(VALUE)
          })

          after(async () => {
            await GenericJSONCacheMock.delete(KEY_NAME)

            SpyMock.restoreAll()
          })

          it('should call `getDB`', () => {
            expect(spies.getDB).have.been.calledOnce
          })

          it('should return the object', () => {
            expect(response).to.eql(OBJECT)
          })

          it('should save the object on cache', async () => {
            const cachedObject = await JSONArrayKeySingleID.get(VALUE)

            expect(cachedObject).to.eql(OBJECT)
          })
        })

        context('and `getDB` returns null', () => {
          before(async () => {
            spies = {
              getCache  : SpyMock
                .addReturnSpy(JSONArrayKeySingleID, 'getCache', null),

              getDB     : SpyMock
                .addReturnSpy(JSONArrayKeySingleID, 'getDB', null)
            }

            response = await JSONArrayKeySingleID
              .get(VALUE)
          })

          after(async () => {
            await GenericJSONCacheMock.delete(KEY_NAME)

            SpyMock.restoreAll()
          })

          it('should call `getDB`', () => {
            expect(spies.getDB).have.been.calledOnce
          })

          it('should return `null`', () => {
            expect(response).to.be.null
          })

          it('should save an empty array on cache', async () => {
            const cachedObject = await redis
              .json_getAsync(JSONArrayKeySingleID.getKeyName(VALUE))

            expect(cachedObject).to.eql('[]')
          })
        })
      })

      context('and the key is not `JSON_ARRAY`', () => {
        let spies, response

        const VALUE = 1
        const OBJECT = {
          id  : VALUE,
          name: `Name: ${VALUE}`
        }
        const KEY_NAME = JSONKeySingleID.getKeyName(VALUE)

        context('and `getDB` returns an object', () => {
          before(async () => {
            spies = {
              getCache  :  SpyMock
                .addReturnSpy(JSONKeySingleID, 'getCache', null),

              getDB     : SpyMock
                .addReturnSpy(JSONKeySingleID, 'getDB', OBJECT)
            }

            response = await JSONKeySingleID.get(VALUE)
          })

          after(async () => {
            await GenericJSONCacheMock.delete(KEY_NAME)

            SpyMock.restoreAll()
          })

          it('should call `getDB`', () => {
            expect(spies.getDB).have.been.calledOnce
          })

          it('should return the object', () => {
            expect(response).to.eql(OBJECT)
          })

          it('should save the object on cache', async () => {
            const cachedObject = await JSONKeySingleID.get(VALUE)

            expect(cachedObject).to.eql(OBJECT)
          })
        })

        context('and `getDB` returns null', () => {
          before(async () => {
            spies = {
              getCache  : SpyMock
                .addReturnSpy(JSONKeySingleID, 'getCache', null),

              getDB     : SpyMock
                .addReturnSpy(JSONKeySingleID, 'getDB', null),
            }

            response = await JSONKeySingleID.get(VALUE)
          })

          after(() => SpyMock.restoreAll())

          it('should call `getDB`', () => {
            expect(spies.getDB).have.been.calledOnce
          })

          it('should return null', () => {
            expect(response).to.be.null
          })
        })
      })
    })
  })

  describe('.setCache', () => {
    const VALUE = 1

    context('when the verification `hook` returns `true`', () => {
      context('when the key is `JSON`', () => {
        const KEY_NAME = JSONKeySingleID.getKeyName(VALUE)
        const CACHE_VALUE = {
          id: VALUE
        }

        let redisResponse

        context('and `key` is passed', () => {
          before(async () => {
            redisResponse = await JSONKeySingleID.setCache(VALUE, CACHE_VALUE)
          })

          after(async () => {
            SpyMock.restoreAll()

            await GenericJSONCacheMock
              .delete(KEY_NAME)
          })

          it('should return the response', () => {
            expect(redisResponse).to.not.null
          })

          it('should set the value to cache when executing the response', async () => {
            await redisResponse.execAsync()

            const cachedValue = await JSONKeySingleID.getCache(VALUE)

            expect(cachedValue).to.eql(CACHE_VALUE)
          })
        })

        context('and  a null `key` is passed', () => {
          before(async () => {
            redisResponse = await JSONKeySingleID.setCache(null, CACHE_VALUE)
          })

          after(async () => {
            await GenericJSONCacheMock.delete(JSONKeySingleID.getKeyName(VALUE))

            SpyMock.restoreAll()
          })

          it('should return the response', () => {
            expect(redisResponse).to.not.null
          })
        })

        context('and an undefined `key` is passed', () => {
          before(async () => {
            redisResponse = await JSONKeySingleID.setCache(undefined, CACHE_VALUE)
          })

          after(async () => {
            SpyMock.restoreAll()

            await GenericJSONCacheMock
              .delete(JSONKeySingleID.getKeyName(VALUE))
          })

          it('should return the response', () => {
            expect(redisResponse).to.not.null
          })
        })
      })

      context('when the key is `HASH`', () => {
        const KEY_NAME = HASHKeySingleID.getKeyName(VALUE)
        const CACHE_VALUE = {
          id: VALUE
        }

        let redisResponse

        context('and `key` is passed', () => {
          before(async () => {
            redisResponse = await HASHKeySingleID.setCache(VALUE, CACHE_VALUE)
          })

          after(async () => {
            await GenericHASHCache.delete(KEY_NAME, VALUE)

            SpyMock.restoreAll()
          })

          it('should return the response', () => {
            expect(redisResponse).to.not.null
          })

          it('should set the value to cache when executing the response', async () => {
            await redisResponse.execAsync()

            const cachedValue = await HASHKeySingleID.getCache(VALUE)

            expect(cachedValue).to.eql(CACHE_VALUE)
          })
        })

        context('and a null `key` is passed', () => {
          before(async () => {
            redisResponse = await HASHKeySingleID.setCache(null, CACHE_VALUE)
          })

          after(() => SpyMock.restoreAll())

          it('should return the response', () => {
            expect(redisResponse).to.not.null
          })
        })

        context('and an undefined `key` is passed', () => {
          before(async () => {
            redisResponse = await HASHKeySingleID.setCache(undefined, CACHE_VALUE)
          })

          after(() => SpyMock.restoreAll())

          it('should return the response', () => {
            expect(redisResponse).to.not.null
          })
        })
      })

      context('when the key is `STRING`', () => {
        const STRING_VALUE = 'string_value'

        const KEY_NAME = STRINGKeySingleID.getKeyName(VALUE)

        let redisResponse

        context('and `key` is passed', () => {
          before(async () => {
            redisResponse = await STRINGKeySingleID.setCache(VALUE, STRING_VALUE)
          })

          after(async () => {
            await GenericSTRINGCache.delete(KEY_NAME)

            SpyMock.restoreAll()
          })

          it('should return the response', () => {
            expect(redisResponse).to.not.null
          })

          it('should set the value to cache when executing the response', async () => {
            await redisResponse.exec()

            const cachedValue = await STRINGKeySingleID.getCache(VALUE)

            expect(cachedValue).to.eql([STRING_VALUE])
          })
        })

        context('and a null`key` is passed', () => {
          before(async () => {
            redisResponse = await STRINGKeySingleID.setCache(null, STRING_VALUE)
          })

          after(() => SpyMock.restoreAll())

          it('should return the response', () => {
            expect(redisResponse).to.not.null
          })
        })

        context('and an undefined `key` is passed', () => {
          before(async () => {
            redisResponse = STRINGKeySingleID.setCache(undefined, STRING_VALUE)
          })

          after(() => SpyMock.restoreAll())

          it('should return the response', () => {
            expect(redisResponse).to.not.null
          })
        })
      })

      context('when the key is `JSON_ARRAY`', () => {
        const KEY_NAME = JSONArrayKeySingleID.getKeyName(VALUE)
        const CACHE_VALUE = {
          id: VALUE
        }

        let redisResponse

        context('and `key` is passed', () => {
          before(async () => {
            redisResponse = await JSONArrayKeySingleID
              .setCache(VALUE, CACHE_VALUE)
          })

          after(async () => {
            await GenericJSONCacheMock
              .delete(KEY_NAME)
          })

          it('should return the response', () => {
            expect(redisResponse).to.not.null
          })

          it('should set the value to cache when executing the response', async () => {
            await redisResponse.execAsync()

            const cachedValue = await JSONArrayKeySingleID
              .getCache(VALUE)

            expect(cachedValue).to.eql(CACHE_VALUE)
          })
        })

        context('and  a null `key` is passed', () => {
          before(async () => {
            redisResponse = await JSONArrayKeySingleID
              .setCache(null, CACHE_VALUE)
          })

          after(async () => {
            await GenericJSONCacheMock
              .delete(JSONArrayKeySingleID.getKeyName(VALUE))
          })

          it('should return the response', () => {
            expect(redisResponse).to.not.null
          })
        })

        context('and an undefined `key` is passed', () => {
          before(async () => {
            redisResponse = await JSONArrayKeySingleID
              .setCache(undefined, CACHE_VALUE)
          })

          after(async () => {
            await GenericJSONCacheMock
              .delete(JSONKeySingleID.getKeyName(VALUE))
          })

          it('should return the response', () => {
            expect(redisResponse).to.not.null
          })
        })
      })
    })
  })

  describe('.addCache', () => {
    const VALUE = 1
    const CACHE_VALUE = { id: VALUE }

    context('when the key is `JSON_ARRAY`', () => {
      const KEY_NAME = JSONArrayKeySingleID.getKeyName(VALUE)

      let redisResponse

      context('and `key` is passed', () => {
        context('and `value` is passed', () => {
          context('and `position` is passed', () => {
            const POSITION = 0

            before(async () => {
              const value = [{ id: 42 }]

              await redis
                .json_setAsync(KEY_NAME, '.', JSON.stringify(value))

              redisResponse = await JSONArrayKeySingleID
                .addCache(VALUE, CACHE_VALUE, POSITION)
            })

            after(async () => {
              await GenericJSONCacheMock
                .delete(KEY_NAME)
            })

            it('should return the new list size', () => {
              expect(redisResponse).to.eql(2)
            })

            it('should set the value to cache at the position passed', async () => {
              const cachedValue = await JSONArrayKeySingleID
                .getCache(VALUE)

              expect(cachedValue[POSITION]).to.eql(CACHE_VALUE)
            })
          })

          context('and `position` is not passed', () => {
            before(async () => {
              const value = [{ id: 42 }]

              await redis
                .json_setAsync(KEY_NAME, '.', JSON.stringify(value))

              redisResponse = await JSONArrayKeySingleID
                .addCache(VALUE, CACHE_VALUE)
            })

            after(async () => {
              await GenericJSONCacheMock
                .delete(KEY_NAME)
            })

            it('should return the new list size', () => {
              expect(redisResponse).to.eql(2)
            })

            it('should set the value to cache after the last element', async () => {
              const cachedValue = await JSONArrayKeySingleID
                .getCache(VALUE)

              const last = cachedValue.length - 1

              expect(cachedValue[last]).to.eql(CACHE_VALUE)
            })
          })
        })

        context('and `value` is not passed', () => {
          before(async () => {
            redisResponse = await JSONArrayKeySingleID
              .addCache(VALUE)
          })

          after(async () => {
            await GenericJSONCacheMock
              .delete(KEY_NAME)
          })

          it('should return the new list size', () => {
            expect(redisResponse).to.eql(0)
          })

          it('should set an empty list', async () => {
            const cachedValue = await JSONArrayKeySingleID
              .getCache(VALUE)

            expect(cachedValue).to.eql([])
          })
        })
      })

      context('and  a null `key` is passed', () => {
        before(async () => {
          redisResponse = await JSONArrayKeySingleID
            .addCache(null, CACHE_VALUE)
        })

        after(async () => {
          await GenericJSONCacheMock
            .delete(JSONArrayKeySingleID.getKeyName(null))
        })

        it('should return the new list size', () => {
          expect(redisResponse).to.eql(1)
        })

        it('should add the value to cache', async () => {
          const cachedValue = await JSONArrayKeySingleID
            .getCache(null)

          expect(cachedValue).to.eql([CACHE_VALUE])
        })
      })

      context('and an undefined `key` is passed', () => {
        before(async () => {
          redisResponse = await JSONArrayKeySingleID
            .addCache(undefined, CACHE_VALUE)
        })

        after(async () => {
          await GenericJSONCacheMock
            .delete(JSONArrayKeySingleID.getKeyName(undefined))
        })

        it('should return the new list size', () => {
          expect(redisResponse).to.eql(1)
        })

        it('should add the value to cache', async () => {
          const cachedValue = await JSONArrayKeySingleID
            .getCache(undefined)

          expect(cachedValue).to.eql([CACHE_VALUE])
        })
      })
    })

    context('when the key is not `JSON_ARRAY`', () => {
      let redisResponse

      before(async () => {
        redisResponse = await JSONKeySingleID
          .addCache(undefined, CACHE_VALUE)
      })

      after(async () => {
        await GenericJSONCacheMock
          .delete(JSONArrayKeySingleID.getKeyName(VALUE))
      })

      it('should return the response', () => {
        expect(redisResponse).to.be.null
      })
    })
  })

  describe('.set', () => {
    context('when `key` is not `null`', () => {
      context('when `key` is an `Object`', () => {
        const OBJECT_KEY = {
          id: 1,
          attr1: 'teste'
        }

        context('and `value` is `undefined`', () => {
          let spies, redisResponse

          context('and `key` has id attrs', () => {
            before(async () => {
              spies = {
                onSave: SpyMock
                  .addReturnSpy(JSONKeySingleID, 'onSave')
              }

              redisResponse = await JSONKeySingleID.set(OBJECT_KEY)
            })

            after(() => SpyMock.restoreAll())

            it('should call `onSave`', () => {
              expect(spies.onSave).have.been.calledOnce
            })

            it('should return the `key` setted', () => {
              expect(redisResponse).to.eql(OBJECT_KEY)
            })

            it('should set the `key` on cache', async () => {
              const cacheValue = await JSONKeySingleID.getCache(OBJECT_KEY.id)

              expect(cacheValue).to.eql(OBJECT_KEY)
            })
          })

          context('and `key` has no id attrs', () => {
            before(async () => {
              spies = {
                setCache: SpyMock
                  .addReturnSpy(JSONKeySingleID, 'setCache'),

                getIdAttr: SpyMock
                  .addReturnSpy(JSONKeySingleID, '_getIdAttr', null)
              }

              redisResponse = await JSONKeySingleID.set(OBJECT_KEY)
            })

            after(() => SpyMock.restoreAll())

            it('should call `_getIdAttr`', () => {
              expect(spies.getIdAttr).have.been.called
            })

            it('should not call `setCache`', () => {
              expect(spies.setCache).not.have.been.calledOnce
            })

            it('should return `null`', () => {
              expect(redisResponse).to.not.exist
            })
          })
        })
      })

      context('when `key` is a `string`', () => {
        context('when `value` is `undefined`', () => {
          context('when `getDB` return is not `null`', () => {
            const STRING_KEY = 'teste'
            const OBJECT_DB = { id: STRING_KEY }

            let redisResponse

            before(async () => {
              SpyMock
                .addReturnSpy(JSONKeySingleID, 'getDB', OBJECT_DB)

              redisResponse = await JSONKeySingleID
                .set(STRING_KEY)
            })

            after(async () => {
              SpyMock.restoreAll()

              await JSONKeySingleID
                .delete(STRING_KEY)
            })

            it('shpuld return the cache value', () => {
              expect(redisResponse).to.eql(STRING_KEY)
            })

            it('should set the `key` on cache', async () => {
              const cacheValue = await JSONKeySingleID
                .getCache(STRING_KEY)

              expect(cacheValue).to.eql(OBJECT_DB)
            })
          })

          context('when `getDB` return is `null`', () => {
            const STRING_KEY = 'teste2'

            let redisResponse

            before(async () => {
              SpyMock
                .addReturnSpy(JSONKeySingleID, 'getDB', null)

              redisResponse = await JSONKeySingleID.set(STRING_KEY)
            })

            after(() => SpyMock.restoreAll())

            it('shpuld return `null`', () => {
              expect(redisResponse).to.not.exist
            })

            it('should not set the `key` on cache', async () => {
              const cacheValue = await JSONKeySingleID
                .getCache(STRING_KEY)

              expect(cacheValue).to.not.exist
            })
          })
        })

        context('when `value` is `null`', () => {
          const STRING_KEY = 'teste3'
          const VALUE = null

          let redisResponse

          before(async () => {
            redisResponse = await JSONKeySingleID.set(STRING_KEY, VALUE)
          })

          after(async () => {
            await JSONKeyMultiID.delete(STRING_KEY)
          })

          it('shpuld return `null`', () => {
            expect(redisResponse).to.eql(VALUE)
          })

          it('should set the `key` on cache', async () => {
            const cacheValue = await JSONKeySingleID.getCache(STRING_KEY)

            expect(cacheValue).to.eql(VALUE)
          })
        })
      })
    })

    context('when `key` is `null`', () => {
      let spies

      before(() => {
        spies = {
          setCache: SpyMock
            .addReturnSpy(JSONKeySingleID, 'setCache')
        }

        JSONKeySingleID.set()
      })

      after(() => SpyMock.restoreAll())

      it('should not call `setCache`', () => {
        expect(spies.setCache).to.not.have.been.calledOnce
      })
    })
  })

  describe('.add', () => {
    context('when `key` is not `null`', () => {
      context('when `key` is an `Object`', () => {
        const OBJECT_KEY = {
          id: 1,
          attr1: 'teste'
        }

        context('and `value` is passed', () => {
          const VALUE = { teste: 1 }
          const KEY_NAME = JSONArrayKeySingleID.getKeyName(OBJECT_KEY)

          let spies, redisResponse

          context('and `position` is passed', () => {
            const POSITION = 0

            before(async () => {
              spies = {
                onSave: SpyMock
                  .addReturnSpy(JSONArrayKeySingleID, 'onSave')
              }

              const value = { teste : 42}

              await redis
                .json_setAsync(KEY_NAME, '.', JSON.stringify([value]))

              redisResponse = await JSONArrayKeySingleID
                .add(OBJECT_KEY, VALUE, POSITION)
            })

            after(async () => {
              SpyMock.restoreAll()

              await GenericJSONCacheMock
                .delete(KEY_NAME)
            })

            it('should call `onSave`', () => {
              expect(spies.onSave).have.been.calledOnce
            })

            it('should return the new list size', () => {
              expect(redisResponse).to.eql(2)
            })

            it('should set the `value` on cache at position', async () => {
              const cacheValue = await JSONArrayKeySingleID
                .getCache(OBJECT_KEY.id)

              expect(cacheValue[POSITION]).to.eql(VALUE)
            })
          })

          context('and `position` is not passed', () => {
            before(async () => {
              spies = {
                onSave: SpyMock
                  .addReturnSpy(JSONArrayKeySingleID, 'onSave')
              }

              const value = { teste : 42}

              await redis
                .json_setAsync(KEY_NAME, '.', JSON.stringify([value]))

              redisResponse = await JSONArrayKeySingleID
                .add(OBJECT_KEY, VALUE)
            })

            after(async () => {
              await GenericJSONCacheMock
                .delete(KEY_NAME)
              
              SpyMock.restoreAll()
            })

            it('should call `onSave`', () => {
              expect(spies.onSave).have.been.calledOnce
            })

            it('should return the new list size', () => {
              expect(redisResponse).to.eql(2)
            })

            it('should set the `value` on cache after the last element', async () => {
              const cacheValue = await JSONArrayKeySingleID
                .getCache(OBJECT_KEY.id)

              const last = cacheValue.length - 1

              expect(cacheValue[last]).to.eql(VALUE)
            })
          })
        })

        context('and `value` is `undefined`', () => {
          let spies, redisResponse

          context('and `key` has id attrs', () => {
            before(async () => {
              spies = {
                onSave: SpyMock
                  .addReturnSpy(JSONArrayKeySingleID, 'onSave')
              }

              redisResponse = await JSONArrayKeySingleID
                .add(OBJECT_KEY)
            })

            after(async () => {
              await GenericJSONCacheMock
                .delete(JSONArrayKeySingleID.getKeyName(OBJECT_KEY))
              
              SpyMock.restoreAll()
            })

            it('should call `onSave`', () => {
              expect(spies.onSave).have.been.calledOnce
            })

            it('should return the new list size', () => {
              expect(redisResponse).to.eql(1)
            })

            it('should set the `key` on cache', async () => {
              const cacheValue = await JSONArrayKeySingleID
                .getCache(OBJECT_KEY.id)

              expect(cacheValue).to.eql([OBJECT_KEY])
            })
          })

          context('and `key` has no id attrs', () => {
            before(async () => {
              spies = {
                addCache: SpyMock
                  .addReturnSpy(JSONArrayKeySingleID, 'addCache'),

                getIdAttr: SpyMock
                  .addReturnSpy(JSONArrayKeySingleID, '_getIdAttr', null)
              }

              redisResponse = await JSONArrayKeySingleID
                .add(OBJECT_KEY)
            })

            after(() => SpyMock.restoreAll())

            it('should call `_getIdAttr`', () => {
              expect(spies.getIdAttr).have.been.called
            })

            it('should not call `addCache`', () => {
              expect(spies.addCache).not.have.been.calledOnce
            })

            it('should return `null`', () => {
              expect(redisResponse).to.not.exist
            })
          })
        })
      })

      context('when `key` is a `string`', () => {
        context('when `value` is `undefined`', () => {
          context('when `getDB` return is not `null`', () => {
            const STRING_KEY = 'teste'
            const OBJECT_DB = { id: STRING_KEY }

            let redisResponse

            before(async () => {
              SpyMock
                .addReturnSpy(JSONArrayKeySingleID, 'getDB', OBJECT_DB)

              redisResponse = await JSONArrayKeySingleID
                .add(STRING_KEY)
            })

            after(async () => {
              await GenericJSONCacheMock
                .delete(STRING_KEY)
              
              SpyMock.restoreAll()
            })

            it('should return the new list size', () => {
              expect(redisResponse).to.eql(1)
            })

            it('should set the `key` on cache', async () => {
              const cacheValue = await JSONArrayKeySingleID
                .getCache(STRING_KEY)

              expect(cacheValue).to.eql([OBJECT_DB])
            })
          })

          context('when `getDB` returns `null`', () => {
            const STRING_KEY = 'teste2'

            let redisResponse

            before(async () => {
              SpyMock
                .addReturnSpy(JSONArrayKeySingleID, 'getDB', null)

              redisResponse = await JSONArrayKeySingleID
                .add(STRING_KEY)
            })

            after(() => SpyMock.restoreAll())

            it('should return the list size', () => {
              expect(redisResponse).to.eql(0)
            })

            it('should set an empty list on cache', async () => {
              const cacheValue = await JSONArrayKeySingleID
                .getCache(STRING_KEY)

              expect(cacheValue).to.eql([])
            })
          })
        })

        context('when `value` is `null`', () => {
          const STRING_KEY = 'teste3'
          const VALUE = null

          let redisResponse

          before(async () => {
            redisResponse = await JSONArrayKeySingleID
              .add(STRING_KEY, VALUE)
          })

          after(async () => {
            await JSONArrayKeySingleID
              .delete(STRING_KEY)
          })

          it('should return the list size', () => {
            expect(redisResponse).to.eql(0)
          })

          it('should set an empty array on cache', async () => {
            const cacheValue = await JSONArrayKeySingleID
              .getCache(STRING_KEY)

            expect(cacheValue).to.eql([])
          })
        })
      })
    })

    context('when `key` is `null`', () => {
      let spies

      before(() => {
        spies = {
          addCache: SpyMock
            .addReturnSpy(JSONArrayKeySingleID, 'addCache')
        }

        JSONArrayKeySingleID
          .add()
      })

      after(() => SpyMock.restoreAll())

      it('should not call `addCache`', () => {
        expect(spies.addCache).to.not.have.been.calledOnce
      })
    })
  })

  describe('.setList', () => {
    context('when the key is `string`', () => {
      context('when objects are persisted', async () => {
        let redisResponse, ids, spies

        before(async () => {
          ids = [
            Math.round(Math.random() * 999999),
            Math.round(Math.random() * 999999),
            Math.round(Math.random() * 999999)
          ]

          const object = {
            id  : Math.round(Math.random() * 999999),
            name: `Name: ${Math.round(Math.random() * 999999)}`
          }

          spies = {
            getDB: SpyMock
              .addReturnSpy(JSONKeySingleID, 'getDB', object)
          }

          redisResponse = await JSONKeySingleID.setList(ids)
        })

        after(async () => SpyMock.restoreAll())

        it('should return the inserted objects', () => {
          expect(redisResponse).to.have.lengthOf(ids.length)
        })

        it('should save the objects to cache', async () => {
          expect(spies.getDB.getCalls()).to.have.been.lengthOf(ids.length)
        })
      })
    })

    context('when the key is `Object`', () => {
      const OBJECTS = GenericRedisCacheMock.getObjectMocks()
      const ID_ATTRS = JSONKeySingleID.getIdAttrs(OBJECTS)

      context('and `JSON` objects are passed', async () => {
        let redisResponse, keyNames

        before(async () => {
          keyNames = await JSONKeySingleID.getKeyNames(ID_ATTRS)

          redisResponse = await JSONKeySingleID.setList(OBJECTS)
        })

        after(async () => {
          await GenericJSONCacheMock.delete(keyNames)
        })

        it('should return the commands executed', () => {
          expect(redisResponse.length).to.be.above(1)
        })

        it('should save the objects to cache', async () => {
          const cachedValues = await GenericJSONCache.getListCache(keyNames)

          expect(cachedValues.length).to.eql(OBJECTS.length)
        })
      })

      context('and `key/value` objects are passed', () => {
        let redisResponse, keyNames

        before(async () => {
          keyNames = await JSONKeySingleID.getKeyNames(ID_ATTRS)

          const keyValues = OBJECTS.map((object) => {
            return {
              key   : JSONKeySingleID._getIdAttr(object),
              value : object
            }
          })

          redisResponse = await JSONKeySingleID.setList(keyValues)
        })

        after(async () => {
          await GenericJSONCacheMock.delete(keyNames)
        })

        it('should return the commands executed', () => {
          expect(redisResponse.length).to.be.above(1)
        })

        it('should save the objects to cache', async () => {
          const cachedValue = await GenericJSONCache
            .getListCache(keyNames)

          expect(cachedValue.length).to.eql(OBJECTS.length)
        })
      })
    })

    context('when the key is `HASH`', () => {
      const OBJECTS = GenericRedisCacheMock.getObjectMocks()
      const ID_ATTRS = HASHKeySingleID.getIdAttrs(OBJECTS)

      context('and `JSON` objects are passed', async () => {
        let redisResponse, keyNames

        before(async () => {
          keyNames = await HASHKeySingleID.getKeyNames(ID_ATTRS)

          redisResponse = await HASHKeySingleID.setList(OBJECTS)
        })

        after(async () => {
          await GenericHASHCache.delete(keyNames)
        })

        it('should return the commands executed', () => {
          expect(redisResponse.length).to.be.above(1)
        })

        it('should save the objects to cache', async () => {
          const cachedValues = await GenericHASHCache.getListCache(keyNames)

          expect(cachedValues.length).to.eql(OBJECTS.length)
        })
      })

      context('and `key/value` objects are passed', () => {
        let redisResponse, keyNames

        context('and the values are `objects`',() => {
          before(async () => {
            keyNames = await HASHKeySingleID.getKeyNames(ID_ATTRS)

            const keyValues = OBJECTS.map((object) => {
              return {
                key   : HASHKeySingleID._getIdAttr(object),
                value : object
              }
            })

            redisResponse = await HASHKeySingleID.setList(keyValues)
          })

          after(async () => {
            await GenericHASHCache.delete(keyNames)
          })

          it('should return the commands executed', () => {
            expect(redisResponse.length).to.be.above(1)
          })

          it('should save the objects to cache', async () => {
            const cachedValues = await GenericHASHCache.getListCache(keyNames)

            expect(cachedValues.length).to.eql(OBJECTS.length)
          })
        })

        context('and the values are `strings`', () => {
          before(async () => {
            keyNames = await HASHKeySingleID.getKeyNames(ID_ATTRS)

            const stringValues = OBJECTS
              .map((object) => {
                return {
                  key   : object.id,
                  value : object.id.toString()
                }
              })

            redisResponse = await HASHKeySingleID.setList(stringValues)
          })

          after(async () => {
            await GenericHASHCache.delete(keyNames)
          })

          it('should return the commands executed', () => {
            expect(redisResponse.length).to.be.above(1)
          })

          it('should save the objects to cache', async () => {
            const cachedValues = await GenericHASHCache.getListCache(keyNames)

            expect(cachedValues.length).to.eql(OBJECTS.length)
          })
        })
      })
    })

    context('when the key is `STRING`', () => {
      const OBJECTS = GenericRedisCacheMock.getObjectMocks()
      const ID_ATTRS = STRINGKeySingleID.getIdAttrs(OBJECTS)

      context('and `JSON` objects are passed', async () => {
        let redisResponse, keyNames

        before(async () => {
          keyNames = await STRINGKeySingleID.getKeyNames(ID_ATTRS)

          redisResponse = await STRINGKeySingleID.setList(OBJECTS)
        })

        after(async () => {
          await GenericSTRINGCache.delete(keyNames)
        })

        it('should return the commands executed', () => {
          expect(redisResponse.length).to.be.above(1)
        })

        it('should save the objects to cache', async () => {
          const cachedValues = await GenericSTRINGCache.getListCache(keyNames)

          expect(cachedValues.length).to.eql(OBJECTS.length)
        })
      })

      context('and `key/value` objects are passed', () => {
        let redisResponse, keyNames

        context('and the values are `objects`',() => {
          before(async () => {
            keyNames = await STRINGKeySingleID.getKeyNames(ID_ATTRS)

            const keyValues = OBJECTS.map((object) => {
              return {
                key: STRINGKeySingleID._getIdAttr(object),
                value: object
              }
            })

            redisResponse = await STRINGKeySingleID.setList(keyValues)
          })

          after(async () => {
            await GenericSTRINGCache.delete(keyNames)
          })

          it('should return the commands executed', () => {
            expect(redisResponse.length).to.be.above(1)
          })

          it('should save the objects to cache', async () => {
            const cachedValues = await GenericSTRINGCache.getListCache(keyNames)

            expect(cachedValues.length).to.eql(OBJECTS.length)
          })
        })

        context('and the values are `strings`', () => {
          before(async () => {
            keyNames = await STRINGKeySingleID.getKeyNames(ID_ATTRS)

            const stringValues = OBJECTS.map((object) => {
              return {
                key: object.id,
                value: 'test'+ (Math.floor(Math.random() * 1000) + 1)
              }
            })

            redisResponse = await STRINGKeySingleID.setList(stringValues)
          })

          after(async () => {
            await GenericSTRINGCache.delete(keyNames)
          })

          it('should return the commands executed', () => {
            expect(redisResponse.length).to.be.above(1)
          })

          it('should save the objects to cache', async () => {
            const cachedValues = await GenericSTRINGCache.getListCache(keyNames)

            expect(cachedValues.length).to.eql(OBJECTS.length)
          })
        })

        context('and the values are arrays of `strings`', () => {
          const VALUE_LENGTH = 3

          before(async () => {
            keyNames = await STRINGKeySingleID.getKeyNames(ID_ATTRS)

            const stringValues = OBJECTS.map((object) => {
              return {
                key   : object.id,
                value : GenericRedisCacheMock.getRandomStrings(VALUE_LENGTH)
              }
            })

            redisResponse = await STRINGKeySingleID.setList(stringValues)
          })

          after(async () => {
            await GenericSTRINGCache.delete(keyNames)
          })

          it('should return the commands executed', () => {
            expect(redisResponse.length).to.be.above(1)
          })

          it('should save the objects to cache', async () => {
            const cachedValues = await GenericSTRINGCache.getListCache(keyNames)

            expect(cachedValues.length).to.eql(OBJECTS.length * VALUE_LENGTH)
          })
        })
      })
    })
  })

  describe('.getListCache', () => {
    context('when there are cached values', () => {
      const OBJECTS = GenericRedisCacheMock.getObjectMocks()

      context('and the key is `JSON`', () => {
        const ID_ATTRS = JSONKeySingleID.getIdAttrs(OBJECTS)
        let keyNames

        before(async () => {
          keyNames = await JSONKeySingleID.getKeyNames(ID_ATTRS)

          await JSONKeySingleID.setList(OBJECTS)
        })

        after(async () => {
          await GenericJSONCacheMock.delete(keyNames)
        })

        it('should return the cached values', async () => {
          const cachedValues = await JSONKeySingleID.getListCache(ID_ATTRS)

          expect(cachedValues.length).to.eql(OBJECTS.length)
        })
      })

      context('and the key is `HASH`', () => {
        const ID_ATTRS = HASHKeySingleID.getIdAttrs(OBJECTS)
        let keyNames

        before(async () => {
          keyNames = await HASHKeySingleID.getKeyNames(ID_ATTRS)

          await HASHKeySingleID.setList(OBJECTS)
        })

        after(async () => {
          await GenericHASHCache.delete(keyNames)
        })

        it('should return the cached values', async () => {
          const cachedValues = await HASHKeySingleID.getListCache(ID_ATTRS)

          expect(cachedValues.length).to.eql(OBJECTS.length)
        })
      })

      context('and the key is `STRING`', () => {
        const ID_ATTRS = STRINGKeySingleID.getIdAttrs(OBJECTS)
        let keyNames

        before(async () => {
          keyNames = await STRINGKeySingleID.getKeyNames(ID_ATTRS)

          await STRINGKeySingleID.setList(OBJECTS)
        })

        after(async () => {
          await GenericSTRINGCache.delete(keyNames)
        })

        it('should return the cached values', async () => {
          const cachedValues = await STRINGKeySingleID.getListCache(ID_ATTRS)

          expect(cachedValues.length).to.eql(OBJECTS.length)
        })
      })

      context('and the key is `JSON_ARRAY`', () => {
        const ID_ATTRS = JSONArrayKeySingleID.getIdAttrs(OBJECTS)
        let keyNames

        before(async () => {
          keyNames = await JSONArrayKeySingleID
            .getKeyNames(ID_ATTRS)

          for (let i = 0; i < OBJECTS.length; i++) {
            await redis
              .json_setAsync(keyNames[i], '.', JSON.stringify([OBJECTS[i]]))
          }
        })

        after(async () => {
          await GenericJSONCacheMock
            .delete(keyNames)
        })

        it('should return the cached values', async () => {
          const cachedValues = await JSONArrayKeySingleID
            .getListCache(ID_ATTRS)

          expect(cachedValues.length).to.eql(OBJECTS.length)
        })
      })
    })

    context('when there are no cached values', () => {
      context('and the key is `JSON`', () => {
        it('should return an empty array', async () => {
          const cachedValues = await JSONKeySingleID.getListCache(['00000', '99999'])

          expect(cachedValues).to.eql([])
        })
      })

      context('and the key is `HASH`', () => {
        it('should return an empty array', async () => {
          const cachedValues = await HASHKeySingleID.getListCache(['00000', '99999'])

          expect(cachedValues).to.eql([])
        })
      })

      context('and the key is `STRING`', () => {
        it('should return an empty array', async () => {
          const cachedValues = await STRINGKeySingleID.getListCache(['00000', '99999'])

          expect(cachedValues).to.eql([])
        })
      })

      context('and the key is `JSON_ARRAY`', () => {
        it('should return an empty array', async () => {
          const cachedValues = await JSONArrayKeySingleID
            .getListCache(['00000', '99999'])

          expect(cachedValues).to.eql([])
        })
      })
    })
  })

  describe('.getList', () => {
    context('when the key is `JSON`', () => {
      const OBJECTS = GenericRedisCacheMock.getObjectMocks({}, 5)

      context('and there are cached values', () => {
        context('and all the keys passed have cached values', () => {
          const ID_ATTRS = JSONKeySingleID.getIdAttrs(OBJECTS)
          let keyNames, spies, redisResponse

          before(async () => {
            spies = {
              getIds: SpyMock
                .addReturnSpy(JSONKeySingleID, 'getIds')
            }

            keyNames = await JSONKeySingleID.getKeyNames(ID_ATTRS)

            await JSONKeySingleID.setList(OBJECTS)

            redisResponse = await JSONKeySingleID.getList(ID_ATTRS)
          })

          after(async () => {
            await GenericJSONCacheMock.delete(keyNames)

            SpyMock.restoreAll()
          })

          it('should call `getIds`', () => {
            expect(spies.getIds).have.been.called
          })

          it('should return the cached values', async () => {
            expect(redisResponse).to.eql(OBJECTS)
          })
        })

        context('and some keys are not cached', () => {
          const ID_ATTRS = JSONKeySingleID.getIdAttrs(OBJECTS)
          let keyNames, spies, redisResponse

          context('and `getListDB` returns an array', () => {
            before(async () => {
              spies = {
                getIds  : SpyMock
                  .addReturnSpy(JSONKeySingleID, 'getIds'),
                getListDB : SpyMock
                  .addReturnSpy(JSONKeySingleID, 'getListDB', OBJECTS.slice(2))
              }

              keyNames = await JSONKeySingleID.getKeyNames(ID_ATTRS)

              await JSONKeySingleID.setList(OBJECTS.slice(0, 2))

              redisResponse = await JSONKeySingleID.getList(ID_ATTRS)
            })

            after(async () => {
              await GenericJSONCacheMock.delete(keyNames)

              SpyMock.restoreAll()
            })

            it('should call `getIds`', () => {
              expect(spies.getIds).have.been.called
            })

            it('should call `getListDB`', () => {
              expect(spies.getListDB).have.been.calledOnce
            })

            it('should return the cached values', async () => {
              expect(redisResponse).to.eql(OBJECTS)
            })
          })

          context('and `getListDB` returns an empty array', () => {
            before(async () => {
              spies = {
                getIds  : SpyMock
                  .addReturnSpy(JSONKeySingleID, 'getIds'),
                getListDB : SpyMock
                  .addReturnSpy(JSONKeySingleID, 'getListDB', [])
              }

              keyNames = await JSONKeySingleID.getKeyNames(ID_ATTRS)

              await JSONKeySingleID.setList(OBJECTS.slice(0, 2))

              redisResponse = await JSONKeySingleID.getList(ID_ATTRS)
            })

            after(async () => {
              await GenericJSONCacheMock.delete(keyNames)

              SpyMock.restoreAll()
            })

            it('should call `getIds`', () => {
              expect(spies.getIds).have.been.called
            })

            it('should call `getListDB`', () => {
              expect(spies.getListDB).have.been.calledOnce
            })

            it('should return the cached values', async () => {
              expect(redisResponse).to.eql(OBJECTS.slice(0, 2))
            })
          })
        })
      })

      context('when there are no cached values', () => {
        let keyNames, spies, redisResponse
        const ID_ATTRS = JSONKeySingleID.getIdAttrs(OBJECTS)

        context('and `getListDB` returns an array', () => {
          before(async () => {
            spies = {
              getIds  : SpyMock
                .addReturnSpy(JSONKeySingleID, 'getIds'),
              getListDB : SpyMock
                .addReturnSpy(JSONKeySingleID, 'getListDB', OBJECTS)
            }

            keyNames = await JSONKeySingleID.getKeyNames(ID_ATTRS)

            redisResponse = await JSONKeySingleID.getList(ID_ATTRS)
          })

          after(async () => {
            await GenericJSONCacheMock.delete(keyNames)

            SpyMock.restoreAll()
          })

          it('should call `getIds`', () => {
            expect(spies.getIds).have.been.called
          })

          it('should call `getListDB`', () => {
            expect(spies.getListDB).have.been.calledOnce
          })

          it('should return the cached values', async () => {
            expect(redisResponse).to.eql(OBJECTS)
          })
        })

        context('and `getListDB` returns an empty array', () => {
          before(async () => {
            spies = {
              getIds  : SpyMock
                .addReturnSpy(JSONKeySingleID, 'getIds'),
              getListDB : SpyMock
                .addReturnSpy(JSONKeySingleID, 'getListDB', [])
            }

            keyNames = await JSONKeySingleID.getKeyNames(ID_ATTRS)

            redisResponse = await JSONKeySingleID.getList(ID_ATTRS)
          })

          after(async () => {
            await GenericJSONCacheMock.delete(keyNames)

            SpyMock.restoreAll()
          })

          it('should call `getIds`', () => {
            expect(spies.getIds).have.been.called
          })

          it('should call `getListDB`', () => {
            expect(spies.getListDB).have.been.calledOnce
          })

          it('should return an emtpy array', async () => {
            expect(redisResponse).to.eql([])
          })
        })
      })
    })

    context('when the key is `HASH`', () => {
      const OBJECTS = GenericRedisCacheMock.getObjectMocks({}, 5)

      context('and there are cached values', () => {
        context('and all the keys passed have cached values', () => {
          const ID_ATTRS = HASHKeySingleID.getIdAttrs(OBJECTS)
          let keyNames, spies, redisResponse

          before(async () => {
            spies = {
              getIds  : SpyMock
                .addReturnSpy(HASHKeySingleID, 'getIds')
            }

            keyNames = await HASHKeySingleID.getKeyNames(ID_ATTRS)

            await HASHKeySingleID.setList(OBJECTS)

            redisResponse = await HASHKeySingleID.getList(ID_ATTRS)
          })

          after(async () => {
            await GenericHASHCache.delete(keyNames)

            SpyMock.restoreAll()
          })

          it('should call `getIds`', () => {
            expect(spies.getIds).have.been.called
          })

          it('should return the cached values', async () => {
            expect(redisResponse).to.eql(OBJECTS)
          })
        })

        context('and some keys are not cached', () => {
          const ID_ATTRS = HASHKeySingleID.getIdAttrs(OBJECTS)
          let keyNames, spies, redisResponse

          context('and `getListDB` returns an array', () => {
            before(async () => {
              spies = {
                getIds  : SpyMock
                  .addReturnSpy(HASHKeySingleID, 'getIds'),
                getListDB : SpyMock
                  .addReturnSpy(HASHKeySingleID, 'getListDB', OBJECTS.slice(2))
              }

              keyNames = await HASHKeySingleID.getKeyNames(ID_ATTRS)

              await HASHKeySingleID.setList(OBJECTS.slice(0, 2))

              redisResponse = await HASHKeySingleID.getList(ID_ATTRS)
            })

            after(async () => {
              await GenericHASHCache.delete(keyNames)

              SpyMock.restoreAll()
            })

            it('should call `getIds`', () => {
              expect(spies.getIds).have.been.called
            })

            it('should call `getListDB`', () => {
              expect(spies.getListDB).have.been.calledOnce
            })

            it('should return the cached values', async () => {
              expect(redisResponse).to.eql(OBJECTS)
            })
          })

          context('and `getListDB` returns an empty array', () => {
            before(async () => {
              spies = {
                getIds  : SpyMock
                  .addReturnSpy(HASHKeySingleID, 'getIds'),
                getListDB : SpyMock
                  .addReturnSpy(HASHKeySingleID, 'getListDB', [])
              }

              keyNames = await HASHKeySingleID.getKeyNames(ID_ATTRS)

              await HASHKeySingleID.setList(OBJECTS.slice(0, 2))

              redisResponse = await HASHKeySingleID.getList(ID_ATTRS)
            })

            after(async () => {
              await GenericHASHCache.delete(keyNames)

              SpyMock.restoreAll()
            })

            it('should call `getIds`', () => {
              expect(spies.getIds).have.been.called
            })

            it('should call `getListDB`', () => {
              expect(spies.getListDB).have.been.calledOnce
            })

            it('should return the cached values', async () => {
              expect(redisResponse).to.eql(OBJECTS.slice(0, 2))
            })
          })
        })
      })

      context('when there are no cached values', () => {
        let keyNames, spies, redisResponse
        const ID_ATTRS = HASHKeySingleID.getIdAttrs(OBJECTS)

        context('and `getListDB` returns an array', () => {
          before(async () => {
            spies = {
              getIds  : SpyMock
                .addReturnSpy(HASHKeySingleID, 'getIds'),
              getListDB : SpyMock
                .addReturnSpy(HASHKeySingleID, 'getListDB', OBJECTS)
            }

            keyNames = await HASHKeySingleID.getKeyNames(ID_ATTRS)

            redisResponse = await HASHKeySingleID.getList(ID_ATTRS)
          })

          after(async () => {
            await GenericHASHCache.delete(keyNames)

            SpyMock.restoreAll()
          })

          it('should call `getIds`', () => {
            expect(spies.getIds).have.been.called
          })

          it('should call `getListDB`', () => {
            expect(spies.getListDB).have.been.calledOnce
          })

          it('should return the cached values', async () => {
            expect(redisResponse).to.eql(OBJECTS)
          })
        })

        context('and `getListDB` returns an empty array', () => {
          before(async () => {
            spies = {
              getIds  : SpyMock
                .addReturnSpy(HASHKeySingleID, 'getIds'),
              getListDB : SpyMock
                .addReturnSpy(HASHKeySingleID, 'getListDB', [])
            }

            keyNames = await HASHKeySingleID.getKeyNames(ID_ATTRS)

            redisResponse = await HASHKeySingleID.getList(ID_ATTRS)
          })

          after(async () => {
            await GenericHASHCache.delete(keyNames)

            SpyMock.restoreAll()
          })

          it('should call `getIds`', () => {
            expect(spies.getIds).have.been.called
          })

          it('should call `getListDB`', () => {
            expect(spies.getListDB).have.been.calledOnce
          })

          it('should return an emtpy array', async () => {
            expect(redisResponse).to.eql([])
          })
        })
      })
    })

    context('when the key is `STRING`', () => {
      const OBJECTS = GenericRedisCacheMock.getObjectMocks({}, 5)

      const STRING_KEY_VALUES = OBJECTS.map((object) => {
        return {
          key: object.id,
          value: 'test'+ (Math.floor(Math.random() * 1000) + 1)
        }
      })

      const STRING_VALUES = STRING_KEY_VALUES.map((key) => {
        return key.value
      })

      context('and there are cached values', () => {
        context('and all the keys passed have cached values', () => {
          const ID_ATTRS = STRINGKeySingleID.getIdAttrs(OBJECTS)
          let keyNames, spies, redisResponse

          before(async () => {
            spies = {
              getIds  : SpyMock
                .addReturnSpy(STRINGKeySingleID, 'getIds')
            }

            keyNames = await STRINGKeySingleID.getKeyNames(ID_ATTRS)

            await STRINGKeySingleID.setList(STRING_KEY_VALUES)

            redisResponse = await STRINGKeySingleID.getList(ID_ATTRS)
          })

          after(async () => {
            await GenericSTRINGCache.delete(keyNames)

            SpyMock.restoreAll()
          })

          it('should call `getIds`', () => {
            expect(spies.getIds).have.been.called
          })

          it('should return the cached values', async () => {
            expect(redisResponse).to.deep.equalInAnyOrder(STRING_VALUES)
          })
        })

        context('and some keys are not cached', () => {
          const ID_ATTRS = STRINGKeySingleID.getIdAttrs(OBJECTS)
          let keyNames, spies, redisResponse

          context('and `getListDB` returns an array', () => {
            before(async () => {
              spies = {
                getIds  : SpyMock
                  .addReturnSpy(STRINGKeySingleID, 'getIds'),
                getListDB : SpyMock
                  .addReturnSpy(STRINGKeySingleID, 'getListDB', STRING_KEY_VALUES.slice(2))
              }

              keyNames = await STRINGKeySingleID.getKeyNames(ID_ATTRS)

              await STRINGKeySingleID.setList(STRING_KEY_VALUES.slice(0, 2))

              redisResponse = await STRINGKeySingleID.getList(ID_ATTRS)
            })

            after(async () => {
              await GenericSTRINGCache.delete(keyNames)

              SpyMock.restoreAll()
            })

            it('should call `getIds`', () => {
              expect(spies.getIds).have.been.called
            })

            it('should call `getListDB`', () => {
              expect(spies.getListDB).have.been.calledOnce
            })

            it('should return the cached values', async () => {
              expect(redisResponse).to.deep.equalInAnyOrder(STRING_VALUES)
            })
          })

          // context('and `getListDB` returns an empty array', () => {
          //   before(async () => {
          //     spies = {
          //       getIds  : SpyMock
          //         .addReturnSpy(STRINGKeySingleID, 'getIds'),
          //       getListDB : SpyMock
          //         .addReturnSpy(STRINGKeySingleID, 'getListDB', [])
          //     }

          //     keyNames = await STRINGKeySingleID.getKeyNames(ID_ATTRS)

          //     await STRINGKeySingleID.setList(STRING_KEY_VALUES.slice(0, 2))

          //     redisResponse = await STRINGKeySingleID.getList(ID_ATTRS)
          //   })

          //   after(async () => {
          //     await GenericSTRINGCache.delete(keyNames)

          //     SpyMock.restoreAll()
          //   })

          //   it('should call `getIds`', () => {
          //     expect(spies.getIds).have.been.called
          //   })

          //   it('should call `getListDB`', () => {
          //     expect(spies.getListDB).have.been.calledOnce
          //   })

          //   it('should return the cached values', async () => {
          //     expect(redisResponse).to.deep.equalInAnyOrder(STRING_VALUES.slice(0, 2))
          //   })
          // })
        })
      })

      context('when there are no cached values', () => {
        let keyNames, spies, redisResponse
        const ID_ATTRS = STRINGKeySingleID.getIdAttrs(OBJECTS)

        context('and `getListDB` returns an array', () => {
          before(async () => {
            spies = {
              getIds  : SpyMock
                .addReturnSpy(STRINGKeySingleID, 'getIds'),
              getListDB : SpyMock
                .addReturnSpy(STRINGKeySingleID, 'getListDB', STRING_KEY_VALUES)
            }

            keyNames = await STRINGKeySingleID.getKeyNames(ID_ATTRS)

            redisResponse = await STRINGKeySingleID.getList(ID_ATTRS)
          })

          after(async () => {
            await GenericSTRINGCache.delete(keyNames)

            SpyMock.restoreAll()
          })

          it('should call `getIds`', () => {
            expect(spies.getIds).have.been.called
          })

          it('should call `getListDB`', () => {
            expect(spies.getListDB).have.been.calledOnce
          })

          it('should return the cached values', async () => {
            expect(redisResponse).to.deep.equalInAnyOrder(STRING_VALUES)
          })
        })

        context('and `getListDB` returns an empty array', () => {
          before(async () => {
            spies = {
              getIds  : SpyMock
                .addReturnSpy(STRINGKeySingleID, 'getIds', []),

              getListDB : SpyMock
                .addReturnSpy(STRINGKeySingleID, 'getListDB', [])
            }

            keyNames = await STRINGKeySingleID.getKeyNames(ID_ATTRS)

            redisResponse = await STRINGKeySingleID.getList(ID_ATTRS)
          })

          after(async () => {
            await GenericSTRINGCache.delete(keyNames)

            SpyMock.restoreAll()
          })

          it('should call `getIds`', () => {
            expect(spies.getIds).have.been.called
          })

          it('should call `getListDB`', () => {
            expect(spies.getListDB).have.been.calledOnce
          })

          it('should return an emtpy array', async () => {
            expect(redisResponse).to.eql([])
          })
        })
      })
    })
  })

  describe('.delete', () => {
    context('when the key is `JSON`', () => {
      context('and the are cached values', () => {
        const OBJECTS = GenericRedisCacheMock.getObjectMocks()
        const ID_ATTRS = JSONKeySingleID.getIdAttrs(OBJECTS)

        let keyNames

        before(async () => {
          keyNames = await JSONKeySingleID.getKeyNames(ID_ATTRS)

          await JSONKeySingleID.setList(OBJECTS)
        })

        context('and `keys` is not passed', () => {
          it('should return `0`', async () => {
            const response = await JSONKeySingleID.delete()

            expect(response).to.be.null
          })
        })

        context('and `keys` is passed', () => {
          it('should return the number of deletes keys', async () => {
            const response = await JSONKeySingleID.delete(ID_ATTRS)

            expect(response).to.eql(OBJECTS)
          })

          it('should delete the keys from cache', async () => {
            const response = await GenericJSONCache.getListCache(keyNames)

            expect(response).to.eql([])
          })
        })
      })
    })

    context('when the key is `HASH`', () => {
      context('and there are cached values', () => {
        const OBJECTS = GenericRedisCacheMock.getObjectMocks()
        const ID_ATTRS = HASHKeySingleID.getIdAttrs(OBJECTS)
        let keyNames

        before(async () => {
          keyNames = await HASHKeySingleID.getKeyNames(ID_ATTRS)

          await HASHKeySingleID.setList(OBJECTS)
        })

        context('and `keys` is not passed', () => {
          it('should return `null`', async () => {
            const response = await HASHKeySingleID.delete()

            expect(response).to.be.null
          })
        })

        context('and `keys` is passed', () => {
          it('should return the number of deletes keys', async () => {
            const keys = ID_ATTRS.map((value) => {
              return value.id
            })
            const response = await HASHKeySingleID.delete(keys)

            expect(response).to.eql(OBJECTS)
          })

          it('should delete the keys from cache', async () => {
            const response = await GenericHASHCache.getListCache(keyNames)

            expect(response).to.eql([])
          })
        })
      })
    })

    context('when the key is `STRING`', () => {
      context('and the are cached values', () => {
        const OBJECTS = GenericRedisCacheMock.getObjectMocks()
        const ID_ATTRS = STRINGKeySingleID.getIdAttrs(OBJECTS)

        let values, keyNames, stringValues

        before(async () => {
          keyNames = await STRINGKeySingleID.getKeyNames(ID_ATTRS)

          values = GenericRedisCacheMock.getRandomStrings(3)

          stringValues = OBJECTS.map((object, index) => {
            return {
              key: object.id,
              value: values[index]
            }
          })

          await STRINGKeySingleID.setList(stringValues)
        })

        context('and `keys` is not passed', () => {
          it('should return `0`', async () => {
            const response = await STRINGKeySingleID.delete()

            expect(response).to.be.null
          })
        })

        context('and `keys` is passed', () => {
          it('should return the  deletes values', async () => {
            const response = await STRINGKeySingleID.delete(ID_ATTRS)

            expect(response).to.eql(values)
          })

          it('should delete the keys from cache', async () => {
            const response = await GenericSTRINGCache.getListCache(keyNames)

            expect(response).to.eql([])
          })
        })
      })
    })

    context('when the key is `JSON_ARRAY`', () => {
      context('and the are cached values', () => {
        const OBJECTS = GenericRedisCacheMock.getObjectMocks()
        const ID_ATTRS = JSONArrayKeySingleID.getIdAttrs(OBJECTS)

        let keyNames

        before(async () => {
          keyNames = await JSONArrayKeySingleID
            .getKeyNames(ID_ATTRS)

          for (let i = 0; i < OBJECTS.length; i++) {
            await redis
              .json_setAsync(keyNames[i], '.', JSON.stringify([OBJECTS[i]]))
          }
        })

        context('and `keys` is not passed', () => {
          it('should return `0`', async () => {
            const response = await JSONArrayKeySingleID
              .delete()

            expect(response).to.be.null
          })
        })

        context('and `keys` is passed', () => {
          it('should return the number of deletes keys', async () => {
            const response = await JSONArrayKeySingleID
              .delete(ID_ATTRS)

            expect(response).to.eql(OBJECTS)
          })

          it('should delete the keys from cache', async () => {
            const response = await GenericJSONArrayCache
              .getListCache(keyNames)

            expect(response).to.eql([])
          })
        })
      })
    })
  })

  describe('.slice', () => {
    context('when the key is `JSON_ARRAY`', () => {
      context('and there are cached values', () => {
        const ID = 42
        const VALUE = [1,2,3,4]
        const KEY_NAME = JSONArrayKeySingleID
          .getKeyName(ID)

        context('and `key` is passed', () => {
          context('and `params` is passed', () => {
            let response

            before(async () => {
              await redis
                .json_setAsync(KEY_NAME, '.', JSON.stringify(VALUE))
                
              const params = {
                start : 1,
                stop  : 4
              }

              response = await JSONArrayKeySingleID
                .slice(ID, params)
            })

            after(async () => {
              await GenericJSONArrayCache
                .delete(KEY_NAME)
            })

            it('should return the new list size',() => {
              expect(response).to.eql(3)
            })

            it('should set new list on cache', async () => {
              const cachedValue = await GenericJSONArrayCache
                .getCache(KEY_NAME)
              
              const newValue = VALUE.slice(1,4)  

              expect(cachedValue).to.eql(newValue)
            })
          })

          context('and `params` is not passed', () => {
            let response

            before(async () => {
              await redis
                .json_setAsync(KEY_NAME, '.', JSON.stringify(VALUE))
                
              response = await JSONArrayKeySingleID
                .slice(ID)
            })

            after(async () => {
              await GenericJSONArrayCache
                .delete(KEY_NAME)
            })

            it('should return the new list size',() => {
              const size = VALUE.length - 1

              expect(response).to.eql(size)
            })

            it('should set new list on cache', async () => {
              const cachedValue = await GenericJSONArrayCache
                .getCache(KEY_NAME)
              
              const newValue = VALUE.slice(1,4)  

              expect(cachedValue).to.eql(newValue)
            })
          })
        })

        context('and `key` is not passed', () => {
          let response

          before(async () => {           
            response = await JSONArrayKeySingleID
              .slice()
          })

          it('should return `null`', () => {
            expect(response).to.be.null
          })
        })
      })

      context('and there are no cached values', () => {
        const ID = 42

        let response

        before(async () => {
          const params = {
            start : 1,
            stop  : 4
          }

          response = await JSONArrayKeySingleID
            .slice(ID, params)
        })

        it('should return `null`',() => {
          expect(response).to.be.null
        })
      })
    })

    context('when the key is not `JSON_ARRAY`', () => {
      const ID = 42
      const VALUE = { test: ID }
      const KEY_NAME = JSONKeySingleID
        .getKeyName(ID)

      let response

      before(async () => {
        await redis
          .json_setAsync(KEY_NAME, '.', JSON.stringify(VALUE))
          
        const params = {
          start : 1,
          stop  : 4
        }

        response = await JSONKeySingleID
          .slice(ID, params)
      })

      after(async () => {
        await GenericJSONArrayCache
          .delete(KEY_NAME)
      })

      it('should return `null`',() => {
        expect(response).to.be.null
      })
    })
  })

  describe('.isCached', () => {
    context('when the key is `JSON`', () => {
      context('and the key has one `ID`', () => {
        const VALUE = 1
        const CACHE_VALUE = { teste: VALUE }

        context('when there is value cached', () => {
          before(async () => {
            await GenericJSONCacheMock.add(JSONKeySingleID.getKeyName(VALUE), CACHE_VALUE)
          })

          after(async () => {
            await GenericJSONCacheMock.delete(JSONKeySingleID.getKeyName(VALUE))
          })

          context('and a `key` is passed', () => {
            it('should return `true`', async () => {
              const result = await JSONKeySingleID.isCached(VALUE)

              expect(result).to.eql(true)
            })
          })

          context('and a `key` is not passed', () => {
            it('should return `false`', async () => {
              const result = await JSONKeySingleID.isCached()

              expect(result).to.eql(false)
            })
          })

        })

        context('when there is no value cached', () => {
          it('should return null', async () => {
            const result = await JSONKeySingleID.isCached(VALUE)

            expect(result).to.eql(false)
          })
        })
      })

      context('and the key has more than one `ID`', () => {
        const VALUES = {
          object_id: Math.floor((Math.random() * 50) + 1),
          second_id: Math.floor((Math.random() * 50) + 1),
          third_id: Math.floor((Math.random() * 50) + 1)
        }

        const CACHE_VALUE = { x: 1 }

        context('when there value cached', () => {
          before(async () => {
            await GenericJSONCacheMock.add(JSONKeyMultiID.getKeyName(VALUES), CACHE_VALUE)
          })

          after(async () => {
            await GenericJSONCacheMock.delete(JSONKeyMultiID.getKeyName(VALUES))
          })


          it('should return `true`', async () => {
            const result = await JSONKeyMultiID.isCached(VALUES)

            expect(result).to.eql(true)
          })
        })

        context('when there is no value cached', () => {
          it('should return false', async () => {
            const result = await JSONKeyMultiID.isCached(VALUES)

            expect(result).to.eql(false)
          })
        })
      })
    })

    context('when the key is `HASH`', () => {
      const VALUE = 1

      context('and there is value cached', () => {
        before(async () => {
          await GenericHASHCache.setCache(HASHKeySingleID.getKeyName(VALUE), VALUE, VALUE)
        })

        after(async () => {
          await GenericHASHCache.delete(HASHKeySingleID.getKeyName(VALUE), VALUE)
        })


        it('should return `true`', async () => {
          const result = await HASHKeySingleID.isCached(VALUE)

          expect(result).to.eql(true)
        })
      })

      context('and there is no value cached', () => {
        it('should return `false`', async () => {
          const result = await HASHKeySingleID.isCached(VALUE)

          expect(result).to.eql(false)
        })
      })
    })

    context('when the key is `STRING`', () => {
      const VALUE = 'string_value'

      context('and there is value cached', () => {
        before(async () => {
          await GenericSTRINGCache.setCache(STRINGKeySingleID.getKeyName(VALUE), VALUE)
        })

        after(async () => {
          await GenericSTRINGCache.delete(STRINGKeySingleID.getKeyName(VALUE))
        })

        it('should return `true`', async () => {
          const result = await STRINGKeySingleID.isCached(VALUE)

          expect(result).to.eql(true)
        })
      })

      context('and there is no value cached', () => {
        it('should return `false`', async () => {
          const result = await STRINGKeySingleID.isCached(VALUE)

          expect(result).to.eql(false)
        })
      })
    })

    context('when the key is `JSON_ARRAY`', () => {
      context('and the key has one `ID`', () => {
        const VALUE = 1
        const CACHE_VALUE = { teste: VALUE }

        context('when there is value cached', () => {
          before(async () => {
            await GenericJSONArrayCache
              .initArrayCache(JSONArrayKeySingleID.getKeyName(VALUE), CACHE_VALUE)
          })

          after(async () => {
            await GenericJSONCacheMock
              .delete(JSONArrayKeySingleID.getKeyName(VALUE))
          })

          context('and a `key` is passed', () => {
            it('should return `true`', async () => {
              const result = await JSONArrayKeySingleID
                .isCached(VALUE)

              expect(result).to.eql(true)
            })
          })

          context('and a `key` is not passed', () => {
            it('should return `false`', async () => {
              const result = await JSONArrayKeySingleID
                .isCached()

              expect(result).to.eql(false)
            })
          })

        })

        context('when there is no value cached', () => {
          it('should return null', async () => {
            const result = await JSONArrayKeySingleID
              .isCached(VALUE)

            expect(result).to.eql(false)
          })
        })
      })

      context('and the key has more than one `ID`', () => {
        const VALUES = {
          object_id: Math.floor(faker.datatype.number(50) + 1),
          second_id: Math.floor(faker.datatype.number(50) + 1),
          third_id: Math.floor(faker.datatype.number(50)+ 1)
        }

        const CACHE_VALUE = { x: 1 }

        context('when there value cached', () => {
          before(async () => {
            await GenericJSONArrayCache
              .initArrayCache(JSONArrayKeyMultiID.getKeyName(VALUES), CACHE_VALUE)
          })

          after(async () => {
            await GenericJSONCacheMock
              .delete(JSONArrayKeyMultiID.getKeyName(VALUES))
          })


          it('should return `true`', async () => {
            const result = await JSONArrayKeyMultiID
              .isCached(VALUES)

            expect(result).to.eql(true)
          })
        })

        context('when there is no value cached', () => {
          it('should return false', async () => {
            const result = await JSONArrayKeyMultiID
              .isCached(VALUES)

            expect(result).to.eql(false)
          })
        })
      })
    })
  })

  describe('.isAttrTrue', () => {
    const ATTR_NAME = 'attr'

    context('when `id` is a `Number`', () => {
      context('when `attrName` is not `null`', () => {
        context('when there is an `object`', () => {
          context('when `attr` is not `null`', () => {
            const IS_ENABLED = false

            let isAttrTrue

            before(async () => {
              const objectId = `${Math.round(Math.random() * 99999)}-3b`
              const objectMock = {
                [ATTR_NAME]: IS_ENABLED
              }

              SpyMock
                .addDependencySpy(GenericRedisCache, 'GenericRedisCache.get', objectMock)

              isAttrTrue = await GenericRedisCache
                .isAttrTrue(objectId, ATTR_NAME)
            })

            after(() => SpyMock.restoreAll())

            it('should return its value', () => {
              expect(isAttrTrue).to.eql(IS_ENABLED)
            })
          })

          context('when `attr` is `null`', () => {
            context('when `defaultValue` is `undefined`', () => {
              let isAttrTrue

              before(async () => {
                const objectId = `${Math.round(Math.random() * 99999)}-3b`
                const objectMock = {
                  [ATTR_NAME]: null
                }

                SpyMock
                  .addDependencySpy(GenericRedisCache, 'GenericRedisCache.get', objectMock)

                isAttrTrue = await GenericRedisCache
                  .isAttrTrue(objectId, ATTR_NAME)
              })

              after(() => SpyMock.restoreAll())

              it('should return `true`', () => {
                expect(isAttrTrue).to.true
              })
            })

            context('when `defaultValue` is `false`', () => {
              let isAttrTrue

              before(async () => {
                const objectId = `${Math.round(Math.random() * 99999)}-3b`
                const objectMock = {
                  [ATTR_NAME]: null
                }

                SpyMock
                  .addDependencySpy(GenericRedisCache, 'GenericRedisCache.get', objectMock)

                isAttrTrue = await GenericRedisCache
                  .isAttrTrue(objectId, ATTR_NAME, false)
              })

              after(() => SpyMock.restoreAll())

              it('should return `false`', () => {
                expect(isAttrTrue).to.false
              })
            })
          })

          context('when `attr` is `undefined`', () => {
            context('when `defaultValue` is `undefined`', () => {
              let isAttrTrue

              before(async () => {
                const objectId = `${Math.round(Math.random() * 99999)}-3b`
                const objectMock = {}

                SpyMock
                  .addDependencySpy(GenericRedisCache, 'GenericRedisCache.get', objectMock)

                isAttrTrue = await GenericRedisCache
                  .isAttrTrue(objectId, ATTR_NAME)
              })

              after(() => SpyMock.restoreAll())

              it('should return `true`', () => {
                expect(isAttrTrue).to.true
              })
            })

            context('when `defaultValue` is `false`', () => {
              let isAttrTrue

              before(async () => {
                const objectId = `${Math.round(Math.random() * 99999)}-3b`
                const objectMock = {}

                SpyMock
                  .addDependencySpy(GenericRedisCache, 'GenericRedisCache.get', objectMock)

                isAttrTrue = await GenericRedisCache
                  .isAttrTrue(objectId, ATTR_NAME, false)
              })

              after(() => SpyMock.restoreAll())

              it('should return `false`', () => {
                expect(isAttrTrue).to.false
              })
            })
          })
        })

        context('when there is no `object`', () => {
          let isAttrTrue

          before(async () => {
            const objectId = `${Math.round(Math.random() * 99999)}-3b`

            SpyMock
              .addDependencySpy(GenericRedisCache, 'GenericRedisCache.get', null)

            isAttrTrue = await GenericRedisCache
              .isAttrTrue(objectId, ATTR_NAME)
          })

          after(() => SpyMock.restoreAll())

          it('should return `null`', () => {
            expect(isAttrTrue).to.not.exist
          })
        })
      })

      context('when `attrName` is `null`', () => {
        const IS_ENABLED = false

        let isAttrTrue

        before(async () => {
          const objectId = `${Math.round(Math.random() * 99999)}-3b`
          const objectMock = {
            [ATTR_NAME]: IS_ENABLED
          }

          SpyMock
            .addDependencySpy(GenericRedisCache, 'GenericRedisCache.get', objectMock)

          isAttrTrue = await GenericRedisCache
            .isAttrTrue(objectId, null)
        })

        it('should return `null`', () => {
          expect(isAttrTrue).to.not.exist
        })
      })
    })

    context('when `id` is an `Object`', () => {
      context('when `attrName` is not `null`', () => {
        context('when `attr` is not `null`', () => {
          const IS_ENABLED = false

          let isAttrTrue

          before(async () => {
            const objectMock = {
              [ATTR_NAME]: IS_ENABLED
            }

            SpyMock
              .addDependencySpy(GenericRedisCache, 'GenericRedisCache.get', objectMock)

            isAttrTrue = await GenericRedisCache
              .isAttrTrue(objectMock, ATTR_NAME)
          })

          after(() => SpyMock.restoreAll())

          it('should return its value', () => {
            expect(isAttrTrue).to.eql(IS_ENABLED)
          })
        })

        context('when `attr` is `null`', () => {
          let isAttrTrue

          before(async () => {
            const objectMock = {
              [ATTR_NAME]: null
            }

            SpyMock
              .addDependencySpy(GenericRedisCache, 'GenericRedisCache.get', objectMock)

            isAttrTrue = await GenericRedisCache
              .isAttrTrue(objectMock, ATTR_NAME)
          })

          after(() => SpyMock.restoreAll())

          it('should return `true`', () => {
            expect(isAttrTrue).to.true
          })
        })

        context('when `attr` is `undefined`', () => {
          let isAttrTrue

          before(async () => {
            const objectMock = {}

            SpyMock
              .addDependencySpy(GenericRedisCache, 'GenericRedisCache.get', objectMock)

            isAttrTrue = await GenericRedisCache
              .isAttrTrue(objectMock, ATTR_NAME)
          })

          after(() => SpyMock.restoreAll())

          it('should return `true`', () => {
            expect(isAttrTrue).to.true
          })
        })
      })

      context('when `attrName` is `null`', () => {
        const IS_ENABLED = false

        let isAttrTrue

        before(async () => {
          const objectMock = {
            [ATTR_NAME]: IS_ENABLED
          }

          SpyMock
            .addDependencySpy(GenericRedisCache, 'GenericRedisCache.get', objectMock)

          isAttrTrue = await GenericRedisCache
            .isAttrTrue(objectMock, null)
        })

        it('should return `null`', () => {
          expect(isAttrTrue).to.not.exist
        })
      })
    })

    context('when `id` is `null`', () => {
      let isAttrTrue

      before(async () => {
        isAttrTrue = await GenericRedisCache
          .isAttrTrue(null)
      })

      it('should return `null`', () => {
        expect(isAttrTrue).to.not.exist
      })
    })
  })

  describe('.isKeyValid', () => {
    context('when `key` is not `null`', () => {
      const KEY = 'la'

      it('should return `true`', () => {
        const isKeyValid = JSONKeySingleID
          .isKeyValid(KEY)

        expect(isKeyValid).to.true
      })
    })

    context('when `key` is `null`', () => {
      context('when `cache model` has `KeyId`', () => {
        it('should return `false`', () => {
          const isKeyValid = JSONKeySingleID
            .isKeyValid()

          expect(isKeyValid).to.false
        })
      })

      context('when `cache model` has no `KeyId`', () => {
        it('should return `true`', () => {
          const isKeyValid = JSONKeyNoID
            .isKeyValid()

          expect(isKeyValid).to.true
        })
      })
    })
  })
})