(function () {
  Polymer({
    is: 'uqlibrary-training-list',
    properties: {
      events: {
        type: Array,
        observer: "_eventsChanged"
      },
      gaAppName: {
        type: String
      }
    },

    _eventsChanged: function () {
      var events = this.events;
      for (var i = 0; i < events.length; i++) {
        events[i].startDayWeek = moment(events[i].start).format("ddd");
        events[i].startDay = moment(events[i].start).format("D");
        events[i].startMonth = moment(events[i].start).format("MMM");
        events[i].startTime = moment(events[i].start).format("h:mma");
      }

      this._formattedEvents = events;
    },

    /**
     * Called when a link is clicked
     * @param e
     * @private
     */
    _linkClicked: function (e) {
      this.$.ga.addEvent('show event details');
      this.fire('event-clicked', e.model.item);
    },

    /**
     * Called when a backup link is clicked
     * @param e
     * @private
     */
    _backupLinkClicked: function (e) {
      var item = e.model.item || e.model.sub;
      if (item && item.link !== '') {
        this.$.ga.addEvent('navigate to backup link');
        window.location = item.link;
      }
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
