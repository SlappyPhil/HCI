/**
 * @file A module for interacting with the DB.
 * @author Matt West <matt.west@kojilabs.com>
 * @license MIT {@link http://opensource.org/licenses/MIT}.
 */

var doneDB = (function() {
  var tDB = {};
  var datastore = null;

  /**
   * Open a connection to the datastore.
   */
  tDB.open = function(callback) {
    // Database version.
    var version = 1;

    // Open a connection to the datastore.
    var request = indexedDB.open('dones', version);

    // Handle datastore upgrades.
    request.onupgradeneeded = function(e) {
      var db = e.target.result;

      e.target.transaction.onerror = tDB.onerror;

      // Delete the old datastore.
      if (db.objectStoreNames.contains('done')) {
        db.deleteObjectStore('done');
      }

      // Create a new datastore.
      var store = db.createObjectStore('done', {
        keyPath: 'timestamp'
      });
    };

    // Handle successful datastore access.
    request.onsuccess = function(e) {
      // Get a reference to the DB.
      datastore = e.target.result;
      
      // Execute the callback.
      callback();
    };

    // Handle errors when opening the datastore.
    request.onerror = tDB.onerror;
  };


  /**
   * Fetch all of the todo items in the datastore.
   * @param {function} callback A function that will be executed once the items
   *                            have been retrieved. Will be passed a param with
   *                            an array of the todo items.
   */
  tDB.fetchDone = function(callback) {
    var db = datastore;
    var transaction = db.transaction(['done'], 'readwrite');
    var objStore = transaction.objectStore('done');

    var keyRange = IDBKeyRange.lowerBound(0);
    var cursorRequest = objStore.openCursor(keyRange);

    var dones = [];

    transaction.oncomplete = function(e) {
      // Execute the callback function.
      callback(dones);
    };

    cursorRequest.onsuccess = function(e) {
      var result = e.target.result;
      
      if (!!result == false) {
        return;
      }
      
      dones.push(result.value);

      result.continue();
    };

    cursorRequest.onerror = tDB.onerror;
  };


  /**
   * Create a new todo item.
   * @param {string} text The todo item.
   */
  tDB.createDone = function(text, callback) {
    // Get a reference to the db.
    var db = datastore;

    // Initiate a new transaction.
    var transaction = db.transaction(['done'], 'readwrite');

    // Get the datastore.
    var objStore = transaction.objectStore('done');

    // Create a timestamp for the todo item.
    var timestamp = new Date().getTime();
    
    // Create an object for the todo item.
    var done = {
      'text': text,
      'timestamp': timestamp
    };

    // Create the datastore request.
    var request = objStore.put(done);

    // Handle a successful datastore put.
    request.onsuccess = function(e) {
      // Execute the callback function.
      callback(done);
    };

    // Handle errors.
    request.onerror = tDB.onerror;
  };


  /**
   * Delete a todo item.
   * @param {int} id The timestamp (id) of the todo item to be deleted.
   * @param {function} callback A callback function that will be executed if the 
   *                            delete is successful.
   */
  tDB.deleteDone = function(id, callback) {
    var db = datastore;
    var transaction = db.transaction(['done'], 'readwrite');
    var objStore = transaction.objectStore('done');
    
    var request = objStore.delete(id);
    
    request.onsuccess = function(e) {
      callback();
    }
    
    request.onerror = function(e) {
      console.log(e);
    }
  };


  // Export the tDB object.
  return tDB;
}());

