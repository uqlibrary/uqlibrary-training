(function () {
  Polymer({
    is: 'uqlibrary-training-list-category',
    properties: {
      gaAppName: {
        type: String
      },
      filterCriteria: {
        type: Object
      },
      hideCategoryTitle: {
        type: Object,
        value: false
      },
      numDisplayed: {
        type: Number,
        value: 0
      },
      numProcessed: {
        type: Number,
        value: 0
      },
      numDisplayedRequired: {
        type: Number,
        observer: '_showMoreLess'
      },
      showMoreButton: {
        type: Boolean,
        value: false
      },
      showLessButton: {
        type: Boolean,
        value: false
      },
      numRecordsAll: {
        type: Number,
        value: 999 // 999 is > than the possible number of records, so will show all
      },
      numRecordsMinimum: {
        type: Number,
        value: 5
      }
    },

    ready: function() {
      this.numDisplayedRequired = this.numRecordsMinimum;
    },

    // when they click the more or less
    _showMoreLess: function() {
        this.$.categoriesList.render();
    },

    filterEvents: function(category, keyword, week, campus) {
      var that = this;
      return function(trainingEvent) {
        if (typeof(category.firstEventId) !== undefined && trainingEvent.entityId === category.firstEventId) {
              that.numDisplayed = 0;
              that.numProcessed = 0; // check if looping is complete by comparing to length of category.events
        }

        // Convert the input keyword to a case-insensitive regular expression then test against event name and detail
        var keywordRegExp = new RegExp(keyword, 'i');
        var filterPasses = (!keyword || trainingEvent.name.match(keywordRegExp) || trainingEvent.details.match(keywordRegExp))
            && (!week || (moment(trainingEvent.start) >= moment(week.startData) && moment(trainingEvent.start) <= moment(week.endData)))
            && (!campus || trainingEvent.categories.campus.join(',').toLowerCase().indexOf(campus.toLowerCase()) >= 0);

        if (filterPasses) {
          that.numDisplayed++;
        }
        that.numProcessed++;  // find out how far through the total set we are

        that._hideBothButtons();
        if (that.numDisplayed < that.numDisplayedRequired && that.numDisplayedRequired !== that.numRecordsAll) {
          // skip

        } else if (that.numDisplayedRequired === that.numRecordsAll && that.numDisplayed > that.numRecordsMinimum) {
          that._showButton_Less();

        } else if (that.numDisplayed > that.numDisplayedRequired && that.numProcessed <= category.events.length) {
          that._showButton_More();
        }

        return that.numDisplayed <= that.numDisplayedRequired && filterPasses;
      };
    },

    _hideBothButtons: function() {
      this.showLessButton = false;
      this.showMoreButton = false;
    },

    _showButton_More: function() {
      this.showLessButton = false;
      this.showMoreButton = true;
    },

    _showButton_Less: function() {
      this.showMoreButton = false;
      this.showLessButton = true;
    },

    /**
     * Called when the 'show more' events is clicked for a category
     * @private
     */
    showMoreEntries: function () {
        this.$.ga.addEvent("filter", 'show more');

        this.numDisplayed = 0;

        this.set('numDisplayedRequired', this.numRecordsAll);

        this._showButton_Less();

        this.numDisplayed = 0;
    },

    /**
     * Called when the 'show less' events is clicked for a category
     * @param e
     * @private
     */
    showLessEntries: function (e) {
        this.$.ga.addEvent("filter", 'show less');

        this.numDisplayed = 0;

        this.set('numDisplayedRequired', this.numRecordsMinimum);
        this._showButton_More();

        this.numDisplayed = 0; // so when the filters are used it is already 0
    },

    _formatDate: function(date) {
      return moment(date).format("D MMM");
    },

    _getCategoryTitle: function(title, hideTitle){
      if(hideTitle) {
        return '';
      } else {
        return title;
      }
    },

      /**
       * open or close the event detail panel
       * @param event
       */
    toggle: function(event) {
      var toggleId = 'collapse' + event.model.trainingEvent.entityId;
      var paperItemId = 'item' + event.model.trainingEvent.entityId;

      //close all other toggles
      var openedItems = this.querySelectorAll('.iron-collapse-opened');
      for(var index = 0; index < openedItems.length; index++) {
        var item = openedItems[index];
        var currentPaperItemId = 'item' + item.getAttribute('data-id');

        //do not toggle current item
        if (item.id.indexOf(toggleId) < 0) {
          item.toggle();
          this.querySelector('#' + currentPaperItemId + ' .up').toggleClass('hidden');
          this.querySelector('#' + currentPaperItemId + ' .down').toggleClass('hidden');
        }
      }

      this.querySelector('#' + toggleId).toggle();

      if (this.querySelector('#' + toggleId).opened) {
        this.$.ga.addEvent('view event');
      }

      this.querySelector('#' + paperItemId + ' .up').toggleClass('hidden');
      this.querySelector('#' + paperItemId + ' .down').toggleClass('hidden');
    }

  });
})();
