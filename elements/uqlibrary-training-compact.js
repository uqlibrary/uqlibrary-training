(function () {
  Polymer({
    is: 'uqlibrary-training-compact',
    properties: {
      /**
       * List of all events (raw)
       */
      events: {
        type: Array,
        observer: "_eventsChanged"
      },
      /**
       * List of all formatted events
       */
      _formattedEvents: {
        type: Array,
        notify: true
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
       * Holds the Google Analytics app name of this component
       */
      gaAppName: {
        type: String,
        value: 'Training'
      },
      /**
       * Specifies filter id
       */
      filterId: {
        type: Number,
        value: 107
      },
      /**
       * Specifies number of items to fetch
       */
      take: {
        type: Number,
        value: 5
      },
      /**
       * Entry animation
       */
      _entryAnimation: {
        type: String,
        value: 'slide-from-right-animation'
      },
      /**
       * Exit animation
       */
      _exitAnimation: {
        type: String,
        value: 'slide-left-animation'
      },
      /**
       * Selected page
       */
      _selectedPage: {
        type: Number,
        value: 0
      },
      /**
       * Selected event
       */
      _selectedEvent: {
        type: Object
      }
    },
    ready: function () {
      var self = this;

      // Setup event listener for Training
      this.$.trainingApi.addEventListener('uqlibrary-api-training', function (e) {
        self.events = e.detail;
      });

      // Fetch hours
      if (this.autoLoad) {
        this.$.trainingApi.get({
          take: this.take,
          filterIds: [ this.filterId ]
        });
      }
    },
    /**
     * Resets the element to the first tab
     */
    reset: function () {
      this._selectedPage = 0;
    },
    /** Parses and formats the JSON array when hours has updated */
    _eventsChanged: function () {
      events = this.events;
      for (var i = 0; i < events.length; i++) {
        events[i].startDayWeek = moment(events[i].start).format("ddd");
        events[i].startDay = moment(events[i].start).format("D");
        events[i].startMonth = moment(events[i].start).format("MMM");
        events[i].startTime = moment(events[i].start).format("h:mma");
        events[i].link = 'https://careerhub.uq.edu.au/students/events/detail/' + events[i].entityId;
      }

      this._formattedEvents = events;
      this.fire('uqlibrary-training-loaded');
    },
    /**
     * Called when an event is clicked on the list page
     * @param e
     */
    _eventClicked: function (e) {
      this._selectedEvent = e.detail;
      this._switchToPage(1);
    },
    /**
     * Called when a user closes the details view
     */
    _showList: function () {
      this._switchToPage(0);
    },
    /**
     * Changes animation and changes page
     * @param requestedPage
     */
    _switchToPage: function (requestedPage) {
      if (requestedPage > this._selectedPage) {
        this._entryAnimation = 'slide-from-right-animation';
        this._exitAnimation = 'slide-left-animation';
      } else {
        this._entryAnimation = 'slide-from-left-animation';
        this._exitAnimation = 'slide-right-animation';
      }

      this._selectedPage = requestedPage;
    }
  });
})();
