(function () {
  Polymer({
    is: 'uqlibrary-training',
    properties: {
      /** Opening hours of all libraries in JSON format */
      links: {
        type: Array,
        observer: "_linksChanged"
      },
      /**
       * Autoloads the library opening hours from the API
       * @type {Boolean}
       */
      autoLoad: {
        type: Object,
        value: true
      }
    },
    ready: function () {
      var self = this;

      // Setup event listener for Training
      this.$.trainingApi.addEventListener('uqlibrary-api-training', function (e) {
        self.setTrainingLinks(e.detail);
      });

      // Fetch hours
      if (this.autoLoad) {
        this.$.trainingApi.get();
      }
    },
    /**
     * Sets the "links" variable
     * @param links
     */
    setTrainingLinks: function (links) {
      this.links = links;
    },
    /** Parses and formats the JSON array when hours has updated */
    _linksChanged: function () {
      this.fire('uqlibrary-training-loaded');
    },
    /**
     * Returns the dynamic CSS class for this item
     * @param item
     * @returns {string}
     */
    itemClass: function (item) {
      return (item.link !== '' ? 'link' : '');
    },
    /**
     * Returns the ARIA role for this item
     * @param item
     * @returns {string}
     */
    itemRole: function (item) {
      return (item.link !== '' ? 'link' : 'any');
    },
    _linkClicked: function (e) {
      var item = e.model.item || e.model.sub;
      if (item && item.link !== '') {
        this.$.ga.addEvent('Library Training link clicked', item.name);
        window.location = item.link;
      }
    }
  });
})();