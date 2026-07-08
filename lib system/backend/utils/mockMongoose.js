const fs = require("fs");
const path = require("path");

const DATA_DIR = path.join(__dirname, "..", "data");
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

function generateId() {
  return "mock_" + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

function loadData(modelName) {
  const filePath = path.join(DATA_DIR, `${modelName}.json`);
  if (!fs.existsSync(filePath)) return [];
  try {
    return JSON.parse(fs.readFileSync(filePath, "utf8"));
  } catch (e) {
    return [];
  }
}

function saveData(modelName, data) {
  const filePath = path.join(DATA_DIR, `${modelName}.json`);
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2), "utf8");
}

function matches(doc, query) {
  if (!query || Object.keys(query).length === 0) return true;

  for (const key in query) {
    const val = query[key];

    if (key === "$or") {
      if (!Array.isArray(val)) return false;
      const anyMatch = val.some(subQuery => matches(doc, subQuery));
      if (!anyMatch) return false;
      continue;
    }

    if (key === "$and") {
      if (!Array.isArray(val)) return false;
      const allMatch = val.every(subQuery => matches(doc, subQuery));
      if (!allMatch) return false;
      continue;
    }

    const docVal = doc[key];

    if (val && typeof val === "object" && !Array.isArray(val)) {
      // Regex match support
      if (val.$regex !== undefined) {
        const regexStr = val.$regex;
        const options = val.$options || "";
        const regex = new RegExp(regexStr, options);
        if (!regex.test(String(docVal || ""))) return false;
      } else if (val.$lt !== undefined) {
        if (!(docVal < val.$lt)) return false;
      } else if (val.$in !== undefined) {
        if (!Array.isArray(val.$in)) return false;
        const inVals = val.$in.map(v => String(v).toLowerCase());
        if (!inVals.includes(String(docVal || "").toLowerCase())) return false;
      } else {
        if (JSON.stringify(docVal) !== JSON.stringify(val)) return false;
      }
    } else {
      if (typeof val === "string" && typeof docVal === "string") {
        if (docVal.toLowerCase() !== val.toLowerCase()) return false;
      } else {
        if (docVal != val) return false;
      }
    }
  }
  return true;
}

function applyUpdate(doc, update, isInsert = false) {
  if (!update) return doc;

  if (update.$set || update.$setOnInsert) {
    if (update.$set) {
      for (const k in update.$set) {
        doc[k] = update.$set[k];
      }
    }
    if (isInsert && update.$setOnInsert) {
      for (const k in update.$setOnInsert) {
        doc[k] = update.$setOnInsert[k];
      }
    }
    for (const k in update) {
      if (k !== "$set" && k !== "$setOnInsert") {
        doc[k] = update[k];
      }
    }
  } else {
    for (const k in update) {
      doc[k] = update[k];
    }
  }
  return doc;
}

class MockQuery {
  constructor(dataPromise) {
    this.dataPromise = dataPromise;
  }
  sort(sortObj) {
    this.dataPromise = this.dataPromise.then(data => {
      const sorted = [...data];
      const keys = Object.keys(sortObj);
      if (keys.length > 0) {
        const key = keys[0];
        const dir = sortObj[key]; // 1 or -1
        sorted.sort((a, b) => {
          let valA = a[key];
          let valB = b[key];
          if (valA === undefined) return 1;
          if (valB === undefined) return -1;
          if (typeof valA === "string") {
            return dir === 1 ? valA.localeCompare(valB) : valB.localeCompare(valA);
          }
          return dir === 1 ? valA - valB : valB - valA;
        });
      }
      return sorted;
    });
    return this;
  }
  limit(n) {
    this.dataPromise = this.dataPromise.then(data => data.slice(0, n));
    return this;
  }
  then(onResolve, onReject) {
    return this.dataPromise.then(onResolve, onReject);
  }
}

class MockDocument {
  constructor(modelName, data) {
    this._modelName = modelName;
    Object.assign(this, data);
    if (!this._id) {
      this._id = generateId();
    }
    this.id = this._id;
  }

  async save() {
    const filePath = path.join(DATA_DIR, `${this._modelName}.json`);
    let list = [];
    if (fs.existsSync(filePath)) {
      try {
        list = JSON.parse(fs.readFileSync(filePath, "utf8"));
      } catch (e) {
        list = [];
      }
    }
    const index = list.findIndex(item => item._id === this._id);
    this.updatedAt = new Date().toISOString();
    if (!this.createdAt) {
      this.createdAt = new Date().toISOString();
    }
    const plain = this.toObject();
    if (index >= 0) {
      list[index] = plain;
    } else {
      list.push(plain);
    }
    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf8");
    return this;
  }

  async deleteOne() {
    const filePath = path.join(DATA_DIR, `${this._modelName}.json`);
    if (!fs.existsSync(filePath)) return;
    let list = [];
    try {
      list = JSON.parse(fs.readFileSync(filePath, "utf8"));
    } catch (e) {
      return;
    }
    const filtered = list.filter(item => item._id !== this._id);
    fs.writeFileSync(filePath, JSON.stringify(filtered, null, 2), "utf8");
  }

