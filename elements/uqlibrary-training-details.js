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

      //TODO: pass user account from parent
      userAccount: {
        type: Object,
        value: function() {
          return { hasSession: true };
        }
      },

      showLoginButton: {
        type: Object,
        value: false
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

        if (this.event.bookingSettings.placesRemaining == 0) {
            this._bookingText = 'Class is full. Register for waitlist.';
          }
      }
    },
    /**
     * Open event
     */
    _openEvent: function () {
      this.$.ga.addEvent('Library Training link clicked', this.event.name);
      window.open(this.event.link);
    },

    sendEmail: function(e) {

      var trainingEvent = this.event;

      if (this.userAccount && this.userAccount.hasSession) {
        //user is logged in, create email template
        var mailText = 'mailto:training_events@library.uq.edu.au?';
        mailText += '&subject=Expression of interest for event';
        mailText += '&body=Hi, \nI\'d like to participate in the following training event: \n\n';
        mailText += 'Event Id: ' + trainingEvent.entityId + '\n';
        mailText += 'Event Title: ' + trainingEvent.name + '\n';
        mailText += 'Event Date: ' + this._fullDate + ' at ' + this._startTime + ' (' + trainingEvent.start + ')' + '\n';
        mailText += 'Username: ' + this.userAccount.id + '\n';
        mailText += 'Name: ' + this.userAccount.name + '\n';
        mailText += 'Email: ' + this.userAccount.mail + '\n';
        mailText += '\n\nThank you' + ',\n' + this.userAccount.name;

        window.location = encodeURI(mailText);

      } else {
        //user is not logged in, redirect to login page
        var href = window.location.href;
        if (href.indexOf('?') > 0)
          href = href.substr(0, href.indexOf('?'));
        this.$.accountApi.login(href + '?eventId=' + trainingEvent.entityId + '#' + trainingEvent.entityId);
      }

    }
  });
})();