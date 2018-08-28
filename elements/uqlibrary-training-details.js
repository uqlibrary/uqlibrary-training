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
     * from https://medium.com/@colinlord/opening-native-map-apps-from-the-mobile-browser-afd66fbbb8a4
     * @returns {boolean}
     */
    isOperatingSystemIOS: function () {
      return (navigator.platform.indexOf("iPhone") !== -1) ||
              (navigator.platform.indexOf("iPad") !== -1) ||
              (navigator.platform.indexOf("iPod") !== -1);
    },

      /**
       * determine which of the list of buildings the venue is in
       * the fragment is used to build a map link
       * @param venue String
       * @returns {boolean}
       * @private
       */
    _findKnownLocationinVenue: function(venue) {
        // locationHint: look for this string in the supplied venue
        // fragment: ask maps to display this as text for the location
        // latlong: latitude & longitude for the map url
        var listKnownLocations = [
            { "locationHint": "Biological Sciences Library", "fragment": "/Biological+Sciences+Library/", "latlong": "-27.4969854,153.0111289" },
            { "locationHint": "Colin Clark B", "fragment": "/Colin+Clark+Building", "latlong": "-27.4947559,153.0135628" },
            { "locationHint": "Duhig Tower", "fragment": "/Duhig+Tower", "latlong": "-27.4966135,153.0140748" },
            { "locationHint": "Duhig B", "fragment": "/Duhig+Tower", "latlong": "-27.4966135,153.0140748" },
            { "locationHint": "Forgan Smith B", "fragment": "/Forgan+Smith+Building,+St+Lucia+QLD+4072", "latlong": "-27.496937,153.0128046" },
            { "locationHint": "Hawken B", "fragment": "/Dorothy+Hill+Engineering+and+Sciences+Library", "latlong": "-27.5000086,153.0132045" },
            { "locationHint": "Sir Llew Edwards B", "fragment": "/Sir+Llew+Edwards+Building", "latlong": "-27.4957145,153.0132919" },
            { "locationHint": "Zelman Cowan B", "fragment": "/Zelman+Cowen+Building,+St+Lucia+QLD+4067", "latlong": "-27.4990138,153.0144133" },
            { "locationHint": "Gatton Library", "fragment": "/UQ+Gatton+J.K.+Murray+Library", "latlong": "-27.5550302,152.3355262" },
            { "locationHint": "Herston B", "fragment": "/Herston+Health+Sciences+Library", "latlong": "-27.448831,153.0271885" },
            { "locationHint": "School of Public Health B", "fragment": "/Herston+Health+Sciences+Library", "latlong": "-27.4487572,153.0229345" },
            { "locationHint": "UQCCR Building", "fragment": "/UQCCR", "latlong": "-27.4486758,153.028019" },
            { "locationHint": "Aubigny Place B", "fragment": "/Aubigny+Place+-+Mater+Hospital+Brisbane", "latlong": "-27.4865039,153.0271426" },
            { "locationHint": "PACE Health Sciences Library", "fragment": "/UQ+School+Of+Public+Health", "latlong": "-27.4999636,153.0284143" },
            { "locationHint": "Bundaberg", "fragment": "/UQ+Health+Sciences+Learning+%26+Discovery+Centre", "latlong": "-24.870152,152.332057" },
            { "locationHint": "Hervey Bay", "fragment": "/UQ+Health+Sciences+Learning+%26+Discovery+Centre", "latlong": "-25.298911,152.8212355" },
            { "locationHint": "Rockhampton", "fragment": "/The+University+of+Queensland,+Rural+Clinical+School,+Rockhampton", "latlong": "-23.3810434,150.4938467" },
            { "locationHint": "Toowoomba", "fragment": "/School's+Teaching+and+Learning+Centre+South+Toowoomba", "latlong": "-27.5683715,151.9417366" }
        ];
        var url = false;
        for (var i = 0; i < listKnownLocations.length; i++) {
            var trainRegExp = new RegExp(listKnownLocations[i].locationHint, 'i');
            if (venue.match(trainRegExp)) {
              /* if we're on iOS, reconfigure url so it will work when it redirects to an app */
              url = this.isOperatingSystemIOS()
                            ? 'maps://maps.google.com/maps?daddr=' + listKnownLocations[i].latlong + '&ll='
                            : 'https://www.google.com.au/maps/place' + listKnownLocations[i].fragment + '@' + listKnownLocations[i].latlong + '&amp;ll=';
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
