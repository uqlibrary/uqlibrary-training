(function () {
  Polymer({
    is: 'uqlibrary-training-compact',
    properties: {
      /**
       * List of all events (raw)
       */
      events: {
        type: Array
      },

      compactView: {
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
      this.fire('show-list');
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
