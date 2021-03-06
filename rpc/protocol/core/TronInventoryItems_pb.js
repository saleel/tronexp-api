/**
 * @fileoverview
 * @enhanceable
 * @suppress {messageConventions} JS Compiler reports an error if a variable or
 *     field starts with 'MSG_' and isn't a translatable message.
 * @public
 */
// GENERATED CODE -- DO NOT EDIT!

var jspb = require('google-protobuf');
var goog = jspb;
var global = Function('return this')();

goog.exportSymbol('proto.protocol.InventoryItems', null, global);

/**
 * Generated by JsPbCodeGenerator.
 * @param {Array=} opt_data Optional initial data array, typically from a
 * server response, or constructed directly in Javascript. The array is used
 * in place and becomes part of the constructed object. It is not cloned.
 * If no data is provided, the constructed object will be empty, but still
 * valid.
 * @extends {jspb.Message}
 * @constructor
 */
proto.protocol.InventoryItems = function(opt_data) {
  jspb.Message.initialize(
    this,
    opt_data,
    0,
    -1,
    proto.protocol.InventoryItems.repeatedFields_,
    null
  );
};
goog.inherits(proto.protocol.InventoryItems, jspb.Message);
if (goog.DEBUG && !COMPILED) {
  proto.protocol.InventoryItems.displayName = 'proto.protocol.InventoryItems';
}
/**
 * List of repeated fields within this message type.
 * @private {!Array<number>}
 * @const
 */
proto.protocol.InventoryItems.repeatedFields_ = [2];

if (jspb.Message.GENERATE_TO_OBJECT) {
  /**
   * Creates an object representation of this proto suitable for use in Soy templates.
   * Field names that are reserved in JavaScript and will be renamed to pb_name.
   * To access a reserved field use, foo.pb_<name>, eg, foo.pb_default.
   * For the list of reserved names please see:
   *     com.google.apps.jspb.JsClassTemplate.JS_RESERVED_WORDS.
   * @param {boolean=} opt_includeInstance Whether to include the JSPB instance
   *     for transitional soy proto support: http://goto/soy-param-migration
   * @return {!Object}
   */
  proto.protocol.InventoryItems.prototype.toObject = function(
    opt_includeInstance
  ) {
    return proto.protocol.InventoryItems.toObject(opt_includeInstance, this);
  };

  /**
   * Static version of the {@see toObject} method.
   * @param {boolean|undefined} includeInstance Whether to include the JSPB
   *     instance for transitional soy proto support:
   *     http://goto/soy-param-migration
   * @param {!proto.protocol.InventoryItems} msg The msg instance to transform.
   * @return {!Object}
   * @suppress {unusedLocalVariables} f is only used for nested messages
   */
  proto.protocol.InventoryItems.toObject = function(includeInstance, msg) {
    var f,
      obj = {
        type: jspb.Message.getFieldWithDefault(msg, 1, 0),
        itemsList: msg.getItemsList_asB64()
      };

    if (includeInstance) {
      obj.$jspbMessageInstance = msg;
    }
    return obj;
  };
}

/**
 * Deserializes binary data (in protobuf wire format).
 * @param {jspb.ByteSource} bytes The bytes to deserialize.
 * @return {!proto.protocol.InventoryItems}
 */
proto.protocol.InventoryItems.deserializeBinary = function(bytes) {
  var reader = new jspb.BinaryReader(bytes);
  var msg = new proto.protocol.InventoryItems();
  return proto.protocol.InventoryItems.deserializeBinaryFromReader(msg, reader);
};

/**
 * Deserializes binary data (in protobuf wire format) from the
 * given reader into the given message object.
 * @param {!proto.protocol.InventoryItems} msg The message object to deserialize into.
 * @param {!jspb.BinaryReader} reader The BinaryReader to use.
 * @return {!proto.protocol.InventoryItems}
 */
proto.protocol.InventoryItems.deserializeBinaryFromReader = function(
  msg,
  reader
) {
  while (reader.nextField()) {
    if (reader.isEndGroup()) {
      break;
    }
    var field = reader.getFieldNumber();
    switch (field) {
    case 1:
      var value = /** @type {number} */ (reader.readInt32());
      msg.setType(value);
      break;
    case 2:
      var value = /** @type {!Uint8Array} */ (reader.readBytes());
      msg.addItems(value);
      break;
    default:
      reader.skipField();
      break;
    }
  }
  return msg;
};

/**
 * Serializes the message to binary data (in protobuf wire format).
 * @return {!Uint8Array}
 */
proto.protocol.InventoryItems.prototype.serializeBinary = function() {
  var writer = new jspb.BinaryWriter();
  proto.protocol.InventoryItems.serializeBinaryToWriter(this, writer);
  return writer.getResultBuffer();
};

/**
 * Serializes the given message to binary data (in protobuf wire
 * format), writing to the given BinaryWriter.
 * @param {!proto.protocol.InventoryItems} message
 * @param {!jspb.BinaryWriter} writer
 * @suppress {unusedLocalVariables} f is only used for nested messages
 */
proto.protocol.InventoryItems.serializeBinaryToWriter = function(
  message,
  writer
) {
  var f = undefined;
  f = message.getType();
  if (f !== 0) {
    writer.writeInt32(1, f);
  }
  f = message.getItemsList_asU8();
  if (f.length > 0) {
    writer.writeRepeatedBytes(2, f);
  }
};

/**
 * optional int32 type = 1;
 * @return {number}
 */
proto.protocol.InventoryItems.prototype.getType = function() {
  return /** @type {number} */ (jspb.Message.getFieldWithDefault(this, 1, 0));
};

/** @param {number} value */
proto.protocol.InventoryItems.prototype.setType = function(value) {
  jspb.Message.setProto3IntField(this, 1, value);
};

/**
 * repeated bytes items = 2;
 * @return {!(Array<!Uint8Array>|Array<string>)}
 */
proto.protocol.InventoryItems.prototype.getItemsList = function() {
  return /** @type {!(Array<!Uint8Array>|Array<string>)} */ (jspb.Message.getRepeatedField(
    this,
    2
  ));
};

/**
 * repeated bytes items = 2;
 * This is a type-conversion wrapper around `getItemsList()`
 * @return {!Array.<string>}
 */
proto.protocol.InventoryItems.prototype.getItemsList_asB64 = function() {
  return /** @type {!Array.<string>} */ (jspb.Message.bytesListAsB64(
    this.getItemsList()
  ));
};

/**
 * repeated bytes items = 2;
 * Note that Uint8Array is not supported on all browsers.
 * @see http://caniuse.com/Uint8Array
 * This is a type-conversion wrapper around `getItemsList()`
 * @return {!Array.<!Uint8Array>}
 */
proto.protocol.InventoryItems.prototype.getItemsList_asU8 = function() {
  return /** @type {!Array.<!Uint8Array>} */ (jspb.Message.bytesListAsU8(
    this.getItemsList()
  ));
};

/** @param {!(Array<!Uint8Array>|Array<string>)} value */
proto.protocol.InventoryItems.prototype.setItemsList = function(value) {
  jspb.Message.setField(this, 2, value || []);
};

/**
 * @param {!(string|Uint8Array)} value
 * @param {number=} opt_index
 */
proto.protocol.InventoryItems.prototype.addItems = function(value, opt_index) {
  jspb.Message.addToRepeatedField(this, 2, value, opt_index);
};

proto.protocol.InventoryItems.prototype.clearItemsList = function() {
  this.setItemsList([]);
};

goog.object.extend(exports, proto.protocol);
