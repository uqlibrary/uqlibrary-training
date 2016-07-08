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
       * Autoloads the training links from the API
       * @type {Boolean}
       */
      autoLoad: {
        type: Object,
        value: true
      },
      /**
       * Prefix for the google analytics category name. For example: "Home page"
       */
      gaCategoryPrefix: {
        type: String,
        value: '',
        observer: '_gaCategoryPrefixChanged'
      },
      /**
       * Holds the Google Analytics app name of this component
       */
      _gaAppName: {
        type: String,
        value: ''
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
      for (var i = 0; i < links.length; i++) {
        links[i].startDay = moment(links[i].start).format("D");
        links[i].startMonth = moment(links[i].start).format("MMM");
        links[i].startTime = moment(links[i].start).format("hh:mma");
        links[i].location = links[i].venue.split(',')[0];
        links[i].link = 'https://careerhub.uq.edu.au/students/events/detail/' + links[i].id;
      }

      this.links = links;
    },
    /** Parses and formats the JSON array when hours has updated */
    _linksChanged: function () {
      this.fire('uqlibrary-training-loaded');
    },
		/**
     * Called when a link is clicked
     * @param e
     * @private
     */
    _linkClicked: function (e) {
      this.$.ga.addEvent('Click', e.model.item.title);
      window.location = e.model.item.link;
    },
    /**
     * Checks whether this date is within 14 days
     * @param item
     * @private
     */
    _dateClass: function (item) {
      var d = moment(item.start);
      var old = moment().add(14, 'days').endOf('day');

      return (d.isBefore(old) ? 'close' : '');
    },
    /**
     * Sets the Google Analytics app name
     * @private
     */
    _gaCategoryPrefixChanged: function () {
      this._gaAppName = (this.gaCategoryPrefix ? this.gaCategoryPrefix + ' Training' : 'Training');
    }
  });
})();