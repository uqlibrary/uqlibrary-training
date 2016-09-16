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
       * Holds the Google Analytics app name of this component
       */
      gaAppName: {
        type: String,
        value: 'Training'
      },
      /**
      * Holds current user account details
      * */
      userAccount: {
        type: Object,
        value: function() {
          return {
            hasSession: false
          };
        }
      },
      /**
       * List of all formatted events
       */
      _formattedEvents: {
        type: Array,
        notify: true
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

    },
    /**
     * Resets the element to the first tab
     */
    reset: function () {
      this._selectedPage = 0;
    },

    /**
     * Parses and formats the JSON array when hours has updated
     * */
    _eventsChanged: function () {
      var events = this.events;
      for (var i = 0; i < events.length; i++) {
        events[i].startDayWeek = moment(events[i].start).format("ddd");
        events[i].startDay = moment(events[i].start).format("D");
        events[i].startMonth = moment(events[i].start).format("MMM");
        events[i].startTime = moment(events[i].start).format("h:mma");
        events[i].link = 'https://careerhub.uq.edu.au/students/events/detail/' + events[i].entityId;
      }

      this._formattedEvents = events;
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
