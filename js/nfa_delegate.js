var nfa_delegate = (function() {
  var self = null;
  var nfa = null;
  var container = null;
  var emptyLabel = '[empty]';
  
  var statusConnectors = [];

  var makeStatusBox = function(status) {
    var doneSpan = $('<span class="consumedInput"></span>').html(status.input.substring(0, status.inputIndex));
    var curSpan = $('<span class="currentInput"></span>').html(status.input.substr(status.inputIndex, 1));
    var futureSpan = $('<span class="futureInput"></span>').html(status.input.substring(status.inputIndex+1));
    
    var statusBox = $('<div></div>', {'class':'fsmStatus'});
    $('<div></div>').append(doneSpan).append(curSpan).append(futureSpan).appendTo(statusBox);
    return statusBox;
  };

  var updateStatusUI = function(origStatusBox, curState) {
    var statusBox = origStatusBox.clone().appendTo(container);
    statusBox.css('left', curState.position().left + 4 + 'px')
      .css('top', curState.position().top - statusBox.outerHeight() - 3 + 'px');
      
    if (statusBox.position().top < 0) { // Flip to bottom
      statusBox.css('top', curState.position().top + curState.outerHeight() + 3 + 'px');
    }
    var overscan = statusBox.position().left + statusBox.outerWidth() + 4 - container.innerWidth();
    if (overscan > 0) { // Push inward
      statusBox.css('left', statusBox.position().left - overscan + 'px');
    }
  };
  
  var updateUIForDebug = function() {
    var status = nfa.status();
    var statusBox = makeStatusBox(status);
    
    $('.current').removeClass('current');
    $.each(statusConnectors, function(index, connection) {
      connection.setPaintStyle(jsPlumb.Defaults.PaintStyle);
    });
    $('.fsmStatus').remove();
    
    if (status.status === 'Active') {
      $.each(status.states, function(index, state) {
        var curState = $('#' + state).addClass('current');
        jsPlumb.select({source:state}).each(function(connection) {
          if (connection.getLabel() === status.nextChar) {
            statusConnectors.push(connection);
            connection.setPaintStyle({strokeStyle:'#0a0'});
          }
        });
        updateStatusUI(statusBox, curState);
      });
    }
    return self;
  };

  return {
    init: function() {
      self = this;
      nfa = new NFA();
      return self;
    },
    
    setContainer: function(newContainer) {
      container = newContainer;
      return self;
    },
    
    fsm: function() {
      return nfa;
    },
    
    connectionAdded: function(info) {
      // TODO: Better UI
      var inputChar = prompt('Read what input character on transition?', 'A');
      inputChar = (inputChar && inputChar.length > 0) ? inputChar[0] : inputChar;
      if (inputChar === null || nfa.hasTransition(info.sourceId, inputChar, info.targetId)) {
        jsPlumb.detach(info.connection);
        if (inputChar) {
          alert(info.sourceId + " already has a transition for " + inputChar);
        }
        return;
      } 
      info.connection.setLabel(inputChar || emptyLabel);
      nfa.addTransition(info.sourceId, inputChar, info.targetId);
    },
    
    updateUI: updateUIForDebug,
    
    reset: function() {
      nfa = new NFA();
      return self;
    },
    
    debugStart: function() {
      return self;
    },
    
    debugStop: function() {
      $('.current').removeClass('current');
      $('.fsmStatus').remove();
      return self;
    },
    
    serialize: function() {
      // Convert dfa into common serialized format
      var model = {};
      model.type = 'NFA';
      model.nfa = nfa.serialize();
      model.states = {};
      model.transitions = [];
      $.each(model.nfa.transitions, function(stateA, transition) {
        model.states[stateA] = {};
        $.each(transition, function(character, states) {
          $.each(states, function(index, stateB) {
            model.states[stateB] = {};
            model.transitions.push({stateA:stateA, label:(character || emptyLabel), stateB:stateB});
          });
        });
      });
      $.each(model.nfa.acceptStates, function(index, state) {
        model.states[state].isAccept = true;
      });
      return model;
    },
    
    deserialize: function(model) {
      nfa.deserialize(model.nfa);
    }
  };
}()).init();
