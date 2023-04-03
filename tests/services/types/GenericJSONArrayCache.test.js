'use strict'

const GenericJSONArrayCache = require('../../../lib/services/types/GenericJSONArrayCache')
const JSONArrayKeySingleID = require('../../cache/JSON_ARRAY/JSONArrayKeySingleID')

const SpyMock = require('@kajoo-team/spy-mock/lib/SpyMock')

describe('GenericJSONArrayCache', () => {
  describe('.isCached', () => {
    context('when `keyName` is cached', () => {
      context('when `keyName` is passed', () => {
        const VALUE = 1
        const CACHE_VALUE = { teste: VALUE, attr1: 'teste' }
        const keyName = JSONArrayKeySingleID.getKeyName(VALUE)

        let isCached

        before(async () => {
          GenericJSONArrayCache
            .initArrayCache(keyName, CACHE_VALUE)

          isCached = await GenericJSONArrayCache
            .isCached(keyName)
        })

        after(async () => {
          await GenericJSONArrayCache
            .delete(keyName)
        })

        it('should return `true`', () => {
          expect(isCached).to.equal(true)
        })
      })

      context('when `keyName` is not passed', () => {
        const VALUE = 1
        const CACHE_VALUE = { teste: VALUE, attr1: 'teste' }
        const keyName = JSONArrayKeySingleID.getKeyName(VALUE)

        let isCached

        before(async () => {
          GenericJSONArrayCache
            .initArrayCache(keyName, CACHE_VALUE)

          isCached = await GenericJSONArrayCache
            .isCached()
        })

        after(async () => {
          await GenericJSONArrayCache
            .delete(keyName)
        })

        it('should return `false`', () => {
          expect(isCached).to.equal(false)
        })
      })
    })

    context('when `keyName` is not cached', () => {
      const VALUE = 1
      const keyName = JSONArrayKeySingleID.getKeyName(VALUE)

      let isCached

      before(async () => {
        isCached = await GenericJSONArrayCache
          .isCached(keyName)
      })

      it('should return false', async () => {
        expect(isCached).to.equal(false)
      })
    })
  })

  describe('.initArrayCache', () => {
    context('when the `keyName` is passed', () => {
      const ID = 1
      const keyName = JSONArrayKeySingleID.getKeyName(ID)

      context('and the `value` is passed', () => {
        const CACHE_VALUE = { teste: ID, attr1: 'teste' }

        let result

        before(async () => {
          result = await GenericJSONArrayCache
            .initArrayCache(keyName, CACHE_VALUE)
        })

        after(async () => {
          await GenericJSONArrayCache
            .delete(keyName)
        })

        it('should return the list size', () => {
          expect(result).to.eql(1)
        })

        it('should save the value on cache', async () => {
          const cachedValue = await GenericJSONArrayCache
            .getCache(keyName)

          expect(cachedValue).to.eql([CACHE_VALUE])
        })
      })

      context('and the `value` is not passed', () => {
        let result

        before(async () => {
          result = await GenericJSONArrayCache
            .initArrayCache(keyName)
        })

        after(async () => {
          await GenericJSONArrayCache
            .delete(keyName)
        })

        it('should return the list size', () => {
          expect(result).to.eql(0)
        })

        it('should save an empty list on cache', async () => {
          const cachedValue = await GenericJSONArrayCache
            .getCache(keyName)

          expect(cachedValue).to.eql([])
        })
      })
    })

    context('when the `keyName` is not passed', () => {
      let result

      before(async () => {
        result = await GenericJSONArrayCache
          .initArrayCache()
      })

      it('should return the list size', () => {
        expect(result).to.eql(0)
      })
    })
  })

  describe('._addCache', () => {
    const ID = 1
    const keyName = JSONArrayKeySingleID.getKeyName(ID)

    context('when the `position` is passed', () => {
      context('and the `position` is in the array\'s range', () => {
        const CACHE_VALUE = { teste: ID, attr1: 'teste' }
        const position = 0

        let result

        before(async () => {
          const value = { teste: 2 }

          GenericJSONArrayCache
            .initArrayCache(keyName, value)

          result = await GenericJSONArrayCache
            ._addCache(keyName, CACHE_VALUE, position)
        })

        after(async () => {
          await GenericJSONArrayCache
            .delete(keyName)
        })

        it('should return the list size', () => {
          expect(result).to.eql(2)
        })

        it('should save the value on cache', async () => {
          const cachedValue = await GenericJSONArrayCache
            .getCache(keyName)

          expect(cachedValue[position]).to.eql(CACHE_VALUE)
        })
      })

      context('and the `position` is not in the array\'s range', () => {
        const CACHE_VALUE = { teste: ID, attr1: 'teste' }

        let result

        before(async () => {
          const position = 10

          const value = { teste: 2 }

          GenericJSONArrayCache
            .initArrayCache(keyName, value)

          result = await GenericJSONArrayCache
            ._addCache(keyName, CACHE_VALUE, position)
        })

        after(async () => {
          await GenericJSONArrayCache
            .delete(keyName)
        })

        it('should return the list size', () => {
          expect(result).to.eql(2)
        })

        it('should save the value in the last position', async () => {
          const cachedValue = await GenericJSONArrayCache
            .getCache(keyName)

          const last = cachedValue.length - 1

          expect(cachedValue[last]).to.eql(CACHE_VALUE)
        })
      })
    })

    context('when the `position` is not passed', () => {
      const CACHE_VALUE = { teste: ID, attr1: 'teste' }

      let result

      before(async () => {
        const value = { teste: 2 }

        GenericJSONArrayCache
          .initArrayCache(keyName, value)

        result = await GenericJSONArrayCache
          ._addCache(keyName, CACHE_VALUE)
      })

      after(async () => {
        await GenericJSONArrayCache
          .delete(keyName)
      })

      it('should return the list size', () => {
        expect(result).to.eql(2)
      })

      it('should save the value in the last position', async () => {
        const cachedValue = await GenericJSONArrayCache
          .getCache(keyName)

        expect(cachedValue[cachedValue.length - 1]).to.eql(CACHE_VALUE)
      })
    })
  })

  describe('.addCache', () => {
    context('when a `keyName` is passed', () => {
      const ID = 1
      const keyName = JSONArrayKeySingleID.getKeyName(ID)

      context('and a `value` is passed', () => {
        context('and the `keyName` is cached', () => {
          const CACHE_VALUE = { teste: ID, attr1: 'teste' }

          let result
          let spies

          before(async () => {
            GenericJSONArrayCache
              .initArrayCache(keyName, { teste : 42 })

            spies = {
              _addCache : SpyMock
                .addReturnSpy(GenericJSONArrayCache, '_addCache', 1)
            }

            result = await GenericJSONArrayCache
              .addCache(keyName, CACHE_VALUE)
          })

          after(async () => {
            SpyMock
              .restoreAll()

            await GenericJSONArrayCache
              .delete(keyName)
          })

          it('should return the list size', () => {
            expect(result).to.eql(1)
          })

          it('should call `_addCache`', () => {
            expect(spies._addCache).to.have.been.calledOnce
          })
        })

        context('and the `keyName` is not cached', () => {
          const CACHE_VALUE = { teste: ID, attr1: 'teste'}

          let result
          let spies

          before(async () => {
            spies = {
              initArrayCache : SpyMock
                .addReturnSpy(GenericJSONArrayCache, 'initArrayCache', 1)
            }

            result = await GenericJSONArrayCache
              .addCache(keyName, CACHE_VALUE)
          })

          after(() => SpyMock.restoreAll())

          it('should return the list size', () => {
            expect(result).to.eql(1)
          })

          it('should call `initArrayCache`', () => {
            expect(spies.initArrayCache).have.been.calledOnce
          })
        })
      })

      context('and a `value` is not passed', () => {
        let result
        let spies

        before(async () => {
          spies = {
            initArrayCache : SpyMock
              .addReturnSpy(GenericJSONArrayCache, 'initArrayCache', 0)
          }

          result = await GenericJSONArrayCache
            .addCache(keyName)
        })

        after(() => SpyMock.restoreAll())

        it('should return the list size', () => {
          expect(result).to.eql(0)
        })

        it('should not call `initArrayCache`', () => {
          expect(spies.initArrayCache).to.have.been.called
        })
      })
    })

    context('when a `keyName` is not passed', () => {
      let result

      before(async () => {
        result = await GenericJSONArrayCache
          .addCache(null)
      })

      it('should return the list size', () => {
        expect(result).to.eql(0)
      })
    })
  })

  describe('.slice', () => {
    context('when `key` is passed', () => {
      const KEY = 1
      const KEY_NAME = JSONArrayKeySingleID.getKeyName(KEY)
      const VALUE = [1,2,3,4]

      context('and `start` is passed', () => {
        context('and `stop` is passed', () => {
          context('and `start` <= `stop`', () => {
            let response

            before(async () => {
              await redis
                .json_setAsync(KEY_NAME, '.', JSON.stringify(VALUE))

              const params = {
                start : 1,
                stop  : 3
              }

              response = await GenericJSONArrayCache
                .slice(KEY_NAME, params)
            })

            after(async () => {
              await GenericJSONArrayCache
                .delete(KEY_NAME)
            })

            it('should return the new list size', () => {
              expect(response).to.eql(3)
            })

            it('should save the new list on cache', async () => {
              const newValue = VALUE.slice(1,4)

              const redisResponse = await JSONArrayKeySingleID
                .getCache(KEY)

              expect(redisResponse).to.eql(newValue)
            })
          })

          context('and `start` > `stop`', () => {
            let response

            before(async () => {
              await redis
                .json_setAsync(KEY_NAME, '.', JSON.stringify(VALUE))

              const params = {
                start : 3,
                stop  : 1
              }

              response = await GenericJSONArrayCache
                .slice(KEY_NAME, params)
            })

            after(async () => {
              await GenericJSONArrayCache
                .delete(KEY_NAME)
            })

            it('should return the new list size', () => {
              expect(response).to.eql(0)
            })

            it('should save an empty list on cache', async () => {
              const redisResponse = await JSONArrayKeySingleID
                .getCache(KEY)

              expect(redisResponse).to.eql([])
            })
          })
        })

        context('and `stop` is not passed', () => {
          const PARAMS = { start : 1 }
          let response

          before(async () => {
            await redis
              .json_setAsync(KEY_NAME, '.', JSON.stringify(VALUE))

            response = await GenericJSONArrayCache
              .slice(KEY_NAME, PARAMS)
          })

          after(async () => {
            await GenericJSONArrayCache
              .delete(KEY_NAME)
          })

          it('should return the new list size', () => {
            const size = VALUE.length - PARAMS.start

            expect(response).to.eql(size)
          })

          it('should save the new list on cache', async () => {
            const newValue = VALUE.slice(PARAMS.start,4)

            const redisResponse = await JSONArrayKeySingleID
              .getCache(KEY)

            expect(redisResponse).to.eql(newValue)
          })
        })
      })

      context('and `start` is not passed', () => {
        context('and `stop` is passed', () => {
          let response

          before(async () => {
            await redis
              .json_setAsync(KEY_NAME, '.', JSON.stringify(VALUE))

            const params = { stop  : 3 }

            response = await GenericJSONArrayCache
              .slice(KEY_NAME, params)
          })

          after(async () => {
            await GenericJSONArrayCache
              .delete(KEY_NAME)
          })

          it('should return the new list size', () => {
            expect(response).to.eql(3)
          })

          it('should save the new list on cache', async () => {
            const newValue = VALUE.slice(1,4)

            const redisResponse = await JSONArrayKeySingleID
              .getCache(KEY)

            expect(redisResponse).to.eql(newValue)
          })
        })

        context('and `stop` is not passed', () => {
          let response

          before(async () => {
            await redis
              .json_setAsync(KEY_NAME, '.', JSON.stringify(VALUE))

            response = await GenericJSONArrayCache
              .slice(KEY_NAME)
          })

          after(async () => {
            await GenericJSONArrayCache
              .delete(KEY_NAME)
          })

          it('should return the new list size', () => {
            const size = VALUE.length - 1

            expect(response).to.eql(size)
          })

          it('should save the new list on cache', async () => {
            const newValue = VALUE.slice(1,4)

            const redisResponse = await JSONArrayKeySingleID
              .getCache(KEY)

            expect(redisResponse).to.eql(newValue)
          })
        })
      })
    })

    context('when `key` is not passed', () => {
      let response

      before(async () => {
        response = await GenericJSONArrayCache
          .slice()
      })

      it('should return `null`', () => {
        expect(response).to.be.null
      })
    })
  })
})