  toObject() {
    const plain = {};
    for (const key in this) {
      if (!key.startsWith("_modelName") && typeof this[key] !== "function") {
        plain[key] = this[key];
      }
    }
    plain.id = this._id;
    return plain;
  }
}

class MockModel {
  constructor(data) {
    return new MockDocument(this.constructor.modelName, data);
  }

  static get modelName() {
    return this._modelName;
  }

  static find(query = {}) {
    const list = loadData(this.modelName);
    const matched = list.filter(item => matches(item, query)).map(item => new MockDocument(this.modelName, item));
    return new MockQuery(Promise.resolve(matched));
  }

  static async findOne(query = {}) {
    const list = loadData(this.modelName);
    const matched = list.find(item => matches(item, query));
    return matched ? new MockDocument(this.modelName, matched) : null;
  }

  static async findById(id) {
    const list = loadData(this.modelName);
    const matched = list.find(item => item._id === id);
    return matched ? new MockDocument(this.modelName, matched) : null;
  }

  static async create(doc) {
    const inst = new MockDocument(this.modelName, doc);
    await inst.save();
    return inst;
  }

  static async insertMany(arr) {
    const filePath = path.join(DATA_DIR, `${this.modelName}.json`);
    let list = [];
    if (fs.existsSync(filePath)) {
      try {
        list = JSON.parse(fs.readFileSync(filePath, "utf8"));
      } catch (e) {
        list = [];
      }
    }

    const results = [];
    const now = new Date().toISOString();
    
    for (const item of arr) {
      const doc = { ...item };
      if (!doc._id) {
        doc._id = generateId();
      }
      doc.id = doc._id;
      doc.createdAt = doc.createdAt || now;
      doc.updatedAt = now;

      // Behave like Mongoose Document
      const inst = new MockDocument(this.modelName, doc);
      results.push(inst);
      
      const index = list.findIndex(l => l._id === doc._id);
      if (index >= 0) {
        list[index] = doc;
      } else {
        list.push(doc);
      }
    }

    fs.writeFileSync(filePath, JSON.stringify(list, null, 2), "utf8");
    return results;
  }

  static async countDocuments(query = {}) {
    const list = loadData(this.modelName);
    return list.filter(item => matches(item, query)).length;
  }

  static async findOneAndUpdate(query, update, options = {}) {
    const list = loadData(this.modelName);
    let index = list.findIndex(item => matches(item, query));
    let doc;
    if (index >= 0) {
      doc = new MockDocument(this.modelName, list[index]);
      applyUpdate(doc, update, false);
      list[index] = doc.toObject();
    } else if (options.upsert) {
      doc = new MockDocument(this.modelName, query);
      applyUpdate(doc, update, true);
      list.push(doc.toObject());
    } else {
      return null;
    }
    saveData(this.modelName, list);
    return doc;
  }

  static async findByIdAndUpdate(id, update, options = {}) {
    return this.findOneAndUpdate({ _id: id }, update, options);
  }

  static async findByIdAndDelete(id) {
    const list = loadData(this.modelName);
    const index = list.findIndex(item => item._id === id);
    if (index >= 0) {
      const deleted = list.splice(index, 1)[0];
      saveData(this.modelName, list);
      return new MockDocument(this.modelName, deleted);
    }
    return null;
  }

  static async deleteMany(query = {}) {
    const list = loadData(this.modelName);
    const remaining = list.filter(item => !matches(item, query));
    saveData(this.modelName, remaining);
    return { deletedCount: list.length - remaining.length };
  }

  static async aggregate(pipeline = []) {
    const list = loadData(this.modelName);
    const groupStage = pipeline.find(stage => stage.$group);
    if (groupStage) {
      const groupKey = groupStage.$group._id;
      const field = groupKey.startsWith("$") ? groupKey.slice(1) : groupKey;
      const counts = {};
      list.forEach(item => {
        const val = item[field] || "Uncategorized";
        counts[val] = (counts[val] || 0) + 1;
      });
      return Object.keys(counts).map(key => ({
        _id: key,
        count: counts[key]
      }));
    }
    return [];
  }
}

class MockSchema {
  constructor(definition, options) {
    this.definition = definition;
    this.options = options;
  }
  virtual() {
    return {
      get: () => {},
      set: () => {}
    };
  }
  set() {}
  index() {}
}

MockSchema.Types = {
  ObjectId: String,
  String: String,
  Number: Number,
  Boolean: Boolean,
  Date: Date
};

const models = {};

const mongooseMock = {
  Schema: MockSchema,
  Types: {
    ObjectId: String
  },
  model: function(name, schema) {
    if (!schema) {
      if (models[name]) return models[name];
      throw new Error(`Model ${name} not found`);
    }
    if (models[name]) return models[name];

    const modelClass = class extends MockModel {};
    modelClass._modelName = name;
    models[name] = modelClass;
    return modelClass;
  },
  models: models,
  connect: async () => {
    return Promise.resolve();
  },
  disconnect: async () => {
    return Promise.resolve();
  },
  set: () => {}
};

module.exports = mongooseMock;
