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
      },
      /**
       * Specifies whether to show the backup links
       */
      _showBackupLinks: {
        type: Boolean,
        value: false
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
        this.$.trainingApi.get({
          fetch: 5
        });
      }
    },
    /**
     * Sets the "links" variable
     * @param links
     */
    setTrainingLinks: function (links) {
      for (var i = 0; i < links.length; i++) {
        links[i].startDayWeek = moment(links[i].start).format("ddd");
        links[i].startDay = moment(links[i].start).format("D");
        links[i].startMonth = moment(links[i].start).format("MMM");
        links[i].startTime = moment(links[i].start).format("h:mma");
        links[i].location = links[i].venue.split(',')[0];
        links[i].link = 'https://careerhub.uq.edu.au/students/events/detail/' + links[i].id;
      }

      // TODO: Remove before going live. Debug only
      if (window.location.href.indexOf('noEvents=1') !== -1) {
        links = [];
      }

      this._showBackupLinks = (links.length === 0);

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
      return (moment().format("MM") === moment(item.start).format("MM") ? 'close' : '');
    },
    /**
     * Sets the Google Analytics app name
     * @private
     */
    _gaCategoryPrefixChanged: function () {
      this._gaAppName = (this.gaCategoryPrefix ? this.gaCategoryPrefix + ' Training' : 'Training');
    },
    /**
     * These are the backup links. Saved in the JS to make it easier to minify.
     * @private
     */
    _backupLinks: function () {
      return [
        {
          "name": "Online training",
          "description": "Access online resources",
          "link": "",
          "items": [
            {
              "name": "Library 101",
              "description": "LIBRARY 101 Library skills tutorial",
              "link": "https://learn.uq.edu.au/webapps/login/?new_loc=/webapps/blackboard/execute/enrollCourse?context=Course%26course_id=_13002_1"
            },
            {
              "name": "lynda.com",
              "description": "lynda.com online software and skills training Library classes",
              "link": "http://www.lynda.com/"
            },
            {
              "name": "Law online tutorial",
              "description": "",
              "link": "https://web.library.uq.edu.au/library-services/training/law-online-tutorial"
            }
          ]
        },
        {
          "name": "Library classes",
          "description": "Book into in person training offered by the Library",
          "link": "",
          "items": [
            {
              "name": "Research skills",
              "description": "",
              "link": "https://www.library.uq.edu.au/training/#Research Skills"
            },
            {
              "name": "EndNote",
              "description": "",
              "link": "https://www.library.uq.edu.au/training/#EndNote"
            },
            {
              "name": "IT Training",
              "description": "",
              "link": "https://www.library.uq.edu.au/training/#General Classes"
            }
          ]
        },
        {
          "name": "Other UQ classes",
          "description": "",
          "link": "",
          "items": [
            {
              "name": "UQ Student Services",
              "description": "",
              "link": "http://www.uq.edu.au/student-services/learning"
            }
          ]
        }
      ];
    }
  });
})();