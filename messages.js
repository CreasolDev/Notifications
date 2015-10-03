'use strict';

function Message(title, message, status) {
    this.id = Message.createID();
    this.title = title;
    this.message = message;
    this.status = Message.statusCheck(status);
    Message.addMessage(this);
}

Message.createID = function createID() {
    return (Message.holder.length > 0) ? Message.holder[Message.holder.length-1].id + 1 : 0;
};

Message.prototype.update = function update (title, message, status) {
    this.setMessage(title);
    this.setMessage(message);
    this.setStatus(Message.statusCheck(status));
};

Message.prototype.removeMe = function removeMe() {
    Message.remove(this);
};

Message.prototype.setMessage = function setMessage(message) {
    this.message = message;
    $(' #message' + this.getID() + ' > .message ').html(message);

};

Message.prototype.setTitle = function setTitle(title) {
    this.title = title;
    $(' #message' + this.getID() + ' > .messageTitle ').html(title);
};

Message.prototype.setStatus = function setStatus(status) {
    this.status = Message.statusCheck(status);

    if($(' #message' + this.getID() ).hasClass(this.status)){
        return;
    } else {
        $(' #message' + this.getID() ).removeClass('alert-info');
        $(' #message' + this.getID() ).removeClass('alert-warning');
        $(' #message' + this.getID() ).removeClass('alert-danger');
        $(' #message' + this.getID() ).removeClass('alert-success');
        $(' #message' + this.getID() ).addClass(this.status);
    }
};

Message.prototype.getMessage = function getMessage() {
    return this.message;
};

Message.prototype.getTitle = function getTitle() {
    return this.title;
};

Message.prototype.getStatus = function getStatus() {
    return this.status;
};

Message.prototype.getID = function getID() {
    return this.id;
};

Message.statusCheck = function statusCheck(status) {
    if(typeof status === 'string') {
        if( status.substr(0, 6) === 'alert-') return status;
        else return 'alert-' + status;
    }

    var errorStatusses = [400, 401, 402, 403, 404, 405, 406, 407, 408, 409, 410, 411, 413, 414, 415, 416, 417, 419, 420, 500, 501, 503, 504];
    for( var i = 0; i < errorStatusses.length; i++) {
        if(status === errorStatusses[i]) {
            return 'alert-danger';
        }
    }

    if(status-200 < 100 && status - 200 >= 0) {
        return 'alert-success';
    } else {
        return 'alert-info';
    }
};

Message.holder = [];

Message.remove = function(obj) {
    for(var i = 0; i < Message.holder.length; i++ ) {
        if(Message.holder[i] === obj) {
            Message.holder.splice(i, 1);
        }
    }

    console.log(Message.fadeOut);

    if(Message.fadeOut) {
        $(' #message' + obj.getID()).fadeOut(Message.fadeOutTime, function() {
            removeNReset();
        });
    } else {
        removeNReset();
    }
    Message.updateMessageAmount();

    function removeNReset() {
        $(' #message' + obj.getID()).remove();
        if(Message.holder.length === 0) Message.reset();
    }

};

Message.reset = function resetMessages() {
    Message.holder.length = 0;
    $(' #messages ').empty();
    (Message.fadeOut) ? $(' #messagesMain ').fadeOut() : $(' #messagesMain ').hide();
};

Message.addMessage = function(mess) {
    if(Message.holder.length === 0) {
        console.log("showing...");
        $(' #messagesMain ').show();
    }

    Message.holder.push(mess);

    $(' #messages ').append('<div id="message' + mess.getID() + '" class="alert ' + mess.getStatus() + '">' +
        '<button type="button" class="close"><span>&times;</span></button>' +
        '<strong class="messageTitle">' + mess.getTitle() + '</strong><br><span class="message">' + mess.getMessage() + '</span>' +
        '</div>');

    Message.updateMessageAmount();

    $(' #message' + mess.getID() + ' > button ').click(mess, function(event) {
        Message.remove(event.data);
    });
}

Message.updateMessageAmount = function() {
    $(' #messageAmount ').html( Message.holder.length );
};

$(' #messageAdd ').click(function() {
    var message = new Message("Test", "Test login message", 200);

    if(Message.holder.length > 1) {
        Message.holder[0].setStatus(404);
    }
});

Message.init = function init(options) {
    Message.setStandards();

    if(options) {
        for(var prop in options) {
            if(options.hasOwnProperty(prop)){
                Message.options[prop] = options[prop];
            }
        }
    }

    $(' body ').append('<div id="messageMaster" ><div id="messagesMain" class="alert alert-info"><button id="messagesCloseAll" type="button" class="close">&times;</button><span style="font-weight:bold;">Alle <span id="messageAmount"></span> berichten verwijderen</span></div><div id="messages"></div></div>');

    $(' #messageMaster ').css({
        'position' : 'fixed',
        'width' : '300px',
        'top' : '10px',
        'right' : '10px',
        'z-index' : '9999'
    });
    Message.reset();

    $(' #messagesCloseAll ').click(function() {
        Message.reset();
    });
};

Message.setStandards = function() {
    Message.options = {
        fadeOut : true,
        fadeOutTime : 100
    };
};