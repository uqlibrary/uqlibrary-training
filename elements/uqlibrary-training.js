(function () {
  Polymer({

    is: 'uqlibrary-training',

    properties: {

      compactView: {
        type: Object,
        value: false
      },

      /**
       * Parameter to hide the filter
       * @type {Boolean}
       */
      hideFilter: {
        type: Object,
        value: false
      },
      /**
       * Parameter to hide the unwanted category titles
       * @type {Boolean}
       */
      hideCategoryTitle: {
        type: Object,
        value: false
      },


      /**
       * List of all events (raw)
       */
      events: {
        type: Array,
        observer: "_eventsChangedMain"
      },

      filterCriteria: {
        type: Object,
        value: function () {
          return {
            keyword: '',
            week: '',
            campus: ''
          };
        }
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
       * Google Analytics app name of this component
       * @type {String}
       */
      gaAppName: {
        type: String,
        value: 'Training'
      },

      /**
       * Value of filter to extract data from career hub
       * @type {Number}
       */
      eventFilterId: {
        type: Number,
        value: 104
      },

      /**
      * Specifies url of event in CareerHub/StudentHub
       * @type {String}
      * */
      parentUrl: {
        type: String,
        value: 'https://studenthub.uq.edu.au/students/events/detail/'
      },

      /**
       * Specifies number of items to fetch
       * @type {Number}
       */
      maxEventCount: {
        type: Number,
        value: 5
      },

      userAccount: {
        type: Object,
        value: function() {
          return {
            hasSession: false
          };
        }
      },

      _trainingEventsByCategory: {
        type: Array
      },

      /**
       * Specifies list of campuses, auto populated from api
       * @type {Array}
       */
      campusList: {
        type: Array
      },

      /**
       * Specifies list of event week, auto populated from api
       * @type {Array}
       */
      weekList : {
        type: Array
      },

      errorsFound: {
          type: Boolean,
          value: false
      }
    },

    ready: function () {

      if (this.autoLoad) {
        this.$.accountApi.get();

        var eventsFilterParameters = {};
        if (this.maxEventCount > 0) {
          eventsFilterParameters.take = this.maxEventCount;
        }

        if (this.eventFilterId > 0) {
          eventsFilterParameters.filterIds = [ this.eventFilterId ];
        }

        this.$.trainingApi.get(eventsFilterParameters);
      }

    },

    /*
    * Event handler for user account api call
    * @private
    * */
    _accountLoaded: function(response) {
      if (response.detail.hasSession !== null && response.detail.hasSession) {
        this.userAccount = response.detail;
      } else {
        this.userAccount = {
          hasSession: false
        };
      }
    },

    /**
     * Event handler for training api call
     * @private
     */
    _trainingDataLoaded: function(event) {
        if (Object.prototype.toString.call( event.detail ) !== '[object Array]') {
            this.events = [];
            this.errorsFound = true;
        } else {
            this.events = event.detail;
            this.errorsFound = false;
        }
    },

    /**
     * Observer handler for events array
     */
    _eventsChangedMain: function() {
      this._processData(this.events);
    },

    /**
     * Processes raw data from events, extracts weeks/campuses/categories(labels)
     * @private
     */
    _processData: function (events) {

      var processedEvents = [];
      var categories = [];
      var campuses = [];
      var weeks = [];

      var startOfWeek;
      var endOfWeek;
      var weekLabel;
      var weekData;
      var found;

      for(var eventIndex = 0; eventIndex < events.length; eventIndex++){
        var event = events[eventIndex];

        //if event doesn't have a category, put it into category 'Other'
        if (!event.labels) {
          event.labels = [{ id: '0', name: 'Other'}];
        }

        //set up all categories
        if (event.labels) {
          for(var labelIndex = 0; labelIndex < event.labels.length; labelIndex++) {
            var category = event.labels[labelIndex];

            var catIndex = categories.indexOf(category.id);

            if (catIndex < 0) {
              category.events = [];
              category.displayName = category.name.replace(/.*\./ , '');
              category.firstEventId = event.entityId;
              processedEvents.push(category);

              categories.push(category.id);
              catIndex = categories.length - 1;
            }

            if (!category.events) {
              category = processedEvents[catIndex];
            }

            //create display string for start date
            var startDate = new Date(event.start);
            event.formattedDate = moment(event.start).format('ddd D MMM YYYY');
            event.link = this.parentUrl + event.entityId;

            //add this event to the category
            category.events.push(event);
          }
        }

        //setup all campuses
        if (event.categories && event.categories.campus) {
          for(var index=0; index < event.categories.campus.length; index++) {
            var campus = event.categories.campus[index];
            if (campuses.indexOf(campus) < 0) {
              campuses.push(campus);
            }
          }
        }

        //setup all event weeks
        startOfWeek = moment(event.start).startOf('week');
        endOfWeek = moment(event.start).endOf('week');
        weekLabel = startOfWeek.format('MMM D') + ' - ' + endOfWeek.format('MMM D') + ' ';
        weekData = {
          "label": weekLabel,
          "startData": startOfWeek.format('YYYY-MM-DD'),
          "endData": endOfWeek.format('YYYY-MM-DD')
        };

        found = false;
        for (var ii = 0; ii < weeks.length; ii++) {
          if (weeks[ii].label === weekLabel) {
            found = true;
            break;
          }
        }
        if (!found) {
            weeks.push(weekData);
        }
      }

      // sort the events by section name to give constancy of section ordering
      if (processedEvents) {
          processedEvents.sort(function (a, b) {
              return a.displayName > b.displayName;
          });
      }

      for(var ii=0; ii < processedEvents.length; ii++) {
          processedEvents[ii].numRecordsCategory = processedEvents[ii].events.length;
      }

      this._trainingEventsByCategory = processedEvents;
      this.campusList = campuses;
      this.weekList = weeks;
    },

    /**
     * Called when an event is clicked on the list page
     * @param e
     */
    _eventClicked: function (e) {
    }
  });
})();
