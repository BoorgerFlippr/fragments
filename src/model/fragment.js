// src/model/fragments.js

const { randomUUID } = require('crypto');
const contentType = require('content-type');

// Functions for working with fragment metadata/data using our DB
const {
  readFragment,
  writeFragment,
  readFragmentData,
  //writeFragmentData,
  listFragments,
  deleteFragment,
  writeFragmentData,
} = require('./data');

const validTypes = [`text/plain`];

class Fragment {
  constructor({ id, ownerId, created, updated, type, size = 0 }) {
    if (id) {
      this.id = id;
    } else {
      this.id = randomUUID({ disableEntropyCache: true });
    }

    if (ownerId) {
      this.ownerId = ownerId;
    } else {
      throw new Error('owner id cant be null');
    }

    const cDate = new Date();

    if (created) {
      this.created = created;
    } else {
      this.created = cDate.toISOString();
    }

    if (updated) {
      this.updated = updated;
    } else {
      this.updated = cDate.toISOString();
    }

    if (type) {
      if (validTypes.includes(contentType.parse(type).type)) {
        this.type = type;
      } else {
        throw new Error('invalid type');
      }
    } else {
      throw new Error('type cant be null');
    }

    if (size) {
      if (!(typeof size == 'number')) {
        throw new Error('size is not a number');
      } else {
        if (size < 0) {
          throw new Error('size cant be negative');
        } else {
          this.size = size;
        }
      }
    } else {
      this.size = 0;
    }
  }

  /**
   * Get all fragments (id or full) for the given user
   * @param {string} ownerId user's hashed email
   * @param {boolean} expand whether to expand ids to full fragments
   * @returns Promise<Array<Fragment>>
   */
  static async byUser(ownerId, expand = false) {
    const fragments = await listFragments(ownerId, expand);

    if (expand) {
      const pFragment = fragments.map((fragment) => Fragment.byId(ownerId, fragment.id));
      return Promise.all(pFragment);
    }

    return fragments;
  }

  /**
   * Gets a fragment for the user by the given id.
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<Fragment>
   */
  static async byId(ownerId, id) {
    const fragment = await readFragment(ownerId, id);

    if (!fragment) {
      throw new Error(`Fragment does ${id} does not exist`);
    }

    return fragment;
  }

  /**
   * Delete the user's fragment data and metadata for the given id
   * @param {string} ownerId user's hashed email
   * @param {string} id fragment's id
   * @returns Promise<void>
   */
  static delete(ownerId, id) {
    return deleteFragment(ownerId, id);
  }

  /**
   * Saves the current fragment to the database
   * @returns Promise<void>
   */
  save() {
    this.updated = new Date().toISOString();
    return writeFragment(this);
  }

  /**
   * Gets the fragment's data from the database
   * @returns Promise<Buffer>
   */
  getData() {
    return readFragmentData(this.ownerId, this.id);
  }

  /**
   * Set's the fragment's data in the database
   * @param {Buffer} data
   * @returns Promise<void>
   */
  async setData(data) {
    this.size = data.length;
    this.updated = new Date().toISOString();
    await writeFragmentData(this.ownerId, this.id, data);
  }

  /**
   * Returns the mime type (e.g., without encoding) for the fragment's type:
   * "text/html; charset=utf-8" -> "text/html"
   * @returns {string} fragment's mime type (without encoding)
   */
  get mimeType() {
    const { type } = contentType.parse(this.type);
    return type;
  }

  /**
   * Returns true if this fragment is a text/* mime type
   * @returns {boolean} true if fragment's type is text/*
   */
  get isText() {
    return this.type.includes('text/');
  }

  /**
   * Returns the formats into which this fragment type can be converted
   * @returns {Array<string>} list of supported mime types
   */
  get formats() {
    return validTypes;
  }

  /**
   * Returns true if we know how to work with this content type
   * @param {string} value a Content-Type value (e.g., 'text/plain' or 'text/plain: charset=utf-8')
   * @returns {boolean} true if we support this Content-Type (i.e., type/subtype)
   */
  static isSupportedType(value) {
    return validTypes.includes(contentType.parse(value).type);
  }
}

module.exports.Fragment = Fragment;
