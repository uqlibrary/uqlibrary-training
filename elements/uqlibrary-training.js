(function () {
  Polymer({

    is: 'uqlibrary-training',

    properties: {

      compactView: {
        type: Object,
        value: false
      },

      /**
       * List of all events (raw)
       */
      events: {
        type: Array,
        observer: "_eventsChanged"
      },

      filterCriteria: {
        type: Object,
        value: function () {
          return {
            keyword: '',
            month: '',
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
        value: 107
      },

      /**
      * Specifies url of event in CareerHub/StudentHub
       * @type {String}
      * */
      parentUrl: {
        type: String,
        value: 'https://careerhub.uq.edu.au/students/events/detail/'
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
       * Specifies list of event months, auto populated from api
       * @type {Array}
       */
      monthList : {
        type: Array
      }

    },

    ready: function () {
      var self = this;

      // Fetch hours
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
      this.events = event.detail;
    },

    /**
     * Observer handler for events array
     * @private
     */
    _eventsChanged: function() {
      this._processData(this.events);
    },

    /**
     * Processes raw data from events, extracts months/campuses/categories(labels)
     * @private
     */
    _processData: function (events) {

      var processedEvents = [];
      var categories = [];
      var campuses = [];
      var months = [];

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
            event.link = this.parentUrl + event.entityId;;

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

        //setup all event months
        var monthName = moment(event.start).format('MMMM');
        if (months.indexOf(monthName) < 0) {
          months.push(monthName);
        }
      }

      this._trainingEventsByCategory = processedEvents;
      this.campusList = campuses;
      this.monthList = months;
    },

    /**
     * Called when an event is clicked on the list page
     * @param e
     */
    _eventClicked: function (e) {
    }
  });
})();
