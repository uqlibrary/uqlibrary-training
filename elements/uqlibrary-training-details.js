(function () {
  Polymer({
    is: 'uqlibrary-training-details',

    properties: {
      /**
       * event - object representing training event from CareerHub
       *
       * @type {Object}
       */
      event: {
        type: Object,
        observer: '_eventChanged'
      },

      /**
       * userAccount - object of currently logged in user
       *
       * @type {Object}
       */
      userAccount: {
          type: Object,
          value: function() {
            return {
              hasSession: false,
              id: ''
            };
          },
          observer: '_userAccountChanged'
        },

      registrationEmail: {
        type: String,
        value: 'training@library.uq.edu.au'
      },

      showRegistrationForNonUQ: {
        type: Boolean,
        value: true
      },

      showLoginButton: {
        type: Boolean,
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
      },

      _maplink: {
        type: String
      }
    },

    /**
     * Observer handler for event object
     */
    _eventChanged: function () {
      // Set inner HTML. Only way to do this with Polymer
      this.$.summary.innerHTML = this.event.summary.replace('\n', '<br />');

      if (this.showLoginButton)
        this.$.details.innerHTML = this.event.details.replace('\n', '<br />');

      this._startTime = moment(this.event.start).format("h:mma");
      this._endTime = moment(this.event.end).format("h:mma");
      this._fullDate = moment(this.event.start).format("dddd DD MMMM YYYY");

      this._bookingText = "Booking is not required";

      if (this.event.bookingSettings !== null) {
        this._bookingText = 'Places still available';

        if (this.event.bookingSettings.placesRemaining == 0) {
            this._bookingText = 'Class is full. Register for waitlist.';
          }
      }

      var mapUrl = this._findKnownLocationinVenue(this.event.venue);
      this._maplink = mapUrl !== false ? mapUrl : '';
      this._showMapLink = mapUrl !== false;
      this._hideMapLink = !this._showMapLink;
    },

    /**
     * determine which of the list of buildings the venue is in
     * @param venue String
     * @returns {boolean}
     * @private
     */
    _findKnownLocationinVenue: function(venue) {
        // locationHint: look for this string in the supplied venue
        // display: ask maps to display this as text for the location
        // latlong: latitude & longitude for the map url

        var listKnownLocations = [
            { "locationHint": "Biological Sciences Library", "display": "Biological%20Sciences%20Library%2C%20The%20University%20of%20Queensland%2C%20Slip%20Road%2C%20Saint%20Lucia%20QLD%2C%20Australia", "latlong": "-27.4969967,153.0113495", "zoom": 20, "query_place_id": "ChIJbaJ6sYNQkWsRYvptjIAIPRE" },
            { "locationHint": "Colin Clark B", "display": "Colin%20Clark%20Building%2C%20University%20Drive%2C%20Saint%20Lucia%20QLD%2C%20Australia", "latlong": "-27.4947559,153.0140859", "zoom": 20 },
            { "locationHint": "Duhig Tower", "display": "Duhig%20Tower%2C%20Sir%20William%20MacGregor%20Drive%2C%20Saint%20Lucia%20QLD%2C%20Australia", "latlong": "-27.4966319,153.0144148", "zoom": 20 },
            { "locationHint": "Duhig B", "display": "Duhig%20Tower%2C%20Sir%20William%20MacGregor%20Drive%2C%20Saint%20Lucia%20QLD%2C%20Australia", "latlong": "-27.4966319,153.0144148", "zoom": 20 },
            { "locationHint": "Forgan Smith B", "display": "Forgan%20Smith%20Building%2C%20Saint%20Lucia%20QLD%2C%20Australia", "latlong": "-27.496937,153.0128046", "zoom": 20 },
            { "locationHint": "Hawken B", "display": "Dorothy%20Hill%20Engineering%20and%20Sciences%20Library%2C%20Cooper%20Road%2C%20Saint%20Lucia%20QLD%2C%20Australia", "latlong": "-27.5000086,153.0132045", "zoom": 20 },
            { "locationHint": "Sir Llew Edwards B", "display": "Sir%20Llew%20Edwards%20Building%2C%20Saint%20Lucia%20QLD%2C%20Australia", "latlong": "-27.4957145,153.0132919", "zoom": 20 },
            { "locationHint": "Zelman Cowan B", "display": "Zelman%20Cowen%20Building%20%2851%23%29%20UQ%20St%20Lucia%20Campus%2C%20Saint%20Lucia%20QLD%2C%20Australia", "latlong": "-27.4990138,153.0144133", "zoom": 20 },
            { "locationHint": "Gatton Library", "display": "-27.5550314,152.3357461", "latlong": "-27.5550314,152.3357461", "zoom": 20 }, // UQ+Gatton+J.K.+Murray+Library
            { "locationHint": "Herston B", "display": "Herston%20Health%20Sciences%20Library%2C%20Herston%20Road%2C%20Brisbane%20City%20QLD%2C%20Australia", "latlong": "-27.4488643,153.0277196", "zoom": 20 },
            { "locationHint": "School of Public Health B", "display": "UQ%20School%20Of%20Public%20Health%2C%20Herston%20Road%2C%20Herston%20QLD%2C%20Australia", "latlong": "-27.4487423,153.0231839", "zoom": 20 },
            { "locationHint": "UQCCR Building", "display": "UQCCR%2C%20Building%20B71%2C%20Brisbane%20City%20QLD%2C%20Australia", "latlong": "-27.4487067,153.028542", "zoom": 20 },
            { "locationHint": "Aubigny Place B", "display": "Aubigny%20Place%20-%20Mater%20Hospital%20Brisbane%2C%20Annerley%20Road%2C%20South%20Brisbane%20QLD%2C%20Australia", "latlong": "-27.486558,153.027563", "zoom": 20, "placeID": 'ChIJ586ySG1akWsRwlxYji6m8kw' },
            { "locationHint": "PACE Health Sciences Library", "display": "PACE%20Health%20Sciences%20Library%2C%20Cornwall%20Street%2C%20Woolloongabba%20QLD%2C%20Australia", "latlong": "-27.4999636,153.0303293", "zoom": 19 },
            { "locationHint": "Bundaberg", "display": "UQ%20Health%20Sciences%20Learning%20%26%20Discovery%20Centre%2C%20Bundaberg%20West%20QLD%2C%20Australia", "latlong": "-24.8688817,152.3321844", "zoom": 18 },
            { "locationHint": "Hervey Bay", "display": "-25.298911,152.8212355", "latlong": "-25.298911,152.8212355", "zoom": 20 }, // UQ+Health+Sciences+Learning+%26+Discovery+Centre
            { "locationHint": "Rockhampton", "display": "The+University+of+Queensland,+Rural+Clinical+School,+Rockhampton", "latlong": "-23.3809301,150.496215", "zoom": 18 },
            { "locationHint": "Toowoomba", "display": "Toowoomba%20Rural%20Clinical%20School%2C%20152%20West%20Street%2C%20South%20Toowoomba%20QLD%2C%20Australia", "latlong": "-27.568576,151.9421979", "zoom": 20 }
        ];

        var url = false;
        for (var i = 0; i < listKnownLocations.length; i++) {
            var trainRegExp = new RegExp(listKnownLocations[i].locationHint, 'i');
            if (venue.match(trainRegExp)) {
              // after much experimentation, this format currently works on desktop AND ios AND android!
              // maps docs: https://developers.google.com/maps/documentation/urls/guide
              url = 'https://www.google.com/maps/search/?api=1&query=' + listKnownLocations[i].display;
              break;
            }
        }
        return url;
    },
    /**
    * Observer handler for userAccount object
    * */
    _userAccountChanged: function(newValue, oldValue) {
      this.showRegistrationForNonUQ = !this.userAccount || !this.userAccount.hasSession || (this.userAccount.id && this.userAccount.id.match(/^em/) !== null);
    },

    /**
     * Navigate to event's page in career hub
     */
    navigate: function () {
      this.$.ga.addEvent('navigate to studenthub');
      window.open(this.event.link);
    },

    /*
    * sendEmail - prepopulates email body with event details and user details (if available)
    *
    * */
    sendEmail: function(e) {
      this.$.ga.addEvent('submit EOI');

      var mailText = 'mailto:' + this.registrationEmail + '?';
      mailText += '&subject=Expression of interest for event';
      mailText += '&body=Hi, \nI\'d like to participate in the following training event: \n\n';
      mailText += 'Event Id: ' + this.event.entityId + '\n';
      mailText += 'Event Title: ' + this.event.name + '\n';
      mailText += 'Event Date: ' + this._fullDate + ' at ' + this._startTime + ' (' + this.event.start + ')' + '\n';
      mailText += 'Username: ' + (this.userAccount && this.userAccount.id ? this.userAccount.id : '') + '\n';
      mailText += 'Name: ' + (this.userAccount && this.userAccount.name ? this.userAccount.name : '') + '\n';
      mailText += 'Email: ' + (this.userAccount && this.userAccount.mail ? this.userAccount.mail : '') + '\n';
      mailText += '\n\nThank you' + ',\n' + (this.userAccount && this.userAccount.name ? this.userAccount.name : '');

      window.location = encodeURI(mailText);
    }
  });
})();
