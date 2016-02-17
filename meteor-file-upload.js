var images = new FS.Collection("images", {
    stores: [imageStore],
    filter: {
        allow: {
            contentTypes: ['image/*']
        }
    }
});


if (Meteor.isClient) {
  
Template.example.events({
  'change input': function(ev) {  
    _.each(ev.srcElement.files, function(file) {
      Meteor.saveFile(file, file.name);
    });
  }
});

// the upload shitty

Meteor.subscribe("images");
}

if (Meteor.isServer) {
  
images.allow({
    insert: function(userId, fileObj) {
        return !!userId; // we could check fileObj.metadata.owner?
    },
    update: function(userId, fileObj) {
        return !!userId;
    },
    remove: function(userId, fileObj) {
        return !!userId;
    },
    // Allow eg. only the user in metadata
    // the shareId is being discussed - eg. for sharing urls
    download: function(userId, fileObj/*, shareId*/) {
        return true;
    },
    fetch: []
});


var images = new FS.Collection("images", {
    stores: [gridfs],
    filter: {
        allow: {
            contentTypes: ['image/*']
        }
    }
});

var imageStore = new FS.Store.GridFS("images", {

  maxTries: 1, // optional, default 5
  chunkSize: 1024*1024  // optional, default GridFS chunk size in bytes (can be overridden per file).
                        // Default: 2MB. Reasonable range: 512KB - 4MB
});
// Publish images with userId in owner - this regulates reading the
// filerecord data - use allow/deny for "download" for restricting the
// access to the actual data.
Meteor.publish("images", function() {
    return images.find({ 'metadata.owner': this.userId });
});

}

