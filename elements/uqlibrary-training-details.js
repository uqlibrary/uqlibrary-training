(function () {
  Polymer({
    is: 'uqlibrary-training-details',
    properties: {
      /**
       * Training event object
       */
      event: {
        type: Object,
        observer: '_eventChanged'
      },
      gaAppName: {
        type: String
      },
      _startTime: {
        type: String
      },
      _endTime: {
        type: String
      },
      _fullDate: {
        type: String
      },
      _bookingText: {
        type: String
      }
    },
    /**
     * Called when the event object changes
     */
    _eventChanged: function () {
      // Set inner HTML. Only way to do this with Polymer
      this.$.details.innerHTML = this.event.summary.replace('\n', '<br />');

      this._startTime = moment(this.event.start).format("h:mma");
      this._endTime = moment(this.event.end).format("h:mma");
      this._fullDate = moment(this.event.start).format("dddd DD MMMM YYYY");

      this._bookingText = "Booking is not required";

      if (this.event.bookingSettings !== null) {
        this._bookingText = 'Places sill available';

        console.log(this.event.bookingSettings.bookingLimit);
        console.log(this.event.attendance.total);

        if (this.event.bookingSettings.placesRemaining == 0) {
            this._bookingText = 'Class is full. Register for waitlist.';
          }
      }
    },
    /**
     * Called when the user presses the close/back button
     */
    _showListView: function () {
      this.fire('show-list');
    },
    /**
     * Open event
     */
    _openEvent: function () {
      this.$.ga.addEvent('Library Training link clicked', this.event.name);
      window.open(this.event.link);
    }
  });
})();