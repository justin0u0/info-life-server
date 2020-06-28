'use strict';

const { Service } = require('egg');

class UtilsService extends Service {
  filterData({ data = {}, model, include = [], exclude = [] }) {
    const fields = include.length > 0 ? include : Object.keys(model.schema.obj);
    const resultData = {};

    fields.forEach((field) => {
      if (!exclude.includes(field) && typeof data[field] !== 'undefined') {
        resultData[field] = JSON.parse(JSON.stringify((data[field])));
      }
    });
    return resultData;
  }
}

module.exports = UtilsService;
