'use strict'

class GenericRedisCacheMock {
  static getObjectMocks(params = {}, length = 3) {
    const objects = []

    for (var i = length - 1; i >= 0; i--) {
      const object = {...GenericRedisCacheMock.getDefaultObject(), ...params}

      objects
        .push(object)
    }

    return objects
  }

  static getDefaultObject() {
    return {
      id                      : faker.internet.mac(),
      string_attr             : 'test'+ (Math.floor(Math.random() * 1000) + 1),
      number_attr             : faker.datatype.number(10) + 1,
    }
  }

  static getRandomStrings(length = 3) {
    const strings = []

    for (let i = 0; i < length; i++) {
      strings.push('test'+ (Math.floor(Math.random() * 1000) + 1))
    }

    return strings
  }
}

module.exports = GenericRedisCacheMock