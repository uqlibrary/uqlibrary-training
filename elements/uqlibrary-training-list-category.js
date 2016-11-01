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
      category: {
        type: Object
      }
    },

    filterEventsByKeyword: function(filterCriteria) {
      return function(trainingEvent) {
        if (!filterCriteria) {
          return true;
        }

        var filterCriteriaRegExp = new RegExp(filterCriteria, 'i');
        return trainingEvent.name.match(filterCriteriaRegExp) || trainingEvent.details.match(filterCriteriaRegExp);
      };
    },

    filterEvents: function(keyword, month, campus) {
      return function(trainingEvent) {

        // Convert the input keyword to a case-insensitive regular expression then test against event name and detail
        var keywordRegExp = new RegExp(keyword, 'i');

        return (!keyword || trainingEvent.name.match(keywordRegExp) || trainingEvent.details.match(keywordRegExp))
            && (!month || moment(trainingEvent.start).format("MMMM").toLowerCase().indexOf(month.toLowerCase()) >= 0)
            && (!campus || trainingEvent.categories.campus.join(',').toLowerCase().indexOf(campus.toLowerCase()) >= 0);
      };
    },

    _formatDate: function(date) {
      return moment(date).format("ddd D MMM YYYY");
    },

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
